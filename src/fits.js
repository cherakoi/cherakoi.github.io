import {loadVendor} from './vendor.js';
import {parseXrfMeta, derivedCalibration, linearAxis} from './xrfmeta.js';

// FITS decoder for xrfraw XRF cubes. Real files: 4 HDUs
//   PRIMARY (uint32 counts, BITPIX=32 + BSCALE=1/BZERO=2^31, NAXIS=[W,H,C], WCS)
//   XRF_META (JSON, possibly zlib-compressed) | MASK (uint8 [W,H]) | ENERGY (BINTABLE col E)
// jsfitsio returns raw big-endian typed values; the unsigned convention is
// applied here (v*bscale + bzero) so counts stay exact uint32.

function hkey(hdu, k) {
  const v = hdu?.header?.findById?.(k)?.value;
  if (v === undefined || v === null) return v;
  let s = String(v);
  // jsfitsio keeps the raw quoted form of string values ('XRF_META', 'MASK    ')
  if (s.length >= 2 && s.startsWith("'") && s.endsWith("'")) s = s.slice(1, -1);
  return s.trim();
}
function hnum(hdu, k) { const v = hkey(hdu, k); return v === undefined || v === null ? null : Number(v); }

export async function decodeFITS(bytes) {
  const lib = await loadVendor('jsfitsio', 'jsfitsio');
  let ff;
  try { ff = lib.FITSParser.processFITSFile(bytes, {}); }
  catch (e) { throw new Error(`FITS non valido: ${e.message}`); }

  const primary = ff.primaryHDU;
  if (!primary) throw new Error('FITS: HDU primario mancante');
  if (hnum(primary, 'BITPIX') !== 32) throw new Error('FITS: atteso BITPIX=32 (counts uint32)');
  const [W, H, C] = primary.shape; // NAXIS1=W, NAXIS2=H, NAXIS3=C
  if (!Number.isSafeInteger(W) || !Number.isSafeInteger(H) || !Number.isSafeInteger(C) || !W || !H || !C) {
    throw new Error('FITS: PRIMARY deve essere 3-D (W, H, C)');
  }
  const bscale = hnum(primary, 'BSCALE') ?? 1;
  const bzero = hnum(primary, 'BZERO') ?? 0;
  const raw = primary.typedData;
  if (!raw || raw.length !== W * H * C) throw new Error('FITS: payload PRIMARY incoerente con gli header');

  const data = new Uint32Array(H * W * C);
  for (let i = 0; i < raw.length; i++) {
    const v = raw[i] * bscale + bzero;
    if (!Number.isInteger(v) || v < 0 || v >= 0x100000000) throw new Error(`FITS: count non uint32 all'indice ${i}`);
    const x = i % W, y = ((i / W) | 0) % H, c = (i / (W * H)) | 0;
    data[(y * W + x) * C + c] = v;
  }

  const byName = new Map();
  for (const hdu of ff.hdus) {
    const name = String(hkey(hdu, 'EXTNAME') ?? '').toUpperCase();
    if (name) byName.set(name, hdu);
  }

  // XRF_META: JSON (plain or zlib), carries provenance + original calibration.
  const metaHdu = byName.get('XRF_META');
  let meta = null;
  if (metaHdu) meta = await parseXrfMeta(metaHdu.rawData);

  // MASK: uint8 image, NAXIS1=W NAXIS2=H -> already row-major.
  let mask = null;
  const maskHdu = byName.get('MASK');
  if (maskHdu) {
    if (maskHdu.shape.length !== 2 || maskHdu.shape[0] !== W || maskHdu.shape[1] !== H) {
      throw new Error('FITS: estensione MASK con dimensioni incoerenti');
    }
    mask = maskHdu.typedData;
  }

  // ENERGY: explicit per-bin vector (BINTABLE column E).
  let energy = null, energySource = null;
  const eHdu = byName.get('ENERGY');
  if (eHdu && eHdu.type === 'BINTABLE') {
    const col = eHdu.columns.find(c => String(c.name) === 'E');
    if (col && eHdu.rowCount === C) {
      energy = new Float64Array(C);
      for (let j = 0; j < C; j++) energy[j] = eHdu.getCell(j, col.name);
      if (!energy.every(n => Number.isFinite(n))) throw new Error('FITS: tabella ENERGY con valori non finiti');
      energySource = 'energy_table';
    }
  }
  // Cross-check the explicit vector against the energy WCS (CRPIX3 is 1-based).
  if (energy) {
    const crpix = hnum(primary, 'CRPIX3') ?? 1;
    const crval = hnum(primary, 'CRVAL3');
    const cdel = hnum(primary, 'CDELT3');
    if (crval !== null && cdel !== null && cdel > 0) {
      const drift = Math.max(
        Math.abs(energy[0] - (crval + (0 - crpix + 1) * cdel)),
        Math.abs(energy[C - 1] - (crval + (C - 1 - crpix + 1) * cdel)));
      if (drift > 1e-9 && meta) meta.discrepancy = `WCS energetico diverge dalla tabella ENERGY di ${drift.toExponential(2)} keV: usata la tabella`;
    }
  }
  if (!energy) {
    const d = derivedCalibration(null, meta, C);
    if (d) { energy = linearAxis(C, d.m, d.q); energySource = 'calibration'; }
  }

  const outMeta = meta ? Object.assign({}, meta) : {};
  outMeta.energySource = energySource;
  return {shape: [H, W, C], data, energy, mask, meta: outMeta};
}