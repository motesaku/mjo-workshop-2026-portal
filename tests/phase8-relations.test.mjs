// Phase 8 referential-integrity tests. Run: npm run test:phase8
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { highlights } from "../src/data/highlights.ts";
import { createRelationIndex, issueClaims, proposalClaims } from "../src/science/phase8/relations.mjs";
import { SOURCE_VIDEO_RULES, OVERLAP_GROUPS } from "../src/science/phase8/source-video-map.mjs";
import { supplementalEvidence, supplementalSources } from "../src/science/phase8/provenance-supplement.mjs";
import { VIDEO_KEY_MESSAGES, ISSUE_SIGNIFICANCE, ACTION_CROSS_LINKS } from "../src/science/phase8/editorial-videos.mjs";

const pkg = JSON.parse(readFileSync(new URL("../src/data/personal-synthesis.json", import.meta.url), "utf8"));
const DAY_OF = { mon: "2026-10-26", tue: "2026-10-27", wed: "2026-10-28", thu: "2026-10-29", fri: "2026-10-30" };
const dayOfSession = (sessionId) => DAY_OF[sessionId.split("-")[0]];
const index = createRelationIndex({
	pkg, highlights,
	supplement: { evidence: supplementalEvidence, sources: supplementalSources },
	sourceVideoRules: SOURCE_VIDEO_RULES, overlapGroups: OVERLAP_GROUPS, actionCrossLinks: ACTION_CROSS_LINKS,
});
const bySlug = new Map(highlights.map((h) => [h.slug, h]));
const known = (id) => index.claims.has(id) || index.evidence.has(id);

function collectEvidenceIds(value, into = new Set()) {
	if (Array.isArray(value)) value.forEach((v) => collectEvidenceIds(v, into));
	else if (value && typeof value === "object") for (const [k, v] of Object.entries(value)) k === "evidence_ids" ? v.forEach((id) => into.add(id)) : collectEvidenceIds(v, into);
	return into;
}

test("package counts are preserved", () => {
	assert.equal(highlights.length, 38);
	assert.equal(new Set(highlights.map((h) => h.youtubeId)).size, 38);
	assert.equal(pkg.issues.length, 12);
	assert.equal(pkg.actions.length, 12);
	assert.equal(pkg.themes.length, 2);
});

test("supplement only adds missing public locators and resolves every issue evidence id", () => {
	const pkgEvidence = new Set(pkg.evidence.map((e) => e.evidence_id));
	for (const e of supplementalEvidence) {
		assert.ok(!pkgEvidence.has(e.evidence_id), `${e.evidence_id} already in package`);
		assert.ok(index.sources.has(e.source_id), `${e.evidence_id}: source ${e.source_id}`);
		assert.deepEqual(Object.keys(e).sort(), ["coverage", "evidence_id", "line_end", "line_start", "locator", "source_id", "verification"]);
		assert.match(e.evidence_id, new RegExp(`^e-${e.source_id.slice(4)}-${e.line_start}-${e.line_end}$`));
	}
	for (const id of collectEvidenceIds(pkg.issues)) assert.ok(index.evidence.has(id), `unresolved evidence ${id}`);
	for (const t of pkg.themes) for (const s of t.sections) for (const item of s.items) for (const ref of item.refs) {
		assert.ok(index.evidence.has(ref) || pkg.references.some((r) => r.id === ref), `theme ref ${ref}`);
	}
});

