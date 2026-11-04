// Phase 9C — disagreement, complementarity and uncertainty (2026-11-04).
// Draft awaiting the author's review. Primary classes in the package are
// unchanged; this layer revises relationship labels where Phase 8 was
// internally inconsistent and adds structured analyses.

/** Relationship revisions that take precedence over Phase 8 (editorial-classification.mjs). */
export const RELATIONSHIP_REVISIONS = {
	q07: {
		primary: "different_evaluation_standards",
		secondary: ["complementary_perspectives"],
		note: "The recorded disagreement concerns evaluation standards: when validated forecast skill is enough to trust an AI system beyond its training conditions, and what makes an AI-derived explanation convincing. The underlying objectives—practical forecasting and mechanism identification—are complementary and are not counted as disagreement.",
		basis: ["q07-c01", "q07-c05", "p9-q07-r01", "p9-q07-r03"],
		previous: "Phase 8: primary C (complementary perspectives), secondary B.",
	},
};

/** Q07 — three layers that Phase 8 combined under one label. */
export const Q07_LAYERS = {
	reassessment: {
		text: "Retained under Diverging Perspectives. Phase 9 changes the primary relationship from complementary perspectives to different evaluation standards, because two separate discussion groups recorded an explicit, unsettled contrast about what validated skill can justify. The complementary objectives are shown as their own layer, and empirical open questions are separated from positions.",
		basis: ["q07-c01", "q07-c02", "p9-q07-r03"],
	},
	layers: [
		{
			id: "objectives",
			title: "Layer 1 · Complementary research objectives",
			verdict: "Not a disagreement",
			summary: "Operational or practical forecasting asks whether a forecast is accurate, reliable and usable; mechanism identification asks which physical processes produce skill and failure. A final-day report listed these as different uses with different requirements.",
			items: [
				{ label: "Operational or practical forecasting", text: "Accuracy, reliability and usability for services; users may care more about forecast quality than about the network architecture.", basis: ["p9-q07-r01", "q07-c04"] },
				{ label: "Physical mechanism identification", text: "Understanding physical processes and sources of predictability; explaining why forecasts succeed or fail.", basis: ["p9-q07-r01", "q07-c05"] },
			],
		},
		{
			id: "standards",
			title: "Layer 2 · Different evaluation standards",
			verdict: "Genuine disagreement, recorded and unsettled",
			summary: "The positions conflict where a forecast is used beyond the conditions in which it was validated, and over what counts as understanding.",
			items: [
				{ label: "When does validated skill support practical use?", text: "One position holds that rigorous out-of-sample validation justifies use without every user understanding the architecture; the other that outperforming a dynamical model does not show that the right processes were learned, which matters most for extrapolation to new climates and extremes. The closing record framed this as different criteria—out-of-sample skill and practical value versus interpretability, physical consistency and robust generalization—and left it unsettled.", basis: ["q07-c04", "q07-c05", "q07-c07", "p9-q07-r03"] },
				{ label: "When is a mechanistic explanation convincing?", text: "The theory discussion contrasted information-based understanding with the view that AI is a computational procedure that must not be confused with physical explanation, and separated variable importance from causation. The closing discussion answered that explanations must be tested against observations rather than believed.", basis: ["q07-c02", "q07-c03", "p9-q07-r04"] },
			],
		},
		{
			id: "open",
			title: "Layer 3 · Open scientific questions",
			verdict: "Empirical questions, not positions",
			summary: "These can be answered by evidence regardless of which evaluation standard one prefers.",
			items: [
				{ label: "Sufficiency of observational information", text: "Whether observations alone contain the independent information on winds, humidity and vertical structure that end-to-end prediction of a given target needs.", basis: ["q07-c06", "q07-c09"] },
				{ label: "Generalization outside the training climate", text: "Whether skill trained on past data holds for unprecedented climate states and extremes; no validated technique was recorded.", basis: ["q12-c04", "q07-c10"] },
				{ label: "Physical consistency and interpretability", text: "Whether an AI model gets the right answer for the right reasons, including conservation and realistic moisture, convection and teleconnections.", basis: ["p9-q07-r02", "q07-c08"] },
				{ label: "Robustness of AI-derived mechanisms", text: "Whether a discovered relationship survives equivalent representations, perturbations and held-out regimes; several equations may fit the same trajectories.", basis: ["q07-c15", "q07-c13"] },
			],
		},
	],
	evidenceOfDisagreement: { text: "The final-day record calls the contrast one of the clearest disagreements of the session, its own summary table lists the explainability of AI as an active disagreement, and the closing record states that the discussion did not settle the dispute. Final-day and closing records may overlap and count as one contribution; the theory breakout, plenary and extended minutes form a second, separate discussion group.", basis: ["q07-c01", "p9-q07-r03", "q07-c07", "q07-c02"] },
	distinguishing: { text: "Layer 2 is not settled by one experiment, but it narrows when claims are bounded: state the lead times, regimes and variables for which skill was validated; test performance on held-out regimes and on climates or extremes outside the training period; attribute skill to resolved modes (for example ENSO or the MJO itself) and to physically admissible perturbations. A forecast that keeps its skill under these tests strengthens the practical-use claim; an explanation that survives them strengthens the mechanistic claim.", basis: ["q07-c15", "q07-c13", "q07-c12"] },
};

