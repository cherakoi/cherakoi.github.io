# CHerakoi — to do

## Done (M3.6: repo moved to org `cherakoi`, renamed `cherakoi.github.io` — 2026-11-24)
- [x] Org `cherakoi` created + repo transferred (user, web UI); rename + refs updated + push (agent)
- [x] Refs: CITATION.cff (`repository-code`, `url`), index.html footer links → `github.com/cherakoi/cherakoi.github.io`; git remote updated; old `androbomb/cherakoi` keeps permanent redirect
- [x] Make public (user, web UI) + Pages enablement + site verification: next iteration

## Done (M3.5: usable_data demo files — 2026-11-24)
- [x] "Usa demo file" button (next to the kept "Usa demo sintetica"): random pick from `usable_data/` via `manifest.json` — filename-independent; reuse of the existing `readXrfFile` path (File object), no loader changes
- [x] `manifest.json` + `npm run demo-manifest` (scripts/gen-manifest.mjs) to refresh the file list when the set changes
- [x] `usable_data/credits.md` formalized: names, affiliations (Mandò/Ruberto/Mazzinghi: UniFi Physics + INFN Florence; Castelli/Giambi: INFN Florence), emails as `_AT_`, students, LABEC/INFN-CHNet thanks
- [x] Footer: "Con ringraziamento a LABEC e INFN-CHNet per i dati di esempio" linking to the credits file on GitHub
- [x] Cache-buster `?v=v0.1.0-1`; `.ipynb_checkpoints/` gitignored; README (quick start + project files) updated
- [x] E2E real-browser: 4 real clicks → 2 different files loaded (145×215×512, ok), 0 errors; unit tests 14/14

