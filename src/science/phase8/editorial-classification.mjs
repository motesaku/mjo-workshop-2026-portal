// Phase 8 classification layer (2026-11-04). Draft awaiting the author's review.
// The primary classes (diverging perspectives / emerging alignment / open
// questions) are unchanged. This layer describes how the recorded positions
// relate to one another. Every entry names the claims it rests on.

export const RELATIONSHIP_TYPES = {
	competing_hypotheses: {
		label: "Competing hypotheses",
		code: "A",
		genuineDisagreement: true,
		description: "Alternative explanations make different, potentially falsifiable predictions about the same phenomenon.",
	},
	different_evaluation_standards: {
		label: "Different evaluation standards",
		code: "B",
		genuineDisagreement: true,
		description: "Researchers differ on what counts as sufficient evidence, understanding or model validation.",
	},
	complementary_perspectives: {
		label: "Complementary perspectives",
		code: "C",
		genuineDisagreement: false,
		description: "Approaches serve distinct but compatible purposes. A difference in emphasis or objective is not treated as substantive disagreement.",
	},
	undetermined: {
		label: "Relationship not yet determinable",
		code: "–",
		genuineDisagreement: null,
		description: "The contributions measure different quantities, or the records are too limited to say whether they compete or complement each other.",
	},
};

export const ISSUE_RELATIONSHIPS = {
	q01: { primary: "different_evaluation_standards", secondary: ["competing_hypotheses"], note: "The recorded disagreement concerns what evidence establishes a mechanism. Competing mechanisms that produce similar large-scale signals are the reason the standard matters.", basis: ["q01-c07", "q01-c01"] },
	q02: { primary: "complementary_perspectives", secondary: [], note: "Background conditions, finite-amplitude growth and multiscale development are potentially complementary levels of explanation; no head-to-head rejection is recorded.", basis: ["q02-c07"] },
	q03: { primary: "competing_hypotheses", secondary: [], note: "Alternative causal readings of pre-convective moistening—horizontal advection versus low-level convergence and shallow convection—that have not been shown to be mutually exclusive.", basis: ["q03-c06", "q03-c05"] },
	q04: { primary: "undetermined", secondary: [], note: "Two diagnostics of different spatial integrals and event selections; whether they describe one coupled mechanism is itself the open question.", basis: ["q04-c06"] },
	q05: { primary: "competing_hypotheses", secondary: [], note: "Candidate pathways with unequal evidence—an ice-cloud radiative feedback and organized-convection processes—that may interact.", basis: ["q05-c05"] },
	q06: { primary: "complementary_perspectives", secondary: [], note: "Different diagnostics answer different scientific questions; the recurring direction is to supplement RMM, not to replace it.", basis: ["q06-c07"] },
	q07: { primary: "complementary_perspectives", secondary: ["different_evaluation_standards"], note: "The positions differ mainly in purpose—bounded forecasting use versus physical explanation. A narrower difference remains over when validated skill is enough to trust a system outside its training conditions.", basis: ["q07-c07", "q07-c05"] },
	q08: { primary: "complementary_perspectives", secondary: ["different_evaluation_standards"], note: "Reforecasts, real-time verification and perfect-model limits estimate different quantities. Whether to rely on common or AI-specific metrics remained unresolved.", basis: ["q08-c07", "q08-c04"] },
	q09: { primary: "competing_hypotheses", secondary: [], note: "Competing causal candidates for barrier errors—local moisture, diurnal and land–sea processes versus background SST and interacting disturbances—that the records do not rank.", basis: ["q09-c08", "q09-c05", "q09-c06"] },
	q10: { primary: "complementary_perspectives", secondary: [], note: "A target-dependent design trade-off between measurement precision and coverage, not evidence that one observing strategy is superior.", basis: ["q10-c07", "q10-c06"] },
	q11: { primary: "complementary_perspectives", secondary: [], note: "The regional contributions are complementary; none of them opposes using MJO information.", basis: ["q11-c07"] },
	q12: { primary: "undetermined", secondary: [], note: "Precipitation-event trends, index variance and squall frequency are different quantities; apparent inconsistencies among them are not demonstrated contradictions.", basis: ["q12-c07"] },
};

/**
 * Structured analyses for the three diverging-perspective questions.
 * `positions[].claimIds`, `evidence`, `distinguishing` and `uncertainty`
 * point to existing claims; `nature` and `compatibility` are Phase 8 text.
 */