test("every source has a mapping rule consistent with the programme", () => {
	for (const source of index.sources.values()) assert.ok(SOURCE_VIDEO_RULES[source.source_id], `no rule for ${source.source_id}`);
	for (const [sourceId, rule] of Object.entries(SOURCE_VIDEO_RULES)) {
		const source = index.sources.get(sourceId);
		assert.ok(source, `rule for unknown source ${sourceId}`);
		if (rule.kind === "withheld") {
			assert.ok(rule.reason.length > 40, sourceId);
			for (const slug of rule.candidateSlugs) assert.ok(bySlug.has(slug), `${sourceId}: candidate ${slug}`);
			continue;
		}
		assert.ok(rule.slugs.length > 0, sourceId);
		assert.equal(dayOfSession(rule.sessionId), source.session_date, `${sourceId}: session date`);
		for (const slug of rule.slugs) {
			const h = bySlug.get(slug);
			assert.ok(h, `${sourceId}: ${slug}`);
			assert.equal(h.sessionId, rule.sessionId, `${sourceId}: ${slug} session`);
			if (rule.kind === "named_talk") {
				assert.equal(source.attribution_mode, "named_talk", sourceId);
				assert.equal(h.talkSpeaker, rule.speaker, `${sourceId}: speaker`);
				assert.notEqual(h.mapping, "unmapped");
			} else {
				assert.equal(rule.kind, "session");
				assert.equal(source.attribution_mode, "unattributed", sourceId);
				assert.equal(h.talkSpeaker, null, `${sourceId}: discussion clips carry no speaker`);
				assert.equal(h.mapping, "mapped", `${sourceId}: only verified session mappings`);
			}
		}
	}
});

test("withheld sources never produce video links", () => {
	const withheld = Object.entries(SOURCE_VIDEO_RULES).filter(([, r]) => r.kind === "withheld").map(([id]) => id);
	assert.deepEqual(withheld.sort(), ["src-closing", "src-final", "src-g34", "src-obs", "src-xu"]);
	for (const issue of pkg.issues) for (const link of index.videosForIssue(issue.id)) {
		for (const s of link.sourceIds) assert.ok(!withheld.includes(s), `${issue.id} → ${link.highlight.slug} via ${s}`);
	}
	assert.equal(index.issuesForVideo("chang-xu-moisture-convection").length, 0);
	assert.ok(index.withheldForVideo("chang-xu-moisture-convection").some((w) => w.sourceId === "src-xu"));
});

test("video ↔ question links are bidirectional and evidence-derived", () => {
	let pairs = 0;
	for (const issue of pkg.issues) {
		for (const link of index.videosForIssue(issue.id)) {
			pairs++;
			assert.ok(index.issuesForVideo(link.highlight.slug).some((r) => r.issue.id === issue.id), `${issue.id} ↔ ${link.highlight.slug}`);
			assert.ok(link.claims.length > 0);
			for (const row of link.claims) {
				assert.equal(row.issueId, issue.id);
				assert.ok(index.sourceIdsOfClaim(row.claim).some((s) => link.sourceIds.includes(s)));
			}
		}
	}
	assert.ok(pairs >= 40, `expected a dense evidence-derived network, got ${pairs}`);
	for (const h of highlights) for (const r of index.issuesForVideo(h.slug)) {
		assert.ok(index.videosForIssue(r.issue.id).some((v) => v.highlight.slug === h.slug), `${h.slug} ↔ ${r.issue.id}`);
	}
	// The representative breakout clip keeps its Q01 link through the supplemented g3 locator.
	assert.ok(index.issuesForVideo("breakout-themes-3-4").some((r) => r.issue.id === "q01"));
	assert.ok(index.videosForAction("action-q01").some((v) => v.highlight.slug === "breakout-themes-3-4"));
});

test("clips without a reviewable source stay unlinked", () => {
	const unlinked = highlights.filter((h) => index.issuesForVideo(h.slug).length === 0).map((h) => h.slug).sort();
	assert.deepEqual(unlinked, [
		"chang-xu-moisture-convection", "closing-discussion-summary", "final-plenary-discussion",
		"group-reports-theory-modeling", "mitch-moncrieff-global-data-global-patterns", "mjo-isotope-discussion",
		"plenary-themes-5-6", "welcome-introductory-talks", "workshop-discussion-observations-ai",
	]);
});

