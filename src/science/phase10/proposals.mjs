// Phase 10 scientific proposals (2026-11-05). NOT RENDERED ON THE SITE.
//
// Every entry is a proposal for the author's review. The site keeps showing the
// Phase 9 wording until the author records a decision here. Decisions are never set
// automatically: `decision` stays null until the author fills in `decidedBy: "author"`
// and a date (tests/phase10-regression.test.mjs enforces this).
//
// Three review dimensions stay separate (B3):
//   minutes   — is the wording consistent with the cited converted, ASR-derived minutes?
//               (AI-assisted check; says nothing about the recordings or the speakers)
//   validity  — is the scientific interpretation defensible? (author's judgement)
//   approval  — may the wording be published? (author's editorial decision)

export const PHASE10_REVIEW = {
	id: "phase10-2026-11-05",
	status: "author_review_required",
	basedOn: "phase9-2026-11-04",
};

export const AUTHOR_DECISIONS = {
	approve: "Approve wording",
	approve_with_revisions: "Approve with revisions",
	verify_source: "Request further source verification",
	withhold: "Withhold from public synthesis",
	reject: "Reject proposed interpretation",
};

export const REVIEW_DIMENSIONS = {
	minutes: "Consistency with the cited converted minutes",
	validity: "Scientific interpretive validity",
	approval: "Editorial publication approval",
};

export const REVIEW_TIERS = {
	1: "Public-facing scientific conclusions (executive synthesis and the eight insights)",
	2: "Scientific interpretation (Q01, Q03, Q07, Q09, Q11 and the regional-value framework)",
	3: "Statements needing qualification or source correction",
	4: "Secondary editorial material (key messages, supplementary statements, workflow wording)",
};

/** Ways the minutes can support a statement (dimension `minutes`). */
export const RECORD_SUPPORT = {
	consistent: "Each sentence is consistent with its cited passages",
	consistent_framing_editorial: "Records are consistent; the connecting framing is editorial",
	partly: "Part of the statement is not in the cited passages",
};

/**
 * Research communities optimize different outcomes (Phase 10C step C5). Proposed for
 * the synthesis methodology section; an editorial framing, not a workshop record.
 */
export const RESEARCH_OBJECTIVES = [
	{ community: "Theory", optimizes: "Causal understanding and falsifiable predictions" },
	{ community: "Observations", optimizes: "Information content and constraints independent of models and reanalyses" },
	{ community: "Modeling", optimizes: "Realistic process representation and numerical reliability" },
	{ community: "Prediction", optimizes: "Calibrated skill and generalization beyond the evaluation sample" },
	{ community: "Applications", optimizes: "Regional reliability and decision value for specified users" },
];
export const RESEARCH_OBJECTIVES_NOTE = "These objectives interact, but none of them reduces to another and no single metric serves all of them. Disagreements recorded at the workshop often concern which of these outcomes a piece of evidence is meant to support.";

