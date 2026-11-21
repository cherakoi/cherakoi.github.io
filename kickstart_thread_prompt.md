# First prompt for a local Hermes / OpenCode / Codex agent

Copy the text below into a new local coding-agent session, from the CHerakoi repo directory (or explicitly pass its path).

---

Ciao. Avvia **M2: browser integration e audit tecnico** del progetto CHerakoi, una app statica pure-frontend che sonifica cubi XRF e usa MediaPipe per entrambe le mani. **Ho già un primo draft**: non ripartire da zero né fare una conversione React senza motivazioni misurabili.

**Prima fase in sola lettura**:

1. Verifica `pwd`, `git status`, struttura reale del repo; leggi `AGENTS.md`, `README.md`, `operational_plan.md`, `scientific_notes.md`, `to_do.md`, `timeline.md`, `legacy_audit.md`.
2. Inventaria i moduli in `src/`, la correttezza del contratto `img` (H,W,C), dei loader `.npz/.h5`, del modello MediaPipe / percorso CDN, dell'AudioWorklet, della geometria delle coordinate; segnala problemi con gravità, file/riga e test riproducibile.
3. Sui test locali esegui `npm test` e `node --check src/*.js`; non installare package non richiesti.
4. Se hai disponibile un browser, avvia `python -m http.server 8000` e prova demo, mouse+Shift, audio, `tests/fixtures/synthetic_xrf.npz`, richieste CDN, webcam, handedness e silenzio su perdita della destra. Registra chiaramente quali controlli **non** puoi eseguire.
5. **Non** caricare file privati, non committare `data_example/`, non introdurre backend o telemetria. Non presumere che CDN/HDF5/webcam siano stati già verificati.

**Dopo l'audit**, implementa solo le **correzioni P0/P1 effettivamente necessarie** per M2 (scope già autorizzato: piccoli bugfix + test); evita refactor e nuove dipendenze. Mantieni una UI DARKLY-like (#4196B4), la struttura `src/deploy`, codice leggibile e facile da manutenere.

Semantica non negoziabile: destra assente o fuori mappa -> nessun suono; sinistra assente -> mixture per i conteggi sopra soglia; sinistra presente -> una frequenza associata a `y_left` (basso=frequenza bassa). La mano destra seleziona `(x,y)` spaziale della *mappa XRF*, non il RGB del canvas. Il file `/img` contiene `(height,width,C)`, con C tipicamente 512/1024 ma arbitrario. I conteggi originali non vanno persi o sovrascritti.

Alla fine aggiorna solo i documenti toccati da decisioni/evidenze: `to_do.md` (Now), `timeline.md` (comandi+risultati osservati), `operational_plan.md` (cambi di strategia), `README.md` (capabilities davvero verificate). Risposta compatta: findings P0/P1, patch applicate, test reali, limiti, prossima azione.

---

**Follow-up M3:** con il vero NPZ in `data_example/`, confronta il rebin con `chnet-xrf-raw-data-converter` (`rebin_to` quando divisibile), misura latenza e memoria, proponi le decisioni su frequenze, ampiezze e maschere prima di allargare la scope.
