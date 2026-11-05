// Phase 10 regression guards. Run: npm run test:phase10
//
// On 2026-11-05 a stale editor checkpoint was restored over the working tree and
// committed as a "refactor" (0d13cdb). Every existing test still passed, because the
// tests checked data modules but not whether pages, the Worker entry, the build
// wrapper and the npm scripts still used them. These tests close that gap without a
// running server. Rendered pages are checked by scripts/verify-phase10.mjs.
import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { highlights } from "../src/data/highlights.ts";
import { createRelationIndex } from "../src/science/phase8/relations.mjs";
import { relationContext } from "../src/science/phase9/context.mjs";
import { INSIGHTS_V2 } from "../src/science/phase9/synthesis.mjs";
import { PILOTS, DEPENDENCIES } from "../src/science/phase9/roadmap.mjs";
import { RELATIONSHIP_REVISIONS } from "../src/science/phase9/classification.mjs";
import { PHASE9_EDITORIAL } from "../src/science/phase9/status.mjs";
import { PRIORITY_AREAS } from "../src/science/phase8/editorial-roadmap.mjs";
import { ISSUE_RELATIONSHIPS, RELATIONSHIP_TYPES } from "../src/science/phase8/editorial-classification.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
const read = (path) => readFileSync(join(root, path), "utf8");
const pkg = JSON.parse(read("src/data/personal-synthesis.json"));
const packageJson = JSON.parse(read("package.json"));
const wrapper = join(root, "scripts/with-site-wrangler.mjs");
const node = process.execPath;

/** Strip // and /* *\/ comments outside strings, and trailing commas (JSONC). */
function parseJsonc(text) {
	let out = "";
	let inString = false;
	for (let i = 0; i < text.length; i++) {
		const ch = text[i];
		const next = text[i + 1];
		if (inString) {
			out += ch;
			if (ch === "\\") { out += next ?? ""; i++; } else if (ch === '"') inString = false;
		} else if (ch === '"') { inString = true; out += ch; }
		else if (ch === "/" && next === "/") { while (i < text.length && text[i] !== "\n") i++; out += "\n"; }
		else if (ch === "/" && next === "*") { i += 2; while (i < text.length && !(text[i] === "*" && text[i + 1] === "/")) i++; i++; }
		else out += ch;
	}
	return JSON.parse(out.replace(/,(\s*[}\]])/g, "$1"));
}

function sandbox() {
	const dir = mkdtempSync(join(tmpdir(), "phase10-wrangler-"));
	const template = '{ "name": "template-worker", "workers_dev": false }\n';
	const overlay = JSON.stringify({
		name: "fixture-worker",
		workers_dev: true,
		d1_databases: [{ binding: "DB", database_name: "fixture", database_id: "12345678-1234-4234-8234-123456789abc" }],
		vars: { EMDASH_SITE_URL: "https://fixture-site.invalid" },
	});
	writeFileSync(join(dir, "wrangler.jsonc"), template);
	writeFileSync(join(dir, "wrangler.site.jsonc"), overlay);
	return { dir, template, overlay };
}
const run = (dir, args) => spawnSync(node, [wrapper, ...args], { cwd: dir, encoding: "utf8" });
/** A harmless stand-in for `wrangler deploy`: prints a marker and exits 0. */
function noopCommand(dir) {
	writeFileSync(join(dir, "noop.mjs"), 'process.stdout.write("NOOP-RAN");\n');
	return [node, join(dir, "noop.mjs")];
}
const printEnv = ["-e", "process.stdout.write('CONFIG=' + (process.env.PORTAL_WRANGLER_CONFIG ?? ''))"];

