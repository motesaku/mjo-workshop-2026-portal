// Phase 9D — actionable research strategy (2026-11-04). Editorial proposal
// in this personal report; draft awaiting the author's review. Not workshop
// priorities, assignments or commitments. No data access or computing
// resources are assumed to exist.

/**
 * Prerequisite relations among the twelve illustrative workflows.
 * `from` should precede `to`. `strength`:
 *  - "required": results of `to` cannot be interpreted as intended without `from`;
 *  - "helpful": `to` can start, but `from` would sharpen or validate it.
 */
export const DEPENDENCIES = [
	{ from: "action-q02", to: "action-q09", strength: "required", reason: "Crossing, stalled and terminated events must be defined before passage errors can be compared across systems.", basis: ["q09-c13", "q02-c11"] },
	{ from: "action-q06", to: "action-q08", strength: "required", reason: "Versioned, reviewed index implementations must exist before differences in forecast skill can be interpreted.", basis: ["q06-c12", "q08-c11"] },
	{ from: "action-q10", to: "action-q08", strength: "required", reason: "Training and assimilation lineage of verification data must be known before skill on held-out cases is credited as generalization.", basis: ["q10-c12", "q08-c12"] },
	{ from: "action-q10", to: "action-q07", strength: "required", reason: "Independent observations are needed before an AI explanation is judged to generalize beyond its training data.", basis: ["q10-c09", "q07-c13"] },
	{ from: "action-q08", to: "action-q07", strength: "required", reason: "The practical-use position depends on matched, validated skill; explanations of skill presuppose that the skill is real.", basis: ["q07-c04", "q08-c15"] },
	{ from: "action-q08", to: "action-q09", strength: "required", reason: "AI and dynamical passage errors can be compared only on matched cases with comparable information.", basis: ["q09-c13", "q08-c15"] },
	{ from: "action-q03", to: "action-q09", strength: "required", reason: "Process budgets are needed before an improvement in passage is attributed to a propagation mechanism.", basis: ["q09-c16", "q03-c14"] },
	{ from: "action-q02", to: "action-q03", strength: "helpful", reason: "Transition-phase budgets need a transition definition; existing phase definitions allow a provisional start.", basis: ["q03-c11"] },
	{ from: "action-q02", to: "action-q01", strength: "helpful", reason: "Theory comparisons need the MJO behaviour each theory claims to explain to be specified.", basis: ["q01-c12", "q02-c11"] },
	{ from: "action-q03", to: "action-q01", strength: "helpful", reason: "Phase-resolved budgets are among the observables for discriminating mechanism claims.", basis: ["q01-c09", "q03-c14"] },
	{ from: "action-q10", to: "action-q03", strength: "helpful", reason: "Budgets validated against assimilated soundings are not independent; the lineage register identifies independent data.", basis: ["q03-c09", "q10-c12"] },
	{ from: "action-q06", to: "action-q09", strength: "helpful", reason: "Index-based and precipitation-based passage can disagree; versioned diagnostics make that visible.", basis: ["q09-c12", "q06-c12"] },
	{ from: "action-q06", to: "action-q11", strength: "helpful", reason: "Added MJO descriptors are judged against regional targets.", basis: ["q06-c15", "q11-c12"] },
	{ from: "action-q06", to: "action-q12", strength: "helpful", reason: "Trend definitions depend on how events and indices are defined.", basis: ["q12-c12", "q06-c01"] },
	{ from: "action-q10", to: "action-q12", strength: "helpful", reason: "Observing-system changes must be recorded before trends are interpreted.", basis: ["q12-c12"] },
];

/** Prerequisites outside the twelve workflows (not assumed to be available). */
export const EXTERNAL_PREREQUISITES = {
	"action-q11": ["A clearly defined hazard or decision target, specified with users", "Regional observations of that target"],
	"action-q08": ["Access to reforecast archives and AI forecasts with documented versions and training cutoffs"],
	"action-q09": ["Model tendency or budget outputs where mechanism claims are made"],
	"action-q07": ["Access to AI model inputs and outputs sufficient for perturbation tests"],
	"action-q05": ["A model in which cloud-radiative coupling and convection treatment can be varied"],
	"action-q01": ["At least one simple and one comprehensive model suitable for process-suppression experiments"],
	"action-q03": ["Quality-controlled sounding or field-campaign data"],
	"action-q12": ["Multiple precipitation products over a common period"],
};

