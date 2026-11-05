// Phase 8 bindings: bundled synthesis + highlight list + Phase 8 editorial layer.
// Pages import from here; the pure logic lives in ./phase8/*.mjs (unit-tested).
import synthesis from "../data/personal-synthesis.json";
import { highlights, type Highlight } from "../data/highlights";
import { days, type Day, type Session } from "../data/program";
import type { ReviewAction, ReviewIssue } from "./theme-review";
import { createRelationIndex, FIELD_LABELS, RECORD_FIELDS } from "./phase8/relations.mjs";
import { VIDEO_KEY_MESSAGES, ISSUE_SIGNIFICANCE } from "./phase8/editorial-videos.mjs";
import { phase8Label, interpretationOf } from "./phase8/status.mjs";
import { relationContext, SOURCE_RULES as SOURCE_VIDEO_RULES } from "./phase9/context.mjs";
import { PHASE9_KEY_MESSAGES } from "./phase9/videos.mjs";
import { applyPackage, effectiveInsights, q03View } from "./phase10/apply.mjs";
/** The bundled package with author-approved Phase 10 classification changes applied. */
const pkg = applyPackage(synthesis) as typeof synthesis;

export { FIELD_LABELS, phase8Label, interpretationOf };

export interface Claim { claim_id: string; text: string; evidence_ids?: string[]; origin: string; verification?: string }
export interface ClaimRow { issueId: string; field: string; claim: Claim }
export interface SourceRecord { source_id: string; title: string; session_date: string | null; contribution_family: string; attribution_mode: string | null; coverage: string; limitations: string; source_review_status: string; supplemental?: boolean }
export interface EvidenceRecord { evidence_id: string; source_id: string; line_start: number; line_end: number; locator: string; verification: string; supplemental?: boolean }
export interface VideoLink { highlight: Highlight & { order: number }; sourceIds: string[]; claims: ClaimRow[]; basis: "record" | "synthesis" }
export interface IssueVideoLink { issue: ReviewIssue; sourceIds: string[]; claims: ClaimRow[]; basis: "record" | "synthesis" }
export interface WithheldLink { sourceId: string; source?: SourceRecord; reason: string; candidateSlugs?: string[]; claimIds?: string[]; issueIds?: string[] }
export interface ActionLink { action: ReviewAction; relation: "primary" | "cross-link"; rationale?: string; basis?: string[] }
export interface IssueActionLink { issue: ReviewIssue; relation: "primary" | "cross-link"; rationale?: string; basis?: string[] }
export interface ContributionGroup { key: string; label: string; overlapReason: string | null; sourceIds: string[] }
export interface Basis { text: string; basis: string[] }

export const relations = createRelationIndex(relationContext({ pkg, highlights }));
/** Phase 9 workshop-record statements attached to one question. */
export const supplementalClaimsFor = (issueId: string) => relations.supplementalRows(issueId) as ClaimRow[];

const issueList = pkg.issues as unknown as ReviewIssue[];
const actionList = (pkg.actions ?? []) as ReviewAction[];

export const getIssue = (id: string) => issueList.find((i) => i.id === id);
export const getActionById = (id: string) => actionList.find((a) => a.id === id);
export const actionForIssue = (issueId: string) => actionList.find((a) => a.issue_id === issueId);
export const allIssues = () => issueList;
export const allActions = () => actionList;

export const getClaim = (id: string) => relations.claim(id) as ClaimRow | undefined;
export const getSource = (id: string) => relations.source(id) as SourceRecord | undefined;
export const getEvidence = (id: string) => relations.evidence.get(id) as EvidenceRecord | undefined;
export const sourceIdsOfClaim = (claim: Claim) => relations.sourceIdsOfClaim(claim) as string[];