/** Q03 — five process families, competing hypotheses and discriminating tests. */
export const Q03_ANALYSIS = {
	reassessment: {
		text: "Retained under Diverging Perspectives with the relationship competing hypotheses. Phase 9 restates the competition as one about relative roles, temporal ordering and necessity under specified conditions, not about whether each process exists. The explicit contrast in the records is a single question-and-answer exchange, labelled in the minutes as the discussant's view; observational talks are consistent with several pathways and do not adjudicate among them.",
		basis: ["q03-c01", "q03-c06", "q03-c07"],
	},
	processes: [
		{ id: "advection", title: "Horizontal moisture advection", text: "Transport of moisture by anomalous and mean winds, central to advective moisture-mode interpretations of eastward propagation.", basis: ["q03-c04", "q03-c03"] },
		{ id: "convergence", title: "Moisture convergence", text: "Low-level (boundary-layer) convergence that supplies moisture and lifts it; part of multicloud frameworks.", basis: ["q03-c05", "p9-q03-r01"] },
		{ id: "shallow", title: "Shallow-convective moistening", text: "Upward moisture transport by shallow and congestus clouds, observed as stepwise low-to-mid-level moistening and reported to strengthen the MJO in many models.", basis: ["q03-c03", "p9-q03-r02", "q02-c03"] },
		{ id: "boundary_layer", title: "Boundary-layer processes", text: "Energy losses to downdrafts and entrainment and their recovery by surface fluxes, which condition when deep convection can develop.", basis: ["q03-c03"] },
		{ id: "temperature", title: "Thermodynamic (temperature) contributions to moist static energy", text: "Free-tropospheric temperature anomalies that contribute appreciably to MSE during transitions at one site, with seasonal dependence.", basis: ["q03-c02"] },
	],
	interactions: "In this editorial framing (not a workshop record), the processes are coupled: convergence drives shallow convection, which redistributes moisture vertically. In a column-integrated budget, shallow-convective moistening is largely an internal redistribution, whereas in a layer budget it is a leading source. Whether the convergence–shallow-convection pathway competes with horizontal advection therefore depends on the budget layer and decomposition, which is why conventions must be fixed before comparing claims.",
	hypotheses: [
		{ id: "H1", title: "Advection-led", text: "During the suppressed-to-active transition east of convection, horizontal moisture advection is the leading term of the column moisture (or MSE) tendency and leads deep-convection onset; removing anomalous horizontal advection in a controlled model slows or removes eastward propagation.", basis: ["q03-c04", "q03-c14"] },
		{ id: "H2", title: "Convergence- and shallow-convection-led", text: "Low-level convergence and vertical moisture transport by shallow and congestus convection dominate lower-to-mid-tropospheric moistening before deep convection, with moistening appearing first at low levels; suppressing shallow-convective moistening slows propagation even when horizontal advection is retained.", basis: ["q03-c05", "p9-q03-r01", "p9-q03-r02"] },
		{ id: "H3", title: "Boundary-layer recovery as a gate", text: "Recovery of boundary-layer MSE after downdraft and entrainment losses sets when deep convection can develop; this conditions, rather than replaces, H1 or H2.", basis: ["q03-c03", "q03-c08"] },
		{ id: "S", title: "Scope question: temperature contributions", text: "If appreciable free-tropospheric temperature contributions during transitions hold beyond one site and season, moisture-only budgets would misattribute part of the MSE tendency. Whether temperature anomalies are a driver, a response or a covarying component is open.", basis: ["q03-c02", "q03-c06", "q03-c08"] },
	],
	conditions: { text: "The hypotheses need not have the same answer everywhere: the records already show seasonal dependence at one site (boreal winter versus spring), and the relative weights may change between the Indian Ocean, the Maritime Continent and the western Pacific and between events.", basis: ["q03-c02", "q03-c07"] },
	tests: [
		{ title: "Layer-resolved budgets with frozen conventions", text: "Compute boundary-layer, lower- and upper-tropospheric moisture and MSE budgets around transition onset, with closure residuals, and compare the lead times of advection, convergence and vertical-transport terms (H1 versus H2 ordering).", basis: ["q03-c11", "q03-c13"] },
		{ title: "Column versus layer budgets", text: "H2 predicts large vertical redistribution with a small net column source from shallow convection; H1 predicts a column tendency dominated by horizontal advection.", basis: ["q03-c14"] },
		{ title: "Mechanism-denial experiments across a model hierarchy", text: "Separately remove anomalous horizontal moisture advection, suppress shallow-convective moisture transport, and alter boundary-layer downdraft or surface-flux effects, diagnosing induced mean-state change in each case.", basis: ["q03-c12", "q03-c15"] },
		{ title: "Independent multi-site soundings", text: "Test temperature versus moisture contributions by layer and season at several sites, using soundings that were not assimilated into the reanalysis being compared.", basis: ["q03-c09", "q03-c12"] },
	],
	numericalUncertainty: { text: "Percentages of temperature and moisture contributions at Manus remain withheld: the reported shares do not add up to the whole, so their denominator is unresolved. Ratios of downdraft and entrainment contributions and boundary-layer flux estimates come from automatic transcripts and single campaigns and are not reproduced here. Event samples per season are small.", basis: ["q03-c02", "q03-c09"] },
	evidenceState: { text: "One recorded exchange contrasts H1 and H2; observations and models reported at the workshop are consistent with several pathways; no recorded analysis discriminated among them.", basis: ["q03-c01", "q03-c03", "q03-c07"] },
};

