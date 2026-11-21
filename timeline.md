# CHerakoi — timeline (append-only)

- **2026-11-21** — Inspected four user archives: DHLab template, agents template, legacy Herakoi JS, CHerakoi thesis scaffold. Observed `maxNumHands:1` and RGB canvas sampling in original Herakoi hook; no real XRF loader there. Compared the public xrf converter `output_schema.md` and xrf-visualizer README.
- **2026-11-21** — Created static vanilla-JS bootstrap, XRF NPZ/H5 adapters, sum rebin, browser audio worklet, MediaPipe hand tracking, DHLab-inspired dark view, mouse test mode, Docker Nginx recipe and agent docs. No real user's data copied into source.
- **2026-11-21** — `node --check src/*.js` passed syntax checks; `npm test` completed 11/11 Node tests for NPY, counts, audio policy, handedness and synthetic demo. This **does not** establish real browser behavior, live sound or HDF5 correctness.
- **2026-11-21** — Attempted a Chromium headless screenshot in the sandbox; Chromium hung and the attempt timed out, yielding no screenshot or validated visual smoke test. Browser visual/camera QA remains NOT TESTED.
- **2026-11-21** — Independently validated the NPY parser against actual `np.savez_compressed` output generated with NumPy: `img` uint32 (4,5,17), `energy` float64 (17,), 57,630 total counts preserved and energy endpoints 0.1/8.1 keV. This checks the internal `npy.js` reader, not the browser CDN NPZ unzip workflow.
