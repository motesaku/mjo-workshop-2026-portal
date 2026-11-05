# MJO Workshop 2026 Knowledge & Action Portal

English-only EmDash + Astro site for a **personal workshop participation report**.  
Raw workshop recordings, transcripts, and private editorial files are kept **outside** this repository; only English site derivatives and YouTube embeds live here.

**Start here if you are new to the repository:**  
[**How this site was created (workflow, diagrams, reuse)**](docs/SITE_CREATION_WORKFLOW.md) — workshop recordings → ASR → minutes → YouTube highlights → site structure with AI agents → Cloudflare EmDash (no PHP).  
Then see [`docs/FORKING.md`](docs/FORKING.md) to run your own copy.

Live owner hosting (separate from GitHub visibility) may already be on Cloudflare Workers with **`noindex, nofollow`**. Changing the GitHub repository from private to public so others can fork is a **separate owner decision**.

## Local development

Use Node.js 24.15+ in the 24.x line (see `.nvmrc`).

```sh
npm ci
npm run dev
```

- Homepage: http://localhost:4321/
- EmDash administration: http://localhost:4321/_emdash/admin/
- Fresh database: the administration route opens the initial setup wizard (**Empty site**).
- The development server binds to loopback only.

Create a private `.env` with a **new** `EMDASH_ENCRYPTION_KEY` (never commit it):

```sh
node --input-type=module -e 'import { randomBytes } from "node:crypto"; import { writeFileSync } from "node:fs"; writeFileSync(".env", `EMDASH_ENCRYPTION_KEY=${randomBytes(32).toString("hex")}
`, { flag: "wx", mode: 0o600 });'
```

## Forks and rearrangements

Participants may fork this project and rearrange pages, styling, and personal synthesis content under the MIT `LICENSE` (see also the content notice in that file).

1. Read **`docs/FORKING.md`**.
2. Replace authorship in `src/data/portal.ts`.
3. Start blank with `examples/personal-synthesis.empty.json`, or adapt `examples/personal-synthesis.qoosaku-moteki.json`.
4. Create **your own** Cloudflare D1/R2 and `wrangler.site.jsonc` (gitignored). Never reuse another person’s database UUID or encryption key.
5. Before your Worker gets a public URL, protect it with Cloudflare Access and finish the EmDash setup wizard yourself. On an empty database, the first visitor to finish setup becomes administrator (`docs/FORKING.md`).

Committed `wrangler.jsonc` is a **template without production resource IDs**.

## Manual administrator setup

1. Open the admin URL in your browser. Use a consistent origin for passkeys.
2. Site title **MJO Workshop 2026**, tagline **Knowledge & Action Portal**, **Empty site**.
3. Enter **your** administrator email and name; register a passkey.
4. Keep unverified scientific claims unpublished; this site’s scientific pages are a personal synthesis unless you change that policy.

## Commands

```sh
npm run typecheck
npm test              # every unit and regression suite (science, security, Phase 8, 9, 10)
npm run test:science
npm run test:security # public API request-body guard (src/security/public-request-guard.mjs)
npm run test:phase8   # Phase 8 cross-reference, classification and roadmap integrity
npm run test:phase10  # wiring of the Worker guard, build wrapper, npm scripts and pages (no server)
npm run science:check
npm run verify:local  # Requires the local dev server
node scripts/verify-phase4-http.mjs
node scripts/verify-phase6.mjs dev
npm run verify:phase8 # Phase 8 crawl: all pages, links, anchors, video↔question links (dev server)
npm run verify:phase10 # rendered navigation, insights, roadmap, classifications, clip relations, private paths
npm run build         # reads wrangler.site.jsonc in place when present; never rewrites wrangler.jsonc
npm run release:check # all of the above + build + the built Worker in the local Workers runtime
npm run deploy        # refuses unless release:check passed for this clean commit and this exact build
```

`npm run release:check` writes `.verification/release-readiness.json` (gitignored). `npm run deploy` compares it with the current commit, a clean working tree and a digest of `dist/`; any rebuild or edit after the check blocks deployment until the check is run again. `npm run deploy -- --dry-run` only warns. The check never contacts Cloudflare.

| Path | Purpose |
| --- | --- |
| `astro.config.mjs` | Cloudflare adapter + EmDash D1/R2 |
| `astro.config.node.mjs` | Local Node + SQLite prototype |
| `wrangler.jsonc` | Committed Cloudflare **template** |
| `wrangler.site.jsonc` | Local production bindings (gitignored) |
| `src/data/personal-synthesis.json` | Bundled personal synthesis (no source file hashes) |
| `examples/` | Empty starter + reference synthesis package |
| `docs/SITE_CREATION_WORKFLOW.md` | End-to-end creation workflow with flowcharts |
| `docs/FORKING.md` | Fork / redeploy checklist |
| `docs/PHASE8_IMPLEMENTATION.md` | Phase 8 audit, architecture, validation |
| `docs/PHASE8_EDITORIAL_LOG.md` | Every Phase 8 scientific-content change with its basis |
| `docs/PHASE7_DEPLOYMENT_GUIDE.md` | Cloudflare procedure |
| `LICENSE` | MIT + content notice |

## GitHub status

Remote: **`motesaku/mjo-workshop-2026-portal`**. Treat visibility changes, CI deploy hooks, and secret scanning enablement as owner-authorized steps. Do not push secrets, SQLite data, `exports/`, `backups/`, `.env`, or `wrangler.site.jsonc`.

After the repository is made **public**, enable GitHub secret scanning and push protection (often unavailable on free private personal repositories).

## Official scaffold provenance

Generated on 2026-11-01 using `create-emdash@1.4.0` (Starter), then customized for the workshop portal and Cloudflare deployment.