export const videosForIssue = (issueId: string) => relations.videosForIssue(issueId) as VideoLink[];
export const withheldForIssue = (issueId: string) => relations.withheldForIssue(issueId) as WithheldLink[];
export const issuesForVideo = (slug: string) => relations.issuesForVideo(slug) as IssueVideoLink[];
export const withheldForVideo = (slug: string) => relations.withheldForVideo(slug) as WithheldLink[];
export const actionsForIssue = (issueId: string) => relations.actionsForIssue(issueId) as ActionLink[];
export const issuesForAction = (actionId: string) => relations.issuesForAction(actionId) as IssueActionLink[];
export const videosForAction = (actionId: string) => relations.videosForAction(actionId) as VideoLink[];
export const actionsForVideo = (slug: string) => relations.actionsForVideo(slug) as ReviewAction[];
export const videosForClaims = (claimIds: string[]) => relations.videosForClaims(claimIds) as VideoLink[];
export const contributionGroups = (claimIds: string[]) => relations.contributionGroups(claimIds) as ContributionGroup[];
export const issueSignificance = (issueId: string) => (ISSUE_SIGNIFICANCE as Record<string, Basis>)[issueId];

/** Unique videos across several issues, ordered chronologically. */
export function videosForIssues(issueIds: string[]): VideoLink[] {
	const bySlug = new Map<string, VideoLink>();
	for (const id of issueIds) for (const link of videosForIssue(id)) if (!bySlug.has(link.highlight.slug)) bySlug.set(link.highlight.slug, link);
	return [...bySlug.values()].sort((a, b) => a.highlight.order - b.highlight.order);
}

/** Videos whose source minutes are cited by the given evidence/reference IDs (theme pages). */
export function videosForEvidenceIds(ids: string[]): Highlight[] {
	const slugs = new Set<string>();
	for (const id of ids) {
		const e = getEvidence(id);
		if (!e) continue;
		const rule = relations.ruleFor(e.source_id) as { kind: string; slugs?: string[] };
		if (rule.kind === "withheld" || rule.kind === "unmapped") continue;
		for (const slug of rule.slugs ?? []) slugs.add(slug);
	}
	return highlights.filter((h) => slugs.has(h.slug));
}

/** Reader-facing name of a source record: speaker + short title for programme talks. */
export function sourceLabel(sourceId: string): string {
	const source = getSource(sourceId);
	const rule = SOURCE_VIDEO_RULES[sourceId as keyof typeof SOURCE_VIDEO_RULES] as { kind: string; speaker?: string } | undefined;
	if (!source) return sourceId;
	if (rule?.speaker) return `${rule.speaker} — ${source.title}`;
	return source.title;
}

export function sessionOf(sessionId: string | null): { day: Day; session: Session } | undefined {
	if (!sessionId) return undefined;
	for (const day of days) for (const session of day.sessions) if (session.id === sessionId) return { day, session };
	return undefined;
}

export type SummaryStatus = "minutes_based_draft" | "related_only" | "mapping_disputed" | "pending";

export interface VideoRecord {
	highlight: Highlight;
	session?: { day: Day; session: Session };
	speaker: string | null;
	keyMessage: Basis | null;
	statements: (ClaimRow & { issue: ReviewIssue })[];
	relatedIssues: IssueVideoLink[];
	relatedActions: ReviewAction[];
	actionsViaQuestions: ReviewAction[];
	withheld: WithheldLink[];
	sourceIds: string[];
	evidenceIds: string[];
	summaryStatus: SummaryStatus;
	publicationPermission: Highlight["publicationPermission"];
	/** Which editorial layer wrote the key message (Phase 9 revisions take precedence). */
	keyMessagePhase: "phase8" | "phase9" | null;
	audit: VideoAudit;
}

/** Phase 9E: the five relationship dimensions of one clip. */
export interface VideoAudit {
	programme: Highlight["mapping"];
	minutes: "linked" | "withheld" | "none";
	summaryVsMinutes: "consistent" | "revised" | "no_summary";
	summaryVsClip: "not_checked";
	withheldSources: string[];
}

