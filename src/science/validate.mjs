import { createHash } from "node:crypto";
import { IMPORT_SCHEMA, RELATION_FIELDS } from "./contract.mjs";

const canonical = (v) => JSON.stringify(v && typeof v === "object" ? Array.isArray(v) ? v.map((x) => JSON.parse(canonical(x))) : Object.fromEntries(Object.keys(v).sort().map((k) => [k, JSON.parse(canonical(v[k]))])) : v);
export const digest = (value) => createHash("sha256").update(canonical(value)).digest("hex");
export function recordDigest(record) {
  const { scientific_review, publication_approval, language_review, ...payload } = record;
  return digest(payload);
}

// Deliberately limited evaluator for the vocabulary used by IMPORT_SCHEMA.
// It is not advertised as a general JSON Schema implementation.
export function shapeErrors(value, rule = IMPORT_SCHEMA, path = "$", errors = []) {
  if (rule.anyOf) {
    if (!rule.anyOf.some((branch) => shapeErrors(value, branch, path, []).length === 0)) errors.push(`${path}: invalid nullable value`);
    return errors;
  }
  if (rule.const !== undefined && value !== rule.const) errors.push(`${path}: unexpected constant`);
  if (rule.enum && !rule.enum.includes(value)) errors.push(`${path}: value outside controlled vocabulary`);
  if (rule.type) {
    const valid = rule.type === "null" ? value === null : rule.type === "array" ? Array.isArray(value) : rule.type === "object" ? value !== null && typeof value === "object" && !Array.isArray(value) : rule.type === "integer" ? Number.isSafeInteger(value) : typeof value === rule.type;
    if (!valid) { errors.push(`${path}: expected ${rule.type}`); return errors; }
  }
  if (rule.type === "object") {
    for (const key of rule.required) if (!Object.hasOwn(value, key)) errors.push(`${path}.${key}: required`);
    for (const key of Object.keys(value)) {
      if (!Object.hasOwn(rule.properties, key)) errors.push(`${path}: unknown field`);
      else shapeErrors(value[key], rule.properties[key], `${path}.${key}`, errors);
    }
  }
  if (rule.type === "array") {
    if (value.length < rule.minItems || value.length > rule.maxItems) errors.push(`${path}: invalid item count`);
    if (rule.uniqueItems && new Set(value.map(canonical)).size !== value.length) errors.push(`${path}: duplicate items`);
    value.forEach((v, i) => shapeErrors(v, rule.items, `${path}[${i}]`, errors));
  }
  if (typeof value === "string") {
    if (value.length < (rule.minLength ?? 0) || value.length > (rule.maxLength ?? Infinity)) errors.push(`${path}: invalid text length`);
    if (rule.pattern && !new RegExp(rule.pattern).test(value)) errors.push(`${path}: invalid text pattern`);
    if (rule.format === "date-time" && !validTimestamp(value)) errors.push(`${path}: explicit valid ISO timestamp required`);
  }
  if (rule.minimum !== undefined && value < rule.minimum) errors.push(`${path}: value below minimum`);
  return errors;
}
function validTimestamp(value) {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2})$/.test(value) || !Number.isFinite(Date.parse(value))) return false;
  const [y, m, d] = value.slice(0, 10).split("-").map(Number);
  const [hour, minute, second] = value.slice(11, 19).split(":").map(Number);
  return hour < 24 && minute < 60 && second < 60 && m >= 1 && m <= 12 && d >= 1 && d <= new Date(Date.UTC(y, m, 0)).getUTCDate();
}
export function allClaims(record) {
  const result = [];
  const visit = (v) => { if (!v || typeof v !== "object") return; if (Object.hasOwn(v, "claim_id")) result.push(v); else Object.values(v).forEach(visit); };
  visit(record); return result;
}
export function validateImport(bundle, { allowFixtures = false } = {}) {
  const errors = shapeErrors(bundle);
  if (errors.length) return { valid: false, errors };
  const fixture = bundle.purpose === "test_fixture";
  const fail = (id, message) => errors.push(`${id}: ${message}`);
  if (fixture && !allowFixtures) fail("$", "test fixtures cannot enter the import path");
  const records = bundle.records;
  const index = new Map();
  for (const [collection, rows] of Object.entries(records)) for (const record of rows) {
    if (index.has(record.external_id)) fail(record.external_id, "duplicate external ID across collections");
    index.set(record.external_id, { collection, record });
  }
  const lookup = (id, collection, owner) => {
    const found = index.get(id);
    if (!found || found.collection !== collection) { fail(owner, `unresolved or wrong-type ${collection} reference`); return null; }
    return found.record;
  };
  const sourceVersions = new Map();
  for (const [collection, rows] of Object.entries(records)) for (const r of rows) {
    const owner = r.external_id;
    if (!fixture && /^test[-_]/.test(owner)) fail(owner, "test ID forbidden in reviewed import");
    for (const [field, target] of Object.entries(RELATION_FIELDS[collection])) {
      for (const id of Array.isArray(r[field]) ? r[field] : r[field] === null ? [] : [r[field]]) {
        const linked = lookup(id, target, owner);
        if (target === "evidence_references" && linked && !(r.session_ids ?? [r.session_id ?? owner]).includes(linked.session_id)) fail(owner, "linked evidence outside record session scope");
      }
    }
    if (!fixture) for (const field of ["scientific_review", "publication_approval", "language_review"]) {
      const a = r[field];
      if (a.status !== "approved" || !a.reviewer_id || !a.reviewed_at || a.content_sha256 !== recordDigest(r)) fail(owner, `${field}: current record approval required`);
      if (a.reviewed_at && Date.parse(a.reviewed_at) > Date.parse(bundle.exported_at)) fail(owner, "approval postdates export");
    }
    if (collection === "workshop_sessions") {
      if (Date.parse(r.ends_at) <= Date.parse(r.starts_at)) fail(owner, "session end must follow start");
      try { new Intl.DateTimeFormat("en", { timeZone: r.timezone }); } catch { fail(owner, "invalid IANA timezone"); }
    }
    if (collection === "talks") {
      if (lookup(r.session_id, "workshop_sessions", owner)?.session_kind !== "talk_session") fail(owner, "named talks belong only to a talk session");
      if (r.speaker_names.length && !r.programme_evidence_ids.some((id) => lookup(id, "evidence_references", owner)?.talk_id === owner)) fail(owner, "named speakers need a talk-specific official programme passage");
    }
    if (r.programme_evidence_ids) for (const id of r.programme_evidence_ids) {
      const e = lookup(id, "evidence_references", owner);
      if (e && (e.source_document.kind !== "official_programme" || e.evidence_role !== "programme" || e.session_id !== (r.session_id ?? owner))) fail(owner, "official programme evidence must match the session");
    }
    if (collection === "video_highlights") {
      if (!fixture && (!r.youtube_id || !r.mapping_verified || !r.visually_reviewed || !r.permission_verified)) fail(owner, "verified highlight ID, mapping, visual review and permission required");
      for (const id of r.mapping_evidence_ids) {
        const e = lookup(id, "evidence_references", owner);
        if (e && (e.evidence_role !== "video_mapping" || e.session_id !== r.session_id || e.talk_id !== r.talk_id)) fail(owner, "video mapping must match session and talk");
      }
    }
    if (r.talk_id) {
      const talk = lookup(r.talk_id, "talks", owner);
      if (talk && talk.session_id !== r.session_id) fail(owner, "talk/session mismatch");
    }
    if (collection === "evidence_references") {
      const s = r.source_document;
      const key = `${s.source_id}@${s.version}`;
      if (sourceVersions.has(key) && sourceVersions.get(key) !== s.sha256) fail(owner, "same source version has conflicting hashes");
      sourceVersions.set(key, s.sha256);
      if (!fixture && (r.verification !== "verified" || s.review_status !== "reviewed")) fail(owner, "source and passage must be reviewed and verified");
      if (r.evidence_role === "explicit_agreement" && s.kind !== "reviewed_minutes") fail(owner, "agreements require reviewed minutes");
      checkAttribution(r.attribution, [r.session_id], owner);
      if (r.attribution.mode === "named_talk" && r.attribution.talk_id !== r.talk_id) fail(owner, "passage attribution must match its talk");
    }
    const claimIds = new Set();
    if (r.coverage.extent === "missing" && allClaims(r).length) fail(owner, "missing coverage cannot contain reconstructed claims");
    for (const c of allClaims(r)) {
      if (claimIds.has(c.claim_id)) fail(owner, "duplicate claim ID within record");
      claimIds.add(c.claim_id);
      if (!fixture && c.verification !== "verified") fail(owner, "unverified or disputed claim cannot be imported");
      for (const id of c.session_ids) {
        lookup(id, "workshop_sessions", owner);
        const allowed = r.session_ids ?? [r.session_id ?? owner];
        if (!allowed.includes(id)) fail(owner, "claim session outside record scope");
      }
      const evidence = c.evidence_ids.map((id) => lookup(id, "evidence_references", owner)).filter(Boolean);
      for (const sid of c.session_ids) if (!evidence.some((e) => e.session_id === sid)) fail(owner, "each claim session needs passage provenance");
      if (evidence.some((e) => !c.session_ids.includes(e.session_id))) fail(owner, "evidence session outside claim scope");
      if (c.kind === "documented_agreement" && !evidence.some((e) => e.evidence_role === "explicit_agreement" && e.source_document.kind === "reviewed_minutes")) fail(owner, "explicit recorded agreement required; silence is insufficient");
      checkAttribution(c.attribution, c.session_ids, owner);
      if (c.attribution.mode === "named_talk" && !evidence.some((e) => e.talk_id === c.attribution.talk_id)) fail(owner, "named claim requires matching talk passage");
    }
    if (collection === "scientific_questions") {
      const positions = r.position_ids.map((id) => lookup(id, "scientific_positions", owner)).filter(Boolean);
      if (positions.some((p) => p.question_id !== owner)) fail(owner, "position belongs to another question");
      const basis = r.classification_basis;
      const evidence = basis.evidence_ids.map((id) => lookup(id, "evidence_references", owner)).filter(Boolean);
      if (["diverging_perspectives", "emerging_alignment"].includes(r.classification)) {
        if (positions.length < 2 || new Set(evidence.map((e) => e.contribution_id)).size < 2) fail(owner, "classification needs multiple positions and independently identified contributions");
        if (positions.some((p) => !p.statement.evidence_ids.some((id) => basis.evidence_ids.includes(id)))) fail(owner, "classification must cite each position contribution");
      }
      if (r.classification === "documented_agreements" && basis.kind !== "documented_agreement") fail(owner, "documented agreement classification requires explicit agreement claim");
      if (r.classification !== "documented_agreements" && basis.kind !== "interpretation") fail(owner, "non-agreement classification is an editorial interpretation");
      for (const [field, target] of [["action_ids", "research_actions"], ["finding_ids", "scientific_findings"]]) for (const id of r[field]) {
        if (!lookup(id, target, owner)?.question_ids.includes(owner)) fail(owner, "question backlink mismatch");
      }
      for (const id of r.talk_ids) if (!r.session_ids.includes(lookup(id, "talks", owner)?.session_id)) fail(owner, "related talk outside question sessions");
      for (const id of r.video_ids) if (!r.session_ids.includes(lookup(id, "video_highlights", owner)?.session_id)) fail(owner, "related video outside question sessions");
    }
    if (["scientific_positions", "scientific_findings", "research_actions"].includes(collection)) {
      const field = { scientific_positions: "position_ids", scientific_findings: "finding_ids", research_actions: "action_ids" }[collection];
      for (const id of r.question_ids ?? [r.question_id]) {
        const q = lookup(id, "scientific_questions", owner);
        if (q && (!q[field].includes(owner) || r.session_ids.some((sid) => !q.session_ids.includes(sid)))) fail(owner, "question relationship or session scope mismatch");
      }
    }
    if (collection === "research_actions" && [r.rationale, ...r.steps, ...r.expected_outputs].some((c) => c.kind !== "proposal")) fail(owner, "workflow text must remain a proposal");
    if (collection === "scientific_positions" && r.statement.kind !== (r.position_kind === "research_approach" ? "proposal" : r.position_kind)) fail(owner, "position kind must match its claim kind");
  }
  function checkAttribution(a, sessionIds, owner) {
    if (a.mode === "unattributed" && a.talk_id !== null) fail(owner, "unattributed text cannot name a talk");
    if (a.mode === "named_talk") {
      const talk = a.talk_id && lookup(a.talk_id, "talks", owner);
      if (!talk || !sessionIds.includes(talk.session_id) || !talk.speaker_names.length || sessionIds.some((id) => lookup(id, "workshop_sessions", owner)?.session_kind !== "talk_session")) fail(owner, "named attribution allowed only for official individual talks");
    }
  }
  // Text is a publication derivative, never a download URL, raw HTML or private path.
  const scan = (value, path) => {
    if (typeof value === "string" && /(?:https?:\/\/|file:|\/Users\/|\/home\/|[A-Z]:\\|<[^>]+>|\b[^\s]+\.(?:pdf|docx?|pptx?|mp4|mov)\b)/i.test(value)) fail(path, "URLs, private paths, markup and source attachments are not accepted");
    else if (value && typeof value === "object") Object.entries(value).forEach(([key, v]) => scan(v, `${path}.${key}`));
  };
  scan(bundle.records, "$.records");
  return { valid: errors.length === 0, errors };
}
