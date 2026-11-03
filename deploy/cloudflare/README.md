# Cloudflare deployment templates (inactive)

These files are templates only. They use the `.example` suffix so that Wrangler, Astro, `astro check` and `emdash doctor` ignore them, and the project remains a Node.js + SQLite local prototype.

| Template | Becomes | Purpose |
| --- | --- | --- |
| `wrangler.jsonc.example` | `./wrangler.jsonc` | Worker name, D1 `DB`, R2 `MEDIA`, Cron Trigger, optional previews |
| `astro.config.cloudflare.mjs.example` | `./astro.config.mjs` | Cloudflare adapter, `d1()` / `r2()` EmDash adapters |
| `worker.ts.example` | `./src/worker.ts` | Official EmDash Worker entry point with `scheduled` handler |
| `dev.vars.example` | `./.dev.vars` | Local `wrangler dev` variables (gitignored) |

Do not copy any of them into place, install `@astrojs/cloudflare`, `@emdash-cms/cloudflare` or `wrangler`, log in to Wrangler, or create cloud resources until public deployment has been explicitly authorized. The full procedure, checks and backup/restore plan are in `docs/PHASE7_DEPLOYMENT_GUIDE.md`.
