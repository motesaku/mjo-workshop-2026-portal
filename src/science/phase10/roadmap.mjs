// Phase 10E — research pilot feasibility (2026-11-05). Editorial research proposal in
// this personal report; draft awaiting the author's review. Not workshop priorities,
// assignments or commitments; no data access or computing resources are assumed.
//
// Phase 9 labelled seven relations "required" and drew every relation as a scheduling
// step. Its own definition of "required" was that results "cannot be interpreted as
// intended" without the prerequisite—a validation requirement, not a reason to wait.
// Phase 10 types each relation by what it actually constrains. The Phase 9 data
// (src/science/phase9/roadmap.mjs and its versioned export) are unchanged.
import { DEPENDENCIES as PHASE9_DEPENDENCIES, EXTERNAL_PREREQUISITES } from "../phase9/roadmap.mjs";

export const DEPENDENCY_TYPES = {
	start: { label: "Prerequisite for starting", short: "Starting", description: "The task cannot meaningfully begin before this requirement is met." },
	interpretation: { label: "Prerequisite for interpretation", short: "Interpretation", description: "Preliminary analysis can proceed, but scientific interpretation of its results requires the prerequisite." },
	publication: { label: "Prerequisite for publication", short: "Publication", description: "Exploratory work can proceed, but publication-level conclusions require this validation." },
	optional: { label: "Helpful but optional", short: "Optional", description: "The task can proceed independently; the prerequisite could improve its quality." },
};

/** Phase 10 type of each Phase 9 relation, keyed "from>to", with what can start meanwhile. */
const TYPING = {
	"action-q02>action-q09": { type: "interpretation", meanwhile: "Passage diagnosis can start with provisional, predeclared crossing and stalling thresholds and their sensitivity; comparing passage errors across systems needs reviewed lifecycle definitions." },
	"action-q06>action-q08": { type: "interpretation", meanwhile: "A matched benchmark can run with documented index versions; interpreting skill differences between systems needs reviewed, versioned index implementations." },
	"action-q10>action-q08": { type: "interpretation", meanwhile: "Skill on held-out cases can be computed; crediting it as generalization needs the training and assimilation lineage of the verification data." },
	"action-q10>action-q07": { type: "publication", meanwhile: "Perturbation and attribution tests of AI explanations can proceed on available data; concluding that an explanation generalizes beyond the training data needs independent observations." },
	"action-q08>action-q07": { type: "interpretation", meanwhile: "Explanation tests can begin on published systems; attributing skill to a source requires the skill to be established on matched, validated cases." },
	"action-q08>action-q09": { type: "interpretation", meanwhile: "Passage statistics for each system can start; comparing AI with dynamical passage errors requires matched cases with comparable information, which a pilot can build for a small sample." },
	"action-q03>action-q09": { type: "interpretation", meanwhile: "Descriptive passage diagnosis can proceed; attributing a change in passage to a propagation mechanism requires process budgets." },
	"action-q02>action-q03": { type: "optional", meanwhile: "Existing phase definitions allow budgets to start; transition definitions sharpen the composites." },
	"action-q02>action-q01": { type: "optional", meanwhile: "The theory-comparison matrix can be built from each theory's stated predictions; agreed lifecycle definitions make its observables more precise." },
	"action-q03>action-q01": { type: "optional", meanwhile: "The matrix can be built from published predictions; phase-resolved budgets add discriminating observables." },
	"action-q10>action-q03": { type: "publication", meanwhile: "Budgets can be computed and compared with reanalysis now; presenting them as independently validated requires knowing which soundings were assimilated." },
	"action-q06>action-q09": { type: "optional", meanwhile: "Passage can be judged with one documented index plus precipitation; versioned diagnostics show where index-based and precipitation-based passage disagree." },
	"action-q06>action-q11": { type: "optional", meanwhile: "Conditional regional skill can be computed with RMM; added descriptors can be judged later against the same regional targets." },
	"action-q06>action-q12": { type: "optional", meanwhile: "The trend audit compares definitions itself; versioned diagnostics make its inputs reproducible." },
	"action-q10>action-q12": { type: "interpretation", meanwhile: "Trends can be computed now; interpreting them as physical change requires a record of observing-system changes." },
};

