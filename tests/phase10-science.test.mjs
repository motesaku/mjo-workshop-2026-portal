// Phase 10 scientific-layer integrity. Run: npm run test:phase10
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { highlights } from "../src/data/highlights.ts";
import { createRelationIndex } from "../src/science/phase8/relations.mjs";
import { relationContext } from "../src/science/phase9/context.mjs";
import { INSIGHTS_V2, EXECUTIVE_SYNTHESIS_V2, REGIONAL_VALUE_LEVELS } from "../src/science/phase9/synthesis.mjs";
import { PHASE10_REVIEW, AUTHOR_DECISIONS, PROPOSALS, Q03_PROPOSAL, Q07_PROPOSAL, REGIONAL_TRANSITIONS, PHASE10_FINDINGS, RECORD_SUPPORT, REVIEW_TIERS, RESEARCH_OBJECTIVES } from "../src/science/phase10/proposals.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
const pkg = JSON.parse(readFileSync(join(root, "src/data/personal-synthesis.json"), "utf8"));
const index = createRelationIndex(relationContext({ pkg, highlights }));
const isClaim = (id) => index.claims.has(id);
const insightById = new Map(INSIGHTS_V2.map((i) => [i.id, i]));

/** A decision may only be recorded by the author, with a date. */
function validDecision(d) {
	return d === null || (typeof d === "object" && d.decidedBy === "author" && /^\d{4}-\d{2}-\d{2}$/.test(d.decidedOn ?? "") && Object.hasOwn(AUTHOR_DECISIONS, d.value));
}

test("Phase 10 proposals target existing public text and cite existing statements", () => {
	assert.ok(PROPOSALS.length >= 9);
	for (const p of PROPOSALS) {
		assert.ok(REVIEW_TIERS[p.tier], `${p.id}: tier`);
		const t = p.target;
		if (t.kind === "insight") assert.ok(insightById.has(t.id), `${p.id}: insight ${t.id}`);
		else if (t.kind === "question") assert.ok(pkg.issues.some((i) => i.id === t.id), `${p.id}: question ${t.id}`);
		else assert.equal(t.kind, "executive_synthesis");
		for (const id of [...p.evidence, ...(p.proposed?.basis ?? [])]) assert.ok(isClaim(id), `${p.id}: ${id} is a known statement`);
		assert.ok(RECORD_SUPPORT[p.support], `${p.id}: support`);
		assert.ok(Object.hasOwn(AUTHOR_DECISIONS, p.suggestedDecision), `${p.id}: suggested decision`);
		assert.ok(p.reason.length > 40 && p.uncertainty.length > 10, `${p.id}: reason and uncertainty`);
		const current = t.kind === "insight" ? insightById.get(t.id) : t.kind === "executive_synthesis" ? EXECUTIVE_SYNTHESIS_V2 : null;
		if (current && p.proposed?.text) assert.notEqual(p.proposed.text, current.text, `${p.id}: proposal differs from current text`);
		if (current && p.proposed?.title) assert.notEqual(p.proposed.title, current.title, `${p.id}: proposed title differs`);
	}
	for (const tier1 of ["insight-1", "insight-3", "insight-multiscale", "insight-4", "insight-5", "insight-6", "insight-regional", "insight-7"]) {
		assert.ok(PROPOSALS.some((p) => p.target.id === tier1 && p.tier === 1), `${tier1} has a Tier 1 review entry`);
	}
	assert.ok(PROPOSALS.some((p) => p.target.kind === "executive_synthesis"));
	for (const q of ["q01", "q03", "q07", "q09", "q11"]) assert.ok(PROPOSALS.some((p) => p.tier === 2 && p.target.id === q), `Tier 2 covers ${q}`);
});

test("no Phase 10 proposal is approved automatically", () => {
	assert.notEqual(PHASE10_REVIEW.status, "author_reviewed");
	assert.notEqual(PHASE10_REVIEW.status, "author_approved");
	for (const p of [...PROPOSALS, ...PHASE10_FINDINGS]) assert.ok(validDecision(p.decision), `${p.id}: decision may only be recorded by the author`);
	assert.ok([...PROPOSALS, ...PHASE10_FINDINGS].every((p) => p.decision === null || p.decision.decidedBy === "author"));
});

test("unapproved proposals are not rendered by any page or component", () => {
	const dirs = ["src/pages", "src/components", "src/layouts"];
	const files = [];
	const walk = (dir) => { for (const e of readdirSync(join(root, dir), { withFileTypes: true })) { const p = join(dir, e.name); if (e.isDirectory()) walk(p); else files.push(p); } };
	dirs.forEach(walk);
	const pending = [...PROPOSALS, ...PHASE10_FINDINGS].some((p) => p.decision === null);
	for (const f of files) {
		const src = readFileSync(join(root, f), "utf8");
		if (pending) assert.doesNotMatch(src, /phase10\/proposals/, `${f} must not render pending Phase 10 proposals`);
	}
});

