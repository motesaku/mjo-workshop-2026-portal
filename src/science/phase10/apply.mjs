// Phase 10 — apply ONLY author-approved proposals to what pages render.
//
// Pages read insights, the executive synthesis, the Q03 classification, Q07 Layer 2
// and the regional-value transitions through this module. A proposal changes the
// site only when its decision is "approve" or "approve_with_revisions" and was
// recorded by the author (src/science/phase10/proposals.mjs). Pending, withheld,
// rejected or source-verification decisions leave the Phase 9 wording in place.
import { PROPOSALS, Q03_PROPOSAL, Q07_PROPOSAL, REGIONAL_TRANSITIONS, RESEARCH_OBJECTIVES, RESEARCH_OBJECTIVES_NOTE } from "./proposals.mjs";
import { INSIGHTS_V2, EXECUTIVE_SYNTHESIS_V2 } from "../phase9/synthesis.mjs";

const APPLY = new Set(["approve", "approve_with_revisions"]);
export const isApproved = (p) => Boolean(p?.decision && p.decision.decidedBy === "author" && APPLY.has(p.decision.value));
const find = (kind, id) => PROPOSALS.find((p) => p.target.kind === kind && (id === undefined || p.target.id === id));
const approvalInfo = (p) => (isApproved(p) ? { proposalId: p.id, value: p.decision.value, decidedOn: p.decision.decidedOn, changed: Boolean(p.proposed && (p.proposed.text || p.proposed.title || p.proposed.basis)) } : null);

export const APPROVAL_LABEL = {
	short: "Author-approved wording (Phase 10)",
	long: "Wording approved by the author on 5 November 2026. This is the author's editorial approval, not independent scientific verification; the underlying statements were checked only against the converted, ASR-derived minutes.",
};

/** The eight insights as published: approved Phase 10 wording, otherwise Phase 9. */
export function effectiveInsights() {
	return INSIGHTS_V2.map((insight) => {
		const p = find("insight", insight.id);
		const approval = approvalInfo(p);
		if (!approval) return { ...insight, approval: null, phase9: null };
		return {
			...insight,
			title: p.proposed?.title ?? insight.title,
			text: p.proposed?.text ?? insight.text,
			basis: p.proposed?.basis ?? insight.basis,
			approval,
			phase9: approval.changed ? { title: insight.title, text: insight.text } : null,
		};
	});
}

export function effectiveExecutive() {
	const p = find("executive_synthesis");
	const approval = approvalInfo(p);
	if (!approval) return { ...EXECUTIVE_SYNTHESIS_V2, approval: null, phase9Text: null };
	return { ...EXECUTIVE_SYNTHESIS_V2, text: p.proposed?.text ?? EXECUTIVE_SYNTHESIS_V2.text, basis: p.evidence, approval, phase9Text: p.proposed?.text ? EXECUTIVE_SYNTHESIS_V2.text : null };
}

/** Research-community objectives (C5), shown once the executive synthesis is approved. */
export function researchObjectives() {
	return isApproved(find("executive_synthesis")) ? { items: RESEARCH_OBJECTIVES, note: RESEARCH_OBJECTIVES_NOTE } : null;
}

const q03 = () => find("question", "q03");
/** Classification changes approved by the author, keyed by question id. */
export const CLASSIFICATION_OVERRIDES = isApproved(q03()) && q03().proposed?.classification === "hybrid" ? { q03: "open questions" } : {};

/** Apply approved classification changes to the bundled package (memoized per object). */
const cache = new WeakMap();
export function applyPackage(pkg) {
	if (!Object.keys(CLASSIFICATION_OVERRIDES).length) return pkg;
	if (cache.has(pkg)) return cache.get(pkg);
	const patched = { ...pkg, issues: pkg.issues.map((issue) => (CLASSIFICATION_OVERRIDES[issue.id] ? { ...issue, classification: CLASSIFICATION_OVERRIDES[issue.id], classificationBefore: issue.classification } : issue)) };
	cache.set(pkg, patched);
	return patched;
}

/** Approved Q03 hybrid view, or null. */
export function q03View() {
	const p = q03();
	if (!isApproved(p)) return null;
	return { approval: approvalInfo(p), reassessment: Q03_PROPOSAL.reassessment, verdict: Q03_PROPOSAL.verdict, recordedContrast: Q03_PROPOSAL.recordedContrast, budgetNote: Q03_PROPOSAL.budgetNote, testableQuestions: Q03_PROPOSAL.testableQuestions };
}

/** Approved Q07 Layer 2, or null. */
export function q07Layer2() {
	const p = find("question", "q07");
	if (!isApproved(p)) return null;
	return { approval: approvalInfo(p), ...Q07_PROPOSAL.layer2, recordedWhere: Q07_PROPOSAL.recordedWhere, conditional: Q07_PROPOSAL.conditional, conditionalNote: Q07_PROPOSAL.conditionalNote };
}

/** Approved regional-value transitions, or an empty list. */
export function regionalTransitions() {
	return isApproved(find("question", "q11")) ? REGIONAL_TRANSITIONS : [];
}

/** Sentences that must appear on the site because they were approved (used by verify-phase10). */
export function approvedSentences() {
	return PROPOSALS.filter((p) => isApproved(p) && p.proposed?.text).map((p) => {
		const before = p.target.kind === "insight" ? INSIGHTS_V2.find((i) => i.id === p.target.id)?.text ?? "" : EXECUTIVE_SYNTHESIS_V2.text;
		return { id: p.id, sentence: p.proposed.text.split(/(?<=\.)\s+/).find((s) => s.length > 60 && !before.includes(s)) };
	}).filter((x) => x.sentence);
}
