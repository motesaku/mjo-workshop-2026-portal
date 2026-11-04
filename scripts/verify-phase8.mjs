// Phase 8 HTTP verification against a LOCAL server only.
// Usage: node scripts/verify-phase8.mjs [origin]   (default http://127.0.0.1:4321)
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { highlights } from "../src/data/highlights.ts";
import { createRelationIndex } from "../src/science/phase8/relations.mjs";
import { relationContext } from "../src/science/phase9/context.mjs";
import { PILOTS } from "../src/science/phase9/roadmap.mjs";

const origin = process.argv[2] ?? "http://127.0.0.1:4321";
assert.ok(["127.0.0.1", "localhost", "[::1]"].includes(new URL(origin).hostname), "verify-phase8 only targets a loopback server");

const pkg = JSON.parse(readFileSync(new URL("../src/data/personal-synthesis.json", import.meta.url), "utf8"));
// Pages derive relations from the package plus the Phase 8 and Phase 9 supplements.
const index = createRelationIndex(relationContext({ pkg, highlights }));

const staticRoutes = ["/", "/workshop-synthesis", "/program", "/videos", "/questions", "/diverging-perspectives", "/emerging-alignment", "/open-challenges", "/actions", "/ai-for-mjo-research", "/mjo-indices-and-diagnostics", "/about"];
const routes = [
	...staticRoutes,
	...highlights.map((h) => `/videos/${h.slug}`),
	...pkg.issues.map((i) => `/questions/themes/${i.id}`),
	...pkg.actions.map((a) => `/actions/${a.issue_id}`),
	...PILOTS.map((p) => `/actions/pilots/${p.slug}`),
];
const pages = new Map();
const failures = [];
const check = (ok, message) => { if (!ok) failures.push(message); };

async function get(path) {
	const response = await fetch(origin + path, { redirect: "follow" });
	return { status: response.status, html: await response.text(), url: response.url };
}

for (const path of routes) {
	const { status, html } = await get(path);
	check(status === 200, `${path}: HTTP ${status}`);
	pages.set(path, html);
	check(/<html[^>]*lang="en"/.test(html), `${path}: lang=en`);
	check(html.includes("noindex, nofollow"), `${path}: noindex retained`);
	check((html.match(/<h1(?:\s|>)/g) ?? []).length === 1, `${path}: exactly one h1`);
	check(!/[぀-ヿ㐀-鿿]/.test(html), `${path}: English only`);
	check(!/Local build until public hosting/.test(html), `${path}: outdated hosting text`);
	check(!/href="[^"]*\.(?:pdf|docx?|pptx?|mp4|mov|webm)(?:[?#"])/i.test(html), `${path}: no original downloads`);
	const main = html.match(/<main[\s\S]*?<\/main>/)?.[0] ?? "";
	// The dev server loads component scripts by absolute source path; production bundles them under /_astro/.
	const content = main.replace(/<script\b[^>]*\ssrc="[^"]*"[^>]*>\s*<\/script>/g, "");
	check(!/\/Users\/|researcher_os|provenance\.private|sha256:/.test(content), `${path}: no private paths or fingerprints`);
	check(!main.includes("<iframe"), `${path}: no YouTube connection before the reader asks`);
	const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]));
	for (const m of html.matchAll(/href="#([^"]+)"/g)) check(ids.has(m[1]), `${path}: broken in-page anchor #${m[1]}`);
}

