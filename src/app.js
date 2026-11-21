import {createDemoCube,getSpectrum,sumMap,chooseAmplitudes} from './cube.js';
import {readXrfFile} from './io.js';
import {SpectralAudio} from './audio.js';
import {HandTracker} from './hands.js';

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

function loadCube(nextCube,name){
  audio.silence();cube=nextCube;hands={left:null,right:null};currentPixel=null;
  heatmap=document.createElement('canvas');heatmap.width=cube.width;heatmap.height=cube.height;
  const pix=heatmap.getContext('2d').createImageData(cube.width,cube.height);
  const sums=sumMap(cube);
  let maxCount=0;for(const n of cube.data)maxCount=Math.max(maxCount,n);
  const thresholdMax=Math.max(100,Math.ceil(maxCount));
  el('threshold').max=thresholdMax;el('threshold').step=Math.max(1,Math.ceil(thresholdMax/500));
  if(+el('threshold').value>thresholdMax)el('threshold').value=thresholdMax;
  el('threshold-value').textContent=el('threshold').value;
  let max=0;for(const n of sums)max=Math.max(max,n);
  const scale=Math.log1p(max)||1;
  for(let i=0;i<sums.length;i++){
    const t=Math.log1p(sums[i])/scale;
    const v=Math.round(255*Math.pow(t,1.2));
    pix.data.set([Math.round(v*.79),Math.round(v*.93),v,255],i*4);
  }
  heatmap.getContext('2d').putImageData(pix,0,0);
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
function leftBin(point){return point?Math.max(0,Math.min(cube.channels-1,Math.floor((1-point.y)*cube.channels))):null;}

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
    tracker=new HandTracker(el('webcam'),updateHands);
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
el('mouse-mode').addEventListener('change',()=>{
  if(el('mouse-mode').checked&&tracker){tracker.stop();tracker=null;el('camera-stop').disabled=true;el('camera-start').disabled=false;}
  updateHands({right:null,left:null});
  if(el('mouse-mode').checked)message('Mouse test: sposta il cursore sulla mappa; tieni premuto Shift per simulare la sinistra.');
});
map.addEventListener('pointermove',event=>{
  if(!el('mouse-mode').checked||!cube)return;
  const rect=map.getBoundingClientRect();
  const point={x:(event.clientX-rect.left)/rect.width,y:(event.clientY-rect.top)/rect.height};
  updateHands({right:point,left:event.shiftKey?point:null});
});
map.addEventListener('pointerleave',()=>{if(el('mouse-mode').checked)updateHands({right:null,left:null});});
window.addEventListener('blur',()=>{if(el('mouse-mode').checked)updateHands({right:null,left:null});});
window.addEventListener('pagehide',()=>{audio.silence();tracker?.stop();});
render();
