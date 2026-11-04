#!/usr/bin/env node
// Versioned JSON export of the Phase 9 editorial layer (public fields only).
// Usage: node scripts/export-phase9.mjs          write docs/versions/phase9-editorial-layer.v1.json
//        node scripts/export-phase9.mjs --check  fail if the committed export is out of date
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { highlights } from "../src/data/highlights.ts";
import { createRelationIndex } from "../src/science/phase8/relations.mjs";
import { relationContext } from "../src/science/phase9/context.mjs";
import { PHASE9_EDITORIAL, CHECK_METHOD } from "../src/science/phase9/status.mjs";
import { phase9Evidence, phase9Sources, sourceQualityOf } from "../src/science/phase9/provenance.mjs";
import { PHASE9_CLAIMS, PHASE9_SOURCE_VIDEO_RULES } from "../src/science/phase9/claims.mjs";
import { reviewOf, REVIEW_OVERRIDES, PUBLICATION_RISKS } from "../src/science/phase9/claim-review.mjs";
import * as synthesis from "../src/science/phase9/synthesis.mjs";
import * as coverage from "../src/science/phase9/coverage.mjs";
import * as classification from "../src/science/phase9/classification.mjs";
import * as roadmap from "../src/science/phase9/roadmap.mjs";
import * as videos from "../src/science/phase9/videos.mjs";

const pkg = JSON.parse(readFileSync(new URL("../src/data/personal-synthesis.json", import.meta.url), "utf8"));
const index = createRelationIndex(relationContext({ pkg, highlights }));
const reviewMatrix = [...index.claims.entries()].map(([id, row]) => {
	const r = reviewOf(id, { field: row.field, sourceIds: index.sourceIdsOfClaim(row.claim) });
	return { claim_id: id, issue_id: row.issueId, field: row.field, fidelity: r.fidelity, interpretation: r.interpretation, category: r.category, publication: r.publication, note: r.note };
});
const phase8Reviews = Object.keys(REVIEW_OVERRIDES).filter((k) => !index.claims.has(k)).map((k) => ({ id: k, ...reviewOf(k, {}) }));

const out = {
	format: "mjo-portal-phase9-editorial-layer",
	version: "1.0.0",
	editorial_id: PHASE9_EDITORIAL.id,
	status: PHASE9_EDITORIAL.status,
	base_package: { format: pkg.format, version: pkg.version },
	check_method: CHECK_METHOD,
	provenance: { evidence: phase9Evidence, sources: phase9Sources, source_quality: Object.fromEntries([...index.sources.keys()].sort().map((s) => [s, sourceQualityOf(s)])), source_video_rules: PHASE9_SOURCE_VIDEO_RULES },
	claims: PHASE9_CLAIMS,
	review: { matrix: reviewMatrix, editorial_statements: phase8Reviews, publication_risks: PUBLICATION_RISKS },
	synthesis: { overarching_question: synthesis.OVERARCHING_QUESTION, executive: synthesis.EXECUTIVE_SYNTHESIS_V2, insights: synthesis.INSIGHTS_V2, regional_value_levels: synthesis.REGIONAL_VALUE_LEVELS, insight_assessments: synthesis.INSIGHT_ASSESSMENTS, contested_revisions: synthesis.CONTESTED_REVISIONS },
	coverage: { themes: coverage.THEME_COVERAGE, cross_cutting_gaps: coverage.CROSS_CUTTING_GAPS },
	classification: { relationship_revisions: classification.RELATIONSHIP_REVISIONS, q07: classification.Q07_LAYERS, q03: classification.Q03_ANALYSIS, alignment_forms: classification.ALIGNMENT_FORMS, disagreement_matrix: classification.DISAGREEMENT_MATRIX, complementary: classification.COMPLEMENTARY_PERSPECTIVES },
	roadmap: { dependencies: roadmap.DEPENDENCIES, external_prerequisites: roadmap.EXTERNAL_PREREQUISITES, parallel_start: roadmap.PARALLEL_START, pilots: roadmap.PILOTS, assessments: roadmap.PILOT_ASSESSMENTS, status: roadmap.PILOT_STATUS },
	videos: { key_messages: videos.PHASE9_KEY_MESSAGES, mapping_review: videos.MAPPING_REVIEW },
};
const text = JSON.stringify(out, null, "\t") + "\n";
if (/sha256:|\/Users\/|researcher_os|[぀-ヿ㐀-鿿]/.test(text)) throw new Error("export contains private paths, fingerprints or non-English text");
const target = new URL("../docs/versions/phase9-editorial-layer.v1.json", import.meta.url);
if (process.argv.includes("--check")) {
	const current = existsSync(target) ? readFileSync(target, "utf8") : "";
	if (current !== text) { console.error("docs/versions/phase9-editorial-layer.v1.json is out of date; run npm run science:export-phase9"); process.exit(1); }
	console.log("Phase 9 export is up to date.");
} else {
	mkdirSync(new URL("../docs/versions/", import.meta.url), { recursive: true });
	writeFileSync(target, text);
	console.log(`Wrote docs/versions/phase9-editorial-layer.v1.json (${reviewMatrix.length} reviewed statements, ${PHASE9_CLAIMS.length} Phase 9 records)`);
}
