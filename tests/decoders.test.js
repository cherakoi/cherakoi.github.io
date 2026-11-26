// Decoder tests for OME-TIFF / FITS (v0.1.3). Fixtures are generated in-memory
// (classic little-endian TIFF writer, big-endian FITS writer) with the exact
// structure of the real xrfraw files: 1 IFD per channel (CYX) uint32, OME-XML
// with xrfraw MapAnnotations; PRIMARY + XRF_META + MASK + ENERGY BINTABLE.
import test from 'node:test';
import assert from 'node:assert/strict';
import {deflateSync} from 'node:zlib';
import {readXrfFile} from '../src/io.js';
import {decodeOME} from '../src/ome.js';
import {decodeFITS} from '../src/fits.js';

const C = 4, H = 3, W = 5;
const energy4 = [0.05, 0.15, 0.25, 0.35];
const VAL = (ci, y, x) => (ci + 1) * 1e6 + (y + 1) * 1e3 + (x + 1);
const makePlanes = () => [...Array(C)].map((_, ci) =>
  Uint32Array.from({length: H * W}, (_, i) => VAL(ci, (i / W) | 0, i % W)));

function assertExact(out, planes) {
  assert.equal(out.data.length, planes.length * planes[0].length);
  let exact = 0;
  for (let ci = 0; ci < planes.length; ci++)
    for (let i = 0; i < planes[0].length; i++)
      if (out.data[i * planes.length + ci] === planes[ci][i]) exact++;
  assert.equal(exact, planes.length * planes[0].length);
}

const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function omeXml({h, w, c, meta, attrs, maskB64 = null, mapping = null, ome2008 = false}) {
  const tiffData = [...Array(c)].map((_, ch) =>
    `<TiffData FirstC="${ch}" IFD="${mapping ? mapping[ch] : ch}" PlaneCount="1"/>`).join('');
  const ann = (k, v) => ome2008 ? `<Map Key="${k}">${v}</Map>` : `<M K="${k}">${v}</M>`;
  return `<?xml version="1.0" encoding="UTF-8"?>
<OME xmlns="http://www.openmicroscopy.org/Schemas/OME/2016-06">
<Image ID="Image:0" Name="fixture">
<Pixels BigEndian="false" DimensionOrder="CYX" ID="Pixels:0" Interleaved="false" PixelType="uint32" SizeC="${c}" SizeT="1" SizeX="${w}" SizeY="${h}" SizeZ="1" Type="uint32">
${tiffData}
</Pixels>
</Image>
<StructuredAnnotations>
<MapAnnotation ID="Map:0" Namespace="xrfraw:fixture"><Value>
${ann('meta', esc(JSON.stringify(meta)))}
${ann('attrs', esc(JSON.stringify(attrs)))}
${maskB64 ? ann('mask', maskB64) : ''}
</Value></MapAnnotation>
</StructuredAnnotations>
</OME>`;
}

// Classic little-endian TIFF writer: 1 IFD per channel, all values inline.
function buildOmeTiff({h, w, c, planes, xml, compression = 1, mapping = null}) {
  const enc = new TextEncoder();
  const xmlBytes = enc.encode(xml + '\0');
  // IFD i holds the plane of the channel ch with mapping[ch] === i (identity when null)
  const chOfIfd = [...Array(c)].map((_, i) => mapping ? mapping.indexOf(i) : i);
  const strips = chOfIfd.map(ch => compression === 1
    ? new Uint8Array(planes[ch].buffer, planes[ch].byteOffset, planes[ch].byteLength)
    : new Uint8Array(deflateSync(Buffer.from(planes[ch].buffer, planes[ch].byteOffset, planes[ch].byteLength))));
  const NTAGS = 10;
  const header = 8;
  let off = header;
  const stripInfo = strips.map(s => { const o = off; off += s.byteLength; return {o, n: s.byteLength}; });
  const xmlOff = off; off += xmlBytes.length;
  const ifdOffs = [...Array(c)].map(() => { const o = off; off += 2 + NTAGS * 12 + 4; return o; });
  const out = new Uint8Array(off);
  const dv = new DataView(out.buffer);
  out[0] = 0x49; out[1] = 0x49; dv.setUint16(2, 42, true); dv.setUint32(4, ifdOffs[0], true);
  for (let i = 0; i < strips.length; i++) out.set(strips[i], stripInfo[i].o);
  out.set(xmlBytes, xmlOff);
  for (let i = 0; i < c; i++) {
    const o = ifdOffs[i];
    const entries = [
      [256, 4, 1, w], [257, 4, 1, h], [258, 3, 1, 32], [259, 3, 1, compression],
      [270, 2, xmlBytes.length, xmlOff], [273, 4, 1, stripInfo[i].o], [277, 3, 1, 1], [278, 4, 1, h], [279, 4, 1, stripInfo[i].n], [284, 3, 1, 1],
    ].sort((a, b) => a[0] - b[0]);
    dv.setUint16(o, NTAGS, true);
    entries.forEach(([tag, type, count, val], k) => {
      const e = o + 2 + k * 12;
      dv.setUint16(e, tag, true); dv.setUint16(e + 2, type, true); dv.setUint32(e + 4, count, true);
      if (type === 3) dv.setUint16(e + 8, val, true); else dv.setUint32(e + 8, val, true);
    });
    dv.setUint32(o + 2 + NTAGS * 12, i + 1 < c ? ifdOffs[i + 1] : 0, true);
  }
  return out;
}

