import cloudflare from "@astrojs/cloudflare";
import react from "@astrojs/react";
import { d1, r2 } from "@emdash-cms/cloudflare";
import { defineConfig } from "astro/config";
import emdash from "emdash/astro";
import scientificPublicationPolicy from "./src/science/publication-policy.mjs";

// Active Cloudflare Workers target (authorized 2026-11-03: public + noindex).
// Local Node + SQLite prototype retained as ./astro.config.node.mjs.

export default defineConfig({
	output: "server",
	adapter: cloudflare(),
	// Workers Cache intentionally off for the first public deploy.
	image: {
		layout: "constrained",
		responsiveStyles: true,
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
