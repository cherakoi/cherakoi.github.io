// Lazy-loads vendored UMD libraries. In the browser a <script> tag is injected
// only when the user picks a file of that format (zero cost at page load);
// in Node (tests) the same file is required, so tests exercise the exact
// shipped bytes (CJS packaging when the upstream dist ships one).
const pending = new Map();
export function loadVendor(file, globalName) {
  if (globalThis[globalName]) return Promise.resolve(globalThis[globalName]);
  if (!pending.has(file)) {
    const p = new Promise((resolve, reject) => {
      if (typeof document !== 'undefined') {
        const s = document.createElement('script');
        s.src = `vendor/${file}.js?v=v0.1.3-1`;
        s.onload = () => (globalThis[globalName] ? resolve(globalThis[globalName]) : reject(new Error(`vendor/${file}: global ${globalName} mancante`)));
        s.onerror = () => reject(new Error(`vendor/${file} non caricato (libreria mancante?)`));
        document.head.appendChild(s);
      } else {
        import('node:module').then(async ({createRequire}) => {
          const {fileURLToPath} = await import('node:url');
          const req = createRequire(import.meta.url);
          const {existsSync} = await import('node:fs');
          // Node tests use the CJS build when the package ships one (the UMD
          // build's webpack runtime expects a browser document); the code is
          // the same, only the packaging differs.
          const cjs = fileURLToPath(new URL(`../vendor/${file}.cjs`, import.meta.url));
          const mod = req(existsSync(cjs) ? cjs : fileURLToPath(new URL(`../vendor/${file}.js`, import.meta.url)));
          resolve(globalThis[globalName] ?? mod?.[globalName] ?? mod?.default ?? mod);
        }).catch(reject);
      }
    });
    p.catch(() => pending.delete(file));
    pending.set(file, p);
  }
  return pending.get(file);
}