/** Workflows with no prerequisite among the twelve; they can start in parallel. */
export const PARALLEL_START = ["action-q02", "action-q06", "action-q10", "action-q04", "action-q05"];

export const PILOTS = [
	{
		id: "pilot-a",
		slug: "maritime-continent-barrier",
		letter: "A",
		title: "Maritime Continent MJO Prediction Barrier",
		areas: ["area-3", "area-1"],
		objective: "Identify systematic differences in MJO propagation and passage errors over the Maritime Continent among AI and dynamical forecast systems.",
		questions: ["q09", "q08", "q02", "q06", "q03", "q07"],
		workflows: ["action-q09", "action-q08", "action-q02", "action-q06"],
		evidence: ["q09-c01", "q09-c05", "q09-c08", "q09-c10", "p9-q09-r01", "q08-c01"],
		status: "The existence of a barrier in AI forecasts, and any dependence of the barrier on season, background state or convective latitude, are open questions in the records. This pilot tests them; it does not assume them.",
		hypotheses: [
			{ id: "A1", text: "Systems that weaken or stall MJO events over the Maritime Continent show a dry lower-tropospheric bias and premature light rainfall ahead of convection relative to independent observations, and systems or events without these biases pass more often.", basis: ["q09-c01", "q09-c05"] },
			{ id: "A2", text: "If passage errors depend on season, ENSO state or the latitude of convection, error rates stratified by these factors differ by more than event-block sampling uncertainty.", basis: ["q09-c06", "q09-c11"] },
			{ id: "A3", text: "Null hypothesis: AI and dynamical systems have indistinguishable passage-failure rates on matched events. Rejection in either direction informs whether the barrier is a parameterization artefact.", basis: ["q09-c08", "q09-c10"] },
			{ id: "A4", text: "An apparent improvement in index-based passage persists in precipitation and in independent regional observations.", basis: ["q09-c16"] },
		],
		dimensions: ["Season", "Background circulation and ENSO state", "Latitude of convection", "Land–sea distribution", "Diurnal convection over land and sea", "Propagation speed", "Amplitude evolution", "Moisture and precipitation errors"],
		data: [
			"An observed reference from more than one product for OLR, precipitation, winds and humidity, with each product's assimilation lineage recorded",
			"Reforecasts from at least two dynamical subseasonal systems over a common period",
			"At least one AI forecast system with a documented training cutoff and the output variables needed (precipitation or humidity, not only index components)",
			"Independent in situ or radar data over the Maritime Continent where available",
		],
		tools: ["Versioned RMM and OLR-based index code", "An event tracker with reviewed onset, crossing, stalling and termination criteria", "Event- or year-block resampling for uncertainty", "Provenance logging of every dataset version"],
		classification: "Events are identified first in observations at verification time (crossing, stalled, terminated, jumping), then matched by initialization date in each system. Every threshold is varied over a predeclared range, and results are reported for each setting.",
		metrics: ["Passage probability (event hits and misses)", "Propagation-speed error", "Amplitude decay rate during passage", "Latitude error of the convective centre", "Precipitation and column-moisture bias in the week before arrival", "Diurnal-cycle amplitude and phase over land and sea", "Index-based and field-based scores reported side by side"],
		uncertainty: "Resample by event or year, not by day; report sample counts per stratum; report the spread among reference products; treat strata with too few events as inconclusive.",
		mve: "One dynamical and one AI system, one boreal-winter common period, index- and precipitation-based passage only, with threshold sensitivity.",
		criteria: [
			"A passage-error difference counts only if it exceeds event-block uncertainty under all predeclared thresholds.",
			"A claimed improvement must persist in precipitation and in at least one independent reference.",
			"Mechanistic interpretation is withheld unless process budgets are available (see dependencies).",
		],
		outputs: ["Observed Maritime Continent passage catalogue with labels and threshold sensitivity", "Error-decomposition tables by system, lead time and stratum", "An output-availability audit for AI systems", "A specification for a small controlled experiment, if the results justify one"],
		risks: ["Too few events per stratum", "AI systems without precipitation or humidity outputs", "Overlap between training and evaluation periods", "Reanalysis dependence of the reference over the Maritime Continent", "Definition sensitivity overwhelming system differences"],
		roles: ["Forecast-system data providers", "Custodians of regional observations", "Independent reviewers of event definitions", "Verification analyst independent of model development", "Liaison with AI developers on outputs and training periods"],
		plan: {
			d30: ["Write the event-definition protocol and the threshold ranges", "Inventory available reforecast archives, AI outputs, training cutoffs and usage terms", "Choose a common period and pre-register the analysis plan"],
			d60: ["Build the observed passage catalogue with sensitivity tests", "Compute index-based passage metrics for one dynamical and one AI system", "Audit information leakage between training and evaluation"],
			d90: ["Add precipitation, moisture and diurnal-cycle metrics", "Stratify by season, ENSO and convective latitude with uncertainty", "Write a methods note including negative results, and decide whether controlled experiments are justified"],
		},
	},
	{
		id: "pilot-b",
		slug: "index-disagreement-catalogue",
		letter: "B",
		title: "MJO Index Disagreement Catalogue",
		areas: ["area-2"],
		objective: "Determine when RMM, OMI, ROMI and event-based diagnostics give substantially different characterizations of MJO behaviour.",
		questions: ["q06", "q02", "q12", "q08"],
		workflows: ["action-q06", "action-q02", "action-q12"],
		evidence: ["q06-c01", "q06-c02", "q06-c03", "q06-c09", "q12-c01"],
		status: "The records show that diagnostics answer different questions and can disagree; they do not show where or how often. This pilot measures that.",
		hypotheses: [
			{ id: "B1", text: "Disagreement in phase or amplitude classification beyond a prespecified tolerance is concentrated in identifiable conditions—season, convection displaced from the equator, weak or noncanonical events—rather than spread uniformly.", basis: ["q06-c06", "q06-c09"] },
			{ id: "B2", text: "Real-time indices differ from retrospective OMI most near event onset and termination, because of endpoint treatment.", basis: ["q06-c09", "q06-c14"] },
			{ id: "B3", text: "Disagreement cases have physically distinct full-field structures (for example strong circulation with weak convection) and are not merely index noise.", basis: ["q06-c13"] },
			{ id: "B4", text: "Inferred trends in event frequency depend on the descriptor; the sign or magnitude differs between precipitation-event and index-based definitions over a common period.", basis: ["q12-c01", "q06-c01"] },
		],
		protocol: [
			{ title: "Common evaluation periods", text: "Use one common period with identical missing-data masks for all diagnostics." },
			{ title: "Versioned index definitions", text: "Record provider, version and retrieval date for each series; treat differently named products as different indices." },
			{ title: "Filtering and phase conventions", text: "Document filters, EOF bases and climatologies; align OMI and RMM phase conventions once and check whether a supplied product is already aligned." },
			{ title: "Real-time versus retrospective information", text: "Register what each index could know at issue time and keep retrospective series out of forecast inputs." },
			{ title: "Event identification", text: "Define events by amplitude threshold and duration and, separately, by object tracking, with predeclared settings." },
			{ title: "Seasonal dependence", text: "Stratify by season, including boreal summer." },
			{ title: "Regional differences", text: "Compare classifications against regional rainfall and convection fields." },
			{ title: "Noncanonical events", text: "Label stalling, jumping, slow and fast events explicitly rather than removing them." },
		],
		data: ["Published RMM, OMI and ROMI series with version documentation", "OLR and precipitation fields over the same period", "Reanalysis winds for full-field composites"],
		tools: ["Index computation or retrieval scripts with checksums of retrieved files", "Circular statistics for phase agreement", "An object tracker for event-based diagnostics"],
		classification: "For each day and each pair of diagnostics, record agreement in phase (within a tolerance), amplitude class and event membership; classify disagreement cases by their full-field structure.",
		metrics: ["Phase agreement rate and circular phase difference", "Amplitude correlation and class agreement", "Event-level onset and termination timing differences", "Contingency tables by season and region"],
		uncertainty: "Year-block resampling; sensitivity to tolerance and thresholds; repeat with alternative product versions.",
		mve: "RMM and ROMI over one common period, daily phase and amplitude agreement by season, with a list of disagreement cases.",
		criteria: [
			"Hypotheses are tested against predeclared tolerances, not chosen after inspection.",
			"A disagreement class counts as physical only if its full-field composite differs beyond resampling uncertainty.",
			"Agreement between indices is not treated as validation of either.",
		],
		outputs: ["A reproducible catalogue of dates, diagnostics and disagreement classes", "A disagreement atlas of full-field composites", "A metric card for each diagnostic", "A version manifest and code"],
		risks: ["Licensing or redistribution limits on series", "Silent version changes in published products", "Circularity when event definitions use one of the compared indices", "Over-interpreting agreement as validity"],
		roles: ["Maintainers of index products (for version documentation)", "Analysts familiar with each index", "Reviewers of event-tracking settings", "Users of regional rainfall forecasts"],
		plan: {
			d30: ["Freeze index versions and documentation", "Write the phase-convention crosswalk and tolerances", "Retrieve series and record checksums and retrieval dates"],
			d60: ["Compute daily agreement statistics over the common period", "Identify and stratify disagreement cases by season and region"],
			d90: ["Composite full fields for disagreement classes", "Add object-based events and the real-time versus retrospective comparison", "Release a draft catalogue for review"],
		},
	},
	{
		id: "pilot-c",
		slug: "observational-requirements",
		letter: "C",
		title: "Observational Requirements & Data Rescue",
		areas: ["area-2", "area-1"],
		objective: "Determine which existing observations and which additional measurements would most effectively reduce uncertainty in specific MJO processes.",
		questions: ["q10", "q03", "q07", "q09"],
		workflows: ["action-q10", "action-q03"],
		evidence: ["q10-c02", "q10-c03", "q10-c04", "p9-q10-r01", "q03-c09"],
		status: "The records ask for observing requirements tied to scientific questions and for reuse of existing data; they do not identify which gaps matter most. This pilot proposes a question-driven gap analysis.",
		hypotheses: [
			{ id: "C1", text: "For transition-phase moisture budgets, existing quality-controlled sounding and ship data can constrain the sign and ordering of leading terms; adding sites reduces uncertainty in the seasonal dependence more than adding precision at one site.", basis: ["q03-c09", "q10-c13"] },
			{ id: "C2", text: "A substantial fraction of nominally available validation observations over the Maritime Continent has entered reanalysis assimilation or AI training, so genuinely independent verification sets are smaller than inventories suggest.", basis: ["q10-c04", "q10-c09"] },
			{ id: "C3", text: "For a selected target, subsampling and controlled-noise experiments identify whether coverage or precision limits uncertainty.", basis: ["q10-c15", "q10-c13"] },
		],
		components: [
			{ title: "Existing data inventory", text: "Datasets, variables, coordinates, cadence, custodians, access routes and usage terms, including campaign data that are unprocessed or hard to find." },
			{ title: "Measurement uncertainty", text: "Documented accuracy and known biases for each instrument type." },
			{ title: "Spatial and temporal sampling", text: "Station density, revisit and averaging intervals relative to the process timescale." },
			{ title: "Vertical information requirements", text: "Profiles of winds, humidity and temperature that budgets and end-to-end AI questions require." },
			{ title: "Boundary-layer and air–sea observations", text: "Surface fluxes, boundary-layer MSE, downdraft and entrainment diagnostics." },
			{ title: "Data availability and quality", text: "Quality flags, gaps and processing needs." },
			{ title: "Independence from assimilation and AI training", text: "A lineage flag for each dataset and period." },
			{ title: "Reanalysis validation", text: "Which reanalysis quantities can be checked against data that were not assimilated." },
		],
		data: ["Metadata from existing field campaigns and long-term sites (for example DYNAMO ship data and long-term soundings at Manus)", "Reanalysis assimilation records where published", "Training-period documentation of AI systems"],
		tools: ["A requirement matrix template", "A lineage register", "Subsampling and noise-injection scripts for a chosen diagnostic"],
		classification: "Start from two or three process uncertainties chosen with researchers (for example the Q03 transition budget and Maritime Continent diurnal convection); for each, list required variables, resolution, duration and independence, then map existing data against them.",
		metrics: ["Coverage of each requirement by existing data", "Fraction of candidate validation data independent of assimilation and training", "Uncertainty in the chosen diagnostic as a function of sites, sampling and noise"],
		uncertainty: "Subsampling experiments inherit the error of the reference; report the reference's limitations; mark unknown lineage explicitly.",
		mve: "One process target, a requirement matrix and an inventory of known datasets with lineage flags.",
		criteria: [
			"A sampling strategy is judged useful only if it reduces uncertainty in the chosen diagnostic, or improves held-out verification, under matched resources.",
			"No generic claim that more sensors or more precision is always better.",
			"No procurement or data redistribution is implied.",
		],
		outputs: ["A requirement matrix (process → variable → resolution → duration → existing source → independence → gap)", "A list of data-rescue candidates", "Sensitivity curves of uncertainty versus coverage and precision", "A gap map"],
		risks: ["Access restrictions and incomplete metadata", "Subsampling studies inherit model or reference error", "Data that cannot be redistributed", "Effort to process legacy data underestimated"],
		roles: ["Process scientists who define the targets", "Observational data custodians", "Data-assimilation experts for lineage", "AI developers for training-period documentation"],
		plan: {
			d30: ["Select two or three process targets with researchers", "Draft the requirement matrix template", "Compile an inventory of known datasets named in the records with custodian, access and lineage fields"],
			d60: ["Audit assimilation and training lineage for the inventory", "Identify data-rescue candidates", "Define subsampling and noise experiments for one target"],
			d90: ["Run the sensitivity experiments for one target", "Produce the gap map", "Outline a data-rescue proposal without procurement"],
		},
	},
];

