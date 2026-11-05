#!/usr/bin/env node
// Phase 10 author-review appendix. Run: npm run science:export-phase10-review
//
// Writes exports/phase10-20261105-v1/review-matrix.private.md (gitignored; refuses to
// write anywhere Git would track). For every Tier 1–4 item it lists the current public
// wording, the proposed wording, the cited statements and their review state, and —
// only when the private Phase 9 excerpt workbook exists locally — the cited passages.
// It also writes the 38-clip audit table. Nothing here is published or deployed.
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { highlights } from "../src/data/highlights.ts";
import { createRelationIndex } from "../src/science/phase8/relations.mjs";
import { relationContext } from "../src/science/phase9/context.mjs";
import { INSIGHTS_V2, EXECUTIVE_SYNTHESIS_V2, REGIONAL_VALUE_LEVELS } from "../src/science/phase9/synthesis.mjs";
import { reviewOf, REVIEW_OVERRIDES } from "../src/science/phase9/claim-review.mjs";
import { PHASE9_KEY_MESSAGES, MAPPING_REVIEW } from "../src/science/phase9/videos.mjs";
import { VIDEO_KEY_MESSAGES } from "../src/science/phase8/editorial-videos.mjs";
import { ISSUE_RELATIONSHIPS, RELATIONSHIP_TYPES } from "../src/science/phase8/editorial-classification.mjs";
import { RELATIONSHIP_REVISIONS, Q07_LAYERS, Q03_ANALYSIS } from "../src/science/phase9/classification.mjs";
import { PROPOSALS, AUTHOR_DECISIONS, REVIEW_TIERS, Q03_PROPOSAL, Q07_PROPOSAL, REGIONAL_TRANSITIONS, PHASE10_FINDINGS, RESEARCH_OBJECTIVES, RESEARCH_OBJECTIVES_NOTE } from "../src/science/phase10/proposals.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
const outDir = join(root, "exports/phase10-20261105-v1");
const outFile = join(outDir, "review-matrix.private.md");
const probe = spawnSync("git", ["check-ignore", "-q", "--no-index", "exports/phase10-20261105-v1/review-matrix.private.md"], { cwd: root });
if (probe.status !== 0) {
	console.error("export-phase10-review: refusing to write; the output path is not gitignored.");
	process.exit(1);
}

