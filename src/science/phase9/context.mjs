// One relation context for pages, tests and verification scripts (Phase 9).
// Combines the v1.0.0 package with the Phase 8 and Phase 9 supplements so that
// every consumer derives the same video, question and action relations.
import { SOURCE_VIDEO_RULES, OVERLAP_GROUPS } from "../phase8/source-video-map.mjs";
import { supplementalEvidence, supplementalSources } from "../phase8/provenance-supplement.mjs";
import { ACTION_CROSS_LINKS } from "../phase8/editorial-videos.mjs";
import { phase9Evidence, phase9Sources } from "./provenance.mjs";
import { PHASE9_CLAIMS, PHASE9_SOURCE_VIDEO_RULES } from "./claims.mjs";

export const SOURCE_RULES = { ...SOURCE_VIDEO_RULES, ...PHASE9_SOURCE_VIDEO_RULES };

export function relationContext({ pkg, highlights }) {
	return {
		pkg,
		highlights,
		supplement: { evidence: [...supplementalEvidence, ...phase9Evidence], sources: [...supplementalSources, ...phase9Sources] },
		sourceVideoRules: SOURCE_RULES,
		overlapGroups: OVERLAP_GROUPS,
		actionCrossLinks: ACTION_CROSS_LINKS,
		supplementalClaims: PHASE9_CLAIMS,
	};
}
