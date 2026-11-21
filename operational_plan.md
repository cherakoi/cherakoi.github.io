# CHerakoi — operational plan

**Scope:** explicitly requested bootstrap + functional draft and agent-ready handoff, 2026-11-21. Current status: *M1 draft completed; M2 executed in headless Chromium 145 (2026-11-21, see `timeline.md`): NPZ/H5/rebin/audio-DSP/network verified, live camera and audible output still pending*. User controls final scientific/audio choices. Sources: see `legacy_audit.md`.

## 1. Problem / non-goals

Transplant a Herakoi-like gesture-based color-to-sound interaction into an XRF sonifier for Cultural Heritage. The new input is a numeric `img` cube `(H,W,C)` rather than image RGB; output is audible frequency components driven by counts and selected energy bin. The app must remain entirely in the user's browser and aesthetically match DHLab's DARKLY look with INFN cyan `#4196B4`.

Not in scope: Python or Dash server, PyPI, shared backends, element identification, real-time XRF acquisition, cloud upload, audio recording, data export, machine-learning model training.

## 2. Technical design and contracts

```text
XRF .npz / .h5 uploaded locally
  └─ io.js → parse img + optional energy → validate & sum rebin to <=512
       ├─ map image (integrated counts, display-only log)
       └─ selected spectrum J[y,x,:] → threshold/amplitudes → AudioWorklet
Camera → MediaPipe HandLandmarker (2 hands) → index #8 (L/R)
       ├─ right missing -> silence
       ├─ right present + left missing -> top-K poly spectrum
       └─ right present + left present -> left-Y selected energy bin
Nginx → serves only index.html + src/ (no XRF request/POST routes)
```

**Deploy:** static files for development via `python -m http.server 8000`; minimal `deploy/docker/Dockerfile` and `compose.yaml` for production-like hosting. **No package manager/build** required. The app is NOT self-contained offline due to remotely fetched MediaPipe tasks/model, fflate, and h5wasm. Docker itself is **NOT TESTED**.

**Source organization:** 7 small independent JS responsibilities under `src/`, one worklet, CSS, HTML. `index.html` and `src/` remain static deployment assets. Directory `data_example/` is gitignored.

## 3. Acceptance tests

| ID | Requirement | Minimum evidence | Status |
|---|---|---|---|
| F1 | NPZ key `img`, (H,W,C) + optional energy | Numeric parser tests + upload of real fixture | Browser-verified: fixture NPZ upload, map, counts, 0.1/8.1 keV calibration |
| F2 | HDF5 `/img` + optional `/energy` | Browser upload of synthetic H5 then real H5 | Verified: synthetic H5 and real H5 (`mappa11_2048.h5`) both uploaded, identical pixel-map hash to the matching NPZ |
| F3 | C=512,1024 and arbitrary C with conserved count sums | tests with C=2,5,1024; compare with xrfraw | Verified: unit tests; 1024→512 synthetic in browser; **real-data 2048→512 pixel spectra identical to `xrfraw.rebin_to`**, C=500 kept as-is (see scientific_notes §8) |
| F4 | Right fingertip selects XRF pixel, outside/missing silences | Mouse mode + two-handed camera smoke test with mirror & crop | Partial: mouse selection, letterbox and off-map silence browser-verified; live camera pending |
| F5 | Left absent mix / left present isolated bin, bottom→low, top→high | numeric policy tests + live audio | Partial: poly (multi-bin), mono (exactly 1 bin, bottom→low/top→high) and silent paths verified via worklet amplitude spy; audible output pending |
| F6 | Accessible, fluid DHLab dark UI | screenshot + manual inspection desktop/mobile | Partial: desktop + 390px viewport, no horizontal overflow, topbar #4196B4; manual aesthetic review pending |
| F7 | Browser-only local data; Nginx static serving | devtools network/POST inspection; Docker | Partial: network audit shows zero XRF data leaving the page (only pinned CDN + GCS model); Docker untested |
| F8 | No clipping/dropouts under normal spectral load | Worklet audio tests, peak/RSS, latency, CPU | Partial: worklet DSP verified headless (RMS 0.68, tanh peak 0.986, exact zero when silent); CPU/latency under load unmeasured |

