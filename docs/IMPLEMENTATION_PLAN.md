# Implementation Plan

Updated 2026-11-03. Phase 1 decisions were read from the preceding audit/planning chat; its source materials remain in the private research repository. Phases 2–6 below record local foundation, import contract, portal presentation and editorial theme work. Scientific CMS publication and public deployment remain unauthorized.

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

## Phase 3: reviewed publication contract

- [x] Define the scientific import contract, provenance rules and publication policy in-repo.
- [x] Implement validation and dry-run planning that reject unreviewed claims, private paths and forbidden attachments.
- [x] Keep EmDash publish/schedule blocked for scientific collections until a later authorized writer exists.
- [ ] Import one reviewed talk, one anonymous discussion summary and one illustrative workflow after owner authorization.
- [ ] Complete scientific sign-off, language review and publication approval for any imported records.

## Phase 4–5: portal presentation and editorial drafts

- [x] Build English day/theme indexes, detail views, highlight embeds and illustrative workflow pages.
- [x] Keep record-gap labels visible; do not turn workflow examples into project-management records.
- [x] Prepare Phase 5 editorial issue/workflow drafts under ignored `exports/` (not CMS imports).
- [ ] Confirm remaining YouTube highlight mappings, representative versions and publication permissions.

## Phase 6: dedicated scientific themes

- [x] Deliver independent `/ai-for-mjo-research` and `/mjo-indices-and-diagnostics` sections in primary navigation.
- [x] Author local English theme review package and Japanese scientific synthesis under ignored `exports/`.
- [x] Withhold draft theme/issue bodies from normal builds; expose them only in local development.
- [x] Record mechanical verification in `docs/PHASE6_IMPLEMENTATION.md`.
- [ ] Complete scientific sign-off, language review, publication approval and any additional video mappings.

## GitHub gate

Remote configured: `motesaku/mjo-workshop-2026-portal` (private), tracking `origin/main`.
Do not use `researcher_os` as a submodule, workspace package or CI checkout. No automatic deployment integration is installed. Additional pushes, visibility changes and CI deploy hooks still require explicit authorization. A private repository is not website access control.

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
- Complete scientific/language/publication review for Phase 5–6 editorial packages before any CMS import.
- Specify remaining video mappings, participant access policy and approved import samples.
- Authorize Cloudflare provisioning/deployment separately when ready.
