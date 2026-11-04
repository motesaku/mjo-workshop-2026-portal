// Reader-facing provenance vocabulary (Phase 8, 2026-11-04).

/**
 * Review state of text written in Phase 8. Change `status` to
 * "author_reviewed" only after the site author has checked every Phase 8
 * entry in docs/PHASE8_EDITORIAL_LOG.md. Neither value means independent
 * scientific verification.
 */
export const PHASE8_EDITORIAL = {
	id: "phase8-2026-11-04",
	status: "draft_pending_author_review",
};

export function phase8Label() {
	return PHASE8_EDITORIAL.status === "author_reviewed"
		? { short: "Author-reviewed synthesis", long: "Written in Phase 8 and reviewed by the author; not independently verified." }
		: { short: "Phase 8 draft", long: "Written in Phase 8 from the existing synthesis; awaiting the author's review and not independently verified." };
}

/** What kind of statement a reader is looking at. */
export const INTERPRETATION_TYPES = {
	workshop_record: { label: "Workshop record", description: "A paraphrase of what the converted minutes record from a talk or discussion. Not a quotation." },
	editorial_synthesis: { label: "Editorial synthesis", description: "The author's interpretation across records, such as a comparison or a classification." },
	external_reference: { label: "External scientific reference", description: "A definition or example taken from published literature or an operational product page." },
	research_proposal: { label: "New research proposal", description: "A possible investigation suggested by this report. Not a workshop decision and not completed work." },
};

/** How far a statement has been checked. */
export const REVIEW_STATUSES = {
	programme_verified: { label: "Programme metadata verified", description: "Session times, titles and speakers checked against the official ICTP timetable." },
	external_checked: { label: "External definition checked", description: "Checked against the cited publication or product page on the stated date. This does not validate the surrounding synthesis." },
	personal_synthesis: { label: "Personal synthesis · source check pending", description: "Selected and paraphrased by the author from ASR-derived minutes. Claim-level locators exist, but no independent reviewer has checked the claim against the source." },
	phase8_draft: { label: "Phase 8 draft · awaiting author review", description: "New wording added in Phase 8 from the existing synthesis. Each entry lists the claims it rests on." },
	formal_decision: { label: "Formal workshop decision", description: "Not used: no formal workshop decision or consensus is documented in the records available to this report." },
};

export const ORIGIN_TO_TYPE = {
	workshop_statement_as_paraphrased_in_minutes: "workshop_record",
	evidence_based_editorial_synthesis: "editorial_synthesis",
	new_proposal_developed_in_phase5: "research_proposal",
	"Workshop record": "workshop_record",
	"Editorial synthesis": "editorial_synthesis",
	"External definition": "external_reference",
	"New research proposal": "research_proposal",
};

export function interpretationOf(origin) {
	return INTERPRETATION_TYPES[ORIGIN_TO_TYPE[origin] ?? "editorial_synthesis"];
}
