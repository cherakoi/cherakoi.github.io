import {parseNpy} from './npy.js';
import {validateCube, rebinCube} from './cube.js';
import {decodeOME} from './ome.js';
import {decodeFITS} from './fits.js';

const MAX_UNCOMPRESSED_IMG_BYTES = 400 * 1024 * 1024;

export async function readXrfFile(file) {
  const bytes = new Uint8Array(await file.arrayBuffer());
  const input = await sniffAndDecode(bytes);
  const estimated = input.shape.reduce((a, b) => a * b, 1) * (input.data.BYTES_PER_ELEMENT || 4);
  if (estimated > MAX_UNCOMPRESSED_IMG_BYTES) throw new Error('Cubo oltre il limite di memoria del browser (400 MiB)');
  const cube = rebinCube(validateCube(input.shape, input.data, input.energy), 512);
  if (input.mask) cube.mask = input.mask; // H×W uint8, invariant under channel rebin
  if (input.meta) cube.meta = input.meta;
  return cube;
}

// Dispatch on content (magic bytes), not on the extension: renamed files still work,
// and a .h5 that is actually FITS is decoded as FITS.
async function sniffAndDecode(bytes) {
  if (startsWith(bytes, 'SIMPLE') || startsWith(bytes, 'XTENSION')) return await decodeFITS(bytes);
  if (isTiff(bytes)) return await decodeOME(bytes);
  if (startsWith(bytes, 'PK\x03\x04')) return readNpz(bytes);
  if (startsWith(bytes, '\x89HDF')) return readHdf5(bytes);
  throw new Error('Formato non riconosciuto. Supportati: .npz, .h5/.hdf5, .ome.tif/.ome.tiff, .fits/.fit/.fts (riconosciuti per contenuto)');
}

function startsWith(bytes, s) {
  for (let i = 0; i < s.length; i++) if (bytes[i] !== s.charCodeAt(i)) return false;
  return true;
}

// Classic TIFF (II/MM + 42) and BigTIFF (II/MM + 43) magic.
function isTiff(b) {
  const little = b[0] === 0x49 && b[1] === 0x49;
  const big = b[0] === 0x4D && b[1] === 0x4D;
  return little ? (b[2] === 42 || b[2] === 43) && b[3] === 0
    : big ? b[2] === 0 && (b[3] === 42 || b[3] === 43)
    : false;
}

async function readNpz(bytes) {
  // Load only on request: no JavaScript package manager or server is required.
  const {unzipSync} = await import('https://cdn.jsdelivr.net/npm/fflate@0.8.2/esm/browser.js');
  const archive = unzipSync(bytes);
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

async function readHdf5(bytes) {
  const h5wasmModule = await import('https://cdn.jsdelivr.net/npm/h5wasm@0.10.3/dist/esm/hdf5_hl.js');
  const h5wasm = h5wasmModule.default;
  const {FS} = await h5wasm.ready;
  // Name is fixed and internal: no user-controlled VFS paths or server-side file writes.
  const path = '/cherakoi-upload.h5';
  FS.writeFile(path, bytes);
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