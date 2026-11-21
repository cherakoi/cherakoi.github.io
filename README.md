# CHerakoi — Cultural Heritage XRF Sonification

**Status: functional draft / not production-verified (2026-11-21).** Vanilla HTML/CSS/JS, no React, npm install or compilation required. Desktop-oriented, 100% browser-side XRF processing and sonification. Requires Internet access to load **third-party runtimes** on first use; the browser never sends the selected XRF file to the app's server. See `scientific_notes.md` for possible third-party runtime telemetry.

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

1. Click **Usa demo sintetica** (the demo is synthetic, not measured XRF data), or upload `.npz` / `.h5` / `.hdf5` containing numeric `/img` (H, W, C).
2. Click **Attiva audio** (browser autoplay policy). Click **Avvia camera** and grant camera permission.
3. Move the **right index fingertip** over the XRF map: a pixel is selected; when the right index is absent or outside the map, sound is silent.
4. Keep the **left index fingertip out of the camera view** for a *spectral mixture*. Put it back into view to isolate one energy bin. Left index near **bottom** selects the low channel/frequency, near **top** the high one.
5. Without a camera, enable **Modalità mouse** and move the mouse over the map. Hold `Shift` while moving to emulate the left index.

For reproducible data-format checking, a tiny NPZ fixture is provided at `tests/fixtures/synthetic_xrf.npz` (not an experimental dataset). Put private data in `data_example/` (gitignored); **local files are not read automatically** by the browser, so select them through the upload control.

## Input and processing contract

- `img`: numerical C-contiguous 3-D array in `(height, width, channels)` order; integer/float counts >= 0; no NaN/Inf.
- Optional `energy`: 1-D array of length C (keV, strictly increasing). If absent, sound frequencies map to ADC *channel index* rather than calibrated physical energy.
- NPZ: numeric NumPy `.npy` members `img.npy`, optionally `energy.npy`. No pickle or object dtype. Supported 8/16/32-bit integers, 32/64-bit floats and restricted 64-bit integers; Fortran-order arrays are explicitly rejected.
- HDF5: datasets `/img` and optional `/energy`; numeric array data. h5wasm reads gzip-compressed HDF5, but exotic filters are **not verified**.
- Rebin: 1024→512 sums adjacent channel counts. Any C>512 is rebinned to 512 using overlap-weighted sums (fractions possible); C<=512 is preserved, avoiding fake spectral resolution. **Only derived browser arrays are altered.** The original file is never modified. Memory/precision limitations are discussed in `scientific_notes.md`.
- Output: grayscale-blue 2-D total-count map, per-pixel spectrum, and audio. No backend, no database, no server-side upload.

## Dependency strategy (deliberately lightweight)

| Use | Runtime | Delivery |
|---|---|---|
| ZIP/NPZ decompression | `fflate@0.8.2` | ESM CDN on NPZ upload |
| HDF5 parsing | `h5wasm@0.10.3` | ESM CDN + WASM on HDF5 upload |
| Hand landmarks | MediaPipe Tasks Vision `0.10.21`, float16 HandLandmarker task | CDN + model on camera start |
| Synthesis | Web Audio API + local AudioWorklet | Native browser, no external audio package |

No npm dependencies are needed for running the app; `package.json` only provides `npm test` using the Node.js built-in test runner. **This is not a single self-contained offline HTML file**: the deployment is static, but CDNs and model are fetched over the network. A pinned, fully vendored release is deferred pending browser verification and license/asset review.

## Verification and known limitations

**Verified locally by scripts (see `timeline.md`):** JS parse check, Node tests for NPY decoding / rebin invariants / sonification policy / handedness; local static rendering checked separately if logged there. **Not yet verified on target browser+hardware:** MediaPipe webcam tracking, real camera-handedness, live AudioWorklet performance, real NPZ+HDF5 upload, Docker Nginx on host. No claim of end-to-end usability from tests alone.

Known restrictions: HDF5/WASM may consume substantial RAM and freeze the main UI for huge files; NPZ unpacking is synchronous; selected-channel audio has amplitude only if the count exceeds threshold; the default mixture uses the loudest 32 bins (UI-configurable up to the available C), with gain normalization to avoid clipping. The color map is integrated counts, **not a chemical-element reconstruction**. Out-of-acquisition pixels are not visually distinguished from measured zero-count pixels in this draft. The browser must access external CDNs (unless dependencies are vendored in a future milestone). Browser audio is not validated against measurement-calibrated acoustic standards.

## Project files

| Path | Role |
|---|---|
| `index.html`, `src/style.css`, `src/app.js` | layout, interaction, dataset map + spectrum |
| `src/npy.js`, `src/io.js` | NPY/NPZ and HDF5 readers |
| `src/cube.js` | validation, rebin, frequency / amplitude mapping, demo |
| `src/hands.js` | MediaPipe two-hand tracking (index landmark 8) |
| `src/audio.js`, `src/spectrum-worklet.js` | Web Audio synthesis |
| `deploy/docker/`, `compose.yaml` | Nginx static deploy |
| `tests/`, `data_example/` | unit tests/fixture; gitignored private examples |
| `AGENTS.md`, `operational_plan.md`, `to_do.md`, `timeline.md`, `scientific_notes.md` | agent workflow and scientific conventions |
| `legacy_audit.md`, `kickstart_thread_prompt.md` | inherited-code audit and local agent kickstart |

### Sources / acknowledgements

- Herakoi code supplied as `herakoi-web-main.zip` (React + MediaPipe Hands + Tone.js), **reimplemented independently**; no legacy source or binary asset copied into the new runtime. See `legacy_audit.md`.
- `cherakoi-thesis-main.zip`: baseline React/Nginx deployment, not adopted as an application implementation.
- `templates-dhlab-projects(1).zip`: DASH DARKLY theme inspiration, accent `#4196B4`, and `src/deploy` conventions.
- [dash-xrf-visualizer](https://github.com/androbomb/dash-xrf-visualizer), [chnet-xrf-raw-data-converter](https://github.com/androbomb/chnet-xrf-raw-data-converter) and its [output schema](https://github.com/androbomb/chnet-xrf-raw-data-converter/blob/master/output_schema.md).

**Licensing:** Before publishing, choose CHerakoi's license, check dependencies/model redistribution terms and attribute original student contributions as appropriate. License choice remains **TBD**.
