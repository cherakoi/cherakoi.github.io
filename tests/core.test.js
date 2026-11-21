import test from 'node:test';
import assert from 'node:assert/strict';
import {parseNpy} from '../src/npy.js';
import {validateCube,rebinCube,getSpectrum,sumMap,binFrequency,chooseAmplitudes,createDemoCube} from '../src/cube.js';
import {extractHands,drawHandSkeleton} from '../src/hands.js';

function fakeNpy(shape, values, descr='<f4') {
  const shapeStr=`(${shape.join(', ')}${shape.length===1?',':''})`;
  const raw=`{'descr': '${descr}', 'fortran_order': False, 'shape': ${shapeStr}, }`;
  const header=raw+' '.repeat((16-(10+raw.length+1)%16)%16)+'\n';
  const n=new Uint8Array(10+header.length+values.length*4),view=new DataView(n.buffer);
  n.set([0x93,78,85,77,80,89,1,0]);view.setUint16(8,header.length,true);
  n.set(new TextEncoder().encode(header),10);
  values.forEach((v,i)=>view.setFloat32(10+header.length+i*4,v,true));
  return n;
}

test('NPY parser accepts C-ordered numeric arrays',()=>{
  const a=parseNpy(fakeNpy([1,2,3],[1,2,3,4,5,6]));
  assert.deepEqual(a.shape,[1,2,3]);assert.deepEqual(Array.from(a.data),[1,2,3,4,5,6]);
});
test('NPY parser rejects pickle/object and truncation',()=>{
  const n=fakeNpy([2],[1,2]);
  assert.throws(()=>parseNpy(n.subarray(0,-1)),/Truncated/);
  const bad=fakeNpy([2],[1,2]);
  const source=new TextDecoder().decode(bad.subarray(10,45));
  assert.ok(source.includes('descr'));
  // Object type is not on the supported dtype allowlist.
  bad.set(new TextEncoder().encode('|O4'),bad.indexOf(60));
  assert.throws(()=>parseNpy(bad),/Unsupported|Incomplete/);
});
test('sum rebin 1024 -> 512, preserves totals and XRF bin pair sums',()=>{
  const data=Float64Array.from({length:1024},(_,i)=>i+1);
  const raw=validateCube([1,1,1024],data);
  const cube=rebinCube(raw,512);
  assert.equal(cube.channels,512);
  assert.equal(cube.data[0],3);assert.equal(cube.data[511],2047);
  assert.ok(Math.abs(sumMap(cube)[0] - 524800) < 0.001);
});
test('generic 5->3 rebin conserves total and avoids negative values',()=>{
  const cube=rebinCube(validateCube([1,1,5],Float64Array.from([1,2,3,4,5])),3);
  assert.equal(cube.channels,3);
  assert.ok(Math.abs(sumMap(cube)[0]-15)<1e-5);
  assert.ok(cube.data.every(v=>v>=0));
});
test('C smaller than 512 stays C; no fabricated spectral resolution',()=>{
  const cube=rebinCube(validateCube([1,2,2],Float32Array.of(1,2,3,4)),512);
  assert.equal(cube.channels,2);
  assert.deepEqual(Array.from(getSpectrum(cube,1,0)),[3,4]);
});
test('invalid XRF cubes are rejected, not silently sanitized',()=>{
  assert.throws(()=>validateCube([1,2],new Float32Array(2)),/3-D/);
  assert.throws(()=>validateCube([1,1,2],new Float32Array(1)),/shape/);
  assert.throws(()=>rebinCube(validateCube([1,1,2],Float32Array.of(0,-1)),512),/Invalid XRF/);
});
test('frequency mapping increases with channel and respects calibrated energies',()=>{
  assert.equal(binFrequency(0,3,110,1760),110);
  assert.equal(binFrequency(2,3,110,1760),1760);
  assert.ok(Math.abs(binFrequency(1,3,110,1760,Float64Array.of(0,1,4))-220)<1e-9);
});
test('right offscreen silence handled by UI; mono selects exact bin; threshold mutes',()=>{
  const counts=Float32Array.of(2,100,30,60);
  const mono=chooseAmplitudes(counts,{threshold:3,maxVoices:4,selectedBin:2,volume:.5});
  assert.ok(mono[2]>.0);assert.equal(mono[1],0);
  assert.ok(chooseAmplitudes(counts,{threshold:31,selectedBin:2,volume:.5}).every(n=>n===0));
});
test('poly mode bounds voice count and keeps gain <= volume',()=>{
  const a=chooseAmplitudes(Float32Array.of(10,20,40,30),{threshold:5,maxVoices:2,volume:.25});
  assert.equal(a.filter(n=>n>0).length,2);
  assert.ok(Math.abs(a.reduce((x,y)=>x+y,0)-.25)<1e-6);
});
test('MediaPipe labels map 1:1 to app right/left (live webcam verified); x mirrored once',()=>{
  // Live user test 2026-11-21 showed the M2 photo-based swap produced inverted
  // right/left, so labels now pass through unchanged. x is still mirrored once
  // (raw frame is unmirrored, the on-screen preview and map are mirrored).
  const mk=(x,y)=>[...Array(8).fill({}),{x,y}];
  const r=extractHands({landmarks:[mk(.1,.25),mk(.8,.75)],handednesses:[[{categoryName:'Right'}],[{categoryName:'Left'}]]});
  assert.deepEqual(r.right,{x:.9,y:.25});
  assert.ok(Math.abs(r.left.x-.2)<1e-9 && r.left.y===.75);
  assert.equal(r.skeleton.right.length,9);
  assert.equal(r.skeleton.left.length,9);
  const none=extractHands({landmarks:[mk(1.2,.5)],handednesses:[[{categoryName:'Right'}]]});
  assert.equal(none.right,null);
  assert.equal(none.skeleton.right,null);
  assert.equal(extractHands(null).right,null);
});
test('drawHandSkeleton strokes 21 bones, 21 joints and a larger index tip',()=>{
  const makeCtx=()=>{
    const ops=[];
    return {ops,ctx:{save(){},restore(){},beginPath(){},stroke(){},fill(){},
      moveTo(x,y){ops.push(['m',x]);},lineTo(x,y){ops.push(['l',x]);},arc(x){ops.push(['a',x]);},
      set lineWidth(v){},set strokeStyle(v){},set fillStyle(v){},set globalAlpha(v){}}};
  };
  const lm=Array.from({length:21},(_,i)=>({x:.04*i,y:.04*i}));
  const t1=makeCtx();
  drawHandSkeleton(t1.ctx,lm,{width:100,height:100},'#fff');
  assert.equal(t1.ops.filter(o=>o[0]==='m').length,21);
  assert.equal(t1.ops.filter(o=>o[0]==='l').length,21);
  assert.equal(t1.ops.filter(o=>o[0]==='a').length,22);
  // mirror=true flips x: landmark 0 at x=0 lands at size.width
  assert.equal(t1.ops.find(o=>o[0]==='m')[1],100);
  const t2=makeCtx();
  drawHandSkeleton(t2.ctx,lm,{width:100,height:100},'#fff',false);
  assert.equal(t2.ops.find(o=>o[0]==='m')[1],0);
  const t3=makeCtx();
  drawHandSkeleton(t3.ctx,null,{width:100,height:100},'#fff');
  drawHandSkeleton(t3.ctx,lm.slice(0,5),{width:100,height:100},'#fff');
  assert.equal(t3.ops.length,0);
});
test('demo is actual shaped XRF cube',()=>{
  const cube=createDemoCube();assert.equal(cube.data.length,cube.width*cube.height*cube.channels);
  assert.ok(sumMap(cube).every(x=>x>0));
});
