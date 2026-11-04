// Phase 9E — video relationships and key messages (2026-11-04). Draft
// awaiting the author's review.
//
// Key messages below replace Phase 8 wording where the Phase 9 check found a
// problem (see claim-review.mjs, "p8:km:*"), or add a message for a clip that
// gained a source in Phase 9. Like Phase 8 messages they condense statements
// that cite the minutes of the clip's own talk or session; none was checked
// against the one-minute clip.

export const PHASE9_KEY_MESSAGES = {
	"plenary-themes-3-4": {
		text: "The theory plenary contrasted moisture-mode diagnostics that discriminate model performance with tests that manipulate the processes a theory requires, and debated information-based understanding of AI and the use of physics constraints.",
		basis: ["q01-c02", "q07-c02"],
		replaces: "p8:km:plenary-themes-3-4",
	},
	"daehyun-kim-modeling": {
		text: "Reviewed how MJO simulation has progressed: the expectation that higher horizontal resolution alone improves the MJO has found little support, whereas moisture-sensitive convection, shallow-convective moistening, the mean state and vertical structure have been implicated more consistently; process-level explanation remains needed.",
		basis: ["q09-c07", "p9-q03-r02"],
		replaces: "p8:km:daehyun-kim-modeling",
	},
	"stephanie-rushley-north-pacific-cyclones": {
		text: "Found very different week-2 extratropical geopotential-height skill among ensembles with similar MJO pattern correlations in a high-wave case, and distinguished humidity errors from displacement of the forecast MJO in space and time.",
		basis: ["q11-c01", "p9-q11-r03"],
		replaces: "p8:km:stephanie-rushley-north-pacific-cyclones",
	},
	"daisuke-takasuka-deterministic-chaotic": {
		text: "In NICAM ensemble case studies, one of two cases branched into fast and slow propagation regimes; replacing its sea-surface temperatures with those of the other case removed the branching, which the speaker interpreted as control by equatorial SST symmetry.",
		basis: ["q02-c03", "q02-c05", "q09-c06"],
		replaces: "p8:km:daisuke-takasuka-deterministic-chaotic",
	},
	"breakout-themes-3-4": {
		text: "The breakout record asked for objective criteria to tell weakening, stalled propagation and termination of MJO events apart, separated variable importance from causation, and proposed testing equation discovery first on systems whose equations are already known.",
		basis: ["q02-c02", "q07-c03"],
		replaces: "p8:km:breakout-themes-3-4",
	},
	"qoosaku-moteki-cens-mjo": {
		text: "The site author's own talk record notes that the question-and-answer exchange left the proposed feedback of cross-equatorial northerly surges onto the MJO, and the associated pressure-system dynamics, untested.",
		basis: ["q11-c03"],
		replaces: "p8:km:qoosaku-moteki-cens-mjo",
	},
	"kenedy-silverio-southern-africa": {
		text: "Reported MJO-related summer rainfall anomalies over southern Africa whose amplitude and location varied with ENSO while the basic pattern was largely shared (programme topic: ENSO-dependent impacts on southern African summer rainfall).",
		basis: ["q11-c02"],
		replaces: "p8:km:kenedy-silverio-southern-africa",
	},
	"mitch-moncrieff-global-data-global-patterns": {
		text: "Argued that convective parameterizations have neglected the momentum transport and dynamical organization of mesoscale convective systems, and recommended evaluating organized convection against Maritime Continent passage, tropical spectra, El Niño onset and QBO relations rather than MJO amplitude alone.",
		basis: ["p9-q05-r01", "p9-q09-r01"],
		replaces: null,
	},
};

/** Programme-mapping dimension, from the highlight list (Phase 7/8 checks). */
export const PROGRAMME_MAPPING = {
	mapped: { label: "Programme mapping verified", description: "Title and session checked against the official ICTP timetable." },
	provisional: { label: "Programme mapping provisional", description: "The session is likely but not confirmed." },
	alternate: { label: "Alternate cut", description: "A second one-minute cut of a mapped session or talk." },
	unmapped: { label: "Programme mapping not established", description: "The clip has not been tied to a timetable slot." },
};

/** Labels for the five audit dimensions shown on every clip page. */
export const AUDIT_DIMENSIONS = {
	programme: "Programme mapping",
	minutes: "Minutes-based scientific relationship",
	summaryVsMinutes: "Key message checked against the minutes",
	summaryVsClip: "Key message checked against the clip",
	withheld: "Withheld or unverified mapping",
};

/**
 * Phase 9E step E3 — unresolved source mappings re-examined with the
 * available records. None is applied to the site: each needs the author's
 * confirmation (the author attended the sessions). Text contains no quotation
 * from private minutes or transcripts.
 */
export const MAPPING_REVIEW = [
	{
		sourceId: "src-xu",
		status: "candidate_resolution",
		finding: "The automatic transcript of the full recording in this programme slot opens with the speaker introducing the talk as published work on detecting the MJO robustly from limited data, motivated by short kilometre-scale simulations. The minutes therefore appear to belong to this talk, and the difference from the programme title reflects the talk's content rather than misfiled minutes.",
		remaining: "The speaker's name is garbled in the automatic transcript. The author should confirm the speaker and approve re-attribution before the clip is linked to Q06.",
	},
	{
		sourceId: "src-final",
		status: "partly_clarified",
		finding: "The record's group reports (regional impacts and user needs; science–society bridging and AI benchmarking; remote impacts and trustworthy AI; the Maritime Continent and regional observations) match the Themes 5+6 breakout topics, which is consistent with the 11:00 plenary of breakout reports. Its later plenary-debate section could belong to either session.",
		remaining: "The record has no timestamps, so the boundary between the 11:00 plenary and the 14:00 final plenary cannot be fixed from the minutes. Clip mapping stays withheld.",
	},
	{
		sourceId: "src-closing",
		status: "partly_clarified",
		finding: "The record is a long, chaired community-recommendations discussion, longer than the 15-minute closing-remarks slot would allow, so it may include the 14:00 final plenary discussion.",
		remaining: "Only the author can confirm whether the record spans the final plenary. The closing clip mapping is itself provisional. Mapping stays withheld.",
	},
	{
		sourceId: "src-obs",
		status: "unresolved",
		finding: "The extended observation and AI minutes are dated 28 October only provisionally and report group discussions and a plenary on observing strategy, consistent with the Themes 1+2 plenary, whose own minutes cover only about the first 79 minutes of the recording.",
		remaining: "Whether the two records describe the same session (and whether the extended record covers the missing part) is not established. Mapping stays withheld.",
	},
	{
		sourceId: "src-g34",
		status: "unresolved",
		finding: "The extended theory minutes report four group reports and a plenary, consistent with the Themes 3+4 plenary of 28 October, but their date is inferred from context.",
		remaining: "Overlap with the plenary minutes means they are counted as one contribution; clip mapping stays withheld.",
	},
];
