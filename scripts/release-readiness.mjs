#!/usr/bin/env node
// Phase 10 release-readiness check. Run: npm run release:check [-- --port=8799]
//
// Runs, in order, and stops at the first failure:
//   1. Node 24 and Git state (commit; uncommitted changes make the result non-deployable)
//   2. typecheck, all unit/regression tests, science contract and Phase 9 export checks
//   3. production build (reads wrangler.site.jsonc in place when present)
//   4. privacy scan of dist/client (the files Cloudflare serves as static assets)
//   5. the built Worker in the LOCAL Workers runtime (wrangler dev, local emulation only)
//      checked with verify-phase8, verify-phase9 and verify-phase10
// and writes .verification/release-readiness.json (gitignored). `npm run deploy`
// refuses unless that stamp passed for the current clean commit and this exact build.
//
// Nothing here contacts Cloudflare or modifies remote resources.
import { spawn, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync, createWriteStream } from "node:fs";
import { join, resolve } from "node:path";
import { distDigest, gitState, STAMP_PATH, STAMP_VERSION } from "./lib/release-stamp.mjs";

const root = process.cwd();
const port = Number(process.argv.find((a) => a.startsWith("--port="))?.split("=")[1] ?? 8799);
const origin = `http://127.0.0.1:${port}`;
const results = [];
const started = Date.now();
let stamp = { version: STAMP_VERSION, ok: false };

function writeStamp(extra = {}) {
	mkdirSync(resolve(root, ".verification"), { recursive: true });
	stamp = { ...stamp, ...extra, checkedAt: new Date().toISOString(), node: process.version, steps: results };
	writeFileSync(resolve(root, STAMP_PATH), JSON.stringify(stamp, null, 2) + "\n");
}

function finish(ok, message) {
	writeStamp({ ok });
	const mark = (r) => `${r.ok ? "PASS" : "FAIL"}  ${r.name}${r.summary ? ` — ${r.summary}` : ""}`;
	console.log(`\n${results.map(mark).join("\n")}`);
	console.log(`\nrelease-readiness: ${ok ? "PASS" : "FAIL"} (${Math.round((Date.now() - started) / 1000)} s) — ${message}`);
	console.log(`stamp: ${STAMP_PATH}`);
	process.exit(ok ? 0 : 1);
}

function record(name, ok, summary, t0) {
	results.push({ name, ok, summary, seconds: Math.round((Date.now() - t0) / 100) / 10 });
	console.log(`release-readiness: ${ok ? "pass" : "FAIL"} ${name}${summary ? ` — ${summary}` : ""}`);
	if (!ok) finish(false, `stopped at "${name}"`);
}

function runStep(name, cmd, args, summarize = (out) => out.trim().split("\n").filter(Boolean).at(-1)) {
	const t0 = Date.now();
	console.log(`\nrelease-readiness: ${name} …`);
	const r = spawnSync(cmd, args, { cwd: root, encoding: "utf8", env: process.env, maxBuffer: 64 * 1024 * 1024 });
	const out = `${r.stdout ?? ""}${r.stderr ?? ""}`;
	if (r.status !== 0) console.error(out.split("\n").slice(-40).join("\n"));
	record(name, r.status === 0, (summarize(out) ?? "").slice(0, 200), t0);
	return out;
}

// 1. Environment and Git state.
{
	const t0 = Date.now();
	const major = Number(process.versions.node.split(".")[0]);
	record("Node.js 24", major === 24, `running ${process.version}`, t0);
	const state = gitState(root);
	stamp.commit = state.commit;
	stamp.clean = state.clean;
	record("Git state", Boolean(state.commit), state.clean ? `clean at ${state.commit?.slice(0, 7)}` : `${state.changes} uncommitted change(s) at ${state.commit?.slice(0, 7)} — result will NOT be deployable`, t0);
}

// 2. Static checks.
runStep("typecheck", "npm", ["run", "-s", "typecheck"], (o) => o.match(/Result \(\d+ files\):[\s\S]*?hints/)?.[0].replace(/\s+/g, " "));
runStep("unit and regression tests", "npm", ["test", "--silent"], (o) => [...o.matchAll(/^ℹ (tests|pass|fail) (\d+)/gm)].map((m) => `${m[1]} ${m[2]}`).join(", "));
runStep("science contract", "npm", ["run", "-s", "science:check"]);
runStep("Phase 9 export up to date", "npm", ["run", "-s", "science:check-phase9"]);

