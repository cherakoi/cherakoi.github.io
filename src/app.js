import {createDemoCube,getSpectrum,sumMap,chooseAmplitudes} from './cube.js';
import {readXrfFile} from './io.js';
import {SpectralAudio} from './audio.js';
import {HandTracker,drawHandSkeleton} from './hands.js';

const el=id=>document.getElementById(id);
const map=el('map'),ctx=map.getContext('2d');
const spectrum=el('spectrum'),specCtx=spectrum.getContext('2d');
const audio=new SpectralAudio();
let cube=null,heatmap=null,fit=null,tracker=null,hands={left:null,right:null};
let currentPixel=null,audioReady=false;

function message(text,isError=false) {el('message').textContent=text;el('message').classList.toggle('error',isError);}
function options() {return {threshold:+el('threshold').value,maxVoices:+el('voices').value,volume:+el('volume').value/100};}
function frequencyRange(){return [+el('freq-min').value,+el('freq-max').value];}
function showMetadata(name) {
  const {width,height,channels,sourceChannels,energy}=cube;
  el('file-name').textContent=name;
  el('shape').textContent=`${height} × ${width} × ${sourceChannels} → ${channels}`;
  el('map-meta').textContent=`${width}×${height} pixels / ${channels} bins`;
  el('calibration').textContent=energy?`${energy[0].toFixed(3)} – ${energy.at(-1).toFixed(3)} keV`:'ADC bins · non calibrato';
  el('voices').max=channels;
  if (+el('voices').value>channels)el('voices').value=channels;
  el('voices-value').textContent=el('voices').value;
}

// 256-entry colormap LUTs. terreic and grey are exact; viridis and inferno are
// linear interpolations of the classic matplotlib stop sets (visually
// equivalent, not the exact 256-entry tables).
function lutFromStops(stops){
  const lut=new Uint8Array(768),n=stops.length;
  for(let i=0;i<256;i++){const t=i/255*(n-1),k=Math.min(n-2,t|0),f=t-k;
    for(let c=0;c<3;c++)lut[i*3+c]=Math.round(stops[k][c]+(stops[k+1][c]-stops[k][c])*f);}
  return lut;
}
const COLORMAPS={
  terreic:(()=>{const lut=new Uint8Array(768);for(let v=0;v<256;v++){lut[v*3]=Math.round(v*.79);lut[v*3+1]=Math.round(v*.93);lut[v*3+2]=v;}return lut;})(),
  grey:(()=>{const lut=new Uint8Array(768);for(let v=0;v<256;v++)lut.fill(v,v*3,v*3+3);return lut;})(),
  viridis:lutFromStops([[68,1,84],[72,40,120],[62,74,137],[49,104,142],[38,130,142],[33,145,140],[53,183,121],[110,206,88],[181,222,43],[253,231,37]]),
  inferno:lutFromStops([[0,0,4],[66,10,104],[147,38,103],[221,81,58],[252,253,191]])
};
let mapSums=null,mapScale=1;
function buildHeatmap(name){
  if(!mapSums)return;
  const lut=COLORMAPS[name]||COLORMAPS.terreic;
  const pix=heatmap.getContext('2d').createImageData(heatmap.width,heatmap.height);
  for(let i=0;i<mapSums.length;i++){
    const u=Math.min(255,Math.round(255*Math.pow(Math.log1p(mapSums[i])/mapScale,1.2)));
    pix.data[i*4]=lut[u*3];pix.data[i*4+1]=lut[u*3+1];pix.data[i*4+2]=lut[u*3+2];pix.data[i*4+3]=255;
  }
  heatmap.getContext('2d').putImageData(pix,0,0);
}
function loadCube(nextCube,name){
  audio.silence();cube=nextCube;hands={left:null,right:null};currentPixel=null;
  heatmap=document.createElement('canvas');heatmap.width=cube.width;heatmap.height=cube.height;
  const sums=sumMap(cube);
  mapSums=sums;
  let maxCount=0;for(const n of cube.data)maxCount=Math.max(maxCount,n);
  const thresholdMax=Math.max(100,Math.ceil(maxCount));
  el('threshold').max=thresholdMax;el('threshold').step=Math.max(1,Math.ceil(thresholdMax/500));
  if(+el('threshold').value>thresholdMax)el('threshold').value=thresholdMax;
  el('threshold-value').textContent=el('threshold').value;
  let max=0;for(const n of sums)max=Math.max(max,n);
  mapScale=Math.log1p(max)||1;
  buildHeatmap(el('colormap').value);
  showMetadata(name);
  el('camera-start').disabled=false;el('audio-start').disabled=false;
  if(audioReady)audio.configure(cube,...frequencyRange());
  render();
  message(`${name} caricato. Controlli pronti: avvia audio e camera, oppure prova il mouse.`);
}

