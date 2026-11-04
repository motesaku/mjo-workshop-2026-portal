// Interface copy and metadata only. These are not approved scientific CMS records.
export const SITE_TITLE = "MJO Workshop 2026 — Knowledge & Action Portal";
export const SUBTITLE = "Scientific Questions, Emerging Insights, and Future Research Actions";
export const PROGRAM_URL = "https://indico.ictp.it/event/11169/other-view?view=ictptimetable";
export const VERIFIED_ON = "2 November 2026";

/** Public editorial stance decided by the site owner on 2026-11-03. */
export const SITE_STANCE = {
	decidedOn: "2026-11-03",
	authorName: "Qoosaku Moteki",
	authorRole: "individual workshop participant",
	accessModel: "public_personal_report",
	shortLabel: "Personal workshop report by Qoosaku Moteki",
	/** One-line site-level statement used in the header bar and footer. */
	concise: "A personal report by Qoosaku Moteki, one workshop participant. Not an official ICTP or workshop record, and not a multi-author consensus.",
	summary:
		"This site is a personal public report by Qoosaku Moteki, written as one workshop participant. It records his own learning and present understanding from the meeting. It is not an official ICTP or workshop product, not a multi-author consensus, and not a participant account portal. Only he updates the site.",
};
export interface NavItem { href: string; label: string; short?: string; primary?: boolean; science?: boolean }
/** Site navigation. `primary` items appear directly in the header; the rest sit under "More". */
export const navigation: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/workshop-synthesis", label: "Workshop Synthesis", primary: true, science: true },
  { href: "/program", label: "Program & Sessions", primary: true },
  { href: "/videos", label: "Video Highlights", primary: true },
  { href: "/questions", label: "Scientific Questions", primary: true, science: true },
  { href: "/diverging-perspectives", label: "Diverging Perspectives", science: true },
  { href: "/emerging-alignment", label: "Emerging Alignment", science: true },
  { href: "/open-challenges", label: "Open Challenges", science: true },
  { href: "/actions", label: "Research Action Roadmap", short: "Research Roadmap", primary: true, science: true },
  { href: "/ai-for-mjo-research", label: "AI for MJO Research", primary: true, science: true },
  { href: "/mjo-indices-and-diagnostics", label: "MJO Indices and Diagnostics", short: "MJO Indices", primary: true, science: true },
  { href: "/about", label: "About & Methodology" },
];
/** @deprecated Prefer `featuredHighlight` / `highlights` from `./highlights`. Kept for older imports. */
export { featuredHighlight as highlight, PLAYLIST_ID, PLAYLIST_URL } from "./highlights";
export const highlightLegacyMeta = {
  date: "27 October 2026",
  time: "16:30–18:00",
  topics: "Theory & Mechanisms · Modeling",
  mappingBasis: "The YouTube title and description identify Breakout Discussion — Themes 3 + 4. The official timetable lists this breakout on Tuesday 27 October at 16:30. This is distinct from the plenary reports on Wednesday 28 October.",
  publicationPermissionDate: "2026-11-03",
};
export const editorialPages: Record<string, { title: string; eyebrow: string; description: string; emptyTitle: string; emptyText: string }> = {
  "diverging-perspectives": {
    title: "Diverging Perspectives", eyebrow: "Interpretations in dialogue",
    description: "Compare provisional personal readings of where workshop records suggest different standards, hypotheses or approaches.",
    emptyTitle: "No diverging-perspective items in this package",
    emptyText: "When present, items remain a personal classification. Discussion alone does not establish disagreement.",
  },
  "emerging-alignment": {
    title: "Emerging Alignment", eyebrow: "Connections across discussions",
    description: "Explore where a personal reading of the minutes suggests a shared direction, without claiming formal consensus.",
    emptyTitle: "No emerging-alignment items in this package",
    emptyText: "Silence is never treated as agreement. Alignment labels here are editorial and provisional.",
  },
  "open-challenges": {
    title: "Open Challenges", eyebrow: "Where evidence is still needed",
    description: "Unresolved questions, coverage gaps and diagnostic limits retained from a personal reading of the minutes.",
    emptyTitle: "No open-challenge items in this package",
    emptyText: "Missing records describe the coverage of this personal report; they do not prove a topic was absent from the workshop.",
  },
  "ai-for-mjo-research": {
    title: "AI for MJO Research", eyebrow: "Topic explorer / 01",
    description: "A dedicated personal synthesis on AI forecasting, physical consistency and explainability across workshop sessions.",
    emptyTitle: "AI theme unavailable",
    emptyText: "The bundled personal-synthesis package could not be loaded.",
  },
  "mjo-indices-and-diagnostics": {
    title: "MJO Indices and Diagnostics", eyebrow: "Topic explorer / 02",
    description: "A dedicated personal synthesis on RMM, OMI, ROMI and related diagnostics, with definitions kept distinct.",
    emptyTitle: "Indices theme unavailable",
    emptyText: "The bundled personal-synthesis package could not be loaded.",
  },
};
