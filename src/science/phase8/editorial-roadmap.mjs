// Phase 8 strategic roadmap (2026-11-04). Editorial proposal by the site
// author's report — NOT workshop-endorsed priorities. Scientific priorities are
// defined by research questions; AI agents appear only as implementation tools.
// Draft awaiting the author's review. Every entry names the claims it rests on.

export const ROADMAP_STATUS = "An editorial strategic proposal in this personal report. The four areas are not workshop-endorsed priorities, and no ranking among them is implied.";

export const PRIORITY_AREAS = [
	{
		id: "area-1",
		numeral: "I",
		title: "MJO Lifecycle & Physical Mechanisms",
		shortTitle: "Area I · Lifecycle & mechanisms",
		objective: "Identify the physical processes controlling MJO initiation, organization, propagation, maintenance and termination.",
		coreIssues: ["q01", "q02", "q03", "q09"],
		crossCuttingIssues: ["q04", "q05"],
		gap: {
			text: "There are no shared operational lifecycle definitions or evidential standards that would allow candidate mechanisms to be tested against one another on the same events.",
			basis: ["q02-c08", "q01-c07", "q01-c09"],
		},
		observationsAndOutputs: [
			{ text: "Phase-, season- and height-resolved budgets of temperature, moisture, transport, surface-flux and radiative terms, with closure residuals and assimilation-lineage flags.", basis: ["q03-c11", "q03-c13"] },
			{ text: "An event-level lifecycle catalogue that keeps raw fields and alternative onset, organization and termination classifications.", basis: ["q02-c12", "q02-c14"] },
			{ text: "Matched control and process-suppression experiments in a simple nonlinear model and an independent comprehensive model, with induced mean-state changes diagnosed.", basis: ["q01-c13"] },
			{ text: "Matched crossing, stalled and terminated Maritime Continent events across AI forecasts, dynamical forecasts and observations, including model tendencies where they are available.", basis: ["q09-c13", "q09-c14"] },
			{ text: "Cross-cutting: harmonized energy diagnostics across independent products, and factorial experiments varying stratospheric winds, cloud-radiative coupling and organized convection.", basis: ["q04-c12", "q05-c11"] },
		],
		nextInvestigation: {
			text: "Assemble a researcher-reviewed matrix of mechanism assumptions and the observations that would contradict each, then compute transition-phase budgets under frozen definitions for independent sites and seasons.",
			basis: ["q01-c12", "q03-c11", "q03-c12"],
		},
		deliverable: {
			text: "An executable experiment specification and phase-by-height budgets with uncertainty, recording confirming and contradicting outcomes alike.",
			basis: ["q01-c14", "q03-c13"],
		},
	},
	{
		id: "area-2",
		numeral: "II",
		title: "Observations & Diagnostics",
		shortTitle: "Area II · Observations & diagnostics",
		objective: "Identify the measurements and diagnostic methods that most effectively reduce uncertainty in MJO mechanisms and forecast evaluation.",
		coreIssues: ["q06", "q10"],
		crossCuttingIssues: [],
		gap: {
			text: "Index-based descriptions and observing priorities are not yet tied to the specific process or impact targets they are meant to constrain, and the independence of validation data from training and assimilation is often unknown.",
			basis: ["q06-c09", "q10-c02", "q10-c09"],
		},
		observationsAndOutputs: [
			{ text: "Reviewed implementations of RMM, OLR-based, object-based and regional diagnostics with explicit filters, thresholds and training climatologies, plus a register of what each would know at forecast time.", basis: ["q06-c12", "q06-c14"] },
			{ text: "An inventory of existing datasets recording variables, cadence, quality, access, processing needs, assimilation history and AI-training overlap.", basis: ["q10-c12"] },
			{ text: "Subsampling and controlled measurement-noise experiments against an independent reference for a selected measurable target.", basis: ["q10-c13"] },
		],
		nextInvestigation: {
			text: "Compare common and supplementary diagnostics on matched cases and lead times, while cataloguing which existing observations are genuinely independent of training and assimilation.",
			basis: ["q06-c13", "q10-c12"],
		},
		deliverable: {
			text: "A metric card for each diagnostic with matched-case results, and a gap map with a lineage matrix and accuracy-versus-coverage sensitivity curves.",
			basis: ["q06-c14", "q10-c14"],
		},
	},
	{
		id: "area-3",
		numeral: "III",
		title: "Prediction & Physical Understanding",
		shortTitle: "Area III · Prediction & understanding",
		objective: "Establish robust, process-aware comparisons among AI, hybrid and dynamical forecast systems.",
		coreIssues: ["q07", "q08"],
		crossCuttingIssues: [],
		gap: {
			text: "There is no versioned, matched framework in which AI, hybrid and dynamical forecasts are evaluated on the same cases, information and process diagnostics, nor an agreed test of when an AI-derived explanation is physically robust.",
			basis: ["q08-c08", "q07-c08", "q07-c09"],
		},
		observationsAndOutputs: [
			{ text: "An inventory of model versions, initialization times, ensemble sizes, training cutoffs, climatologies and output availability, with a shared evaluation intersection and a separate real-time ledger.", basis: ["q08-c12"] },
			{ text: "Index and field errors, calibration and probabilistic scores with event- or year-block uncertainty, and potential-predictability estimates under alternative truth-member choices.", basis: ["q08-c13"] },
			{ text: "Documented training and evaluation lineage for AI systems, physically admissible perturbation experiments, and held-out regimes for testing discovered relationships.", basis: ["q07-c12", "q07-c13"] },
		],
		nextInvestigation: {
			text: "Specify a versioned matched benchmark before comparing systems, then test AI explanations against alternatives using perturbations, held-out regimes and independent observations.",
			basis: ["q08-c12", "q07-c13"],
		},
		deliverable: {
			text: "A reproducible scoring specification with paired comparisons, and an explanation dossier that records failed tests and separates empirical fit from mechanism.",
			basis: ["q08-c14", "q07-c14"],
		},
	},
	{
		id: "area-4",
		numeral: "IV",
		title: "Regional Impacts & Climate Change",
		shortTitle: "Area IV · Regional impacts & climate change",
		objective: "Assess conditional regional predictability, societal relevance and robustness across climate regimes.",
		coreIssues: ["q11", "q12"],
		crossCuttingIssues: [],
		gap: {
			text: "How much regional skill remains after season, ENSO and other disturbances are accounted for, and whether inferred MJO changes survive alternative data and definition choices, have not been tested systematically.",
			basis: ["q11-c09", "q12-c09"],
		},
		observationsAndOutputs: [
			{ text: "Matched held-out comparisons of climatology, season and ENSO baselines and models adding MJO structure, with sample counts and temporal information availability retained.", basis: ["q11-c12"] },
			{ text: "A specified user scenario for calibration and cost–loss evaluation, without claiming realized societal benefit.", basis: ["q11-c13", "q11-c16"] },
			{ text: "Common-period, multi-product analyses of event frequency, intensity, area and duration, with observing-system changes recorded, and held-out climate-regime tests.", basis: ["q12-c12", "q12-c13"] },
		],
		nextInvestigation: {
			text: "Evaluate conditional regional skill against matched baselines for a defined user target, and audit trend definitions before interpreting projected change.",
			basis: ["q11-c12", "q12-c12"],
		},
		deliverable: {
			text: "Regional conditional-skill tables with event-level uncertainty, and a trend-definition robustness matrix stating when interpretation must be withheld.",
			basis: ["q11-c14", "q12-c14"],
		},
	},
];

