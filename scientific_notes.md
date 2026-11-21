# CHerakoi — scientific and DSP notes (draft 2026-11-21)

## 1. Definition of the XRF cube

`I[y,x,k] >= 0` contains X-ray event counts, with `(H,W,C)` spatial/spectral order. This corresponds to the `img` contract in the two referenced XRF repositories. Optional energy values `E[k]` are expressed in **keV** by the converter and must be strictly increasing for this prototype. Calibration metadata without an `energy` array is **not yet parsed**. When no energy array exists, **the channel index is used as an ordinal proxy**, not an asserted physical-energy coordinate. Never label the latter as keV.

## 2. Sum-rebin and count preservation

Let `C_in` be original spectral depth and `C_out=min(C_in,512)`.

- When `C_in % C_out = 0`, group `g = C_in / C_out` adjacent original bins by **sum**: `J[y,x,j] = sum_{i=j*g}^{(j+1)*g - 1} I[y,x,i]`.
- When not divisible, divide the original spectral axis into contiguous real-valued intervals, and **apportion bin counts by interval overlap**. This yields fractional derived counts; the total per pixel remains equal to the original total in exact arithmetic. Fractional splitting assumes counts uniformly distributed within an original bin and is **an approximation**.
- When `C_in < 512`, preserve `C_in` rather than upsampling, which would create fictitious spectral resolution.
- Derived channel energy is linearly interpolated at the new-bin midpoint (no acquisition metadata is overwritten). This is suitable for linear calibration; a non-linear calibration deserves explicit edge-aware testing.

`src/cube.js` stores derived values as Float32Array, so numerical conservation is approximate. `tests/core.test.js` checks exact 1024→512 for small inputs and a general 5→3 case. Future: compare with `xrfraw.rebin_to`, confirm large uint32 counts and overflow/rounding semantics, implement streaming/channel-chunk rebinning if needed.

**Important parity note:** the `xrfraw.rebin_to()` contract is strict about integer group divisibility and sum. CHerakoi's fallback for arbitrary C uses **fractional overlaps** and is *not identical* to `xrfraw` for nondivisible C. This is an explicit new design choice to confirm with the user.

## 3. Image mapping

Displayed intensity is `S[y,x]=sum_k J[y,x,k]`; grayscale-blue brightness uses `log1p(S)/log1p(max(S))` for visualization only. The pointer samples **J, not the display RGB**. The image is letterboxed with preserved aspect ratio; positions outside the displayed cube area are silent. The webcam receives **unmirrored frames** for MediaPipe. MediaPipe's handedness labels assume a *mirrored* (selfie) input, so on unmirrored frames they are swapped relative to the subject; `extractHands` swaps them so the subject's right hand controls the pointer and the left hand selects the bin. The returned x is mirrored *once* for user-facing map coordinates. Verified 2026-11-21 on a frontal photo with unambiguous hand chirality (anatomy-identified subject right hand is labeled 'Left' by the model). This avoids the legacy code's canvas-pixel bug.

## 4. From energy/bin to audio frequency

Per output bin `j`, define `u_j = (E[j]-E[0])/(E[C_out-1]-E[0])` with valid monotonic calibration, otherwise `u_j=j/(C_out-1)`. For `C_out=1`, use `u_0=0`. The acoustic frequency is

`f_j = f_min * (f_max / f_min) ** u_j`, by default `f_min=110 Hz`, `f_max=1760 Hz` (4 octaves). Frequencies increase **monotonically with energy** (not equal linear steps in Hertz). This is a perceptual/logarithmic mapping, NOT a physical conversion keV→Hz. Frequency range is configurable, currently 20 <= min < max <= 10000 Hz; alias/latency guardrails should be revisited for portable low sample rates.

## 5. Hands and amplitudes

