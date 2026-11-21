import {parseNpy} from './npy.js';
import {validateCube, rebinCube} from './cube.js';

const MAX_UNCOMPRESSED_IMG_BYTES = 400 * 1024 * 1024;

export async function readXrfFile(file) {
  const name = file.name.toLowerCase();
  let input;
  if (name.endsWith('.npz')) input = await readNpz(file);
  else if (name.endsWith('.h5') || name.endsWith('.hdf5')) input = await readHdf5(file);
  else throw new Error('Supported file extensions: .npz, .h5, .hdf5');
  return rebinCube(validateCube(input.shape, input.data, input.energy), 512);
}

async function readNpz(file) {
  // Load only on request: no JavaScript package manager or server is required.
  const {unzipSync} = await import('https://cdn.jsdelivr.net/npm/fflate@0.8.2/esm/browser.js');
  const archive = unzipSync(new Uint8Array(await file.arrayBuffer()));
  const imageKey = Object.keys(archive).find(k=>k==='img.npy');
  if (!imageKey) throw new Error('NPZ missing required key img.npy');
  if (archive[imageKey].byteLength > MAX_UNCOMPRESSED_IMG_BYTES) throw new Error('img exceeds 400 MiB limit for this browser prototype');
  const img = parseNpy(archive[imageKey]);
  if (img.shape.length !== 3) throw new Error('img.npy must have shape (H,W,C)');
  const eKey = Object.keys(archive).find(k=>k==='energy.npy');
  let energy = null;
  if (eKey) {
    const e = parseNpy(archive[eKey]);
    if (e.shape.length !== 1) throw new Error('energy must be 1-D');
    energy=e.data;
  }
  return {shape:img.shape, data:img.data, energy};
}

async function readHdf5(file) {
  const h5wasmModule = await import('https://cdn.jsdelivr.net/npm/h5wasm@0.10.3/dist/esm/hdf5_hl.js');
  const h5wasm = h5wasmModule.default;
  const {FS} = await h5wasm.ready;
  // Name is fixed and internal: no user-controlled VFS paths or server-side file writes.
  const path = '/cherakoi-upload.h5';
  FS.writeFile(path, new Uint8Array(await file.arrayBuffer()));
  let handle;
  try {
    handle = new h5wasm.File(path,'r');
    if (!handle.keys().includes('img')) throw new Error('HDF5 missing required dataset /img');
    const img = handle.get('img');
    const shape = img.shape;
    if (!Array.isArray(shape) || shape.length !== 3) throw new Error('HDF5 /img must be (H,W,C)');
    const estimated = shape.reduce((a,b)=>a*b,1)*8;
    if (estimated > MAX_UNCOMPRESSED_IMG_BYTES*2) throw new Error('HDF5 /img would require too much browser memory');
    const data = img.value;
    let energy = null;
    if (handle.keys().includes('energy')) energy = handle.get('energy').value;
    if (!ArrayBuffer.isView(data)) throw new Error('HDF5 /img must be a numeric array');
    return {shape, data, energy};
  } finally {
    handle?.close();
    FS.unlink(path);
  }
}