// Every internal link on every page resolves.
const internal = new Set();
for (const html of pages.values()) for (const m of html.matchAll(/href="(\/[^"#?]*)(?:[#?][^"]*)?"/g)) {
	if (!m[1].startsWith("/_emdash") && !m[1].startsWith("/_astro")) internal.add(m[1]);
}
for (const path of internal) {
	if (pages.has(path)) continue;
	const { status } = await get(path);
	check(status === 200, `internal link ${path}: HTTP ${status}`);
}

// Video ↔ question links are navigable in both directions; withheld links never appear.
let pairs = 0;
for (const issue of pkg.issues) {
	const qhtml = pages.get(`/questions/themes/${issue.id}`);
	for (const link of index.videosForIssue(issue.id)) {
		pairs++;
		check(qhtml.includes(`href="/videos/${link.highlight.slug}"`), `${issue.id} → ${link.highlight.slug} missing`);
		check(pages.get(`/videos/${link.highlight.slug}`).includes(`href="/questions/themes/${issue.id}"`), `${link.highlight.slug} → ${issue.id} missing`);
	}
}
for (const h of highlights) {
	const linked = new Set(index.issuesForVideo(h.slug).map((r) => r.issue.id));
	const html = pages.get(`/videos/${h.slug}`);
	const main = html.match(/<main[\s\S]*?<\/main>/)?.[0] ?? "";
	const qLinks = new Set([...main.matchAll(/href="\/questions\/themes\/(q\d\d)"/g)].map((m) => m[1]));
	// Withheld-mapping notices may point to questions; only real relations may appear as question cards.
	const cards = new Set([...main.matchAll(/<p class="eyebrow">(Q\d\d) ·/g)].map((m) => m[1].toLowerCase()));
	for (const q of cards) check(linked.has(q), `${h.slug}: unsupported question card ${q}`);
	if (linked.size === 0 && index.withheldForVideo(h.slug).length === 0) check(qLinks.size === 0, `${h.slug}: question link without evidence`);
}
check(!/Related scientific questions[\s\S]{0,400}class="card"/.test(pages.get("/videos/chang-xu-moisture-convection")), "Chang Xu clip must not show question cards");

// Actions no longer all point to the same clip.
const actionClipSets = pkg.actions.map((a) => [...(pages.get(`/actions/${a.issue_id}`).match(/<aside[\s\S]*?<\/aside>/)?.[0] ?? "").matchAll(/href="\/videos\/([^"]+)"/g)].map((m) => m[1]).sort().join(","));
check(new Set(actionClipSets).size > 6, "action pages must not share one hard-coded clip");
for (const a of pkg.actions) {
	const expected = index.videosForAction(a.id).map((v) => v.highlight.slug).sort().join(",");
	const aside = pages.get(`/actions/${a.issue_id}`).match(/<aside[\s\S]*?<\/aside>/)?.[0] ?? "";
	const shown = [...aside.matchAll(/href="\/videos\/([^"]+)"/g)].map((m) => m[1]).sort().join(",");
	check(shown === expected, `${a.id}: aside clips ${shown} ≠ evidence-derived ${expected}`);
}

// Synthesis, roadmap and navigation.
const synthesis = pages.get("/workshop-synthesis");
for (const id of ["learned", "contested", "next"]) check(synthesis.includes(`id="${id}"`), `synthesis section ${id}`);
check((synthesis.match(/class="insight"/g) ?? []).length >= 5, "synthesis insights");
for (const path of staticRoutes) check(pages.get(path).includes('href="/workshop-synthesis"'), `${path}: navigation to Workshop Synthesis`);
const home = pages.get("/");
for (const href of ["/workshop-synthesis", "/program", "/videos", "/ai-for-mjo-research", "/mjo-indices-and-diagnostics", "/actions", "/questions"]) check(home.includes(`href="${href}"`), `home → ${href}`);
const roadmap = pages.get("/actions");
for (let n = 1; n <= 4; n++) check(roadmap.includes(`id="area-${n}"`), `roadmap area-${n}`);
for (const a of pkg.actions) check(roadmap.includes(`href="/actions/${a.issue_id}"`), `roadmap → ${a.id}`);
check(/not workshop-endorsed/.test(roadmap), "roadmap carries its editorial status");
check(pages.get("/about").includes('id="reading-labels"'), "about explains labels");
check(/Cloudflare Workers/.test(pages.get("/about")), "about states the hosting accurately");

// Private files and unknown routes stay closed.
for (const path of ["/.env", "/data.db", "/exports/phase6-20261103-v1/themes.en.json", "/exports/phase5-20261102-v1/provenance.private.json", "/questions/themes/q99", "/actions/q99", "/videos/unknown"]) {
	const { status } = await get(path);
	check([403, 404].includes(status), `${path}: expected 403/404, got ${status}`);
}

if (failures.length) {
	console.error(`FAIL ${failures.length} check(s):\n- ${failures.slice(0, 60).join("\n- ")}`);
	process.exit(1);
}
console.log(`PASS ${routes.length} pages (${highlights.length} highlights, ${pkg.issues.length} questions, ${pkg.actions.length} actions, ${PILOTS.length} pilots), ${internal.size} internal links, ${pairs} bidirectional video↔question links`);