/** Qualitative assessment levels; "unknown" where evidence is unavailable. */
export const ASSESSMENT_LEVELS = { favourable: "Favourable", mixed: "Mixed", limited: "Limited", unknown: "Unknown" };

export const PRIORITIZATION_CRITERIA_V2 = [
	{ id: "significance", label: "Scientific significance" },
	{ id: "feasibility", label: "Feasibility" },
	{ id: "readiness", label: "Data readiness" },
	{ id: "collaboration", label: "Potential for international collaboration" },
	{ id: "reproducibility", label: "Reproducibility" },
	{ id: "reusability", label: "Reusability" },
];

export const PILOT_ASSESSMENTS = {
	"pilot-a": {
		significance: { level: "favourable", text: "The barrier is a central, recorded prediction problem, and whether AI shares it was left open." },
		feasibility: { level: "unknown", text: "Depends on access to reforecasts and AI outputs, which has not been checked." },
		readiness: { level: "unknown", text: "Output variables and training periods of AI systems are not documented in the records." },
		collaboration: { level: "favourable", text: "Needs several forecast systems and regional observations." },
		reproducibility: { level: "mixed", text: "Achievable if versions are frozen; AI versions change quickly." },
		reusability: { level: "favourable", text: "The passage catalogue serves other verification work." },
	},
	"pilot-b": {
		significance: { level: "mixed", text: "A diagnostic foundation for several questions rather than a physical result in itself." },
		feasibility: { level: "favourable", text: "The index products are publicly documented (definitions checked on 2026-11-03); access terms were not re-checked." },
		readiness: { level: "mixed", text: "Index series exist; event-tracking settings must still be agreed." },
		collaboration: { level: "mixed", text: "Benefits from index maintainers and users but can start with one group." },
		reproducibility: { level: "favourable", text: "Fully scriptable with versioned inputs." },
		reusability: { level: "favourable", text: "The catalogue informs forecast verification, lifecycle and trend studies." },
	},
	"pilot-c": {
		significance: { level: "favourable", text: "Targets uncertainties that limit Q03, Q07 and Q10." },
		feasibility: { level: "mixed", text: "Inventory work is low-cost; access and processing of legacy data are uncertain." },
		readiness: { level: "unknown", text: "Lineage of most datasets has not been audited." },
		collaboration: { level: "favourable", text: "Needs observational custodians and assimilation expertise across countries." },
		reproducibility: { level: "mixed", text: "Registers are reproducible; sensitivity studies depend on the reference used." },
		reusability: { level: "favourable", text: "A requirement matrix and lineage register are reusable by future campaigns." },
	},
};

export const PILOT_STATUS = "Three candidate pilot projects proposed in this personal report. They are editorial proposals, not workshop priorities, and no one has been asked or assigned to carry them out. Planning horizons are not promised completion dates.";
