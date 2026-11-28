// IT/EN UI strings. IT is the default and stays exactly as the original UI.
// Keys must match 1:1 between languages (tests/i18n.test.js).
export const STRINGS = {
  it: {
    subtitle: `Esplora uno spettro XRF con le dita. Destra: pixel. Sinistra: selezione della frequenza, oppure ascolto polifonico.`,
    msgWelcome: `Carica un file XRF oppure avvia la demo sintetica.`,
    mapTitle: `Mappa XRF`, mapTitleAccent: `/ spatial view`,
    mapSub: `Intensità integrata per pixel • scala logaritmica`,
    mapMetaEmpty: `Nessun cubo`,
    mapAria: `Mappa dell'intensità XRF, esplorabile con le mani o il mouse`,
    legendRight: `Indice destro`, legendLeft: `Indice sinistro`,
    ttCcw: `Ruota l'immagine di 90° in senso antiorario. Ruota solo la vista: i dati del cubo non cambiano e l'asse energia resta verticale.`,
    ttCw: `Ruota l'immagine di 90° in senso orario. Ruota solo la vista: i dati del cubo non cambiano e l'asse energia resta verticale.`,
    ttFh: `Specchia l'immagine orizzontalmente (sinistra↔destra). Solo la vista: i dati del cubo non cambiano.`,
    ttFv: `Specchia l'immagine verticalmente (alto↔basso). Solo la vista: i dati del cubo non cambiano.`,
    xformHint: `Rotazione/flip ruotano solo l'immagine: l'asse energia (mano sinistra, rotella, ↑/↓) resta verticale.`,
    coordEmpty: `Pixel: —`,
    coord: (x, y) => `Pixel: x ${x}, y ${y}`,
    handsEmpty: `Mani: —`,
    hands: (r, l) => `Mani: destra ${r ? 'ON' : 'OFF'} · sinistra ${l ? 'ON' : 'OFF'}`,
    audioSilence: `Audio: silenzio`,
    audioStatus: (mode) => `Audio: ${mode}`,
    audioModeSilence: `silenzio`, audioModePoly: `polifonia`, audioModeMono: `singolo bin`, audioOff: `disattivato`,
    specTitle: `Spettro del pixel`, specTitleAccent: `/ energy bins`,
    specSub: `Conteggi grezzi dopo rebin, soglia visualizzata`,
    specAria: `Spettro XRF per pixel`,
    p1Title: `Dataset XRF`,
    uploadStrong: `Carica un file XRF`,
    uploadSub: `.npz / .h5 / .ome.tif / .ome.tiff / .fits — riconosciuti per contenuto`,
    btnDemo: `Usa demo sintetica`, btnDemoFile: `Usa demo file`,
    ttDemoFile: `Click per nuova selezione casuale`,
    colormap: `Colormap`,
    optTerreic: `Terreic (default)`, optGrey: `Grey (bianco = alto)`, optViridis: `Viridis`, optInferno: `Inferno`,
    dsFile: `File`, dsShape: `Shape / rebin`, dsCal: `Calibrazione`,
    calMLabel: `Calibrazione m (keV/bin)`,
    ttCalM: `Fattore di calibrazione lineare m: E[bin] = q + m·bin, in keV. Da usare con q: compilando entrambi, asse, frequenze ed etichetta del bin visualizzato passano da ADC a keV.`,
    calQLabel: `Calibrazione q (keV)`,
    ttCalQ: `Offset di calibrazione lineare q: E[bin] = q + m·bin, in keV. Da usare con m: compilando entrambi, asse, frequenze ed etichetta del bin visualizzato passano da ADC a keV.`,
    hintDataset: `Con m e q compilati, asse e frequenze usano E[bin] = q + m·bin sul bin visualizzato (altrimenti: ADC). I file rimangono nel browser; nessun upload al server. OME-TIFF e FITS usano librerie locali; NPZ/HDF5 scaricano fflate e h5wasm da CDN al primo uso.`,
    p2Title: `Tracking e audio`,
    btnCamStart: `Avvia camera`, btnCamStop: `Stop camera`,
    camCaption: `Anteprima specchiata · il modello riceve il video non specchiato`,
    btnAudioStart: `Attiva audio`, btnAudioStop: `Silenzia`,
    ttMouseMode: `Il cursore sul plot è la mano destra; Shift o le frecce ↑/↓ sono la mano sinistra. Con la mano sinistra attiva: la rotella sposta il bin di 2 bin per ogni tacca di ~100px (proporzionale per i flick del trackpad) e le frecce di 1 bin; rilasciando Shift si torna alla polifonia.`,
    mouseModeLabel: `Modalità mouse per test (Shift o ↑/↓ = sinistra · rotella = 2 bin/tacca, ↑/↓ = 1 bin · Shift rilasciato = polifonia)`,
    hintCameraPre: `Camera e audio richiedono un gesto esplicito. La camera funziona su`,
    hintCameraPost: `o HTTPS.`,
    p3Title: `Sonificazione`,
    lblThreshold: `Soglia conteggi`, lblVoices: `Voci massime simultanee`, lblVolume: `Volume`,
    lblFreqMin: `Min Hz`, lblFreqMax: `Max Hz`,
    ttPeak: `Invece di suonare il bin esatto sotto la mano, suona il massimo locale entro ±N canali (N=0 disattiva la finestra). Mutuamente esclusivo con Mappa di grigi e Bin fisso: attivarlo disattiva gli altri due.`,
    peakPrefix: `Suono solo il picco: massimo locale in ±`,
    lblChannels: `canali`,
    ttMapWin: `Il plot di grigi mostra l'integrale dei conteggi su ±N canali del bin selezionato, invece della somma su tutti i canali. Serve con la mano sinistra (o Bin fisso) attiva. Mutuamente esclusivo con Suono solo il picco e Bin fisso: attivarlo disattiva gli altri due.`,
    mapWinPrefix: `Mappa di grigi sul bin: integrale ±`,
    ttFixed: `Fissa il bin sonificato al valore indicato, senza usare la mano sinistra. Con la mano destra (o il cursore) sul plot: barra arancione sul bin, suono vincolato a quel canale e mappa di grigi del bin sull'immagine (come Mappa di grigi); senza pixel sul plot non c'è spettro da sonificare. Mutuamente esclusivo con gli altri due: attivarlo li disattiva.`,
    fixedPrefix: `Bin fisso (fissa il ruolo della mano sinistra): `,
    legendROff: `Destra assente → silenzio`, legendLOff: `Sinistra assente → mix spettrale`, legendLOn: `Sinistra presente → singolo bin`,
    footerHerakoi: `Con i ringraziamenti al progetto originale`,
    footerLabec: `Con ringraziamento a LABEC e INFN-CHNet per i dati di esempio`,
    ttCredits: `Crediti dei dati di esempio (usable_data/)`,
    canvasEmpty: `Carica un cubo XRF per iniziare`,
    loaded: (n) => `${n} caricato. Controlli pronti: avvia audio e camera, oppure prova il mouse.`,
    errDemoFile: (m) => `Impossibile caricare la demo file: ${m}`,
    reading: (n) => `Lettura locale di ${n}…`,
    errLoad: (m) => `Impossibile caricare: ${m}`,
    camInit: `Inizializzazione MediaPipe e richiesta accesso camera…`,
    camActive: `Camera attiva: indice destro sul pixel, indice sinistro per isolare una frequenza.`,
    camErr: (m) => `Camera: ${m}`,
    camStopped: `Camera disattivata.`,
    audioOn: `Audio attivo: il suono parte solo quando il puntatore destro è sulla mappa.`,
    webAudioErr: (m) => `Web Audio: ${m}`,
    audioMuted: `Audio silenziato.`,
    mouseHint: `Mouse test: cursore = mano destra; Shift o frecce ↑/↓ = mano sinistra (rotella = 2 bin per tacca, ↑/↓ = 1 bin); Shift rilasciato = polifonia.`,
    demoName: `Demo sintetica (60×96×128)`,
    spectrumBins: (c) => `${c} bins`,
    spectrumBin: (b, n) => `Bin ${b} · ${n} conteggi`,
    calUncal: `ADC bins · non calibrato`,
    srcEnergyTable: `tabella ENERGY`, srcCalibration: `calibrazione m/q`,
    srcEnergyAxis: `asse energy (OME)`, srcEnergyNpy: `energy.npy`,
    validSuffix: `validi`,
  },
  en: {
    subtitle: `Explore an XRF spectrum with your fingers. Right hand: pixel. Left hand: frequency selection, or polyphonic listening.`,
    msgWelcome: `Load an XRF file or start the synthetic demo.`,
    mapTitle: `XRF map`, mapTitleAccent: `/ spatial view`,
    mapSub: `Integrated intensity per pixel • logarithmic scale`,
    mapMetaEmpty: `No cube`,
    mapAria: `XRF intensity map, explorable with hands or mouse`,
    legendRight: `Right index`, legendLeft: `Left index`,
    ttCcw: `Rotate the image 90° counter-clockwise. View only: the cube data does not change and the energy axis stays vertical.`,
    ttCw: `Rotate the image 90° clockwise. View only: the cube data does not change and the energy axis stays vertical.`,
    ttFh: `Flip the image horizontally (left↔right). View only: the cube data does not change.`,
    ttFv: `Flip the image vertically (top↔bottom). View only: the cube data does not change.`,
    xformHint: `Rotation/flip only rotate the picture: the energy axis (left hand, wheel, ↑/↓) stays vertical.`,
    coordEmpty: `Pixel: —`,
    coord: (x, y) => `Pixel: x ${x}, y ${y}`,
    handsEmpty: `Hands: —`,
    hands: (r, l) => `Hands: right ${r ? 'ON' : 'OFF'} · left ${l ? 'ON' : 'OFF'}`,
    audioSilence: `Audio: silence`,
    audioStatus: (mode) => `Audio: ${mode}`,
    audioModeSilence: `silence`, audioModePoly: `polyphony`, audioModeMono: `single bin`, audioOff: `off`,
    specTitle: `Pixel spectrum`, specTitleAccent: `/ energy bins`,
    specSub: `Raw counts after rebin, threshold shown`,
    specAria: `XRF spectrum per pixel`,
    p1Title: `XRF dataset`,
    uploadStrong: `Load an XRF file`,
    uploadSub: `.npz / .h5 / .ome.tif / .ome.tiff / .fits — detected by content`,
    btnDemo: `Use synthetic demo`, btnDemoFile: `Use demo file`,
    ttDemoFile: `Click for a new random pick`,
    colormap: `Colormap`,
    optTerreic: `Terreic (default)`, optGrey: `Grey (white = high)`, optViridis: `Viridis`, optInferno: `Inferno`,
    dsFile: `File`, dsShape: `Shape / rebin`, dsCal: `Calibration`,
    calMLabel: `Calibration m (keV/bin)`,
    ttCalM: `Linear calibration factor m: E[bin] = q + m·bin, in keV. Use together with q: filling both in, axis, frequencies and the label of the displayed bin switch from ADC to keV.`,
    calQLabel: `Calibration q (keV)`,
    ttCalQ: `Linear calibration offset q: E[bin] = q + m·bin, in keV. Use together with m: filling both in, axis, frequencies and the label of the displayed bin switch from ADC to keV.`,
    hintDataset: `With m and q filled in, axis and frequencies use E[bin] = q + m·bin on the displayed bin (otherwise: ADC). Files stay in the browser; no upload to any server. OME-TIFF and FITS use local libraries; NPZ/HDF5 fetch fflate and h5wasm from a CDN on first use.`,
    p2Title: `Tracking and audio`,
    btnCamStart: `Start camera`, btnCamStop: `Stop camera`,
    camCaption: `Mirrored preview · the model receives the unmirrored video`,
    btnAudioStart: `Start audio`, btnAudioStop: `Mute`,
    ttMouseMode: `The cursor on the plot is the right hand; Shift or the ↑/↓ arrows are the left hand. With the left hand active: the wheel moves the bin by 2 bins per ~100px notch (proportional for trackpad flicks) and the arrows by 1 bin; releasing Shift returns to polyphony.`,
    mouseModeLabel: `Mouse test mode (Shift or ↑/↓ = left · wheel = 2 bins/notch, ↑/↓ = 1 bin · Shift released = polyphony)`,
    hintCameraPre: `Camera and audio require an explicit gesture. The camera works on`,
    hintCameraPost: `or HTTPS.`,
    p3Title: `Sonification`,
    lblThreshold: `Counts threshold`, lblVoices: `Max simultaneous voices`, lblVolume: `Volume`,
    lblFreqMin: `Min Hz`, lblFreqMax: `Max Hz`,
    ttPeak: `Instead of sounding the exact bin under the hand, sounds the local maximum within ±N channels (N=0 disables the window). Mutually exclusive with Grayscale on bin and Fixed bin: enabling it disables the other two.`,
    peakPrefix: `Sound peak only: local maximum in ±`,
    lblChannels: `channels`,
    ttMapWin: `The grayscale plot shows the integral of counts over ±N channels of the selected bin, instead of the sum over all channels. Requires the left hand (or Fixed bin) active. Mutually exclusive with Sound peak only and Fixed bin: enabling it disables the other two.`,
    mapWinPrefix: `Grayscale on bin: integral ±`,
    ttFixed: `Pins the sounded bin to the given value, without using the left hand. With the right hand (or cursor) on the plot: orange bar on the bin, sound locked to that channel and grayscale map of the bin on the image (like Grayscale on bin); without a pixel on the plot there is no spectrum to sonify. Mutually exclusive with the other two: enabling it disables them.`,
    fixedPrefix: `Fixed bin (pins the left-hand role): `,
    legendROff: `Right absent → silence`, legendLOff: `Left absent → spectral mix`, legendLOn: `Left present → single bin`,
    footerHerakoi: `With thanks to the original project`,
    footerLabec: `With thanks to LABEC and INFN-CHNet for the example data`,
    ttCredits: `Credits of the example data (usable_data/)`,
    canvasEmpty: `Load an XRF cube to begin`,
    loaded: (n) => `${n} loaded. Controls ready: start audio and camera, or try the mouse.`,
    errDemoFile: (m) => `Could not load the demo file: ${m}`,
    reading: (n) => `Reading ${n} locally…`,
    errLoad: (m) => `Could not load: ${m}`,
    camInit: `Initializing MediaPipe and requesting camera access…`,
    camActive: `Camera active: right index on the pixel, left index to isolate a frequency.`,
    camErr: (m) => `Camera: ${m}`,
    camStopped: `Camera stopped.`,
    audioOn: `Audio on: sound starts only when the right pointer is on the map.`,
    webAudioErr: (m) => `Web Audio: ${m}`,
    audioMuted: `Audio muted.`,
    mouseHint: `Mouse test: cursor = right hand; Shift or ↑/↓ arrows = left hand (wheel = 2 bins per notch, ↑/↓ = 1 bin); Shift released = polyphony.`,
    demoName: `Synthetic demo (60×96×128)`,
    spectrumBins: (c) => `${c} bins`,
    spectrumBin: (b, n) => `Bin ${b} · ${n} counts`,
    calUncal: `ADC bins · uncalibrated`,
    srcEnergyTable: `ENERGY table`, srcCalibration: `m/q calibration`,
    srcEnergyAxis: `energy axis (OME)`, srcEnergyNpy: `energy.npy`,
    validSuffix: `valid`,
  },
};
const LANG_KEY = 'cherakoi-lang';
export function getLang() {
  try {
    const v = localStorage.getItem(LANG_KEY);
    return v === 'en' || v === 'it' ? v : 'it';
  } catch {
    return 'it';
  }
}
export function setLang(l) {
  try { localStorage.setItem(LANG_KEY, l); } catch { /* private mode: language just won't persist */ }
}
export function t(key, ...args) {
  const v = STRINGS[getLang()][key];
  return typeof v === 'function' ? v(...args) : v;
}
export function applyI18n() {
  const lang = getLang(), s = STRINGS[lang];
  document.documentElement.lang = lang;
  for (const n of document.querySelectorAll('[data-i18n]')) {
    const k = n.dataset.i18n;
    if (s[k] !== undefined) n.textContent = s[k];
  }
  for (const n of document.querySelectorAll('[data-i18n-title]')) {
    const k = n.dataset.i18nTitle;
    if (s[k] !== undefined) n.title = s[k];
  }
  for (const n of document.querySelectorAll('[data-i18n-aria]')) {
    const k = n.dataset.i18nAria;
    if (s[k] !== undefined) n.setAttribute('aria-label', s[k]);
  }
  for (const b of document.querySelectorAll('.lang-btn')) b.classList.toggle('active', b.dataset.lang === lang);
}