// Phase 9B — revised Workshop Synthesis (2026-11-04). Draft awaiting the
// author's review. Every statement lists the claims it rests on; Phase 8
// wording is kept in `previous` for side-by-side review.

export const OVERARCHING_QUESTION = "What prevents the community from turning increasingly realistic MJO representations into reliable physical understanding and useful regional prediction?";

export const EXECUTIVE_SYNTHESIS_V2 = {
	text: "Read across the records, the workshop's contributions can be connected by one question: what prevents increasingly realistic representations of the MJO from becoming reliable physical understanding and useful regional prediction? The records point to gaps at each link rather than to a single obstacle. Field observations document progressive moistening and boundary-layer processes, but at few sites, and reanalysis comparisons are not independent of the soundings assimilated into them. Theory offers several mechanisms that reproduce similar large-scale signals without an agreed test to discriminate among them, and lifecycle transitions such as initiation and termination lack operational definitions. Dynamical and AI forecast systems can reach competitive index skill, yet weakening over the Maritime Continent and the representation of organized convection remain poorly constrained, and index skill alone does not show which processes are right. In applications, similar MJO skill can coexist with different regional skill, because heating location, propagation speed, background flow, ENSO and local exposure intervene before a forecast informs a decision. These connections are the author's reading across separate talks and discussions, not a framework the workshop adopted; the strands were discussed largely in different sessions, and several were recorded only in part.",
	basis: ["q03-c03", "q03-c09", "q01-c01", "q01-c07", "q02-c08", "q08-c01", "q09-c01", "q09-c08", "p9-q05-r01", "q11-c01", "q11-c04", "p9-q11-r01"],
	previous: "p8:exec",
};

/**
 * Evidence strength is a qualitative description of the records behind an
 * insight; it is not a measure of agreement among participants.
 */
export const EVIDENCE_STRENGTH = {
	several_independent: "Several independent talks and discussion groups",
	limited_independent: "A few independent contributions, partly overlapping",
	single_group: "Mainly one discussion group or one talk",
};

