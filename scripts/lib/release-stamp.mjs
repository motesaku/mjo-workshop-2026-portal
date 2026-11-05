// Shared helpers for the release-readiness check and the deploy gate (Phase 10).
//
// The stamp records which commit and which exact build passed `npm run release:check`.
// `npm run deploy` refuses unless the current commit, a clean working tree and the
// current build all match the stamp. The stamp lives in the gitignored .verification/.
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";

export const STAMP_PATH = ".verification/release-readiness.json";
export const STAMP_VERSION = 1;

/** Files never included in the digest: local secrets copied into dist by the adapter. */
const EXCLUDED = /(^|\/)\.dev\.vars(\..*)?$/;

/** SHA-256 over the sorted (path, content hash) list of every file under `dir`. */
export function distDigest(root = process.cwd(), dir = "dist") {
	const base = resolve(root, dir);
	if (!existsSync(base)) return null;
	const files = [];
	const walk = (path) => {
		for (const name of readdirSync(path)) {
			const full = join(path, name);
			if (statSync(full).isDirectory()) walk(full);
			else files.push(full);
		}
	};
	walk(base);
	const outer = createHash("sha256");
	for (const full of files.map((f) => f).sort()) {
		const rel = relative(base, full).split("\\").join("/");
		if (EXCLUDED.test(rel)) continue;
		const inner = createHash("sha256").update(readFileSync(full)).digest("hex");
		outer.update(`${rel}\0${inner}\n`);
	}
	return outer.digest("hex");
}

function git(args, root) {
	const r = spawnSync("git", args, { cwd: root, encoding: "utf8" });
	return r.status === 0 ? r.stdout.trim() : null;
}

/** Current commit and whether tracked or untracked (non-ignored) files differ from it. */
export function gitState(root = process.cwd()) {
	const commit = git(["rev-parse", "HEAD"], root);
	const porcelain = git(["status", "--porcelain"], root);
	return { commit, clean: porcelain === "", changes: porcelain ? porcelain.split("\n").length : null };
}

export function readStamp(root = process.cwd()) {
	const path = resolve(root, STAMP_PATH);
	if (!existsSync(path)) return null;
	try {
		return JSON.parse(readFileSync(path, "utf8"));
	} catch {
		return null;
	}
}

/** Problems that make the current build ineligible for deployment (empty = eligible). */
export function stampProblems(root = process.cwd()) {
	const stamp = readStamp(root);
	if (!stamp) return [`no release-readiness stamp (${STAMP_PATH}). Run \`npm run release:check\`.`];
	const problems = [];
	if (stamp.version !== STAMP_VERSION) problems.push("the stamp was written by a different version of the release check");
	if (stamp.ok !== true) problems.push("the last release check did not pass");
	if (stamp.clean !== true) problems.push("the last release check ran on a working tree with uncommitted changes");
	const state = gitState(root);
	if (!state.clean) problems.push(`the working tree has ${state.changes} uncommitted change(s)`);
	if (stamp.commit !== state.commit) problems.push("HEAD has changed since the release check");
	if (stamp.distDigest !== distDigest(root)) problems.push("dist/ differs from the build that passed the release check (rebuilt or modified)");
	return problems;
}
