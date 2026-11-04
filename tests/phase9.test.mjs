// Phase 9 integrity tests. Run: npm run test:phase9
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { highlights } from "../src/data/highlights.ts";
import { createRelationIndex, RECORD_FIELDS } from "../src/science/phase8/relations.mjs";
import { relationContext, SOURCE_RULES } from "../src/science/phase9/context.mjs";
import { phase9Evidence, phase9Sources, sourceQualityOf, SOURCE_QUALITY } from "../src/science/phase9/provenance.mjs";
import { PHASE9_CLAIMS } from "../src/science/phase9/claims.mjs";
import { reviewOf, REVIEW_OVERRIDES, PUBLICATION_RISKS, DISPUTED_SOURCES } from "../src/science/phase9/claim-review.mjs";
import { SOURCE_FIDELITY, INTERPRETATION_LEVELS, PUBLICATION_STATES, REVIEW_CATEGORIES, PHASE9_EDITORIAL } from "../src/science/phase9/status.mjs";
import { INSIGHTS_V2, EXECUTIVE_SYNTHESIS_V2, REGIONAL_VALUE_LEVELS, INSIGHT_ASSESSMENTS, CONTESTED_REVISIONS } from "../src/science/phase9/synthesis.mjs";
import { THEME_COVERAGE, CROSS_CUTTING_GAPS } from "../src/science/phase9/coverage.mjs";
import { RELATIONSHIP_REVISIONS, Q07_LAYERS, Q03_ANALYSIS, ALIGNMENT_FORMS, DISAGREEMENT_MATRIX, COMPLEMENTARY_PERSPECTIVES, FORM_STATES } from "../src/science/phase9/classification.mjs";
import { DEPENDENCIES, PILOTS, PILOT_ASSESSMENTS, PRIORITIZATION_CRITERIA_V2, ASSESSMENT_LEVELS, PARALLEL_START, EXTERNAL_PREREQUISITES, PILOT_STATUS } from "../src/science/phase9/roadmap.mjs";
import { PHASE9_KEY_MESSAGES, MAPPING_REVIEW } from "../src/science/phase9/videos.mjs";
import { ISSUE_RELATIONSHIPS, RELATIONSHIP_TYPES } from "../src/science/phase8/editorial-classification.mjs";
import { INSIGHTS as PHASE8_INSIGHTS, CONTESTED_TOPICS } from "../src/science/phase8/editorial-synthesis.mjs";
import { VIDEO_KEY_MESSAGES } from "../src/science/phase8/editorial-videos.mjs";

