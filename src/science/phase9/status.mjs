// Phase 9 review vocabulary (2026-11-04).
//
// Three independent review dimensions replace the single "source check
// pending" label. None of them is evidence that a scientific hypothesis is
// correct, and only the site author can give scientific editorial sign-off.

/**
 * Review state of text written or re-checked in Phase 9. Change `status` to
 * "author_reviewed" only after the author has worked through
 * docs/PHASE9_EDITORIAL_LOG.md and the Japanese review package.
 */
export const PHASE9_EDITORIAL = {
	id: "phase9-2026-11-04",
	status: "author_review_required",
};

/** How the Phase 9 source-fidelity check was carried out. */
export const CHECK_METHOD = {
	id: "phase9-ai-assisted-minutes-check-2026-11-04",
	date: "2026-11-04",
	label: "AI-assisted check against converted minutes",
	description:
		"Each English statement was compared with the passage of the converted minutes that it cites, using the line-level locators. The minutes are themselves ASR-derived summaries, so the check concerns fidelity to the minutes, not to the recordings or to the speakers' intentions. It is not the author's sign-off and does not test whether a hypothesis is true.",
};

/** Dimension 1 — does the statement faithfully reflect its cited passage? */
export const SOURCE_FIDELITY = {
	verified_against_source: {
		label: "Consistent with cited minutes",
		description: "The cited passage contains the stated content; wording is a paraphrase, not a quotation.",
	},
	partially_verified: {
		label: "Partly consistent with cited minutes",
		description: "Part of the statement is in the cited passage; the rest needs qualification, another citation or rewording.",
	},
	source_check_pending: {
		label: "Source check pending",
		description: "Not yet compared with the cited passage.",
	},
	source_mapping_disputed: {
		label: "Source mapping disputed",
		description: "It is uncertain which talk or session the cited minutes belong to, or the statement draws on a record whose mapping is withheld.",
	},
};

/** Dimension 2 — what kind of statement is it? */
export const INTERPRETATION_LEVELS = {
	direct_record: {
		label: "Direct record",
		description: "A paraphrase of what the minutes record a speaker or discussion as reporting, arguing or proposing.",
	},
	supported_interpretation: {
		label: "Supported interpretation",
		description: "The author's comparison or inference across records; each premise is in a cited passage.",
	},
	speculative_interpretation: {
		label: "Speculative interpretation",
		description: "An inference that goes beyond what the cited passages state; shown only with this label.",
	},
	new_research_proposal: {
		label: "Research proposal",
		description: "A possible investigation suggested by this report. Not a workshop decision and not completed work.",
	},
};

/** Dimension 3 — has the author approved publication of this wording? */
export const PUBLICATION_STATES = {
	draft: {
		label: "Revision proposed",
		description: "A correction, qualification or withholding is proposed; the current wording should not be approved as it stands.",
	},
	author_review_required: {
		label: "Awaiting author review",
		description: "Ready for the author's scientific editorial review; not yet approved.",
	},
	author_approved: {
		label: "Author-approved",
		description: "The author has approved this wording. This is editorial approval, not independent verification.",
	},
};

/** Phase 9 review-matrix categories (Phase 9A step A4). */
export const REVIEW_CATEGORIES = {
	supported: { label: "Sufficiently supported by the cited minutes", order: 1 },
	qualify: { label: "Requires qualification", order: 2 },
	correct_source: { label: "Requires source correction", order: 3 },
	meaning_uncertain: { label: "Scientific meaning remains uncertain", order: 4 },
	withhold: { label: "Withhold from prominent summaries", order: 5 },
};

export function phase9Label() {
	return PHASE9_EDITORIAL.status === "author_reviewed"
		? { short: "Author-reviewed (Phase 9)", long: "Revised in Phase 9 and reviewed by the author; not independently verified." }
		: { short: "Phase 9 draft · awaiting author review", long: "Revised or added in Phase 9 after an AI-assisted check against the converted minutes; awaiting the author's review and not independently verified." };
}
