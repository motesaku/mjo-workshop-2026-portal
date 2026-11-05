# Phase 10 — Repository recovery, author-review package and research readiness

Started 2026-11-05. Phase 10 does **not** deploy, change repository visibility, push, modify Cloudflare resources or private source documents, or approve any scientific statement. All new scientific wording is a proposal awaiting the author's decision.

## 10A — Repository recovery

### What happened

Commit `0d13cdb` ("refactor(config): streamline Wrangler configuration and update scripts", 2026-11-05 09:44 JST) was not a refactor. Each of the 30 files it changed is byte-identical to its state at commit `87603a4` (2026-11-04), which is also the content of an editor turn-diff checkpoint created on 2026-11-04 at 15:19. On 2026-11-05 at 09:43:30 about fifty files—including files whose content had not changed and one gitignored local file—were rewritten within one second: a file-system-level checkpoint restore, not a Git operation. Files added after `87603a4` were not removed, so the Phase 8/9 data layers, pages, tests and scripts survived while the components, layout, navigation, styles, npm scripts and security wiring that use them reverted. The commit message described the resulting diff.

What the overwrite removed:

| Area | Lost behaviour |
| --- | --- |
| Pages and components | Homepage insights and synthesis entry, roadmap areas and graph, Q03/Q07 classification, provenance and review labels, evidence-derived video↔question relations (a hard-coded Q01 card returned on every clip page), minutes-based key-message labels |
| Worker entry | The public request guard (64 KiB body limit, array/depth limits) on unauthenticated EmDash API routes |
| Dependencies | Zod 4.6.7 overrides for EmDash and its auth packages |
| Dev server | `vite.server.fs.deny` for secrets, CMS state and private exports |
| Build/deploy wrapper | Overlay read in place; the old version copied `wrangler.site.jsonc` over the committed template during builds |
| Template | `workers_dev: false` for new deployments |
| Scripts and Git | `test:security`, `test:phase8`, `test:phase9`, `verify:phase8`, `verify:phase9`; `.claude/sessions/` ignore rule (a session file became tracked) |

Why nothing caught it: every existing unit test still passed, because the suites test the data modules, not whether pages, the Worker entry, the build wrapper or npm scripts use them; `astro build` does not type-check (the regressed tree had two type errors); and the HTTP verifiers were neither run nor required before committing or deploying.

The production site was not affected: it had been deployed from `62daf4b` about an hour earlier.

### Recovery

`4179ab0 fix(recovery)` restores the 30 files from `62daf4b` file by file (no history rewrite, no whole-commit revert) and untracks the session file. No change in `0d13cdb` was newer than an existing version, so nothing from it needed to be kept. The resulting tree is identical to `62daf4b`. Local tags: `recovery/pre-phase10-head` (`0d13cdb`), `recovery/phase9-healthy` (`62daf4b`), `recovery/phase10a-checkpoint` (`1ebc066`).

### Regression protection (`1ebc066`)

- `npm run test:phase10` — no server: build wrapper reads the overlay in place; deploy refuses without overlay, build or release stamp; `local` refuses `--remote`; guard wired before EmDash in `src/worker.ts`; dev-server deny list; safe Wrangler template; npm scripts and their targets; Zod pin in `package-lock.json`; private state ignored and untracked; Phase 9 data complete; pages import the science layer and contain no hard-coded question or clip links. Ten of its eleven original tests fail on `0d13cdb`.
- `npm run verify:phase10` — HTTP, loopback only: primary and mobile navigation, homepage insights and counts, synthesis provenance, roadmap areas and one graph arrow per relation and type, pilot titles and stages, question classification and review dimensions, clip question cards equal to evidence-derived relations, 413 from the guard, 25 private paths closed, no private markers in HTML, no pending proposal served.
- `npm run release:check` — Node 24, Git state, type check, `npm test`, science checks, production build, privacy scan of `dist/client`, the built Worker in the local Workers runtime checked with verify-phase8/9/10; writes `.verification/release-readiness.json`.
- `npm run deploy` refuses unless that stamp passed for the current clean commit and an unchanged `dist/`; `--dry-run` only warns.
- The dev server also denies `*.ja.md`, `.claude/`, `.codex/` and `.emdash/`. Before this, `127.0.0.1:4321` returned the owner-local Japanese review notes and agent state files on request (the Workers runtime and production returned 404).

