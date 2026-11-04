import node from "@astrojs/node";
import react from "@astrojs/react";
import { defineConfig } from "astro/config";
import emdash, { local } from "emdash/astro";
import { sqlite } from "emdash/db";
import scientificPublicationPolicy from "./src/science/publication-policy.mjs";

export default defineConfig({
	output: "server",
	server: { host: "127.0.0.1", port: 4321 },
	vite: {
		server: {
			strictPort: true,
			fs: {
				// Preserve Vite's default secret exclusions and protect local CMS state.
				deny: [
					".env", ".env.*", "*.{crt,pem}", "**/.git/**",
					"**/*.db", "**/*.db-*", "**/*.sqlite", "**/*.sqlite3",
					"**/*.sqlite-*", "**/*.sqlite3-*", "**/*.key",
					"**/.dev.vars*", "**/backups/**", "**/exports/**", "**/uploads/**",
				],
			},
		},
	},
	adapter: node({
		mode: "standalone",
	}),
	image: {
		layout: "constrained",
		responsiveStyles: true,
	},
	integrations: [
		react(),
		emdash({
			admin: { locales: ["en"] },
			plugins: [scientificPublicationPolicy],
			database: sqlite({ url: "file:./data.db" }),
			storage: local({
				directory: "./uploads",
				baseUrl: "/_emdash/api/media/file",
			}),
		}),
	],
	devToolbar: { enabled: false },
});