## 4. Milestones

- **M0 — inventory & decisions.** Inspect four supplied zips, two XRF repos; outline KEEP/REMOVE/ADD, choose no-React static strategy. **Done (source-based review).**
- **M1 — runnable scaffold & pure algorithms.** Static layout, readers, rebin, synthetic fixture, two-hand extraction, audio DSP, unit tests, docs. **Draft implemented; numeric tests pass; runtime paths unverified.**
- **M2 — browser end-to-end.** On desktop Chrome/Firefox (real server/HTTPS): synthetic NPZ+H5, camera, MediaPipe, wasm fetch, AudioWorklet and interactions; observe logs; fix actual runtime issues. **Executed in headless Chromium 145 on 2026-11-21 (see `timeline.md`); live camera + audible audio remain.**
- **M3 — scientifically correct real-data acceptance.** Executed 2026-11-21 in headless Chromium 145 on the user's 3 NPZs + reference H5 (see `timeline.md`): load/render/calibration labels, 2048→512 rebin identical to `xrfraw.rebin_to` at pixel level, NPZ↔H5 map-identical, audio policy on real counts. Remaining: non-divisible-C policy (no such real file yet), energy convention for the uncalibrated C=500 cubes (user decision, `to_do.md`), live FPS/CPU on hardware.
- **M4 — performance, deployment hardening & release.** Large H5 chunk/worker strategy if needed, benchmark 24/32/64/512 voices, vendored offline assets optional, test Nginx behind TLS, license and attribution. **Deferred.**

**Go/no-go for a demo:** only mark app feature-complete once F1-F5 pass in browser on real hardware, including without left hand (poly) and with left hand (mono); validate mute upon right-hand loss.

## 5. Risks and decisions

| Question / risk | Current draft choice | Evidence or decision needed |
|---|---|---|
| Mapping energy→pitch | log frequency interpolation 110–1760 Hz, tuneable | User listening tests, min/max and timbral mapping |
| Counts→amplitude | sqrt compressed, gain normalized | compare proportional/raw/sqrt/log scales for audibility |
| 512 simultaneous frequencies | voice cap default 32, max up to C | CPU + audio stability tests |
| C not divisible by 512 | fractional-overlap sum, not integer-event exact | approve or instead reject non-divisible C |
| Input C<512 | keep C (no invented channels) | approve if user wants exactly 512 interpolated channels |
| Calibrated energy | use optional `/energy`, ignore calibration attrs until coded | cross-check against converter output, calibrations; handle absent energy |
| Mask/no acquired pixels | all zeros displayed as dark pixels | need `mask` reader/indicator, important for scientific interpretation |
| Browser RAM & blocking | synchronous NPZ decompression, H5 WASM main thread, 400-MiB NPZ cap | measure real data; chunk/worker on evidence |
| Left/right handedness | MediaPipe labels assume mirrored input; app swaps them (`extractHands`) | Verified on frontal photo with unambiguous chirality; live camera test including front-facing webcam still open |
| Hosting | CDN model and library assets; HTTPS via external reverse proxy | decide vendoring / offline requirements |
| Licenses | no license assigned in ZIP, no legacy assets copied | user and collaborators' decision |

## 6. Resource and safety controls

No production data, credentials or personal images are stored by app code; webcam frames are processed in page memory. Third-party model/scripts must be fetched from pinned external origins; review CSP and supply-chain implications before public deployment. Don't upload XRF files externally. Do not add unnecessary dependencies. Avoid large data scans in automated tests; use tiny fixtures for invariants.

## 7. First local-agent action (M2)

Inspect existing code before edits; launch local server; use Chrome/Firefox to verify demo and small NPZ. Confirm external task model, JS ESM imports and audio worklet with browser console. Add a test documenting each reproduced bug. Then run small targeted tests and document verified behavior. Ask user for real `.npz`/`.h5` only after these smoke tests pass. See `kickstart_thread_prompt.md`.
