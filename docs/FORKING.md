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
6. `npm run dev` → open `http://localhost:4321/_emdash/admin/` → **Empty site** → register **your** passkey. This local passkey only works on `localhost`; production needs its own setup (see below).

## Cloudflare deploy (your account only)

> **Protect the empty CMS before anyone can reach it.** On a new database, the first visitor who completes the EmDash setup wizard becomes the administrator. `noindex` does not prevent this. Keep the Worker unreachable, or behind Cloudflare Access, until **you** have finished setup on the production hostname.

1. Copy the template: `cp wrangler.jsonc wrangler.site.jsonc` (this file is gitignored). Keep `"workers_dev": false` and `"preview_urls": false` from the template, and add no `routes` yet.
2. Create D1 and R2 in **your** account. Put **your** `database_id` and the final `EMDASH_SITE_URL` (for example `https://<worker-name>.<your-subdomain>.workers.dev`) into `wrangler.site.jsonc`.
3. Generate a production encryption key and store it with `npx wrangler secret put EMDASH_ENCRYPTION_KEY --config wrangler.site.jsonc` (never commit it). `--config` makes the secret go to the Worker named in your overlay.
4. `npm run build`. The build reads `wrangler.site.jsonc` in place; no file is copied over the committed template.
5. Run EmDash core migrations against **your** D1: `npx emdash migrate --wrangler-config wrangler.site.jsonc`.
6. `npm run deploy`. It stops unless `wrangler.site.jsonc` has a real D1 ID and an https `EMDASH_SITE_URL`, and unless the current build was generated from that overlay. With `workers_dev: false` and no routes, the Worker has no public URL yet.
7. In the Cloudflare dashboard, open **Workers & Pages → your Worker → Access → Protect this Worker behind Access → All traffic**. Use a policy that admits only you, for example a single email address. Worker-level Access covers `workers.dev`, preview URLs, routes and custom domains ([Cloudflare docs](https://developers.cloudflare.com/workers/configuration/cloudflare-access/)). Dashboard labels can change; check the current docs.
8. Set `"workers_dev": true` in `wrangler.site.jsonc`, then `npm run build` and `npm run deploy` again.
9. From a private browser window (not signed in to Access), confirm that `/`, `/_emdash/admin/` and `/_emdash/api/setup/status` show the Cloudflare Access login rather than your site.
10. Sign in through Access and complete the setup wizard on the **production hostname**. A passkey registered on `localhost` does not work there. Sign out, then sign in again with the new passkey.
11. While still signed in, open `/_emdash/api/setup/status` and confirm that it reports `"needsSetup": false`. From then on, EmDash refuses another setup or a second first administrator.
12. Only after step 11, and only if public access is approved, change the Access protection (for example to **Previews only**) or remove it. Check that no account-level Access rule unexpectedly takes over.

Until both setup and its check are done, do not share the URL, open preview URLs or attach a custom domain. Do not paste another person’s D1 UUID, workers.dev hostname or encryption key into your config. Details: `docs/PHASE7_DEPLOYMENT_GUIDE.md`.

## Content and ethics

- Keep the site English-only unless you fork the language policy deliberately.
- Do not publish original PDFs, DOCX, PPTX, raw transcripts, or private photographs.
- Do not claim official ICTP / convenor consensus unless you have that approval.
- YouTube: embed only IDs you are allowed to use; prefer click-to-load / youtube-nocookie patterns already in the repo.
- Source SHA-256 fingerprints are intentionally omitted from the public synthesis package.

## Making the upstream repository public

Changing GitHub visibility is a **separate owner decision**. After the repository is public, enable GitHub secret scanning and push protection on the upstream (and on your fork). On free personal private repos, secret scanning may be unavailable until the repository is public.