test("Q03 proposal separates a mathematical decomposition from physical mechanisms", () => {
	assert.ok(Q03_PROPOSAL.options.some((o) => o.id === Q03_PROPOSAL.recommended));
	assert.equal(Q03_PROPOSAL.budgetNote.identity, "−∇_h·(q v_h) = −v_h·∇_h q − q ∇_h·v_h");
	assert.match(Q03_PROPOSAL.budgetNote.decomposition, /not two independent physical mechanisms/);
	assert.match(Q03_PROPOSAL.budgetNote.columnVersusLayer, /layer budget/);
	assert.deepEqual(Q03_PROPOSAL.testableQuestions.map((q) => q.id), ["relative", "ordering", "structure", "necessity", "sensitivity"]);
	assert.match(Q03_PROPOSAL.recordedContrast, /not a recorded community-wide dispute/);
});

test("Q07 proposal keeps the disagreement and conditions conclusions on use", () => {
	assert.match(Q07_PROPOSAL.layer2.verdict, /Genuine disagreement/);
	assert.ok(Q07_PROPOSAL.layer2.basis.every(isClaim));
	assert.equal(Q07_PROPOSAL.conditional.length, 3);
	assert.match(Q07_PROPOSAL.conditionalNote, /not a workshop conclusion/);
});

test("regional-value transitions link consecutive levels and label empirical support", () => {
	const ids = REGIONAL_VALUE_LEVELS.map((l) => l.id);
	assert.equal(REGIONAL_TRANSITIONS.length, ids.length - 1);
	REGIONAL_TRANSITIONS.forEach((t, i) => {
		assert.equal(t.from, ids[i]);
		assert.equal(t.to, ids[i + 1]);
		assert.ok(["empirical", "conceptual"].includes(t.kind));
		assert.ok(t.basis.length > 0 && t.basis.every(isClaim), `${t.from}→${t.to}: basis`);
	});
	assert.match(REGIONAL_TRANSITIONS.at(-1).records, /No realized decision benefit/);
	assert.equal(RESEARCH_OBJECTIVES.length, 5);
});

test("Phase 10 science files are English-only and free of private paths", () => {
	for (const f of readdirSync(join(root, "src/science/phase10"))) {
		const src = readFileSync(join(root, "src/science/phase10", f), "utf8");
		assert.doesNotMatch(src, /[぀-ヿ㐀-鿿]/, `${f}: English only`);
		assert.doesNotMatch(src, /\/Users\/|researcher_os|provenance\.private|sha256:[0-9a-f]{6}|exports\/phase/, `${f}: no private paths`);
	}
});

import { DEPENDENCIES as PHASE9_DEPENDENCIES, PILOTS } from "../src/science/phase9/roadmap.mjs";
import { DEPENDENCY_TYPES, DEPENDENCIES_V2, EXTERNAL_PREREQUISITES_V2, STARTABLE_NOW, PILOT_STAGES } from "../src/science/phase10/roadmap.mjs";

test("every Phase 9 relation is typed by what it constrains, and none blocks a start without reason", () => {
	assert.equal(DEPENDENCIES_V2.length, PHASE9_DEPENDENCIES.length);
	for (const d of DEPENDENCIES_V2) {
		assert.ok(DEPENDENCY_TYPES[d.type], `${d.from}→${d.to}: type`);
		assert.ok(["required", "helpful"].includes(d.phase9Strength), "Phase 9 strength kept for lineage");
		assert.ok(d.meanwhile.length > 40, `${d.from}→${d.to}: what can proceed meanwhile`);
		if (d.phase9Strength === "helpful") assert.notEqual(d.type, "start", "a helpful relation cannot block a start");
	}
	const visit = (n, stack = new Set()) => { assert.ok(!stack.has(n), `cycle through ${n}`); stack.add(n); for (const d of DEPENDENCIES_V2.filter((x) => x.from === n)) visit(d.to, new Set(stack)); };
	DEPENDENCIES_V2.forEach((d) => visit(d.from));
	const actions = pkg.actions.map((a) => a.id).sort();
	assert.deepEqual(STARTABLE_NOW, actions.filter((id) => !DEPENDENCIES_V2.some((d) => d.to === id && d.type === "start")));
	for (const items of Object.values(EXTERNAL_PREREQUISITES_V2)) for (const i of items) assert.ok(DEPENDENCY_TYPES[i.type] && i.text);
});