/** Forms of agreement that must not be conflated (Phase 9C step C3). */
export const AGREEMENT_FORMS = {
	problem: { label: "Shared recognition of a problem", description: "Several contributions identify the same limitation or open problem." },
	method: { label: "Agreement on a methodological direction", description: "Several contributions favour the same kind of approach to the problem." },
	physics: { label: "Agreement on a physical explanation", description: "Contributions accept the same explanation of a phenomenon." },
	endorsement: { label: "Formal endorsement of an action", description: "A decision, resolution or adopted plan is recorded." },
};
export const FORM_STATES = { recorded: "Recorded", partial: "Partly recorded", not_recorded: "Not recorded", not_applicable: "Not applicable" };

export const ALIGNMENT_FORMS = {
	q06: {
		problem: { state: "recorded", text: "RMM limitations for convection, regional rainfall and structure are noted in independent talks and in the closing record.", basis: ["q06-c01", "q06-c02", "q06-c03"] },
		method: { state: "recorded", text: "Supplement RMM rather than replace it: recommended in the closing record and echoed by the prediction keynote and event-based talks.", basis: ["q06-c07", "q06-c08"] },
		physics: { state: "not_applicable", text: "The question concerns diagnostics, not a physical explanation.", basis: [] },
		endorsement: { state: "not_recorded", text: "No index, metric suite or performance threshold was adopted.", basis: ["q06-c08"] },
		remaining: { text: "Which descriptors add value for which target; simplicity versus richer structure; what each descriptor would know at forecast time.", basis: ["q06-c09"] },
	},
	q08: {
		problem: { state: "recorded", text: "Evaluation designs make reported skill incomparable; rapidly updated AI versions strain reforecast-based comparison; skill and predictability estimate different quantities.", basis: ["q08-c01", "q08-c02", "q08-c03"] },
		method: { state: "partial", text: "Common, reproducible benchmarks and real-time comparison as a complement to reforecasts were proposed, but whether AI needs its own metrics remained disputed.", basis: ["q08-c04", "q08-c06", "q08-c08"] },
		physics: { state: "not_recorded", text: "No shared explanation of why particular systems gain skill.", basis: ["q08-c09"] },
		endorsement: { state: "not_recorded", text: "No benchmark specification was approved, and no agreement to abandon reforecasts was reached.", basis: ["q08-c02", "q08-c08"] },
		remaining: { text: "Metric choice, sample adequacy for rare regimes, freezing versions, availability of process outputs.", basis: ["q08-c09"] },
	},
	q11: {
		problem: { state: "recorded", text: "Index skill is not regional value: stated in the applications keynote, a case study, the prediction Q&A, the closing record and final-day reports.", basis: ["p9-q11-r01", "q11-c01", "p9-q11-r04"] },
		method: { state: "recorded", text: "Conditional, regional evaluation against simple baselines and with ENSO and season, and co-design with users. The final-day minutes label regional impact evaluation and co-design as broad convergence; that is the minutes' characterization, not a resolution.", basis: ["q11-c08", "q11-c02", "p9-q07-r03"] },
		physics: { state: "partial", text: "A shared framework of teleconnection error sources (heating location, propagation speed, background flow) was reported, but not an agreed explanation of why remote responses are too weak.", basis: ["q11-c04", "p9-q11-r02"] },
		endorsement: { state: "not_recorded", text: "Volunteers came forward for practical activities at the close, but no adopted plan with owners, deadlines or deliverables is recorded.", basis: ["q11-c08"] },
		remaining: { text: "Incremental skill after conditioning; which targets matter to which users; whether any realized benefit exists.", basis: ["q11-c09"] },
	},
};