function imageFit() {
  if(!cube)return null;
  // Preserve square pixels and letterboxing: never sample from the canvas RGB.
  const k=Math.min((map.width-56)/cube.width,(map.height-40)/cube.height);
  const w=k*cube.width,h=k*cube.height;
  return {x:(map.width-w)/2,y:(map.height-h)/2,w,h};
}
function pixelAt(displayPoint) {
  if(!displayPoint||!fit||!cube)return null;
  const px=displayPoint.x*map.width,py=displayPoint.y*map.height;
  if(px<fit.x||px>=fit.x+fit.w||py<fit.y||py>=fit.y+fit.h)return null;
  return {x:Math.floor((px-fit.x)/fit.w*cube.width),y:Math.floor((py-fit.y)/fit.h*cube.height)};
}
function leftBin(point){
  if(!point)return null;
  // Frequency axis spans the (letterboxed) data image, not the full canvas:
  // top of image = highest bin, bottom = bin 0. Outside clamps to the ends.
  const py=point.y*map.height;
  const t=fit?Math.max(0,Math.min(1,(py-fit.y)/fit.h)):1-point.y;
  return Math.max(0,Math.min(cube.channels-1,Math.floor((1-t)*cube.channels)));
}

function drawMarker(point,color,label) {
  if(!point)return;
  const x=point.x*map.width,y=point.y*map.height;
  if(x<0||x>map.width||y<0||y>map.height)return;
  ctx.strokeStyle=color;ctx.lineWidth=2;ctx.beginPath();ctx.arc(x,y,12,0,Math.PI*2);ctx.stroke();
  ctx.beginPath();ctx.moveTo(x-18,y);ctx.lineTo(x+18,y);ctx.moveTo(x,y-18);ctx.lineTo(x,y+18);ctx.stroke();
  ctx.font='bold 13px sans-serif';ctx.fillStyle=color;ctx.fillText(label,x+18,y-14);
}
function renderMap() {
  ctx.fillStyle='#101820';ctx.fillRect(0,0,map.width,map.height);
  if(!cube){
    ctx.strokeStyle='#284252';ctx.lineWidth=1;
    for(let x=40;x<map.width;x+=40){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,map.height);ctx.stroke();}
    for(let y=40;y<map.height;y+=40){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(map.width,y);ctx.stroke();}
    ctx.font='19px sans-serif';ctx.fillStyle='#7495a5';ctx.textAlign='center';ctx.fillText('Load an XRF cube to begin',map.width/2,map.height/2);ctx.textAlign='start';return;
  }
  fit=imageFit();
  ctx.imageSmoothingEnabled=false;
  ctx.drawImage(heatmap,fit.x,fit.y,fit.w,fit.h);
  ctx.strokeStyle='#7bb1c4';ctx.lineWidth=1;ctx.strokeRect(fit.x,fit.y,fit.w,fit.h);
  if(hands.left){
    const y=hands.left.y*map.height;
    ctx.strokeStyle='#e4aa76a0';ctx.setLineDash([5,7]);ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(map.width,y);ctx.stroke();ctx.setLineDash([]);
  }
  if(hands.skeleton){
    drawHandSkeleton(ctx,hands.skeleton.right,{width:map.width,height:map.height},'#71d7ed');
    drawHandSkeleton(ctx,hands.skeleton.left,{width:map.width,height:map.height},'#e4aa76');
  }
  drawMarker(hands.right,'#71d7ed','R');drawMarker(hands.left,'#e4aa76','L');
}
function renderSpectrum(counts,selectedBin) {
  const w=spectrum.width,h=spectrum.height;
  specCtx.fillStyle='#1d2731';specCtx.fillRect(0,0,w,h);
  const left=36,top=12,plotW=w-58,plotH=h-43;
  specCtx.strokeStyle='#354958';specCtx.lineWidth=1;
  for(let i=0;i<5;i++) {let y=top+plotH*i/4;specCtx.beginPath();specCtx.moveTo(left,y);specCtx.lineTo(left+plotW,y);specCtx.stroke();}
  if(!counts)return;
  let max=1;for(const c of counts)max=Math.max(max,c);
  const bw=plotW/counts.length;
  const threshold=+el('threshold').value;
  for(let i=0;i<counts.length;i++){
    const intensity=Math.log1p(counts[i])/Math.log1p(max);
    const height=plotH*intensity;
    specCtx.fillStyle=i===selectedBin?'#edb883':counts[i]>threshold?'#4196b4':'#395463';
    specCtx.fillRect(left+i*bw,top+plotH-height,Math.max(.65,bw-.45),height);
  }
  if(selectedBin!==null){
    const x=left+(selectedBin+.5)*bw;
    specCtx.strokeStyle='#f5ba8d';specCtx.lineWidth=2;specCtx.beginPath();specCtx.moveTo(x,top);specCtx.lineTo(x,top+plotH);specCtx.stroke();
  }
  specCtx.fillStyle='#8faab8';specCtx.font='12px sans-serif';
  specCtx.fillText(cube.energy?`${cube.energy[0].toFixed(2)} keV`:'ADC 0',left,h-10);
  const last=cube.energy?`${cube.energy.at(-1).toFixed(2)} keV`:`ADC ${cube.channels-1}`;
  specCtx.textAlign='right';specCtx.fillText(last,w-18,h-10);specCtx.textAlign='left';
}
function render() {
  renderMap();
  if(!cube){renderSpectrum(null,null);return;}
  currentPixel=pixelAt(hands.right);
  const counts=currentPixel?getSpectrum(cube,currentPixel.x,currentPixel.y):null;
  const selectedBin=counts?leftBin(hands.left):null;
  renderSpectrum(counts,selectedBin);
  const mode=!counts?'silenzio':selectedBin===null?'polifonia':'singolo bin';
  if(audioReady)audio.play(counts?chooseAmplitudes(counts,{...options(),selectedBin}):new Float32Array(cube.channels));
  el('coord').textContent=currentPixel?`Pixel: x ${currentPixel.x}, y ${currentPixel.y}`:'Pixel: —';
  el('hand-status').textContent=`Mani: destra ${hands.right?'ON':'OFF'} · sinistra ${hands.left?'ON':'OFF'}`;
  el('sonification-status').textContent=`Audio: ${audioReady?mode:'disattivato'}`;
  el('spectrum-meta').textContent=selectedBin===null?`${cube.channels} bins`:`Bin ${selectedBin} · ${counts[selectedBin].toFixed(1)} conteggi`;
}
function updateHands(next){hands=next;render();}
const overlay=el('hands-overlay');
function drawOverlaySkeleton(){
  if(!overlay.clientWidth||!overlay.clientHeight)return;
  overlay.width=overlay.clientWidth;overlay.height=overlay.clientHeight;
  const video=el('webcam');
  const vw=video.videoWidth||640,vh=video.videoHeight||480;
  const s=Math.min(overlay.width/vw,overlay.height/vh);
  const w=vw*s,h=vh*s,ox=(overlay.width-w)/2,oy=(overlay.height-h)/2;
  const octx=overlay.getContext('2d');
  octx.save();octx.translate(ox,oy);
  if(hands.skeleton){
    drawHandSkeleton(octx,hands.skeleton.right,{width:w,height:h},'#71d7ed');
    drawHandSkeleton(octx,hands.skeleton.left,{width:w,height:h},'#e4aa76');
  }
  octx.restore();
}

