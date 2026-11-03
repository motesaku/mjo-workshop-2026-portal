import { PROGRAM_URL } from "./portal";

export interface Talk { time: string; title: string; speaker: string }
export interface Session { id: string; time: string; title: string; kind: string; talks?: Talk[]; note?: string }
export interface Day { date: string; label: string; theme: string; sessions: Session[] }
// Factual schedule transcribed from the official timetable; no scientific summaries.
// Session headings retain the timetable's times, including its overlapping Monday blocks.
export const programSource = { url: PROGRAM_URL, checked: "2026-11-02", timezone: "Europe/Rome (CET, UTC+01:00)" };
export const days: Day[] = [
  { date: "2026-10-26", label: "Monday, 26 October", theme: "Global patterns & field observations", sessions: [
    { id: "mon-registration", time: "08:30–09:00", title: "Registration and administrative formalities", kind: "Administrative" },
    { id: "mon-introduction", time: "09:00–09:30", title: "Introduction", kind: "Opening", talks: [
      { time: "09:00", title: "Welcome", speaker: "Frédéric Vitart" },
      { time: "09:10", title: "Introductory Talk 1", speaker: "Julia Slingo" },
      { time: "09:20", title: "Introductory Talk 2", speaker: "Franco Molteni" },
    ] },
    { id: "mon-keynotes-1-2", time: "09:30–12:00", title: "Keynotes — Themes 1 + 2", kind: "Keynotes", talks: [
      { time: "09:30", title: "Global Data & Global Patterns", speaker: "Mitch Moncrieff" },
      { time: "11:00", title: "Field Data & Tropical Variability", speaker: "Kunio Yoneyama" },
    ], note: "Coffee break: 10:30–11:00." },
    { id: "mon-orals-am", time: "12:00–14:00", title: "Oral presentations — Global Data & Global Patterns", kind: "Talks", talks: [
      { time: "12:00", title: "Tropics-wide Intraseasonal Oscillation", speaker: "Jiawei Bao" },
      { time: "12:15", title: "On the Existence and Implications of the Global Atmospheric Energy Cycle Associated with the Madden–Julian Oscillation", speaker: "Naoko Sakaeda" },
    ], note: "Lunch: 12:30–14:00 (included in the official session block)." },
    { id: "mon-orals-pm", time: "14:00–15:45", title: "Oral presentations — Global Data & Global Patterns / Field Data & Tropical Variability", kind: "Talks", talks: [
      { time: "14:00", title: "Increasing Trend of MJO Precipitation and Its Global Impacts on Tropical Cyclones, Atmospheric Rivers, and Extreme Rainfall", speaker: "Shuyi Chen" },
      { time: "14:15", title: "The MJO as Envelope, Waves as Trigger: Multi-Scale Pathways to Near-Equatorial Tropical Cyclogenesis in the Maritime Continent", speaker: "Michał Brennek" },
      { time: "14:30", title: "Phase-Dependent Co-Variations between Cross-Equatorial Northerly Surges (CENS) and the MJO", speaker: "Qoosaku Moteki" },
    ], note: "Coffee break: 14:45–15:30. The official block ends at 15:45 and overlaps the poster block; times are preserved as listed." },
    { id: "mon-posters-1-2", time: "15:30–16:30", title: "Poster Session — Themes 1 + 2", kind: "Posters", note: "P14–P26. In-person participants only." },
    { id: "mon-breakout-1-2", time: "16:30–18:00", title: "Breakout Group Discussions — Themes 1 + 2", kind: "Breakout", note: "In-person participants only. No reviewed discussion summary is available." },
    { id: "mon-reception", time: "19:00–20:00", title: "Welcome reception", kind: "Social", note: "Cafeteria — AGH." },
  ] },
  { date: "2026-10-27", label: "Tuesday, 27 October", theme: "Theory, mechanisms & modeling", sessions: [
    { id: "tue-keynotes-3-4", time: "09:30–12:00", title: "Keynotes — Themes 3 + 4", kind: "Keynotes", talks: [
      { time: "09:30", title: "The MJO at the Crossroads of Theory and Modelling", speaker: "Boualem Khouider" },
      { time: "11:00", title: "Modeling", speaker: "Daehyun Kim" },
    ], note: "Coffee break: 10:30–11:00." },
    { id: "tue-orals-am", time: "12:00–14:00", title: "Oral presentations — Theory & Mechanisms", kind: "Talks", talks: [
      { time: "12:00", title: "A Simple Model for Stratospheric Interactions with the MJO", speaker: "Jonathan Lin" },
      { time: "12:15", title: "Phase-dependent Moisture-Convection Interactions in the Madden-Julian Oscillation", speaker: "Chang Xu" },
    ], note: "Lunch: 12:30–14:00." },
    { id: "tue-orals-pm", time: "14:00–15:30", title: "Oral presentations — Theory & Mechanisms / Modeling", kind: "Talks", talks: [
      { time: "14:00", title: "MJO Propagation as a Deterministic Chaotic Phenomenon", speaker: "Daisuke Takasuka" },
      { time: "14:15", title: "The Madden–Julian Oscillation in Two High-Resolution Versions of IFS-NEMO: Spatiotemporal Representation and Long-Term Variability", speaker: "Bernardo Maraldi" },
      { time: "14:30", title: "Variation of Thermodynamic Conditions in the Marine Atmospheric Boundary Layer Associated with Tropical Intraseasonal Oscillations", speaker: "Satoru Yokoi" },
      { time: "14:45", title: "Long-term Observations Reveal Non-negligible Temperature Contributions to Moist Static Energy during the MJO Transition from Suppressed to Active Phases", speaker: "Ray Pallav Kumar" },
    ], note: "Group photo and coffee break: 15:00–15:30. No original photograph is hosted here." },
    { id: "tue-posters-3-4", time: "15:30–16:30", title: "Poster Session — Themes 3 + 4", kind: "Posters", note: "P01–P13. In-person participants only." },
    { id: "tue-breakout-3-4", time: "16:30–18:00", title: "Breakout Group Discussions — Themes 3 + 4", kind: "Breakout", note: "In-person participants only. One supplied highlight is mapped to this session; reviewed scientific coverage is pending." },
  ] },
  { date: "2026-10-28", label: "Wednesday, 28 October", theme: "Plenary discussions & exchange", sessions: [
    { id: "wed-plenary-1-2", time: "09:00–10:30", title: "Plenary Discussion — Themes 1 + 2", kind: "Plenary" },
    { id: "wed-coffee", time: "10:30–11:00", title: "Coffee break", kind: "Break" },
    { id: "wed-plenary-3-4", time: "11:00–12:30", title: "Plenary Discussion — Themes 3 + 4", kind: "Plenary", note: "Reports from the breakout discussions; a separate session from Tuesday's breakout highlight." },
    { id: "wed-lunch", time: "12:30–14:00", title: "Lunch", kind: "Break" },
    { id: "wed-excursion", time: "14:00–17:00", title: "Excursion — Visit to Miramare Castle", kind: "Social", note: "In-person participants only. Free afternoon following the excursion." },
  ] },
  { date: "2026-10-29", label: "Thursday, 29 October", theme: "Prediction & regional impacts", sessions: [
    { id: "thu-keynotes-5-6", time: "09:30–12:00", title: "Keynotes — Themes 5 + 6", kind: "Keynotes", talks: [
      { time: "09:30", title: "Prediction", speaker: "Hyemi Kim" },
      { time: "11:00", title: "Applications & Remote Regional Impacts", speaker: "Andrew Robertson" },
    ], note: "Coffee break: 10:30–11:00." },
    { id: "thu-orals-am", time: "12:00–14:15", title: "Oral presentations — Prediction", kind: "Talks", talks: [
      { time: "12:00", title: "Object-Based Climatology and Verification of the MJO", speaker: "Matthew Adam Janiga" },
      { time: "12:15", title: "Improving the Predictability of Multi-Scale Organized Convection through Hectometric-Scale ICON Ensemble Simulations", speaker: "Matteo Siena" },
    ], note: "Lunch: 12:30–14:00. The official session block ends at 14:15; times are preserved as listed." },
    { id: "thu-orals-pm", time: "14:00–15:30", title: "Oral presentations — Prediction / Applications & Remote Regional Impacts", kind: "Talks", talks: [
      { time: "14:00", title: "Extended-Range Forecast Skill of High Impact North Pacific Cyclones Relative to MJO Skill in S2S Models", speaker: "Stephanie Rushley" },
      { time: "14:15", title: "Development of Shallow Convection and the Slow Eastward Propagation of Super Cloud Clusters in the Madden-Julian Oscillation", speaker: "Yan Liu" },
      { time: "14:30", title: "The Madden–Julian Oscillation and Its Influence on West African Climate Variability: Implications for Forecasting and Early Warning Systems", speaker: "Bibian Chidinma Ekot" },
      { time: "14:45", title: "ENSO Modulation of the MJO and Its Impacts on South America during the Transition Seasons", speaker: "Luana Aparecida Scheibe" },
    ], note: "Coffee break: 15:00–15:30." },
    { id: "thu-posters-5-6", time: "15:30–16:30", title: "Poster Session — Themes 5 + 6", kind: "Posters", note: "P27–P37. In-person participants only." },
    { id: "thu-breakout-5-6", time: "16:30–18:00", title: "Breakout Group Discussions — Themes 5 + 6", kind: "Breakout", note: "In-person participants only." },
  ] },
  { date: "2026-10-30", label: "Friday, 30 October", theme: "Synthesis & future directions", sessions: [
    { id: "fri-orals", time: "09:30–11:00", title: "Oral presentations — Prediction / Applications & Remote Regional Impacts", kind: "Talks", talks: [
      { time: "09:30", title: "How Close Are We to the Predictability Limit of the MJO?", speaker: "Hera Kim" },
      { time: "09:45", title: "Sumatra squalls in present and future climates", speaker: "Simon Peatman" },
      { time: "10:00", title: "Evaluating MJO Modulation of East Pacific Easterly Waves and Tropical Cyclone Genesis in S2S Forecasts Using the Unified Forecast System", speaker: "Yu-Cian Tsai" },
      { time: "10:15", title: "ENSO-Dependent Impacts of the Madden–Julian Oscillation on Southern African Summer Rainfall", speaker: "Kenedy Cipriano Silverio" },
    ], note: "Coffee break: 10:30–11:00." },
    { id: "fri-plenary-5-6", time: "11:00–12:30", title: "Plenary Session — Prediction / Applications & Remote Regional Impacts", kind: "Plenary", note: "Themes 5 + 6; breakout group discussion reports." },
    { id: "fri-lunch", time: "12:30–14:00", title: "Lunch", kind: "Break" },
    { id: "fri-final", time: "14:00–15:45", title: "Final Plenary Discussion", kind: "Plenary" },
    { id: "fri-closing", time: "15:45–16:00", title: "Closing Remarks", kind: "Closing" },
  ] },
];