/** Tier 1 and Tier 2 proposals. `target` names the current public text. */
export const PROPOSALS = [
	{
		id: "p10-exec",
		tier: 1,
		target: { kind: "executive_synthesis" },
		proposed: {
			text: "Read across the records, the author connects the workshop's contributions through one editorial question: what prevents increasingly realistic representations of the MJO from becoming reliable physical understanding and useful regional prediction? The records point to gaps at several links rather than to a single obstacle. Field observations document progressive moistening and boundary-layer processes, but at few sites, and reanalysis comparisons are not independent of the soundings assimilated into them. Theory offers several mechanisms that reproduce similar large-scale signals without an agreed test to discriminate among them, and lifecycle transitions such as initiation and termination lack operational definitions. Dynamical and AI forecast systems can reach competitive index skill, yet weakening over the Maritime Continent and the representation of organized convection remain poorly constrained, and index skill alone does not show which processes are right. In applications, similar MJO skill can coexist with different regional skill, because heating location, propagation speed, background flow, ENSO and local exposure intervene before a forecast informs a decision. The communities involved legitimately optimize different outcomes—causal understanding in theory, independent constraints in observations, process realism in modeling, calibrated and generalizable skill in prediction, regional reliability and decision value in applications—so the links do not reduce to one metric. These connections are the author's reading across separate talks and discussions, not a framework the workshop adopted; the strands were discussed largely in different sessions, several were recorded only in part, and boreal-summer variability and ocean coupling are thinly represented in the available records.",
		},
		reason: "Keeps the Phase 9 content but (1) states that the connecting question is editorial in its first sentence rather than only at the end, (2) adds the different objectives of the research communities so that the single narrative does not erase legitimate differences among theory, observation, modeling, prediction and applications, and (3) names the coverage gaps that limit the reading.",
		evidence: ["q03-c03", "q03-c09", "q01-c01", "q01-c07", "q02-c08", "q08-c01", "q09-c01", "q09-c08", "p9-q05-r01", "q11-c01", "q11-c04", "p9-q11-r01", "p9-q02-r01"],
		support: "consistent_framing_editorial",
		uncertainty: "The community-objectives sentence is an editorial framing, not a record. Several strands rest on short compiled minutes without Q&A.",
		suggestedDecision: "approve_with_revisions",
		decision: null,
	},
	{
		id: "p10-insight-1",
		tier: 1,
		target: { kind: "insight", id: "insight-1" },
		proposed: {
			text: "The theory keynote reviewed mechanisms that can produce similar large-scale signals while differing in circulation structure and parameter dependence. The closing record kept three views side by side—a unified account, theoretical pluralism, and making each theory's predictions and assumptions testable—without choosing among them. Within the theory discussion group, the clearest recorded dispute was methodological: whether diagnostics that separate better- from worse-performing models identify a mechanism, or whether process interventions and observational tests of a theory's assumptions are needed first. Testability recurs as a methodological direction across these records; no theory was preferred.",
		},
		reason: "The \"sharpest recorded dispute\" rests on the theory plenary and its extended minutes, which document one session, plus the theory breakout. Saying so avoids implying a dispute recorded across the whole workshop. \"Not a winning theory\" is rephrased as a statement about the records.",
		evidence: ["q01-c01", "q01-c03", "q01-c02", "q01-c07", "q01-c08"],
		support: "consistent",
		uncertainty: "The extended theory minutes have an estimated date and a withheld clip mapping.",
		suggestedDecision: "approve_with_revisions",
		decision: null,
	},
	{
		id: "p10-insight-3",
		tier: 1,
		target: { kind: "insight", id: "insight-3" },
		proposed: {
			title: "Initiation and termination lack operational definitions, including how stalled propagation differs from decay",
			text: "The theory discussion found no shared conceptual account or operational definition of initiation: how synoptic disturbances, organized convection and the growth of an MJO envelope combine remains unclear, and real onset may be finite-amplitude and stochastic rather than infinitesimal growth. The theory keynote's speaker stated that none of the reviewed theories explains initiation. A breakout asked for objective criteria to tell weakening, stalled propagation and termination apart and raised the possibility that boreal-summer events redistribute into smaller-scale disturbances, and the closing record listed initiation and Maritime Continent weakening among aspects existing theories do not explain. No accepted criterion was established.",
		},
		reason: "The records ask for definitions of initiation and of the end of events (weakening, stalling, termination); they do not ask for a definition of propagation as such. The keynote Q&A answer on initiation strengthens the existing point, and the boreal-summer remark is in the cited breakout record.",
		evidence: ["q02-c01", "q02-c06", "q02-c02", "q02-c08", "p9-q02-r01"],
		support: "consistent",
		uncertainty: "Boreal-summer termination was raised by participants, not analysed.",
		suggestedDecision: "approve_with_revisions",
		decision: null,
	},
	{
		id: "p10-insight-multiscale",
		tier: 1,
		target: { kind: "insight", id: "insight-multiscale" },
		proposed: {
			basis: ["p9-q02-r02", "p9-q05-r01", "q02-c03", "q02-c05", "p9-q11-r06"],
			text: "The theory keynote cautioned that isolating the MJO as a single large-scale mode can miss its interactions with convectively coupled waves and mesoscale systems, and the Global Data & Global Patterns keynote argued for treating the chain from mesoscale convective systems to the MJO, westerly wind bursts and El Niño as one continuum. Case studies reported propagation regimes influenced by synoptic moist waves and extratropical intrusions, and excessive easterly-wave activity in one forecast model with a biased moisture environment. The final-day discussion proposed multiscale, multi-phenomenon diagnostics. This is a shared framing and a research proposal, not a demonstrated mechanism; the case evidence comes from single events or single models.",
		},
		reason: "The cited statement q11-c03 combines the Tsai record with the record of the site author's own talk. Only the Tsai record is used here, so citing q11-c03 brings in self-authored material without disclosure. Proposed: drop q11-c03 from the basis (the Tsai content remains a workshop record cited on Q11) or disclose it.",
		evidence: ["p9-q02-r02", "p9-q05-r01", "q02-c03", "q02-c05", "p9-q11-r06", "q11-c03"],
		support: "consistent_framing_editorial",
		uncertainty: "Two keynotes and one final-day contribution share the framing; supporting cases are single events or single models.",
		suggestedDecision: "approve_with_revisions",
		decision: null,
	},
	{
		id: "p10-insight-4",
		tier: 1,
		target: { kind: "insight", id: "insight-4" },
		proposed: null,
		reason: "Consistent with several independent contributions (prediction keynote, modeling keynote, a model comparison, opening session, final-day question). Optional precision: the high-resolution comparison covered partly different periods.",
		evidence: ["q09-c01", "q09-c05", "q09-c07", "q09-c02", "p9-q09-r02", "q09-c03", "q09-c08"],
		support: "consistent",
		uncertainty: "Candidate causes are not ranked; the reported non-passage ratio is withheld pending the original study.",
		suggestedDecision: "approve",
		decision: null,
	},
	{
		id: "p10-insight-5",
		tier: 1,
		target: { kind: "insight", id: "insight-5" },
		proposed: {
			text: "The closing record named whether improvements in forecast skill also represent improvements in physical understanding as a central question, and treated the two as related but distinct goals. A final-day report distinguished operational, scientific and model-development uses of AI with different requirements. Two discussion groups recorded an explicit and unsettled disagreement about the evaluation standard: whether rigorous out-of-sample validation is enough to rely on an AI system, particularly for unfamiliar climates and extremes, or whether scientific use also requires explaining what drives its forecasts and failures; and what evidence makes an AI-derived explanation convincing. A third recorded view separated understanding a network's internals from explaining why a particular forecast succeeded or failed. In this reading, conclusions depend on the intended use, the validated range and the claim being made: validated skill can support a bounded use within the conditions tested without a complete physical explanation, whereas claims of generalization or of a mechanism need evidence of another kind. Variable importance was not treated as evidence of causation.",
			basis: ["p9-q07-r02", "p9-q07-r01", "q07-c01", "q07-c05", "q07-c04", "q07-c07", "p9-q07-r03", "q07-c03"],
		},
		reason: "States the disagreement as a disagreement about evidence (not a difference of preference), keeps the three recorded positions distinct, and makes the editorial conclusion conditional on use, validation scope and claim, so that it neither implies that AI use requires a full physical explanation nor that skill implies a mechanism.",
		evidence: ["p9-q07-r02", "p9-q07-r01", "q07-c01", "q07-c05", "q07-c04", "q07-c07", "p9-q07-r03", "q07-c03"],
		support: "consistent_framing_editorial",
		uncertainty: "Final-day and closing records may overlap; the theory plenary, breakout and extended minutes are the second group. How much explanation scientific use requires remained disputed.",
		suggestedDecision: "approve_with_revisions",
		decision: null,
	},
	{
		id: "p10-insight-6",
		tier: 1,
		target: { kind: "insight", id: "insight-6" },
		proposed: null,
		reason: "Consistent with independent talks and the closing record. None of its basis statements depends on the disputed Chang Xu mapping.",
		evidence: ["q06-c03", "q06-c01", "q06-c02", "q06-c07", "q06-c08"],
		support: "consistent",
		uncertainty: "Which supplementary descriptors add value for which target was not settled.",
		suggestedDecision: "approve",
		decision: null,
	},
	{
		id: "p10-insight-regional",
		tier: 1,
		target: { kind: "insight", id: "insight-regional" },
		proposed: null,
		reason: "Consistent with the applications keynote, an independent case study, the opening session, regional talks and final-day reports. It already states that no decision benefit is recorded. The proposed transitions between value levels (REGIONAL_TRANSITIONS) belong to the four-level block, not to this text.",
		evidence: ["p9-q11-r01", "q11-c01", "p9-q11-r02", "q11-c04", "q11-c02", "p9-q11-r04", "q11-c08"],
		support: "consistent",
		uncertainty: "Several Theme 5–6 talks have short compiled minutes without Q&A; the Themes 5+6 breakout was not converted.",
		suggestedDecision: "approve",
		decision: null,
	},
	{
		id: "p10-insight-7",
		tier: 1,
		target: { kind: "insight", id: "insight-7" },
		proposed: null,
		reason: "Consistent with the observation discussions (including their conclusion to identify first what existing data can test), plenary and closing records, and the final-day warning about reanalysis-trained systems.",
		evidence: ["q10-c02", "q10-c03", "p9-q10-r01", "q10-c04", "q10-c01"],
		support: "consistent",
		uncertainty: "The observation extended minutes (src-obs) have an unresolved session mapping.",
		suggestedDecision: "approve",
		decision: null,
	},

	// Tier 2 — scientific interpretation.
	{
		id: "p10-q01",
		tier: 2,
		target: { kind: "question", id: "q01" },
		proposed: null,
		reason: "Different evaluation standards (primary) with competing mechanisms (secondary) is consistent with the records. Proposed note only: the methodological dispute is recorded within one discussion group; the closing record independently keeps unified, pluralistic and testability views side by side.",
		evidence: ["q01-c07", "q01-c01", "q01-c03"],
		support: "consistent",
		uncertainty: "The extended theory minutes have an estimated date.",
		suggestedDecision: "approve",
		decision: null,
	},
	{
		id: "p10-q03",
		tier: 2,
		target: { kind: "question", id: "q03" },
		proposed: { classification: "hybrid" },
		reason: "See Q03_PROPOSAL. The explicit contrast rests on one Q&A exchange labelled in the minutes as the discussant's view, while the observational and model contributions are consistent with several pathways. Presenting Q03 as a community-wide divergence overstates the record; presenting it only as an open question loses the one recorded, testable contrast.",
		evidence: ["q03-c01", "q03-c04", "q03-c05", "q03-c06", "q03-c07", "q03-c03", "q03-c02", "q03-c14"],
		support: "consistent_framing_editorial",
		uncertainty: "The budget notation is editorial and must match whatever conventions the author would use in a publication.",
		suggestedDecision: "approve_with_revisions",
		decision: null,
	},
	{
		id: "p10-q07",
		tier: 2,
		target: { kind: "question", id: "q07" },
		proposed: { layer2: "see Q07_PROPOSAL.layer2" },
		reason: "See Q07_PROPOSAL. Retains the three layers and the primary relationship (different evaluation standards); restates Layer 2 so that the recorded disagreement is neither softened nor turned into a requirement that AI use needs a complete physical explanation.",
		evidence: ["q07-c01", "q07-c04", "q07-c05", "q07-c07", "p9-q07-r03", "q07-c02", "q07-c03", "p9-q07-r04"],
		support: "consistent_framing_editorial",
		uncertainty: "Overlap between final-day and closing records; the extended theory minutes have a withheld clip mapping.",
		suggestedDecision: "approve_with_revisions",
		decision: null,
	},
	{
		id: "p10-q09",
		tier: 2,
		target: { kind: "question", id: "q09" },
		proposed: null,
		reason: "Open question with competing, non-exclusive candidate causes is consistent with the records. Two statements need wording action (q09-c03 in Tier 3; q09-c07 in Tier 4).",
		evidence: ["q09-c08", "q09-c05", "q09-c06"],
		support: "consistent",
		uncertainty: "Case-specific experiments; mixed resolutions and periods.",
		suggestedDecision: "approve",
		decision: null,
	},
	{
		id: "p10-q11",
		tier: 2,
		target: { kind: "question", id: "q11" },
		proposed: { transitions: "see REGIONAL_TRANSITIONS" },
		reason: "Keeps the four levels and adds where each link can fail, separating what the records show empirically from what follows conceptually. No user benefit is claimed.",
		evidence: ["q11-c01", "p9-q11-r02", "q06-c02", "p9-q11-r04", "q11-c02", "q11-c07", "q11-c09", "q11-c05"],
		support: "consistent_framing_editorial",
		uncertainty: "Empirical support for each failure point is one case study or a keynote statement; most links are conceptual.",
		suggestedDecision: "approve_with_revisions",
		decision: null,
	},
];