el('demo').addEventListener('click',()=>loadCube(createDemoCube(),'Demo sintetica (60×96×128)'));
el('file').addEventListener('change',async event=>{
  const file=event.target.files?.[0];if(!file)return;
  message(`Lettura locale di ${file.name}…`);
  try{const next=await readXrfFile(file);loadCube(next,file.name);}catch(error){message(`Impossibile caricare: ${error.message}`,true);}
  event.target.value='';
});
el('camera-start').addEventListener('click',async()=>{
  if(!cube)return;
  el('camera-start').disabled=true;
  message('Inizializzazione MediaPipe e richiesta accesso camera…');
  try {
    if(el('mouse-mode').checked){el('mouse-mode').checked=false;updateHands({left:null,right:null});}
    tracker=new HandTracker(el('webcam'),next=>{updateHands(next);drawOverlaySkeleton();});
    await tracker.start();
    el('camera-stop').disabled=false;
    message('Camera attiva: indice destro sul pixel, indice sinistro per isolare una frequenza.');
  }catch(error){tracker?.stop();tracker=null;el('camera-start').disabled=false;message(`Camera: ${error.message}`,true);}
});
el('camera-stop').addEventListener('click',()=>{
  tracker?.stop();tracker=null;
  el('camera-start').disabled=!cube;el('camera-stop').disabled=true;message('Camera disattivata.');
});
el('audio-start').addEventListener('click',async()=>{
  try {await audio.start();audio.configure(cube,...frequencyRange());audioReady=true;el('audio-start').disabled=true;el('audio-stop').disabled=false;render();message('Audio attivo: il suono parte solo quando il puntatore destro è sulla mappa.');}
  catch(error){message(`Web Audio: ${error.message}`,true);}
});
el('audio-stop').addEventListener('click',async()=>{
  await audio.stop();audioReady=false;el('audio-start').disabled=!cube;el('audio-stop').disabled=true;render();message('Audio silenziato.');
});
for(const id of ['threshold','voices','volume'])el(id).addEventListener('input',()=>{
  el(id+'-value').textContent=id==='volume'?el(id).value+'%':el(id).value;render();
});
for(const id of ['freq-min','freq-max'])el(id).addEventListener('change',()=>{
  if(!audioReady||!cube)return;
  try{audio.configure(cube,...frequencyRange());render();}catch(error){message(error.message,true);}
});
el('colormap').addEventListener('change',()=>{buildHeatmap(el('colormap').value);render();});
// Mouse test: cursor = right index; Shift = left hand at cursor; Shift+wheel
// moves the virtual left hand vertically (mono); releasing Shift returns to polyphony.
let mouseRight=null,shiftDown=false,wheelLeftY=null;
function applyMouseHands(){
  const left=(shiftDown&&mouseRight)?{x:mouseRight.x,y:wheelLeftY===null?mouseRight.y:wheelLeftY}:null;
  updateHands({right:mouseRight,left});
}
el('mouse-mode').addEventListener('change',()=>{
  if(el('mouse-mode').checked&&tracker){tracker.stop();tracker=null;el('camera-stop').disabled=true;el('camera-start').disabled=false;}
  mouseRight=null;shiftDown=false;wheelLeftY=null;
  updateHands({right:null,left:null});
  if(el('mouse-mode').checked)message('Mouse test: cursore = mano destra; Shift o frecce ↑/↓ = mano sinistra (rotella o frecce = su/giù); Shift rilasciato = polifonia.');
});
map.addEventListener('pointermove',event=>{
  if(!el('mouse-mode').checked||!cube)return;
  const rect=map.getBoundingClientRect();
  mouseRight={x:(event.clientX-rect.left)/rect.width,y:(event.clientY-rect.top)/rect.height};
  if(event.shiftKey!==shiftDown)shiftDown=event.shiftKey;
  applyMouseHands();
});
map.addEventListener('pointerleave',()=>{if(el('mouse-mode').checked){mouseRight=null;applyMouseHands();}});
map.addEventListener('wheel',event=>{
  if(!el('mouse-mode').checked||!shiftDown||!mouseRight)return;
  event.preventDefault();
  const dy=event.deltaY*(event.deltaMode===1?33:event.deltaMode===2?map.height:1);
  // step in bin space (not canvas): 1 wheel notch (~100px) = 10 bins even when
  // the data image is letterboxed in the taller canvas.
  const per=fit?fit.h/(cube.channels*map.height):1/(cube.channels*map.height);
  wheelLeftY=Math.max(0,Math.min(1,(wheelLeftY===null?mouseRight.y:wheelLeftY)-dy*0.1*per));
  applyMouseHands();
},{passive:false});
window.addEventListener('keydown',event=>{
  if(event.key!=='ArrowUp'&&event.key!=='ArrowDown')return;
  if(!el('mouse-mode').checked||!cube||!mouseRight)return;
  event.preventDefault();
  shiftDown=true; // arrows engage the virtual left hand like Shift does
  const per=fit?fit.h/(cube.channels*map.height):1/(cube.channels*map.height);
  wheelLeftY=Math.max(0,Math.min(1,(wheelLeftY===null?mouseRight.y:wheelLeftY)+(event.key==='ArrowUp'?-per:per)));
  applyMouseHands();
});
window.addEventListener('keydown',event=>{if(event.key==='Shift'&&!shiftDown){shiftDown=true;if(el('mouse-mode').checked)applyMouseHands();}});
window.addEventListener('keyup',event=>{if(event.key==='Shift'){shiftDown=false;wheelLeftY=null;if(el('mouse-mode').checked)applyMouseHands();}});
window.addEventListener('blur',()=>{if(el('mouse-mode').checked){shiftDown=false;mouseRight=null;applyMouseHands();}});
window.addEventListener('pagehide',()=>{audio.silence();tracker?.stop();});
render();
