# Phase 2 Verification

Verified on 2026-11-01 (Asia/Tokyo). Local development only.

## Installed application

- Official scaffolder: `create-emdash@1.4.0`, Node platform, Starter template, npm.
- Runtime: project-local Node.js **24.22.2**. SQLite FTS5 creation verified in memory.
- App: EmDash **1.4.0**, Astro **7.4.4**, React/React DOM **19.2.4**, TypeScript **6.0.3**.
- Adapters: `@astrojs/node` **11.1.9**, `@astrojs/react` **7.1.2**.
- Local repository: independent `.git`, branch `codex/initialize-portal`, no commits, no remote.
- Intended GitHub destination: `motesaku/mjo-workshop-2026-portal`, private, NOT created.
- No research source files, scientific summaries, videos or photos were imported.

## Results

| Verification | Result |
| --- | --- |
| `npm run typecheck` | 12 files; 0 errors, 0 warnings, 0 hints |
| `npm run build` | Success; Node server output in `dist/` |
| Build warnings | Vite reports a client chunk over 500 kB (upstream admin bundle); not a build failure |
| `npm run verify:local` | All 6 checks pass |
| `/` | HTTP 200, English HTML, portal heading, noindex/nofollow |
| `/posts` | HTTP 200, English HTML, empty collection |
| `/_emdash/admin/` | Redirects to `/_emdash/admin/setup`, HTTP 200, English HTML, private/no-store |
| Admin browser check | React setup form rendered: title/tagline, Empty site option, Continue button |
| Homepage browser check | English heading, local prototype status and responsive section cards rendered |
| `/.env`, `/data.db`, `/@fs/<local project>/data.db` | All HTTP 403 after explicit Vite deny configuration |
| Listener check (`lsof`) | TCP 127.0.0.1:4321 only; no network interface listener |
| Git ignore check | `.env`, SQLite/WAL, uploads, Astro runtime state, Wrangler data, backup/export paths, originals and videos excluded |
| Administrator account/passkey | Not created; owner must complete setup |
| Cloudflare Workers/D1/R2 | Planning only; no cloud provisioning or runtime verification |

An initial check found that Vite served the root SQLite file by its direct URL. The file was accessible only on loopback; it contained this new empty local CMS, not imported research data. `astro.config.mjs` now explicitly blocks SQLite files, secrets, uploads and backup/export folders in Vite, preserving Vite's default secret exclusions. The included smoke check covers both the direct and `/@fs/` database paths. Production adapters must be independently checked before future deployment.

## Dependency audit limitation

`npm audit --json` reported **6 high-severity package entries**, all propagated from the Zod advisory [GHSA-mrhx-c7xc-m3w5](https://github.com/advisories/GHSA-mrhx-c7xc-m3w5) (oversized constrained collection validation can exhaust memory). This is not six independent root advisories. Affected installed paths include Zod dependencies of EmDash/auth/plugin-types, propagated through admin and registry verification.

The audit's forced fix proposes downgrading EmDash to 0.36.0, incompatible with this current scaffold. No forced fix, override or downgrade was applied. Resolve the dependency finding and repeat the audit before any authorized remote exposure. The existing machine-wide Node 25.2.1 also triggered an engine warning during initial scaffolding; npm scripts now use the project-local supported Node 24 runtime.

## Manual steps and limits

Open the setup URL in the owner's browser, choose **Empty site**, enter the owner's email/name and register a passkey. These are personal credential steps; authenticated dashboard/edit/save behavior has not yet been tested. All scientific content remains absent. No email provider has been configured.

The local dev server is left running in Astro's background mode. Check it with `npm exec astro dev status`; stop it with `npm exec astro dev stop`; restart with `npm run dev`. Use `localhost` consistently in the browser for passkeys.

Screenshots are saved in gitignored `.verification/homepage.png` and `.verification/admin-setup.png`. The homepage screenshot uses the in-app browser's narrow viewport; this is a basic visual check, not a complete mobile/accessibility audit.

## Official references

- [Getting started](https://docs.emdashcms.com/getting-started/)
- [Configuration: admin locales](https://docs.emdashcms.com/reference/configuration/#admin)
- [Node.js deployment](https://docs.emdashcms.com/deployment/nodejs/)
- [Cloudflare migration target](https://docs.emdashcms.com/deployment/cloudflare/)
