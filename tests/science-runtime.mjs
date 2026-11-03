// Uses the actual installed EmDash runtime, an in-memory database and no source material.
import assert from "node:assert/strict";
import { EmDashRuntime } from "emdash/internal/plugin-test-runtime";
import { sqlite } from "emdash/db";
import { createDialect } from "emdash/db/sqlite";
import { applySeed } from "emdash/seed";
import { createPlugin } from "../src/science/publication-policy.mjs";
import { scienceSeed } from "../src/science/contract.mjs";
import { RELATION_FIELDS } from "../src/science/contract.mjs";
import { fixtureBundle } from "./science-fixture.mjs";

const runtime = await EmDashRuntime.create({
  config: { database: sqlite({ url: ":memory:" }) },
  plugins: [createPlugin()], createDialect, createStorage: null, sandboxEnabled: false,
  sandboxedPluginEntries: [], createSandboxRunner: null,
});
try {
  await applySeed(runtime.db, scienceSeed(), { includeContent: false, onConflict: "error" });
  for (const [collection, records] of Object.entries(fixtureBundle().records)) {
    const data = { ...records[0] };
    for (const field of Object.keys(RELATION_FIELDS[collection])) delete data[field];
    const result = await runtime.handleContentCreate(collection, { data, status: "draft", slug: data.external_id });
    assert.equal(result.success, true, JSON.stringify(result));
    const id = result.data.item.id;
    const publish = await runtime.handleContentPublish(collection, id);
    assert.equal(publish.success, false); assert.equal(publish.error.code, "PUBLISH_REJECTED", JSON.stringify(publish));
    const schedule = await runtime.handleContentSchedule(collection, id, "2099-01-01T00:00:00Z");
    assert.equal(schedule.success, false); assert.equal(schedule.error.code, "SCHEDULE_REJECTED", JSON.stringify(schedule));
    console.log(`PASS ${collection}: actual runtime rejects publish and schedule`);
  }
} finally { await runtime.shutdown(); await runtime.db.destroy(); }
