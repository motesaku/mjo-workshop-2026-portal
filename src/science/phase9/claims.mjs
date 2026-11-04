// Phase 9 workshop-record statements (2026-11-04). Draft awaiting the author's
// review. Each paraphrases one passage of the converted minutes, cited by a
// public locator (see provenance.mjs). They supplement, and never replace,
// the statements of personal-synthesis.json v1.0.0.

const RECORD = "workshop_statement_as_paraphrased_in_minutes";
const c = (issueId, n, text, evidence_ids) => ({
	issueId,
	field: "records",
	claim: { claim_id: `p9-${issueId}-r${String(n).padStart(2, "0")}`, text, evidence_ids, origin: RECORD, verification: "unverified", phase: "phase9" },
});

export const PHASE9_CLAIMS = [
	c("q02", 1, "The closing record listed MJO initiation, propagation and weakening through the Maritime Continent, and the relationship between the eastward-propagating MJO and other intraseasonal modes, as aspects existing theories do not comprehensively explain, and urged more theoretical attention to northward-propagating boreal-summer intraseasonal oscillations.", ["e-closing-138-146"]),
	c("q02", 2, "The theory keynote cautioned that isolating the MJO as a single large-scale mode can miss its interactions with convectively coupled synoptic waves and mesoscale convective systems.", ["e-khouider-19-25"]),
	c("q03", 1, "The theory keynote described multicloud frameworks in which shallow clouds, congestus, deep and stratiform clouds and low-level moisture convergence take part in wave selection and organization.", ["e-khouider-19-25"]),
	c("q03", 2, "The modeling keynote noted many examples in which moisture-sensitive convection schemes or low-level moistening by shallow convection strengthen the simulated MJO, while intercomparisons still call for process-level explanation rather than tuning alone.", ["e-dkim-19-26"]),
	c("q05", 1, "The Global Data & Global Patterns keynote argued that convective parameterizations have represented heating more fully than the momentum transport and dynamical organization of mesoscale convective systems, that kilometre-scale grids do not resolve organization automatically, and that interactions from mesoscale systems to the MJO, westerly wind bursts and El Niño, including downward QBO influence on mesoscale systems, should be treated as one continuum.", ["e-moncrieff-20-25"]),
	c("q07", 1, "A final-day group report distinguished uses of AI for operational forecasting and services (accuracy, reliability, usability), for scientific research (physical processes and sources of predictability) and for AI-model development (diagnostics and training strategies).", ["e-final-88-98"]),
	c("q07", 2, "The closing record named whether improvements in forecast skill also represent improvements in physical understanding as a central question, treating them as related but distinct goals, and asked whether summary skill metrics can show that an AI model gets the right answer for the right reasons.", ["e-closing-23-34", "e-closing-189-200"]),
	c("q07", 3, "The final-day minutes' own summary table describes the physical explainability of AI as an active disagreement—views differed on how much understanding is necessary and for whom—and lists regional impact evaluation and co-design with users as areas of broad convergence. These are labels in the minutes, not formal resolutions.", ["e-final-275-289"]),
	c("q07", 4, "Asked what evidence from AI could convince researchers who hold different physical hypotheses, the closing discussion answered that explanations should be tested against observations rather than treated as matters of belief, and reaffirmed direct observations as a constraint on both models and theories.", ["e-closing-220-226"]),
	c("q09", 1, "The Global Data & Global Patterns keynote recommended representing organization and momentum transport explicitly in convective parameterizations and evaluating them in uncoupled and ocean-coupled models against Maritime Continent passage, tropical variability spectra, twin cyclones, El Niño onset and QBO relations, not MJO amplitude alone.", ["e-moncrieff-27-33"]),
	c("q09", 2, "The opening session recommended studying the MJO as a system that includes convective organization, the ocean, equatorial waves and the mid-latitude circulation, and testing deficiencies in vertical resolution, ocean coupling, momentum transport and cold pools individually rather than treating higher resolution alone as the solution.", ["e-welcome-40-43"]),
	c("q10", 1, "The theory plenary reported that long-term West Pacific observations are underused because older data take time and funding to process and are not widely known; the usage figures quoted were the speaker's estimates, not verified statistics.", ["e-p34-23-23"]),
	c("q11", 1, "The applications keynote noted that gains in MJO index skill need not raise regional impact skill by the same amount, and that MJO-conditioned skill gains appear for tropical rainfall in several studies but are mixed in the extratropics, varying with region, season, metric and study, with limited samples and ENSO or QBO background states affecting interpretation.", ["e-robertson-17-22"]),
	c("q11", 2, "The opening session described a period in which model-physics changes at an operational centre improved both the simulated MJO amplitude and the prediction of related North Atlantic teleconnections, but also reported that mid-latitude circulation responses following the MJO remain weaker than observed in recent reforecasts, possibly because the signal is lost amid other variability in operational systems.", ["e-welcome-33-36"]),
	c("q11", 3, "Rushley framed the talk around the point that MJO index skill and the skill of extratropical circulation and impact forecasts are not the same.", ["e-rushley-13-13"]),
	c("q11", 4, "Final-day group reports stated that improving forecast scores is not equivalent to creating societal value, that the same MJO phase need not produce the same impacts everywhere, and that the user-facing question is how a predicted state alters a risk at a given location; users differ in the variables, lead times and uncertainty information they need.", ["e-final-45-68", "e-final-80-86", "e-final-116-118"]),
	c("q11", 5, "The closing record questioned deterministic headline thresholds such as an RMM correlation of 0.5, encouraged probabilistic and state-dependent verification, and noted that the same rainfall can have different consequences depending on antecedent soil moisture, river discharge and terrain.", ["e-closing-230-236", "e-closing-250-256"]),
	c("q11", 6, "A final-day plenary contribution proposed coordinated phenomenon-tracking and multiscale diagnostics for the MJO together with equatorial waves, tropical cyclones, monsoon variability and ENSO, suggesting that better AI skill might reflect better representation of interacting variability rather than of the MJO alone.", ["e-final-236-260"]),
];

/**
 * Source → clip rules for the two sources added in Phase 9. The opening-session
 * minutes map to the opening-session clip at session level only.
 */
export const PHASE9_SOURCE_VIDEO_RULES = {
	"src-welcome": {
		kind: "session", sessionId: "mon-introduction", slugs: ["welcome-introductory-talks"],
		note: "The minutes cover the opening session without separating its speakers; whether they cover both introductory talks, and where the clip sits in the session, is not established.",
	},
	"src-moncrieff": { kind: "named_talk", speaker: "Mitch Moncrieff", sessionId: "mon-keynotes-1-2", slugs: ["mitch-moncrieff-global-data-global-patterns"] },
};
