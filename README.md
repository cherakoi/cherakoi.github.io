# CHerakoi — Cultural Heritage XRF Sonification

**Status: v0.1.2 (2026-11-24) — functional proof-of-concept, not production-verified.** Live site: <https://cherakoi.github.io/> (GitHub Pages, deploys automatically on push to `main`). Vanilla HTML/CSS/JS, no React, npm install or compilation required. Desktop and mobile (touch) layout, 100% browser-side XRF processing and sonification. Requires Internet access to load **third-party runtimes** on first use; the browser never sends the selected XRF file to the app's server. See `scientific_notes.md` for possible third-party runtime telemetry.

## Quick start

```bash
# From the CHerakoi repository root:
python -m http.server 8000
# Open http://localhost:8000
```

Or serve the same `index.html` + `src/` from Nginx:

```bash
docker compose up --build -d
# Open http://localhost:8080
# docker compose down
```

Camera access works on **localhost** or **HTTPS** (use TLS at your reverse proxy for remote clients). Do not use `file://` because ES modules, AudioWorklet and webcam require an HTTP(S) origin.

### First exploration

1. Click **Usa demo sintetica** (the demo is synthetic, not measured XRF data), **Usa demo file** (a real example XRF file, picked at random from `usable_data/`, credits in `usable_data/credits.md`), or upload `.npz` / `.h5` / `.hdf5` containing numeric `/img` (H, W, C), `.ome.tif` / `.ome.tiff` / `.tif` / `.tiff` (xrfraw OME-TIFF), or `.fits` / `.fit` / `.fts` (xrfraw FITS). The format is detected from the file **content**, not the extension.
2. Click **Attiva audio** (browser autoplay policy). Click **Avvia camera** and grant camera permission.
3. Move the **right index fingertip** over the XRF map: a pixel is selected; when the right index is absent or outside the map, sound is silent.
4. Keep the **left index fingertip out of the camera view** for a *spectral mixture*. Put it back into view to isolate one energy bin. Left index near **bottom** selects the low channel/frequency, near **top** the high one.
5. Without a camera, enable **Modalità mouse** and move the mouse over the map. Hold `Shift` while moving to emulate the left index: the wheel moves it in quantized steps (2 bins per 100 px notch, proportional under momentum) and ↑/↓ step exactly 1 bin; releasing `Shift` returns to the mixture.
6. Optional controls under the map: **⟲/⟳ 90°** and **⇋/⇅** rotate/flip the picture only (the energy axis stays vertical); **Cal m / Cal q** set a linear calibration `E = q + m·bin` (keV) shown for the selected bin; **Bin fisso** pins one energy bin (orange line, locked sound, and the grayscale map of that bin on the image); **Fino al picco** snaps the selection to the local maximum within ±N channels; **Mappa su bin** renders the per-pixel integral over the selected bin ±N channels. The last three are mutually exclusive: checking one unchecks the others (all off is allowed).

For reproducible data-format checking, a tiny NPZ fixture is provided at `tests/fixtures/synthetic_xrf.npz` (not an experimental dataset). Put private data in `data_example/` (gitignored); **local files are not read automatically** by the browser, so select them through the upload control.

## Input and processing contract

- `img`: numerical C-contiguous 3-D array in `(height, width, channels)` order; integer/float counts >= 0; no NaN/Inf.
- Optional `energy`: 1-D array of length C (keV, strictly increasing). If absent, sound frequencies map to ADC *channel index* rather than calibrated physical energy.
- NPZ: numeric NumPy `.npy` members `img.npy`, optionally `energy.npy`. No pickle or object dtype. Supported 8/16/32-bit integers, 32/64-bit floats and restricted 64-bit integers; Fortran-order arrays are explicitly rejected.
- HDF5: datasets `/img` and optional `/energy`; numeric array data. h5wasm reads gzip-compressed HDF5, but exotic filters are **not verified**.
- OME-TIFF (xrfraw): the first image plane is the `(H, W, C)` counts cube (uint32, channels along the 3rd TIFF dimension); a second plane, when present, is the 0/1 validity mask. The energy axis is read from the OME-XML `energy_axis` metadata (keV), with fallback to the embedded `XRF_META` annotation (`calibration` bin means); if neither exists the axis is ADC.
- FITS (xrfraw): the primary HDU is the `C×H×W` uint32 counts cube (BSCALE/BZERO applied); an optional `MASK` extension (uint8, C=1) is the validity mask; an `ENERGY` extension (1 column, C rows, keV) is the energy axis, with fallback to the zlib-compressed `XRF_META` binary-table annotation (`calibration` bin means).
- Rebin: 1024→512 sums adjacent channel counts. Any C>512 is rebinned to 512 using overlap-weighted sums (fractions possible); C<=512 is preserved, avoiding fake spectral resolution. **Only derived browser arrays are altered.** The original file is never modified. Memory/precision limitations are discussed in `scientific_notes.md`.
- Output: grayscale-blue 2-D total-count map, per-pixel spectrum, and audio. No backend, no database, no server-side upload.

## Dependency strategy (deliberately lightweight)

| Use | Runtime | Delivery |
|---|---|---|
| ZIP/NPZ decompression | `fflate@0.8.2` | ESM CDN on NPZ upload |
| HDF5 parsing | `h5wasm@0.10.3` | ESM CDN + WASM on HDF5 upload |
| OME-TIFF parsing | `geotiff@3.0.5` (UMD) | Local, vendored in `vendor/` on OME-TIFF upload |
| FITS parsing | `jsfitsio@3.1.0` (UMD) | Local, vendored in `vendor/` on FITS upload |
| Hand landmarks | MediaPipe Tasks Vision `0.10.21`, float16 HandLandmarker task | CDN + model on camera start |
| Synthesis | Web Audio API + local AudioWorklet | Native browser, no external audio package |