const pkg = JSON.parse(readFileSync(join(root, "src/data/personal-synthesis.json"), "utf8"));
const index = createRelationIndex(relationContext({ pkg, highlights }));
const workbook = join(root, "exports/phase9-20261104-v1/excerpts.private.md");
const matrix9 = join(root, "exports/phase9-20261104-v1/review-matrix.private.md");
const passages = new Map();
if (existsSync(workbook)) {
	for (const part of readFileSync(workbook, "utf8").split(/\n(?=## e-)/)) {
		const m = part.match(/^## (e-[\w-]+)/);
		if (m) passages.set(m[1], part.split("\n").slice(1).join("\n").trim());
	}
}
if (existsSync(matrix9)) {
	// Phase 9 records quote their passages as "- e-id" followed by "    > ..." lines.
	const lines = readFileSync(matrix9, "utf8").split("\n");
	for (let i = 0; i < lines.length; i++) {
		const m = lines[i].match(/^- (e-[\w-]+)\s*$/);
		if (!m || passages.has(m[1])) continue;
		const body = [];
		for (let j = i + 1; j < lines.length && /^\s{4}>|^\s*$/.test(lines[j]); j++) body.push(lines[j].replace(/^\s{4}> ?/, ""));
		if (body.join("").trim()) passages.set(m[1], body.join("\n").trim());
	}
}

const out = [];
const w = (s = "") => out.push(s);
const claimBlock = (ids, { excerpts = true } = {}) => {
	const seen = new Set();
	for (const id of ids) {
		const row = index.claim(id);
		if (!row) { w(`- \`${id}\` — not found`); continue; }
		const sources = index.sourceIdsOfClaim(row.claim);
		const r = reviewOf(id, { field: row.field, sourceIds: sources });
		w(`- \`${id}\` (${row.issueId}/${row.field}; ${sources.join(", ")}; ${r.category} · ${r.fidelity} · ${r.interpretation} · ${r.publication})`);
		w(`  - ${row.claim.text}`);
		if (r.proposed) w(`  - Phase 9 proposed: ${r.proposed}`);
		if (!excerpts) continue;
		for (const e of row.claim.evidence_ids ?? []) {
			if (seen.has(e)) continue;
			seen.add(e);
			const p = passages.get(e);
			w(`  - Passage \`${e}\`${p ? ":" : ": (not in the local workbook)"}`);
			if (p) for (const line of p.split("\n").filter((l) => l.trim())) w(`    > ${line}`);
		}
	}
};
const decisionLine = () => `**Author decision** (choose one): ${Object.values(AUTHOR_DECISIONS).map((d) => `☐ ${d}`).join("  ")}`;
const current = (t) => t.kind === "insight" ? INSIGHTS_V2.find((i) => i.id === t.id) : t.kind === "executive_synthesis" ? EXECUTIVE_SYNTHESIS_V2 : null;

w("# Phase 10 author-review appendix (PRIVATE — DO NOT PUBLISH)");
w();
w(`Generated ${new Date().toISOString().slice(0, 10)} from the committed data layers${passages.size ? ` and ${passages.size} private passages` : " (no private passages available locally)"}.`);
w("Three dimensions stay separate: consistency with the converted minutes (AI-assisted), scientific validity (author), publication approval (author). Nothing here is approved.");
w();
for (const tier of [1, 2]) {
	w(`## Tier ${tier} — ${REVIEW_TIERS[tier]}`);
	w();
	for (const p of PROPOSALS.filter((x) => x.tier === tier)) {
		const c = current(p.target);
		w(`### ${p.id} → ${p.target.kind}${p.target.id ? ` ${p.target.id}` : ""}`);
		w();
		if (c) {
			if (c.title) w(`**Current title:** ${c.title}`);
			w(`**Current public text:** ${c.text}`);
			w();
		}
		if (p.target.kind === "question") {
			const rel = RELATIONSHIP_REVISIONS[p.target.id] ?? ISSUE_RELATIONSHIPS[p.target.id];
			const issue = pkg.issues.find((i) => i.id === p.target.id);
			w(`**Current classification:** ${issue.classification} · relationship ${RELATIONSHIP_TYPES[rel.primary].label}${rel.secondary?.length ? ` (secondary: ${rel.secondary.map((s) => RELATIONSHIP_TYPES[s].label).join(", ")})` : ""} — ${rel.note}`);
			w();
		}
		if (p.proposed?.title) w(`**Proposed title:** ${p.proposed.title}`);
		if (p.proposed?.text) w(`**Proposed text:** ${p.proposed.text}`);
		if (p.proposed?.basis) w(`**Proposed basis:** ${p.proposed.basis.join(", ")}`);
		if (!p.proposed) w("**Proposed:** no change to the wording.");
		w();
		w(`**Why:** ${p.reason}`);
		w(`**Record support:** ${p.support} · **Uncertainty:** ${p.uncertainty}`);
		w(`**Suggested decision:** ${AUTHOR_DECISIONS[p.suggestedDecision]}`);
		w(decisionLine());
		w();
		w("<details><summary>Cited statements and passages</summary>");
		w();
		claimBlock(p.evidence);
		w();
		w("</details>");
		w();
	}
}

w("## Tier 2 details");
w();
w("### Q03 classification options");
for (const o of Q03_PROPOSAL.options) w(`- **${o.label}** — for: ${o.for} Against: ${o.against}`);
w();
w(`Recorded contrast: ${Q03_PROPOSAL.recordedContrast}`);
w();
for (const [k, v] of Object.entries(Q03_PROPOSAL.budgetNote)) w(`- **${k}:** ${v}`);
w();
for (const q of Q03_PROPOSAL.testableQuestions) w(`- **${q.title}:** ${q.text}`);
w();
w(`Current Phase 9 Q03 reassessment: ${Q03_ANALYSIS.reassessment.text}`);
w();
w("### Q07 Layer 2");
const layer2 = Q07_LAYERS.layers.find((l) => l.id === "standards");
w(`**Current:** ${layer2.verdict}. ${layer2.summary} ${layer2.items.map((i) => i.text).join(" ")}`);
w();
w(`**Proposed:** ${Q07_PROPOSAL.layer2.verdict}. ${Q07_PROPOSAL.layer2.text}`);
w();
w(`Where recorded: ${Q07_PROPOSAL.recordedWhere}`);
w();
w("| Use | Evidence needed | Explanation required? |");
w("| --- | --- | --- |");
for (const r of Q07_PROPOSAL.conditional) w(`| ${r.use} | ${r.evidence} | ${r.explanation} |`);
w();
w(Q07_PROPOSAL.conditionalNote);
w();
w("### Regional value: where each link can fail");
for (const t of REGIONAL_TRANSITIONS) {
	const a = REGIONAL_VALUE_LEVELS.find((l) => l.id === t.from).title;
	const b = REGIONAL_VALUE_LEVELS.find((l) => l.id === t.to).title;
	w(`- **${a} → ${b}** (${t.kind}): ${t.failure} Records: ${t.records} [${t.basis.join(", ")}]`);
}
w();
w("### Research objectives (C5)");
for (const r of RESEARCH_OBJECTIVES) w(`- ${r.community}: ${r.optimizes}`);
w(RESEARCH_OBJECTIVES_NOTE);
w();

w(`## Tier 3 — ${REVIEW_TIERS[3]}`);
w();
const tier3 = [...index.claims.values()].map((r) => r.claim.claim_id).filter((id) => {
	const row = index.claim(id);
	return reviewOf(id, { field: row.field, sourceIds: index.sourceIdsOfClaim(row.claim) }).category !== "supported";
});
for (const id of [...tier3, ...Object.keys(REVIEW_OVERRIDES).filter((k) => k.startsWith("theme-"))]) {
	const o = REVIEW_OVERRIDES[id];
	w(`### ${id}`);
	if (index.claim(id)) claimBlock([id]); else w(`- ${o?.note ?? ""}`);
	if (o?.note) w(`- Phase 9 note: ${o.note}`);
	w(decisionLine());
	w();
}

w(`## Tier 4 — ${REVIEW_TIERS[4]}`);
w();
for (const [key, o] of Object.entries(REVIEW_OVERRIDES).filter(([k]) => k.startsWith("p8:"))) {
	w(`- \`${key}\` (${o.category}): ${o.note}${o.proposed ? ` Proposed: ${o.proposed}` : ""}`);
}
for (const f of PHASE10_FINDINGS) w(`- \`${f.id}\` (Phase 10): ${f.note}${f.proposed ? ` Proposed: ${f.proposed}` : ""}`);
w();

w("## Clip audit (38 one-minute highlights)");
w();
w("Key message checked against the clip: **pending for every clip** (the clips were reviewed visually by the owner, but no key message has been compared with clip audio or captions).");
w();
w("| # | Clip | Programme mapping | Minutes-based relations | Key message vs minutes | Withheld |");
w("| --- | --- | --- | --- | --- | --- |");
highlights.forEach((h, n) => {
	const rel = index.issuesForVideo(h.slug);
	const relText = rel.length ? rel.map((r) => `${r.issue.id}${r.basis === "synthesis" ? "*" : ""}`).join(" ") : "none";
	const km = PHASE9_KEY_MESSAGES[h.slug] ? "Phase 9 revised" : VIDEO_KEY_MESSAGES[h.slug] ? (REVIEW_OVERRIDES[`p8:km:${h.slug}`] ? `Phase 8 (${REVIEW_OVERRIDES[`p8:km:${h.slug}`].category})` : "Phase 8 consistent") : "none";
	const withheld = index.withheldForVideo(h.slug).map((x) => x.sourceId).join(" ") || "—";
	w(`| ${n + 1} | ${h.slug} | ${h.mapping} | ${relText} | ${km} | ${withheld} |`);
});
w();
w("`*` = relation through a synthesis statement rather than a direct record.");
w();
w("## Unresolved source mappings (Phase 9 findings)");
for (const m of MAPPING_REVIEW) w(`- **${m.sourceId}** (${m.status}): ${m.finding} Remaining: ${m.remaining}`);
w();

mkdirSync(outDir, { recursive: true });
writeFileSync(outFile, out.join("\n") + "\n");
console.log(`export-phase10-review: wrote ${out.length} lines (${passages.size} private passages) to exports/phase10-20261105-v1/review-matrix.private.md (gitignored)`);
