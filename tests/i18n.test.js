import test from 'node:test';
import assert from 'node:assert/strict';
import {STRINGS} from '../src/i18n.js';

// The UI breaks silently if a key exists in one language but not the other
// (applyI18n skips missing keys, leaving stale text). Guard the 1:1 parity.
test('i18n: it and en have the same key set', () => {
  const it = Object.keys(STRINGS.it).sort();
  const en = Object.keys(STRINGS.en).sort();
  assert.deepEqual(en, it, `keys differ:\nit-only=${it.filter(k => !en.includes(k))} en-only=${en.filter(k => !it.includes(k))}`);
});

test('i18n: no empty string values', () => {
  for (const lang of ['it', 'en']) {
    for (const [key, v] of Object.entries(STRINGS[lang])) {
      const s = typeof v === 'function' ? v('a', 1, 2, 3) : v;
      assert.ok(typeof s === 'string' && s.length > 0, `${lang}.${key} is empty`);
      assert.ok(!String(s).includes('${'), `${lang}.${key} has uninterpolated placeholder`);
    }
  }
});

test('i18n: at least 50 keys (sanity: UI is covered, not a stub)', () => {
  assert.ok(Object.keys(STRINGS.it).length >= 50, `only ${Object.keys(STRINGS.it).length} keys`);
});