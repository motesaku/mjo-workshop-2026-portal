// Phase 8 editorial layer — clips, question significance, action cross-links.
// Every entry names the existing claims it condenses (`basis`). Wording is a
// Phase 8 draft awaiting the author's review (see status.mjs).

/**
 * One-sentence key messages for clips whose talk or session minutes are cited
 * by the personal synthesis. They condense the cited workshop-record claims;
 * they were NOT checked against the one-minute clip. Clips without an entry
 * show a pending status instead of a summary.
 */
export const VIDEO_KEY_MESSAGES = {
	"kunio-yoneyama-field-data-tropical-variability": {
		text: "Reviewed field observations of progressive moistening and of the transition from shallow to deeper convection.",
		basis: ["q03-c03"],
	},
	"jiawei-bao-tropics-wide-intraseasonal-oscillation": {
		text: "Reported tropical-mean temperature variability even when the RMM index indicated an inactive MJO, larger when the MJO was active, and proposed surface-flux, convection and circulation feedbacks as a candidate rather than an identified cause.",
		basis: ["q04-c01", "q04-c02", "q04-c04"],
	},
	"naoko-sakaeda-global-atmospheric-energy-cycle": {
		text: "Reported MJO-associated interhemispheric energy and mass variations linked to ITCZ/Hadley-circulation changes and cross-equatorial transport, with substantial uncertainty in the mass-transport term and no settled explanation of the timescale.",
		basis: ["q04-c03", "q04-c05"],
	},
	"shuyi-chen-increasing-trend-mjo-precipitation": {
		text: "Reported increasing MJO precipitation-event measures that RMM does not show in the same way, with data-period and data-quality sensitivity still to be checked.",
		basis: ["q06-c01", "q12-c01"],
	},
	"qoosaku-moteki-cens-mjo": {
		text: "The question-and-answer record left the proposed feedback of cross-equatorial northerly surges onto the MJO, and the associated pressure-system dynamics, untested.",
		basis: ["q11-c03"],
	},
	"boualem-khouider-theory-modelling": {
		text: "Reviewed theories that can produce similar large-scale MJO signals while differing in circulation structure and parameter dependence.",
		basis: ["q01-c01"],
	},
	"daehyun-kim-modeling": {
		text: "Treated higher horizontal resolution as a possible intervention for model errors rather than an established remedy, with process and mean-state limitations retained.",
		basis: ["q09-c07"],
	},
	"jonathan-lin-stratospheric-interactions": {
		text: "Reported wind-dependent vertical structure in a simplified coupled troposphere–stratosphere model, together with observational composites and an ice-cloud radiative-feedback hypothesis in which stratospheric winds affect MJO growth in that model.",
		basis: ["q05-c01", "q05-c03"],
	},
	"daisuke-takasuka-deterministic-chaotic": {
		text: "Reported distinct MJO propagation regimes in two ensemble case studies, with the branching between regimes sensitive to prescribed sea-surface temperature conditions.",
		basis: ["q02-c03", "q02-c05", "q09-c06"],
	},
	"bernardo-maraldi-ifs-nemo": {
		text: "Reported mixed effects of higher resolution in IFS-NEMO—some circulation measures improved while activity and convective-propagation biases remained—and discrepancies between modelled and reanalysed long-term behaviour.",
		basis: ["q09-c02", "q12-c02"],
	},
	"satoru-yokoi-boundary-layer": {
		text: "Estimated distinct downdraft and entrainment contributions to energy loss in the marine atmospheric boundary layer.",
		basis: ["q03-c03"],
	},
	"ray-pallav-kumar-temperature-mse": {
		text: "Reported appreciable free-tropospheric temperature contributions to moist static energy during suppressed-to-active transitions at Manus, with seasonal dependence; exact percentages are withheld pending review of their denominator.",
		basis: ["q03-c02"],
	},
	"breakout-themes-3-4": {
		text: "The breakout record distinguished weakening, stalled propagation and termination of MJO events, and separated variable importance from causation, proposing equation discovery that starts with systems whose equations are already known.",
		basis: ["q02-c02", "q07-c03"],
	},
	"plenary-themes-1-2": {
		text: "The observations plenary contrasted sparse high-precision measurements with more numerous lower-cost ones and proposed cataloguing existing datasets; the relative priority of different observing needs remained unresolved.",
		basis: ["q10-c01", "q10-c03"],
	},
	"plenary-themes-3-4": {
		text: "The theory plenary contrasted moisture-mode diagnostics that discriminate model performance with tests that manipulate the processes a theory requires, and debated information-based understanding, physics constraints and whether observations alone contain enough information for end-to-end prediction.",
		basis: ["q01-c02", "q07-c02"],
	},
	"hyemi-kim-prediction": {
		text: "Separated circulation-weighted index skill from convection skill, warned that model rankings depend on test period, season, climatology and ensemble design, and reported excessive weakening or non-passage over the Maritime Continent in several dynamical systems.",
		basis: ["q06-c02", "q08-c01", "q09-c01"],
	},
	"hyemi-kim-prediction-alternate": {
		text: "Alternate cut of the prediction keynote: separated circulation-weighted index skill from convection skill, warned that model rankings depend on evaluation design, and reported excessive Maritime Continent weakening in several dynamical systems.",
		basis: ["q06-c02", "q08-c01", "q09-c01"],
	},
	"andrew-robertson-applications": {
		text: "Emphasized conditional windows of opportunity and the decision context in which MJO forecast information is used.",
		basis: ["q11-c02", "q11-c05"],
	},
	"matthew-janiga-object-based": {
		text: "Separated location skill from activity skill in object-based MJO verification and found event-type-dependent performance; distinguished the appearance of a convective envelope from the state of an existing wave group.",
		basis: ["q02-c04", "q06-c02", "q06-c06"],
	},
	"matteo-siena-hectometric-icon": {
		text: "Reported that finer resolution helped some ensemble members in an Italian convective rainfall case without removing ensemble differences—a methodological illustration rather than direct MJO evidence.",
		basis: ["q09-c04"],
	},
	"stephanie-rushley-north-pacific-cyclones": {
		text: "Reported different extratropical cyclone skill among forecasts with similar MJO correlations, distinguishing humidity errors from displacement in space and time.",
		basis: ["q11-c01", "q11-c06"],
	},
	"yan-liu-shallow-convection": {
		text: "Reported wave–convection interactions in a cloud-resolving case (programme topic: shallow convection and the slow eastward propagation of super cloud clusters).",
		basis: ["q02-c03"],
	},
	"bibian-ekot-west-africa": {
		text: "Called for MJO-based regional forecasts to be compared with simple climatological baselines.",
		basis: ["q11-c02"],
	},
	"luana-scheibe-enso-south-america": {
		text: "Reported ENSO-dependent regional responses to the MJO (programme topic: South America in the transition seasons).",
		basis: ["q11-c02"],
	},
	"hera-kim-predictability-limit": {
		text: "Distinguished observation-verified forecast skill from predictability estimated with an ensemble member as truth, noting that control and perturbed members have unequal error properties.",
		basis: ["q08-c03"],
	},
	"simon-peatman-sumatra-squalls": {
		text: "Reported a projected decrease in Sumatra-squall frequency shared across models, while cautioning that present-climate process relationships were inconsistent among them.",
		basis: ["q12-c03", "q12-c05"],
	},
	"yu-cian-tsai-easterly-waves": {
		text: "Reported excessive wave activity in a model with a biased background environment (programme topic: MJO modulation of East Pacific easterly waves and tropical cyclone genesis).",
		basis: ["q11-c03"],
	},
	"kenedy-silverio-southern-africa": {
		text: "Reported ENSO-dependent regional responses to the MJO (programme topic: southern African summer rainfall).",
		basis: ["q11-c02"],
	},
};

