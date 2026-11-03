import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { validateSeed } from "emdash/seed";
import { contentCreateBody, contentUpdateBody } from "emdash/api/schemas";
import { COLLECTIONS, IMPORT_SCHEMA, scienceSeed } from "../src/science/contract.mjs";
import { allClaims, digest, recordDigest, validateImport } from "../src/science/validate.mjs";
import { navigationIndexes, prepareImport } from "../src/science/import-plan.mjs";
import { scientificPublicationDecision } from "../src/science/publication-policy.mjs";
import { fixtureBundle } from "./science-fixture.mjs";

const checked = (b) => validateImport(b, { allowFixtures: true });
const assertValid = (b, options) => { const result = validateImport(b, options); assert.deepEqual(result.errors, []); };
function approve(bundle) {
  for (const rows of Object.values(bundle.records)) for (const r of rows) {
    for (const field of ["scientific_review", "publication_approval", "language_review"]) r[field] = {
      status: "approved", reviewer_id: "example-reviewer", reviewed_at: "2000-01-02T23:00:00Z", content_sha256: recordDigest(r),
    };
  }
  return bundle;
}
// In-memory validator input only, never a seed/export or a claimed real review.
function reviewedCandidate() {
  const b = JSON.parse(JSON.stringify(fixtureBundle()).replaceAll("test-", "example-"));
  b.purpose = "reviewed_import";
  for (const rows of Object.values(b.records)) for (const r of rows) {
    allClaims(r).forEach((c) => c.verification = "verified");
    if (r.source_document) { r.verification = "verified"; r.source_document.review_status = "reviewed"; }
    if (r.video_kind) { r.youtube_id = "EXAMPLE_001"; r.mapping_verified = r.visually_reviewed = r.permission_verified = true; }
  }
  return approve(b);
}

test("versioned JSON and schema-only seed match single source", () => {
  assert.deepEqual(JSON.parse(readFileSync("schemas/scientific-import-v1.schema.json", "utf8")), IMPORT_SCHEMA);
  assert.deepEqual(JSON.parse(readFileSync("seed/science-schema-v1.json", "utf8")), scienceSeed());
  assert.deepEqual(JSON.parse(readFileSync("tests/fixtures/scientific-architecture-v1.json", "utf8")), fixtureBundle());
  assert.equal(validateSeed(scienceSeed()).valid, true);
  assert.equal(scienceSeed().collections.length, 8);
  const combined = JSON.parse(readFileSync("seed/seed.json", "utf8"));
  assert.equal(validateSeed(combined).valid, true);
  for (const slug of Object.keys(COLLECTIONS)) assert.deepEqual(combined.collections.find((c) => c.slug === slug), scienceSeed().collections.find((c) => c.slug === slug));
  assert.deepEqual(scienceSeed().content, {});
  assert.ok(Object.values(combined.content).every((records) => records.length === 0));
});
test("representative graph covers all collections and four classifications", () => {
  const b = fixtureBundle(); assertValid(b, { allowFixtures: true });
  assert.ok(Object.values(b.records).every((records) => records.length > 0));
  assert.equal(new Set(b.records.scientific_questions.map((q) => q.classification)).size, 4);
  assert.equal(b.records.video_highlights[0].youtube_id, null);
});
test("fixture flag alone never authorizes import or a plan", () => {
  assert.equal(validateImport(fixtureBundle()).valid, false);
  assert.throws(() => prepareImport(fixtureBundle()), /test fixtures/);
  const b = fixtureBundle(); b.purpose = "reviewed_import";
  assert.equal(validateImport(b).valid, false);
});