export const INSIGHTS_V2 = [
	{
		id: "insight-1",
		aliases: ["insight-2"],
		title: "No single MJO theory is agreed, and reproducing MJO structure does not by itself identify a mechanism",
		text: "The theory keynote reviewed mechanisms that can produce similar large-scale signals while differing in circulation structure and parameter dependence. The closing record kept three views side by side—a unified account, theoretical pluralism, and making each theory's predictions and assumptions testable—without choosing among them. The sharpest recorded dispute was methodological: whether diagnostics that separate better- from worse-performing models identify a mechanism, or whether process interventions and observational tests of a theory's assumptions are needed first. The recurring direction is testability, not a winning theory.",
		type: "editorial_synthesis",
		basis: ["q01-c01", "q01-c03", "q01-c02", "q01-c07", "q01-c08"],
		issues: ["q01"],
		themes: [3, 4],
		previous: ["insight-1", "insight-2"],
		change: "merged",
		reason: "Both Phase 8 insights rested on Q01 and largely the same records. The first title foregrounded one of three views recorded side by side in the closing discussion.",
		strength: "limited_independent",
	},
	{
		id: "insight-3",
		aliases: [],
		title: "Initiation, propagation and termination need operational definitions",
		text: "The theory discussion found no shared conceptual account or operational definition of initiation: how synoptic disturbances, organized convection and the growth of an MJO envelope combine remains unclear, and real onset may be finite-amplitude and stochastic rather than infinitesimal growth. A breakout asked for objective criteria to tell weakening, stalled propagation and termination apart, and the closing record listed initiation and Maritime Continent weakening among aspects existing theories do not explain. No accepted criterion was established.",
		type: "editorial_synthesis",
		basis: ["q02-c01", "q02-c06", "q02-c02", "q02-c08", "p9-q02-r01"],
		issues: ["q02"],
		themes: [3],
		previous: ["insight-3"],
		change: "revised",
		reason: "The breakout asked for criteria to distinguish weakening, stalling and termination; Phase 8 wording said it distinguished them.",
		strength: "limited_independent",
	},
	{
		id: "insight-multiscale",
		aliases: [],
		title: "Several contributions treat the MJO as part of multiscale interactions rather than as an isolated mode",
		text: "The theory keynote cautioned that isolating the MJO as a single large-scale mode can miss its interactions with convectively coupled waves and mesoscale systems, and the Global Data & Global Patterns keynote argued for treating the chain from mesoscale convective systems to the MJO, westerly wind bursts and El Niño as one continuum. Case studies reported propagation regimes influenced by synoptic moist waves and extratropical intrusions, and excessive easterly-wave activity in a forecast model with a biased moisture environment. The final-day discussion proposed multiscale, multi-phenomenon diagnostics. This is a shared framing and a research proposal, not a demonstrated mechanism; the case evidence comes from single events or single models.",
		type: "editorial_synthesis",
		basis: ["p9-q02-r02", "p9-q05-r01", "q02-c03", "q02-c05", "q11-c03", "p9-q11-r06"],
		issues: ["q02", "q05", "q11"],
		themes: [1, 3, 6],
		previous: [],
		change: "new",
		reason: "The Themes 1+2 keynote was absent from the synthesis, and a framing that recurs in two keynotes, several case studies and the final-day discussion had no insight of its own.",
		strength: "limited_independent",
	},
	{
		id: "insight-4",
		aliases: [],
		title: "Maritime Continent errors persist, and higher resolution alone has not been shown to remove them",
		text: "The prediction keynote reported that MJO events reaching the Maritime Continent weaken or fail to pass in several subseasonal forecast systems, with dry bias, premature weak rainfall, land–sea interactions, topography and the diurnal cycle as candidate causes that were not ranked. The modeling keynote found little support for the expectation that higher horizontal resolution alone improves the MJO, a high-resolution model comparison found mixed effects with propagation biases remaining, and the opening session recommended testing individual deficiencies rather than relying on resolution. Whether AI forecasts show a comparable barrier was left as an empirical question.",
		type: "workshop_record",
		basis: ["q09-c01", "q09-c05", "q09-c07", "q09-c02", "p9-q09-r02", "q09-c03", "q09-c08"],
		issues: ["q09"],
		themes: [4, 5],
		previous: ["insight-4"],
		change: "revised",
		reason: "Adds the modeling keynote and the opening session, so that modeling lessons are represented.",
		strength: "several_independent",
	},
	{
		id: "insight-5",
		aliases: [],
		title: "Forecast skill, physical understanding and practical use call for different kinds of validation",
		text: "The closing record named whether improvements in forecast skill also represent improvements in physical understanding as a central question, and treated the two as related but distinct goals. Final-day reports distinguished operational, scientific and model-development uses of AI, and recorded a clear disagreement over whether rigorously validated AI can be trusted without understanding why it succeeds, particularly for extrapolation and extremes. In this reading the objectives are complementary but the evaluation standard is genuinely disputed; neither forecast skill nor feature importance was accepted as evidence of a mechanism.",
		type: "editorial_synthesis",
		basis: ["p9-q07-r02", "p9-q07-r01", "q07-c01", "q07-c05", "q07-c03", "q07-c07"],
		issues: ["q07", "q08"],
		themes: [5],
		previous: ["insight-5"],
		change: "revised",
		reason: "Aligned with the Q07 reassessment: complementary objectives and a disputed evaluation standard are stated separately.",
		strength: "limited_independent",
	},
	{
		id: "insight-6",
		aliases: [],
		title: "Indices and diagnostics describe complementary aspects of MJO behaviour",
		text: "The closing record kept RMM as a useful common language and recommended supplementing rather than abolishing it. Precipitation-event and object-based analyses reported properties that RMM does not capture in the same way, and the prediction keynote separated circulation-weighted index skill from convection skill. Which supplementary descriptors add value for a specified process or impact target was not settled, and no new index or metric suite was adopted.",
		type: "editorial_synthesis",
		basis: ["q06-c03", "q06-c01", "q06-c02", "q06-c07", "q06-c08"],
		issues: ["q06"],
		themes: [1, 5],
		previous: ["insight-6"],
		change: "retained",
		reason: "Minor wording only.",
		strength: "several_independent",
	},
	{
		id: "insight-regional",
		aliases: [],
		title: "Improved MJO prediction does not automatically translate into improved regional forecast value",
		text: "The applications keynote noted that gains in MJO index skill need not raise regional impact skill by the same amount, and that MJO-conditioned skill is clearer for tropical rainfall than in the extratropics, where results vary by region, season, metric and study. A case study found very different week-2 extratropical skill among ensembles with similar MJO pattern correlations, and the opening session reported that mid-latitude responses following the MJO remain weaker than observed in recent reforecasts, while recalling a period when better MJO simulation did improve related teleconnection forecasts. Final-day reports traced remote-response errors to heating location, propagation speed and background flow, stressed conditioning on ENSO and season, and stated that better scores are not the same as societal value. No demonstrated decision benefit is recorded.",
		type: "editorial_synthesis",
		basis: ["p9-q11-r01", "q11-c01", "p9-q11-r02", "q11-c04", "q11-c02", "p9-q11-r04", "q11-c08"],
		issues: ["q11", "q12"],
		themes: [5, 6],
		previous: [],
		change: "new",
		reason: "Supported by the applications keynote, an independent case study, the opening session, regional talks and final-day group reports; Theme 6 had no headline insight before Phase 9.",
		strength: "several_independent",
	},
	{
		id: "insight-7",
		aliases: [],
		title: "Observational priorities should follow from specific scientific uncertainties, with independent validation data",
		text: "Observers asked theoreticians to specify variables, perturbation scales, sampling intervals and duration before new measurements are designed, and plenary and closing records proposed first cataloguing and reusing existing datasets, some of which remain underused because they are unprocessed. Final-day and observation discussions stressed that reanalysis is not independent observational truth and that AI trained on it may inherit its errors, so independent in situ data are needed for verification. The trade-off between sparse high-precision and denser lower-cost observations, and the priority among core-MJO, remote-impact and process-study observing, remained unresolved.",
		type: "workshop_record",
		basis: ["q10-c02", "q10-c03", "p9-q10-r01", "q10-c04", "q10-c01"],
		issues: ["q10"],
		themes: [2],
		previous: ["insight-7"],
		change: "revised",
		reason: "Adds independence of validation data, which recurs across observation, final-day and AI records.",
		strength: "several_independent",
	},
];

