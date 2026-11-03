# Phase 7 — Remaining issues, risks and recommended next steps

Assessed 3 November 2026. Severity: **High** blocks deployment or publication; **Medium** must be resolved before participants are invited; **Low** is housekeeping.

## Remaining issues and risks

| ID | Severity | Issue | Evidence / note | Mitigation |
| --- | --- | --- | --- | --- |
| R1 | High | Native publication-policy plugin uses an absolute filesystem `entrypoint` | `src/science/publication-policy.mjs` → `fileURLToPath(import.meta.url)`; Workers bundle resolution unverified | Verify with `wrangler dev`; convert to a package-style entrypoint if needed; the blocker must remain active on Cloudflare |
| R2 | High | No scientific sign-off, language review or publication approval | All packages `pending`; 49 evidence passages `pending_human_review` | Complete the review checklist in the private environment; export a reviewed v1.0.0 package |
| R3 | High | YouTube permissions and representative versions unverified; only one highlight mapped | `publicationPermission: pending`; no index-specific highlight | Obtain permissions; verify each additional video ID against the timetable before adding |
| R4 | High | No administrator or passkey; authenticated CMS behaviour untested | `emdash doctor` warns "no users" | Owner completes the wizard locally (Empty site); test edit/save/media; later repeat on the production origin |
| R5 | Medium | Dependency advisory GHSA-mrhx-c7xc-m3w5 (Zod via EmDash) | 6 high entries, 1 root advisory; forced fix would downgrade EmDash | Track EmDash releases; re-audit before exposure; do not `audit fix --force` |
| R6 | Medium | Workers runtime compatibility not executed | Only Node build verified; `node:` imports exist in dev-only code and the plugin | Run the Worker locally (`wrangler dev`) and repeat HTTP/privacy checks before provisioning |
| R7 | Medium | Participant access policy undecided | Affects `noindex`, Workers Cache, Cloudflare Access, `workers.dev` exposure | Decide before step 2 of the deployment guide |
| R8 | Medium | Scientific content writer for reviewed imports is unimplemented | Validator and dry-run plan exist; no write path | Implement after the contract is confirmed with one reviewed sample of each type |
| R9 | Medium | Private editorial packages exist only on this machine | `exports/`, `backups/` are gitignored by design | Keep an encrypted offline copy; record hashes |
| R10 | Low | Wizard pre-selects "Sample content" | Seed has no samples, so the effect is nil, but instructions say "Empty site" | Keep README instruction; consider removing the option via seed metadata if EmDash allows |
| R11 | Low | Embedded player shows the YouTube channel name in Japanese | Channel metadata, not site content | Decide whether to add an English channel display name |
| R12 | Low | `.claude/state/` was briefly tracked in Git history | Removed from the index on 3 Nov; file still exists locally | Nothing further unless the history itself must be rewritten (not recommended for a private repo) |
| R13 | Low | Documentation language is mixed (EN/JA) across phases | Phase 3/4 docs Japanese, others English | Acceptable for an internal repo; the website itself is English-only |

## What is already in place

- Draft/publication separation at three layers: file-system (`exports/` ignored and HTTP-denied), build (`import.meta.env.DEV` gate, verified in `dist/`), CMS (publish/schedule blocker for scientific collections).
- No secrets, databases or private paths in tracked files or Git history (scanned 3 Nov).
- SQLite backup + integrity + `doctor` rehearsal passed; Cloudflare backup/restore plan documented with official commands.
- Inactive Cloudflare templates aligned with the official EmDash guide.

## Recommended next development steps (in order)

1. **Owner actions (no code):** complete the local admin wizard; decide participant access policy; obtain YouTube permissions; name a backup owner.
2. **Scientific review round:** work through `PHASE7_SCIENTIFIC_REVIEW_CHECKLIST.md` in the private environment; produce one reviewed talk, one anonymous discussion summary and one illustrative workflow as a v1.0.0 export.
3. **Import writer (local only):** implement the write path behind the existing validator; prove idempotent re-import on a copy of `data.db`; keep the publication blocker on.
4. **Workers dry run (local only):** on a branch, apply the templates, resolve R1, run `wrangler dev`, repeat the verification scripts, and record results. No cloud resources yet.
5. **Dependency re-audit** after the next EmDash release.
6. **Authorized provisioning and first deployment** following `PHASE7_DEPLOYMENT_GUIDE.md`, with a restore rehearsal before participants are invited.

Until step 6 is authorized, the deliverable is the functioning local prototype as verified in `PHASE7_TECHNICAL_VALIDATION.md`.