/** Q03 — classification options, budget notation and testable questions (Phase 10C step C2). */
export const Q03_PROPOSAL = {
	options: [
		{ id: "diverging", label: "Diverging Perspectives (current)", for: "One recorded exchange contrasts an advective moisture-mode reading with low-level convergence and shallow-convective moistening.", against: "That exchange is a single Q&A comment labelled as the discussant's view; no other contribution takes a side. The class implies a community-level divergence the records do not show." },
		{ id: "open", label: "Open Scientific Question", for: "Observational and model contributions are consistent with several pathways and none discriminated among them; the scientific question is about relative roles, ordering and necessity.", against: "Drops the one explicit, testable contrast in the records." },
		{ id: "hybrid", label: "Hybrid: open question with a narrowly defined recorded contrast (recommended)", for: "Primary class Open Questions; the recorded contrast is kept, attributed to one exchange, and the hypotheses are stated as testable and not mutually exclusive.", against: "Requires moving Q03 from the Diverging Perspectives page to Open Challenges, which changes a published classification." },
	],
	recommended: "hybrid",
	recordedContrast: "One comment in the prediction keynote's Q&A urged distinguishing a realistic mean state and pre-moistening from an advective moisture-mode explanation, emphasizing low-level convergence and shallow-convective moistening. The minutes label it the discussant's theoretical view. It is not a recorded community-wide dispute.",
	budgetNote: {
		notation: "q: specific humidity; v_h: horizontal wind on a pressure surface; ∇_h: horizontal gradient on that surface; ω: pressure velocity; ⟨·⟩: mass-weighted vertical integral over a stated layer; overbars and primes: a stated time filter or reference state and departures from it.",
		identity: "−∇_h·(q v_h) = −v_h·∇_h q − q ∇_h·v_h",
		decomposition: "The two terms on the right are an identity that splits one horizontal flux divergence; they are not two independent physical mechanisms. Their sizes depend on the reference state and filtering (total fields versus anomalies, with mean-state cross terms), and they can partly cancel. Statements such as \"advection dominates\" or \"convergence dominates\" are comparable only when the budget variable (q or moist static energy), the layer, the coordinate, the averaging (time filter, area, phase composite) and the treatment of residuals are fixed.",
		columnVersusLayer: "With mass continuity, ∇_h·v_h = −∂ω/∂p, so over a full column with ω ≈ 0 at the top and surface the convergence term ⟨q∇_h·v_h⟩ equals the column-integrated vertical advection ⟨ω ∂q/∂p⟩ by the resolved flow. Over a full column, unresolved vertical transport (boundary-layer turbulence and shallow convection) only moves moisture between levels, apart from the surface evaporation it carries upward; shallow convection therefore changes the column total only through evaporation and precipitation. In a layer budget (for example below 700 hPa, or 700–400 hPa), the same transport is an explicit source or sink at the layer boundaries. Column-integrated and layer-resolved budgets can therefore assign the same moistening to different terms.",
		shallowConvection: "Shallow convection moves moisture upward out of the boundary layer and can moisten the lower free troposphere ahead of deep convection. It can thereby reduce the dilution of later deep convection by entrainment, alter when precipitation begins, and through the resulting heating alter the large-scale circulation and the convergence that feeds it. These are couplings, not alternatives: evidence for one pathway does not exclude the others unless an analysis shows that they cannot operate together.",
		temperature: "In moist static energy h = c_pT + gz + Lq, weak tropical temperature gradients often justify h′ ≈ Lq′. A reported appreciable free-tropospheric temperature contribution during transitions at one site is a question about the scope of that approximation, not a refutation of moisture-based frameworks.",
	},
	testableQuestions: [
		{ id: "relative", title: "Relative contributions", text: "Within a fixed budget convention, what fraction of the lower- and mid-tropospheric moistening before deep-convection onset is carried by the horizontal advection term, the convergence (or resolved vertical advection) term and unresolved vertical transport, with closure residuals stated?" },
		{ id: "ordering", title: "Temporal ordering", text: "Which terms lead and which lag the onset of deep convection east of the active phase, and does the ordering hold across events?" },
		{ id: "structure", title: "Spatial and vertical structure", text: "Where in height does moistening first appear (boundary layer, below 700 hPa, mid-troposphere), and does the answer differ between the Indian Ocean, the Maritime Continent and the western Pacific?" },
		{ id: "necessity", title: "Necessity versus correlation", text: "Does suppressing anomalous horizontal advection, or shallow-convective vertical transport, in controlled experiments slow or stop propagation, once the induced change in the mean state is diagnosed?" },
		{ id: "sensitivity", title: "Sensitivity to mean state, season and MJO phase", text: "Do the relative contributions change with the background moisture gradient, the season (boreal winter versus summer) and the MJO phase or amplitude?" },
	],
};

