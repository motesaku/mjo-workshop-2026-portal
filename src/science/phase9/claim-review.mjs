// Phase 9A claim review matrix (2026-11-04).
//
// Every statement of personal-synthesis.json v1.0.0, every Phase 8 editorial
// statement and every Phase 9 statement was compared with the passages it
// cites (see status.mjs → CHECK_METHOD). Defaults below apply to statements
// whose cited passages contain their content; `REVIEW_OVERRIDES` lists every
// statement that needs qualification, source correction or withholding.
// Nothing here is author-approved.

export const FIELD_INTERPRETATION = {
	records: "direct_record",
	positions: "direct_record",
	comparison: "supported_interpretation",
	emerging_alignment: "supported_interpretation",
	unresolved_questions: "supported_interpretation",
	limitations: "supported_interpretation",
};

/** Sources whose content-to-talk mapping is disputed (fidelity cannot be "consistent"). */
export const DISPUTED_SOURCES = ["src-xu"];

/**
 * Statements that need editorial action. Keys are claim IDs (package and
 * Phase 9) or Phase 8 statement IDs prefixed "p8:". `proposed` is the
 * suggested replacement wording for the author's review; it is shown only in
 * the review package and, for Phase 8 text, applied as a Phase 9 draft.
 */
export const REVIEW_OVERRIDES = {
	"q02-c02": {
		category: "qualify", fidelity: "partially_verified",
		note: "The breakout listed an objective criterion for separating weakening, stalled propagation and termination as unresolved; it asked for the distinction rather than establishing it.",
		proposed: "A breakout asked for objective criteria to distinguish weakening, stalled propagation and termination, and raised the possibility that boreal-summer events redistribute into smaller-scale disturbances.",
	},
	"q03-c01": {
		category: "qualify", fidelity: "verified_against_source",
		note: "The minutes record one participant comment and label it the discussant's theoretical view, not a conclusion of the talk; \"objection\" overstates its standing.",
		proposed: "A comment in the prediction Q&A urged distinguishing a realistic mean state and pre-moistening from an advective moisture-mode explanation, emphasizing low-level convergence and shallow-convective moistening; the minutes label this the discussant's theoretical view, not a conclusion of the talk.",
	},
	"q06-c04": {
		category: "correct_source", fidelity: "source_mapping_disputed",
		note: "Phase 9 found that the opening of the recording in this slot introduces published work on detecting the MJO from short records, so the minutes probably belong to this talk and the title–content difference reflects the talk itself. Author confirmation is needed before re-attributing.",
	},
	"q06-c10": {
		category: "correct_source", fidelity: "source_mapping_disputed",
		note: "Depends on the Chang Xu mapping (see q06-c04).",
	},
	"q07-c02": {
		category: "qualify", fidelity: "partially_verified",
		note: "A composite of two overlapping records: the plenary minutes record the debate on information-based understanding and physics constraints; the clause on whether observations alone suffice for end-to-end prediction rests only on the extended theory minutes, whose clip mapping is withheld.",
		proposed: "The theory plenary debated information-based understanding of AI and physics constraints; the extended theory minutes add a dispute over whether observations alone contain enough information for end-to-end prediction.",
	},
	"q09-c03": {
		category: "qualify", fidelity: "partially_verified",
		note: "The SST-replacement experiment was applied to the December case only; the November case was single-regime.",
		proposed: "Takasuka's SST-replacement experiment removed the branching between propagation regimes in one of two ensemble case studies; the final discussion left the existence and cause of an AI Maritime Continent barrier unanswered.",
	},
	"q10-c10": {
		category: "correct_source", fidelity: "partially_verified",
		note: "The premise that quoted data-use figures were personal estimates is recorded in the Themes 3+4 plenary minutes (e-p34-23-23), not in the cited Themes 1+2 plenary or closing passages. Phase 9 adds that locator as p9-q10-r01.",
		proposed: "The main observations-plenary excerpt is incomplete, dates and group labels in the extended version are uncertain, and data-use figures quoted in the theory plenary were the speaker's estimates rather than audited statistics.",
	},
	"q11-c03": {
		category: "qualify", fidelity: "verified_against_source",
		note: "The CENS record is the site author's own talk record, not an independent account; this should be disclosed where it is cited.",
		proposed: "Tsai reported excessive wave activity in a biased model environment, while the record of the site author's own talk on cross-equatorial northerly surges left the proposed feedback onto the MJO and pressure-system dynamics untested.",
	},
	"theme-indices-diagnostic-comparison-1": {
		category: "correct_source", fidelity: "partially_verified",
		note: "The premise that circulation can dominate the RMM score is recorded in the prediction keynote minutes (e-hkim-25-30), not in the cited closing passage.",
	},

	"p8:km:plenary-themes-3-4": {
		category: "correct_source", fidelity: "source_mapping_disputed",
		note: "The clause on whether observations alone suffice for end-to-end prediction comes only from the extended theory minutes (src-g34), whose clip mapping is withheld; it should not be presented as content of this plenary clip's minutes.",
		proposed: "The theory plenary contrasted moisture-mode diagnostics that discriminate model performance with tests that manipulate the processes a theory requires, and debated information-based understanding of AI and the use of physics constraints.",
	},
	"p8:km:daehyun-kim-modeling": {
		category: "qualify", fidelity: "partially_verified",
		note: "The keynote reviewed little support for the expectation that higher horizontal resolution automatically improves the MJO, and emphasized convection schemes, shallow-convective moistening, mean state and vertical structure; the Phase 8 wording framed resolution as a possible intervention.",
		proposed: "Reviewed how MJO simulation has progressed: the expectation that higher horizontal resolution alone improves the MJO has found little support, whereas moisture-sensitive convection, shallow-convective moistening, the mean state and vertical structure have been implicated more consistently; process-level explanation remains needed.",
	},
	"p8:km:stephanie-rushley-north-pacific-cyclones": {
		category: "qualify", fidelity: "partially_verified",
		note: "The minutes report week-2 geopotential-height skill in a high-wave case, not cyclone skill.",
		proposed: "Found very different week-2 extratropical geopotential-height skill among ensembles with similar MJO pattern correlations in a high-wave case, and distinguished humidity errors from displacement of the forecast MJO in space and time.",
	},
	"p8:km:daisuke-takasuka-deterministic-chaotic": {
		category: "qualify", fidelity: "partially_verified",
		note: "Branching occurred in one of two cases, and the SST sensitivity was shown by one replacement experiment.",
		proposed: "In NICAM ensemble case studies, one of two cases branched into fast and slow propagation regimes; replacing its sea-surface temperatures with those of the other case removed the branching, which the speaker interpreted as control by equatorial SST symmetry.",
	},
	"p8:km:breakout-themes-3-4": {
		category: "qualify", fidelity: "partially_verified",
		note: "Same issue as q02-c02.",
		proposed: "The breakout record asked for objective criteria to tell weakening, stalled propagation and termination of MJO events apart, separated variable importance from causation, and proposed testing equation discovery first on systems whose equations are already known.",
	},
	"p8:km:qoosaku-moteki-cens-mjo": {
		category: "qualify", fidelity: "verified_against_source",
		note: "Self-authored record; disclose.",
		proposed: "The site author's own talk record notes that the question-and-answer exchange left the proposed feedback of cross-equatorial northerly surges onto the MJO, and the associated pressure-system dynamics, untested.",
	},
	"p8:km:kenedy-silverio-southern-africa": {
		category: "qualify", fidelity: "partially_verified",
		note: "The minutes add that the basic anomaly pattern was largely shared across ENSO states.",
		proposed: "Reported MJO-related summer rainfall anomalies over southern Africa whose amplitude and location varied with ENSO while the basic pattern was largely shared (programme topic: ENSO-dependent impacts on southern African summer rainfall).",
	},
	"p8:insight-1": {
		category: "qualify", fidelity: "verified_against_source",
		note: "The title foregrounds one of three views kept side by side in the closing record (unified account, pluralism, testability); overlaps insight 2 on the same records. Merged into Phase 9 insight 1.",
	},
	"p8:insight-2": { category: "supported", fidelity: "verified_against_source", note: "Merged into Phase 9 insight 1." },
	"p8:insight-3": { category: "qualify", fidelity: "partially_verified", note: "Same issue as q02-c02; revised in Phase 9 insight 2." },
	"p8:rel-q07": {
		category: "qualify", fidelity: "verified_against_source",
		note: "A complementary primary relationship under the Diverging Perspectives class understates disagreement that two discussion groups recorded explicitly. Phase 9 makes different evaluation standards the primary relationship and presents complementary objectives as a separate layer.",
	},
	"p8:contested-ai": { category: "qualify", fidelity: "verified_against_source", note: "Revised with the Q07 reclassification." },
	"p8:exec": { category: "qualify", fidelity: "verified_against_source", note: "Replaced by the Phase 9 executive synthesis, which adds observations and applications and states the limits of the narrative's unity." },
};

