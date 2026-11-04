/** One-minute YouTube highlights from playlist PLSLeDe1GyyvU, mapped to the program. */
export const PLAYLIST_ID = "PLSLeDe1GyyvU";
export const PLAYLIST_URL = `https://www.youtube.com/playlist?list=${PLAYLIST_ID}`;
export const PLAYLIST_CHECKED = "2026-11-04";

export type HighlightMapping = "mapped" | "provisional" | "unmapped" | "alternate";

export interface Highlight {
	youtubeId: string;
	slug: string;
	/** Short English label for site UI (program titles preferred). */
	title: string;
	youtubeTitle: string;
	durationSeconds: number;
	sessionId: string | null;
	/** Match to program talk speaker when the clip is a named talk. */
	talkSpeaker: string | null;
	kind: "talk" | "keynote" | "discussion" | "opening" | "closing";
	mapping: HighlightMapping;
	mappingNote?: string;
	/** Owner authorized public personal-report embeds for this playlist on 2026-11-04. */
	publicationPermission: "owner_playlist_approved";
	/** First verified clip retained for continuity with earlier docs. */
	representativeForSession?: boolean;
}

function h(
	partial: Omit<Highlight, "publicationPermission" | "durationSeconds"> & { durationSeconds?: number },
): Highlight {
	return {
		durationSeconds: partial.durationSeconds ?? 60,
		publicationPermission: "owner_playlist_approved",
		...partial,
	};
}