export const DEPENDENCIES_V2 = PHASE9_DEPENDENCIES.map((d) => {
	const t = TYPING[`${d.from}>${d.to}`];
	if (!t) throw new Error(`Phase 10 typing missing for ${d.from} → ${d.to}`);
	return { ...d, phase9Strength: d.strength, type: t.type, meanwhile: t.meanwhile };
});

/** External prerequisites (Phase 9 list), typed. Text is unchanged from Phase 9. */
const EXTERNAL_TYPES = {
	"action-q11": ["start", "interpretation"],
	"action-q08": ["start"],
	"action-q09": ["interpretation"],
	"action-q07": ["start"],
	"action-q05": ["start"],
	"action-q01": ["start"],
	"action-q03": ["start"],
	"action-q12": ["start"],
};
export const EXTERNAL_PREREQUISITES_V2 = Object.fromEntries(
	Object.entries(EXTERNAL_PREREQUISITES).map(([id, items]) => [id, items.map((text, i) => ({ text, type: EXTERNAL_TYPES[id]?.[i] ?? EXTERNAL_TYPES[id]?.[0] ?? "start" }))]),
);
export const EXTERNAL_NOTE = "For the theory-comparison workflow (Q01) the models are needed only to start the process-suppression experiments; the comparison matrix itself can start from published predictions.";

/** Every workflow with no internal prerequisite for starting. */
export const STARTABLE_NOW = [...new Set(PHASE9_DEPENDENCIES.flatMap((d) => [d.from, d.to]).concat(["action-q04", "action-q05", "action-q11"]))]
	.filter((id) => !DEPENDENCIES_V2.some((d) => d.to === id && d.type === "start"))
	.sort();

export const ROADMAP_DEPENDENCY_NOTE = "No relation among the twelve workflows prevents any of them from starting. The relations constrain when results can be interpreted or published. What can block a start is outside the workflows: data access, model outputs and, for regional value, a hazard or decision target defined with users.";

/**
 * Stage structure and decision points for the three pilots (Phase 10E steps E2–E5).
 * `startable` items can begin now; `interpretation` and `publication` list what the
 * results need before they are interpreted or published; `decisions` are the
 * criteria for continuing, revising or stopping at the 90-day review.
 */
