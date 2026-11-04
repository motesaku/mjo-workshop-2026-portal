# Phase 7 — Cloudflare deployment guide (prepared, not executed)

Status on 4 November 2026: **owner production Worker is live with `noindex`**. Active config: Cloudflare `astro.config.mjs`, committed template `wrangler.jsonc` (no production UUIDs), local overlay `wrangler.site.jsonc` (gitignored), `src/worker.ts`. Node prototype retained as `astro.config.node.mjs`. Each deployer creates their own D1 / R2 / SESSION KV and records IDs only in the local overlay or offline notes—never in Git. Scientific pages are served from bundled personal synthesis (source file fingerprints omitted). Owner EmDash setup on the production origin completed 2026-11-04. **Still open:** custom domain; indexing; Access; GitHub Actions; explicit GitHub visibility change for community forks (see `docs/FORKING.md`).

Official sources checked on 3 November 2026: [Deploy to Cloudflare](https://docs.emdashcms.com/deployment/cloudflare/), [Core database migrations](https://docs.emdashcms.com/deployment/core-migrations/), [Backups and recovery](https://docs.emdashcms.com/guides/backups/), [Secrets and key management](https://docs.emdashcms.com/deployment/secrets/), [Configuration](https://docs.emdashcms.com/reference/configuration/). Re-read them at execution time; API names and compatibility dates change.

## 0. Gates that must be passed first

1. Scientific sign-off, language review and publication approval for any content that will be visible (currently: none approved; the site would deploy in its review-pending state).
2. YouTube publication permission and representative-version approval for every embedded highlight.
3. Participant access policy: public, Cloudflare Access-protected, or password/identity-gated. This determines whether Workers Cache and `workers.dev` may be enabled.
4. Approved Cloudflare account, domain, budget ceiling (Workers Paid is recommended for 30-day Time Travel), and named backup/restore owner.
5. Dependency audit finding (GHSA-mrhx-c7xc-m3w5 via EmDash) resolved or formally accepted. Status 2026-11-04: EmDash 1.4.0 still pins Zod 4.5.4, so `package.json` `overrides` pins Zod 4.6.7 under `emdash`, `@emdash-cms/auth` and `@emdash-cms/plugin-types`; `npm audit` reports 0 vulnerabilities. Remove the override once an EmDash release depends on Zod ≥ 4.6.6. Zod 4.6.6+ rejects oversized arrays that declare a maximum length before validating their elements. Unbounded array schemas still produce one issue per invalid element, so request-size limits remain relevant.
6. Separate written authorization for: (a) installing packages, (b) creating cloud resources, (c) first deployment, (d) attaching the custom domain.

## 1. Prepare the code (local, reversible)

Do this on a branch; keep `main` runnable with the Node adapter until the Worker build is verified.

1. Back up `.env`, `data.db` (`sqlite3 data.db ".backup …"` + `PRAGMA integrity_check`), `uploads/`, `exports/`, `backups/` to a location outside the repository.
2. Install (with approval): `@astrojs/cloudflare`, `@emdash-cms/cloudflare`, dev `wrangler@latest` (≥ 4.135.0 if Worker Previews are wanted). Remove `@astrojs/node` only after the Worker build passes.
3. Copy templates:
   - `deploy/cloudflare/wrangler.jsonc.example` → `wrangler.jsonc`
   - `deploy/cloudflare/worker.ts.example` → `src/worker.ts`
   - `deploy/cloudflare/astro.config.cloudflare.mjs.example` → `astro.config.mjs` (keep the Node version as `astro.config.node.mjs` for local work)
   - `deploy/cloudflare/dev.vars.example` → `.dev.vars` (gitignored), with a **new** encryption key from `npx emdash secrets generate`
4. Resolve the native plugin entrypoint (`src/science/publication-policy.mjs` uses `fileURLToPath(import.meta.url)`). Confirm with `wrangler dev` that `createPlugin` loads inside the Worker; if not, convert it to a package-style entrypoint (local workspace package or path alias) before continuing. The publication blocker must be active on the deployed site.
5. `npm run typecheck && npm run build`. Inspect `dist/server/wrangler.json` (the merged config Wrangler deploys) and confirm `DB`, `MEDIA`, `SESSION` (added by the adapter), `IMAGES`, cron trigger, `nodejs_compat`.
6. `npx emdash doctor` must report a passing **scheduler wiring** check (Cron Trigger + `scheduled` handler). The `database` check fails on a D1 project by design.
7. Local Worker run: `npx wrangler dev` (binds `127.0.0.1:8787`, local D1/R2 emulation). Re-run `node scripts/verify-phase6.mjs production` adapted to port 8787 and `scripts/verify-phase4-http.mjs`; confirm `/exports/…`, `/backups/…`, `/.env`, `/data.db` return 403/404 and that `dist/` contains no draft text.

## 2. Provision resources (requires authorization b)

```sh
npx wrangler login
npx wrangler d1 create mjo-workshop-2026-portal      # record the UUID offline → wrangler.site.jsonc only
npx wrangler r2 bucket create mjo-workshop-2026-portal-media
cp wrangler.jsonc wrangler.site.jsonc   # gitignored; put YOUR database_id and EMDASH_SITE_URL here
```

Keep `"workers_dev": false`, `"preview_urls": false` and no `routes` in a **new** overlay until the first-run protection in §4a is in place. Set `EMDASH_SITE_URL` to the final https origin now (for `workers.dev`: `https://<worker-name>.<account-subdomain>.workers.dev`).

Do not create a public R2 custom domain. EmDash writes JSON backups under `backups/` in the same bucket; a public bucket origin would expose them. Do not commit `wrangler.site.jsonc` or paste another person’s D1 UUID into your overlay.

## 3. Secrets (never in files)

```sh
npx emdash secrets generate                                                   # new production key
npx wrangler secret put EMDASH_ENCRYPTION_KEY --config wrangler.site.jsonc    # paste the generated value
```

Always pass `--config wrangler.site.jsonc` to Wrangler commands that act on Cloudflare resources (`secret put`, `d1 …`, `tail`). Without it Wrangler reads the committed template, whose Worker name may not match yours.

- Store the key in a secret manager **and** in a separate recovery backup; D1 backups do not contain it.
- `EMDASH_SITE_URL` is a non-secret var in `wrangler.jsonc` `vars`. Set it to the final origin **before** running the setup wizard; passkeys bind to that origin and localhost passkeys will not work in production.
- Optional later: `CF_ACCESS_AUDIENCE` (if Cloudflare Access replaces passkeys), email provider binding.

## 4. Migrate, deploy, check (requires authorization c)

Follow the official "build, migrate, deploy, check" order.

```sh
npm run build    # reads wrangler.site.jsonc in place when present (nothing is copied)
export CLOUDFLARE_ACCOUNT_ID=…   # from the dashboard; shell only
export CLOUDFLARE_API_TOKEN=…    # scoped token with D1 Edit; shell only, never committed
npx emdash migrate --status --wrangler-config wrangler.site.jsonc
npx emdash migrate --wrangler-config wrangler.site.jsonc
npm run deploy   # stops unless the build was generated from a complete wrangler.site.jsonc
npx emdash migrate --check --wrangler-config wrangler.site.jsonc
```

- How the configuration is chosen: `scripts/with-site-wrangler.mjs build` passes the absolute path of `wrangler.site.jsonc` to `astro.config.mjs` through `PORTAL_WRANGLER_CONFIG` (`cloudflare({ configPath })`). Astro writes `dist/server/wrangler.json` and the official redirect `.wrangler/deploy/config.json`, which `wrangler deploy` follows. `npm run deploy` checks that the generated config came from `wrangler.site.jsonc` and matches its Worker name, D1/R2 bindings and `EMDASH_SITE_URL`. It refuses `--config`/`--env` overrides. `npm run dev` and `astro check` always use the committed template. The template file is never rewritten, so concurrent or interrupted runs cannot leave production settings in a tracked file.
- Record the printed target fingerprint in **offline** deployment notes (not in the public Git tree).
- Until setup completes, the first request applies the seed's schema (10 collections, no sample content). Verify that the template shown by the wizard is "MJO Workshop 2026 Portal".
- Once the domain is validated (authorization d), add the approved `routes` and decide whether to keep `workers_dev`.

## 4a. First-run protection for a new database (before anyone can reach it)

On an empty database, the **first visitor who completes the setup wizard becomes the administrator**. `noindex` is not access control, and EmDash only refuses a second setup after the first administrator exists. For every new deployment:

1. Make the first deploy with `"workers_dev": false`, `"preview_urls": false` and no `routes`, so that the Worker has no public hostname.
2. In the Cloudflare dashboard, open **Workers & Pages → the Worker → Access → Protect this Worker behind Access → All traffic**. Use a policy that admits only the owner, for example a single email address or the owner's Cloudflare account. Worker-level Access covers every hostname of the Worker: `workers.dev`, previews, routes and custom domains. Source: [Cloudflare Access for Workers](https://developers.cloudflare.com/workers/configuration/cloudflare-access/) (re-check labels at execution time).
3. Set `"workers_dev": true` in `wrangler.site.jsonc`, `npm run build`, `npm run deploy`.
4. Unauthenticated check: from a private window, or with `curl -sI`, `/`, `/_emdash/admin/` and `/_emdash/api/setup/status` must answer with the Access login or redirect, not with the site.
5. Sign in through Access and complete the setup wizard **on the production hostname**. Passkeys are bound to the hostname, so a passkey registered on `localhost` or on a preview URL does not work here. Sign out and sign in again with the new passkey.
6. Still behind Access, `/_emdash/api/setup/status` must report `"needsSetup": false`. EmDash then rejects `POST /_emdash/api/setup` (`409 ALREADY_CONFIGURED`) and the first-admin endpoints (`SETUP_COMPLETE`).
7. Only after step 6, and only with the access-policy decision from §0 item 3, relax or remove the Worker-level Access rule. Removing a Worker-level rule can expose an account-level rule underneath; check the resulting behaviour from a private window.

Record in offline notes which steps were verified on the real hostname. Writing this procedure is not the same as verifying it. Until an operator has run it, treat this section as **procedure prepared, not operationally verified**.

## 5. First-run verification

1. Open the `workers.dev` (or approved) URL through Access: homepage 200, English, `noindex` headers as designed for the prototype (decide whether to keep `noindex` for the participant-only phase).
2. Complete the setup wizard on the **production origin**, behind the §4a protection: title "MJO Workshop 2026", tagline "Knowledge & Action Portal", **Empty site**, owner email, passkey.
3. Sign in, open the dashboard, upload and delete a disposable image (R2 round trip), create and discard a draft Post (D1 write).
4. `npx wrangler tail` shows the cron run line every minute; the dashboard shows no "Scheduled publishing needs attention".
5. Attempt to publish an entry in any scientific collection → expect `PUBLISH_REJECTED` from `mjo-scientific-publication-policy`.
6. Theme pages show the review-pending state; `/questions/themes/q02` returns 404; `/exports/…` and `/backups/…` are not served.
7. Video page: iframe loads only on click, from `youtube-nocookie.com`.
8. Run the HTTP verification scripts against the deployed origin (read-only).

## 6. Backup and restore plan (Cloudflare)

| Asset | Backup | Restore | Owner / cadence |
| --- | --- | --- | --- |
| D1 database | `npx wrangler d1 time-travel info mjo-workshop-2026-portal` before every migration/deploy (record bookmark); monthly offsite SQL dump using the official four-file export (schema / folders / data / indexes, FTS tables excluded); run the ≥100 000-byte line check | Time Travel `restore --bookmark=<pre-change>` (7 days Free / 30 days Paid); or import the four files into an **empty** recovery database, verify, then switch binding | To be named; before each change + monthly |
| R2 media | `aws s3 sync s3://mjo-workshop-2026-portal-media ./r2-backup --endpoint-url https://<account>.r2.cloudflarestorage.com` with read-only credentials; includes EmDash JSON `backups/` | Sync into an empty recovery bucket, verify media URLs on a non-production deployment, then switch | To be named; weekly |
| `EMDASH_ENCRYPTION_KEY` (rotation list) | Secret manager + separate offline copy | `wrangler secret put` before reopening traffic | Owner; on creation and rotation |
| EmDash JSON backups | Settings → Backups → enable daily, retention 1–30 | **Inspection only** — EmDash cannot restore this format | Automatic (needs the Cron Trigger) |
| Site package (`emdash site export`) | Occasional, for migration between EmDash sites | `emdash site import --analyze` → review plan → `--confirm` into an empty site; excludes users/tokens/plugin data | On demand |
| Application artifact | Git tag + `.emdash/migrations.json` from the same build | Redeploy the matching tag; core migrations are forward-only | Each deployment |

Rehearse one full restore (Time Travel or dump import) into a non-production database before announcing the site to participants. Document the result next to this guide.

## 7. Rollback

- Code regressions: redeploy the previous tag (`wrangler deploy` of the previous build). This does **not** undo core migrations.
- Schema/data regressions: Time Travel restore to the bookmark recorded in step 4, then redeploy the matching artifact; verify sign-in, a content read, a write and the publication blocker.
- Never delete rows from `_emdash_migrations` or run a migration's internal `down()`.

## 8. Explicitly out of scope until further authorization

GitHub Actions deployment workflows, Workers Cache / KV object cache, Cloudflare Access configuration beyond the §4a first-run protection (for example replacing passkeys with `auth: access()`), email provider, custom domain, public R2 domain, previews, and any content import. Each is a separate decision with its own verification.