/** Why each scientific question matters. Editorial framing, not a workshop statement. */
export const ISSUE_SIGNIFICANCE = {
	q01: {
		text: "Mechanism claims guide how models are developed and which observations are collected. If reproducing MJO structure is mistaken for identifying a mechanism, model improvements cannot be attributed to the right physics.",
		basis: ["q01-c07"],
	},
	q02: {
		text: "Mechanisms and forecast skill for initiation and termination can only be compared once it is clear which transition is meant. Inconsistent definitions can make studies appear to disagree when they measure different events.",
		basis: ["q02-c01", "q02-c08"],
	},
	q03: {
		text: "The pathway that moistens the atmosphere ahead of deep convection determines which processes models must represent to propagate the MJO, and which measurements could test them.",
		basis: ["q03-c06", "q03-c08"],
	},
	q04: {
		text: "If tropical-mean and interhemispheric energy variations are coupled to the MJO, intraseasonal variability has global energy-budget expressions that index-based definitions may not capture; RMM inactivity is not the absence of all MJO-related variability.",
		basis: ["q04-c06"],
	},
	q05: {
		text: "Reported QBO-related differences in MJO activity and skill, with model-dependent significance, raise the question of a stratospheric pathway. Identifying it would show which vertical-structure and cloud processes models need to represent.",
		basis: ["q05-c02", "q05-c05"],
	},
	q06: {
		text: "The choice of index decides what counts as an MJO event, a forecast hit or a trend. A diagnostic that misses convective or regional structure can misstate both model skill and impacts.",
		basis: ["q06-c07", "q06-c08"],
	},
	q07: {
		text: "Studies discussed in the prediction minutes report competitive index skill for some AI systems. Whether that skill can inform physical understanding determines how such systems can be used in research as well as in prediction.",
		basis: ["e-hkim-43-48", "q07-c07"],
	},
	q08: {
		text: "Claims that an AI, hybrid or dynamical system has improved are only meaningful if comparisons use matched samples, information and scoring, and if skill and predictability estimates refer to the same target.",
		basis: ["q08-c07", "q08-c10"],
	},
	q09: {
		text: "Several forecast systems were reported to weaken or stall the MJO over the Maritime Continent. Diagnosing why is central to extending useful prediction across the Indo-Pacific.",
		basis: ["q09-c01", "q09-c08"],
	},
	q10: {
		text: "Observing resources are limited. Whether new data can discriminate between mechanisms or verify forecasts independently depends on linking each measurement to a specific scientific uncertainty.",
		basis: ["q10-c02", "q10-c08"],
	},
	q11: {
		text: "Regional users benefit from MJO forecasts only when index skill translates into information about local outcomes; similar index skill need not imply similar regional value.",
		basis: ["q11-c06", "q11-c07"],
	},
	q12: {
		text: "Projected changes in the MJO and its regional impacts are credible only if models represent present-day mechanisms; agreement on a projected sign is not enough when those mechanisms are biased.",
		basis: ["q12-c05", "q12-c07"],
	},
};

