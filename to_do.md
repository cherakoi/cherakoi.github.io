# CHerakoi — to do

## Now (M3.1: UI iteration — user test feedback 2026-11-21)

- [x] Taller camera preview + real-time hand skeletons (joints + index tip) on both map and camera preview. — camera-frame 142→240px, `object-fit:contain`, `#hands-overlay` canvas over the video; `extractHands` now returns `skeleton` landmark sets; `drawHandSkeleton` (21 bones + joints + larger index tip, x-mirrored) renders on map and camera overlay. **Overlay drawing on a live camera needs user hardware (no webcam headless).**
- [x] Fix inverted right/left. — M2's photo-based label swap produced inverted L/R in the user's live test; removed it, MediaPipe labels map 1:1, x mirrored once for the mirrored UI. Tests updated.
- [x] Colormap dropdown: current "terreic" default, grey (white=high/black=low), viridis, plus suggested inferno. — `<select id="colormap">` in panel 01; 256-entry LUTs (terreic/grey exact; viridis/inferno linear-interpolated matplotlib stops); change rebuilds the heatmap and re-renders (E2E caught the handler not re-rendering the visible canvas — fixed).
- [x] Rebinning: C>512→512, C<512 keeps C. — Already compliant in `cube.js` (4:1 sum; 500 and 2048 verified on real data, totals preserved). No code change.
- [x] Mouse mode: Shift+wheel raises/lowers the virtual left hand (mono); release Shift → polyphony. — `wheel` listener (passive:false) on the map; left-hand y clamped 0..1; keydown/keyup/blur reset. Verified headless via status lines (destra ON · sinistra ON → OFF after release).
- [x] MediaPipe "hands not seen" check. — GPU (WebGPU) delegate with CPU fallback in `HandTracker.start()`; ~15fps inference cap kept. **Not verifiable headless — needs the user's browser.**
- [x] All changes pass `node --check` + `npm test` (12/12) + headless E2E (zero console errors).

## Done (M2: browser integration)

- [x] Open the app on localhost and test the synthetic demo, mouse mode, Shift-left and audio after click. — Headless Chromium 145 (2026-11-21): demo, mouse poly/mono, off-map silence, audio start/stop and worklet DSP verified; **audible output not verifiable headless** (see `timeline.md`).
- [x] Verify **remote pinned** imports of MediaPipe Tasks, H5Wasm and fflate. — All resolve; **found and fixed P0: `@mediapipe/tasks-vision@0.10.22` does not exist on npm → pinned 0.10.21** (same file layout). GCS test image has no CORS headers (test-only concern, see `timeline.md`).
- [x] Upload `tests/fixtures/synthetic_xrf.npz`; check map and counts; generate and upload a synthetic H5 with `/img` and `/energy` from a local Python script or h5py fixture. — Both uploaded in browser; identical pixel-map hash, zero console errors. H5 fixture generated with h5py, values identical to NPZ (sum 57,630).
- [ ] Grant camera permissions; validate subject handedness and mirrored x coordinate with R only, L only, both, neither; verify silence on R loss and outside image bounds. — **Partial:** handedness semantics verified in browser via MediaPipe `detect()` on a frontal photo (anatomy-identified right hand → app right pointer, label swap in `extractHands`); live webcam paths (R/L/both/neither, R-loss silence) need a real camera.

## M2 leftovers (real hardware)

- [ ] Live webcam: R only, L only, both, neither; silence on R loss; occlusions; FPS under real H×W×C; hand skeletons visible on map and camera preview; L/R correct after the M3.1 swap removal.
- [ ] Audible check: no clipping/dropouts, perceived bottom→low/top→high, volume behavior.
- [ ] Docker/Nginx build and deploy smoke test on host (Docker not available in this sandbox).

## Next (M3: real XRF) — executed 2026-11-21, see `timeline.md`

- [x] User provides own NPZ in ignored `data_example/`; inspect only metadata and small sample first, not entire array or uploads to third-party services. — 3 NPZs inspected locally, metadata only.
- [x] Validate `C=512/1024/other`, monotonic energy, count totals against xrfraw, difference between zero and unacquired mask. — C=500 (kept as-is) and C=2048→512 (4:1 sum) verified in-app on real data; pixel spectra identical to `xrfraw.rebin_to` (converter venv); mask ≡ nonzero in mappa11 (redundant there). **Open:** the two C=500 files carry no `energy` — see below for the undecided convention.
- [ ] Decide non-divisible C rebin policy and exact acoustic mapping: topK vs all voices, amplitude linear/sqrt/log. — Still open (no real file with non-divisible C>512; 500 and 2048 both handled by current policy).
- [ ] Measure UI inference FPS, audio CPU, memory (with actual C and H×W), responsiveness to loss of hand. — Needs the live-camera/audio hardware run; headless only.
- [ ] **Decision (user):** energy convention for the uncalibrated C=500 cubes — (A) keep current: bin index normalized, no keV label (app already does this, "non calibrato"); (B) add an `m,q` fallback read from attrs/H5 attributes when present (M4 item, would need the real calibration for these two files); (C) reject files without energy. Not chosen arbitrarily.

## Later (M4)

- [ ] Add optional energy/metadata calibration `m,q` fallback (currently ignores H5 attributes / NPZ attrs JSON).
- [ ] Handle mask visualization, acquisition missingness and/or auto-silent mask.
- [ ] Shift NPZ/HDF5 decoding/rebin into a Worker for large data *if* profiled bottleneck.
- [ ] Vendor MediaPipe model/WASM + libraries if offline or privacy/SBOM policy requires it.
- [ ] Choose license/attribution, browser coverage, deploy behind HTTPS; verify Docker and security headers.

## Blockers / uncertainties

- No camera device and no audio output in this sandbox: live tracking (incl. M3.1 skeletons, L/R fix, WebGPU delegate) and audible behavior remain unverified (headless DSP-level audio checks only).
- No approved choices yet for audio psychophysics and unusual channel-count rebin.

## Verification log

See `timeline.md` for observed checks, never infer end-to-end success from Node-only tests.
