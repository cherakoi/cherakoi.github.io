# CHerakoi — project rules for coding agents

This is a **hybrid migration / new frontend**. Authoritative sources: current source under `src/`, `operational_plan.md`, `scientific_notes.md`, and `legacy_audit.md`. Read them before changing behavior. This file adapts the supplied `agents-project-template` and DHLab conventions; the user has explicitly authorized creation of this draft.

## Project snapshot

- Objective: an entirely browser-side CH-themed sonifier of XRF cubes `(H,W,C)` with MediaPipe right/left index interaction.
- Current milestone: M2 browser end-to-end verification; M1 source scaffold and numeric tests are done (script-only).
- Key KPI: correct pixel/channel mapping + count conservation + right-absent silence / left mono-poly mode, **confirmed in a real camera test**.
- Non-negotiables: keep it readable, frontend-only, `src/` + `deploy/`, dark DHLab color scheme `#4196B4`, data private, no undocumented spectral transformations.

## How to work

1. Read `README.md`, `operational_plan.md`, `to_do.md`, `timeline.md`, `scientific_notes.md`, `legacy_audit.md`. Inspect source + `git status` read-only before edits. Do not confuse proposed features with verified ones.
2. Make the **smallest coherent change**. Prefer vanilla JS and native browser APIs. Avoid React/Vite/servers/backends unless profiling/testing demonstrates necessity and user approves the dependency.
3. Do not copy legacy student source or binary MediaPipe assets into CHerakoi without provenance/license clearance. The 15 MB Herakoi ZIP is **not** part of the new runtime. Inspect legacy in read-only mode if supplied separately.
4. Keep boundaries: `io.js` and `npy.js` parse inputs; `cube.js` contains **pure functions and data invariants**; `hands.js` deals only with tracking; `audio.js`/worklet deal with sound; `app.js` handles DOM and glue.
5. Never load `data_example/` into git, network requests, console logs or test fixtures. The browser may request libraries and model assets; the XRF File stays local. Request explicit approval before introducing upload/telemetry.
6. Scientific guardrails: count-preserving sum rebin, original cube read-only; energy mapping monotonic / declared units; no invented calibration, no arbitrary rescaling of physics counts before threshold without documentation. Honor the right/left behavior described in `scientific_notes.md`.
7. Before changing data algorithms, run `npm test` and add **small invariance tests**, preferably synthetic. Run `node --check src/*.js` (or individually) after changes. One focused cleanup pass per milestone; no sweeping refactors.
8. Browser smoke tests: `python -m http.server 8000`; test NPZ and H5 independently, camera on localhost HTTPS where needed, console CORS exceptions, correct mirror/handedness, no audio when camera loses tracking; document browser and hardware. Docker only counts as verified if actually run.
9. Task closeout: changed files, verification evidence, unverified risks; update `timeline.md` only with observed history, `to_do.md` with near-term actions and `operational_plan.md` only when strategy changes. Mark `NOT TESTED` rather than assuming success.

## Workflow guardrails

- Do not install/change packages or download large models in bulk without approval. Runtime CDNs already appear in the draft; pin exact versions and verify link integrity when possible.
- Do not modify the user's real XRF datasets. Use tiny synthetic fixtures for automated tests.
- After a meaningful implementation, do **one bounded Ponytail-style simplification review** if available (or perform its principles manually); don't add a review loop.
- Preserve pragmatic design: up to ~10 source files is fine, a dependency-heavy framework for a static site is not a goal.
