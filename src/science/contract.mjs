// Single source for the portable JSON contract and the EmDash collection model.
export const VERSION = "1.0.0";
export const TOPICS = {
  ai_for_mjo_research: "AI for MJO Research",
  mjo_indices_and_diagnostics: "MJO Indices and Diagnostics",
};
export const CLASSIFICATIONS = {
  diverging_perspectives: { label: "Diverging Perspectives", description: "Substantive disagreement between scientific interpretations, hypotheses, or research approaches." },
  emerging_alignment: { label: "Emerging Alignment", description: "Multiple contributions suggesting convergence toward a shared scientific understanding or research direction, without necessarily establishing consensus." },
  open_questions: { label: "Open Questions", description: "Unresolved issues without sufficient evidence for agreement or disagreement." },
  documented_agreements: { label: "Documented Agreements", description: "Conclusions or decisions explicitly supported by workshop records. Silence or lack of opposition is never evidence of agreement." },
};
export const COLLECTIONS = {
  workshop_sessions: "Workshop Sessions", talks: "Talks", video_highlights: "Video Highlights",
  scientific_questions: "Scientific Questions", scientific_positions: "Scientific Positions",
  evidence_references: "Evidence and Source References", scientific_findings: "Scientific Findings", research_actions: "Research Actions",
};
const text = { type: "string", minLength: 1, maxLength: 8000, pattern: "\\S" };
const id = { type: "string", pattern: "^[a-z][a-z0-9_-]{2,95}$" };
const enumeration = (...values) => ({ type: "string", enum: values });
const list = (items, minItems = 0) => ({ type: "array", items, minItems, maxItems: 500, uniqueItems: true });
const object = (properties) => ({ type: "object", additionalProperties: false, properties, required: Object.keys(properties) });
const nullable = (value) => ({ anyOf: [value, { type: "null" }] });
const timestamp = { type: "string", format: "date-time" };
const hash = { type: "string", pattern: "^[a-f0-9]{64}$" };
const refs = () => list(id);
const coverage = object({ extent: enumeration("complete", "partial", "missing"), limitations: text });
const approval = object({ status: enumeration("pending", "approved", "rejected"), reviewer_id: nullable(id), reviewed_at: nullable(timestamp), content_sha256: nullable(hash) });
const attribution = object({ mode: enumeration("unattributed", "named_talk"), talk_id: nullable(id) });
const claim = object({
  claim_id: id, text, kind: enumeration("observation", "hypothesis", "interpretation", "proposal", "documented_agreement"),
  evidence_ids: list(id, 1), session_ids: list(id, 1), attribution,
  verification: enumeration("unverified", "verified", "disputed"), uncertainty: text,
});
const claims = () => list(claim);
const common = {
  external_id: id, record_version: { type: "integer", minimum: 1 }, title: text,
  topic_ids: list(enumeration(...Object.keys(TOPICS)), 1), coverage,
  scientific_review: approval, publication_approval: approval, language_review: approval,
};
export const RECORD_SCHEMAS = {
  workshop_sessions: object({ ...common, session_kind: enumeration("talk_session", "discussion"),
    starts_at: timestamp, ends_at: timestamp, timezone: text, programme_order: { type: "integer", minimum: 1 },
    programme_evidence_ids: list(id, 1), summary: claims() }),
  talks: object({ ...common, session_id: id, programme_order: { type: "integer", minimum: 1 },
    programme_evidence_ids: list(id, 1), speaker_names: list(text), summary: claims() }),
  video_highlights: object({ ...common, session_id: id, talk_id: nullable(id),
    youtube_id: nullable({ type: "string", pattern: "^[A-Za-z0-9_-]{11}$" }), video_kind: { const: "highlight" },
    representative_version: text, mapping_evidence_ids: list(id, 1),
    mapping_verified: { type: "boolean" }, visually_reviewed: { type: "boolean" }, permission_verified: { type: "boolean" },
    caption: claims() }),
  scientific_questions: object({ ...common, session_ids: list(id, 1),
    classification: enumeration(...Object.keys(CLASSIFICATIONS)), classification_basis: { ...claim },
    background: claims(), position_ids: refs(), supporting_evidence_ids: refs(),
    uncertainties: claims(), scientific_interpretation: claims(), talk_ids: refs(), video_ids: refs(), action_ids: refs(), finding_ids: refs() }),
  scientific_positions: object({ ...common, question_id: id, session_ids: list(id, 1),
    position_kind: enumeration("hypothesis", "interpretation", "research_approach"),
    statement: claim, supporting_evidence_ids: refs(), challenging_evidence_ids: refs(), talk_ids: refs() }),
  evidence_references: object({ ...common, session_id: id, talk_id: nullable(id), contribution_id: id,
    source_document: object({ source_id: id, version: text, sha256: hash, title: text,
      kind: enumeration("reviewed_minutes", "official_programme", "approved_publication_derivative", "published_research"),
      review_status: enumeration("unreviewed", "reviewed", "superseded"),
      source_language: text }),
    passage: object({ locator: text, description: text }),
    evidence_role: enumeration("context", "supports", "challenges", "explicit_agreement", "programme", "video_mapping"),
    verification: enumeration("unverified", "verified", "disputed"), attribution }),
  scientific_findings: object({ ...common, question_ids: list(id, 1), session_ids: list(id, 1), statement: claim }),
  research_actions: object({ ...common, question_ids: list(id, 1), session_ids: list(id, 1),
    action_kind: { const: "illustrative_ai_workflow" }, rationale: claim, steps: list(claim, 1),
    expected_outputs: claims(), limitations: text, commitment: { const: "not_a_commitment" } }),
};
export const IMPORT_SCHEMA = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: "urn:mjo-workshop:scientific-import:1.0.0",
  title: "MJO Workshop reviewed scientific content export v1.0.0",
  ...object({ format: { const: "mjo-workshop-reviewed-content" }, schema_version: { const: VERSION },
    purpose: enumeration("reviewed_import", "test_fixture"), producer: { const: "editorial_export" },
    export_id: id, exported_at: timestamp, language: { const: "en" },
    records: object(Object.fromEntries(Object.entries(RECORD_SCHEMAS).map(([name, schema]) => [name, list(schema)]))) }),
};

