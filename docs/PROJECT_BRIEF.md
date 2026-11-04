# Project Brief

Status: Updated 2026-11-03. Local prototype with a decided **public personal-report** stance. Cloudflare public hosting not yet authorized.

## Purpose and audience

An English-only Knowledge & Action Portal about MJO Workshop 2026 (ICTP, Trieste). From 2026-11-03 the owner publishes it as a **personal workshop participation report** by Qoosaku Moteki: one participant’s learning and present understanding. It is not an official ICTP or multi-author consensus product, and it does not manage other participants’ accounts. See `docs/OWNER_ACCESS_POLICY.md`.

## System boundaries

| System | Responsibility |
| --- | --- |
| Offline / private editorial work (outside this Git repo) | Original minutes, transcripts, source documents, scientific validation, corrections, provenance, video production and approved derivative generation |
| This portal repository | Astro/TypeScript application, EmDash CMS, reviewed publication derivatives, presentation and import validation |
| YouTube | Approved highlight video hosting; verified IDs used for embeds |
| Cloudflare | Workers execution, D1 CMS data, R2 approved site assets and protected backups |

The portal has no filesystem, package, build, or Git dependency on those offline sources. No raw scientific source files are copied here. Future imports must be explicit allowlisted exports of reviewed derivatives, not a folder sync or automatic publication pipeline.

## Editorial rules inherited from Phase 1

- Use reviewed meeting minutes to create English summaries; state record gaps and uncertainty.
- Attribute individuals only for programme-listed individual talks. Discussion pages carry no individual speaker names.
- Do not directly link rapporteur notes, photos, PDFs, Word or presentation originals.
- Action examples are illustrations, not assignments, deadlines, progress reports or claims of completed action.
- The user reports visual review of one-minute highlights. Final version selection, permissions and YouTube ID mappings remain to be confirmed.
- Distinguish observations, interpretations, hypotheses, proposals and formally documented consensus. Unverified scientific claims cannot be published.

## Future scope

Day/theme navigation; talk and discussion summaries; an approved highlight library; illustrative action/workflow examples; clear provenance, review and partial-coverage notes. No substantial scientific content belongs in the current foundation.

## Open decisions and known source issues

Before importing: reconcile the provisional programme with actual sessions; check Siena/Rushley video identity; select canonical duplicate minutes/video versions; clarify uncertain session dates/labels and partial transcripts. Phase 1 identified these issues; this phase does not resolve them or import their data.

Still to be decided: participant access controls, site/domain identity, editor identities, YouTube channel/playlist and embed permissions, backup operations, Cloudflare account/region/cost ceiling, and publication reviewer. Private source-code hosting is not website access control.

## Phase 2 success criteria

Official EmDash scaffold; separate local Git root; Node.js/SQLite development; accessible English homepage and initial EmDash setup; durable instructions and plans; safe secret/data exclusions; type/build verification. No repository creation, upload or public deployment.