## Done (M3.4: bin fisso → mappa del bin, esclusione reciproca, typo — user round 5, 2026-11-22)
- [x] `updateMapSums`: la mappa di grigi su bin si attiva anche con **Bin fisso** (non solo Mappa di grigi) — stessa selezione `selectedBin`, stesso ±N da `map-window-n`
- [x] Tre checkbox **mutuamente exclusive** (Suono solo il picco / Mappa di grigi / Bin fisso): check di uno → gli altri due off; deselect è libero (nessuno dei tre selezionato = OK). Implementato nel listener `input` esistente (3 righe)
- [x] Typo: "Sono solo il picco" → "Suono solo il picco"
- [x] Tooltip aggiornati (esclusione reciproca + bin fisso che attiva la mappa del bin)
- [x] Cache-buster bumpato a `?v=m3.3.1`
- [x] Verifica E2E real-browser: H_fixed ≠ H_base (mappa bin 50 sull'immagine, cache stabile), matrice esclusione 3/3 (check map-window→fixed-bin off, check peak→map-window off, uncheck→tutti off), 0 errori console, typo assente/nuovo presente
- [x] Unit test 14/14 (nessun cambio in cube.js)
- [ ] Per l'utente: verificare in uso reale che la mappa del bin con bin fisso faccia al caso suo

## Done (M3.3.1: cache-buster, xform centrata, tooltip — round 4 video, 2026-11-22)
- [x] Diagnosi: video 3 mostra HTML nuovo + comportamento M3.3 morto → `app.js` vecchio in cache nel browser dell'utente; E2E real-click su codice corrente: tutto funzionante (Shift mono, wheel +2/100px, frecce +1, fixed-bin + linea arancione, xform)
- [x] Cache-buster `?v=m3.3` su script module + stylesheet in `index.html` (convenzione: bump a ogni push che tocca `src/`)
- [x] Riga pulsanti xform centrata (era allineata a sinistra)
- [x] Tooltip hover su 10 controlli: xform ⟲/⟳/⇋/⇅, modalità mouse/rotella, cal m, cal q, picco ±N, mappa ±N, bin fisso
- [x] Verifica: script/CSS `?v=m3.3` caricati, `justify-content:center` via computed style, 10/10 title, smoke test full OK, 0 errori console
- [ ] Per l'utente: nuovo test — i 3 problemi del video 3 vanno a dissolvere con il cache-buster (se la rotella 2 bin/notch risultasse ancora "tanta", si abbassa: è un numero, una riga)

## Done (M3.3: wheel quantization, mono muting fix, 5 extra features — user test round 3, 2026-11-22)

- [x] Wheel quantization: 100 px = 1 notch = 2 bins (was 10 bins/notch, ~139 bins per 0.5 s in the user's video); `wheelRem` accumulator keeps trackpad momentum proportional; ↑/↓ = exactly 1 bin. — Verified headless: 100 px→+2, 1000 px→+20, demo cube 63→65.
- [x] Mono muting fix: the selected bin is no longer gated by count > threshold — sparse 0–1 count data is silent by gate, not by data. `chooseAmplitudes`: mono = volume · max(0.12, sqrt(selected/peak)) when selected > 0 && peak > 0; gain floor 0.12 keeps weak bins audible, empty bins stay silent. — Unit-tested (weak bin at floor, empty bin silent, exact values asserted).
- [x] Extra feature 1 — view transforms: ⟲/⟳ 90° and ⇋/⇅ flip the **picture only** (cube data untouched); `dispToCube` applies flips then rotation; the energy axis (left hand, wheel, arrows) stays screen-vertical by design (UI hint added). — E2E: identity/CW/FH/FV all map the bright demo spot (48,30)→(48,30) with exact coordinate readout; selection line at the correct y in identity and after CW.
- [x] Extra feature 2 — energy calibration inputs `Cal m` / `Cal q`: display shows E = q + m·bin (keV) for the selected bin; empty → ADC label. — E2E: m=0.01, q=0.1 → "E = 0.1 + 0.01·bin". Note: this is the UI side of decision option (B) for the uncalibrated C=500 cubes — the decision itself stays with the user.
- [x] Extra feature 3 — `Bin fisso` (fixed bin): checkbox + value override the left hand with a static bin, clamped to [0, C−1]. — E2E: chip "Bin 42 · 4.5 conteggi".
- [x] Extra feature 4 — `Fino al picco` (peak window): optional snap of the selection to the local maximum within ±N channels (N configurable, 0 = off). — Unit-tested (snap to local max; N=0 leaves the bin).
- [x] Extra feature 5 — `Mappa su bin` (map on bin): the map shows the per-pixel integral over ±N channels of the selected bin (`windowMap(cube, bin, N)` in `cube.js`, key-cached) instead of the total. — E2E: bin 0 (edge) map differs from the base at all 5 sample points.
- [x] All changes pass `node --check`, `npm test` (14/14 incl. rewritten mono test + new peakWindow/windowMap tests) and headless E2E (zero console errors).

## M3.3 leftovers (real hardware)

- [ ] User's feel: wheel step size on the physical mouse, mono audibility of weak bins, transform/flip UX.

## Done (M3.2: axis + mouse fine control — user test feedback 2026-11-22)

- [x] Frequency axis aligned to the visible data image, not the full canvas. — `leftBin` now maps through the `fit` (letterbox) region with end clamping; verified headless on Mantegna (top→bin 499, center→250, bottom→0).
- [x] Mouse fine control: ArrowUp/ArrowDown step the virtual left hand exactly 1 bin (engages it like Shift); wheel = 10 bins per notch, `deltaMode` normalized; Shift released → polyphony. — Verified headless (250→253→248, wheel +10/+10, keyup→"500 bins").
- [x] Lowered `minHandDetectionConfidence` 0.5→0.4 for reported missed hands. — **Live sensitivity needs the user's camera.**

## Done (M3.1: UI iteration — user test feedback 2026-11-21)

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

## In progress — branch `v0.1.2-mobile` (not merged)

- [ ] M3.7 mobile/touch: touch interaction (finger on map = pixel, finger on spectrum = bin, lift = hand off), input panels above the XRF map on narrow screens, small-screen polish. Merged to `main` when the user declares it finished (+ closure package).

## Blockers / uncertainties

- No camera device and no audio output in this sandbox: live tracking (incl. M3.1 skeletons, L/R fix, WebGPU delegate) and audible behavior remain unverified (headless DSP-level audio checks only).
- No approved choices yet for audio psychophysics and unusual channel-count rebin.

## Verification log

See `timeline.md` for observed checks, never infer end-to-end success from Node-only tests.