export const DIVERGENCE_ANALYSES = {
	q01: {
		reassessment: {
			text: "Retained under Diverging Perspectives. At the subcategory level the difference is classed as different evaluation standards rather than a contest between named theories.",
			basis: ["q01-c07"],
		},
		positions: [
			{ label: "Diagnostic discrimination is informative", claimIds: ["q01-c04"] },
			{ label: "Mechanism claims require targeted tests", claimIds: ["q01-c05"] },
			{ label: "Related view: pluralism or a unified account", claimIds: ["q01-c06"] },
		],
		nature: {
			text: "Primarily a difference in evaluation standards. Both positions accept that moisture-mode and related diagnostics carry information about models; they differ on whether that information is enough to identify a mechanism. Underneath lies a set of competing hypotheses—mechanisms that can produce similar large-scale signals while differing in circulation structure and parameter dependence—which is why the evidential standard is decisive.",
			basis: ["q01-c07", "q01-c01", "q01-c04", "q01-c05"],
		},
		comparisonClaim: "q01-c07",
		evidence: ["q01-c01", "q01-c02", "q01-c03"],
		compatibility: {
			text: "The two standards can be combined as successive steps: diagnostic discrimination shows where models differ, and targeted interventions then test whether a proposed process is necessary. They conflict only if diagnostic skill alone is taken to identify the mechanism in the atmosphere. An intervention in a single model is not conclusive either. The pluralist view is compatible with both standards, but it is not the same as accepting mutually inconsistent predictions.",
			basis: ["q01-c07", "q01-c06"],
		},
		distinguishing: ["q01-c09", "q01-c15"],
		uncertainty: ["q01-c10"],
	},
	q03: {
		reassessment: {
			text: "Retained under Diverging Perspectives with the subcategory competing hypotheses. Temperature contributions are treated as a separate scope question, not as a third competing pathway.",
			basis: ["q03-c06"],
		},
		positions: [
			{ label: "Moisture advection drives propagation", claimIds: ["q03-c04"] },
			{ label: "Low-level convergence and shallow-convective moistening", claimIds: ["q03-c05"] },
			{ label: "Related scope question: temperature contributions", claimIds: ["q03-c02"] },
		],
		nature: {
			text: "Competing hypotheses about the causal pathway of moistening ahead of deep convection. Both accept that moisture matters; they attribute pre-convective moistening to different processes—horizontal transport versus low-level convergence and shallow convection—and therefore imply different leading budget terms before transitions. The temperature result raises a separate question about the scope of approximations used in moisture-mode formulations; it does not decide between the two pathways.",
			basis: ["q03-c06", "q03-c04", "q03-c05", "q03-c08"],
		},
		comparisonClaim: "q03-c06",
		evidence: ["q03-c01", "q03-c02", "q03-c03"],
		compatibility: {
			text: "Not shown to be mutually exclusive. The record does not demonstrate that the convergence and shallow-convection pathway excludes advection, and both may contribute with weights that depend on phase, season or location. The interpretations contradict each other only for a claim about which pathway dominates a specified transition.",
			basis: ["q03-c05", "q03-c07"],
		},
		distinguishing: ["q03-c08", "q03-c14"],
		uncertainty: ["q03-c09"],
	},
	q07: {
		reassessment: {
			text: "Retained under Diverging Perspectives because the final-day record explicitly contrasted the positions. At the subcategory level it is reclassified as primarily complementary perspectives: the positions largely pursue different objectives. A residual difference in evaluation standards, and an empirical dispute over whether observations suffice for end-to-end prediction, remain.",
			basis: ["q07-c01", "q07-c07", "q07-c06"],
		},
		positions: [
			{ label: "Validated AI as a practical forecasting tool", claimIds: ["q07-c04"] },
			{ label: "Mechanism-oriented evaluation of AI skill", claimIds: ["q07-c05"] },
			{ label: "Related: architectures and observation sufficiency", claimIds: ["q07-c06"] },
		],
		nature: {
			text: "Mostly complementary perspectives. One position concerns bounded operational use of a forecast whose performance has been rigorously validated; the other concerns explaining the sources of skill and failure. A narrower difference in evaluation standards remains over when validated skill is sufficient to trust a system outside its training conditions, such as for extrapolation and extremes. Whether observations alone contain enough information for end-to-end prediction is a separate empirical question that remained disputed.",
			basis: ["q07-c07", "q07-c04", "q07-c05", "q07-c06"],
		},
		comparisonClaim: "q07-c07",
		evidence: ["q07-c01", "q07-c02", "q07-c03"],
		compatibility: {
			text: "Largely compatible. Validation can justify a bounded forecasting use without establishing a mechanism, and mechanism-oriented analysis does not prevent operational use. The positions would conflict only if forecast skill were presented as evidence of physical understanding, or if validated performance were dismissed solely because the architecture is not interpretable.",
			basis: ["q07-c07", "q07-c08"],
		},
		distinguishing: ["q07-c09", "q07-c15"],
		uncertainty: ["q07-c10"],
	},
};

/** Structured view of the three emerging-alignment questions. */
export const ALIGNMENT_ANALYSES = {
	q06: {
		direction: "q06-c08",
		support: ["q06-c01", "q06-c02", "q06-c03"],
		limitations: "q06-c10",
		strongerConfidence: {
			text: "Stronger confidence would require showing, on the same held-out cases, that an added convective, event-based or regional descriptor improves a prespecified process or impact target beyond an RMM baseline, with sensitivity to event definitions reported.",
			basis: ["q06-c15", "q06-c09"],
		},
	},
	q08: {
		direction: "q08-c08",
		support: ["q08-c01", "q08-c02", "q08-c03", "q08-c04"],
		limitations: "q08-c10",
		strongerConfidence: {
			text: "Stronger confidence would require a versioned comparison specification—frozen model versions and training cutoffs, matched cases and information sets, probabilistic and process diagnostics—applied by independent groups. The records show support for such comparisons, not an approved specification.",
			basis: ["q08-c08", "q08-c15"],
		},
	},
	q11: {
		direction: "q11-c08",
		support: ["q11-c01", "q11-c02", "q11-c03", "q11-c04"],
		limitations: "q11-c10",
		strongerConfidence: {
			text: "Stronger confidence would require incremental skill on held-out regional outcomes beyond matched baselines, after conditioning on season, ENSO and other disturbances, for a specified user target and lead time.",
			basis: ["q11-c09", "q11-c15"],
		},
	},
};

export const INDEPENDENCE_NOTE = "Records are grouped by contribution. Breakout, plenary and extended minutes of the same discussion, and final-day and closing records, are counted once. Separate programme talks are independent presentations, but they were not designed as a joint test; recurring support across them is a pattern in this reading, not a measured consensus.";