- Right hand absent or index fingertip outside displayed XRF image: `A_j=0` for all j.
- Right hand present, left index absent: take counts `n_j=J[y,x,j]`, include those **strictly above** threshold `tau`; set `w_j=sqrt(max(n_j-tau, 0))`. Select the top K weights (`K=32` default, UI up to 512) and normalize: `A_j = V * w_j / sum_{selected} w_k`. The cap controls polyphony; values below threshold are silent.
- Right hand present, left index on camera: select `j=floor((1 - y_left) * C_out)`, clamped to `[0,C_out-1]`. At bottom y=1 -> lowest bin; at top y=0 -> highest bin. Other frequencies are silent. `A_j = V * sqrt((n_j-tau)/(max_k n_k-tau))` when selected n_j>tau, otherwise 0.
- `V` is the UI master volume fraction. AudioWorklet smooths amplitudes with ~12 ms one-pole envelope, maintains oscillator phase while active and limits output with `tanh`, and emits 2 identical stereo channels. No binaural spatialization or sample playback.

These gain choices are **musical design decisions** rather than uniquely implied by XRF physics. In particular the mixture is normalized to avoid clipping; raw count ratios are retained only in square-root relative weights. To compare physically proportional amplitude vs compressed amplitude, implement and evaluate alternatives in an explicit follow-up.

## 6. Interpretation and risks

- Dense, closely spaced frequencies generate beating and a perceptually noisy signal; default K=32, K=512 is CPU-heavy. A musical-scale/peak-picking approach is an alternative, but it would no longer map every bin uniquely to a monotonic frequency.
- Browser main-thread inference and synchronous NPZ/HDF5 reads can cause latency. Model, input size, network and sample rate are **not benchmarked**.
- For extremely large arrays, NPZ decompression + original plus derived Float32 buffers may exceed browser RAM. Current NPZ size guard uses 400 MiB for the *uncompressed* `img.npy`; HDF5 uses a rough estimate only, not a reliable peak-RSS cap.
- Masked/unacquired pixels in `xrfraw` are zeros; this prototype does not yet read the optional `mask` or show a special symbol for unacquired pixels. This matters for scientific interpretation.
- Hardware-dependent webcam left/right errors, occlusions, hand skeleton jitter, background reflection, and hand identification swaps require real validation.

## 7. Privacy and external library considerations

Image/XRF payloads are not uploaded by the CHerakoi source. The MediaPipe npm package documentation (November 2026) nevertheless reports usage/performance metrics collection; before public deployment, review the precise SDK privacy behavior and institutional consent/compliance. Serving the core assets from a local proxy does not by itself eliminate SDK telemetry. 

## 8. Real-data observations (2026-11-21)

Observed on the user's three NPZs (private; metadata inspected locally, nothing uploaded):

- **mappa11 (76×286×2048, uint32).** Converter attrs (JSON) record `n_events = 19,825,090`, equal to the `img` sum; `mask` True fraction (99.646%) equals the nonzero-pixel fraction exactly — in this cube the mask is redundant, but the app still does not read it (see §6). `energy[0] = −0.0356 keV` is the calibration offset `q = −0.0355556` (m = 0.0207407 keV/ch), not an acquired negative-energy bin; the app's derived-bin calibration shows midpoints (−0.004 keV first derived bin) per §2, and the raw arrays are never modified. The file was produced by the converter from 16384 raw channels with `rebin size=8 how=sum` (16384→2048); the app's further 2048→512 4:1 sum is count-conserving. Both rebin stages verified against `xrfraw.rebin_to` (converter venv) at pixel level on 2026-11-21.
- **Mantegna (76×177×500) and Ragazzo (145×212×500), float32 counts, no `energy`.** C=500 < 512 so no rebin applies; the app treats them as uncalibrated ADC bins ("ADC bins · non calibrato") and normalizes bin index to [0,1] for frequency mapping. Counts are float (calibrated pipeline), and uint32 integer arithmetic in the threshold path is not assumed anywhere in the app (comparisons only), so both dtypes behave the same.
- **Open decision (user, see `to_do.md`):** the energy convention for uncalibrated cubes — keep the current bin-index behavior (A), add an `m,q` fallback from attrs/H5 attributes when present (B, would need the real calibration for these two files), or reject files without energy (C). No choice was made. 
