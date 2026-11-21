import {binFrequency} from './cube.js';

/** One AudioWorklet with a shared oscillator bank (avoids hundreds of AudioNodes). */
export class SpectralAudio {
  constructor() {this.context=null;this.node=null;this.frequencies=null;}
  async start() {
    if(this.context) {await this.context.resume();return;}
    const context = new AudioContext({latencyHint:'interactive'});
    try {
      await context.audioWorklet.addModule('/src/spectrum-worklet.js');
      const node=new AudioWorkletNode(context,'cherakoi-bank',{outputChannelCount:[2]});
      node.connect(context.destination);
      this.context=context;this.node=node;
      await context.resume();
    } catch(error) {await context.close();throw error;}
  }
  configure(cube,minHz,maxHz) {
    if(!cube||!this.node)return;
    if(!Number.isFinite(minHz)||!Number.isFinite(maxHz)||minHz<20||maxHz<=minHz||maxHz>10000)throw new Error('Hz range invalid: choose 20 <= min < max <= 10000');
    const frequencies=Float32Array.from({length:cube.channels},(_,i)=>binFrequency(i,cube.channels,minHz,maxHz,cube.energy));
    this.frequencies=frequencies;
    this.node.port.postMessage({type:'configure',frequencies});
  }
  play(amplitudes) {if(this.node)this.node.port.postMessage({type:'amplitudes',amplitudes});}
  silence() {if(this.node&&this.frequencies)this.play(new Float32Array(this.frequencies.length));}
  async stop() {this.silence();if(this.context)await this.context.suspend();}
  async dispose() {if(this.node)this.node.disconnect();if(this.context)await this.context.close();this.context=null;this.node=null;this.frequencies=null;}
}
