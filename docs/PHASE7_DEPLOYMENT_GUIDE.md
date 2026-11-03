# Phase 7 — Cloudflare deployment guide (prepared, not executed)

Status on 3 November 2026: **no Cloudflare resource, Wrangler login, deployment, preview or tunnel exists.** The project remains a Node.js + SQLite local prototype. Everything below is a procedure to follow only after the owner explicitly authorizes public deployment. Templates live in `deploy/cloudflare/` with an `.example` suffix so nothing is active.

Official sources checked on 3 November 2026: [Deploy to Cloudflare](https://docs.emdashcms.com/deployment/cloudflare/), [Core database migrations](https://docs.emdashcms.com/deployment/core-migrations/), [Backups and recovery](https://docs.emdashcms.com/guides/backups/), [Secrets and key management](https://docs.emdashcms.com/deployment/secrets/), [Configuration](https://docs.emdashcms.com/reference/configuration/). Re-read them at execution time; API names and compatibility dates change.

## 0. Gates that must be passed first

1. Scientific sign-off, language review and publication approval for any content that will be visible (currently: none approved; the site would deploy in its review-pending state).
2. YouTube publication permission and representative-version approval for every embedded highlight.
3. Participant access policy: public, Cloudflare Access-protected, or password/identity-gated. This determines whether Workers Cache and `workers.dev` may be enabled.
4. Approved Cloudflare account, domain, budget ceiling (Workers Paid is recommended for 30-day Time Travel), and named backup/restore owner.
5. Dependency audit finding (GHSA-mrhx-c7xc-m3w5 via EmDash) resolved or formally accepted.
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
npx wrangler d1 create mjo-workshop-2026-portal      # record the UUID → wrangler.jsonc database_id
npx wrangler r2 bucket create mjo-workshop-2026-portal-media
```

Do not create a public R2 custom domain. EmDash writes JSON backups under `backups/` in the same bucket; a public bucket origin would expose them.

## 3. Secrets (never in files)

```sh
npx emdash secrets generate                              # new production key
npx wrangler secret put EMDASH_ENCRYPTION_KEY            # paste the generated value
```

- Store the key in a secret manager **and** in a separate recovery backup; D1 backups do not contain it.
- `EMDASH_SITE_URL` is a non-secret var in `wrangler.jsonc` `vars`. Set it to the final origin **before** running the setup wizard; passkeys bind to that origin and localhost passkeys will not work in production.
- Optional later: `CF_ACCESS_AUDIENCE` (if Cloudflare Access replaces passkeys), email provider binding.

## 4. Migrate, deploy, check (requires authorization c)

Follow the official "build, migrate, deploy, check" order.

```sh
npm run build
export CLOUDFLARE_ACCOUNT_ID=…   # from the dashboard
export CLOUDFLARE_API_TOKEN=…    # scoped token with D1 Edit; shell only, never committed
npx emdash migrate --status --wrangler-config wrangler.jsonc    # confirm account + UUID + fingerprint
npx emdash migrate --wrangler-config wrangler.jsonc             # interactive; confirm target
npx wrangler deploy
npx emdash migrate --check --wrangler-config wrangler.jsonc
```

- Record the printed target fingerprint with the deployment notes.
- Until setup completes, the first request applies the seed's schema (10 collections, no sample content). Verify that the template shown by the wizard is "MJO Workshop 2026 Portal".
- Keep `workers_dev` enabled only while testing; set `workers_dev: false` and add the approved `routes` once the domain is validated (authorization d).

## 5. First-run verification

1. Open the `workers.dev` (or approved) URL: homepage 200, English, `noindex` headers as designed for the prototype (decide whether to keep `noindex` for the participant-only phase).
2. Complete the setup wizard on the **production origin**: title "MJO Workshop 2026", tagline "Knowledge & Action Portal", **Empty site**, owner email, passkey.
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

GitHub Actions deployment workflows, Workers Cache / KV object cache, Cloudflare Access configuration, email provider, custom domain, public R2 domain, previews, and any content import. Each is a separate decision with its own verification.