function card(k, v, comment) {
  const vs = typeof v === 'number' ? String(v) : typeof v === 'boolean' ? (v ? 'T' : 'F') : `'${String(v).replace(/'/g, "''")}'`;
  const s = k.padEnd(8) + '= ' + vs.padEnd(20) + (comment ? ' / ' + comment : '');
  const lines = [];
  for (let i = 0; i < s.length; i += 80) lines.push(s.slice(i, i + 80).padEnd(80, ' '));
  return lines.length ? lines : [' '.repeat(80)];
}
function block8(cards) {
  let s = cards.join('') + 'END'.padEnd(80, ' ');
  s += ' '.repeat((2880 - (s.length % 2880)) % 2880);
  return new TextEncoder().encode(s);
}
function pad2880(u8) {
  const pad = (2880 - (u8.length % 2880)) % 2880;
  const out = new Uint8Array(u8.length + pad);
  out.set(u8); out.fill(0x20, u8.length);
  return out;
}

// Big-endian FITS writer mirroring the xrfraw 4-HDU layout.
function buildFits({h, w, c, planes, energy = null, mask = null, meta = null, metaZlib = true, wcsDrift = false}) {
  const enc = new TextEncoder();
  const parts = [];
  const cards = [card('SIMPLE', true), card('BITPIX', 32), card('NAXIS', 3),
    card('NAXIS1', w), card('NAXIS2', h), card('NAXIS3', c), card('BSCALE', 1), card('BZERO', 2147483648)];
  if (energy) {
    const drift = wcsDrift ? 0.5 : 0;
    cards.push(card('CTYPE3', 'ENERGY'), card('CRPIX3', 1),
      card('CRVAL3', energy[0] + drift), card('CDELT3', energy[1] - energy[0]), card('CUNIT3', 'keV'));
  }
  parts.push(block8(cards));
  const n = w * h * c;
  const dv = new DataView(new ArrayBuffer(n * 4));
  for (let ci = 0; ci < c; ci++)
    for (let i = 0; i < h * w; i++)
      dv.setInt32(((ci * h * w) + i) * 4, planes[ci][i] - 2147483648, false);
  parts.push(pad2880(new Uint8Array(dv.buffer)));
  let metaBytes = enc.encode(JSON.stringify(meta ?? {}));
  if (meta && metaZlib) metaBytes = new Uint8Array(deflateSync(Buffer.from(metaBytes)));
  parts.push(block8([card('XTENSION', 'IMAGE'), card('BITPIX', 8), card('PCOUNT', 0), card('GCOUNT', 1),
    card('NAXIS', 1), card('NAXIS1', metaBytes.length), card('EXTNAME', 'XRF_META')]));
  parts.push(pad2880(metaBytes));
  if (mask) {
    parts.push(block8([card('XTENSION', 'IMAGE'), card('BITPIX', 8), card('PCOUNT', 0), card('GCOUNT', 1),
      card('NAXIS', 2), card('NAXIS1', w), card('NAXIS2', h), card('EXTNAME', 'MASK')]));
    parts.push(pad2880(mask));
  }
  if (energy) {
    parts.push(block8([card('XTENSION', 'BINTABLE'), card('BITPIX', 8), card('PCOUNT', 0), card('GCOUNT', 1),
      card('NAXIS', 2), card('NAXIS1', 8), card('NAXIS2', c), card('TFIELDS', 1),
      card('EXTNAME', 'ENERGY'), card('TTYPE1', 'E'), card('TFORM1', '1D'), card('TUNIT1', 'keV')]));
    const ev = new DataView(new ArrayBuffer(c * 8));
    energy.forEach((e, j) => ev.setFloat64(j * 8, e, false));
    parts.push(pad2880(new Uint8Array(ev.buffer)));
  }
  const out = new Uint8Array(parts.reduce((a, p) => a + p.length, 0));
  let p = 0;
  for (const part of parts) { out.set(part, p); p += part.length; }
  return out;
}

