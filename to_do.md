# CHerakoi — to do

## Now (M2: browser integration)

- [ ] Open the app on localhost and test the synthetic demo, mouse mode, Shift-left and audio after click. Record browser version and audible behavior; check no clipped sound.
- [ ] Verify **remote pinned** imports of MediaPipe Tasks, H5Wasm and fflate. Fix any CDN/WASM URL/CORS problems with minimal changes.
- [ ] Upload `tests/fixtures/synthetic_xrf.npz`; check map and counts; generate and upload a synthetic H5 with `/img` and `/energy` from a local Python script or h5py fixture.
- [ ] Grant camera permissions; validate subject handedness and mirrored x coordinate with R only, L only, both, neither; verify silence on R loss and outside image bounds.

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
- No browser-network verification of CDN libraries, camera/WASM and HDF5 in this session.
- No approved choices yet for audio psychophysics and unusual channel-count rebin.

## Verification log

See `timeline.md` for observed checks, never infer end-to-end success from Node-only tests.