test("build wrapper reads wrangler.site.jsonc in place and never copies it over the template", () => {
	const { dir, template, overlay } = sandbox();
	const result = run(dir, ["build", node, ...printEnv]);
	assert.equal(result.status, 0, result.stderr);
	assert.match(result.stdout, /CONFIG=\S*wrangler\.site\.jsonc/, "the overlay path reaches astro.config.mjs");
	assert.equal(readFileSync(join(dir, "wrangler.jsonc"), "utf8"), template, "template unchanged");
	assert.equal(readFileSync(join(dir, "wrangler.site.jsonc"), "utf8"), overlay, "overlay unchanged");
	const bare = mkdtempSync(join(tmpdir(), "phase10-bare-"));
	writeFileSync(join(bare, "wrangler.jsonc"), template);
	assert.match(run(bare, ["build", node, ...printEnv]).stdout, /CONFIG=$/, "no overlay: template is used");
});

test("deploy refuses without an overlay, without a matching build and without a release stamp", () => {
	const noOverlay = mkdtempSync(join(tmpdir(), "phase10-nooverlay-"));
	writeFileSync(join(noOverlay, "wrangler.jsonc"), "{}");
	const refusedOverlay = run(noOverlay, ["deploy", ...noopCommand(noOverlay)]);
	assert.notEqual(refusedOverlay.status, 0);
	assert.match(refusedOverlay.stderr, /refusing to deploy/);

	const { dir } = sandbox();
	const refusedBuild = run(dir, ["deploy", ...noopCommand(dir)]);
	assert.notEqual(refusedBuild.status, 0);
	assert.match(refusedBuild.stderr, /no build found/);

	// A build generated from the overlay, but no release-readiness stamp.
	const site = parseJsonc(readFileSync(join(dir, "wrangler.site.jsonc"), "utf8"));
	mkdirSync(join(dir, "dist/server"), { recursive: true });
	mkdirSync(join(dir, ".wrangler/deploy"), { recursive: true });
	writeFileSync(join(dir, "dist/server/wrangler.json"), JSON.stringify({ ...site, userConfigPath: join(dir, "wrangler.site.jsonc") }));
	writeFileSync(join(dir, ".wrangler/deploy/config.json"), JSON.stringify({ configPath: "../../dist/server/wrangler.json" }));
	const refusedStamp = run(dir, ["deploy", ...noopCommand(dir)]);
	assert.notEqual(refusedStamp.status, 0, "deploy must not run without a passing release check");
	assert.match(refusedStamp.stderr, /release:check/);
	assert.doesNotMatch(refusedStamp.stdout, /NOOP-RAN/, "the deploy command never started");
});

test("local mode refuses --remote", () => {
	const { dir } = sandbox();
	const result = run(dir, ["local", ...noopCommand(dir), "--remote"]);
	assert.notEqual(result.status, 0);
	assert.match(result.stderr, /refusing --remote/);
});

