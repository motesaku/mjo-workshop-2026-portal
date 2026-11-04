import assert from "node:assert/strict";

// Regression check for the local dev server. Never target a remote origin.
const origin = process.env.VERIFY_ORIGIN ?? "http://127.0.0.1:4321";
if (!["127.0.0.1", "localhost", "[::1]"].includes(new URL(origin).hostname)) throw new Error("verification only targets a loopback server");
for (const path of ["/", "/posts", "/_emdash/admin/"]) {
  const response = await fetch(new URL(path, origin));
  assert.equal(response.status, 200, `${path} must be accessible`);
  const html = await response.text();
  assert.match(html, /<html[^>]*lang="en"/, `${path} must render in English`);
  if (path === "/") {
    assert.match(html, /Knowledge &amp; Action Portal/);
    assert.match(html, /noindex, nofollow/);
  }
  if (path === "/_emdash/admin/") {
    assert.match(response.headers.get("cache-control") ?? "", /no-store/);
    assert.match(response.url, /\/_emdash\/admin\/(setup|login)\/?$/);
  }
  console.log(`PASS ${path}: 200, English HTML`);
}

for (const path of ["/.env", "/data.db", `/@fs/${process.cwd()}/data.db`]) {
  const response = await fetch(new URL(path, origin));
  // Consume without logging contents: a failing server might return private data.
  await response.arrayBuffer();
  assert.ok([403, 404].includes(response.status), `${path} must not be served (status ${response.status})`);
  console.log(`PASS private-file request blocked: ${response.status}`);
}
