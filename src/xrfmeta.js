// xrfraw metadata utilities shared by the OME-TIFF and FITS decoders.
export function tryParseJson(text) {
  try { return JSON.parse(text); } catch { return null; }
}

// zlib-inflate a byte block (mask payloads, XRF_META blobs). Returns null on failure.
export async function inflateZlib(bytes) {
  if (typeof DecompressionStream !== 'undefined') {
    try {
      const buf = await new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate'))).arrayBuffer();
      return new Uint8Array(buf);
    } catch { return null; }
  }
  try {
    const {inflateSync} = await import('node:zlib');
    return new Uint8Array(inflateSync(Buffer.from(bytes)));
  } catch { return null; }
}

// XRF_META / <M K="meta"> payloads are plain JSON or zlib(JSON).
export async function parseXrfMeta(raw) {
  const direct = tryParseJson(new TextDecoder('utf-8').decode(raw));
  if (direct) return direct;
  const out = await inflateZlib(raw);
  if (out) {
    const j = tryParseJson(new TextDecoder('utf-8').decode(out));
    if (j) return j;
  }
  throw new Error('Metadati XRF non validi (JSON atteso, eventualmente zlib-compresso)');
}

// Derive (m, q) for the exported bins: E[j] = q + j*m.
// Preference: explicit derived coefficients (xrfraw attrs), else the kickstart
// uniform sum-rebin formula from the original calibration. Returns null when
// the transform history is not a single uniform sum-rebin (never guess).
export function derivedCalibration(attrs, meta, C) {
  if (attrs && Number.isFinite(attrs.calibration_m) && Number.isFinite(attrs.calibration_q) && attrs.calibration_m > 0) {
    return {m: attrs.calibration_m, q: attrs.calibration_q, source: 'attrs'};
  }
  const cal = meta?.calibration;
  if (cal && Number.isFinite(cal.m) && Number.isFinite(cal.q) && cal.m > 0) {
    const rebin = (Array.isArray(meta.transforms) ? meta.transforms : []).find(t => t && t.type === 'rebin');
    if (!rebin) return {m: cal.m, q: cal.q, source: 'meta'};
    if (rebin.how !== 'sum' || !Number.isInteger(rebin.size) || rebin.size < 1 || !rebin_uniform_ok(cal)) return null;
    const R = rebin.size;
    return {m: R * cal.m, q: cal.q + ((R - 1) / 2) * cal.m, source: 'meta'};
  }
  return null;
}
function rebin_uniform_ok(cal) {
  // meta.calibration already carries rebin_uniform when xrfraw computed it.
  return cal.rebin_uniform !== false;
}

// Build an explicit energy axis from (m,q); throws on non-finite values.
export function linearAxis(C, m, q) {
  const e = new Float64Array(C);
  for (let j = 0; j < C; j++) e[j] = q + j * m;
  return e;
}