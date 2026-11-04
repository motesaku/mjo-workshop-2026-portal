// Phase 8 Workshop Synthesis page content (2026-11-04). Draft awaiting the
// author's review. Each statement lists the existing claims it rests on; the
// page derives evidence sources, related questions and clips from them.

export const SYNTHESIS_INTRO = {
	title: "Workshop Synthesis",
	subtitle: "What Did We Learn, and What Should We Investigate Next?",
	description: "A scientific overview of the 2026 MJO workshop for readers who want the main outcomes without viewing every highlight: insights, open disputes and possible next investigations, each linked to its evidence.",
};

export const EXECUTIVE_SYNTHESIS = {
	text: "In this reading of the workshop records, a recurring thread is the gap between describing the MJO and explaining it. Several theories can reproduce similar large-scale signals; forecast systems, including AI, can show competitive index skill; and compact indices summarize MJO behaviour well enough to serve as a common language. In each case the records separate that descriptive success from evidence about mechanisms, regional value or future change. The open problems are therefore methodological as much as physical: defining lifecycle transitions, resolving moisture and energy budgets, explaining Maritime Continent errors, and designing comparisons and observations that can discriminate between explanations.",
	basis: ["q01-c01", "q01-c07", "e-hkim-43-48", "q06-c03", "q06-c07", "q07-c07", "q02-c08", "q03-c08", "q09-c08", "q10-c08"],
};

/** Section A — what did we learn? (seven insights, checked against the synthesis). */
export const INSIGHTS = [
	{
		id: "insight-1",
		title: "Different theories may explain different aspects of the MJO",
		text: "The theory keynote reviewed mechanisms that can produce similar large-scale signals while differing in circulation structure and parameter dependence. The closing record retained both the wish for a unified account and the view that distinct theories can explain different aspects of the phenomenon. Pluralism of this kind is not the same as accepting mutually inconsistent predictions.",
		type: "workshop_record",
		basis: ["q01-c01", "q01-c03", "q01-c06"],
		issues: ["q01"],
	},
	{
		id: "insight-2",
		title: "Reproducing MJO structure is not, by itself, evidence for a mechanism",
		text: "The theory plenary contrasted diagnostics that discriminate model performance with tests that manipulate the processes a theory requires. In this synthesis, a useful predictor of model performance does not by itself identify a necessary process, and an intervention in one model does not settle the mechanism in the atmosphere either. How much evidence suffices remained disputed—a difference in evaluation standards rather than a settled conclusion.",
		type: "editorial_synthesis",
		basis: ["q01-c02", "q01-c05", "q01-c07"],
		issues: ["q01"],
	},
	{
		id: "insight-3",
		title: "Initiation, propagation and termination need distinct definitions and diagnostics",
		text: "Records distinguished the formation of convection, the organization of clusters and the growth of an MJO envelope, and separately distinguished weakening, stalled propagation and termination. They repeatedly called for lifecycle definitions and event-dependent diagnostics, but did not establish an accepted initiation or termination criterion.",
		type: "editorial_synthesis",
		basis: ["q02-c01", "q02-c02", "q02-c08"],
		issues: ["q02"],
	},
	{
		id: "insight-4",
		title: "The Maritime Continent remains a central process and prediction challenge",
		text: "The prediction keynote reported excessive weakening or non-passage in several dynamical forecast systems and discussed dry bias, premature weak rain, land–sea interactions and the diurnal cycle as candidate causes. Higher resolution gave mixed results in the cases reported, and whether AI forecasts face a comparable barrier was left unanswered. The candidate causes have not been ranked.",
		type: "workshop_record",
		basis: ["q09-c01", "q09-c02", "q09-c03", "q09-c08"],
		issues: ["q09"],
	},
	{
		id: "insight-5",
		title: "Forecast skill and physical understanding call for different kinds of validation",
		text: "The final-day record contrasted using rigorously validated AI as a practical tool with the scientific responsibility to explain processes and failures. A possible bridge, in this reading, is to evaluate forecasts, physical interpretations and discovered relationships separately, each with its own evidence standard. This is not agreement that AI has discovered an MJO theory, and fair comparisons also require matched cases, information and scoring.",
		type: "editorial_synthesis",
		basis: ["q07-c01", "q07-c08", "q08-c07"],
		issues: ["q07", "q08"],
	},
	{
		id: "insight-6",
		title: "Indices and diagnostics describe complementary aspects of MJO behaviour",
		text: "The closing record kept RMM as a useful common language while discussing supplementary descriptors for structure and impacts. Precipitation-event and object-based analyses reported properties that RMM does not capture in the same way, and the prediction keynote separated circulation-weighted index skill from convection skill. The recurring direction was supplementation, not replacement: no new index or metric suite was adopted.",
		type: "editorial_synthesis",
		basis: ["q06-c03", "q06-c01", "q06-c02", "q06-c07", "q06-c08"],
		issues: ["q06"],
	},
	{
		id: "insight-7",
		title: "Observational priorities should follow from specific scientific uncertainties",
		text: "Observers asked theoreticians to specify variables, perturbation scales, sampling intervals and observing duration, and plenary and closing records proposed cataloguing existing datasets. The trade-off between sparse high-precision and denser lower-cost measurements remained unresolved and depends on the target.",
		type: "workshop_record",
		basis: ["q10-c02", "q10-c03", "q10-c01", "q10-c06"],
		issues: ["q10"],
	},
];