const cases = [
  ["unsupported version", (b) => b.schema_version = "2.0.0", "unexpected constant"],
  ["wrong language", (b) => b.language = "ja", "unexpected constant"],
  ["unknown property", (b) => b.records.research_actions[0].owner = "someone", "unknown field"],
  ["missing uncertainty section", (b) => delete b.records.scientific_questions[0].uncertainties, "required"],
  ["empty background statement", (b) => b.records.scientific_questions[0].background[0].text = "   ", "pattern"],
  ["no claim evidence", (b) => b.records.scientific_findings[0].statement.evidence_ids = [], "item count"],
  ["unknown topic", (b) => b.records.talks[0].topic_ids = ["mixed_ai_diagnostics"], "vocabulary"],
  ["invalid ID", (b) => b.records.talks[0].external_id = "../escape", "pattern"],
  ["duplicate record ID", (b) => b.records.talks.push({ ...b.records.talks[0], title: "TEST ONLY: duplicate" }), "duplicate external ID"],
  ["dangling reference", (b) => b.records.scientific_questions[0].talk_ids.push("test-absent"), "unresolved"],
  ["wrong reference type", (b) => b.records.scientific_questions[0].talk_ids = ["test-highlight"], "wrong-type"],
  ["duplicate reference", (b) => b.records.scientific_questions[0].talk_ids.push("test-talk"), "duplicate items"],
  ["reverse position mismatch", (b) => b.records.scientific_positions[0].question_id = "test-question-1", "another question"],
  ["reverse action mismatch", (b) => b.records.research_actions[0].question_ids = ["test-question-1"], "backlink mismatch"],
  ["claim crosses session without provenance", (b) => b.records.scientific_findings[0].statement.session_ids.push("test-session-discussion"), "needs passage provenance"],
  ["unrelated passage", (b) => b.records.scientific_findings[0].statement.evidence_ids = ["test-evidence-1-a"], "outside claim scope"],
  ["supporting evidence from unrelated session", (b) => b.records.scientific_questions[0].supporting_evidence_ids.push("test-evidence-1-a"), "linked evidence outside record session"],
  ["missing source locator", (b) => b.records.evidence_references[0].passage.locator = "", "text length"],
  ["source hash conflict", (b) => { b.records.evidence_references[1].source_document = { ...b.records.evidence_references[0].source_document, sha256: "1".repeat(64) }; }, "conflicting hashes"],
  ["unrecorded agreement", (b) => b.records.evidence_references.find((e) => e.external_id === "test-evidence-3-a").evidence_role = "context", "explicit recorded agreement"],
  ["agreement inferred from another class", (b) => b.records.scientific_questions[0].classification = "documented_agreements", "explicit agreement claim"],
  ["agreement in unreviewable source kind", (b) => b.records.evidence_references.find((e) => e.external_id === "test-evidence-3-a").source_document.kind = "published_research", "reviewed minutes"],
  ["single contribution alignment", (b) => b.records.evidence_references.find((e) => e.external_id === "test-evidence-1-b").contribution_id = b.records.evidence_references.find((e) => e.external_id === "test-evidence-1-a").contribution_id, "independently identified"],
  ["single position divergence", (b) => b.records.scientific_questions[0].position_ids.pop(), "multiple positions"],
  ["unattributed claim with talk", (b) => b.records.scientific_findings[0].statement.attribution.talk_id = "test-talk", "unattributed"],
  ["named discussion attribution", (b) => b.records.scientific_questions[1].classification_basis.attribution = { mode: "named_talk", talk_id: "test-talk" }, "official individual talks"],
  ["speaker without programme passage", (b) => b.records.talks[0].speaker_names = ["TEST ONLY speaker"], "talk-specific official programme"],
  ["invented content with missing coverage", (b) => b.records.scientific_questions[0].coverage.extent = "missing", "reconstructed claims"],
  ["position kind mismatch", (b) => b.records.scientific_positions[0].statement.kind = "observation", "position kind"],
  ["talk in discussion", (b) => b.records.talks[0].session_id = "test-session-discussion", "talk session"],
  ["video talk mismatch", (b) => b.records.video_highlights[0].session_id = "test-session-discussion", "talk/session mismatch"],
  ["full video instead of highlight", (b) => b.records.video_highlights[0].video_kind = "full_recording", "unexpected constant"],
  ["bad YouTube ID", (b) => b.records.video_highlights[0].youtube_id = "invalid!", "invalid nullable"],
  ["backwards session", (b) => b.records.workshop_sessions[0].ends_at = "1999-01-01T09:00:00Z", "end must follow"],
  ["timezone omission", (b) => b.records.workshop_sessions[0].starts_at = "2000-01-01T09:00:00", "ISO timestamp"],
  ["nonexistent date", (b) => b.records.workshop_sessions[0].starts_at = "2000-02-30T09:00:00Z", "ISO timestamp"],
  ["bad timezone", (b) => b.records.workshop_sessions[0].timezone = "Unknown/Zone", "IANA timezone"],
  ["private path", (b) => b.records.evidence_references[0].passage.description = "/Users/owner/private/minutes", "private paths"],
  ["download link", (b) => b.records.evidence_references[0].passage.description = "https://example.org/source.pdf", "source attachments"],
  ["raw HTML", (b) => b.records.scientific_questions[0].background[0].text = "<script>alert(1)</script>", "markup"],
  ["action is a commitment", (b) => b.records.research_actions[0].commitment = "agreed", "unexpected constant"],
  ["action asserts completed observation", (b) => b.records.research_actions[0].steps[0].kind = "observation", "remain a proposal"],
];
for (const [name, mutate, message] of cases) test(`reject ${name}`, () => {
  const b = fixtureBundle(); mutate(b); const result = checked(b);
  assert.equal(result.valid, false); assert.ok(result.errors.some((e) => e.includes(message)), result.errors.join("\n"));
});

