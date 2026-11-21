# CHerakoi — compact instructions for local agents

- Work only in the CHerakoi repo root, first inspect `git status`, `README.md`, `AGENTS.md`, `operational_plan.md`, `scientific_notes.md`, `to_do.md`, `timeline.md`, `legacy_audit.md`.
- This is a **hybrid project**: code draft and plans exist; tests are unit-only. Do not declare camera/audio/HDF5 verified without browser evidence.
- Architecture: browser-only; keep `index.html`, `src/`, `deploy/docker/`, no Python/Dash server; accent #4196B4 DARKLY-like. No React unless specifically justified and approved.
- Data: `img` (H,W,C) with optional 1-D keV `energy`. Only files selected in the browser. `data_example/` is private and gitignored; no production data in tests or network.
- Hands: MediaPipe 2 hands, index landmark 8; R absent or outside the **image** => mute; L absent => poly above threshold; L present => isolated bin, y bottom low/top high.
- Scientific: sum-rebin conserves counts; note nondivisible fractional handling differs from xrfraw. Pitch logarithmic with energy/channel; amplitude design sqrt + gain-normalized topK is provisional.
- Tests: `npm test`, `node --check src/*.js` (individual CLI paths if glob unavailable); browser smoke on localhost; do not install npm packages unnecessarily.
- Changes: smallest effective patch, bounded simplification pass, log real outcomes; mark NOT TESTED and open decisions clearly.
