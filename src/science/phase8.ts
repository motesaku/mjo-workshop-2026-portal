// Phase 8 bindings: bundled synthesis + highlight list + Phase 8 editorial layer.
// Pages import from here; the pure logic lives in ./phase8/*.mjs (unit-tested).
import synthesis from "../data/personal-synthesis.json";
import { highlights, type Highlight } from "../data/highlights";
import { days, type Day, type Session } from "../data/program";
import type { ReviewAction, ReviewIssue } from "./theme-review";
import { createRelationIndex, FIELD_LABELS, RECORD_FIELDS } from "./phase8/relations.mjs";
import { SOURCE_VIDEO_RULES, OVERLAP_GROUPS } from "./phase8/source-video-map.mjs";
import { supplementalEvidence, supplementalSources } from "./phase8/provenance-supplement.mjs";
import { VIDEO_KEY_MESSAGES, ISSUE_SIGNIFICANCE, ACTION_CROSS_LINKS } from "./phase8/editorial-videos.mjs";
import { phase8Label, interpretationOf } from "./phase8/status.mjs";

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

export const relations = createRelationIndex({
	pkg: synthesis,
	highlights,
	supplement: { evidence: supplementalEvidence, sources: supplementalSources },
	sourceVideoRules: SOURCE_VIDEO_RULES,
	overlapGroups: OVERLAP_GROUPS,
	actionCrossLinks: ACTION_CROSS_LINKS,
});

const issueList = synthesis.issues as unknown as ReviewIssue[];
const actionList = (synthesis.actions ?? []) as ReviewAction[];

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
	const keyMessage = (VIDEO_KEY_MESSAGES as Record<string, Basis>)[highlight.slug] ?? null;
	const disputed = withheld.some((w) => w.sourceId === "src-xu");
	const summaryStatus: SummaryStatus = keyMessage ? "minutes_based_draft" : disputed ? "mapping_disputed" : relatedIssues.length ? "related_only" : "pending";
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
	};
}

export const SUMMARY_STATUS_LABELS: Record<SummaryStatus, { badge: string; text: string }> = {
	minutes_based_draft: {
		badge: "Minutes-based summary · not checked against the clip",
		text: "The key message condenses statements that the personal synthesis paraphrases from converted (ASR-derived) minutes of this talk or session. It was not written from, or checked against, the one-minute clip.",
	},
	related_only: {
		badge: "No summary · related through cited minutes",
		text: "The personal synthesis cites minutes of this talk only in editorial comparisons, so no clip-level summary is given. The related questions below show how those minutes are used.",
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
export const issueRelationship = (issueId: string) => (ISSUE_RELATIONSHIPS as Record<string, IssueRelationship>)[issueId];
export const divergenceAnalysis = (issueId: string) => (DIVERGENCE_ANALYSES as Record<string, DivergenceAnalysis>)[issueId];
export const alignmentAnalysis = (issueId: string) => (ALIGNMENT_ANALYSES as Record<string, AlignmentAnalysis>)[issueId];

/** Plain-language verdict: is this a genuine disagreement? */
export function disagreementVerdict(issueId: string): "genuine" | "partial" | "complementary" | "undetermined" {
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
} as const;
