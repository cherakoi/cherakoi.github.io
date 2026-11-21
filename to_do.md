# CHerakoi — to do

## Now (M2: browser integration)

- [x] Open the app on localhost and test the synthetic demo, mouse mode, Shift-left and audio after click. — Headless Chromium 145 (2026-11-21): demo, mouse poly/mono, off-map silence, audio start/stop and worklet DSP verified; **audible output not verifiable headless** (see `timeline.md`).
- [x] Verify **remote pinned** imports of MediaPipe Tasks, H5Wasm and fflate. — All resolve; **found and fixed P0: `@mediapipe/tasks-vision@0.10.22` does not exist on npm → pinned 0.10.21** (same file layout). GCS test image has no CORS headers (test-only concern, see `timeline.md`).
- [x] Upload `tests/fixtures/synthetic_xrf.npz`; check map and counts; generate and upload a synthetic H5 with `/img` and `/energy` from a local Python script or h5py fixture. — Both uploaded in browser; identical pixel-map hash, zero console errors. H5 fixture generated with h5py, values identical to NPZ (sum 57,630).
- [ ] Grant camera permissions; validate subject handedness and mirrored x coordinate with R only, L only, both, neither; verify silence on R loss and outside image bounds. — **Partial:** handedness semantics verified in browser via MediaPipe `detect()` on a frontal photo (anatomy-identified right hand → app right pointer, label swap in `extractHands`); live webcam paths (R/L/both/neither, R-loss silence) need a real camera.

## M2 leftovers (real hardware)

- [ ] Live webcam: R only, L only, both, neither; silence on R loss; occlusions; FPS under real H×W×C.
- [ ] Audible check: no clipping/dropouts, perceived bottom→low/top→high, volume behavior.
- [ ] Docker/Nginx build and deploy smoke test on host (Docker not available in this sandbox).

## Next (M3: real XRF)

- [ ] User provides own NPZ in ignored `data_example/`; inspect only metadata and small sample first, not entire array or uploads to third-party services.
- [ ] Validate `C=512/1024/other`, monotonic energy, count totals against xrfraw, difference between zero and unacquired mask.
- [ ] Decide non-divisible C rebin policy and exact acoustic mapping: topK vs all voices, amplitude linear/sqrt/log.
- [ ] Measure UI inference FPS, audio CPU, memory (with actual C and H×W), responsiveness to loss of hand.

## Later (M4)

- [ ] Add optional energy/metadata calibration `m,q` fallback (currently ignores H5 attributes / NPZ attrs JSON).
- [ ] Handle mask visualization, acquisition missingness and/or auto-silent mask.
- [ ] Shift NPZ/HDF5 decoding/rebin into a Worker for large data *if* profiled bottleneck.
- [ ] Vendor MediaPipe model/WASM + libraries if offline or privacy/SBOM policy requires it.
- [ ] Choose license/attribution, browser coverage, deploy behind HTTPS; verify Docker and security headers.

## Blockers / uncertainties

- No user's real XRF file yet.
- No camera device and no audio output in this sandbox: live tracking and audible behavior remain unverified (headless DSP-level audio checks only).
- No approved choices yet for audio psychophysics and unusual channel-count rebin.

## Verification log

See `timeline.md` for observed checks, never infer end-to-end success from Node-only tests.
