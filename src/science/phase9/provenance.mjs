// Phase 9 provenance additions (2026-11-04). Public locator fields only: no
// text from the minutes, no file paths, no fingerprints.
//
// Phase 9 read sections of the converted minutes that the v1.0.0 package did
// not cite (the opening session, the Themes 1+2 keynote, and final-day and
// closing sections on regional value, AI uses and theory gaps). Line ranges
// refer to the same minute versions as the package's other locators; the
// source files were confirmed unchanged since the Phase 5 export.

export const PHASE9_SUPPLEMENT_ID = "phase9-provenance-supplement-2026-11-04";

const ev = (source, start, end, locator) => ({
	evidence_id: `e-${source}-${start}-${end}`,
	source_id: `src-${source}`,
	line_start: start,
	line_end: end,
	locator,
	verification: "pending_human_review",
	coverage: "partial",
});

export const phase9Evidence = [
	ev("welcome", 33, 36, "Progress and unresolved problems (remote impacts)"),
	ev("welcome", 40, 43, "Recommendations"),
	ev("moncrieff", 20, 25, "## Historical framing"),
	ev("moncrieff", 27, 33, "Recommendations"),
	ev("final", 45, 68, "2.1 Group 1: Regional MJO Impacts and User Needs"),
	ev("final", 80, 86, "2.2 Direction 2: Move from forecast skill to societal value"),
	ev("final", 88, 98, "2.2 Direction 3: Combine AI with physical understanding"),
	ev("final", 116, 118, "2.3.2 Communicate impacts, not phase alone"),
	ev("final", 236, 260, "4. Multiscale, multi-phenomenon evaluation"),
	ev("final", 275, 289, "5. Outcomes: areas of convergence and open questions"),
	ev("closing", 23, 34, "1. Six major areas discussed"),
	ev("closing", 138, 146, "4.1 Gaps in current MJO theories"),
	ev("closing", 189, 200, "5.2 Forecast skill is not sufficient to demonstrate physical correctness"),
	ev("closing", 220, 226, "5.4 AI as evidence for scientific understanding"),
	ev("closing", 230, 236, "6.1 From deterministic thresholds toward probabilistic prediction"),
	ev("closing", 250, 256, "6.3 User-oriented, impact-based prediction"),
	ev("p34", 23, 23, "## Historical framing"),
	ev("rushley", 13, 13, "Theme of the talk"),
];

export const phase9Sources = [
	{
		source_id: "src-welcome",
		title: "Welcome and introductory talks (opening session)",
		source_version: "version withheld from public package",
		snapshot_date: "2026-10-29",
		session_date: "2026-10-26",
		contribution_family: "opening-session",
		attribution_mode: "unattributed",
		source_review_status: "not_established",
		coverage: "partial",
		limitations: "Minutes derived from an automatic transcript of the opening session. They do not separate the welcome and the two introductory talks, so statements are not attributed to individual speakers. Numerical values are not used.",
	},
	{
		source_id: "src-moncrieff",
		title: "Global Data & Global Patterns",
		source_version: "version withheld from public package",
		snapshot_date: "2026-10-29",
		session_date: "2026-10-26",
		contribution_family: "talk-moncrieff",
		attribution_mode: "named_talk",
		source_review_status: "not_established",
		coverage: "partial",
		limitations: "Minutes derived from an automatic transcript of a review-and-recommendation keynote; no substantive question-and-answer exchange was recorded.",
	},
];

/**
 * How the converted minutes behind each source were produced. This is a
 * property of the record, separate from whether a site statement matches it.
 */
export const SOURCE_QUALITY = {
	structured_asr_minutes: {
		label: "Structured minutes from an automatic transcript",
		description: "Organized minutes of a recorded talk or session, written from an automatic transcript, usually including the question-and-answer exchange.",
	},
	compiled_short_minutes: {
		label: "Short compiled minutes",
		description: "Brief minutes compiled from an automatic transcript in an AI chat session. Question-and-answer exchanges were not captured, so the record mainly reflects the talk's main points.",
	},
	discussion_minutes: {
		label: "Discussion minutes",
		description: "Minutes of a breakout, plenary or closing discussion. Speakers are generally not identified, and session boundaries or dates may be uncertain.",
	},
	speaker_self_record: {
		label: "Speaker's own record",
		description: "A record of the site author's own talk and its question-and-answer exchange. It is not an independent account.",
	},
};

const COMPILED = ["src-siena", "src-liu", "src-ekot", "src-scheibe", "src-hera", "src-peatman", "src-tsai", "src-silverio"];
const DISCUSSION = ["src-g3", "src-g34", "src-p12", "src-p34", "src-obs", "src-final", "src-closing", "src-welcome"];

export function sourceQualityOf(sourceId) {
	if (sourceId === "src-moteki") return "speaker_self_record";
	if (COMPILED.includes(sourceId)) return "compiled_short_minutes";
	if (DISCUSSION.includes(sourceId)) return "discussion_minutes";
	return "structured_asr_minutes";
}