test("each pilot separates startable work from interpretation and publication prerequisites", () => {
	for (const p of PILOTS) {
		const s = PILOT_STAGES[p.id];
		assert.ok(s, `${p.id}: stages`);
		for (const k of ["startable", "interpretation", "publication", "uncertainties"]) assert.ok(Array.isArray(s[k]) && s[k].length > 0, `${p.id}.${k}`);
		assert.ok(s.mvo.length > 30);
		for (const k of ["continue", "revise", "stop"]) assert.ok(s.decisions[k].length > 30, `${p.id}: ${k} criterion`);
		for (const k of ["d30", "d60", "d90"]) assert.ok(s.plan[k].length > 0);
		assert.match(s.plan.d90.join(" "), /Continue, revise or stop/);
	}
	const a = PILOT_STAGES["pilot-a"];
	assert.deepEqual(a.stages.map((x) => x.id), ["descriptive", "process", "causal"]);
	assert.match(a.caution, /not direct evidence for the causal role of convection parameterization/);
	assert.deepEqual(a.controls.map((c) => c.title), ["Evaluation period", "Initialization", "Output availability", "Observational reference", "Training-data overlap"]);
	const b = PILOT_STAGES["pilot-b"];
	assert.match(b.definitionCheck, /Before any quantitative comparison/);
	assert.deepEqual(b.documentation.map((d) => d.title), ["Temporal filtering", "Phase conventions", "Training climatology", "Endpoint effects", "Event definitions", "Regional and seasonal sensitivity", "Source datasets"]);
	assert.match(b.independence, /needs nothing from the other pilots/);
	const c = PILOT_STAGES["pilot-c"];
	assert.equal(c.steps.length, 5);
	assert.match(c.parallel, /does not have to be complete before process analyses begin/);
	assert.ok(c.minimumDatasets.length >= 1);
});

import { SOURCE_LIMITS, COVERAGE_PRINCIPLE } from "../src/science/phase10/coverage.mjs";
import { MAPPING_REVIEW } from "../src/science/phase9/videos.mjs";

test("known limits name the incomplete records without adding conclusions", () => {
	assert.match(COVERAGE_PRINCIPLE, /not an absence of scientific discussion/);
	const ids = SOURCE_LIMITS.map((l) => l.id);
	for (const id of ["breakout-56", "short-minutes", "mappings", "bsiso", "ocean"]) assert.ok(ids.includes(id), id);
	const mappings = SOURCE_LIMITS.find((l) => l.id === "mappings").text;
	assert.equal(MAPPING_REVIEW.length, 5);
	for (const phrase of ["Chang Xu", "final-day record", "closing record", "extended observation and AI minutes", "extended theory minutes", "isotopes"]) assert.ok(mappings.includes(phrase), `unresolved mapping listed: ${phrase}`);
	assert.doesNotMatch(mappings, /src-/, "reader-facing labels, not internal identifiers");
	assert.match(SOURCE_LIMITS.find((l) => l.id === "bsiso").text, /Northward-propagating/);
});

import { isApproved, effectiveInsights, effectiveExecutive, CLASSIFICATION_OVERRIDES, applyPackage, regionalTransitions, q03View, q07Layer2 } from "../src/science/phase10/apply.mjs";

test("only author-approved proposals change what pages render", () => {
	const by = (value, decidedBy = "author") => ({ decision: { value, decidedBy, decidedOn: "2026-11-05" } });
	assert.equal(isApproved({ decision: null }), false);
	assert.equal(isApproved(by("withhold")), false);
	assert.equal(isApproved(by("verify_source")), false);
	assert.equal(isApproved(by("reject")), false);
	assert.equal(isApproved(by("approve", "assistant")), false, "only the author can approve");
	assert.equal(isApproved(by("approve")), true);
	assert.equal(isApproved(by("approve_with_revisions")), true);
	const shown = effectiveInsights();
	assert.equal(shown.length, INSIGHTS_V2.length);
	for (const i of shown) {
		const p = PROPOSALS.find((x) => x.target.kind === "insight" && x.target.id === i.id);
		if (isApproved(p)) {
			assert.ok(i.approval, i.id);
			if (p.proposed?.text) assert.equal(i.text, p.proposed.text);
			if (p.proposed?.title) assert.equal(i.title, p.proposed.title);
			if (p.proposed?.basis) assert.deepEqual(i.basis, p.proposed.basis);
		} else assert.equal(i.text, INSIGHTS_V2.find((x) => x.id === i.id).text, `${i.id}: pending keeps Phase 9 wording`);
	}
	const exec = effectiveExecutive();
	assert.ok(exec.basis.every(isClaim));
	const patched = applyPackage(pkg);
	for (const [q, cls] of Object.entries(CLASSIFICATION_OVERRIDES)) {
		assert.equal(patched.issues.find((i) => i.id === q).classification, cls);
		assert.notEqual(pkg.issues.find((i) => i.id === q).classification, cls, "the bundled package itself is unchanged");
	}
	if (q03View()) assert.equal(CLASSIFICATION_OVERRIDES.q03, "open questions");
	if (q07Layer2()) assert.match(q07Layer2().verdict, /Genuine disagreement/);
	assert.ok(regionalTransitions().every((t) => t.basis.every(isClaim)));
	for (const f of PHASE10_FINDINGS) assert.equal(f.decision, null, `${f.id}: Tier 4 stays pending`);
});