// Scalar and collection links become native EmDash relations. Claim-level provenance
// stays inside strict JSON, using portable external IDs rather than CMS ULIDs.
export const RELATION_FIELDS = {
  workshop_sessions: { programme_evidence_ids: "evidence_references" },
  talks: { session_id: "workshop_sessions", programme_evidence_ids: "evidence_references" },
  video_highlights: { session_id: "workshop_sessions", talk_id: "talks", mapping_evidence_ids: "evidence_references" },
  scientific_questions: { session_ids: "workshop_sessions", position_ids: "scientific_positions", supporting_evidence_ids: "evidence_references", talk_ids: "talks", video_ids: "video_highlights", action_ids: "research_actions", finding_ids: "scientific_findings" },
  scientific_positions: { question_id: "scientific_questions", session_ids: "workshop_sessions", supporting_evidence_ids: "evidence_references", challenging_evidence_ids: "evidence_references", talk_ids: "talks" },
  evidence_references: { session_id: "workshop_sessions", talk_id: "talks" },
  scientific_findings: { question_ids: "scientific_questions", session_ids: "workshop_sessions" },
  research_actions: { question_ids: "scientific_questions", session_ids: "workshop_sessions" },
};
const label = (value) => value.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());
export function scienceSeed() {
  const relations = [];
  const collections = Object.entries(RECORD_SCHEMAS).map(([slug, schema]) => ({
    slug, label: COLLECTIONS[slug], supports: ["drafts", "revisions"],
    fields: Object.entries(schema.properties).map(([name, rule]) => {
      const base = { slug: name, label: label(name), required: !rule.anyOf };
      const target = RELATION_FIELDS[slug][name];
      if (target) {
        const relation = `${slug}_${name}`;
        relations.push({ slug: relation, parentCollection: slug, childCollection: target, parentLabel: COLLECTIONS[slug], childLabel: label(name), maxChildrenPerParent: rule.type === "array" ? null : 1 });
        return { ...base, required: false, type: "reference", validation: { relation, relationSide: "parent" } };
      }
      if (rule.enum || rule.const) return { ...base, type: "select", validation: { options: rule.enum ?? [rule.const] } };
      if (rule.type === "string") return { ...base, type: rule.format === "date-time" ? "datetime" : "string", ...(name === "external_id" ? { unique: true, indexed: true } : {}), validation: { ...(rule.pattern ? { pattern: rule.pattern } : {}), ...(rule.maxLength ? { maxLength: rule.maxLength } : {}) } };
      if (rule.type === "integer") return { ...base, type: "integer", validation: { min: rule.minimum } };
      if (rule.type === "boolean") return { ...base, type: "boolean" };
      if (name === "topic_ids") return { ...base, type: "multiSelect", validation: { options: Object.keys(TOPICS) } };
      return { ...base, type: "json" };
    }),
  }));
  return { $schema: "https://emdashcms.com/seed.schema.json", version: "1", collections, relations,
    taxonomies: [{ name: "scientific_topic", label: "Scientific Topics", hierarchical: false, collections: Object.keys(COLLECTIONS), terms: Object.entries(TOPICS).map(([slug, label]) => ({ slug, label })) }], content: {} };
}
