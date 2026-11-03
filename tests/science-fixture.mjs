import { COLLECTIONS, VERSION } from "../src/science/contract.mjs";

// Artificial relationship fixtures. No workshop assertions, identities or playable IDs.
export function fixtureBundle() {
  const pending = () => ({ status: "pending", reviewer_id: null, reviewed_at: null, content_sha256: null });
  const common = (external_id, topic_ids = ["ai_for_mjo_research"]) => ({ external_id, record_version: 1,
    title: `TEST ONLY: ${external_id}`, topic_ids, coverage: { extent: "partial", limitations: "TEST ONLY: artificial record; no workshop coverage is asserted." },
    scientific_review: pending(), publication_approval: pending(), language_review: pending() });
  const anon = () => ({ mode: "unattributed", talk_id: null });
  const claim = (claim_id, evidence_ids, session_ids, kind = "interpretation") => ({ claim_id,
    text: "TEST ONLY: structural validation placeholder; this is not a scientific statement.", kind, evidence_ids, session_ids, attribution: anon(), verification: "unverified", uncertainty: "TEST ONLY: no scientific interpretation has been evaluated." });
  const records = Object.fromEntries(Object.keys(COLLECTIONS).map((key) => [key, []]));
  const session = "test-session-talk"; const discussion = "test-session-discussion";
  records.workshop_sessions = [
    { ...common(session), session_kind: "talk_session", starts_at: "2000-01-01T09:00:00+01:00", ends_at: "2000-01-01T10:00:00+01:00", timezone: "Europe/Rome", programme_order: 1, programme_evidence_ids: ["test-programme-talk"], summary: [] },
    { ...common(discussion, ["mjo_indices_and_diagnostics"]), session_kind: "discussion", starts_at: "2000-01-02T09:00:00+01:00", ends_at: "2000-01-02T10:00:00+01:00", timezone: "Europe/Rome", programme_order: 2, programme_evidence_ids: ["test-programme-discussion"], summary: [] },
  ];
  const evidence = (id, sid, role, kind = "reviewed_minutes", talk_id = null) => ({ ...common(id), session_id: sid, talk_id, contribution_id: `test-contribution-${records.evidence_references.length}`,
    source_document: { source_id: `test-document-${id}`, version: "fixture-1", sha256: "0".repeat(64), title: "TEST ONLY: nonexistent source document", kind, review_status: "unreviewed", source_language: "en" },
    passage: { locator: "TEST ONLY: section placeholder", description: "TEST ONLY: locator metadata, not a quotation." }, evidence_role: role, verification: "unverified", attribution: anon() });
  records.evidence_references.push(evidence("test-programme-talk", session, "programme", "official_programme"));
  records.evidence_references.push(evidence("test-programme-discussion", discussion, "programme", "official_programme"));
  records.talks.push({ ...common("test-talk"), session_id: session, programme_order: 1, programme_evidence_ids: ["test-programme-talk"], speaker_names: [], summary: [] });
  records.evidence_references.push(evidence("test-video-map", session, "video_mapping", "approved_publication_derivative", "test-talk"));
  records.video_highlights.push({ ...common("test-highlight"), session_id: session, talk_id: "test-talk", youtube_id: null,
    video_kind: "highlight", representative_version: "TEST ONLY: no video selected", mapping_evidence_ids: ["test-video-map"], mapping_verified: false, visually_reviewed: false, permission_verified: false, caption: [] });
  for (const [i, classification] of ["diverging_perspectives", "emerging_alignment", "open_questions", "documented_agreements"].entries()) {
    const qid = `test-question-${i}`;
    const sid = i % 2 ? discussion : session;
    const e1 = `test-evidence-${i}-a`, e2 = `test-evidence-${i}-b`;
    records.evidence_references.push(evidence(e1, sid, i === 3 ? "explicit_agreement" : "supports"));
    records.evidence_references.push(evidence(e2, sid, "supports"));
    const pids = [`test-position-${i}-a`, `test-position-${i}-b`];
    for (const [j, pid] of pids.entries()) records.scientific_positions.push({ ...common(pid), question_id: qid, session_ids: [sid], position_kind: "hypothesis", statement: claim(`test-claim-${pid}`, [j ? e2 : e1], [sid], "hypothesis"), supporting_evidence_ids: [j ? e2 : e1], challenging_evidence_ids: [], talk_ids: [] });
    records.scientific_questions.push({ ...common(qid, i % 2 ? ["mjo_indices_and_diagnostics"] : ["ai_for_mjo_research"]), session_ids: [sid], classification,
      classification_basis: claim(`test-classification-${i}`, [e1, e2], [sid], i === 3 ? "documented_agreement" : "interpretation"),
      background: [claim(`test-background-${i}`, [e1], [sid])], position_ids: pids, supporting_evidence_ids: [e1, e2],
      uncertainties: [claim(`test-uncertainty-${i}`, [e1], [sid])], scientific_interpretation: [], talk_ids: sid === session ? ["test-talk"] : [], video_ids: sid === session ? ["test-highlight"] : [], action_ids: [], finding_ids: [] });
  }
  const q = records.scientific_questions[0]; const eid = q.supporting_evidence_ids[0];
  q.action_ids.push("test-action"); q.finding_ids.push("test-finding");
  records.scientific_findings.push({ ...common("test-finding"), question_ids: [q.external_id], session_ids: [session], statement: claim("test-finding-claim", [eid], [session], "observation") });
  records.research_actions.push({ ...common("test-action"), question_ids: [q.external_id], session_ids: [session], action_kind: "illustrative_ai_workflow", rationale: claim("test-rationale", [eid], [session], "proposal"), steps: [claim("test-step", [eid], [session], "proposal")], expected_outputs: [], limitations: "TEST ONLY: no execution or outcome is asserted.", commitment: "not_a_commitment" });
  return { format: "mjo-workshop-reviewed-content", schema_version: VERSION, purpose: "test_fixture", producer: "researcher_os", export_id: "test-export", exported_at: "2000-01-03T00:00:00Z", language: "en", records };
}