/**
 * Objective → testable hypothesis for each illustrative workflow. Method,
 * deliverable and evaluation criteria are taken unchanged from the package
 * (proposal steps, expected outputs and discriminating result).
 */
export const ACTION_CHAINS = {
	"action-q01": { objective: "Determine which proposed MJO mechanisms are necessary within their stated domains.", hypothesis: "If a proposed process is necessary, suppressing it in matched experiments removes the specified MJO behaviour without an uncontrolled change in the mean state.", basis: ["q01-c15", "q01-c16"] },
	"action-q02": { objective: "Establish operational definitions of MJO initiation, organization, propagation and termination that support comparisons of mechanisms and skill.", hypothesis: "A proposed precursor discriminates subsequent lifecycle transitions in held-out events after conditioning on the background state.", basis: ["q02-c15"] },
	"action-q03": { objective: "Separate the moisture, temperature, transport, surface-flux and radiative contributions to MJO transitions.", hypothesis: "A claimed dominant moistening pathway exceeds budget uncertainty and persists under defensible alternative definitions, sites and seasons.", basis: ["q03-c14"] },
	"action-q04": { objective: "Determine whether tropical-mean and interhemispheric energy variations reflect one coupled mechanism.", hypothesis: "If the two signals are coupled, their phase relationship persists across independent products, common sampling and budget corrections.", basis: ["q04-c14"] },
	"action-q05": { objective: "Identify the pathway by which the stratospheric state modulates MJO convection.", hypothesis: "If the ice-cloud radiative pathway operates, the QBO-related response weakens when cloud-radiative feedback is disabled in a credible model control.", basis: ["q05-c13"] },
	"action-q06": { objective: "Determine which diagnostics add information beyond a common index for specified process and impact targets.", hypothesis: "An added descriptor improves a prespecified held-out process or impact target beyond the RMM baseline.", basis: ["q06-c15"] },
	"action-q07": { objective: "Determine what a validated AI forecast or derived explanation can establish about MJO physics.", hypothesis: "An AI-derived explanation remains stable under equivalent representations and survives physically admissible perturbations and held-out tests.", basis: ["q07-c15"] },
	"action-q08": { objective: "Separate genuine forecast-system improvement from changes in sample, information and scoring.", hypothesis: "A claimed forecast advantage persists on matched held-out cases with comparable information and quantified uncertainty.", basis: ["q08-c15"] },
	"action-q09": { objective: "Identify why forecasts weaken or stall the MJO over the Maritime Continent.", hypothesis: "An apparent improvement in passage persists in precipitation and independent regional data, not only in an index.", basis: ["q09-c16"] },
	"action-q10": { objective: "Link observing requirements to the specific uncertainties they should reduce.", hypothesis: "A candidate sampling strategy reduces uncertainty in a chosen diagnostic, or improves held-out verification, under matched resources.", basis: ["q10-c15"] },
	"action-q11": { objective: "Assess when MJO forecast skill adds information about regional outcomes.", hypothesis: "MJO information improves held-out regional outcome forecasts beyond matched baselines after conditioning on the background state.", basis: ["q11-c15"] },
	"action-q12": { objective: "Assess the robustness of inferred MJO trends and projected regional changes.", hypothesis: "An inferred trend or projected change keeps its sign under defensible data and definition choices, and the models used represent present-day mechanisms.", basis: ["q12-c15"] },
};

/** Optional qualitative prioritization framework. No scores are assigned. */
export const PRIORITIZATION_CRITERIA = [
	{ id: "significance", label: "Scientific significance", question: "Would the result discriminate between competing explanations or remove a recognized source of error?" },
	{ id: "feasibility", label: "Feasibility", question: "Do the required data, model outputs and definitions exist and are they accessible? The workflow limitations list known obstacles." },
	{ id: "collaboration", label: "International collaboration potential", question: "Does the work need, or benefit from, several modelling centres, observing programmes or regional partners?" },
	{ id: "reusability", label: "Reusability of outcomes", question: "Would the catalogues, benchmarks or protocols be reusable by other groups beyond the original question?" },
];

export const PRIORITIZATION_NOTE = "No evidence-based scores exist for these criteria, and no community ranking was recorded. Numerical ranking is therefore left unassigned; the criteria are offered as questions for readers planning their own work.";
