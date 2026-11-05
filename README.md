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

Committed `wrangler.jsonc` is a **template without production resource IDs**.

## Manual administrator setup

1. Open the admin URL in your browser. Use a consistent origin for passkeys.
2. Site title **MJO Workshop 2026**, tagline **Knowledge & Action Portal**, **Empty site**.
3. Enter **your** administrator email and name; register a passkey.
4. Keep unverified scientific claims unpublished; this site’s scientific pages are a personal synthesis unless you change that policy.

## Commands

```sh
npm run typecheck
npm run test:science
npm run science:check
npm run verify:local  # Requires the local dev server
node scripts/verify-phase4-http.mjs
node scripts/verify-phase6.mjs dev
npm run build         # prefers wrangler.site.jsonc when present
npm run deploy        # Cloudflare Worker; needs your bindings overlay
```

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
| `docs/PHASE7_DEPLOYMENT_GUIDE.md` | Cloudflare procedure |
| `LICENSE` | MIT + content notice |

## GitHub status

Remote: **`motesaku/mjo-workshop-2026-portal`**. Treat visibility changes, CI deploy hooks, and secret scanning enablement as owner-authorized steps. Do not push secrets, SQLite data, `exports/`, `backups/`, `.env`, or `wrangler.site.jsonc`.

After the repository is made **public**, enable GitHub secret scanning and push protection (often unavailable on free private personal repositories).

## Official scaffold provenance

Generated on 2026-11-01 using `create-emdash@1.4.0` (Starter), then customized for the workshop portal and Cloudflare deployment.