/** Primary highlights shown in the program (one per talk / session where mapped). */
export const highlights: Highlight[] = [
	h({
		youtubeId: "zVY3RhX_GUg",
		slug: "welcome-introductory-talks",
		title: "Welcome and Introductory Talks",
		youtubeTitle: "MJO Workshop 2026: Frédéric Vitart, Julia Slingo and Franco Molteni — Welcome and Introductory Talks",
		sessionId: "mon-introduction",
		talkSpeaker: null,
		kind: "opening",
		mapping: "mapped",
	}),
	h({
		youtubeId: "0NFNgy-O3_g",
		slug: "mitch-moncrieff-global-data-global-patterns",
		title: "Global Data & Global Patterns",
		youtubeTitle: "MJO Workshop 2026: Mitch Moncrieff — Global Data & Global Patterns",
		sessionId: "mon-keynotes-1-2",
		talkSpeaker: "Mitch Moncrieff",
		kind: "keynote",
		mapping: "mapped",
	}),
	h({
		youtubeId: "A_0LkUFdn3A",
		slug: "kunio-yoneyama-field-data-tropical-variability",
		title: "Field Data & Tropical Variability",
		youtubeTitle: "MJO Workshop 2026: Kunio Yoneyama — Field Data & Tropical Variability",
		sessionId: "mon-keynotes-1-2",
		talkSpeaker: "Kunio Yoneyama",
		kind: "keynote",
		mapping: "mapped",
	}),
	h({
		youtubeId: "2iCiI_9leP0",
		slug: "jiawei-bao-tropics-wide-intraseasonal-oscillation",
		title: "Tropics-wide Intraseasonal Oscillation",
		youtubeTitle: "MJO Workshop 2026: Jiawei Bao — Tropics-wide Intraseasonal Oscillation",
		sessionId: "mon-orals-am",
		talkSpeaker: "Jiawei Bao",
		kind: "talk",
		mapping: "mapped",
	}),
	h({
		youtubeId: "DGbUZtSpVdE",
		slug: "naoko-sakaeda-global-atmospheric-energy-cycle",
		title: "On the Existence and Implications of the Global Atmospheric Energy Cycle Associated with the Madden–Julian Oscillation",
		youtubeTitle: "MJO Workshop 2026: Naoko Sakaeda — On the Existence and Implications of the Global Atmospheric Energy Cycle Associated with the Madden–Julian Oscillation",
		sessionId: "mon-orals-am",
		talkSpeaker: "Naoko Sakaeda",
		kind: "talk",
		mapping: "mapped",
	}),
	h({
		youtubeId: "_dSuJAht34g",
		slug: "shuyi-chen-increasing-trend-mjo-precipitation",
		title: "Increasing Trend of MJO Precipitation and Its Global Impacts on Tropical Cyclones, Atmospheric Rivers, and Extreme Rainfall",
		youtubeTitle: "MJO Workshop 2026: Shuyi Chen — Increasing Trend of MJO Precipitation and Its Global Impacts on Tropical Cyclones, Atmospheric Rivers, and Extreme Rainfall",
		sessionId: "mon-orals-pm",
		talkSpeaker: "Shuyi Chen",
		kind: "talk",
		mapping: "mapped",
	}),
	h({
		youtubeId: "3F3Ke-YZf_4",
		slug: "michal-brennek-mjo-as-envelope",
		title: "The MJO as Envelope, Waves as Trigger: Multi-Scale Pathways to Near-Equatorial Tropical Cyclogenesis in the Maritime Continent",
		youtubeTitle: "MJO Workshop 2026: Michał Brennek — The MJO as Envelope, Waves as Trigger: Multi-Scale Pathways to Near-Equatorial Tropical Cyclogenesis in the Maritime Continent",
		sessionId: "mon-orals-pm",
		talkSpeaker: "Michał Brennek",
		kind: "talk",
		mapping: "mapped",
	}),
	h({
		youtubeId: "l8L1x753sJ0",
		slug: "qoosaku-moteki-cens-mjo",
		title: "Phase-Dependent Co-Variations between Cross-Equatorial Northerly Surges (CENS) and the MJO",
		youtubeTitle: "MJO Workshop 2026: Qoosaku Moteki — Phase-Dependent Co-Variations between Cross-Equatorial Northerly Surges (CENS) and the MJO",
		sessionId: "mon-orals-pm",
		talkSpeaker: "Qoosaku Moteki",
		kind: "talk",
		mapping: "mapped",
	}),
	h({
		youtubeId: "L8MrBEbEK2I",
		slug: "boualem-khouider-theory-modelling",
		title: "The MJO at the Crossroads of Theory and Modelling",
		youtubeTitle: "MJO Workshop 2026: Boualem Khouider — The MJO at the Crossroads of Theory and Modelling",
		sessionId: "tue-keynotes-3-4",
		talkSpeaker: "Boualem Khouider",
		kind: "keynote",
		mapping: "mapped",
	}),
	h({
		youtubeId: "cZ1t6fZp3w0",
		slug: "daehyun-kim-modeling",
		title: "Modeling",
		youtubeTitle: "MJO Workshop 2026: Daehyun Kim — Modeling",
		sessionId: "tue-keynotes-3-4",
		talkSpeaker: "Daehyun Kim",
		kind: "keynote",
		mapping: "mapped",
	}),
	h({
		youtubeId: "0EsDmF7STmM",
		slug: "jonathan-lin-stratospheric-interactions",
		title: "A Simple Model for Stratospheric Interactions with the MJO",
		youtubeTitle: "MJO Workshop 2026: Jonathan Lin — A Simple Model for Stratospheric Interactions with the MJO",
		sessionId: "tue-orals-am",
		talkSpeaker: "Jonathan Lin",
		kind: "talk",
		mapping: "mapped",
	}),
	h({
		youtubeId: "YAxwnxhOrgw",
		slug: "chang-xu-moisture-convection",
		title: "Phase-dependent Moisture-Convection Interactions in the Madden-Julian Oscillation",
		youtubeTitle: "MJO Workshop 2026: Chang Xu — Phase-dependent Moisture-Convection Interactions in the Madden-Julian Oscillation",
		sessionId: "tue-orals-am",
		talkSpeaker: "Chang Xu",
		kind: "talk",
		mapping: "mapped",
	}),
	h({
		youtubeId: "6WfqLMud_I8",
		slug: "daisuke-takasuka-deterministic-chaotic",
		title: "MJO Propagation as a Deterministic Chaotic Phenomenon",
		youtubeTitle: "MJO Workshop 2026: Daisuke Takasuka — MJO Propagation as a Deterministic Chaotic Phenomenon",
		sessionId: "tue-orals-pm",
		talkSpeaker: "Daisuke Takasuka",
		kind: "talk",
		mapping: "mapped",
	}),
	h({
		youtubeId: "upP3jO7Cv9s",
		slug: "bernardo-maraldi-ifs-nemo",
		title: "The Madden–Julian Oscillation in Two High-Resolution Versions of IFS-NEMO: Spatiotemporal Representation and Long-Term Variability",
		youtubeTitle: "MJO Workshop 2026: Bernardo Maraldi — The Madden–Julian Oscillation in Two High-Resolution Versions of IFS-NEMO: Spatiotemporal Representation and Long-Term Variability",
		sessionId: "tue-orals-pm",
		talkSpeaker: "Bernardo Maraldi",
		kind: "talk",
		mapping: "mapped",
	}),
	h({
		youtubeId: "qAIqgKWrz_k",
		slug: "satoru-yokoi-boundary-layer",
		title: "Variation of Thermodynamic Conditions in the Marine Atmospheric Boundary Layer Associated with Tropical Intraseasonal Oscillations",
		youtubeTitle: "MJO Workshop 2026: Satoru Yokoi — Variation of Thermodynamic Conditions in the Marine Atmospheric Boundary Layer Associated with Tropical Intraseasonal Oscillations",
		sessionId: "tue-orals-pm",
		talkSpeaker: "Satoru Yokoi",
		kind: "talk",
		mapping: "mapped",
	}),
	h({
		youtubeId: "uodSfNiIYcI",
		slug: "ray-pallav-kumar-temperature-mse",
		title: "Long-term Observations Reveal Non-negligible Temperature Contributions to Moist Static Energy during the MJO Transition from Suppressed to Active Phases",
		youtubeTitle: "MJO Workshop 2026: Ray Pallav Kumar — Long-term Observations Reveal Non-negligible Temperature Contributions to Moist Static Energy during the MJO Transition from Suppressed to Active Phases",
		sessionId: "tue-orals-pm",
		talkSpeaker: "Ray Pallav Kumar",
		kind: "talk",
		mapping: "mapped",
	}),
	h({
		youtubeId: "RPXnSvabsGY",
		slug: "breakout-themes-3-4",
		title: "Breakout Discussion — Themes 3 + 4",
		youtubeTitle: "MJO Workshop 2026: Discussion — Breakout Discussion — Themes 3 + 4",
		durationSeconds: 61,
		sessionId: "tue-breakout-3-4",
		talkSpeaker: null,
		kind: "discussion",
		mapping: "mapped",
		representativeForSession: true,
		mappingNote: "First verified mapping (2026-11-02); owner permission recorded 2026-11-03.",
	}),
	h({
		youtubeId: "zwlE_I647UE",
		slug: "plenary-themes-1-2",
		title: "Plenary Discussion — Themes 1 + 2",
		youtubeTitle: "MJO Workshop 2026: Discussion — Plenary Discussion — Themes 1 + 2",
		durationSeconds: 61,
		sessionId: "wed-plenary-1-2",
		talkSpeaker: null,
		kind: "discussion",
		mapping: "mapped",
	}),
	h({
		youtubeId: "moaOW8Lwdvw",
		slug: "plenary-themes-3-4",
		title: "Plenary Discussion — Themes 3 + 4",
		youtubeTitle: "MJO Workshop 2026: Discussion — Plenary Discussion — Themes 3 + 4",
		durationSeconds: 61,
		sessionId: "wed-plenary-3-4",
		talkSpeaker: null,
		kind: "discussion",
		mapping: "mapped",
	}),
	h({
		youtubeId: "aPRvkP0cfNc",
		slug: "hyemi-kim-prediction",
		title: "Prediction",
		youtubeTitle: "MJO Workshop 2026: Hyemi Kim — Prediction (YouTube transcript version)",
		sessionId: "thu-keynotes-5-6",
		talkSpeaker: "Hyemi Kim",
		kind: "keynote",
		mapping: "mapped",
		mappingNote: "Primary program mapping. An alternate cut exists (see alternate list).",
	}),
	h({
		youtubeId: "H2VIbX0j_Sg",
		slug: "andrew-robertson-applications",
		title: "Applications & Remote Regional Impacts",
		youtubeTitle: "MJO Workshop 2026: Andrew Robertson — Applications & Remote Regional Impacts",
		sessionId: "thu-keynotes-5-6",
		talkSpeaker: "Andrew Robertson",
		kind: "keynote",
		mapping: "mapped",
	}),
	h({
		youtubeId: "nBXem6KCw0A",
		slug: "matthew-janiga-object-based",
		title: "Object-Based Climatology and Verification of the MJO",
		youtubeTitle: "MJO Workshop 2026: Matthew Adam Janiga — Object-Based Climatology and Verification of the MJO",
		sessionId: "thu-orals-am",
		talkSpeaker: "Matthew Adam Janiga",
		kind: "talk",
		mapping: "mapped",
	}),
	h({
		youtubeId: "zcX-D-SW6_8",
		slug: "matteo-siena-hectometric-icon",
		title: "Improving the Predictability of Multi-Scale Organized Convection through Hectometric-Scale ICON Ensemble Simulations",
		youtubeTitle: "MJO Workshop 2026: Matteo Siena — Improving the Predictability of Multi-Scale Organized Convection through Hectometric-Scale ICON Ensemble Simulations",
		sessionId: "thu-orals-am",
		talkSpeaker: "Matteo Siena",
		kind: "talk",
		mapping: "mapped",
	}),
	h({
		youtubeId: "5qUi6f6E-t4",
		slug: "stephanie-rushley-north-pacific-cyclones",
		title: "Extended-Range Forecast Skill of High Impact North Pacific Cyclones Relative to MJO Skill in S2S Models",
		youtubeTitle: "MJO Workshop 2026: Stephanie Rushley — Extended-Range Forecast Skill of High Impact North Pacific Cyclones Relative to MJO Skill in S2S Models",
		sessionId: "thu-orals-pm",
		talkSpeaker: "Stephanie Rushley",
		kind: "talk",
		mapping: "mapped",
	}),
	h({
		youtubeId: "Wbn-iyiSmAk",
		slug: "yan-liu-shallow-convection",
		title: "Development of Shallow Convection and the Slow Eastward Propagation of Super Cloud Clusters in the Madden-Julian Oscillation",
		youtubeTitle: "MJO Workshop 2026: Yan Liu — Development of Shallow Convection and the Slow Eastward Propagation of Super Cloud Clusters in the Madden-Julian Oscillation",
		sessionId: "thu-orals-pm",
		talkSpeaker: "Yan Liu",
		kind: "talk",
		mapping: "mapped",
	}),
	h({
		youtubeId: "mY9SYPAV91k",
		slug: "bibian-ekot-west-africa",
		title: "The Madden–Julian Oscillation and Its Influence on West African Climate Variability: Implications for Forecasting and Early Warning Systems",
		youtubeTitle: "MJO Workshop 2026: Bibian Chidinma Ekot — The Madden–Julian Oscillation and Its Influence on West African Climate Variability: Implications for Forecasting and Early Warning Systems",
		sessionId: "thu-orals-pm",
		talkSpeaker: "Bibian Chidinma Ekot",
		kind: "talk",
		mapping: "mapped",
	}),
	h({
		youtubeId: "hOkBLbUf204",
		slug: "luana-scheibe-enso-south-america",
		title: "ENSO Modulation of the MJO and Its Impacts on South America during the Transition Seasons",
		youtubeTitle: "MJO Workshop 2026: Luana Aparecida Scheibe — ENSO Modulation of the MJO and Its Impacts on South America during the Transition Seasons",
		sessionId: "thu-orals-pm",
		talkSpeaker: "Luana Aparecida Scheibe",
		kind: "talk",
		mapping: "mapped",
	}),
	h({
		youtubeId: "gWFr7UuE_oE",
		slug: "hera-kim-predictability-limit",
		title: "How Close Are We to the Predictability Limit of the MJO?",
		youtubeTitle: "MJO Workshop 2026: Hera Kim — How Close Are We to the Predictability Limit of the MJO?",
		sessionId: "fri-orals",
		talkSpeaker: "Hera Kim",
		kind: "talk",
		mapping: "mapped",
	}),
	h({
		youtubeId: "XXz1Ehm7FCQ",
		slug: "simon-peatman-sumatra-squalls",
		title: "Sumatra squalls in present and future climates",
		youtubeTitle: "MJO Workshop 2026: Simon Peatman — Sumatra squalls in present and future climates",
		sessionId: "fri-orals",
		talkSpeaker: "Simon Peatman",
		kind: "talk",
		mapping: "mapped",
	}),
	h({
		youtubeId: "efnO1a6wSvQ",
		slug: "yu-cian-tsai-easterly-waves",
		title: "Evaluating MJO Modulation of East Pacific Easterly Waves and Tropical Cyclone Genesis in S2S Forecasts Using the Unified Forecast System",
		youtubeTitle: "MJO Workshop 2026: Yu-Cian Tsai — Evaluating MJO Modulation of East Pacific Easterly Waves and Tropical Cyclone Genesis in S2S Forecasts Using the Unified Forecast System",
		sessionId: "fri-orals",
		talkSpeaker: "Yu-Cian Tsai",
		kind: "talk",
		mapping: "mapped",
	}),
	h({
		youtubeId: "Y61_hf1ZDmE",
		slug: "kenedy-silverio-southern-africa",
		title: "ENSO-Dependent Impacts of the Madden–Julian Oscillation on Southern African Summer Rainfall",
		youtubeTitle: "MJO Workshop 2026: Kenedy Cipriano Silverio — ENSO-Dependent Impacts of the Madden–Julian Oscillation on Southern African Summer Rainfall",
		sessionId: "fri-orals",
		talkSpeaker: "Kenedy Cipriano Silverio",
		kind: "talk",
		mapping: "mapped",
	}),
	h({
		youtubeId: "c0piMiS9hEs",
		slug: "plenary-themes-5-6",
		title: "Plenary Session — Prediction / Applications & Remote Regional Impacts",
		youtubeTitle: "MJO Workshop 2026: Discussion, Themes 5 + 6 — Plenary Session — Prediction and Applications & Remote Regional Impacts",
		sessionId: "fri-plenary-5-6",
		talkSpeaker: null,
		kind: "discussion",
		mapping: "mapped",
	}),
	h({
		youtubeId: "asXj4AzuSYA",
		slug: "final-plenary-discussion",
		title: "Final Plenary Discussion",
		youtubeTitle: "MJO Workshop 2026: Discussion — Final Plenary Discussion",
		durationSeconds: 61,
		sessionId: "fri-final",
		talkSpeaker: null,
		kind: "discussion",
		mapping: "mapped",
	}),
	h({
		youtubeId: "mayIFC2Erq4",
		slug: "closing-discussion-summary",
		title: "Closing Discussion and Summary",
		youtubeTitle: "MJO Workshop 2026: Discussion — Closing Discussion and Summary",
		sessionId: "fri-closing",
		talkSpeaker: null,
		kind: "closing",
		mapping: "provisional",
		mappingNote: "Mapped to Closing Remarks as the nearest closing block; title says Closing Discussion and Summary.",
	}),
	// Alternates / unmapped — listed on /videos but not as the primary program thumb.
	h({
		youtubeId: "V5Yul2jwS9U",
		slug: "hyemi-kim-prediction-alternate",
		title: "Prediction (alternate cut)",
		youtubeTitle: "MJO Workshop 2026: Hyemi Kim — Prediction (original minutes version)",
		sessionId: "thu-keynotes-5-6",
		talkSpeaker: "Hyemi Kim",
		kind: "keynote",
		mapping: "alternate",
		mappingNote: "Alternate to the primary Hyemi Kim Prediction highlight.",
	}),
	h({
		youtubeId: "5tWT-8fXpwY",
		slug: "group-reports-theory-modeling",
		title: "Group Reports and Plenary Discussion: Theory and Modeling",
		youtubeTitle: "MJO Workshop 2026: Discussion — Group Reports and Plenary Discussion: Theory and Modeling",
		durationSeconds: 61,
		sessionId: "wed-plenary-3-4",
		talkSpeaker: null,
		kind: "discussion",
		mapping: "alternate",
		mappingNote: "Related to Themes 3 + 4 reporting; primary plenary clip is plenary-themes-3-4.",
	}),
	h({
		youtubeId: "cNtQ6nmFb0g",
		slug: "workshop-discussion-observations-ai",
		title: "Workshop Discussion: Observations, AI and International Collaboration",
		youtubeTitle: "MJO Workshop 2026: Discussion — Workshop Discussion: Observations, AI and International Collaboration",
		durationSeconds: 61,
		sessionId: "fri-final",
		talkSpeaker: null,
		kind: "discussion",
		mapping: "provisional",
		mappingNote: "Title does not name a single timetable block; provisionally linked to Final Plenary Discussion.",
	}),
	h({
		youtubeId: "jYd1Sac5Ifc",
		slug: "mjo-isotope-discussion",
		title: "MJO Isotope Discussion",
		youtubeTitle: "MJO Workshop 2026: Discussion — MJO Isotope Discussion — Date and Session Unconfirmed",
		durationSeconds: 61,
		sessionId: null,
		talkSpeaker: null,
		kind: "discussion",
		mapping: "unmapped",
		mappingNote: "YouTube title states date and session are unconfirmed.",
	}),
];

