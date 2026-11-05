// Phase 10F step F1 — known limits of the source record (2026-11-05).
// Describes which records exist and how far they can be used. It adds no scientific
// conclusion: a gap in the record is not evidence that a topic was not discussed.
import { MAPPING_REVIEW } from "../phase9/videos.mjs";

export const COVERAGE_PRINCIPLE = "Incomplete source coverage is not an absence of scientific discussion. Where the records are thin, this synthesis says so and does not reconstruct what may have been said.";

const UNRESOLVED_LABELS = {
	"src-xu": "the minutes for the Chang Xu talk slot (content differs from the programme title; candidate resolution awaiting the author's confirmation)",
	"src-final": "the final-day record of group reports and plenary debate (boundary between the 11:00 and 14:00 sessions not fixed)",
	"src-closing": "the closing record (may include the 14:00 final plenary discussion)",
	"src-obs": "the extended observation and AI minutes (date provisional; relation to the Themes 1+2 plenary not established)",
	"src-g34": "the extended theory minutes (date inferred; overlap with the Themes 3+4 plenary)",
};

export const SOURCE_LIMITS = [
	{ id: "breakout-56", title: "Themes 5+6 breakout", text: "The Themes 5+6 breakout discussions were not converted into minutes for this report. They are represented only through the group reports summarized in the final-day record, so prediction and applications discussions are recorded less fully than the theory and modeling breakouts." },
	{ id: "short-minutes", title: "Short compiled minutes", text: "Several Thursday and Friday talks are represented by short compiled minutes without a question-and-answer record, so audience challenges and the speakers' responses to them are not available for those talks." },
	{ id: "mappings", title: "Unresolved session mappings", text: `Statements from these records are used, but their one-minute clips are not linked to questions: ${MAPPING_REVIEW.map((m) => UNRESOLVED_LABELS[m.sourceId] ?? m.sourceId).join("; ")}. A discussion of mechanism-testing experiments and water isotopes has no recorded date, session or participants and is not used.` },
	{ id: "bsiso", title: "Boreal-summer variability and northward propagation", text: "The available records concentrate on boreal-winter, eastward-propagating MJO events. Northward-propagating boreal-summer intraseasonal oscillations were raised in the closing record and in a breakout remark on summer termination, but no recorded talk analysed them, so this synthesis cannot characterize workshop views on them." },
	{ id: "ocean", title: "Ocean coupling", text: "Ocean coupling appears among candidate processes in the theory and modeling records, but no recorded talk examined coupled ocean feedbacks on the MJO directly." },
	{ id: "asr", title: "Nature of the minutes", text: "All minutes are summaries derived from automatic speech recognition; speakers have not reviewed them, and numbers they flag as uncertain are withheld. Consistency with the minutes is not consistency with what was said." },
];