/** Phase 9C step C4 — major debated issues. */
export const DISAGREEMENT_MATRIX = [
	{
		issue: "q01", question: "What evidence establishes an MJO mechanism?",
		a: { text: "Diagnostics that separate better- from worse-performing models carry evidence about mechanisms.", basis: ["q01-c04"] },
		b: { text: "Mechanism claims require tests of a theory's assumptions: process interventions in independent models and falsifying observations.", basis: ["q01-c05"] },
		compatible: "Partly: as successive steps they combine; they conflict only if diagnostic skill alone is taken to identify the mechanism in nature.",
		distinguish: { text: "Matched process-suppression experiments in independent models; per-theory lists of observations that would contradict it.", basis: ["q01-c15", "q01-c09"] },
		uncertainty: { text: "Tuning, compensating errors and induced mean-state change confound interventions.", basis: ["q01-c10"] },
		evidence: "Recorded in one discussion group (breakout, plenary and extended minutes); no test performed.",
	},
	{
		issue: "q03", question: "Which pathway leads moistening before deep convection?",
		a: { text: "Horizontal moisture advection leads the column moisture tendency.", basis: ["q03-c04"] },
		b: { text: "Low-level convergence and shallow-convective moistening lead lower-to-mid-tropospheric moistening.", basis: ["q03-c05"] },
		compatible: "Not mutually exclusive; they compete over dominance, ordering and necessity under specified conditions and budget conventions.",
		distinguish: { text: "Layer-resolved budgets with frozen conventions and lead–lag analysis; mechanism-denial experiments.", basis: ["q03-c14", "q03-c12"] },
		uncertainty: { text: "Single-site and cruise sampling, budget residuals, assimilation dependence, ASR-derived numbers.", basis: ["q03-c09"] },
		evidence: "One recorded exchange; observations consistent with several pathways.",
	},
	{
		issue: "q05", question: "How does the stratosphere modulate MJO convection?",
		a: { text: "Stratospheric winds alter the vertical tilt and phase of an ice-cloud radiative feedback.", basis: ["q05-c03"] },
		b: { text: "Organized mesoscale convection is a common missing process linking QBO coupling and the Maritime Continent barrier.", basis: ["q05-c04"] },
		compatible: "Could interact; unequal evidence (an idealized model result versus an untested proposal).",
		distinguish: { text: "Factorial experiments varying stratospheric winds, cloud-radiative coupling and organized-convection treatment.", basis: ["q05-c13", "q05-c11"] },
		uncertainty: { text: "Simplified model physics; model-dependent significance; ENSO and seasonal confounding.", basis: ["q05-c08"] },
		evidence: "Two separate talks' records; neither tested the other pathway.",
	},
	{
		issue: "q07", question: "What can validated AI skill justify?",
		a: { text: "Rigorous out-of-sample validation justifies bounded practical use without full understanding of the architecture.", basis: ["q07-c04"] },
		b: { text: "Skill does not show that the right processes were learned; trust beyond validated conditions requires mechanistic understanding.", basis: ["q07-c05"] },
		compatible: "The objectives are compatible; the standards conflict where use extends beyond validated conditions.",
		distinguish: { text: "Held-out regimes and out-of-distribution climates; attribution of skill to resolved modes; physically admissible perturbations.", basis: ["q07-c15", "q07-c13"] },
		uncertainty: { text: "Training overlap, black-box access, correlated inputs.", basis: ["q07-c10", "q07-c16"] },
		evidence: "Explicit and unsettled in two separate discussion groups.",
	},
	{
		issue: "q08", question: "Should AI and dynamical forecasts be judged by the same metrics?",
		a: { text: "The same physical and forecast metrics should apply wherever possible, for comparability.", basis: ["q08-c06"] },
		b: { text: "AI systems need fundamentally new or AI-specific diagnostics for their distinctive failure modes.", basis: ["q08-c04"] },
		compatible: "Largely: a common core plus AI-specific diagnostics; the dispute is over sufficiency of the common core.",
		distinguish: { text: "Whether AI-specific diagnostics detect failures that common metrics miss on matched cases.", basis: ["q08-c15"] },
		uncertainty: { text: "Restricted AI output variables limit common process diagnostics.", basis: ["q08-c16"] },
		evidence: "One record (closing discussion).",
	},
	{
		issue: "q09", question: "Why do forecasts weaken or stall the MJO over the Maritime Continent?",
		a: { text: "Local moisture, diurnal-cycle and land–sea processes (dry bias, premature weak rain).", basis: ["q09-c05"] },
		b: { text: "Background SST and interacting disturbances control propagation regimes, so local convection alone is incomplete.", basis: ["q09-c06"] },
		compatible: "Not exclusive and not ranked; both may act in different events.",
		distinguish: { text: "Matched crossing versus stalled events; tendency comparisons; controlled SST and convection experiments.", basis: ["q09-c16", "q09-c14"] },
		uncertainty: { text: "Case-specific experiments; mixed resolutions and periods.", basis: ["q09-c11"] },
		evidence: "Candidate causes listed in a keynote and case studies; not ranked.",
	},
];