/**
 * Four levels between an MJO forecast and a decision (Phase 9B step B3).
 * Each level states what the records show and what they do not.
 */
export const REGIONAL_VALUE_LEVELS = [
	{
		id: "index",
		level: 1,
		title: "Predictive accuracy of an MJO index",
		meaning: "How well a forecast reproduces the observed index (for example RMM phase and amplitude) at a given lead time.",
		records: { text: "Reported competitive AI and dynamical index skill, with rankings sensitive to evaluation design; questioned deterministic headline thresholds such as an RMM correlation of 0.5.", basis: ["q08-c01", "p9-q11-r05"] },
		notShown: "Index accuracy says nothing directly about where convection and rainfall occur.",
	},
	{
		id: "response",
		level: 2,
		title: "Accuracy of the regional atmospheric response",
		meaning: "Whether the forecast places tropical heating, rainfall and the remote circulation response correctly in space and time.",
		records: { text: "Similar MJO pattern correlations with very different week-2 extratropical skill in a case study; reforecast mid-latitude responses weaker than observed; heating location, propagation speed and background-flow errors as distinct error sources.", basis: ["q11-c01", "p9-q11-r02", "q11-c04"] },
		notShown: "A correct large-scale response need not yield skill for a particular local hazard.",
	},
	{
		id: "hazard",
		level: 3,
		title: "Skill in predicting a specific hazard",
		meaning: "Skill for a defined event such as heavy rainfall, a dry spell, tropical-cyclone genesis or damaging waves, against a baseline.",
		records: { text: "Calls to beat simple climatological baselines; ENSO- and season-dependent regional responses; excessive easterly-wave activity in a biased model; MJO links to high-wave damage described as a potential contribution, not established causation.", basis: ["q11-c02", "q11-c03", "q11-c07"] },
		notShown: "No recorded study demonstrated incremental hazard skill after conditioning on season and ENSO.",
	},
	{
		id: "decision",
		level: 4,
		title: "Practical value for an identified decision",
		meaning: "Whether acting on the forecast improves outcomes for a specified user, given exposure, vulnerability and costs.",
		records: { text: "Examples of possible agricultural uses and windows of opportunity; statements that better scores are not societal value, that users need different variables and lead times, and that consequences depend on antecedent land and river conditions.", basis: ["q11-c05", "p9-q11-r04", "p9-q11-r05"] },
		notShown: "No realized decision benefit, user evaluation or cost–loss result is recorded. Societal benefit is not claimed here.",
	},
];