/** Complete Phase 8 record for one highlight (media metadata + derived science links). */
export function videoRecord(highlight: Highlight): VideoRecord {
	const relatedIssues = issuesForVideo(highlight.slug);
	const statements = relations.statementsForVideo(highlight.slug) as (ClaimRow & { issue: ReviewIssue })[];
	const relatedActions = actionsForVideo(highlight.slug);
	const actionsViaQuestions = relatedIssues
		.map(({ issue }) => actionForIssue(issue.id))
		.filter((a): a is ReviewAction => !!a && !relatedActions.some((r) => r.id === a.id));
	const withheld = withheldForVideo(highlight.slug);
	const sourceIds = [...new Set(relatedIssues.flatMap((r) => r.sourceIds))];
	const evidenceIds = [...new Set(relatedIssues.flatMap((r) => r.claims.flatMap((c) => c.claim.evidence_ids ?? [])))].filter((id) => sourceIds.includes(getEvidence(id)?.source_id ?? ""));
	const p9 = (PHASE9_KEY_MESSAGES as Record<string, Basis>)[highlight.slug];
	const p8 = (VIDEO_KEY_MESSAGES as Record<string, Basis>)[highlight.slug];
	const keyMessage = p9 ?? p8 ?? null;
	const keyMessagePhase = p9 ? "phase9" : p8 ? "phase8" : null;
	const disputed = withheld.some((w) => w.sourceId === "src-xu");
	const summaryStatus: SummaryStatus = keyMessage ? "minutes_based_draft" : disputed ? "mapping_disputed" : relatedIssues.length ? "related_only" : "pending";
	const audit: VideoAudit = {
		programme: highlight.mapping,
		minutes: relatedIssues.length ? "linked" : withheld.length ? "withheld" : "none",
		summaryVsMinutes: !keyMessage ? "no_summary" : p9 ? "revised" : "consistent",
		summaryVsClip: "not_checked",
		withheldSources: withheld.map((w) => w.sourceId),
	};
	return {
		highlight,
		session: sessionOf(highlight.sessionId),
		speaker: highlight.talkSpeaker,
		keyMessage,
		statements,
		relatedIssues,
		relatedActions,
		actionsViaQuestions,
		withheld,
		sourceIds,
		evidenceIds,
		summaryStatus,
		publicationPermission: highlight.publicationPermission,
		keyMessagePhase,
		audit,
	};
}

export const SUMMARY_STATUS_LABELS: Record<SummaryStatus, { badge: string; text: string }> = {
	minutes_based_draft: {
		badge: "Minutes-based summary · not checked against the clip",
		text: "The key message condenses statements that the personal synthesis paraphrases from converted (ASR-derived) minutes of this talk or session. It was not written from, or checked against, the one-minute clip.",
	},
	related_only: {
		badge: "No summary · related through cited minutes",
		text: "No clip-level summary is given. The related questions below show how the synthesis uses the minutes of this talk or session.",
	},
	mapping_disputed: {
		badge: "Source mapping disputed",
		text: "The minutes filed under this talk do not match its programme title, so no scientific summary or question link is shown until the mapping is resolved.",
	},
	pending: {
		badge: "Scientific summary pending",
		text: "No reviewed source in the personal synthesis is tied to this clip yet. No scientific summary is shown, and no question is linked.",
	},
};

export const isRecordField = (field: string) => RECORD_FIELDS.has(field);

// ---- 8C: classification layer -------------------------------------------
import { RELATIONSHIP_TYPES, ISSUE_RELATIONSHIPS, DIVERGENCE_ANALYSES, ALIGNMENT_ANALYSES, INDEPENDENCE_NOTE } from "./phase8/editorial-classification.mjs";
import { RELATIONSHIP_REVISIONS } from "./phase9/classification.mjs";
export { RELATIONSHIP_TYPES, INDEPENDENCE_NOTE };

export type RelationshipKey = keyof typeof RELATIONSHIP_TYPES;
export interface RelationshipType { label: string; code: string; genuineDisagreement: boolean | null; description: string }
export interface IssueRelationship { primary: RelationshipKey; secondary: RelationshipKey[]; note: string; basis: string[] }
export interface DivergenceAnalysis {
	reassessment: Basis;
	positions: { label: string; claimIds: string[] }[];
	nature: Basis;
	comparisonClaim: string;
	evidence: string[];
	compatibility: Basis;
	distinguishing: string[];
	uncertainty: string[];
}
export interface AlignmentAnalysis { direction: string; support: string[]; limitations: string; strongerConfidence: Basis }

export const relationshipType = (key: RelationshipKey) => RELATIONSHIP_TYPES[key] as RelationshipType;
/** Phase 9 relationship revisions (classification.mjs) take precedence over Phase 8. */
export const issueRelationship = (issueId: string) => ((RELATIONSHIP_REVISIONS as Record<string, IssueRelationship>)[issueId] ?? (ISSUE_RELATIONSHIPS as Record<string, IssueRelationship>)[issueId]);
/** The Phase 8 relationship, kept for side-by-side review. */
export const phase8Relationship = (issueId: string) => (ISSUE_RELATIONSHIPS as Record<string, IssueRelationship>)[issueId];
export const divergenceAnalysis = (issueId: string) => (DIVERGENCE_ANALYSES as Record<string, DivergenceAnalysis>)[issueId];
export const alignmentAnalysis = (issueId: string) => (ALIGNMENT_ANALYSES as Record<string, AlignmentAnalysis>)[issueId];

