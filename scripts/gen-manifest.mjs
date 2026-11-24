// Regenerates usable_data/manifest.json from the files present in usable_data/.
// Run: npm run demo-manifest  (after adding/removing example files)
import {readdirSync, writeFileSync} from 'node:fs';
const dir = 'usable_data';
const files = readdirSync(dir).filter(f => /\.(h5|hdf5|npz)$/i.test(f)).sort();
writeFileSync(`${dir}/manifest.json`, `${JSON.stringify({files}, null, 1)}\n`);
console.log(`manifest: ${files.length} file(s) -> ${files.join(', ')}`);