/** Phase 9B step B2 — qualitative reassessment of the seven Phase 8 insights. */
export const INSIGHT_ASSESSMENTS = [
	{ id: "insight-1", significance: "High: frames how mechanism claims are judged.", evidence: "Keynote and closing record; overlaps insight 2.", representativeness: "Foregrounds pluralism, one of three recorded views.", clarity: "Clear.", distinctiveness: "Low: shares records and question with insight 2.", relevance: "High.", decision: "Merged with insight 2." },
	{ id: "insight-2", significance: "High.", evidence: "Theory plenary and extended minutes (one discussion group).", representativeness: "Fair; dispute stated as a dispute.", clarity: "Clear.", distinctiveness: "Low with respect to insight 1.", relevance: "High for experiment design.", decision: "Merged into insight 1." },
	{ id: "insight-3", significance: "High: definitions precede comparisons.", evidence: "Theory discussion, breakout, object-based verification talk.", representativeness: "Fair.", clarity: "Overstated: \"distinguished\" where the record asked for criteria.", distinctiveness: "Distinct.", relevance: "High.", decision: "Revised." },
	{ id: "insight-4", significance: "High.", evidence: "Prediction keynote, model talks and final-day question.", representativeness: "Modeling keynote absent.", clarity: "Clear.", distinctiveness: "Distinct.", relevance: "High.", decision: "Revised to include modeling lessons." },
	{ id: "insight-5", significance: "High.", evidence: "Final-day and closing records (one contribution group) plus theory discussion.", representativeness: "Fair.", clarity: "Clear.", distinctiveness: "Overlaps the new regional insight only at the level of \"skill is not enough\".", relevance: "High.", decision: "Revised to match the Q07 reassessment." },
	{ id: "insight-6", significance: "Moderate to high.", evidence: "Several independent talks and the closing record.", representativeness: "Good.", clarity: "Clear.", distinctiveness: "Distinct.", relevance: "High for verification.", decision: "Retained." },
	{ id: "insight-7", significance: "High.", evidence: "Observation discussions and closing record.", representativeness: "Independence of validation data missing.", clarity: "Clear.", distinctiveness: "Distinct.", relevance: "High.", decision: "Revised." },
];

/** Contested-topic wording revised in Phase 9 (others are unchanged). */
export const CONTESTED_REVISIONS = {
	"contested-ai": {
		text: "Using validated AI as a practical tool and evaluating it for mechanisms pursue different objectives, and those objectives are complementary. The disagreement recorded in two separate discussion groups concerns the evaluation standard: when validated skill is enough to trust a system beyond its training conditions, and what kind of evidence makes an AI-derived explanation convincing. Whether observations suffice for end-to-end prediction, and whether common or AI-specific metrics should be used, remain open.",
		basis: ["q07-c07", "q07-c01", "p9-q07-r01", "q07-c06", "q08-c04"],
	},
};