No npm dependencies are needed for running the app; `package.json` only provides `npm test` using the Node.js built-in test runner. **This is not a single self-contained offline HTML file**: the deployment is static, but NPZ/HDF5 CDNs and the hand model are fetched over the network. The OME-TIFF/FITS decoders are vendored locally (`vendor/`, MIT/Apache-2.0, loaded only when such a file is uploaded).

## Verification and known limitations

**Verified in headless Chromium 145 (2026-11-21, see `timeline.md`):** JS parse checks; Node tests for NPY decoding / rebin invariants / sonification policy / handedness; demo rendering; mouse pixel selection with poly/mono/silence paths; NPZ **and** synthetic H5 upload (identical maps); 1024→512 rebin in-app; AudioWorklet DSP (amplitude sets, RMS/limiter, zero when silent); MediaPipe bundle/WASM/model load and image-mode `detect()` with corrected handedness; network isolation (no XRF data leaves the page); theme #4196B4 and 390px viewport; **real-data run (M3):** user's 3 NPZs + reference H5 load cleanly, 2048→512 rebin identical to `xrfraw.rebin_to` at pixel level, NPZ↔H5 map-identical, poly/mono/silence audio policy on real counts. **v0.1.3 (2026-11-26):** unit tests 25/25 (NPZ/H5 core + OME-TIFF/FITS decoder writers, exact post-rebin voxel equality and metadata/mask assertions); browser E2E on 5 real xrfraw files (OME 512/1024, FITS 512/1024, second OME map): all load with correct shape, keV axis from file metadata, and the validity-mask pixel count (e.g. 36,377 validi), with zero console errors and no layout break at 1440px; HDF5 demo-file regression clean. **Not yet verified on target browser+hardware:** MediaPipe live webcam tracking (no camera device in the sandbox), audible sound quality, live AudioWorklet performance under real data, Docker Nginx on host. No claim of end-to-end usability from tests alone.

Known restrictions: HDF5/WASM may consume substantial RAM and freeze the main UI for huge files; NPZ unpacking is synchronous; uploads are capped at 400 MiB; selected-channel audio has amplitude only if the count exceeds threshold; the default mixture uses the loudest 32 bins (UI-configurable up to the available C), with gain normalization to avoid clipping. The color map is integrated counts, **not a chemical-element reconstruction**. The validity mask is **reported** in the data summary ("N validi") but not yet excluded from the integrated counts; out-of-acquisition pixels are not visually distinguished from measured zero-count pixels in this draft. The browser must access external CDNs for NPZ/HDF5 and the hand model (OME-TIFF/FITS decoding is fully local). Browser audio is not validated against measurement-calibrated acoustic standards.

## Project files

| Path | Role |
|---|---|
| `index.html`, `src/style.css`, `src/app.js` | layout, interaction, dataset map + spectrum |
| `src/npy.js`, `src/io.js` | NPY/NPZ and HDF5 readers; content-based format dispatch |
| `src/ome.js`, `src/fits.js`, `src/xrfmeta.js`, `src/vendor.js` | OME-TIFF and FITS decoders, shared XRF_META parsing, lazy vendor loader |
| `vendor/` | vendored UMD decoders (geotiff, jsfitsio) + CJS test build + licenses |
| `src/cube.js` | validation, rebin, frequency / amplitude mapping, demo |
| `src/hands.js` | MediaPipe two-hand tracking (index landmark 8) |
| `src/audio.js`, `src/spectrum-worklet.js` | Web Audio synthesis |
| `deploy/docker/`, `compose.yaml` | Nginx static deploy |
| `tests/`, `data_example/` | unit tests/fixture; gitignored private examples |
| `usable_data/` | public example XRF files (512 ch) + `credits.md`; `manifest.json` regenerated by `npm run demo-manifest` after file changes |
| `AGENTS.md`, `operational_plan.md`, `to_do.md`, `timeline.md`, `scientific_notes.md` | agent workflow and scientific conventions |
| `legacy_audit.md`, `kickstart_thread_prompt.md` | inherited-code audit and local agent kickstart |

### Sources / acknowledgements

- Herakoi code supplied as `herakoi-web-main.zip` (React + MediaPipe Hands + Tone.js), **reimplemented independently**; no legacy source or binary asset copied into the new runtime. See `legacy_audit.md`.
- `cherakoi-thesis-main.zip`: baseline React/Nginx deployment, not adopted as an application implementation.
- `templates-dhlab-projects(1).zip`: DASH DARKLY theme inspiration, accent `#4196B4`, and `src/deploy` conventions.
- [dash-xrf-visualizer](https://github.com/androbomb/dash-xrf-visualizer), [chnet-xrf-raw-data-converter](https://github.com/androbomb/chnet-xrf-raw-data-converter) and its [output schema](https://github.com/androbomb/chnet-xrf-raw-data-converter/blob/master/output_schema.md).

**Licensing:** MIT (see `LICENSE`); citation metadata in `CITATION.cff`. Third-party runtimes (fflate, h5wasm, MediaPipe) are loaded from public CDNs under their own licenses, and the MediaPipe hand-landmark model is fetched from Google storage — check their terms if you vendor them offline.
