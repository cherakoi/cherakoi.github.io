import {loadVendor} from './vendor.js';
import {tryParseJson, inflateZlib, derivedCalibration, linearAxis} from './xrfmeta.js';

// OME-TIFF decoder for xrfraw XRF cubes: one IFD per energy channel (CYX),
// uint32 counts, OME-XML 2016-06 with xrfraw MapAnnotations (meta/attrs/mask).
// shortcut: parses the OME-XML subset xrfraw emits (Pixels SizeC/Y/X, TiffData
// entries, <M K> annotations, 2008-02 <Map> fallback); other layouts -> error.

function attrOf(tag, name) {
  const m = tag.match(new RegExp(`${name}="([^"]*)"`));
  return m ? m[1] : null;
}

function annotationEntries(xml) {
  const out = new Map();
  // 2016-06: <M K="key">value</M> inside <Value>
  for (const m of xml.matchAll(/<M K="([^"]+)">([\s\S]*?)<\/M>/g)) out.set(m[1], m[2].trim());
  // 2008-02 fallback: <MapAnnotation><Map Key="key">value</Map>
  if (out.size === 0) for (const m of xml.matchAll(/<Map Key="([^"]+)">([\s\S]*?)<\/Map>/g)) out.set(m[1], m[2].trim());
  return out;
}

function base64ToBytes(b64) {
  return typeof atob === 'function'
    ? Uint8Array.from(atob(b64), c => c.charCodeAt(0))
    : new Uint8Array(Buffer.from(b64, 'base64'));
}

async function decodeMask(b64, expect) {
  const raw = base64ToBytes(b64);
  if (raw.length === expect) return raw;
  const out = await inflateZlib(raw);
  if (out && out.length === expect) return out;
  throw new Error('Maschera OME-TIFF: decodifica non riuscita (base64/zlib inatteso)');
}

export async function decodeOME(bytes) {
  const GT = await loadVendor('geotiff', 'GeoTIFF');
  const multi = await GT.fromArrayBuffer(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const ifdCount = await multi.getImageCount();
  if (!ifdCount) throw new Error('OME-TIFF: nessun piano TIFF');
  const dv270 = await (await multi.getImage(0)).fileDirectory.loadValue(270); // ImageDescription
  const desc = Array.isArray(dv270) ? dv270.join('') : dv270; // geotiff splits ASCII at NUL
  if (typeof desc !== 'string' || !/<\s*OME[\s>]/.test(desc)) {
    throw new Error('File TIFF senza OME-XML: solo OME-TIFF è supportato');
  }

  const pixelsTag = desc.match(/<Pixels\b[^>]*>/)?.[0] ?? '';
  const C = Number(attrOf(pixelsTag, 'SizeC'));
  const H = Number(attrOf(pixelsTag, 'SizeY'));
  const W = Number(attrOf(pixelsTag, 'SizeX'));
  if (!Number.isSafeInteger(C) || !Number.isSafeInteger(H) || !Number.isSafeInteger(W) || C < 1 || H < 1 || W < 1) {
    throw new Error('OME-XML: Pixels SizeC/SizeY/SizeX mancanti o non interi');
  }

  // Channel -> IFD map straight from TiffData entries (no contiguity assumed).
  const channelOfIfd = new Array(ifdCount).fill(-1);
  let seen = 0;
  for (const m of desc.matchAll(/<TiffData\b([^>]*?)\/?>/g)) {
    const a = k => attrOf(m[1], k);
    const ifd = Number(a('IFD'));
    const firstC = Number(a('FirstC') ?? 0);
    const planes = Number(a('PlaneCount') ?? 1);
    if (!Number.isSafeInteger(ifd) || ifd < 0 || ifd >= ifdCount) throw new Error(`OME-XML: TiffData IFD="${a('IFD')}" fuori range`);
    if (!Number.isSafeInteger(firstC) || firstC < 0 || firstC + planes > C) throw new Error('OME-XML: TiffData FirstC/PlaneCount incoerenti con SizeC');
    if (planes !== 1) throw new Error('OME-TIFF: più piani per canale (PlaneCount>1) non supportato');
    if (channelOfIfd[ifd] !== -1) throw new Error('OME-TIFF: IFD ripetuto nel mapping dei canali');
    channelOfIfd[ifd] = firstC;
    seen++;
  }
  if (seen !== C) throw new Error(`OME-XML: ${seen} piani TiffData per ${C} canali attesi`);
  for (let c = 0; c < C; c++) if (!channelOfIfd.includes(c)) throw new Error(`OME-XML: canale ${c} senza piano TiffData`);

  const data = new Uint32Array(H * W * C);
  const expected = W * H;
  for (let i = 0; i < ifdCount; i++) {
    const rasters = await (await multi.getImage(i)).readRasters({raw: true, uint8: false});
    const plane = Array.isArray(rasters) ? rasters[0] : rasters;
    if (!plane || plane.length !== expected) throw new Error(`OME-TIFF: piano ${i} con ${plane?.length ?? 0} pixel attesi ${expected}`);
    const c = channelOfIfd[i];
    for (let y = 0; y < H; y++) {
      const base = y * W, row = (base) * C;
      for (let x = 0; x < W; x++) data[row + x * C + c] = plane[base + x] >>> 0;
    }
  }

  const ann = annotationEntries(desc);
  const meta = ann.has('meta') ? tryParseJson(ann.get('meta')) : null;
  const attrs = ann.has('attrs') ? tryParseJson(ann.get('attrs')) : null;
  let mask = null;
  if (ann.has('mask')) {
    if (typeof ann.get('mask') !== 'string') throw new Error('Maschera OME-TIFF: valore non base64');
    mask = await decodeMask(ann.get('mask'), H * W);
  }

  let energy = null, energySource = null;
  if (attrs && Array.isArray(attrs.energy_axis) && attrs.energy_axis.length === C &&
      attrs.energy_axis.every(n => Number.isFinite(n))) {
    energy = Float64Array.from(attrs.energy_axis);
    energySource = 'energy_axis';
  } else {
    const d = derivedCalibration(attrs, meta, C);
    if (d) { energy = linearAxis(C, d.m, d.q); energySource = 'calibration'; }
  }
  if (energy) {
    // Kickstart: validate redundant sources, prefer the explicit vector, report drift.
    const d = derivedCalibration(attrs, meta, C);
    if (d) {
      const drift = Math.max(Math.abs(energy[0] - d.q), Math.abs(energy[C - 1] - (d.q + (C - 1) * d.m)));
      if (drift > 1e-6 && meta) meta.discrepancy = `energy_axis diverge dai coefficienti di calibrazione di ${drift.toExponential(2)} keV: usato il vettore esplicito`;
    }
  }

  const outMeta = Object.assign({}, attrs ?? {});
  if (meta) outMeta.raw_meta = meta;
  outMeta.energySource = energySource;
  return {shape: [H, W, C], data, energy, mask, meta: outMeta};
}