// 3. Build.
runStep("production build", "npm", ["run", "-s", "build"], (o) => (o.match(/with-site-wrangler: [^\n]*/)?.[0] ?? "") + (/\bComplete!/.test(o) ? " · complete" : ""));
const builtDigest = distDigest(root);

// 4. Privacy scan of the publicly served assets.
{
	const t0 = Date.now();
	const problems = [];
	const client = resolve(root, "dist/client");
	const secrets = [];
	if (existsSync(resolve(root, "wrangler.site.jsonc"))) {
		for (const m of readFileSync(resolve(root, "wrangler.site.jsonc"), "utf8").matchAll(/"database_id"\s*:\s*"([^"]+)"/g)) secrets.push(m[1]);
	}
	const PRIVATE = /\/Users\/|researcher_os|provenance\.private|\.ja\.md|wrangler\.site|exports\/phase|\.dev\.vars/;
	const FORBIDDEN_FILE = /\.(pdf|docx?|pptx?|potx|mp4|mov|webm|mkv|db|sqlite3?)$|(^|\/)\.(env|dev\.vars)/i;
	let files = 0;
	const walk = (dir) => {
		for (const name of readdirSync(dir)) {
			const full = join(dir, name);
			if (statSync(full).isDirectory()) { walk(full); continue; }
			files++;
			const rel = full.slice(client.length + 1);
			if (FORBIDDEN_FILE.test(rel)) problems.push(`forbidden file type served: ${rel}`);
			if (/\.(html|js|mjs|css|json|txt|xml|svg|map|webmanifest)$/i.test(name)) {
				const body = readFileSync(full, "utf8");
				if (PRIVATE.test(body)) problems.push(`private path marker in ${rel}`);
				if (secrets.some((s) => body.includes(s))) problems.push(`deployment identifier in ${rel}`); // value never printed
			}
		}
	};
	if (existsSync(client)) walk(client); else problems.push("dist/client missing");
	if (problems.length) console.error(problems.slice(0, 20).join("\n"));
	record("privacy scan of dist/client", problems.length === 0, problems.length ? `${problems.length} problem(s)` : `${files} public files clean`, t0);
}

// 5. Built Worker in the local Workers runtime + HTTP checks.
{
	const t0 = Date.now();
	console.log(`\nrelease-readiness: starting the built Worker locally on ${origin} …`);
	mkdirSync(resolve(root, ".verification"), { recursive: true });
	const log = createWriteStream(resolve(root, ".verification/release-wrangler.log"));
	const child = spawn("node", ["scripts/with-site-wrangler.mjs", "local", "npx", "wrangler", "dev", "--ip", "127.0.0.1", "--port", String(port)], { cwd: root, env: process.env, detached: true, stdio: ["ignore", "pipe", "pipe"] });
	child.stdout.pipe(log);
	child.stderr.pipe(log);
	let exited = false;
	child.on("exit", () => { exited = true; });
	const stop = () => { try { process.kill(-child.pid, "SIGTERM"); } catch { /* already stopped */ } };
	process.on("exit", stop);
	let ready = false;
	for (let i = 0; i < 120 && !exited; i++) {
		try {
			const r = await fetch(origin + "/", { redirect: "manual" });
			if (r.status === 200) { ready = true; break; }
		} catch { /* not up yet */ }
		await new Promise((r) => setTimeout(r, 1000));
	}
	if (!ready) { stop(); record("local Workers runtime", false, `did not serve ${origin}/ (see .verification/release-wrangler.log)`, t0); }
	record("local Workers runtime", true, `serving the build on ${origin}`, t0);
	for (const script of ["verify-phase8", "verify-phase9", "verify-phase10"]) {
		const s0 = Date.now();
		const r = spawnSync("node", [`scripts/${script}.mjs`, origin], { cwd: root, encoding: "utf8" });
		const out = `${r.stdout ?? ""}${r.stderr ?? ""}`.trim();
		if (r.status !== 0) { console.error(out.split("\n").slice(0, 40).join("\n")); stop(); }
		record(`${script} on the Worker`, r.status === 0, out.split("\n")[0].slice(0, 200), s0);
	}
	stop();
}

// The build must be the one that was verified.
{
	const t0 = Date.now();
	const now = distDigest(root);
	record("dist unchanged during checks", now === builtDigest, now === builtDigest ? `digest ${now.slice(0, 12)}…` : "dist changed while the checks ran", t0);
	stamp.distDigest = now;
}

finish(true, stamp.clean ? `commit ${stamp.commit.slice(0, 7)} and this build may be deployed with explicit owner authorization` : "all checks passed, but the working tree has uncommitted changes, so deploy stays blocked until you commit and re-run");