/** Q07 — refined Layer 2 and conditional conclusions (Phase 10C step C3). */
export const Q07_PROPOSAL = {
	layer2: {
		title: "Layer 2 · Different evaluation standards",
		verdict: "Genuine disagreement, recorded in two discussion groups and unsettled",
		text: "One position holds that rigorous out-of-sample validation justifies using an AI system as a forecasting tool without every user understanding its architecture, as researchers use reanalyses without reproducing data assimilation. The other holds that outperforming a dynamical model does not show that the right processes were learned, that this matters most for extrapolation to unfamiliar climates and extreme events, and that scientific accountability requires explaining what drives forecasts and why they fail. A third view separated understanding a network's internals from explaining a particular success or failure. The disagreement concerns how much and what kind of evidence is required, and for which uses; it is not a disagreement about whether practical forecasting or mechanism research is worthwhile.",
		basis: ["q07-c04", "q07-c01", "q07-c05", "q07-c07", "p9-q07-r03"],
	},
	recordedWhere: "The final-day record calls the contrast one of the clearest disagreements of the session and its summary table lists the physical explainability of AI as an active disagreement; the closing record states that the debate did not settle the dispute. The theory plenary recorded information-based understanding against the view that AI is a procedure whose capabilities must be stated, and the breakout separated variable importance from causation. Final-day and closing records may overlap and count as one contribution group; the theory discussions are a second group.",
	conditional: [
		{ use: "Operational forecasting within the validated range", evidence: "Out-of-sample skill and reliability for the stated lead times, regimes, variables and period", explanation: "A complete physical explanation is not a prerequisite in any recorded position; position B still asks scientists to explain failures." },
		{ use: "Reliance beyond the validated range (new climates, extremes, regime changes)", evidence: "Tests on held-out regimes and on conditions outside the training period; physical consistency checks", explanation: "Disputed: position B holds that skill alone is insufficient here." },
		{ use: "A claim that the model has learned a physical mechanism", evidence: "Explanations tested against observations and controlled perturbations; robustness to equivalent representations", explanation: "Variable importance or skill alone was not accepted as evidence of causation." },
	],
	conditionalNote: "This table is the author's reading of the recorded positions, not a workshop conclusion. How much explanation scientific use requires remained disputed.",
};

