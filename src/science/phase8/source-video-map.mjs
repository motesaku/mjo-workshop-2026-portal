// Source record → one-minute highlight mapping (Phase 8, 2026-11-04).
//
// A highlight is linked to a source only when both refer to the same named
// programme talk, or to the same timetable session. This is a mapping of
// *where the minutes come from*; it does not claim that the one-minute clip
// shows the statements that cite those minutes.
//
// `withheld` sources cannot be tied to a single clip. Their candidate clips are
// listed only so that the site can explain why no link is shown.

export const SOURCE_VIDEO_RULES = {
	"src-bao": { kind: "named_talk", speaker: "Jiawei Bao", sessionId: "mon-orals-am", slugs: ["jiawei-bao-tropics-wide-intraseasonal-oscillation"] },
	"src-sakaeda": { kind: "named_talk", speaker: "Naoko Sakaeda", sessionId: "mon-orals-am", slugs: ["naoko-sakaeda-global-atmospheric-energy-cycle"] },
	"src-chen": { kind: "named_talk", speaker: "Shuyi Chen", sessionId: "mon-orals-pm", slugs: ["shuyi-chen-increasing-trend-mjo-precipitation"] },
	"src-brennek": { kind: "named_talk", speaker: "Michał Brennek", sessionId: "mon-orals-pm", slugs: ["michal-brennek-mjo-as-envelope"] },
	"src-moteki": { kind: "named_talk", speaker: "Qoosaku Moteki", sessionId: "mon-orals-pm", slugs: ["qoosaku-moteki-cens-mjo"] },
	"src-yoneyama": { kind: "named_talk", speaker: "Kunio Yoneyama", sessionId: "mon-keynotes-1-2", slugs: ["kunio-yoneyama-field-data-tropical-variability"] },
	"src-khouider": { kind: "named_talk", speaker: "Boualem Khouider", sessionId: "tue-keynotes-3-4", slugs: ["boualem-khouider-theory-modelling"] },
	"src-dkim": { kind: "named_talk", speaker: "Daehyun Kim", sessionId: "tue-keynotes-3-4", slugs: ["daehyun-kim-modeling"] },
	"src-lin": { kind: "named_talk", speaker: "Jonathan Lin", sessionId: "tue-orals-am", slugs: ["jonathan-lin-stratospheric-interactions"] },
	"src-takasuka": { kind: "named_talk", speaker: "Daisuke Takasuka", sessionId: "tue-orals-pm", slugs: ["daisuke-takasuka-deterministic-chaotic"] },
	"src-maraldi": { kind: "named_talk", speaker: "Bernardo Maraldi", sessionId: "tue-orals-pm", slugs: ["bernardo-maraldi-ifs-nemo"] },
	"src-yokoi": { kind: "named_talk", speaker: "Satoru Yokoi", sessionId: "tue-orals-pm", slugs: ["satoru-yokoi-boundary-layer"] },
	"src-kumar": { kind: "named_talk", speaker: "Ray Pallav Kumar", sessionId: "tue-orals-pm", slugs: ["ray-pallav-kumar-temperature-mse"] },
	"src-hkim": { kind: "named_talk", speaker: "Hyemi Kim", sessionId: "thu-keynotes-5-6", slugs: ["hyemi-kim-prediction", "hyemi-kim-prediction-alternate"] },
	"src-robertson": { kind: "named_talk", speaker: "Andrew Robertson", sessionId: "thu-keynotes-5-6", slugs: ["andrew-robertson-applications"] },
	"src-janiga": { kind: "named_talk", speaker: "Matthew Adam Janiga", sessionId: "thu-orals-am", slugs: ["matthew-janiga-object-based"] },
	"src-siena": { kind: "named_talk", speaker: "Matteo Siena", sessionId: "thu-orals-am", slugs: ["matteo-siena-hectometric-icon"] },
	"src-rushley": { kind: "named_talk", speaker: "Stephanie Rushley", sessionId: "thu-orals-pm", slugs: ["stephanie-rushley-north-pacific-cyclones"] },
	"src-liu": { kind: "named_talk", speaker: "Yan Liu", sessionId: "thu-orals-pm", slugs: ["yan-liu-shallow-convection"] },
	"src-ekot": { kind: "named_talk", speaker: "Bibian Chidinma Ekot", sessionId: "thu-orals-pm", slugs: ["bibian-ekot-west-africa"] },
	"src-scheibe": { kind: "named_talk", speaker: "Luana Aparecida Scheibe", sessionId: "thu-orals-pm", slugs: ["luana-scheibe-enso-south-america"] },
	"src-hera": { kind: "named_talk", speaker: "Hera Kim", sessionId: "fri-orals", slugs: ["hera-kim-predictability-limit"] },
	"src-peatman": { kind: "named_talk", speaker: "Simon Peatman", sessionId: "fri-orals", slugs: ["simon-peatman-sumatra-squalls"] },
	"src-tsai": { kind: "named_talk", speaker: "Yu-Cian Tsai", sessionId: "fri-orals", slugs: ["yu-cian-tsai-easterly-waves"] },
	"src-silverio": { kind: "named_talk", speaker: "Kenedy Cipriano Silverio", sessionId: "fri-orals", slugs: ["kenedy-silverio-southern-africa"] },

	"src-g3": {
		kind: "session", sessionId: "tue-breakout-3-4", slugs: ["breakout-themes-3-4"],
		note: "One breakout group's record; the clip may show a different part of the session.",
	},
	"src-p12": {
		kind: "session", sessionId: "wed-plenary-1-2", slugs: ["plenary-themes-1-2"],
		note: "The minutes excerpt covers about the first 79 minutes of the recording; the clip's position in the session is not established.",
	},
	"src-p34": {
		kind: "session", sessionId: "wed-plenary-3-4", slugs: ["plenary-themes-3-4"],
		note: "Plenary reports repeat breakout material; they are not independent of the 27 October breakout.",
	},

	"src-xu": {
		kind: "withheld", candidateSlugs: ["chang-xu-moisture-convection"],
		reason: "The minutes filed under this talk describe short-record wave detection, which differs from the programme title on moisture–convection interactions. The content-to-talk mapping is disputed, so no question is linked to this clip.",
	},
	"src-final": {
		kind: "withheld", candidateSlugs: ["plenary-themes-5-6", "final-plenary-discussion", "workshop-discussion-observations-ai"],
		reason: "The final-day record cannot yet be assigned to the 11:00 plenary or the 14:00 final plenary, so its statements are not linked to a specific clip.",
	},
	"src-closing": {
		kind: "withheld", candidateSlugs: ["closing-discussion-summary"],
		reason: "The extent of the closing record is unresolved and the closing clip is only provisionally mapped, so the two are not linked.",
	},
	"src-obs": {
		kind: "withheld", candidateSlugs: ["workshop-discussion-observations-ai"],
		reason: "The extended observation and AI minutes have a provisional date and group numbering and probably overlap the 28 October plenary record; they are not linked to a clip.",
	},
	"src-g34": {
		kind: "withheld", candidateSlugs: ["plenary-themes-3-4", "group-reports-theory-modeling"],
		reason: "The extended theory minutes have an inferred date and probably overlap the 28 October plenary record; they are not linked to a clip in their own right.",
	},
};

/**
 * Sources that may describe the same discussion. Records in one group are
 * not independent support for one another. Each named talk is its own group.
 */
export const OVERLAP_GROUPS = {
	"theory-discussion": {
		label: "Theory and modelling discussion (breakout, plenary and extended minutes)",
		families: ["theory-breakout", "theory-plenary"],
		reason: "The 27 October breakout was reported again in the 28 October plenary; the extended minutes probably overlap both.",
	},
	"final-day-discussion": {
		label: "Final-day reports, plenary and closing discussion",
		families: ["final-day-discussion"],
		reason: "Final-day reports and closing records may overlap; the session boundary is unresolved.",
	},
	"observations-discussion": {
		label: "Observations and global-patterns discussion",
		families: ["observations-plenary"],
		reason: "The extended observation minutes probably overlap the 28 October plenary excerpt.",
	},
};
