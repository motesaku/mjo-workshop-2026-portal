// Phase 8 cross-reference index (2026-11-04).
//
// Relations are derived from cited evidence only:
//   issue claim → evidence_id → source_id → SOURCE_VIDEO_RULES → highlight
// No relation is inferred from YouTube titles. Pure functions: callers inject
// the bundled package, the highlight list and the Phase 8 rule tables, so the
// same code runs in Astro pages and in `node --test`.

export const ISSUE_CLAIM_FIELDS = ["records", "positions", "comparison", "emerging_alignment", "unresolved_questions", "limitations"];
export const PROPOSAL_CLAIM_FIELDS = ["rationale", "steps", "expected_outputs", "discriminating_result", "limitations"];
export const RECORD_FIELDS = new Set(["records", "positions"]);

export const FIELD_LABELS = {
	records: "Workshop record",
	positions: "Position in dialogue",
	comparison: "Editorial comparison",
	emerging_alignment: "Emerging alignment",
	unresolved_questions: "Unresolved question",
	limitations: "Limitation",
	"proposal.rationale": "Proposal rationale",
	"proposal.steps": "Proposal step",
	"proposal.expected_outputs": "Expected output",
	"proposal.discriminating_result": "Evaluation criterion",
	"proposal.limitations": "Proposal limitation",
};

const asList = (value) => (Array.isArray(value) ? value : value ? [value] : []);

/** All claims of one issue, tagged with the field they come from. */
export function issueClaims(issue) {
	const out = [];
	for (const field of ISSUE_CLAIM_FIELDS) {
		for (const claim of asList(issue[field])) {
			if (claim && typeof claim === "object" && claim.claim_id) out.push({ issueId: issue.id, field, claim });
		}
	}
	return out;
}

/** Claims of an issue's proposed research (the illustrative action). */
export function proposalClaims(issue) {
	const proposal = issue.proposed_research;
	if (!proposal || typeof proposal !== "object") return [];
	const out = [];
	for (const key of PROPOSAL_CLAIM_FIELDS) {
		for (const claim of asList(proposal[key])) {
			if (claim && typeof claim === "object" && claim.claim_id) out.push({ issueId: issue.id, field: `proposal.${key}`, claim });
		}
	}
	return out;
}

/**
 * @param {{ pkg: any, highlights: any[], supplement?: { evidence?: any[], sources?: any[] }, sourceVideoRules: Record<string, any>, overlapGroups?: Record<string, any>, actionCrossLinks?: any[] }} context
 */
