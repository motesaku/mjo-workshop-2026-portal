import assert from "node:assert/strict";

// Local interface checks. Video playback is a separate manual browser check.
const origin = "http://127.0.0.1:4321";
const routes = ["/", "/program", "/videos", "/questions", "/diverging-perspectives", "/emerging-alignment", "/open-challenges", "/actions", "/ai-for-mjo-research", "/mjo-indices-and-diagnostics", "/about", "/videos/breakout-themes-3-4", "/questions/theory-and-modelling", "/actions/theory-and-modelling"];
const pages = new Map();
for (const path of routes) {
  const response = await fetch(origin + path);
  const html = await response.text();
  assert.equal(response.status, 200, path);
  assert.match(html, /<html[^>]*lang="en"/, path);
  assert.match(html, /noindex, nofollow/, path);
  assert.equal((html.match(/<h1(?:\s|>)/g) ?? []).length, 1, `${path}: single h1`);
  assert.match(html, /Skip to content/, path);
  assert.ok(!html.includes("TEST ONLY"), `${path}: no scientific test fixtures`);
  assert.ok(!/href=["'][^"']*\.(pdf|docx?|pptx?|mp4|mov|webm)(?:[?#][^"']*)?["']/i.test(html), `${path}: no original downloads`);
  for (const target of routes.slice(0, 11)) assert.ok(html.includes(`href="${target}"`), `${path}: navigation to ${target}`);
  pages.set(path, html);
  console.log(`PASS ${path}: English, navigation, draft boundary, no original downloads`);
}
const program = pages.get("/program");
for (const date of [26,27,28,29,30]) assert.ok(program.includes(`id="2026-10-${date}"`));
assert.match(program, /id="tue-breakout-3-4"/);
assert.match(program, /href="\/videos\/breakout-themes-3-4"/);
assert.match(program, /i\.ytimg\.com\/vi\//);
assert.match(pages.get("/videos"), /38 playlist highlights|playlist highlights/i);
const video = pages.get("/videos/breakout-themes-3-4");
assert.match(video, /RPXnSvabsGY/);
assert.match(video, /27 October 2026/);
assert.match(video, /16:30–18:00/);
assert.match(video, /61 seconds|60 seconds|1:01|1:00/);
assert.match(video, /Owner approved 2026-11-03|Owner playlist approval/);
assert.match(video, /Scientific summary pending|Scientific review pending|Awaiting review/);
assert.match(video, /Load YouTube player/);
assert.ok(!video.includes("<iframe"), "No YouTube connection before user request");
assert.match(video, /href="\/questions\/themes\/q01"/);
assert.match(video, /href="\/actions\/q01"/);
const hyemi = await fetch(origin + "/videos/hyemi-kim-prediction");
assert.equal(hyemi.status, 200);
assert.match(await hyemi.text(), /aPRvkP0cfNc/);
const legacyQ = await fetch(origin + "/questions/theory-and-modelling", { redirect: "follow" });
assert.equal(legacyQ.status, 200);
assert.match(await legacyQ.text(), /q01|Personal workshop report|distinguish competing/i);
const actionPage = await fetch(origin + "/actions/theory-and-modelling", { redirect: "follow" });
assert.equal(actionPage.status, 200);
const actionHtml = await actionPage.text();
assert.match(actionHtml, /not a commitment|Illustrative|Personal workshop report/i);
assert.match(pages.get("/questions"), /q01|Personal synthesis/);
assert.match(pages.get("/diverging-perspectives"), /Personal synthesis|diverging/);
for (const path of ["/videos/unknown", "/questions/unknown", "/actions/unknown", "/topics/unknown"]) {
  assert.equal((await fetch(origin + path)).status, 404, path);
}
console.log("PASS principal navigation links and unknown detail routes");