/**
 * Where the four levels between an MJO forecast and a decision can fail (Phase 10C
 * step C4). `kind`: "empirical" when a workshop record reports the failure,
 * "conceptual" when it follows from the definitions of the levels.
 */
export const REGIONAL_TRANSITIONS = [
	{
		from: "index", to: "response", kind: "empirical",
		failure: "Good RMM-type index skill need not mean that tropical heating, its latitude and vertical structure, or the extratropical response are right.",
		records: "A case study found very different week-2 extratropical skill among ensembles with similar MJO pattern correlations; recent reforecasts were reported to give mid-latitude responses weaker than observed; the prediction keynote separated circulation-weighted index skill from convection skill; a final-day report noted that RMM averages broad-scale signals and cannot fully represent meridional structure.",
		basis: ["q11-c01", "p9-q11-r02", "q06-c02", "p9-q11-r04"],
	},
	{
		from: "response", to: "hazard", kind: "conceptual",
		failure: "A correct large-scale regional response does not guarantee skill for an individual damaging event, which also depends on local processes, antecedent conditions and chance.",
		records: "Calls to compare against simple climatological baselines; ENSO- and season-dependent regional responses; MJO links to high-wave damage described as a potential contribution, not established causation. No recorded study showed incremental hazard skill after conditioning on season and ENSO.",
		basis: ["q11-c02", "q11-c07", "q11-c09"],
	},
	{
		from: "hazard", to: "decision", kind: "conceptual",
		failure: "Better hazard skill does not guarantee positive decision value, which depends on the user's decision, lead time, exposure, vulnerability, costs and the way uncertainty is communicated.",
		records: "Final-day reports stated that better scores are not societal value and that users need different variables, lead times and uncertainty information; MJO information was described as a conditional predictor once the background state and user target are specified. No realized decision benefit, user evaluation or cost–loss result is recorded.",
		basis: ["p9-q11-r04", "q11-c05", "q11-c09"],
	},
];

/** Tier 4 findings made in Phase 10 (not in the Phase 9 review matrix). */
export const PHASE10_FINDINGS = [
	{
		id: "q09-c07",
		tier: 4,
		note: "\"Higher horizontal resolution is a possible intervention\" repeats the framing that Phase 9 corrected in the Daehyun Kim key message; the modeling keynote reported that the expectation that resolution alone improves the MJO has found little support.",
		proposed: "Higher horizontal resolution alone has found little support as a remedy in the modeling review, and specific comparisons retained process and mean-state limitations.",
		evidence: ["q09-c07"],
		decision: null,
	},
	{
		id: "insight-multiscale/q11-c03",
		tier: 4,
		note: "The multiscale insight cites q11-c03, which also rests on the record of the site author's own talk; see p10-insight-multiscale.",
		proposed: null,
		evidence: ["q11-c03"],
		decision: null,
	},
];
