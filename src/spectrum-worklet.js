/** Additive DSP, one phase-preserving sine oscillator per energy channel. */
class CHerakoiBank extends AudioWorkletProcessor {
  constructor() {
    super();this.sin=new Float64Array(0);
    this.cos=new Float64Array(0);this.sinStep=new Float64Array(0);this.cosStep=new Float64Array(0);
    this.target=new Float32Array(0);this.gain=new Float32Array(0);this.frameCounter=0;
    this.port.onmessage=({data})=>{
      if(data.type==='configure'){
        const frequencies=data.frequencies;
        const n=frequencies.length;
        this.sin=new Float64Array(n);this.cos=new Float64Array(n).fill(1);
        this.sinStep=new Float64Array(n);this.cosStep=new Float64Array(n);
        this.target=new Float32Array(n);this.gain=new Float32Array(n);
        for(let i=0;i<n;i++){
          const angle=2*Math.PI*frequencies[i]/sampleRate;
          this.sinStep[i]=Math.sin(angle);this.cosStep[i]=Math.cos(angle);
        }
      } else if(data.type==='amplitudes' && data.amplitudes.length===this.target.length){
        this.target.set(data.amplitudes);
      }
    };
  }
  process(_inputs,outputs){
    const channels=outputs[0];if(!channels?.length)return true;
    const out=channels[0];const n=this.gain.length;
    const smoothing=1-Math.exp(-1/(0.012*sampleRate));
    for(let s=0;s<out.length;s++){
      let sum=0;
      for(let i=0;i<n;i++){
        const target=this.target[i];
        let gain=this.gain[i];
        if(target===0 && gain<1e-6){this.gain[i]=0;continue;}
        gain+=(target-gain)*smoothing;this.gain[i]=gain;
        const sin=this.sin[i],cos=this.cos[i];
        sum+=gain*sin;
        this.sin[i]=sin*this.cosStep[i]+cos*this.sinStep[i];
        this.cos[i]=cos*this.cosStep[i]-sin*this.sinStep[i];
      }
      // A safety limiter for dense spectra.
      out[s]=Math.tanh(sum*1.6);
    }
    for(let c=1;c<channels.length;c++)channels[c].set(out);
    // Keep oscillator phase vectors normalized against floating-point drift.
    if(++this.frameCounter%16===0)for(let i=0;i<n;i++){
      const scale=Math.hypot(this.sin[i],this.cos[i]);
      if(scale>0){this.sin[i]/=scale;this.cos[i]/=scale;}
    }
    return true;
  }
}
registerProcessor('cherakoi-bank',CHerakoiBank);
