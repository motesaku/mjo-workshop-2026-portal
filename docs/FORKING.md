# Forking this portal

This repository is intended as a **starting point** for workshop participants who want their own personal report site. Forking the GitHub repository does **not** copy anyone else’s Cloudflare database, encryption key, admin passkey, or media bucket.

For the full creation story (recordings → ASR → minutes → highlights → EmDash on Cloudflare), read [`SITE_CREATION_WORKFLOW.md`](./SITE_CREATION_WORKFLOW.md) first.

## What you get

| Included in the fork | Not included (create your own) |
| --- | --- |
| Astro + EmDash app code | Cloudflare account, D1, R2, SESSION KV |
| Placeholder `wrangler.jsonc` | Production `database_id` and live `EMDASH_SITE_URL` |
| Example synthesis packages under `examples/` | Your `.env` / `.dev.vars` / `EMDASH_ENCRYPTION_KEY` |
| MIT-licensed software | Owner-only backups under local `backups/` |

## Quick path (local first)

1. Fork or clone the repository.
2. Use Node.js 24.x and run `npm ci`.
3. Create `.env` with a **new** encryption key (never reuse someone else’s key). See `README.md`.
4. Optionally replace scientific content:
   - Blank start: `cp examples/personal-synthesis.empty.json src/data/personal-synthesis.json`
   - Or adapt the reference example: `examples/personal-synthesis.qoosaku-moteki.json` (rewrite authorship in `src/data/portal.ts` as well).
5. Update `src/data/portal.ts` (`SITE_STANCE`) so the site names **you**, not the previous author.
6. `npm run dev` → open `http://localhost:4321/_emdash/admin/` → **Empty site** → register **your** passkey.

## Cloudflare deploy (your account only)

1. Copy the template: `cp wrangler.jsonc wrangler.site.jsonc` (this file is gitignored).
2. Create D1 and R2 in **your** account; put **your** `database_id` and `EMDASH_SITE_URL` into `wrangler.site.jsonc`.
3. Generate a production encryption key and store it with `npx wrangler secret put EMDASH_ENCRYPTION_KEY` (never commit it).
4. `npm run build` then `npm run deploy` (both prefer `wrangler.site.jsonc` when present).
5. Run EmDash core migrations against **your** D1, then complete the setup wizard on **your** origin.

Do not paste another person’s D1 UUID, workers.dev hostname, or encryption key into your config. Details: `docs/PHASE7_DEPLOYMENT_GUIDE.md`.

## Content and ethics

- Keep the site English-only unless you fork the language policy deliberately.
- Do not publish original PDFs, DOCX, PPTX, raw transcripts, or private photographs.
- Do not claim official ICTP / convenor consensus unless you have that approval.
- YouTube: embed only IDs you are allowed to use; prefer click-to-load / youtube-nocookie patterns already in the repo.
- Source SHA-256 fingerprints are intentionally omitted from the public synthesis package.

## Making the upstream repository public

Changing GitHub visibility is a **separate owner decision**. After the repository is public, enable GitHub secret scanning and push protection on the upstream (and on your fork). On free personal private repos, secret scanning may be unavailable until the repository is public.
