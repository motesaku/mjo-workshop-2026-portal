import cloudflare from "@astrojs/cloudflare";
import react from "@astrojs/react";
import { d1, r2 } from "@emdash-cms/cloudflare";
import { defineConfig } from "astro/config";
import emdash from "emdash/astro";
import scientificPublicationPolicy from "./src/science/publication-policy.mjs";

// Active Cloudflare Workers target (authorized 2026-11-03: public + noindex).
// Local Node + SQLite prototype retained as ./astro.config.node.mjs.

// Wrangler config for this run. `npm run build` sets PORTAL_WRANGLER_CONFIG to the
// gitignored wrangler.site.jsonc when it exists (scripts/with-site-wrangler.mjs).
// Otherwise (e.g. `npm run dev`, `astro check`) the committed template wrangler.jsonc
// is used. No config file is ever copied over another.
const wranglerConfigPath = process.env.PORTAL_WRANGLER_CONFIG || undefined;

export default defineConfig({
	output: "server",
	adapter: cloudflare(wranglerConfigPath ? { configPath: wranglerConfigPath } : {}),
	// Workers Cache intentionally off for the first public deploy.
	image: {
		layout: "constrained",
		responsiveStyles: true,
	},
	vite: {
		server: {
			fs: {
				// The dev server must never serve local secrets, CMS state or private exports.
				// Keep Vite's / Cloudflare's defaults and add this project's private paths.
				deny: [
					".env", ".env.*", "*.{crt,pem,key,pfx,p12,p8,jks}", "**/.git/**",
					".dev.vars", ".dev.vars.*", "**/.wrangler/**", "**/wrangler.site.jsonc",
					"**/*.db", "**/*.db-*", "**/*.sqlite", "**/*.sqlite3",
					"**/*.sqlite-*", "**/*.sqlite3-*",
					"**/backups/**", "**/exports/**", "**/uploads/**", "**/.verification/**",
				],
			},
		},
	},
	integrations: [
		react(),
		emdash({
			admin: { locales: ["en"] },
			plugins: [scientificPublicationPolicy],
			database: d1({ binding: "DB", session: "auto", coalesce: true }),
			storage: r2({
				binding: "MEDIA",
				// No publicUrl: media stays behind EmDash routes; backups/ must stay private.
			}),
		}),
	],
	devToolbar: { enabled: false },
});
