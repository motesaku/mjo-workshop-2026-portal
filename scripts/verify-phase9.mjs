// Phase 9 HTTP verification against a LOCAL server only.
// Usage: node scripts/verify-phase9.mjs [origin]   (default http://127.0.0.1:4321)
// Run after scripts/verify-phase8.mjs, which crawls every page and link.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { highlights } from "../src/data/highlights.ts";
import { INSIGHTS_V2, REGIONAL_VALUE_LEVELS } from "../src/science/phase9/synthesis.mjs";
import { THEME_COVERAGE } from "../src/science/phase9/coverage.mjs";
import { PILOTS, DEPENDENCIES } from "../src/science/phase9/roadmap.mjs";
import { DISAGREEMENT_MATRIX } from "../src/science/phase9/classification.mjs";
import { PHASE9_KEY_MESSAGES } from "../src/science/phase9/videos.mjs";

const origin = process.argv[2] ?? "http://127.0.0.1:4321";
assert.ok(["127.0.0.1", "localhost", "[::1]"].includes(new URL(origin).hostname), "verify-phase9 only targets a loopback server");
const pkg = JSON.parse(readFileSync(new URL("../src/data/personal-synthesis.json", import.meta.url), "utf8"));
const failures = [];
const check = (ok, message) => { if (!ok) failures.push(message); };
const cache = new Map();
async function page(path) {
	if (!cache.has(path)) {
		const r = await fetch(origin + path);
		const html = await r.text();
		check(r.status === 200, `${path}: HTTP ${r.status}`);
		cache.set(path, html.match(/<main[\s\S]*?<\/main>/)?.[0] ?? html);
	}
	return cache.get(path);
}
const text = (html) => html.replace(/<[^>]+>/g, " ").replace(/&#39;|&apos;/g, "'").replace(/&amp;/g, "&").replace(/\s+/g, " ");

// Synthesis: eight insights, old anchors, value levels, coverage matrix, draft label.
const synthesis = await page("/workshop-synthesis");
check((synthesis.match(/class="insight"/g) ?? []).length === INSIGHTS_V2.length, "synthesis shows every Phase 9 insight");
for (let n = 1; n <= 7; n++) check(synthesis.includes(`id="insight-${n}"`), `anchor #insight-${n} still resolves`);
for (const l of REGIONAL_VALUE_LEVELS) check(synthesis.includes(`id="value-${l.id}"`), `value level ${l.id}`);
for (const t of THEME_COVERAGE) check(synthesis.includes(`id="${t.id}"`), `coverage row ${t.id}`);
check(/Phase 9 draft · awaiting author review/.test(text(synthesis)), "synthesis carries the Phase 9 draft label");
check(!/reviewed records|synthesis of reviewed minutes/.test(text(synthesis)), "synthesis must not call the minutes reviewed");
check(text(await page("/")).includes("ASR-derived minutes"), "home describes the minutes accurately");

// Questions: matrix, Q03/Q07 analyses, agreement forms, added records, labels.
const questions = await page("/questions");
for (const row of DISAGREEMENT_MATRIX) check(questions.includes(`id="matrix-${row.issue}"`) && questions.includes(`href="/questions/themes/${row.issue}"`), `matrix row ${row.issue}`);
check(questions.includes('id="complementary"'), "complementary perspectives listed separately");
const q07 = await page("/questions/themes/q07");
for (const id of ["layer-objectives", "layer-standards", "layer-open"]) check(q07.includes(`id="${id}"`), `q07 ${id}`);
check(text(q07).includes("Genuine scientific disagreement"), "q07 verdict follows the revised primary relationship");
const q03 = await page("/questions/themes/q03");
for (const id of ["process-advection", "process-convergence", "process-shallow", "process-boundary_layer", "process-temperature", "hypothesis-h1", "hypothesis-h2"]) check(q03.includes(`id="${id}"`), `q03 ${id}`);
check(!/\b\d{2}\s?%/.test(text(q03)), "q03 must not show withheld percentages");
for (const q of ["q06", "q08", "q11"]) check((await page(`/questions/themes/${q}`)).includes('id="agreement-forms"'), `${q}: forms of agreement`);
for (const q of ["q02", "q03", "q05", "q07", "q09", "q10", "q11"]) check((await page(`/questions/themes/${q}`)).includes('id="phase9-records"'), `${q}: Phase 9 records shown`);
for (const issue of pkg.issues) {
	const html = await page(`/questions/themes/${issue.id}`);
	check(!/>\s*Video evidence\s*</i.test(html), `${issue.id}: label must be Related video highlights`);
	check(/Consistent with cited minutes|Partly consistent with cited minutes|Source mapping disputed/.test(html), `${issue.id}: review states shown`);
}

// Roadmap and pilots.
const roadmap = await page("/actions");
for (const id of ["pilots", "dependencies", "prioritization"]) check(roadmap.includes(`id="${id}"`), `roadmap #${id}`);
check(/<svg[^>]*class="dep-graph"/.test(roadmap), "dependency graph rendered");
check((roadmap.match(/class="dep-list"/g) ?? []).length >= 1 && DEPENDENCIES.every((d) => roadmap.includes(`href="/actions/${d.to.replace("action-", "")}"`)), "dependency list links resolve to workflows");
for (const a of pkg.actions) check(roadmap.includes(`href="/actions/${a.issue_id}"`), `roadmap keeps workflow ${a.id}`);
for (const p of PILOTS) {
	check(roadmap.includes(`href="/actions/pilots/${p.slug}"`), `roadmap → ${p.id}`);
	const html = await page(`/actions/pilots/${p.slug}`);
	for (const q of p.questions) check(html.includes(`href="/questions/themes/${q}"`), `${p.id} → ${q}`);
	for (const w of p.workflows) check(html.includes(`href="/actions/${w.replace("action-", "")}"`), `${p.id} → ${w}`);
	for (const id of ["hypotheses", "design", "plan", "evidence", "assessment"]) check(html.includes(`id="${id}"`), `${p.id} #${id}`);
	check(/Editorial proposal/.test(text(html)) && /not promised completion dates/.test(text(html)), `${p.id}: status wording`);
}
const statusOf = async (path) => (await fetch(origin + path)).status;
check([404].includes(await statusOf("/actions/pilots/unknown")), "unknown pilot returns 404");

// Videos: audit on every clip; Phase 9 key messages served.
for (const h of highlights) {
	const html = await page(`/videos/${h.slug}`);
	check(html.includes('id="relationship-audit"'), `${h.slug}: relationship audit`);
	check(text(html).includes("Key Message from Session Minutes"), `${h.slug}: key-message label`);
	const km = PHASE9_KEY_MESSAGES[h.slug];
	if (km) check(text(html).includes(km.text.slice(0, 60)), `${h.slug}: Phase 9 key message served`);
}
const plenary = await page("/videos/plenary-themes-3-4");
const keySection = plenary.match(/<section id="key-message">[\s\S]*?<\/section>/)?.[0] ?? "";
check(keySection && !text(keySection).includes("observations alone"), "withheld-source content removed from the plenary key message");
check(text(plenary).includes("rests only on the extended theory minutes"), "composite statement q07-c02 carries its Phase 9 review note");

if (failures.length) {
	console.error(`FAIL ${failures.length} check(s):\n- ${failures.slice(0, 60).join("\n- ")}`);
	process.exit(1);
}
console.log(`PASS Phase 9: ${cache.size} pages checked (${INSIGHTS_V2.length} insights, ${DISAGREEMENT_MATRIX.length} matrix rows, ${PILOTS.length} pilots, ${DEPENDENCIES.length} dependencies, ${highlights.length} clip audits)`);
