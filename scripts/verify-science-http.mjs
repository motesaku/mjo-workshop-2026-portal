import assert from "node:assert/strict";
const origin = "http://127.0.0.1:4321";
for (const [path, expected] of [
  ["/program", "Programme records are in preparation"],
  ["/questions", "Diverging Perspectives"],
  ["/topics/ai_for_mjo_research", "AI for MJO Research"],
  ["/topics/mjo_indices_and_diagnostics", "MJO Indices and Diagnostics"],
]) {
  const response = await fetch(origin + path); const html = await response.text();
  assert.equal(response.status, 200); assert.match(html, /<html[^>]*lang="en"/);
  assert.ok(html.includes(expected)); assert.ok(!html.includes("TEST ONLY"));
  assert.ok(!html.includes("<iframe")); assert.match(html, /noindex, nofollow/);
  console.log(`PASS ${path}: English empty state, no fixtures or video embeds`);
}
assert.equal((await fetch(origin + "/topics/unknown")).status, 404);
console.log("PASS unknown topic returns HTTP 404");