/** Perspectives that differ in purpose or scale but are not disagreements. */
export const COMPLEMENTARY_PERSPECTIVES = [
	{ issue: "q06", title: "RMM and supplementary diagnostics", text: "A compact common index and richer convective, event-based or regional descriptors answer different questions.", basis: ["q06-c07"] },
	{ issue: "q08", title: "Reforecasts and real-time comparison", text: "Large conditional samples versus evaluation of current model versions.", basis: ["q08-c05"] },
	{ issue: "q10", title: "Precision and coverage of observations", text: "A target-dependent design trade-off, not a contest of observing strategies.", basis: ["q10-c07"] },
	{ issue: "q11", title: "Regional contributions", text: "Different regions, hazards and users; none opposes using MJO information.", basis: ["q11-c07"] },
	{ issue: "q02", title: "Levels of lifecycle explanation", text: "Background conditions, finite-amplitude growth and multiscale development as potentially complementary levels.", basis: ["q02-c07"] },
	{ issue: "q07", title: "Practical forecasting and mechanism identification", text: "Different uses of AI with different requirements (Layer 1 of the Q07 analysis).", basis: ["p9-q07-r01"] },
	{ issue: "q01", title: "Simple and comprehensive models", text: "Contrasting viewpoints on simple versus fully coupled high-resolution models were recorded, but both fit within a model hierarchy; no community initiative was agreed.", basis: ["q01-c03"] },
];