export function createRelationIndex({ pkg, highlights, supplement, sourceVideoRules, overlapGroups, actionCrossLinks = [] }) {
	const sources = new Map();
	for (const s of supplement?.sources ?? []) sources.set(s.source_id, { ...s, supplemental: true });
	for (const s of pkg.sources) sources.set(s.source_id, s);
	const evidence = new Map();
	for (const e of supplement?.evidence ?? []) evidence.set(e.evidence_id, { ...e, supplemental: true });
	for (const e of pkg.evidence) evidence.set(e.evidence_id, e);

	const issues = new Map(pkg.issues.map((i) => [i.id, i]));
	const actions = new Map((pkg.actions ?? []).map((a) => [a.id, a]));
	const actionByIssue = new Map((pkg.actions ?? []).map((a) => [a.issue_id, a]));
	const highlightBySlug = new Map(highlights.map((h, order) => [h.slug, { ...h, order }]));

	const claims = new Map();
	for (const issue of pkg.issues) {
		for (const row of [...issueClaims(issue), ...proposalClaims(issue)]) claims.set(row.claim.claim_id, row);
	}

	const sourceIdsOfClaim = (claim) => {
		const ids = new Set();
		for (const eid of claim.evidence_ids ?? []) {
			const e = evidence.get(eid);
			if (e) ids.add(e.source_id);
		}
		return [...ids];
	};
	const unresolvedEvidence = (claim) => (claim.evidence_ids ?? []).filter((eid) => !evidence.has(eid));

	const ruleFor = (sourceId) => sourceVideoRules[sourceId] ?? { kind: "unmapped" };
	const linkedSlugs = (sourceId) => {
		const rule = ruleFor(sourceId);
		return rule.kind === "withheld" || rule.kind === "unmapped" ? [] : rule.slugs ?? [];
	};

	function groupVideoLinks(rows) {
		const bySlug = new Map();
		for (const row of rows) {
			for (const sourceId of sourceIdsOfClaim(row.claim)) {
				for (const slug of linkedSlugs(sourceId)) {
					const highlight = highlightBySlug.get(slug);
					if (!highlight) continue;
					const entry = bySlug.get(slug) ?? { highlight, sourceIds: new Set(), claims: [] };
					entry.sourceIds.add(sourceId);
					if (!entry.claims.some((c) => c.claim.claim_id === row.claim.claim_id)) entry.claims.push(row);
					bySlug.set(slug, entry);
				}
			}
		}
		return [...bySlug.values()]
			.map((entry) => ({
				highlight: entry.highlight,
				sourceIds: [...entry.sourceIds],
				claims: entry.claims,
				basis: entry.claims.some((c) => RECORD_FIELDS.has(c.field)) ? "record" : "synthesis",
			}))
			.sort((a, b) => a.highlight.order - b.highlight.order);
	}

	function withheldFromRows(rows) {
		const bySource = new Map();
		for (const row of rows) {
			for (const sourceId of sourceIdsOfClaim(row.claim)) {
				const rule = ruleFor(sourceId);
				if (rule.kind !== "withheld") continue;
				const entry = bySource.get(sourceId) ?? { sourceId, source: sources.get(sourceId), reason: rule.reason, candidateSlugs: rule.candidateSlugs ?? [], claimIds: new Set() };
				entry.claimIds.add(row.claim.claim_id);
				bySource.set(sourceId, entry);
			}
		}
		return [...bySource.values()].map((e) => ({ ...e, claimIds: [...e.claimIds] }));
	}

	const issueRows = (issueId) => {
		const issue = issues.get(issueId);
		return issue ? issueClaims(issue) : [];
	};
	const proposalRows = (issueId) => {
		const issue = issues.get(issueId);
		return issue ? proposalClaims(issue) : [];
	};

	function videosForIssue(issueId) {
		return groupVideoLinks(issueRows(issueId));
	}

	function withheldForIssue(issueId) {
		return withheldFromRows(issueRows(issueId));
	}

	function issuesForVideo(slug) {
		const out = [];
		for (const issue of pkg.issues) {
			const link = videosForIssue(issue.id).find((v) => v.highlight.slug === slug);
			if (link) out.push({ issue, sourceIds: link.sourceIds, claims: link.claims, basis: link.basis });
		}
		return out;
	}

	/** Withheld source mappings that name this clip as a candidate. */
	function withheldForVideo(slug) {
		const out = [];
		for (const [sourceId, rule] of Object.entries(sourceVideoRules)) {
			if (rule.kind !== "withheld" || !(rule.candidateSlugs ?? []).includes(slug)) continue;
			const issueIds = pkg.issues.filter((issue) => issueClaims(issue).some((row) => sourceIdsOfClaim(row.claim).includes(sourceId))).map((i) => i.id);
			out.push({ sourceId, source: sources.get(sourceId), reason: rule.reason, issueIds });
		}
		return out;
	}

	function actionsForIssue(issueId) {
		const out = [];
		const primary = actionByIssue.get(issueId);
		if (primary) out.push({ action: primary, relation: "primary" });
		for (const link of actionCrossLinks) {
			if (link.issueId !== issueId) continue;
			const action = actions.get(link.actionId);
			if (action) out.push({ action, relation: "cross-link", rationale: link.rationale, basis: link.basis });
		}
		return out;
	}

	function issuesForAction(actionId) {
		const action = actions.get(actionId);
		if (!action) return [];
		const out = [{ issue: issues.get(action.issue_id), relation: "primary" }];
		for (const link of actionCrossLinks) {
			if (link.actionId === actionId && issues.has(link.issueId)) out.push({ issue: issues.get(link.issueId), relation: "cross-link", rationale: link.rationale, basis: link.basis });
		}
		return out;
	}

	function videosForAction(actionId) {
		const action = actions.get(actionId);
		return action ? groupVideoLinks(proposalRows(action.issue_id)) : [];
	}

	function actionsForVideo(slug) {
		return (pkg.actions ?? []).filter((a) => videosForAction(a.id).some((v) => v.highlight.slug === slug));
	}

	function videosForClaims(claimIds) {
		return groupVideoLinks(claimIds.map((id) => claims.get(id)).filter(Boolean));
	}

	/** Claims of the issues that cite this clip's source records (workshop-record fields only). */
	function statementsForVideo(slug) {
		const out = [];
		for (const { issue, claims: rows } of issuesForVideo(slug)) {
			for (const row of rows) if (RECORD_FIELDS.has(row.field)) out.push({ issue, ...row });
		}
		return out;
	}

	function overlapGroupOf(source) {
		if (!source) return null;
		for (const [id, group] of Object.entries(overlapGroups ?? {})) {
			if (group.families.includes(source.contribution_family)) return { id, ...group };
		}
		return null;
	}

	/** Group cited sources into contribution groups; overlapping records count once. */
	function contributionGroups(claimIds) {
		const groups = new Map();
		for (const id of claimIds) {
			const row = claims.get(id);
			if (!row) continue;
			for (const sourceId of sourceIdsOfClaim(row.claim)) {
				const source = sources.get(sourceId);
				const overlap = overlapGroupOf(source);
				const key = overlap ? overlap.id : `talk:${sourceId}`;
				const entry = groups.get(key) ?? { key, label: overlap ? overlap.label : source?.title ?? sourceId, overlapReason: overlap?.reason ?? null, sourceIds: new Set() };
				entry.sourceIds.add(sourceId);
				groups.set(key, entry);
			}
		}
		return [...groups.values()].map((g) => ({ ...g, sourceIds: [...g.sourceIds] }));
	}

	return {
		sources,
		evidence,
		claims,
		issues,
		actions,
		highlightBySlug,
		claim: (id) => claims.get(id),
		source: (id) => sources.get(id),
		sourceIdsOfClaim,
		unresolvedEvidence,
		ruleFor,
		videosForIssue,
		withheldForIssue,
		issuesForVideo,
		withheldForVideo,
		actionsForIssue,
		issuesForAction,
		videosForAction,
		actionsForVideo,
		videosForClaims,
		statementsForVideo,
		contributionGroups,
	};
}