test("action relations: primary, cross-links and video evidence", () => {
	for (const action of pkg.actions) {
		const issues = index.issuesForAction(action.id);
		assert.equal(issues[0].issue.id, action.issue_id);
		assert.equal(issues[0].relation, "primary");
		assert.ok(index.actionsForIssue(action.issue_id).some((a) => a.action.id === action.id && a.relation === "primary"));
		for (const v of index.videosForAction(action.id)) {
			assert.ok(proposalClaims(pkg.issues.find((i) => i.id === action.issue_id)).some((row) => index.sourceIdsOfClaim(row.claim).some((s) => v.sourceIds.includes(s))));
		}
	}
	const distinct = new Set(pkg.actions.map((a) => index.videosForAction(a.id).map((v) => v.highlight.slug).join(",")));
	assert.ok(distinct.size > 6, "actions must not all point to the same clip");
	for (const link of ACTION_CROSS_LINKS) {
		const action = pkg.actions.find((a) => a.id === link.actionId);
		assert.ok(action, link.actionId);
		assert.notEqual(action.issue_id, link.issueId, "cross-link must add a second question");
		assert.ok(pkg.issues.some((i) => i.id === link.issueId));
		assert.ok(link.rationale.length > 30);
		for (const id of link.basis) assert.ok(known(id), `${link.actionId}: basis ${id}`);
		assert.ok(index.actionsForIssue(link.issueId).some((a) => a.action.id === link.actionId && a.relation === "cross-link"));
	}
});

test("key messages condense claims that cite the clip's own minutes", () => {
	for (const [slug, entry] of Object.entries(VIDEO_KEY_MESSAGES)) {
		assert.ok(bySlug.has(slug), slug);
		const linkedSources = Object.entries(SOURCE_VIDEO_RULES).filter(([, r]) => (r.slugs ?? []).includes(slug)).map(([id]) => id);
		assert.ok(linkedSources.length > 0, `${slug}: key message without a linked source`);
		assert.ok(entry.basis.length > 0);
		for (const id of entry.basis) {
			const row = index.claims.get(id);
			assert.ok(row, `${slug}: ${id}`);
			assert.ok(["records", "positions"].includes(row.field), `${slug}: ${id} must be a workshop-record claim`);
			assert.ok(index.sourceIdsOfClaim(row.claim).some((s) => linkedSources.includes(s)), `${slug}: ${id} does not cite this clip's minutes`);
		}
		assert.ok(entry.text.length < 330, `${slug}: keep key messages concise`);
	}
});

test("question significance and editorial text are English, complete and traceable", () => {
	assert.deepEqual(Object.keys(ISSUE_SIGNIFICANCE).sort(), pkg.issues.map((i) => i.id).sort());
	for (const [id, entry] of Object.entries(ISSUE_SIGNIFICANCE)) for (const b of entry.basis) assert.ok(known(b), `${id}: ${b}`);
	for (const file of ["editorial-videos.mjs", "source-video-map.mjs", "provenance-supplement.mjs", "relations.mjs", "status.mjs"]) {
		const text = readFileSync(new URL(`../src/science/phase8/${file}`, import.meta.url), "utf8");
		assert.doesNotMatch(text, /[぀-ヿ㐀-鿿]/, `${file}: English only`);
		assert.doesNotMatch(text, /\/Users\/|file:\/\/|researcher_os|sha256:/, `${file}: no private paths or fingerprints`);
	}
});

test("contribution grouping counts overlapping discussion records once", () => {
	const groups = index.contributionGroups(["q01-c02", "q07-c03", "q01-c03"]);
	const theory = groups.find((g) => g.key === "theory-discussion");
	assert.ok(theory);
	assert.deepEqual(theory.sourceIds.sort(), ["src-g3", "src-g34", "src-p34"]);
	assert.ok(groups.some((g) => g.key === "final-day-discussion"));
	for (const claimRow of pkg.issues.flatMap(issueClaims)) assert.ok(index.claims.has(claimRow.claim.claim_id));
});
