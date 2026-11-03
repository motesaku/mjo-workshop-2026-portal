# Implementation Plan

Updated 2026-11-01. Phase 1 decisions were read from the preceding audit/planning chat; its source materials remain in the private research repository. This phase implements the requested local foundation before any scientific import.

## Phase 2: local foundation

- [x] Generate using the official `create-emdash` Node.js Starter workflow.
- [x] Keep a separate directory and local Git root outside `researcher_os`.
- [x] Configure Astro server rendering, React administration, SQLite and local media storage.
- [x] Provide an English placeholder homepage without scientific claims.
- [x] Retain official Starter Posts/Pages routes and live loader; remove sample seed entries.
- [x] Document permanent project rules, manual setup, repository boundaries and deployment gates.
- [x] Ignore secrets, runtime data, backups, source documents and videos.
- [x] Complete homepage/admin browser and HTTP verification, typecheck and build; record evidence in VERIFICATION.md.
- [ ] Owner completes initial admin identity and passkey registration (manual).

No remote creation/push, CMS scientific publication, YouTube upload or Cloudflare operation is authorized by Phase 2.

## Next: reviewed publication contract

1. In the private research environment, reconcile programme, canonical minutes and videos. Preserve originals.
2. Define exported fields: stable item ID, type (talk/discussion/workflow), date/time/timezone, theme, English summary, coverage limits, source reference/hash/version, review status, publication approval and approved YouTube ID. Speaker names are allowed only for individual talks.
3. Define scientific text ownership and re-import behavior: source remains the research environment; decide exactly which display fields editors may change in EmDash. Test idempotency and revision handling before bulk imports.
4. Implement validation which rejects unreviewed/unapproved claims, missing provenance, private paths, forbidden attachments and discussion speaker names. EmDash publishing controls are not this validator.

Done when one reviewed talk, one anonymous discussion summary and one illustrative workflow can be validated and imported locally without duplicate entries or private information. These representative samples require later instructions; none are loaded now.

## Then: portal presentation

Build day/theme indexes, item detail views, highlight embeds and workflow examples around the approved contract. Keep record-gap labels visible. Verify English-only display, keyboard/mobile layout, mathematical notation, tables, links and YouTube playback. Do not turn workflow examples into project-management records.

## GitHub gate — explicit authorization required

Intended remote: `motesaku/mjo-workshop-2026-portal`, private. Review file inventory and exclusions before configuring the origin, committing or pushing. Do not use `researcher_os` as a submodule, workspace package or CI checkout. No automatic deployment integration is installed.

## Cloudflare migration — plan only

Follow the current official [EmDash Cloudflare guide](https://docs.emdashcms.com/deployment/cloudflare/) when migration is authorized; recheck APIs and compatibility versions at that time.

1. Confirm approved account, participant access policy, domain, budget and backup/restore ownership. Resolve dependency audit findings before exposure.
2. Back up SQLite CMS data/uploads and the encryption key separately. Test the official content export/import or site-transfer workflow against a local copy; do not treat a SQLite file as a direct D1 import or assume schema compatibility.
3. Replace the Node adapter with `@astrojs/cloudflare`; add `@emdash-cms/cloudflare`. Configure `d1({ binding: "DB" })` and `r2({ binding: "MEDIA" })`. Keep Astro server rendering and React integration.
4. Add the official Worker entry point and scheduled handler for publishing/maintenance. Configure matching D1/R2 binding names, `nodejs_compat` and an appropriate compatibility date. Use sandboxed plugins only if required and approved.
5. Plan migrations, restore checks, secret injection (`EMDASH_ENCRYPTION_KEY`) and database/storage lifecycle. Never put secrets in public environment variables, source or build-time `import.meta.env` values.
6. R2 holds approved site assets, never videos or original research documents. Keep backup objects private; never expose a whole bucket containing backups.
7. Select the final authentication origin before admin registration. Existing localhost passkeys do not automatically work on a production domain. Configure editor authentication and participant access as separate concerns.
8. Prepare and review the full configuration and content, then obtain explicit authorization before creating cloud resources or any remotely reachable deployment, including previews. Wrangler may provision named resources on deployment.
9. After authorized deployment, verify access policy, homepage/admin behavior, YouTube playback, content gates, secrets and restore capability in the deployed environment.

No active Wrangler configuration/deploy script is included now. Local Node build success does not establish Workers/D1/R2 compatibility.

## Outstanding owner actions

- Register the local admin email/passkey in the setup wizard.
- Specify later content imports, approval workflow, video mappings and participant access policy.
- Authorize private GitHub creation/push and Cloudflare provisioning/deployment separately when ready.