const maskB64 = mask => Buffer.from(deflateSync(Buffer.from(mask))).toString('base64');
const fixtureAttrs = () => ({energy_axis: energy4, calibration_m: 0.1, calibration_q: 0.05, n_channels: C});
const fixtureMeta = () => ({software: 'xrfraw-fixture', calibration: {m: 0.1, q: 0.05, convention: 'bin-mean', rebin_uniform: true}});
const omeBytes = (mask, extra = {}) => decodeOME.bind(null,
  buildOmeTiff({h: H, w: W, c: C, planes: makePlanes(), mapping: extra.mapping,
    xml: omeXml({h: H, w: W, c: C, meta: fixtureMeta(), attrs: fixtureAttrs(), maskB64: mask ? maskB64(mask) : null, ...extra})}));

test('OME-TIFF: CYX cube, exact uint32 values, energy_axis, mask', async () => {
  const mask = new Uint8Array(H * W).fill(1); mask[3] = 0; mask[10] = 0;
  const out = await omeBytes(mask)();
  assert.deepEqual(out.shape, [H, W, C]);
  assertExact(out, makePlanes());
  assert.deepEqual(Array.from(out.energy), energy4);
  assert.equal(out.meta.energySource, 'energy_axis');
  assert.deepEqual(Array.from(out.mask), Array.from(mask));
});

test('FITS: uint32 via BSCALE/BZERO, XRF_META zlib, MASK, ENERGY table', async () => {
  const mask = new Uint8Array(H * W).fill(1); mask[7] = 0;
  const out = await decodeFITS(buildFits({h: H, w: W, c: C, planes: makePlanes(), energy: energy4, mask, meta: fixtureMeta()}));
  assert.deepEqual(out.shape, [H, W, C]);
  assertExact(out, makePlanes());
  assert.deepEqual(Array.from(out.energy), energy4);
  assert.equal(out.meta.energySource, 'energy_table');
  assert.equal(out.meta.software, 'xrfraw-fixture');
  assert.deepEqual(Array.from(out.mask), Array.from(mask));
});

test('cross-format: OME-TIFF and FITS decode the same cube identically', async () => {
  const mask = new Uint8Array(H * W).fill(1); mask[1] = 0;
  const planes = makePlanes();
  const ome = await omeBytes(mask)();
  const fits = await decodeFITS(buildFits({h: H, w: W, c: C, planes, energy: energy4, mask, meta: fixtureMeta()}));
  assert.equal(ome.data.length, fits.data.length);
  let diff = 0;
  for (let i = 0; i < ome.data.length; i++) if (ome.data[i] !== fits.data[i]) diff++;
  assert.equal(diff, 0);
  for (let j = 0; j < C; j++) assert.ok(Math.abs(ome.energy[j] - fits.energy[j]) < 1e-12);
  assert.deepEqual(Array.from(ome.mask), Array.from(fits.mask));
});

test('OME-TIFF: Deflate strips (Compression=8) decode identically', async () => {
  const xml = omeXml({h: H, w: W, c: C, meta: fixtureMeta(), attrs: fixtureAttrs()});
  const a = await decodeOME(buildOmeTiff({h: H, w: W, c: C, planes: makePlanes(), xml, compression: 1}));
  const b = await decodeOME(buildOmeTiff({h: H, w: W, c: C, planes: makePlanes(), xml, compression: 8}));
  assert.deepEqual(Array.from(b.data), Array.from(a.data));
});