export const PILOT_STAGES = {
	"pilot-a": {
		stages: [
			{ id: "descriptive", title: "Stage 1 · Descriptive evaluation", text: "On matched events, describe how AI and dynamical systems differ in passage success, propagation speed, amplitude evolution, convective position and precipitation and moisture errors over the Maritime Continent.", allowed: "Statements about differences in forecast behaviour, with uncertainty. No causal attribution." },
			{ id: "process", title: "Stage 2 · Process diagnosis", text: "Test whether the Stage 1 differences are associated with moisture, diurnal-cycle, land–sea or background-state biases, using the outputs each system provides and process budgets where available.", allowed: "Associations between passage errors and specific biases. Association is not causation." },
			{ id: "causal", title: "Stage 3 · Causal testing", text: "Where a Stage 2 candidate is testable and a suitable model is available, use controlled interventions or mechanism-denial experiments (for example correcting a moisture bias, altering the diurnal cycle or replacing sea-surface temperatures) and check whether passage changes in the predicted direction.", allowed: "Causal statements within the tested model and experiment design." },
		],
		caution: "Differences between AI and dynamical forecasts are not direct evidence for the causal role of convection parameterization. The systems also differ in initialization, training data, resolution, output variables and other error sources; only Stage 3 can test a parameterization-related mechanism, and only in the model used.",
		controls: [
			{ title: "Evaluation period", text: "One common period for all systems; results for any part of it that overlaps an AI system's training data are reported separately or excluded." },
			{ title: "Initialization", text: "Matched initialization dates; the source of initial conditions recorded for each system, since AI systems are often initialized from a reanalysis rather than an operational analysis." },
			{ title: "Output availability", text: "The variables each system provides are recorded, and each comparison uses only metrics available for every system in it." },
			{ title: "Observational reference", text: "More than one reference product, each with its assimilation lineage; the spread among references reported with every result." },
			{ title: "Training-data overlap", text: "Training cutoffs documented; evaluation inside a training period flagged as not a test of generalization." },
		],
		startable: ["Write the event-definition protocol with predeclared threshold ranges", "Build the observed passage catalogue from more than one reference product", "Inventory reforecast archives and AI outputs, training cutoffs and usage terms"],
		interpretation: ["Reviewed lifecycle definitions (lifecycle labels workflow) before passage errors are compared across systems", "Matched cases with comparable information (matched forecast benchmark) before AI and dynamical errors are compared", "Process budgets (transition-phase budgets) before any change in passage is attributed to a mechanism"],
		publication: ["Training-period overlap audited (independence register)", "Results stable across predeclared thresholds and across reference products"],
		mvo: "A matched-event passage table for one dynamical and one AI system over one boreal-winter period, index- and precipitation-based, with threshold sensitivity and event-block uncertainty.",
		uncertainties: ["Few events per stratum", "AI outputs limited to index components", "Reference products over the Maritime Continent depend on assimilated data", "Definition sensitivity may exceed system differences"],
		decisions: {
			continue: "A passage difference exceeds event-block uncertainty under all predeclared thresholds and persists in precipitation: proceed to Stage 2.",
			revise: "Differences appear only in index-based metrics, or only under some thresholds or references: revise definitions or add a reference before Stage 2.",
			stop: "No difference beyond uncertainty with adequate samples, or the needed outputs are unavailable for every AI system: report the null or feasibility result and do not proceed to Stage 3.",
		},
		plan: {
			d30: ["Event-definition protocol and threshold ranges", "Observed passage catalogue (draft)", "Inventory of systems, outputs, training cutoffs and terms; choose the common period"],
			d60: ["Stage 1 metrics for the minimum viable output", "Training-overlap audit for the chosen period"],
			d90: ["Continue, revise or stop at the 90-day review", "If continuing: specify the Stage 2 diagnostics and the outputs they need"],
		},
	},
	"pilot-b": {
		definitionCheck: "Before any quantitative comparison, verify for each index both its published scientific definition and the operational implementation actually retrieved: input fields, EOF basis and the climatology it was trained on, filtering, normalization, phase convention, whether it uses only data available at issue time, and the provider's version.",
		realtime: "Keep diagnostics that use only data available at issue time (RMM and ROMI are designed for this) separate from retrospective ones whose filtering uses later data (OMI is one), as described in their documentation and re-verified against the retrieved products. Compare the two classes only to measure endpoint effects, never to validate one with the other.",
		documentation: [
			{ title: "Temporal filtering", text: "Filter type, band and window, and how each product treats the latest days." },
			{ title: "Phase conventions", text: "Phase definitions and any sign or rotation needed to align OMI-type and RMM-type phases; check whether a supplied product is already aligned." },
			{ title: "Training climatology", text: "Base period of the EOFs and of the seasonal cycle removed." },
			{ title: "Endpoint effects", text: "How much the last weeks of a series change when later data arrive." },
			{ title: "Event definitions", text: "Amplitude thresholds, durations and object-tracking settings, predeclared and varied." },
			{ title: "Regional and seasonal sensitivity", text: "Results stratified by season, including boreal summer, and checked against regional rainfall and convection." },
			{ title: "Source datasets", text: "OLR, wind and precipitation products and versions behind each series." },
		],
		independence: "Pilot B needs nothing from the other pilots and can start immediately in full. Its catalogue later serves Pilot A (index-based versus precipitation-based passage) and the trend audit.",
		startable: ["Definition and implementation check for each index", "Version freeze with checksums and retrieval dates", "Phase-convention crosswalk and tolerances", "Daily agreement statistics over a common period"],
		interpretation: ["Predeclared tolerances and thresholds, so that disagreement classes are not chosen after inspection"],
		publication: ["A version manifest and reproduction with an alternative product version", "Full-field composites showing that disagreement classes differ beyond resampling uncertainty"],
		mvo: "Daily phase and amplitude agreement between RMM and ROMI over one common period, by season, with a list of disagreement cases.",
		uncertainties: ["Silent version changes in published products", "Licensing limits on redistribution", "Circularity when event definitions use one of the compared indices"],
		decisions: {
			continue: "Disagreement is concentrated in identifiable conditions beyond resampling uncertainty: composite full fields and add object-based events.",
			revise: "Disagreement is sensitive mainly to tolerance or convention choices: fix the crosswalk and tolerances before interpreting.",
			stop: "Indices agree within tolerance under all conditions examined: publish the agreement table as a negative result.",
		},
		plan: {
			d30: ["Definition and implementation check", "Version freeze and crosswalk"],
			d60: ["Agreement statistics and disagreement cases by season and region"],
			d90: ["Continue, revise or stop at the 90-day review", "If continuing: full-field composites and the real-time versus retrospective comparison"],
		},
	},
	"pilot-c": {
		steps: [
			{ id: "inventory", title: "1 · Inventory of available data", text: "Datasets, variables, cadence, custodians, access routes and usage terms." },
			{ id: "quality", title: "2 · Quality and provenance", text: "Accuracy, known biases, quality flags, processing needs and version history." },
			{ id: "independence", title: "3 · Independence from assimilation and AI training", text: "A lineage flag for each dataset and period." },
			{ id: "gaps", title: "4 · Question-specific information gaps", text: "For each chosen process target, which variables, resolutions and durations existing data do not cover." },
			{ id: "requirements", title: "5 · Evaluation of additional observation requirements", text: "Subsampling and controlled-noise experiments that test whether coverage or precision limits the chosen diagnostic." },
		],
		parallel: "The inventory does not have to be complete before process analyses begin. Steps 1–3 can be done first for a minimum dataset per target, and analyses with that dataset can run while the inventory grows. Only claims of independent validation wait for step 3.",
		minimumDatasets: [
			{ target: "Q03 transition-phase moisture budget", data: "Quality-controlled soundings and surface fluxes from one completed field campaign (for example DYNAMO) and one long-term site (for example Manus), with their reanalysis-assimilation status recorded." },
			{ target: "Maritime Continent diurnal convection (Pilot A, Stage 2)", data: "One satellite precipitation product and one independent radar or rain-gauge dataset with documented processing." },
		],
		startable: ["Choose two or three process targets", "Inventory, quality and lineage for the minimum datasets", "Requirement-matrix template"],
		interpretation: ["Lineage flags for any dataset used to judge a reanalysis or an AI system"],
		publication: ["Subsampling results checked against a reference whose own limitations are reported", "No generic claim that more sensors or more precision is always better"],
		mvo: "For one process target: a requirement matrix and the minimum dataset with quality and lineage flags.",
		uncertainties: ["Access restrictions and incomplete metadata", "Legacy-data processing effort", "Subsampling inherits reference error"],
		decisions: {
			continue: "The minimum dataset supports the chosen diagnostic and at least one gap is identifiable: run the requirement experiments for that target.",
			revise: "Lineage or access is unknown for most candidate data: change the target or the minimum dataset.",
			stop: "Existing data already constrain the target within its stated uncertainty: report that no additional requirement is supported.",
		},
		plan: {
			d30: ["Select targets; minimum dataset per target", "Steps 1–3 for the minimum datasets"],
			d60: ["Requirement matrix and gap map for one target", "Start the analysis with the minimum dataset"],
			d90: ["Continue, revise or stop at the 90-day review", "If continuing: subsampling and noise experiments for one target"],
		},
	},
};

export const PILOT_STAGE_NOTE = "Phase 10 draft awaiting the author's review. Startable activities need only the data named in them; interpretation and publication prerequisites do not prevent work from starting. The 90-day review is a planning checkpoint, not a promised date, and no one has been asked or assigned.";
