#!/usr/bin/env node
/**
 * Choose the Wrangler configuration for ONE command without modifying any file.
 *
 * The committed `wrangler.jsonc` is a template. A deployer's real bindings live in the
 * gitignored `wrangler.site.jsonc`. Nothing is copied or swapped:
 *
 *   build   Prefer `wrangler.site.jsonc` when present, otherwise the template.
 *           The chosen path is passed to astro.config.mjs through PORTAL_WRANGLER_CONFIG
 *           (-> cloudflare({ configPath })). Astro writes dist/server/wrangler.json and the
 *           official `.wrangler/deploy/config.json` redirect to it.
 *   deploy  Require `wrangler.site.jsonc` with real-looking bindings AND a build that was
 *           generated from it with the same Worker name, D1 IDs and EMDASH_SITE_URL.
 *           Wrangler then deploys that generated config through the redirect.
 *   local   Run a local-only Wrangler command (e.g. `wrangler dev`) against the last build.
 *           Refuses `--remote`, which would read and write real Cloudflare resources.
 *
 * Values from the overlay are compared but never printed.
 *
 * Usage: node scripts/with-site-wrangler.mjs <build|deploy|local> <command> [args...]
 */
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, realpathSync } from "node:fs";
import { dirname, resolve } from "node:path";

const root = process.cwd();
const templatePath = resolve(root, "wrangler.jsonc");
const sitePath = resolve(root, "wrangler.site.jsonc");
const builtConfigPath = resolve(root, "dist/server/wrangler.json");
const redirectPath = resolve(root, ".wrangler/deploy/config.json");
const ENV_NAME = "PORTAL_WRANGLER_CONFIG";

const [mode, ...command] = process.argv.slice(2);

function fail(message, code = 1) {
	console.error(`with-site-wrangler: ${message}`);
	process.exit(code);
}

if (!["build", "deploy", "local"].includes(mode) || command.length === 0) {
	fail("usage: node scripts/with-site-wrangler.mjs <build|deploy|local> <command> [args...]", 2);
}

/** Parse JSONC: strip comments and trailing commas outside strings, then JSON.parse. */
function parseJsonc(text, label) {
	let out = "";
	let inString = false;
	for (let i = 0; i < text.length; i++) {
		const ch = text[i];
		const next = text[i + 1];
		if (inString) {
			out += ch;
			if (ch === "\\") {
				out += next ?? "";
				i++;
			} else if (ch === '"') {
				inString = false;
			}
		} else if (ch === '"') {
			inString = true;
			out += ch;
		} else if (ch === "/" && next === "/") {
			while (i < text.length && text[i] !== "\n") i++;
			out += "\n";
		} else if (ch === "/" && next === "*") {
			i += 2;
			while (i < text.length && !(text[i] === "*" && text[i + 1] === "/")) i++;
			i++;
		} else {
			out += ch;
		}
	}
	try {
		return JSON.parse(out.replace(/,(\s*[}\]])/g, "$1"));
	} catch (error) {
		fail(`${label} is not valid JSON/JSONC (${error.message})`);
	}
}

function readJson(path, label) {
	return parseJsonc(readFileSync(path, "utf8"), label);
}