export function youtubeThumb(id: string, quality: "hqdefault" | "mqdefault" | "sddefault" = "hqdefault"): string {
	return `https://i.ytimg.com/vi/${id}/${quality}.jpg`;
}

export function formatDuration(seconds: number): string {
	const s = Math.round(seconds);
	const m = Math.floor(s / 60);
	const r = s % 60;
	return `${m}:${String(r).padStart(2, "0")}`;
}

export function getHighlight(slug: string): Highlight | undefined {
	return highlights.find((item) => item.slug === slug);
}

export function highlightsForSession(sessionId: string): Highlight[] {
	return highlights.filter((item) => item.sessionId === sessionId && item.mapping !== "alternate");
}

export function primaryHighlightForTalk(sessionId: string, speaker: string): Highlight | undefined {
	return highlights.find(
		(item) =>
			item.sessionId === sessionId &&
			item.talkSpeaker === speaker &&
			item.mapping !== "alternate" &&
			item.mapping !== "unmapped",
	);
}

export function sessionLevelHighlights(sessionId: string): Highlight[] {
	return highlights.filter(
		(item) =>
			item.sessionId === sessionId &&
			!item.talkSpeaker &&
			item.mapping !== "alternate" &&
			item.mapping !== "unmapped",
	);
}

export function programHighlights(): Highlight[] {
	return highlights.filter((item) => item.mapping === "mapped" || item.mapping === "provisional");
}

export function catalogHighlights(): Highlight[] {
	return highlights;
}

/** Back-compat export used by older pages. */
export const featuredHighlight = highlights.find((item) => item.youtubeId === "RPXnSvabsGY")!;