/** Section B — what remains contested or unresolved? */
export const CONTESTED_TOPICS = [
	{
		id: "contested-mechanisms",
		title: "Competing physical explanations",
		text: "Moistening ahead of deep convection, the stratospheric pathway for QBO–MJO coupling, and the causes of Maritime Continent errors each have more than one candidate explanation. These are genuine competing hypotheses, but the records present them as not mutually exclusive or not yet ranked rather than as settled disputes.",
		basis: ["q03-c06", "q05-c05", "q09-c08"],
		issues: ["q03", "q05", "q09"],
	},
	{
		id: "contested-evidence",
		title: "What counts as evidence for a mechanism",
		text: "The clearest recorded disagreement is methodological: whether diagnostics that separate better-performing models identify a mechanism, or whether explicit assumptions, falsifying observations and process interventions are required first.",
		basis: ["q01-c07", "q01-c04", "q01-c05"],
		issues: ["q01"],
	},
	{
		id: "contested-ai",
		title: "AI prediction and physical explanation",
		text: "Using validated AI as a practical tool and evaluating it for mechanisms largely pursue different objectives, so they are classed here as complementary. Narrower disputes remain over when validated skill can be trusted outside training conditions, whether observations suffice for end-to-end prediction, and whether common or AI-specific metrics should be used.",
		basis: ["q07-c07", "q07-c06", "q08-c04"],
		issues: ["q07", "q08"],
	},
	{
		id: "contested-observations",
		title: "Observation requirements",
		text: "Whether to favour precision or coverage is a target-dependent trade-off rather than a disagreement about which strategy is superior. The relative priority of core-MJO, remote-impact and intensive-process observing remained unresolved.",
		basis: ["q10-c07", "q10-c03"],
		issues: ["q10"],
	},
	{
		id: "contested-diagnostics",
		title: "Index and diagnostic limitations",
		text: "Different diagnostics answer different questions, so differing results are not automatically contradictory. Event definitions, thresholds, short records and the information available at forecast time can all change apparent skill, lifecycle timing or trends.",
		basis: ["q06-c07", "q06-c09", "q02-c09"],
		issues: ["q06", "q02"],
	},
	{
		id: "contested-impacts",
		title: "Prediction barriers, regional impacts and climate change",
		text: "Similar index skill need not imply similar regional value, and agreement on a projected sign does not establish robustness when present-day mechanisms are biased. The regional contributions are complementary; differences among trend and projection results mostly concern different quantities.",
		basis: ["q11-c06", "q11-c07", "q12-c05", "q12-c07"],
		issues: ["q09", "q11", "q12"],
	},
];