test("the Worker entry sends every request through the public request guard first", () => {
	const worker = read("src/worker.ts");
	assert.match(worker, /import\s*\{\s*guardPublicRequest\s*\}\s*from\s*["']\.\/security\/public-request-guard\.mjs["']/);
	const fetchBody = worker.match(/async\s+fetch\s*\(([^)]*)\)\s*\{([\s\S]*?)\n\t\}/);
	assert.ok(fetchBody, "default export defines fetch()");
	const body = fetchBody[2];
	assert.ok(body.indexOf("guardPublicRequest(") >= 0 && body.indexOf("guardPublicRequest(") < body.indexOf("handler.fetch"), "guard runs before EmDash");
	assert.ok(existsSync(join(root, "src/security/public-request-guard.mjs")));
});

test("astro.config.mjs reads the overlay path and keeps private paths out of the dev server", () => {
	const config = read("astro.config.mjs");
	assert.match(config, /process\.env\.PORTAL_WRANGLER_CONFIG/);
	assert.match(config, /cloudflare\([^)]*configPath/);
	const deny = config.match(/deny\s*:\s*\[([\s\S]*?)\]/)?.[1] ?? "";
	for (const pattern of [".env", ".dev.vars", "wrangler.site.jsonc", "*.db", "*.sqlite", "backups/**", "exports/**", "uploads/**", ".verification/**", ".wrangler/**", ".git/**", "*.ja.md", ".claude/**", ".codex/**", ".emdash/**"]) {
		assert.ok(deny.includes(pattern), `fs.deny keeps ${pattern}`);
	}
});

test("the committed Wrangler file stays a safe template", () => {
	const template = parseJsonc(read("wrangler.jsonc"));
	assert.equal(template.workers_dev, false, "new deployments start without a public hostname");
	assert.equal(template.preview_urls, false);
	const text = read("wrangler.jsonc");
	assert.doesNotMatch(text, /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i, "no real D1 IDs");
	assert.doesNotMatch(JSON.stringify(template), /\.workers\.dev|https?:\/\//, "no live hostname outside comments");
	assert.equal(template.vars?.EMDASH_SITE_URL, undefined, "no site URL in the template");
});

test("npm scripts keep every test, verification and gated deployment entry point", () => {
	const s = packageJson.scripts;
	for (const name of ["typecheck", "test", "test:science", "test:security", "test:phase8", "test:phase9", "test:phase10", "science:check", "science:check-phase9", "verify:phase8", "verify:phase9", "verify:phase10", "release:check"]) {
		assert.ok(s[name], `script ${name}`);
	}
	for (const [name, command] of Object.entries(s)) {
		for (const m of command.matchAll(/(?:^|\s)((?:tests|scripts)\/[\w./-]+\.m?js)/g)) assert.ok(existsSync(join(root, m[1])), `${name} → ${m[1]} exists`);
	}
	assert.match(s.build, /with-site-wrangler\.mjs build /);
	assert.match(s.deploy, /with-site-wrangler\.mjs deploy /);
	assert.match(s["cf:dev"], /with-site-wrangler\.mjs local /);
	for (const file of ["science", "public-request-guard", "phase8-relations", "phase9", "phase10-regression"]) {
		assert.match(s.test, new RegExp(`tests/${file}\\.test\\.mjs`), `npm test runs ${file}`);
	}
});

test("Zod stays at a patched version for EmDash and its auth packages", () => {
	const atLeast = (v, min) => { const a = v.split(".").map(Number); const b = min.split(".").map(Number); for (let i = 0; i < 3; i++) if (a[i] !== b[i]) return a[i] > b[i]; return true; };
	for (const owner of ["emdash", "@emdash-cms/auth", "@emdash-cms/plugin-types"]) {
		const pinned = packageJson.overrides?.[owner]?.zod;
		assert.ok(pinned && atLeast(pinned.replace(/^[^\d]*/, ""), "4.6.7"), `override for ${owner}`);
	}
	const lock = JSON.parse(read("package-lock.json"));
	for (const [path, entry] of Object.entries(lock.packages)) {
		if (/(^|\/)node_modules\/zod$/.test(path)) assert.ok(atLeast(entry.version, "4.6.7"), `${path} is ${entry.version}`);
	}
});

test("private local state is ignored by Git and nothing private is tracked", () => {
	const probes = [".claude/sessions/probe", ".claude/state/probe", "wrangler.site.jsonc", ".dev.vars", ".env", "data.db", "exports/probe.json", "backups/probe", "uploads/probe", ".verification/probe", "docs/PROBE.ja.md", ".wrangler/probe"];
	const ignored = spawnSync("git", ["check-ignore", "--no-index", ...probes], { cwd: root, encoding: "utf8" }).stdout.split("\n").filter(Boolean);
	for (const p of probes) assert.ok(ignored.includes(p), `${p} is gitignored`);
	const tracked = spawnSync("git", ["ls-files"], { cwd: root, encoding: "utf8" }).stdout.split("\n");
	const forbidden = /^(\.claude\/(sessions|state)\/|wrangler\.site\.jsonc$|\.dev\.vars$|\.env$|exports\/|backups\/|uploads\/|\.verification\/|\.wrangler\/|docs\/[^/]+\.ja\.md$)|\.(db|sqlite3?|pdf|docx?|pptx?|mp4|mov|webm)$/i;
	assert.deepEqual(tracked.filter((f) => forbidden.test(f)), []);
});

test("Phase 9 features remain present in the data layer", () => {
	assert.equal(INSIGHTS_V2.length, 8, "eight synthesis insights");
	assert.equal(new Set(INSIGHTS_V2.map((i) => i.id)).size, 8);
	assert.ok(INSIGHTS_V2.every((i) => i.title && i.text && i.basis.length > 0), "every insight keeps its title, text and evidence basis");
	assert.equal(PRIORITY_AREAS.length, 4, "four strategic research areas");
	const actionIds = new Set(pkg.actions.map((a) => a.id));
	assert.equal(actionIds.size, 12, "twelve illustrative workflows");
	assert.equal(PILOTS.length, 3, "three candidate pilots");
	assert.ok(PILOTS.every((p) => /^[a-z0-9-]+$/.test(p.slug) && p.questions.length && p.workflows.every((w) => actionIds.has(w))));
	assert.ok(DEPENDENCIES.length > 0 && DEPENDENCIES.every((d) => actionIds.has(d.from) && actionIds.has(d.to) && d.reason));
	for (const issue of pkg.issues) {
		const rel = RELATIONSHIP_REVISIONS[issue.id] ?? ISSUE_RELATIONSHIPS[issue.id];
		assert.ok(rel && RELATIONSHIP_TYPES[rel.primary], `${issue.id} keeps a scientific classification`);
	}
	const index = createRelationIndex(relationContext({ pkg, highlights }));
	const linked = highlights.filter((h) => index.issuesForVideo(h.slug).length > 0);
	assert.ok(linked.length >= 20, `video ↔ question relations are derived from evidence (${linked.length} clips linked)`);
	assert.ok(new Set(linked.map((h) => index.issuesForVideo(h.slug).map((r) => r.issue.id).sort().join())).size > 5, "relations differ between clips");
	assert.notEqual(PHASE9_EDITORIAL.status, "author_reviewed", "no automatic author approval");
});

test("pages render relations from the science layer, not hard-coded links", () => {
	const consumers = {
		"src/components/VideoHighlightPage.astro": /from\s+["'](\.\.\/)+science\/phase8["']/,
		"src/components/RelatedVideos.astro": /from\s+["'](\.\.\/)+science\//,
		"src/pages/actions/[issue].astro": /from\s+["'](\.\.\/)+science\/phase8["']/,
		"src/pages/questions/themes/[issue].astro": /from\s+["'](\.\.\/)+science\/phase8["']/,
		"src/pages/index.astro": /from\s+["'](\.\.\/)+science\/phase8["']/,
		"src/pages/actions/index.astro": /from\s+["'](\.\.\/)+science\/phase9\/roadmap\.mjs["']/,
		"src/pages/workshop-synthesis.astro": /from\s+["'](\.\.\/)+science\//,
		"src/pages/actions/pilots/[pilot].astro": /from\s+["'](\.\.\/)+science\/phase9\/roadmap\.mjs["']/,
	};
	for (const [file, importPattern] of Object.entries(consumers)) {
		const source = read(file);
		assert.match(source, importPattern, `${file} imports the science layer`);
		assert.doesNotMatch(source, /href="\/questions\/themes\/q\d\d"/, `${file}: no hard-coded question link`);
		assert.doesNotMatch(source, /href="\/videos\/[a-z0-9]/, `${file}: no hard-coded clip link`);
	}
	const portal = read("src/data/portal.ts");
	assert.match(portal, /\{\s*href:\s*"\/workshop-synthesis",[^}]*primary:\s*true/, "Workshop Synthesis is a primary navigation item");
	assert.match(read("src/layouts/Base.astro"), /navigation\.filter\(\s*item\s*=>\s*item\.primary\s*\)/, "header renders primary navigation from portal.ts");
	for (const route of ["workshop-synthesis.astro", "actions/pilots/[pilot].astro", "questions/themes/[issue].astro", "videos/[slug].astro", "actions/[issue].astro"]) {
		assert.ok(existsSync(join(root, "src/pages", route)), `route ${route}`);
	}
});