/** Plain-language verdict: is this a genuine disagreement? */
export function disagreementVerdict(issueId: string): "genuine" | "partial" | "complementary" | "undetermined" | "open_contrast" {
	if (issueId === "q03" && q03View()) return "open_contrast";
	const rel = issueRelationship(issueId);
	if (!rel) return "undetermined";
	const primary = relationshipType(rel.primary).genuineDisagreement;
	const secondary = rel.secondary.some((k) => relationshipType(k).genuineDisagreement);
	if (primary === true) return "genuine";
	if (primary === false) return secondary ? "partial" : "complementary";
	return "undetermined";
}
export const VERDICT_LABELS = {
	genuine: "Genuine scientific disagreement",
	partial: "Mostly complementary, with a residual disagreement",
	complementary: "Complementary approaches, not disagreement",
	undetermined: "Relationship not yet determinable",
	open_contrast: "Open question with one recorded contrast",
} as const;

// ---- 8D: strategic roadmap ------------------------------------------------
import { PRIORITY_AREAS, ACTION_CHAINS, PRIORITIZATION_CRITERIA, PRIORITIZATION_NOTE, ROADMAP_STATUS } from "./phase8/editorial-roadmap.mjs";
export { PRIORITIZATION_CRITERIA, PRIORITIZATION_NOTE, ROADMAP_STATUS };

export interface PriorityArea {
	id: string; numeral: string; title: string; shortTitle: string; objective: string;
	coreIssues: string[]; crossCuttingIssues: string[];
	gap: Basis; observationsAndOutputs: Basis[]; nextInvestigation: Basis; deliverable: Basis;
}
export const priorityAreas = () => PRIORITY_AREAS as PriorityArea[];
export const priorityAreaForIssue = (issueId: string) => priorityAreas().find((a) => a.coreIssues.includes(issueId) || a.crossCuttingIssues.includes(issueId));
export const priorityAreaForAction = (actionId: string) => {
	const action = getActionById(actionId);
	return action ? priorityAreaForIssue(action.issue_id) : undefined;
};
export const areaIssueIds = (area: PriorityArea) => [...area.coreIssues, ...area.crossCuttingIssues];

export interface ActionChain {
	objective: string;
	hypothesis: string;
	basis: string[];
	method: Claim[];
	deliverable: Claim | null;
	criteria: Claim | null;
	limitations: Claim | null;
	tools: string;
}
/** Scientific Objective → Testable Hypothesis → Method → Deliverable → Evaluation Criteria. */
export function actionChain(actionId: string): ActionChain | undefined {
	const action = getActionById(actionId);
	const chain = (ACTION_CHAINS as Record<string, { objective: string; hypothesis: string; basis: string[] }>)[actionId];
	const issue = action ? getIssue(action.issue_id) : undefined;
	const proposal = issue?.proposed_research as Record<string, unknown> | undefined;
	if (!action || !chain || !proposal) return undefined;
	const one = (key: string) => (proposal[key] && typeof proposal[key] === "object" ? (proposal[key] as Claim) : null);
	return {
		...chain,
		method: (Array.isArray(proposal.steps) ? proposal.steps : []) as Claim[],
		deliverable: one("expected_outputs"),
		criteria: one("discriminating_result"),
		limitations: one("limitations"),
		tools: typeof proposal.agent_role === "string" ? proposal.agent_role : "",
	};
}

