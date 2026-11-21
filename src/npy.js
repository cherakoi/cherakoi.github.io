/** Read a numeric, C-contiguous NumPy .npy array without eval or pickle. */
export function parseNpy(bytes) {
  if (!(bytes instanceof Uint8Array)) throw new Error('NPY: expected Uint8Array');
  const magic = [0x93, 0x4e, 0x55, 0x4d, 0x50, 0x59];
  if (bytes.length < 12 || magic.some((b, i) => bytes[i] !== b)) throw new Error('Invalid NPY magic');
  const version = bytes[6];
  if (![1, 2, 3].includes(version)) throw new Error(`Unsupported NPY version: ${version}`);
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const headerLength = version === 1 ? view.getUint16(8, true) : view.getUint32(8, true);
  const offset = version === 1 ? 10 : 12;
  if (headerLength > 100_000 || offset + headerLength > bytes.length) throw new Error('Invalid NPY header length');
  const header = new TextDecoder(version === 3 ? 'utf-8' : 'latin1').decode(bytes.subarray(offset, offset + headerLength));
  const dtype = /['"]descr['"]\s*:\s*['"]([^'"]+)['"]/.exec(header)?.[1];
  const fortran = /['"]fortran_order['"]\s*:\s*(True|False)/.exec(header)?.[1];
  const shapeText = /['"]shape['"]\s*:\s*\(([^)]*)\)/.exec(header)?.[1];
  if (!dtype || !fortran || shapeText === undefined) throw new Error('Incomplete NPY header');
  if (fortran === 'True') throw new Error('Fortran-ordered NPY not supported; convert to C order');
  const shape = shapeText.split(',').map(s => s.trim()).filter(Boolean).map(Number);
  if (shape.length === 0 || shape.some(n => !Number.isSafeInteger(n) || n < 1)) throw new Error('Invalid NPY shape');
  const specs = {'u1':['getUint8',1], 'i1':['getInt8',1], 'u2':['getUint16',2], 'i2':['getInt16',2], 'u4':['getUint32',4], 'i4':['getInt32',4], 'f4':['getFloat32',4], 'f8':['getFloat64',8], 'u8':['getBigUint64',8], 'i8':['getBigInt64',8]};
  const match = /^([<>=|])([uif])(\d+)$/.exec(dtype);
  const spec = match && specs[match[2] + match[3]];
  if (!spec) throw new Error(`Unsupported NPY dtype ${dtype}: numeric arrays only`);
  const littleEndian = match[1] !== '>';
  const count = shape.reduce((a, b) => a * b, 1);
  if (!Number.isSafeInteger(count) || count * spec[1] > bytes.length - offset - headerLength) throw new Error('Truncated NPY data');
  const base = offset + headerLength;
  // For typical little-endian .npz arrays, a typed view avoids doubling RAM.
  const typeForDtype = {'u1': Uint8Array, 'i1': Int8Array, 'u2': Uint16Array, 'i2': Int16Array, 'u4': Uint32Array, 'i4': Int32Array, 'f4': Float32Array, 'f8': Float64Array};
  const constructor = typeForDtype[match[2] + match[3]];
  if (littleEndian && constructor && (bytes.byteOffset + base) % spec[1] === 0) {
    return { shape, data: new constructor(bytes.buffer, bytes.byteOffset + base, count), dtype };
  }
  const data = new Float64Array(count);
  for (let i = 0; i < count; i++) {
    const n = view[spec[0]](base + i * spec[1], littleEndian);
    if (typeof n === 'bigint' && n > BigInt(Number.MAX_SAFE_INTEGER)) throw new Error('NPY uint64 count exceeds safe JS precision');
    data[i] = Number(n);
  }
  return { shape, data, dtype };
}
