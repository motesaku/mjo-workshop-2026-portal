import { RELATION_FIELDS } from "./contract.mjs";
import { digest, recordDigest, validateImport } from "./validate.mjs";

// Read-only preparation. No network, database writes or implicit publication.
export function prepareImport(bundle, previous = null) {
  for (const input of [bundle, previous].filter(Boolean)) {
    const result = validateImport(input);
    if (!result.valid) throw new Error(result.errors.join("\n"));
  }
  const old = new Map(Object.entries(previous?.records ?? {}).flatMap(([collection, rows]) => rows.map((record) => [record.external_id, { collection, record }])));
  const operations = [];
  for (const [collection, rows] of Object.entries(bundle.records)) for (const record of rows) {
    const prior = old.get(record.external_id);
    if (prior && (prior.collection !== collection || record.record_version < prior.record.record_version)) throw new Error(`${record.external_id}: collection change or version rollback`);
    if (prior && record.record_version === prior.record.record_version && digest(record) !== digest(prior.record)) throw new Error(`${record.external_id}: same-version content or approval conflict`);
    const data = { ...record };
    const references = {};
    for (const name of Object.keys(RELATION_FIELDS[collection])) {
      references[name] = (Array.isArray(data[name]) ? data[name] : data[name] === null ? [] : [data[name]]).map((external_id) => ({ collection: RELATION_FIELDS[collection][name], external_id }));
      delete data[name];
    }
    operations.push({ operation: prior && digest(record) === digest(prior.record) ? "skip" : prior ? "update_draft" : "create_draft",
      collection, external_id: record.external_id, expected_previous_sha256: prior ? digest(prior.record) : null,
      content_sha256: recordDigest(record), status: "draft", data, references, taxonomy: { scientific_topic: record.topic_ids } });
  }
  return { schema_version: bundle.schema_version, export_id: bundle.export_id, bundle_sha256: digest(bundle),
    mode: "dry_run_only", operations, omitted_records: [...old.keys()].filter((id) => !operations.some((op) => op.external_id === id)),
    omission_policy: "preserve_existing_records" };
}

// Derived indexes keep chronology independent from the cross-session topic graph.
// They are pure data functions, not a publication authorization mechanism.
export function navigationIndexes(bundle, options = {}) {
  const result = validateImport(bundle, options);
  if (!result.valid) throw new Error(result.errors.join("\n"));
  const r = bundle.records;
  return {
    programme: [...r.workshop_sessions].sort((a, b) => Date.parse(a.starts_at) - Date.parse(b.starts_at) || a.programme_order - b.programme_order || a.external_id.localeCompare(b.external_id)).map((s) => ({
      session_id: s.external_id, starts_at: s.starts_at, timezone: s.timezone, coverage: s.coverage,
      talk_ids: r.talks.filter((t) => t.session_id === s.external_id).sort((a, b) => a.programme_order - b.programme_order).map((t) => t.external_id),
      video_ids: r.video_highlights.filter((v) => v.session_id === s.external_id).map((v) => v.external_id),
      question_ids: r.scientific_questions.filter((q) => q.session_ids.includes(s.external_id)).map((q) => q.external_id),
    })),
    topics: Object.fromEntries(["ai_for_mjo_research", "mjo_indices_and_diagnostics"].map((topic) => [topic,
      r.scientific_questions.filter((q) => q.topic_ids.includes(topic)).map((q) => ({ question_id: q.external_id, session_ids: q.session_ids, classification: q.classification }))])),
  };
}