/**
 * Editorial cross-links from an illustrative action to a second question it
 * also informs. Each carries a rationale and the claim it rests on.
 */
export const ACTION_CROSS_LINKS = [
	{ actionId: "action-q03", issueId: "q01", rationale: "Phase-resolved budgets are one of the observables Q01 asks for to discriminate between mechanism claims.", basis: ["q01-c09", "q03-c14"] },
	{ actionId: "action-q02", issueId: "q09", rationale: "Q09 asks when stalling is an event-definition issue; explicit lifecycle labels separate stalling from termination.", basis: ["q09-c10", "q02-c02"] },
	{ actionId: "action-q08", issueId: "q07", rationale: "A matched, versioned benchmark is the validation step on which Q07's practical-use position depends.", basis: ["q07-c04", "q07-c07"] },
	{ actionId: "action-q09", issueId: "q07", rationale: "Q09 asks whether AI and dynamical models fail through the same pathways; its error decomposition compares them on matched cases.", basis: ["q09-c16"] },
	{ actionId: "action-q06", issueId: "q08", rationale: "Comparing diagnostics on matched cases and information sets is part of a fair forecast comparison.", basis: ["q06-c11", "q08-c06"] },
	{ actionId: "action-q06", issueId: "q11", rationale: "The diagnostic audit judges added descriptors by prespecified regional or impact targets.", basis: ["q06-c15"] },
	{ actionId: "action-q10", issueId: "q03", rationale: "The independence register addresses Q03's limitation that reanalysis agreement with assimilated soundings is not independent confirmation.", basis: ["q03-c09", "q10-c14"] },
	{ actionId: "action-q12", issueId: "q06", rationale: "Q12's trend-definition crosswalk addresses the same precipitation-event versus RMM difference noted in Q06.", basis: ["q06-c01", "q12-c01"] },
];
