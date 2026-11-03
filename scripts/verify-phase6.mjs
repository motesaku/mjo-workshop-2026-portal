import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
const mode = process.argv[2] ?? 'dev';
assert.ok(['dev', 'production'].includes(mode));
const origin = mode === 'dev' ? 'http://127.0.0.1:4321' : 'http://127.0.0.1:4322';
const themePaths = ['/ai-for-mjo-research', '/mjo-indices-and-diagnostics'];
const pkg = JSON.parse(await readFile('exports/phase6-20261103-v1/themes.en.json', 'utf8'));
const evidence = new Map(pkg.evidence.map(e => [e.evidence_id, e]));
const sources = new Map(pkg.sources.map(s => [s.source_id, s]));
const referenceIds = new Set(pkg.references.map(r => r.id));
for (const e of pkg.evidence) assert.equal(e.source_sha256, sources.get(e.source_id)?.sha256, e.evidence_id);
for (const t of pkg.themes) for (const s of t.sections) for (const c of s.items) {
  assert.ok(c.refs.length, c.title);
  for (const id of c.refs) assert.ok(evidence.has(id) || referenceIds.has(id), id);
  assert.ok(['Workshop record', 'Editorial synthesis', 'External definition', 'New research proposal'].includes(c.origin));
}
assert.equal(pkg.scientific_review, 'pending');
assert.equal(pkg.publication_approval, 'pending');
assert.equal(pkg.formal_consensus, 'not_established');
assert.doesNotMatch(JSON.stringify(pkg), /\/Users\/|file:\/\/|researcher_os|"path":/);
for (const path of ['/', ...themePaths]) {
  const r = await fetch(origin + path); const html = await r.text();
  assert.equal(r.status, 200, path);
  assert.match(html, /<html[^>]*lang="en"/); assert.match(html, /noindex, nofollow/);
  const nav = html.match(/<nav class="primary-nav"[\s\S]*?<\/nav>/)?.[0];
  assert.ok(nav, 'primary navigation');
  const direct = nav.split('<details')[0];
  for (const href of themePaths) assert.ok(direct.includes(`href="${href}"`), 'direct primary link ' + href);
  if (path !== '/') {
    assert.equal((html.match(/<h1(?:\s|>)/g) ?? []).length, 1);
    assert.doesNotMatch(html, /[\u3040-\u30ff\u3400-\u9fff]/, 'English-only rendered page');
    assert.doesNotMatch(html.match(/<main[\s\S]*?<\/main>/)?.[0] ?? '', /\/Users\/|researcher_os|provenance\.private/);
    assert.doesNotMatch(html, /href="[^"<>]*\.(?:pdf|docx?|pptx?|mp4)(?:"|\?)/i);
    if (mode === 'dev') {
      assert.match(html, /data-theme-review="local-only"/);
      assert.match(html, /New research proposal/); assert.match(html, /Source review:/);
      assert.match(html, /href="\/videos\/breakout-themes-3-4"/);
      const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]));
      for (const match of html.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.has(match[1]), `${path}: anchor ${match[1]}`);
    } else {
      assert.match(html, /data-theme-withheld/);
      assert.doesNotMatch(html, /data-theme-review|A1 ·|B1 ·|e-final-/);
    }
  }
  console.log(`PASS ${mode} ${path}`);
}
for (const q of pkg.issues) {
  const r = await fetch(origin + '/questions/themes/' + q.id); const html = await r.text();
  assert.equal(r.status, mode === 'dev' ? 200 : 404, q.id);
  if (mode === 'dev') { assert.match(html, /data-theme-review/); assert.doesNotMatch(html, /[\u3040-\u30ff\u3400-\u9fff]/); }
}
assert.equal((await fetch(origin + '/questions/themes/unknown')).status, 404);
const admin = await fetch(origin + '/_emdash/admin/', { redirect: 'manual' });
assert.ok([200, 302, 303, 307, 308].includes(admin.status), 'admin reachable');
for (const path of ['/exports/phase6-20261103-v1/themes.en.json', '/exports/phase6-20261103-v1/provenance.private.json', '/backups/phase6-20261103-v1/src/layouts/Base.astro', '/.env', '/data.db']) {
  const r = await fetch(origin + path); assert.ok([403, 404].includes(r.status), `${path}: ${r.status}`);
}
if (mode === 'production') {
  async function walk(dir) { const files=[]; for (const e of await readdir(dir,{withFileTypes:true})) {const p=join(dir,e.name); if(e.isDirectory()) files.push(...await walk(p)); else files.push(p);}return files; }
  for (const file of await walk('dist')) {
    if (!/\.(m?js|json|html|map)$/.test(file)) continue;
    const text = await readFile(file, 'utf8');
    assert.doesNotMatch(text, /A1 · A frozen|B1 · Build an index|e-final-148-157|<withheld-sha256>/, `draft excluded: ${file}`);
  }
}
console.log(`PASS ${mode}: provenance closure, cross-links, private-file denial, admin and publication boundary`);