const pkg = JSON.parse(readFileSync(new URL("../src/data/personal-synthesis.json", import.meta.url), "utf8"));
const index = createRelationIndex(relationContext({ pkg, highlights }));
const isClaim = (id) => index.claims.has(id);
const known = (id) => isClaim(id) || index.evidence.has(id);
const bySlug = new Map(highlights.map((h) => [h.slug, h]));
// program.ts imports extensionless modules, so read session ids and dates from its text.
const programText = readFileSync(new URL("../src/data/program.ts", import.meta.url), "utf8");
const sessions = new Map();
let currentDate = null;
for (const line of programText.split("\n")) {
	const day = line.match(/date: "(\d{4}-\d{2}-\d{2})"/);
	if (day) currentDate = day[1];
	for (const m of line.matchAll(/\{ id: "([a-z0-9-]+)"/g)) sessions.set(m[1], { id: m[1], date: currentDate });
}
const actionIds = new Set(pkg.actions.map((a) => a.id));
const issueIds = new Set(pkg.issues.map((i) => i.id));
const allBasis = (value, into = []) => {
	if (Array.isArray(value)) value.forEach((v) => allBasis(v, into));
	else if (value && typeof value === "object") for (const [k, v] of Object.entries(value)) k === "basis" ? into.push(...v) : allBasis(v, into);
	return into;
};

test("Phase 9 locators are public-only, follow the ID convention and resolve to sources", () => {
	const pkgEvidence = new Set(pkg.evidence.map((e) => e.evidence_id));
	for (const e of phase9Evidence) {
		assert.ok(!pkgEvidence.has(e.evidence_id), `${e.evidence_id} duplicates the package`);
		assert.deepEqual(Object.keys(e).sort(), ["coverage", "evidence_id", "line_end", "line_start", "locator", "source_id", "verification"]);
		assert.match(e.evidence_id, new RegExp(`^e-${e.source_id.slice(4)}-${e.line_start}-${e.line_end}$`));
		assert.ok(index.sources.has(e.source_id), e.evidence_id);
		assert.ok(e.line_end >= e.line_start);
	}
	for (const s of phase9Sources) {
		assert.ok(!pkg.sources.some((p) => p.source_id === s.source_id), `${s.source_id} already in package`);
		assert.doesNotMatch(JSON.stringify(s), /sha256|\/Users\/|\.md\b/);
	}
	for (const [id, row] of index.claims) for (const e of row.claim.evidence_ids ?? []) assert.ok(index.evidence.has(e), `${id}: unresolved ${e}`);
	for (const s of index.sources.keys()) assert.ok(SOURCE_QUALITY[sourceQualityOf(s)], s);
});

test("Phase 9 records are workshop-record paraphrases attached to existing questions", () => {
	const ids = new Set();
	for (const row of PHASE9_CLAIMS) {
		assert.ok(issueIds.has(row.issueId));
		assert.equal(row.field, "records");
		assert.match(row.claim.claim_id, new RegExp(`^p9-${row.issueId}-r\\d\\d$`));
		assert.ok(!ids.has(row.claim.claim_id)); ids.add(row.claim.claim_id);
		assert.equal(row.claim.origin, "workshop_statement_as_paraphrased_in_minutes");
		assert.ok(row.claim.evidence_ids.length > 0);
		assert.ok(index.claims.get(row.claim.claim_id), row.claim.claim_id);
	}
	// Discussion records are never attributed to named participants.
	const discussion = new Set(["src-welcome", "src-final", "src-closing", "src-g3", "src-g34", "src-p12", "src-p34", "src-obs"]);
	for (const row of PHASE9_CLAIMS) {
		const sources = index.sourceIdsOfClaim(row.claim);
		if (sources.every((s) => discussion.has(s))) assert.doesNotMatch(row.claim.text, /\b(Vitart|Slingo|Molteni|Zhang|Robertson)\b/, row.claim.claim_id);
	}
});

test("source → clip rules stay consistent with the programme; withheld sources produce no links", () => {
	for (const [sourceId, rule] of Object.entries(SOURCE_RULES)) {
		const source = index.sources.get(sourceId);
		assert.ok(source, sourceId);
		if (rule.kind === "withheld") continue;
		const session = sessions.get(rule.sessionId);
		assert.ok(session, `${sourceId}: session`);
		assert.equal(session.date, source.session_date, `${sourceId}: date`);
		for (const slug of rule.slugs) {
			const h = bySlug.get(slug);
			assert.equal(h.sessionId, rule.sessionId, `${sourceId}: ${slug}`);
			if (rule.kind === "named_talk") assert.equal(h.talkSpeaker, rule.speaker);
			else { assert.equal(source.attribution_mode, "unattributed"); assert.equal(h.talkSpeaker, null); assert.equal(h.mapping, "mapped"); }
		}
	}
	const withheld = Object.entries(SOURCE_RULES).filter(([, r]) => r.kind === "withheld").map(([id]) => id).sort();
	assert.deepEqual(withheld, ["src-closing", "src-final", "src-g34", "src-obs", "src-xu"], "Phase 9 must not force withheld mappings");
	for (const issue of pkg.issues) for (const link of index.videosForIssue(issue.id)) {
		for (const s of link.sourceIds) assert.ok(!withheld.includes(s));
		assert.ok(index.issuesForVideo(link.highlight.slug).some((r) => r.issue.id === issue.id), "bidirectional");
	}
	const unlinked = highlights.filter((h) => index.issuesForVideo(h.slug).length === 0).map((h) => h.slug).sort();
	assert.deepEqual(unlinked, ["chang-xu-moisture-convection", "closing-discussion-summary", "final-plenary-discussion", "group-reports-theory-modeling", "mjo-isotope-discussion", "plenary-themes-5-6", "workshop-discussion-observations-ai"]);
	for (const m of MAPPING_REVIEW) assert.equal(SOURCE_RULES[m.sourceId].kind, "withheld", `${m.sourceId}: reviewed mappings remain withheld until author confirmation`);
});

test("review states are explicit, valid and never auto-approved", () => {
	assert.notEqual(PHASE9_EDITORIAL.status, "author_reviewed", "author sign-off cannot be set by this phase");
	for (const [id, row] of index.claims) {
		const r = reviewOf(id, { field: row.field, sourceIds: index.sourceIdsOfClaim(row.claim) });
		assert.ok(SOURCE_FIDELITY[r.fidelity] && INTERPRETATION_LEVELS[r.interpretation] && PUBLICATION_STATES[r.publication] && REVIEW_CATEGORIES[r.category], id);
		assert.notEqual(r.publication, "author_approved", id);
		if (index.sourceIdsOfClaim(row.claim).some((s) => DISPUTED_SOURCES.includes(s))) assert.equal(r.fidelity, "source_mapping_disputed", id);
		if (row.field.startsWith("proposal.")) assert.equal(r.interpretation, "new_research_proposal", id);
		if (r.category !== "supported") assert.equal(r.publication, "draft", id);
	}
	const phase8Ids = new Set([...PHASE8_INSIGHTS.map((i) => i.id), ...CONTESTED_TOPICS.map((t) => t.id), ...Object.keys(VIDEO_KEY_MESSAGES).map((s) => `km:${s}`), ...Object.keys(ISSUE_RELATIONSHIPS).map((q) => `rel-${q}`), "exec"]);
	for (const [key, o] of Object.entries(REVIEW_OVERRIDES)) {
		if (key.startsWith("p8:")) assert.ok(phase8Ids.has(key.slice(3)), `override ${key} names no Phase 8 statement`);
		else if (key.startsWith("theme-")) assert.ok(pkg.themes.some((t) => key.startsWith(`theme-${t.id}-`)), key);
		else assert.ok(isClaim(key), `override ${key}`);
		assert.ok(o.note && o.note.length > 20, key);
		assert.ok(REVIEW_CATEGORIES[o.category] && SOURCE_FIDELITY[o.fidelity], key);
	}
	for (const r of PUBLICATION_RISKS) { assert.ok(r.page.startsWith("/")); assert.ok(["minor", "moderate", "severe"].includes(r.severity)); }
});

test("revised synthesis: insights traceable, old anchors preserved, regional value qualified", () => {
	const anchors = new Set(INSIGHTS_V2.flatMap((i) => [i.id, ...i.aliases]));
	for (const old of PHASE8_INSIGHTS) assert.ok(anchors.has(old.id), `anchor #${old.id} must still resolve`);
	assert.equal(new Set(INSIGHTS_V2.map((i) => i.id)).size, INSIGHTS_V2.length);
	for (const insight of INSIGHTS_V2) {
		for (const id of insight.basis) assert.ok(isClaim(id), `${insight.id}: ${id}`);
		assert.ok(insight.basis.some((id) => RECORD_FIELDS.has(index.claims.get(id).field)), `${insight.id}: needs a workshop-record basis`);
		for (const q of insight.issues) assert.ok(issueIds.has(q));
		for (const p of insight.previous) assert.ok(PHASE8_INSIGHTS.some((o) => o.id === p));
		assert.ok(["merged", "revised", "new", "retained"].includes(insight.change));
		assert.ok(insight.reason.length > 10);
		assert.doesNotMatch(insight.text + insight.title, /\b(consensus was|the workshop agreed|proved|proves|demonstrated benefit)\b/i);
	}
	const regional = INSIGHTS_V2.find((i) => i.id === "insight-regional");
	assert.ok(regional && /No demonstrated decision benefit/.test(regional.text));
	assert.deepEqual(REGIONAL_VALUE_LEVELS.map((l) => l.id), ["index", "response", "hazard", "decision"]);
	for (const l of REGIONAL_VALUE_LEVELS) { for (const b of l.records.basis) assert.ok(isClaim(b), b); assert.ok(l.notShown.length > 10); }
	assert.match(REGIONAL_VALUE_LEVELS[3].notShown, /not claimed/);
	for (const b of [...EXECUTIVE_SYNTHESIS_V2.basis, ...allBasis(CONTESTED_REVISIONS)]) assert.ok(isClaim(b), b);
	assert.match(EXECUTIVE_SYNTHESIS_V2.text, /not a framework the workshop adopted/);
	assert.equal(INSIGHT_ASSESSMENTS.length, PHASE8_INSIGHTS.length);
});

test("theme coverage covers six programme themes with traceable findings", () => {
	assert.deepEqual(THEME_COVERAGE.map((t) => t.number), [1, 2, 3, 4, 5, 6]);
	for (const t of THEME_COVERAGE) {
		for (const s of t.sessions) assert.ok(sessions.has(s), `${t.id}: ${s}`);
		for (const b of allBasis(t)) assert.ok(isClaim(b), `${t.id}: ${b}`);
		for (const q of t.issues) assert.ok(issueIds.has(q));
		assert.ok(t.sourceNote.length > 20 && t.omission.length > 10);
	}
	assert.ok(THEME_COVERAGE.find((t) => t.number === 6).presence === "underrepresented", "Theme 6 gap must be stated");
	for (const g of CROSS_CUTTING_GAPS) for (const b of g.basis) assert.ok(isClaim(b), b);
});

test("classification is logically consistent; disagreement is separated from complementarity", () => {
	const effective = (q) => RELATIONSHIP_REVISIONS[q] ?? ISSUE_RELATIONSHIPS[q];
	for (const issue of pkg.issues) {
		const rel = effective(issue.id);
		if (issue.classification === "diverging perspectives") assert.equal(RELATIONSHIP_TYPES[rel.primary].genuineDisagreement, true, `${issue.id}: a diverging question needs a genuine-disagreement primary relationship`);
	}
	assert.equal(effective("q07").primary, "different_evaluation_standards");
	assert.deepEqual(Q07_LAYERS.layers.map((l) => l.id), ["objectives", "standards", "open"]);
	assert.match(Q07_LAYERS.layers[0].verdict, /Not a disagreement/);
	assert.equal(Q07_LAYERS.layers[2].items.length, 4);
	assert.deepEqual(Q03_ANALYSIS.processes.map((p) => p.id), ["advection", "convergence", "shallow", "boundary_layer", "temperature"]);
	assert.ok(Q03_ANALYSIS.hypotheses.length >= 3 && Q03_ANALYSIS.tests.length >= 3);
	assert.match(Q03_ANALYSIS.numericalUncertainty.text, /withheld/);
	assert.doesNotMatch(JSON.stringify(Q03_ANALYSIS), /\d+\s?%/, "withheld percentages must not appear");
	assert.deepEqual(Object.keys(ALIGNMENT_FORMS).sort(), pkg.issues.filter((i) => i.classification === "emerging alignment").map((i) => i.id).sort());
	for (const [q, forms] of Object.entries(ALIGNMENT_FORMS)) {
		for (const k of ["problem", "method", "physics", "endorsement"]) assert.ok(FORM_STATES[forms[k].state], `${q}.${k}`);
		assert.equal(forms.endorsement.state, "not_recorded", `${q}: no formal endorsement is documented`);
	}
	for (const row of DISAGREEMENT_MATRIX) {
		assert.ok(issueIds.has(row.issue));
		assert.equal(RELATIONSHIP_TYPES[effective(row.issue).primary].genuineDisagreement === true || ["q08"].includes(row.issue) || effective(row.issue).secondary.some((k) => RELATIONSHIP_TYPES[k].genuineDisagreement), true, `${row.issue}: matrix rows must be genuine disagreements`);
	}
	for (const c of COMPLEMENTARY_PERSPECTIVES) assert.ok(issueIds.has(c.issue));
	for (const b of allBasis({ Q07_LAYERS, Q03_ANALYSIS, ALIGNMENT_FORMS, DISAGREEMENT_MATRIX, COMPLEMENTARY_PERSPECTIVES, RELATIONSHIP_REVISIONS })) assert.ok(known(b), b);
});

test("roadmap: acyclic dependency graph, parallel starts and three linked pilots", () => {
	const nodes = new Set([...DEPENDENCIES.flatMap((d) => [d.from, d.to]), ...PARALLEL_START]);
	for (const n of nodes) assert.ok(actionIds.has(n), n);
	for (const d of DEPENDENCIES) { assert.notEqual(d.from, d.to); assert.ok(["required", "helpful"].includes(d.strength)); for (const b of d.basis) assert.ok(isClaim(b), b); }
	const visit = (n, stack = new Set()) => { assert.ok(!stack.has(n), `cycle through ${n}`); stack.add(n); for (const d of DEPENDENCIES.filter((x) => x.from === n)) visit(d.to, new Set(stack)); };
	for (const n of actionIds) visit(n);
	for (const n of PARALLEL_START) assert.ok(!DEPENDENCIES.some((d) => d.to === n), `${n} cannot both start in parallel and have prerequisites`);
	assert.ok(EXTERNAL_PREREQUISITES["action-q11"].some((t) => /hazard or decision target/.test(t)));
	assert.equal(PILOTS.length, 3);
	for (const p of PILOTS) {
		for (const q of p.questions) assert.ok(issueIds.has(q), `${p.id}: ${q}`);
		for (const w of p.workflows) assert.ok(actionIds.has(w), `${p.id}: ${w}`);
		for (const b of [...p.evidence, ...allBasis(p.hypotheses)]) assert.ok(isClaim(b), `${p.id}: ${b}`);
		assert.ok(p.hypotheses.length >= 3 && p.data.length && p.metrics.length && p.criteria.length && p.outputs.length && p.risks.length);
		for (const k of ["d30", "d60", "d90"]) assert.ok(p.plan[k].length > 0);
		assert.doesNotMatch(JSON.stringify(p.roles), /\b(Dr|Prof)\.?\s|[A-Z][a-z]+ [A-Z][a-z]+ will\b/, `${p.id}: no assignments to people`);
		const a = PILOT_ASSESSMENTS[p.id];
		for (const c of PRIORITIZATION_CRITERIA_V2) assert.ok(ASSESSMENT_LEVELS[a[c.id].level], `${p.id}.${c.id}`);
	}
	assert.ok(Object.values(PILOT_ASSESSMENTS).some((a) => Object.values(a).some((v) => v.level === "unknown")), "unknown must be used where evidence is missing");
	assert.doesNotMatch(JSON.stringify(PILOT_ASSESSMENTS), /\b\d+(\.\d+)?\s*\/\s*\d+\b|score/i, "no numerical scores");
	assert.match(PILOT_STATUS, /not workshop priorities/);
	assert.doesNotMatch(JSON.stringify(PILOTS.find((p) => p.id === "pilot-a")), /barrier (is|has been) (established|shown) to (depend|vary)/i);
});

test("Phase 9 key messages condense statements citing the clip's own minutes", () => {
	for (const [slug, entry] of Object.entries(PHASE9_KEY_MESSAGES)) {
		assert.ok(bySlug.has(slug), slug);
		const linked = Object.entries(SOURCE_RULES).filter(([, r]) => r.kind !== "withheld" && (r.slugs ?? []).includes(slug)).map(([id]) => id);
		for (const id of entry.basis) {
			const row = index.claims.get(id);
			assert.ok(row && RECORD_FIELDS.has(row.field), `${slug}: ${id}`);
			assert.ok(index.sourceIdsOfClaim(row.claim).some((s) => linked.includes(s)), `${slug}: ${id} does not cite this clip's minutes`);
		}
		if (entry.replaces) assert.ok(REVIEW_OVERRIDES[entry.replaces], `${slug}: replacement must be justified in the review matrix`);
		assert.ok(entry.text.length < 400);
	}
	assert.doesNotMatch(PHASE9_KEY_MESSAGES["plenary-themes-3-4"].text, /observations alone/, "content from withheld minutes must not appear");
});

test("Phase 9 files are English-only, private-path-free and labels are accurate", () => {
	const dir = new URL("../src/science/phase9/", import.meta.url);
	for (const file of readdirSync(dir)) {
		const text = readFileSync(new URL(file, dir), "utf8");
		assert.doesNotMatch(text, /[぀-ヿ㐀-鿿]/, `${file}: English only`);
		assert.doesNotMatch(text, /\/Users\/|file:\/\/|researcher_os|sha256:|provenance\.private/, `${file}: no private paths or fingerprints`);
	}
	const walk = (url) => readdirSync(url, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(new URL(`${e.name}/`, url)) : [new URL(e.name, url)]));
	for (const file of walk(new URL("../src/", import.meta.url)).filter((u) => /\.(astro|ts|mjs)$/.test(u.pathname) && !u.pathname.endsWith("phase9/claim-review.mjs"))) {
		const text = readFileSync(file, "utf8");
		assert.doesNotMatch(text, />\s*Video [Ee]vidence\s*</, `${file.pathname}: use "Related video highlights"`);
		assert.doesNotMatch(text, /synthesis of reviewed minutes|recur in the reviewed records/, `${file.pathname}: minutes are not reviewed`);
	}
});
