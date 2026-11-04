# Cloudflare deployment templates

Reference snapshots for the Cloudflare Workers target. Root project files are active; keep these `.example` copies aligned when the template changes.

| Template | Becomes | Purpose |
| --- | --- | --- |
| `wrangler.jsonc.example` | `./wrangler.jsonc` (committed **template**, no production UUIDs) | Worker name, D1 `DB`, R2 `MEDIA`, Cron Trigger |
| `astro.config.cloudflare.mjs.example` | `./astro.config.mjs` | Cloudflare adapter, `d1()` / `r2()` EmDash adapters |
| `worker.ts.example` | `./src/worker.ts` | Official EmDash Worker entry point with `scheduled` handler |
| `dev.vars.example` | `./.dev.vars` | Local `wrangler dev` variables (gitignored) |

For a real deploy, copy root `wrangler.jsonc` → gitignored `wrangler.site.jsonc`, fill **your** `database_id` and `EMDASH_SITE_URL`, then use `npm run build` / `npm run deploy`. See `docs/FORKING.md` and `docs/PHASE7_DEPLOYMENT_GUIDE.md`.
