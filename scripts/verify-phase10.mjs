// Phase 10 HTTP regression check against a LOCAL server only.
// Usage: node scripts/verify-phase10.mjs [origin]   (default http://127.0.0.1:4321)
//
// Complements verify-phase8 (crawl, links, bidirectional relations) and verify-phase9
// (Phase 9 sections). Expected values come from the data layer, so the check follows
// editorial changes instead of pinning incidental wording. It fails if a stale
// implementation is served: navigation without the synthesis, a homepage without the
// current insights, a roadmap without its areas or graph, question pages without
// classification or provenance, clip pages with placeholder relations, an unguarded
// Worker entry, or private files reachable through the server.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { highlights } from "../src/data/highlights.ts";
import { createRelationIndex } from "../src/science/phase8/relations.mjs";
import { relationContext } from "../src/science/phase9/context.mjs";
import { INSIGHTS_V2 } from "../src/science/phase9/synthesis.mjs";
import { PILOTS, DEPENDENCIES } from "../src/science/phase9/roadmap.mjs";
import { RELATIONSHIP_REVISIONS } from "../src/science/phase9/classification.mjs";
import { PHASE9_EDITORIAL } from "../src/science/phase9/status.mjs";
import { PRIORITY_AREAS } from "../src/science/phase8/editorial-roadmap.mjs";
import { ISSUE_RELATIONSHIPS, RELATIONSHIP_TYPES } from "../src/science/phase8/editorial-classification.mjs";
import { PROPOSALS } from "../src/science/phase10/proposals.mjs";
import { DEPENDENCIES_V2, DEPENDENCY_TYPES } from "../src/science/phase10/roadmap.mjs";

const origin = process.argv[2] ?? "http://127.0.0.1:4321";
assert.ok(["127.0.0.1", "localhost", "[::1]"].includes(new URL(origin).hostname), "verify-phase10 only targets a loopback server");
const root = fileURLToPath(new URL("..", import.meta.url)).replace(/\/$/, "");
const pkg = JSON.parse(readFileSync(new URL("../src/data/personal-synthesis.json", import.meta.url), "utf8"));
const index = createRelationIndex(relationContext({ pkg, highlights }));

