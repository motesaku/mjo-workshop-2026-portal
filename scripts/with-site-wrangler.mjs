#!/usr/bin/env node
/**
 * Run a command with wrangler.site.jsonc temporarily swapped in as wrangler.jsonc
 * when the site overlay exists. Restores the committed template afterwards.
 *
 * Usage: node scripts/with-site-wrangler.mjs <command> [args...]
 */
import { spawnSync } from "node:child_process";
import { copyFileSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const mainPath = resolve(root, "wrangler.jsonc");
const sitePath = resolve(root, "wrangler.site.jsonc");
const args = process.argv.slice(2);

if (args.length === 0) {
	console.error("Usage: node scripts/with-site-wrangler.mjs <command> [args...]");
	process.exit(2);
}

const hasSite = existsSync(sitePath);
let original = null;

if (hasSite) {
	original = readFileSync(mainPath);
	copyFileSync(sitePath, mainPath);
	console.log("with-site-wrangler: using wrangler.site.jsonc for this command");
} else {
	console.log("with-site-wrangler: wrangler.site.jsonc not found; using committed wrangler.jsonc");
}

let status = 1;
try {
	const [cmd, ...cmdArgs] = args;
	const result = spawnSync(cmd, cmdArgs, { stdio: "inherit", shell: false, env: process.env });
	status = result.status ?? 1;
	if (result.error) {
		console.error(result.error.message);
		status = 1;
	}
} finally {
	if (original !== null) {
		writeFileSync(mainPath, original);
	}
}

process.exit(status);
