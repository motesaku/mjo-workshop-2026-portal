import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
const mode = process.argv[2] ?? 'dev';
assert.ok(['dev', 'production'].includes(mode));
const origin = process.env.VERIFY_ORIGIN ?? (mode === 'dev' ? 'http://127.0.0.1:4321' : 'http://127.0.0.1:4322');
if (!['127.0.0.1', 'localhost', '[::1]'].includes(new URL(origin).hostname)) throw new Error('verification only targets a loopback server');
const themePaths = ['/ai-for-mjo-research', '/mjo-indices-and-diagnostics'];
const pkg = JSON.parse(await readFile('src/data/personal-synthesis.json', 'utf8'));
const evidence = new Map(pkg.evidence.map(e => [e.evidence_id, e]));
const sources = new Map(pkg.sources.map(s => [s.source_id, s]));
const referenceIds = new Set(pkg.references.map(r => r.id));
const pkgText = JSON.stringify(pkg);
assert.doesNotMatch(pkgText, /"source_sha256"|"excerpt_sha256"|"sha256"\s*:/);
assert.doesNotMatch(pkgText, /"sha256:[a-f0-9]{64}"/);
for (const e of pkg.evidence) {
  assert.ok(sources.has(e.source_id), e.evidence_id);
  assert.equal(e.source_sha256, undefined, e.evidence_id);
  assert.equal(e.excerpt_sha256, undefined, e.evidence_id);
}
for (const t of pkg.themes) for (const s of t.sections) for (const c of s.items) {
  assert.ok(c.refs.length, c.title);
  for (const id of c.refs) assert.ok(evidence.has(id) || referenceIds.has(id), id);
  assert.ok(['Workshop record', 'Editorial synthesis', 'External definition', 'New research proposal'].includes(c.origin));
}
assert.equal(pkg.format, 'personal-workshop-synthesis');
assert.equal(pkg.formal_consensus, 'not_established');
assert.equal(pkg.issues.length, 12);
assert.equal(pkg.actions.length, 12);
assert.doesNotMatch(JSON.stringify(pkg), /\/Users\/|file:\/\/|researcher_os|"path":/);
assert.doesNotMatch(JSON.stringify(pkg), /[\u3040-\u30ff\u3400-\u9fff]/);
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
    assert.match(html, /data-theme-review="personal-report"/);
    assert.match(html, /New research proposal|personal synthesis|Personal workshop report/);
    // Phase 8: highlights are derived from cited minutes, not hard-coded.
    assert.match(html, /href="\/videos\/[a-z0-9-]+"/);
    if (path === '/ai-for-mjo-research') assert.match(html, /href="\/videos\/breakout-themes-3-4"/);
    const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]));
    for (const match of html.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.has(match[1]), `${path}: anchor ${match[1]}`);
  }
  console.log(`PASS ${mode} ${path}`);
}
for (const q of pkg.issues) {
  const r = await fetch(origin + '/questions/themes/' + q.id); const html = await r.text();
  assert.equal(r.status, 200, q.id);
  assert.match(html, /data-theme-review="personal-report"/);
  assert.doesNotMatch(html, /[\u3040-\u30ff\u3400-\u9fff]/);
}
assert.equal((await fetch(origin + '/questions/themes/unknown')).status, 404);
assert.equal((await fetch(origin + '/actions/q01')).status, 200);
assert.equal((await fetch(origin + '/actions/unknown')).status, 404);
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
    // Astro embeds absolute component source paths in some builds.
    // Fail only on private export material or absolute filesystem path fields.
    assert.doesNotMatch(text, /provenance\.private|exports\/phase[56]|editorial-drafts\.en\.json|themes\.jp\.json/, `private export excluded: ${file}`);
    assert.doesNotMatch(text, /"path"\s*:\s*"(?:\/Users\/|file:\/\/)/, `filesystem path field excluded: ${file}`);
  }
}
console.log(`PASS ${mode}: personal synthesis visible, provenance closed, private files denied`);