// ---- 8E: workshop synthesis -------------------------------------------------
import { SYNTHESIS_INTRO, EXECUTIVE_SYNTHESIS, INSIGHTS, CONTESTED_TOPICS } from "./phase8/editorial-synthesis.mjs";
import { INTERPRETATION_TYPES } from "./phase8/status.mjs";
import { OVERARCHING_QUESTION, EXECUTIVE_SYNTHESIS_V2, EVIDENCE_STRENGTH, REGIONAL_VALUE_LEVELS, INSIGHT_ASSESSMENTS, CONTESTED_REVISIONS } from "./phase9/synthesis.mjs";
export { SYNTHESIS_INTRO, EXECUTIVE_SYNTHESIS, INTERPRETATION_TYPES, OVERARCHING_QUESTION, EXECUTIVE_SYNTHESIS_V2, EVIDENCE_STRENGTH, REGIONAL_VALUE_LEVELS, INSIGHT_ASSESSMENTS };

export interface Insight { id: string; title: string; text: string; type: keyof typeof INTERPRETATION_TYPES; basis: string[]; issues: string[] }
export interface ContestedTopic { id: string; title: string; text: string; basis: string[]; issues: string[]; revisedInPhase9?: boolean; previousText?: string }
/** Phase 8 insights, kept for side-by-side review. */
export const phase8Insights = () => INSIGHTS as Insight[];
/** Insights shown on the site: Phase 9 wording, replaced by author-approved Phase 10 wording where decided. */
export const insights = () => effectiveInsights() as InsightV2[];
export const contestedTopics = () => (CONTESTED_TOPICS as ContestedTopic[]).map((t) => {
	const revision = (CONTESTED_REVISIONS as Record<string, { text: string; basis: string[] }>)[t.id];
	return revision ? { ...t, text: revision.text, basis: revision.basis, revisedInPhase9: true, previousText: t.text } : t;
});
export interface InsightApproval { proposalId: string; value: string; decidedOn: string; changed: boolean }
export interface InsightV2 extends Insight { aliases: string[]; themes: number[]; previous: string[]; change: "merged" | "revised" | "new" | "retained"; reason: string; strength: keyof typeof EVIDENCE_STRENGTH; approval: InsightApproval | null; phase9: { title: string; text: string } | null }

/** Claims behind a list of basis IDs (evidence/reference IDs are skipped). */
export const basisClaims = (ids: string[]) => ids.map((id) => getClaim(id)).filter((row): row is ClaimRow => !!row);
/** Reader-facing names of the workshop records behind a list of basis IDs. */
export function basisSourceLabels(ids: string[]): { id: string; label: string }[] {
	const seen = new Set<string>();
	for (const id of ids) {
		const row = getClaim(id);
		const sourceIds = row ? sourceIdsOfClaim(row.claim) : getEvidence(id) ? [getEvidence(id)!.source_id] : [];
		for (const s of sourceIds) seen.add(s);
	}
	return [...seen].map((id) => ({ id, label: sourceLabel(id) }));
}

// ---- Phase 9: review states, provenance quality --------------------------
import { reviewOf, REVIEW_OVERRIDES, PUBLICATION_RISKS } from "./phase9/claim-review.mjs";
import { SOURCE_FIDELITY, INTERPRETATION_LEVELS, PUBLICATION_STATES, REVIEW_CATEGORIES, CHECK_METHOD, phase9Label } from "./phase9/status.mjs";
import { SOURCE_QUALITY, sourceQualityOf } from "./phase9/provenance.mjs";
export { SOURCE_FIDELITY, INTERPRETATION_LEVELS, PUBLICATION_STATES, REVIEW_CATEGORIES, CHECK_METHOD, SOURCE_QUALITY, PUBLICATION_RISKS, REVIEW_OVERRIDES, phase9Label, sourceQualityOf };

export interface ClaimReview {
	id: string;
	fidelity: keyof typeof SOURCE_FIDELITY;
	interpretation: keyof typeof INTERPRETATION_LEVELS;
	category: keyof typeof REVIEW_CATEGORIES;
	publication: keyof typeof PUBLICATION_STATES;
	note: string | null;
	proposed: string | null;
	phase: "package" | "phase8" | "phase9";
}
/** Phase 9 review state of a package or Phase 9 statement. */
export function claimReview(claimId: string): ClaimReview {
	const row = getClaim(claimId);
	return reviewOf(claimId, { field: row?.field, sourceIds: row ? sourceIdsOfClaim(row.claim) : [] }) as ClaimReview;
}
/** Phase 9 review state of a Phase 8 editorial statement (e.g. "insight-1", "km:<slug>"). */
export const statementReview = (phase8Id: string) => reviewOf(`p8:${phase8Id}`, {}) as ClaimReview;