## 10B/10C — Author-review proposals (`5fd692d`)

`src/science/phase10/proposals.mjs` is not imported by any page. It holds Tier 1 (executive synthesis and the eight insights), Tier 2 (Q01, Q03, Q07, Q09, Q11 and the regional-value framework) and Phase 10 Tier 4 findings, each with the target text, proposed wording, reason, cited statements, record support, uncertainty, a suggested decision and an empty `decision`. Five decisions are available: approve, approve with revisions, request further source verification, withhold, reject. Tests reject any decision not recorded as the author's with a date, and any page that imports pending proposals. The three review dimensions—consistency with the converted minutes, scientific validity and publication approval—remain separate. `PHASE9_EDITORIAL.status` is unchanged.

Main proposals:

- **Executive synthesis**: state first that the connecting question is editorial; name the different outcomes that theory, observations, modeling, prediction and applications legitimately optimize; name coverage gaps.
- **Insights**: all eight are consistent with their cited minutes. Revisions concern framing: insight 1 (the clearest dispute is recorded within one discussion group), insight 2 (initiation and termination, not propagation as such, lack definitions), multiscale (a basis statement also rests on the site author's own talk), insight 5 (the disagreement is about evidence, and conclusions depend on use, validated range and claim).
- **Q03**: recommended hybrid classification—an open question with a narrowly defined recorded contrast (one Q&A exchange, labelled in the minutes as the discussant's view). Budget notation separates the identity `−∇h·(q vh) = −vh·∇h q − q ∇h·vh` from physical mechanisms, distinguishes column-integrated from layer budgets, and states five testable questions (relative contributions, temporal ordering, vertical and regional structure, necessity versus correlation, sensitivity to mean state, season and phase).
- **Q07**: three layers retained; Layer 2 restated so that the recorded disagreement is neither softened nor turned into a requirement that bounded AI use needs a complete physical explanation; a conditional table by use.
- **Regional value**: four levels retained; where each link can fail, marked empirical or conceptual. No decision benefit is claimed.

The private review appendix is generated by `npm run science:export-phase10-review` into gitignored `exports/`.

### Author decision (2026-11-05)

On 2026-11-05 the author instructed that every Tier 1 and Tier 2 recommendation be approved as proposed and applied to the site. The fourteen decisions are recorded in `proposals.mjs` (`decidedBy: "author"`, with the instruction text). `src/science/phase10/apply.mjs` applies only author-approved proposals: the executive synthesis and four insights use the approved wording, the remaining four insights are marked approved without change, Q03 moves to Open Questions as an open question with one recorded contrast (with budget conventions and testable questions), Q07 Layer 2 uses the approved wording with a table of what conclusions depend on, and the regional-value block shows where each link can fail. Approved text carries the label "Author-approved wording (Phase 10)", stated as editorial approval, not independent verification; Phase 9 wording remains available on each page. The bundled package file is unchanged; the classification change is applied when it is loaded. Tier 3 statement corrections and Tier 4 findings remain pending. `PHASE9_EDITORIAL.status` is unchanged.

## 10D — Video and source verification

Public clip pages already separate programme mapping, minutes-based relation, key message checked against the minutes, key message checked against the clip (not checked for any clip) and withheld mappings; no public change was needed. Unresolved mappings were re-examined read-only; none is changed on the site. Findings and candidate resolutions are in the private review package for the author's confirmation.

## 10E — Research pilot feasibility (`f7c3e78`)

`src/science/phase10/roadmap.mjs` types each of the 15 relations (Phase 9 data unchanged): **0** prerequisites for starting, **7** for interpretation, **2** for publication, **6** helpful but optional. All twelve workflows can start now; what can block a start is external (data access, model outputs, a user-defined hazard target). The graph now orders workflows by when results become interpretable. Pilot A separates descriptive evaluation, process diagnosis and causal testing, warns that AI–dynamical differences are not evidence for the causal role of convection parameterization, and lists comparison controls. Pilot B requires a definition and implementation check before quantitative comparison, separates real-time from retrospective diagnostics and is independent of other pilots. Pilot C separates five steps and names minimum datasets so that analyses need not wait for a complete inventory. Each pilot lists startable work, interpretation and publication prerequisites, a minimum viable output, uncertainties and continue/revise/stop criteria.

## 10F — Coverage and release readiness (`957c53a`)

The synthesis coverage section lists the known limits of the record (Themes 5+6 breakout, short compiled minutes, unresolved session mappings, boreal-summer variability and northward propagation, ocean coupling, ASR-derived minutes) under the principle that incomplete coverage is not absence of discussion.

### Validation (local only)

| Check | Result |
| --- | --- |
| `npm run typecheck` | 0 errors, 0 warnings, 0 hints |
| `npm test` | 117 pass (science 59, security 12, Phase 8 15, Phase 9 10, Phase 10 21) |
| `science:check`, `science:check-phase9` | up to date (Phase 9 export v1 unchanged) |
| `release:check` on the built Worker (local Workers runtime) | PASS: verify-phase8 77 pages, verify-phase9 57, verify-phase10 56 |
| Headless Chrome, 390 and 1280 px | no horizontal overflow on 10 key pages; mobile menu and header navigation as intended |
| Published site (read-only GET) | all `/_astro/` assets referenced by 13 pages are in the `62daf4b` build; main text of 9 pages unchanged by Phase 10 is identical to the local source; private paths 404; `noindex` kept |

Before the authorized deployment (below), no remote write or authenticated Cloudflare query was made; the deployed commit was identified from the owner's deployment notes and the asset and content comparison above.

### State of the branches (before the deployment below)

| Ref | Commit | Content |
| --- | --- | --- |
| Production | `62daf4b` (by notes and comparison) | Phase 9 |
| `origin/main` (GitHub) | `0d13cdb` | Regressed tree |
| Local `main` (not pushed) | Phase 10 commits on top of `0d13cdb` | Phase 9 restored + Phase 10 |

### Authorized deployment (2026-11-05)

The owner authorized pushing local `main` and deploying. `main` was pushed to GitHub (fast-forward, no history rewrite; tags not pushed), and commit `628a380` was deployed at 11:46 JST with `npm run deploy` after `npm run release:check` passed on the clean commit and `npm run deploy -- --dry-run` showed the expected bindings and 73 public files. A D1 Time Travel bookmark and the previous Worker version were recorded offline before deploying; no D1 schema change or migration was involved. Read-only checks afterwards: all 77 public routes return 200 with `noindex, nofollow` and `lang="en"`, and their main content is identical to the verified local source; private paths and unknown routes return 404; the admin redirects to its login. Production, GitHub `main` and local `main` are now the same commit.

## Deployment-readiness checklist (owner)

1. Decide on the Tier 1–2 proposals (none is applied to pages until decided).
2. Confirm the candidate source-mapping resolutions, or keep them withheld.
3. Authorize pushing local `main` to GitHub (it restores Phase 9 there) and confirm the intended repository visibility.
4. `npm run release:check` on the final clean commit.
5. Record a D1 Time Travel bookmark offline; `npm run deploy -- --dry-run`; then, only with explicit authorization, `npm run deploy`.
6. Read-only check of the live origin (status codes, `noindex, nofollow`, private paths 404, Phase 10 sections).

## Rollback

- Code on the Worker: `npx wrangler rollback <previous-version-id> --config wrangler.site.jsonc` (version IDs are kept in the owner's offline deployment notes). No D1 schema change is involved in Phase 10.
- Repository: every Phase 10 change is a separate commit; `git revert <commit>` undoes one without rewriting history. The tags above mark the recovery points.
