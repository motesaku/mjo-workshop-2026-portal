# Cloudflare deployment templates

Reference snapshots for the Cloudflare Workers target. Root project files are active; keep these `.example` copies aligned when the template changes.

| Template | Becomes | Purpose |
| --- | --- | --- |
| `wrangler.jsonc.example` | `./wrangler.jsonc` (committed **template**, no production UUIDs) | Worker name, D1 `DB`, R2 `MEDIA`, Cron Trigger |
| `astro.config.cloudflare.mjs.example` | `./astro.config.mjs` | Cloudflare adapter, `d1()` / `r2()` EmDash adapters |
| `worker.ts.example` | `./src/worker.ts` | Official EmDash Worker entry point with `scheduled` handler |
| `dev.vars.example` | `./.dev.vars` | Local `wrangler dev` variables (gitignored) |

For a real deploy, copy root `wrangler.jsonc` → gitignored `wrangler.site.jsonc`, fill **your** `database_id` and `EMDASH_SITE_URL`, then use `npm run build` / `npm run deploy`. The build reads `wrangler.site.jsonc` in place through `PORTAL_WRANGLER_CONFIG`; the committed template is never overwritten. `npm run deploy` refuses to run unless the build was generated from a complete overlay. Pass `--config wrangler.site.jsonc` to other Wrangler commands (`secret put`, `d1 …`).

**First run:** keep `workers_dev: false` until Cloudflare Access protects the Worker. On an empty database, the first visitor to finish the setup wizard becomes administrator. Follow `docs/PHASE7_DEPLOYMENT_GUIDE.md` §4a and `docs/FORKING.md`.

The `.example` files above are historical snapshots from before the Cloudflare migration. They are not the active configuration.
