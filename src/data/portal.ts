// Interface copy and metadata only. These are not approved scientific CMS records.
export const SITE_TITLE = "MJO Workshop 2026 — Knowledge & Action Portal";
export const SUBTITLE = "Scientific Questions, Emerging Insights, and Future Research Actions";
export const PROGRAM_URL = "https://indico.ictp.it/event/11169/other-view?view=ictptimetable";
export const VERIFIED_ON = "2 November 2026";
export const navigation = [
  { href: "/", label: "Home" },
  { href: "/program", label: "Program & Sessions" },
  { href: "/videos", label: "Video Highlights" },
  { href: "/questions", label: "Scientific Questions" },
  { href: "/diverging-perspectives", label: "Diverging Perspectives" },
  { href: "/emerging-alignment", label: "Emerging Alignment" },
  { href: "/open-challenges", label: "Open Challenges" },
  { href: "/actions", label: "Research Action Roadmap" },
  { href: "/ai-for-mjo-research", label: "AI for MJO Research" },
  { href: "/mjo-indices-and-diagnostics", label: "MJO Indices and Diagnostics" },
  { href: "/about", label: "About & Methodology" },
];
export const highlight = {
  slug: "breakout-themes-3-4",
  youtubeId: "RPXnSvabsGY",
  title: "Breakout Discussion — Themes 3 + 4",
  youtubeTitle: "MJO Workshop 2026: Discussion — Breakout Discussion — Themes 3 + 4",
  duration: "1:00",
  durationSeconds: 60,
  sessionId: "tue-breakout-3-4",
  date: "27 October 2026",
  time: "16:30–18:00",
  topics: "Theory & Mechanisms · Modeling",
  mappingBasis: "The YouTube title and description identify Breakout Discussion — Themes 3 + 4. The official timetable lists this breakout on Tuesday 27 October at 16:30. This is distinct from the plenary reports on Wednesday 28 October.",
  mappingVerified: true,
  scientificReview: "pending",
  publicationPermission: "pending",
};
export const editorialPages: Record<string, { title: string; eyebrow: string; description: string; emptyTitle: string; emptyText: string }> = {
  "diverging-perspectives": {
    title: "Diverging Perspectives", eyebrow: "Interpretations in dialogue",
    description: "A place to compare different scientific interpretations, hypotheses and research approaches, with the evidence for each.",
    emptyTitle: "Reviewed perspectives are in preparation",
    emptyText: "No disagreements have been classified. Positions will appear only after their context, supporting evidence and uncertainties have been reviewed. Discussion alone does not establish disagreement.",
  },
  "emerging-alignment": {
    title: "Emerging Alignment", eyebrow: "Connections across discussions",
    description: "Explore where reviewed contributions suggest a shared understanding or a promising research direction.",
    emptyTitle: "No alignment claims have been approved",
    emptyText: "Convergence will be distinguished from formal consensus. Silence or the absence of an opposing statement will never be treated as agreement.",
  },
  "open-challenges": {
    title: "Open Challenges", eyebrow: "Where evidence is still needed",
    description: "An entry point for unresolved scientific questions, coverage gaps and diagnostic limitations.",
    emptyTitle: "Scientific challenges await source review",
    emptyText: "No workshop challenge has been classified yet. Missing records describe the coverage of this portal; they do not demonstrate that a topic was absent from the workshop.",
  },
  "ai-for-mjo-research": {
    title: "AI for MJO Research", eyebrow: "Topic explorer / 01",
    description: "Follow future reviewed questions about AI across sessions, scientific evidence and illustrative research workflows.",
    emptyTitle: "Reviewed AI research content is in preparation",
    emptyText: "No claims about AI forecast skill, mechanisms or causality are available. Future summaries will distinguish observations, interpretations and proposals and retain their source coverage.",
  },
  "mjo-indices-and-diagnostics": {
    title: "MJO Indices and Diagnostics", eyebrow: "Topic explorer / 02",
    description: "A topic space for reviewed discussions of how MJO behaviour is defined, measured and evaluated.",
    emptyTitle: "Reviewed diagnostic content is in preparation",
    emptyText: "No preferred index or diagnostic has been endorsed here. Definitions, data coverage and limitations will accompany future approved content.",
  },
};