const failures = [];
const check = (ok, message) => { if (!ok) failures.push(message); };
const cache = new Map();
async function page(path) {
	if (!cache.has(path)) {
		const r = await fetch(origin + path);
		check(r.status === 200, `${path}: HTTP ${r.status}`);
		cache.set(path, await r.text());
	}
	return cache.get(path);
}
const decode = (s) => s.replace(/&#39;|&apos;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
const text = (html) => decode(html.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ");
const main = (html) => html.match(/<main[\s\S]*?<\/main>/)?.[0] ?? "";
const section = (html, id) => html.match(new RegExp(`<section[^>]*\\bid="${id}"[\\s\\S]*?</section>`))?.[0] ?? "";
const hrefs = (html) => new Set([...html.matchAll(/href="([^"#?]*)/g)].map((m) => m[1]));

// 1. Navigation: the synthesis and the main scientific sections stay primary entry points.
const PRIMARY = ["/workshop-synthesis", "/questions", "/videos", "/actions", "/program"];
for (const path of ["/", "/questions/themes/q03", `/videos/${highlights[0].slug}`, "/actions/pilots/" + PILOTS[0].slug]) {
	const html = await page(path);
	const header = hrefs(html.match(/<nav class="primary-nav"[\s\S]*?<\/nav>/)?.[0] ?? "");
	const mobile = hrefs(html.match(/<details class="mobile-menu"[\s\S]*?<\/details>/)?.[0] ?? "");
	for (const href of PRIMARY) {
		check(header.has(href), `${path}: header navigation → ${href}`);
		check(mobile.has(href), `${path}: mobile menu → ${href}`);
	}
	check(/<meta name="viewport"[^>]*width=device-width/.test(html), `${path}: responsive viewport`);
}

// 2. Homepage: synthesis entry point, every current insight, counts from the data.
const home = await page("/");
const homeMain = main(home);
check(/<a class="button" href="\/workshop-synthesis"/.test(homeMain), "home: primary call to action opens the Workshop Synthesis");
for (const insight of INSIGHTS_V2) {
	const link = homeMain.match(new RegExp(`<a href="/workshop-synthesis#${insight.id}"[^>]*>([\\s\\S]*?)</a>`));
	check(link && text(link[1]).trim() === insight.title, `home: insight ${insight.id} listed with its current title`);
}
for (const fact of [`${pkg.issues.length} scientific questions`, `${highlights.length} one-minute highlights`, `${PRIORITY_AREAS.length} research areas`, `${pkg.actions.length} workflows`, `${INSIGHTS_V2.length} insights`]) {
	check(text(homeMain).includes(fact), `home: "${fact}"`);
}

// 3. Workshop Synthesis: each insight with its title and its evidence/provenance block.
const synthesis = main(await page("/workshop-synthesis"));
for (const insight of INSIGHTS_V2) {
	const item = synthesis.match(new RegExp(`<li id="${insight.id}" class="insight"[\\s\\S]*?</li>\\s*(?=<li id="|</ol>)`))?.[0] ?? "";
	check(item !== "", `synthesis: ${insight.id} present`);
	check(text(item.match(/<h3[^>]*>[\s\S]*?<\/h3>/)?.[0] ?? "").trim() === insight.title, `synthesis: ${insight.id} title`);
	check(/<dl class="provenance"/.test(item) && /Evidence basis/.test(text(item)), `synthesis: ${insight.id} provenance`);
}
if (PHASE9_EDITORIAL.status !== "author_reviewed") check(!/Author-reviewed \(Phase 9\)/.test(text(synthesis)), "synthesis must not claim author review");
// Phase 10 proposals awaiting the author's decision must not be served.
for (const p of PROPOSALS.filter((x) => x.decision === null && x.proposed?.text)) {
	const current = p.target.kind === "insight" ? INSIGHTS_V2.find((i) => i.id === p.target.id)?.text ?? "" : "";
	const sentence = p.proposed.text.split(/(?<=\.)\s+/).find((s) => s.length > 60 && !current.includes(s));
	if (sentence) check(!text(synthesis).includes(sentence) && !text(homeMain).includes(sentence), `pending proposal ${p.id} must not be served`);
}

// 4. Roadmap: four areas with their questions, pilots, and a graph with one arrow per relation.
const roadmap = main(await page("/actions"));
for (const area of PRIORITY_AREAS) {
	const s = section(roadmap, area.id);
	check(s !== "" && text(s).includes(decode(area.title)), `roadmap: ${area.id} "${area.title}"`);
	for (const q of area.coreIssues) check(s.includes(`href="/questions/themes/${q}"`), `roadmap: ${area.id} → ${q}`);
}
const graph = roadmap.match(/<svg class="dep-graph"[\s\S]*?<\/svg>/)?.[0] ?? "";
check((graph.match(/marker-end="url\(#arrow-/g) ?? []).length === DEPENDENCIES.length, `roadmap: graph draws ${DEPENDENCIES.length} relations`);
for (const t of Object.keys(DEPENDENCY_TYPES)) {
	const n = DEPENDENCIES_V2.filter((d) => d.type === t).length;
	check((graph.match(new RegExp(`marker-end="url\\(#arrow-${t}\\)"`, "g")) ?? []).length === n, `roadmap: ${n} arrows of type ${t}`);
}
check(/All twelve workflows can start now/.test(text(roadmap)), "roadmap: startable workflows stated");
const depList = roadmap.match(/<ul class="dep-list">[\s\S]*?<\/ul>/)?.[0] ?? "";
check((depList.match(/<li[\s>]/g) ?? []).length === DEPENDENCIES.length, "roadmap: text list of every relation");
for (const pilot of PILOTS) {
	check(roadmap.includes(`href="/actions/pilots/${pilot.slug}"`), `roadmap → pilot ${pilot.slug}`);
	const h1 = (await page(`/actions/pilots/${pilot.slug}`)).match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1] ?? "";
	check(text(h1).trim() === pilot.title, `pilot ${pilot.slug}: title`);
	const pilotMain = main(await page(`/actions/pilots/${pilot.slug}`));
	check(pilotMain.includes('id="stages"') && /Can start now/.test(text(pilotMain)) && /Needed before results are interpreted/.test(text(pilotMain)) && /At the 90-day review/.test(text(pilotMain)), `pilot ${pilot.slug}: stages and decision points`);
}

// 5. Question pages: classification from the data layer and statement-level provenance.
for (const issue of pkg.issues) {
	const html = main(await page(`/questions/themes/${issue.id}`));
	const rel = RELATIONSHIP_REVISIONS[issue.id] ?? ISSUE_RELATIONSHIPS[issue.id];
	check(html.includes(`rel-badge rel-${rel.primary}`), `${issue.id}: primary classification ${rel.primary}`);
	check(text(html).includes(RELATIONSHIP_TYPES[rel.primary].label), `${issue.id}: classification label`);
	const t = text(html);
	check(/Source fidelity: /.test(t) && /Publication: /.test(t) && /Method: /.test(t), `${issue.id}: review dimensions shown`);
	check(new RegExp(`Statement ${issue.id}-`).test(t) && /locators? /.test(t), `${issue.id}: statement and locator identifiers`);
}

// 6. Clip pages: question cards equal the evidence-derived relations (no placeholders).
const placeholder = new Map();
for (const h of highlights) {
	const html = main(await page(`/videos/${h.slug}`));
	const expected = [...new Set(index.issuesForVideo(h.slug).map((r) => r.issue.id))].sort().join(",");
	const related = section(html, "related-questions");
	const shown = [...new Set([...related.matchAll(/<p class="eyebrow">(Q\d\d) ·/g)].map((m) => m[1].toLowerCase()))].sort().join(",");
	check(shown === expected, `${h.slug}: question cards [${shown}] ≠ evidence-derived [${expected}]`);
	placeholder.set(shown, (placeholder.get(shown) ?? 0) + 1);
	check(/Key Message from Session Minutes/.test(text(html)), `${h.slug}: minutes-based key-message label`);
}
const largest = Math.max(...placeholder.values());
check(largest < highlights.length / 2, `clip pages: ${largest} of ${highlights.length} clips show the same question set`);

// 7. The Worker entry guards public API bodies before EmDash parses them.
const big = "a".repeat(70 * 1024);
const guarded = await fetch(`${origin}/_emdash/api/auth/signup/complete`, { method: "POST", headers: { "content-type": "application/json" }, body: big });
check(guarded.status === 413, `oversized public API body: expected 413, got ${guarded.status}`);

// 8. Private local files are never served, including dev-server bypass forms.
const privatePaths = [
	"/.env", "/.dev.vars", "/.dev.vars?raw", "/wrangler.site.jsonc", "/wrangler.site.jsonc?raw", "/data.db", "/data.db?raw",
	"/backups/", "/uploads/", "/exports/", "/.verification/release-readiness.json", "/.wrangler/state/",
	"/docs/PHASE9_AUTHOR_REVIEW.ja.md", "/docs/PHASE9_DEPLOY_NOTES_2026-11-05.ja.md", "/docs/SITE_CREATION_WORKFLOW.ja.md",
	"/.claude/settings.local.json", "/.claude/state/handoff-artifact.json", "/.codex/config.toml", "/.emdash/migrations.json",
	`/@fs${root}/.dev.vars`, `/@fs${root}/wrangler.site.jsonc`, `/@fs${root}/data.db`, `/@fs${root}/.verification/release-readiness.json`,
	`/@fs${root}/docs/PHASE9_AUTHOR_REVIEW.ja.md`, `/@fs${root}/.claude/state/handoff-artifact.json`,
];
for (const path of privatePaths) {
	const r = await fetch(origin + path, { redirect: "manual" });
	check([403, 404].includes(r.status), `${path}: expected 403/404, got ${r.status}`);
}

// 9. No private paths, review files or fingerprints anywhere in the served HTML.
for (const [path, html] of cache) {
	// Dev-server-only module references (absent from production builds) are not content.
	const served = html
		.replace(/<script\b[^>]*\ssrc="[^"]*"[^>]*>\s*<\/script>/g, "")
		.replace(/(?:src|href)="\/(?:@fs|@id|@vite|src|node_modules)\/[^"]*"/g, "")
		.replace(/data-vite-dev-id="[^"]*"/g, "");
	check(!/\/Users\/|researcher_os|provenance\.private|\.ja\.md|wrangler\.site|sha256:[0-9a-f]{8}|exports\/phase/i.test(served), `${path}: private path or fingerprint in HTML`);
}

if (failures.length) {
	console.error(`FAIL ${failures.length} check(s):\n- ${failures.slice(0, 80).join("\n- ")}`);
	process.exit(1);
}
console.log(`PASS Phase 10: ${cache.size} pages (${INSIGHTS_V2.length} insights on home and synthesis, ${PRIORITY_AREAS.length} areas, ${PILOTS.length} pilots, ${DEPENDENCIES.length} graph relations, ${pkg.issues.length} classified questions, ${highlights.length} clips with evidence-derived relations), guard active, ${privatePaths.length} private paths closed`);
