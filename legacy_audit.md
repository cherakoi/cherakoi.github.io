# CHerakoi bootstrap — source evidence audit

2026-11-21. Sources inspected: **uploaded archives** `herakoi-web-main.zip`, `cherakoi-thesis-main.zip`, `templates-dhlab-projects(1).zip`, `agents-project-template-master (2).zip`, plus two public XRF repositories. This is an audit of available source, NOT an execution of the old application.

| Source | What the code demonstrates | Decision |
|---|---|---|
| `herakoi-web-main/src/hooks/useHandDetection.js` | React hook uses legacy MediaPipe `@mediapipe/hands`, `maxNumHands: 1`, right-hand correction based on a mirror, `landmarks[8]`, and reads the **rendered canvas RGB**; delayed timeout and Tone.js `triggerAttackRelease` | Reimplement: two hands, direct spectral pixel sampling, no canvas readback, no React hook lifecycle issues |
| `herakoi-web-main/src/components/Controls.js` | Image upload via base64 Data URL; click-to-initialize Tone.js | Replace with browser NPZ/H5 upload and native Web Audio |
| `herakoi-web-main/src/components/CanvasDisplay.js` | Hidden webcam + mirrored canvas; 640×480 fixed layout | Unmirrored model input, mirrored coordinate space, fluid map |
| `herakoi-web-main/src/theme.js` | MUI light theme | REMOVE: DHLab dark theme was requested |
| `cherakoi-thesis-main` | Create React App default scaffold + Docker/Nginx; no XRF sonifier observed | Deployment pattern is useful, no need to migrate React |
| DHLab template `templates-similar-project/` | DARKLY style, accent `#4196B4`, `src/deploy`, lean project docs | KEEP concept, adapt to vanilla static web app |
| Supplied agents template | Evidence-first plans, small tests, strict docs ownership, bounded cleanup | KEEP; adapt agents instructions to front-end |
| `dash-xrf-visualizer` and `chnet-xrf-raw-data-converter` | Public contracts: `img` (H,W,C), optional calibrated `energy`; converter supplies `mask`, `metadata_json` and channel fields too | KEEP read contract, defer additional metadata handling |

## Major implementation differences / caveats

1. An exact acoustic mapping is **not uniquely defined** by the brief. Current prototype uses logarithmic mapping between tunable frequencies, sqrt-compressed amplitudes and top-K mixing; these are explicit hypotheses to validate, not measured correctness claims.
2. `xrfraw` has a strict integer-sum rebin contract; prototype includes generic fractional overlap for arbitrary C>512. This merits user confirmation, especially for measured/event-count semantics.
3. No dependencies or built assets from the old React implementation were transplanted. Its bundled legacy WASM files are not redistributed.
4. `data_example/` is ignored and empty in this package; real example data were not part of the request.
5. Licensing and authorship attribution for publication are an explicit follow-up.

## Useful source URLs

- https://github.com/herakoi/herakoi-web
- https://github.com/androbomb/dash-xrf-visualizer
- https://github.com/androbomb/chnet-xrf-raw-data-converter/blob/master/output_schema.md
- https://developers.google.com/edge/mediapipe/solutions/vision/hand_landmarker
- https://github.com/usnistgov/h5wasm