/**
 * Live wording that is potentially misleading (Phase 9F step F4). Reported
 * for the author; the production site is not changed by this file.
 */
export const PUBLICATION_RISKS = [
	{ page: "/", wording: "Editorial synthesis of reviewed minutes; not a workshop consensus.", risk: "The minutes are ASR-derived and not reviewed; \"reviewed\" overstates their status.", severity: "moderate", fixedLocally: true },
	{ page: "/workshop-synthesis", wording: "Seven insights that recur in the reviewed records.", risk: "Same overstatement of review status.", severity: "moderate", fixedLocally: true },
	{ page: "/questions/themes/q07", wording: "Mostly complementary, with a residual disagreement", risk: "Understates a disagreement that the final-day record calls one of the clearest of the session and that the closing record left unsettled.", severity: "moderate", fixedLocally: true },
	{ page: "/videos/plenary-themes-3-4", wording: "…and whether observations alone contain enough information for end-to-end prediction.", risk: "Presents content from minutes whose clip mapping is withheld as content of this clip's session minutes.", severity: "moderate", fixedLocally: true },
	{ page: "/videos/daehyun-kim-modeling", wording: "Treated higher horizontal resolution as a possible intervention for model errors rather than an established remedy…", risk: "Shifts the keynote's emphasis, which was that resolution alone has found little support.", severity: "minor", fixedLocally: true },
	{ page: "/videos/stephanie-rushley-north-pacific-cyclones", wording: "Reported different extratropical cyclone skill among forecasts with similar MJO correlations…", risk: "The minutes report geopotential-height skill in a high-wave case, not cyclone skill.", severity: "minor", fixedLocally: true },
	{ page: "/videos/breakout-themes-3-4 and /workshop-synthesis#insight-3", wording: "…distinguished weakening, stalled propagation and termination…", risk: "The breakout asked for objective criteria; it did not establish the distinction.", severity: "minor", fixedLocally: true },
	{ page: "/questions/themes/q09", wording: "…altered propagation-regime branching within two cases…", risk: "The experiment concerned one of the two cases.", severity: "minor", fixedLocally: true },
	{ page: "/, /questions/themes/*, /actions/*", wording: "Video evidence", risk: "Implies that the one-minute clips were checked as evidence for the statements; they were not.", severity: "moderate", fixedLocally: true },
	{ page: "/videos/qoosaku-moteki-cens-mjo", wording: "The question-and-answer record left the proposed feedback … untested.", risk: "Does not disclose that this is the site author's own talk record.", severity: "minor", fixedLocally: true },
];

/**
 * Review state of one statement (package claim, Phase 9 claim or "p8:" id).
 * @param {string} id
 * @param {{ field?: string, sourceIds?: string[], phase?: string }} [context]
 */
export function reviewOf(id, { field, sourceIds = [], phase } = {}) {
	const override = REVIEW_OVERRIDES[id];
	const disputed = sourceIds.some((s) => DISPUTED_SOURCES.includes(s));
	const interpretation = field?.startsWith("proposal.") ? "new_research_proposal" : FIELD_INTERPRETATION[field] ?? "supported_interpretation";
	const fidelity = override?.fidelity ?? (disputed ? "source_mapping_disputed" : "verified_against_source");
	const category = override?.category ?? (disputed ? "correct_source" : "supported");
	const publication = category === "supported" ? "author_review_required" : "draft";
	return { id, fidelity, interpretation, category, publication, note: override?.note ?? null, proposed: override?.proposed ?? null, phase: phase ?? (id.startsWith("p9-") ? "phase9" : id.startsWith("p8:") ? "phase8" : "package") };
}