test("three approvals bind the exact record including claim provenance", () => {
  const b = reviewedCandidate(); assertValid(b);
  b.records.scientific_findings[0].statement.uncertainty += " Changed.";
  assert.match(validateImport(b).errors.join("\n"), /current record approval/);
});
for (const field of ["scientific_review", "publication_approval", "language_review"]) test(`reject missing ${field}`, () => {
  const b = reviewedCandidate(); b.records.talks[0][field].status = "pending";
  assert.equal(validateImport(b).valid, false);
});
for (const field of ["mapping_verified", "visually_reviewed", "permission_verified"]) test(`reject unchecked video ${field}`, () => {
  const b = reviewedCandidate(); b.records.video_highlights[0][field] = false; approve(b);
  assert.match(validateImport(b).errors.join("\n"), /verified highlight/);
});
test("disputed claims and superseded sources cannot enter a reviewed import", () => {
  const b = reviewedCandidate(); b.records.scientific_findings[0].statement.verification = "disputed";
  b.records.evidence_references[0].source_document.review_status = "superseded"; approve(b);
  const errors = validateImport(b).errors.join("\n"); assert.match(errors, /disputed claim/); assert.match(errors, /source and passage/);
});
test("dry-run plan separates relation identities and never publishes", () => {
  const b = reviewedCandidate(); const plan = prepareImport(b);
  assert.equal(plan.mode, "dry_run_only"); assert.ok(plan.operations.every((o) => o.status === "draft" && o.operation === "create_draft"));
  const talk = plan.operations.find((o) => o.collection === "talks");
  assert.equal(talk.data.session_id, undefined); assert.equal(talk.references.session_id[0].collection, "workshop_sessions");
});
test("re-import is idempotent, rejects same-version changes and rollbacks, preserves omissions", () => {
  const previous = reviewedCandidate(); const b = structuredClone(previous);
  assert.ok(prepareImport(b, previous).operations.every((o) => o.operation === "skip"));
  b.records.talks[0].title += " changed"; approve(b);
  assert.throws(() => prepareImport(b, previous), /same-version/);
  b.records.talks[0].record_version += 1; approve(b);
  assert.equal(prepareImport(b, previous).operations.find((o) => o.collection === "talks").operation, "update_draft");
  assert.throws(() => prepareImport(previous, b), /rollback/);
  const empty = { ...b, records: Object.fromEntries(Object.keys(COLLECTIONS).map((key) => [key, []])) };
  assert.equal(prepareImport(empty, previous).operations.length, 0);
  assert.ok(prepareImport(empty, previous).omitted_records.length > 0);
});
test("chronology is independent from topic navigation and spans sessions", () => {
  const b = fixtureBundle(); const q = b.records.scientific_questions[0];
  q.session_ids.push("test-session-discussion"); q.topic_ids.push("mjo_indices_and_diagnostics");
  b.records.workshop_sessions.reverse();
  const nav = navigationIndexes(b, { allowFixtures: true });
  assert.equal(nav.programme[0].session_id, "test-session-talk");
  assert.ok(nav.programme.every((s) => s.question_ids.includes(q.external_id)));
  assert.ok(Object.values(nav.topics).every((questions) => questions.some((r) => r.question_id === q.external_id)));
});
test("canonical digest is insensitive to object key order", () => assert.equal(digest({ b: 2, a: 1 }), digest({ a: 1, b: 2 })));
test("Phase 3 policy rejects every scientific collection regardless of review checkboxes", () => {
  for (const collection of Object.keys(COLLECTIONS)) assert.equal(scientificPublicationDecision({ collection, content: { scientific_review: "approved" } }).cancel, true);
  assert.equal(scientificPublicationDecision({ collection: "posts" }), undefined);
});
test("installed HTTP write schemas reject published status on create and update", () => {
  assert.equal(contentCreateBody.safeParse({ data: {}, status: "published" }).success, false);
  assert.equal(contentUpdateBody.safeParse({ data: {}, status: "published" }).success, false);
});