function samePath(a, b) {
	try {
		return realpathSync(a) === realpathSync(b);
	} catch {
		return false;
	}
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const PLACEHOLDER = /YOUR|[<>]|\bexample\.(com|org|net)\b/i;

/** Return a list of problems with a deployer overlay, without echoing its values. */
function overlayProblems(site) {
	const problems = [];
	if (typeof site.name !== "string" || site.name.trim() === "") problems.push("`name` is missing");
	const d1 = Array.isArray(site.d1_databases) ? site.d1_databases : [];
	if (!d1.some((db) => db?.binding === "DB")) problems.push("no D1 binding named `DB`");
	for (const db of d1) {
		if (typeof db?.database_id !== "string" || !UUID.test(db.database_id)) {
			problems.push(`D1 binding \`${db?.binding ?? "?"}\` has no real \`database_id\``);
		}
	}
	const siteUrl = site.vars?.EMDASH_SITE_URL;
	if (typeof siteUrl !== "string" || !/^https:\/\/[^/]+/.test(siteUrl) || PLACEHOLDER.test(siteUrl)) {
		problems.push("`vars.EMDASH_SITE_URL` must be your real https origin");
	}
	return problems;
}

/** Fingerprint-free comparison of what deploy would target. */
function target(config) {
	return JSON.stringify({
		name: config.name ?? null,
		d1: (config.d1_databases ?? []).map((db) => [db.binding, db.database_name, db.database_id]),
		r2: (config.r2_buckets ?? []).map((b) => [b.binding, b.bucket_name]),
		siteUrl: config.vars?.EMDASH_SITE_URL ?? null,
	});
}

/** Describe which source config produced the current build, or fail if there is no build. */
function builtFrom() {
	if (!existsSync(builtConfigPath)) fail("no build found (dist/server/wrangler.json). Run `npm run build` first.");
	if (!existsSync(redirectPath)) fail("missing .wrangler/deploy/config.json redirect. Run `npm run build` first.");
	const redirect = readJson(redirectPath, ".wrangler/deploy/config.json");
	if (!redirect.configPath || !samePath(resolve(dirname(redirectPath), redirect.configPath), builtConfigPath)) {
		fail(".wrangler/deploy/config.json does not point at dist/server/wrangler.json. Run `npm run build` again.");
	}
	const built = readJson(builtConfigPath, "dist/server/wrangler.json");
	const source = built.userConfigPath;
	const kind = source && samePath(source, sitePath) ? "site" : source && samePath(source, templatePath) ? "template" : "unknown";
	return { built, kind };
}

const env = { ...process.env };
delete env[ENV_NAME];

if (mode === "build") {
	if (existsSync(sitePath)) {
		readJson(sitePath, "wrangler.site.jsonc"); // fail early on a broken overlay
		env[ENV_NAME] = sitePath;
		console.log("with-site-wrangler: building with wrangler.site.jsonc (read in place; no files are copied)");
	} else {
		console.log("with-site-wrangler: wrangler.site.jsonc not found; building with the committed template wrangler.jsonc");
	}
}

if (mode === "deploy") {
	if (command.some((arg) => arg === "--config" || arg === "-c" || arg.startsWith("--config=") || arg === "--env" || arg === "-e" || arg.startsWith("--env="))) {
		fail("do not pass --config/--env to `npm run deploy`; the target is fixed by wrangler.site.jsonc and the build.");
	}
	if (!existsSync(sitePath)) {
		fail("refusing to deploy: wrangler.site.jsonc not found. The committed wrangler.jsonc is a template (see docs/FORKING.md).");
	}
	const site = readJson(sitePath, "wrangler.site.jsonc");
	const problems = overlayProblems(site);
	if (problems.length > 0) fail(`refusing to deploy: wrangler.site.jsonc is incomplete:\n  - ${problems.join("\n  - ")}`);
	const { built, kind } = builtFrom();
	if (kind !== "site") {
		fail("refusing to deploy: the current build was not generated from wrangler.site.jsonc. Run `npm run build` again.");
	}
	if (target(built) !== target(site)) {
		fail("refusing to deploy: dist/server/wrangler.json differs from wrangler.site.jsonc (name, D1, R2 or EMDASH_SITE_URL). Run `npm run build` again.");
	}
	console.log("with-site-wrangler: build matches wrangler.site.jsonc; deploying the generated dist/server/wrangler.json");
}

if (mode === "local") {
	if (command.includes("--remote") || command.some((arg) => arg.startsWith("--remote="))) {
		fail("refusing --remote: it would use real Cloudflare resources. Use the explicit wrangler command if that is authorized.");
	}
	const { kind } = builtFrom();
	console.log(`with-site-wrangler: local run of the build generated from ${kind === "site" ? "wrangler.site.jsonc" : kind === "template" ? "the template wrangler.jsonc" : "an unknown config"} (local emulation only)`);
}

const [cmd, ...cmdArgs] = command;
const result = spawnSync(cmd, cmdArgs, { stdio: "inherit", shell: false, env });
if (result.error) fail(result.error.message);
if (result.signal) {
	console.error(`with-site-wrangler: command stopped by ${result.signal}`);
	process.exit(1);
}
process.exit(result.status ?? 1);