test('OME-TIFF: non-identity channel->IFD mapping is respected', async () => {
  const mapping = [2, 0, 3, 1]; // channel ch is stored in IFD mapping[ch]
  const out = await omeBytes(null, {mapping})();
  assertExact(out, makePlanes());
});

test('OME-TIFF: 2008-02 MapAnnotation dialect is accepted', async () => {
  const out = await omeBytes(null, {ome2008: true})();
  assert.deepEqual(Array.from(out.energy), energy4);
});

test('readXrfFile: sniffs by content, rebins 1024->512, preserves totals/mask/meta', async () => {
  const hc = 1024, hh = 2, ww = 3;
  const planes = [...Array(hc)].map((_, ci) => Uint8Array.from({length: hh * ww}, (_, i) => (ci * 13 + i * 7) % 1000).map(v => v));
  const planesU32 = planes.map(p => Uint32Array.from(p));
  const mask = new Uint8Array(hh * ww).fill(1); mask[4] = 0;
  const energy = Float64Array.from({length: hc}, (_, j) => 0.05 + j * 0.1);
  const fitsBytes = buildFits({h: hh, w: ww, c: hc, planes: planesU32, energy, mask, meta: fixtureMeta()});
  const cube = await readXrfFile(new File([fitsBytes], 'cubo-rinominato.h5'));
  assert.equal(cube.channels, 512);
  assert.equal(cube.sourceChannels, 1024);
  const totalRaw = planesU32.reduce((a, p) => a + p.reduce((x, y) => x + y, 0), 0);
  const totalCube = cube.data.reduce((a, b) => a + b, 0);
  assert.equal(totalCube, totalRaw);
  assert.equal(cube.energy.length, 512);
  assert.deepEqual(Array.from(cube.mask), Array.from(mask));
  assert.equal(cube.meta.software, 'xrfraw-fixture');
});

test('readXrfFile: content wins over extension (FITS named .h5, OME named .npz)', async () => {
  const fitsBytes = buildFits({h: H, w: W, c: C, planes: makePlanes(), energy: energy4, meta: fixtureMeta()});
  const asH5 = await readXrfFile(new File([fitsBytes], 'x.h5'));
  assert.equal(asH5.sourceChannels, C);
  const omeBytes2 = buildOmeTiff({h: H, w: W, c: C, planes: makePlanes(),
    xml: omeXml({h: H, w: W, c: C, meta: fixtureMeta(), attrs: fixtureAttrs()})});
  const asNpz = await readXrfFile(new File([omeBytes2], 'x.npz'));
  assert.equal(asNpz.sourceChannels, C);
});

test('FITS: ENERGY table prevails over a drifting WCS; discrepancy reported', async () => {
  const out = await decodeFITS(buildFits({h: H, w: W, c: C, planes: makePlanes(), energy: energy4, meta: fixtureMeta(), wcsDrift: true}));
  assert.deepEqual(Array.from(out.energy), energy4);
  assert.match(String(out.meta.discrepancy), /WCS/);
});

test('FITS without ENERGY/MASK: energy null (ADC bins), no crash', async () => {
  const out = await decodeFITS(buildFits({h: H, w: W, c: C, planes: makePlanes()}));
  assert.equal(out.energy, null);
  assert.equal(out.mask, null);
  assert.equal(out.meta.energySource, null);
  assertExact(out, makePlanes());
});

test('errors: non-OME TIFF, truncated FITS, unknown content', async () => {
  const plain = buildOmeTiff({h: 1, w: 2, c: 1, planes: [Uint32Array.from([1, 2])], xml: 'plain text'});
  await assert.rejects(decodeOME(plain), /senza OME-XML/);
  const fits = buildFits({h: H, w: W, c: C, planes: makePlanes(), energy: energy4, meta: fixtureMeta()});
  await assert.rejects(decodeFITS(fits.subarray(0, fits.length - 3000)), /FITS/);
  await assert.rejects(readXrfFile(new File([new Uint8Array(64)], 'x.bin')), /Formato non riconosciuto/);
});