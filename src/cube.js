/** XRF data conventions: [row, col, channel], C-major pixel spectra, nonnegative counts. */
export function validateCube(shape, data, energy = null) {
  if (!Array.isArray(shape) || shape.length !== 3 || shape.some(n => !Number.isSafeInteger(n) || n < 1)) throw new Error('img must be 3-D (H, W, C) with positive dimensions');
  const [h, w, c] = shape;
  if (h * w * c !== data.length) throw new Error('img shape does not match its flattened data');
  if (energy && (energy.length !== c || Array.from(energy).some(n => !Number.isFinite(n)))) throw new Error('energy must contain exactly C finite values');
  if (energy && energy.length > 1 && Array.from(energy).some((e,i) => i > 0 && e <= energy[i-1])) throw new Error('energy axis must increase strictly; descending/repeated energy is unsupported');
  // Reject invalid counts before they can reach audio; sampled, then scanned during rebin.
  return { height:h, width:w, channels:c, data, energy };
}

/**
 * Sum-rebin across channels, with fractional overlap if C is not divisible by target.
 * This conserves each pixel's total counts (within float rounding). No spatial resampling.
 * Never upsample: a cube with C<target retains C, avoiding fictional fine energy resolution.
 */
export function rebinCube(cube, target = 512) {
  if (!Number.isSafeInteger(target) || target < 1) throw new Error('Invalid rebin target');
  const {height:h, width:w, channels:c, data, energy} = cube;
  const outC = Math.min(c, target);
  const result = new Float32Array(h*w*outC);
  const oldPositions = new Float64Array(outC);
  for (let j=0; j<outC; j++) oldPositions[j] = (j+.5)*c/outC-.5;
  for (let p=0; p<h*w; p++) {
    const oldBase=p*c, newBase=p*outC;
    for (let i=0; i<c; i++) {
      const count = data[oldBase+i];
      if (!Number.isFinite(count) || count < 0) throw new Error(`Invalid XRF count at flat index ${oldBase+i}`);
      const start=i*outC/c, end=(i+1)*outC/c;
      for (let j=Math.floor(start); j<Math.ceil(end); j++) {
        if (j<0 || j>=outC) continue;
        result[newBase+j] += count * Math.max(0,Math.min(end,j+1)-Math.max(start,j)) * c/outC;
      }
    }
  }
  let rebinnedEnergy = null;
  if (energy) {
    rebinnedEnergy = new Float64Array(outC);
    for (let j=0; j<outC; j++) {
      const idx = oldPositions[j], lo=Math.max(0,Math.floor(idx)), hi=Math.min(c-1,lo+1);
      rebinnedEnergy[j] = energy[lo]+(energy[hi]-energy[lo])*Math.max(0,idx-lo);
    }
  }
  return {height:h,width:w,channels:outC,data:result,energy:rebinnedEnergy,sourceChannels:c};
}

export function getSpectrum(cube, x, y) {
  if (!cube || x<0 || x>=cube.width || y<0 || y>=cube.height) return null;
  return cube.data.subarray((y*cube.width+x)*cube.channels,(y*cube.width+x+1)*cube.channels);
}

export function sumMap(cube) {
  const total=new Float64Array(cube.height*cube.width);
  for(let p=0;p<total.length;p++) for(let c=0;c<cube.channels;c++) total[p]+=cube.data[p*cube.channels+c];
  return total;
}

/** Per-pixel integral over [bin-halfWidth, bin+halfWidth] (clamped). For the
 * grayscale-on-bin view: moving the selected bin changes the image. */
export function windowMap(cube, bin, halfWidth) {
  const {height, width, channels, data} = cube;
  const lo=Math.max(0,bin-halfWidth), hi=Math.min(channels-1,bin+halfWidth);
  const out=new Float64Array(height*width);
  for(let p=0;p<out.length;p++){const base=p*channels;let s=0;for(let k=lo;k<=hi;k++)s+=data[base+k];out[p]=s;}
  return out;
}

export function binFrequency(bin, channels, minHz, maxHz, energy=null) {
  let fraction = channels === 1 ? 0 : bin/(channels-1);
  if (energy && channels > 1 && energy[channels-1] !== energy[0]) fraction=(energy[bin]-energy[0])/(energy[channels-1]-energy[0]);
  return minHz*Math.pow(maxHz/minHz,Math.max(0,Math.min(1,fraction)));
}

export function chooseAmplitudes(counts, {threshold=2, maxVoices=32, selectedBin=null, volume=0.25, peakWindow=null}) {
  const amplitudes=new Float32Array(counts.length);
  if (selectedBin !== null) {
    // Mono: the user picked the bin, so it sounds whenever the pixel has any
    // count there (no threshold gate: sparse real data is mostly 0/1 counts and
    // a threshold made the hand feel permanently mute). Gain floor 0.12 keeps a
    // weak selection audible; the sqrt ratio keeps peak shape in the volume.
    let voice=selectedBin;
    if (peakWindow) { // optional: sonify the local max within +/-peakWindow channels
      const lo=Math.max(0,selectedBin-peakWindow), hi=Math.min(counts.length-1,selectedBin+peakWindow);
      for(let k=lo;k<=hi;k++) if(counts[k]>counts[voice]) voice=k;
    }
    const selected=counts[voice] || 0;
    const peak=Math.max(...counts);
    if (selected > 0 && peak > 0) amplitudes[voice]=volume*Math.max(0.12,Math.sqrt(selected/peak));
    return amplitudes;
  }
  const candidates=[];
  for(let i=0;i<counts.length;i++) if(counts[i]>threshold) candidates.push([i,Math.sqrt(counts[i]-threshold)]);
  candidates.sort((a,b)=>b[1]-a[1]);
  const chosen=candidates.slice(0,maxVoices);
  const sum=chosen.reduce((s,[,a])=>s+a,0);
  if(sum>0) for(const [i,a] of chosen) amplitudes[i]=volume*a/sum;
  return amplitudes;
}

/** A small synthetic fixture lets the UI be explored without experimental data. */
export function createDemoCube() {
  const [h,w,c]=[60,96,128];
  const data=new Float32Array(h*w*c);
  for(let y=0;y<h;y++) for(let x=0;x<w;x++) {
    const r=Math.hypot((x-48)/33,(y-30)/25);
    const feature=Math.exp(-Math.pow((r-.57)*7,2));
    const peaks=[16+Math.round(10*x/w),39+Math.round(8*y/h),79];
    for(let k=0;k<c;k++) {
      let count=1+3*feature;
      for(const [i,peak] of peaks.entries()) count+=([40,22,32][i])*(0.18+feature)*Math.exp(-Math.pow((k-peak)/3,2));
      data[(y*w+x)*c+k]=count;
    }
  }
  return {height:h,width:w,channels:c,data,energy:null,sourceChannels:c};
}
