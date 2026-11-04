# Phase 9 — Scientific validation, representativeness and actionable strategy

Started 2026-11-04. Scientific changes are logged in [`PHASE9_EDITORIAL_LOG.md`](PHASE9_EDITORIAL_LOG.md). Phase 9 does **not** deploy, change YouTube visibility, modify Cloudflare resources or private source documents, or alter `src/data/personal-synthesis.json`.

## Data model

Phase 9 is a layer over the v1.0.0 package, in `src/science/phase9/`:

| File | Content |
| --- | --- |
| `status.mjs` | Review vocabulary: source fidelity, interpretation level, publication state, review categories, check method, `PHASE9_EDITORIAL.status` |
| `provenance.mjs` | 18 public locators, 2 new sources (`src-welcome`, `src-moncrieff`), source-quality classes |
| `claims.mjs` | 18 workshop-record statements (`p9-<question>-rNN`) and source→clip rules for the new sources |
| `claim-review.mjs` | Review defaults, `REVIEW_OVERRIDES` (statements needing action, with proposed wording), `PUBLICATION_RISKS`, `reviewOf()` |
| `context.mjs` | `relationContext()` — the single relation context used by pages, tests and scripts |
| `synthesis.mjs` | Guiding question, executive synthesis, eight insights with Phase 8 lineage, regional-value levels, insight assessments |
| `coverage.mjs` | Six-theme coverage matrix and cross-cutting gaps |
| `classification.mjs` | Q07 relationship revision and three layers, Q03 analysis, forms of agreement, disagreement matrix, complementary list |
| `roadmap.mjs` | Dependencies, external prerequisites, parallel starts, three pilots, qualitative assessments |
| `videos.mjs` | Phase 9 key messages, audit vocabulary, re-examination of withheld mappings |

`src/science/phase8/relations.mjs` accepts `supplementalClaims`; Phase 9 records take part in every evidence-derived relation (video ↔ question ↔ action). `src/science/phase8.ts` binds the layers: Phase 9 relationship revisions and key messages take precedence over Phase 8, and Phase 8 values remain available for side-by-side review.

Versioned export: `npm run science:export-phase9` writes `docs/versions/phase9-editorial-layer.v1.json` (public fields only); `npm run science:check-phase9` fails if it is stale.

## Validation workflow

1. Confirm minute files and excerpts still match the hashes recorded in the private Phase 5/6 exports (done offline; hashes never enter the repository).
2. Compare each statement with its cited passage; record overrides in `claim-review.mjs`.
3. Keep detailed workbooks (statement + cited passage) only in the gitignored `exports/phase9-*/` directory.
4. The author reviews the Japanese review package (gitignored `docs/*.ja.md`), edits wording, and sets `PHASE9_EDITORIAL.status` and, if wanted, per-statement `author_approved` states. Tests reject automatic approval.

## Pilot structure and dependency graph

Pilots link Research Area → Pilot → Scientific Question → Evidence → Workflow (`/actions#pilots`, `/actions/pilots/<slug>`). The dependency graph on `/actions#dependencies` is computed from `DEPENDENCIES` (layer = longest chain of prerequisites) and rendered as inline SVG with a full text list for small screens and assistive technology.

## Routes

New: `/actions/pilots/maritime-continent-barrier`, `/actions/pilots/index-disagreement-catalogue`, `/actions/pilots/observational-requirements`. All existing routes are preserved; `#insight-1` … `#insight-7` anchors still resolve.

## Validation (2026-11-04, local only)

| Check | Result |
| --- | --- |
| `npm run typecheck` | 0 errors, 0 warnings, 0 hints |
| `npm run test:science` / `test:security` / `test:phase8` | 59 / 12 / 15 pass |
| `npm run test:phase9` (new) | 10 pass |
| `npm run science:check`, `science:check-phase9` | up to date |
| `verify-phase8.mjs` on the dev server | PASS — 77 pages, all internal links and anchors, 54 bidirectional video↔question links |
| `verify-phase9.mjs` (new) | PASS — synthesis, matrix, Q03/Q07, forms of agreement, roadmap, pilots, 38 clip audits |
| `verify-local`, `verify-phase4-http`, `verify-phase6 dev` | PASS (origin via `VERIFY_ORIGIN`) |
| `npm run build` | Complete (pre-existing >500 kB chunk warning); no private names in client output |
| Layout (Chrome, device emulation) | 9 key pages at 390 px and 1280 px: no horizontal page overflow; wide tables and the graph scroll in their own containers |

Not run: any remote or production check. Nothing was deployed.

## Remaining data and source gaps

- Claim-level review by the author (all statements); speaker review of minutes does not exist.
- Themes 5+6 breakout not converted into minutes; several Thursday/Friday talks have short compiled minutes without Q&A.
- `src-xu` (candidate resolution), `src-final` / `src-closing` (session boundary), `src-obs` / `src-g34` (dates) need the author's confirmation.
- Key messages were never checked against the clips.
- The isotope discussion clip has no mapped minutes; boreal-summer ISO and ocean coupling are thinly represented.

## Deployment procedure (requires explicit owner authorization)

As in Phase 8: review and approve Phase 9 wording; `npm run build` (from `wrangler.site.jsonc`); record a D1 Time Travel bookmark offline; `npm run deploy -- --dry-run`; `npm run deploy`; read-only check of the live origin (status codes, `noindex, nofollow`, private paths 403/404). Code rollback: `npx wrangler rollback`. No D1 schema change is involved.

## EmDash migration recommendation

Not performed. Phase 9 content is highly relational (claims ↔ locators ↔ sources ↔ clips ↔ questions ↔ workflows ↔ pilots) and its integrity is enforced by tests at build time. Moving it into EmDash collections now would lose those checks and the ability to diff editorial changes in Git. Recommended later, after the author approves the wording: (1) keep claims, locators and review states in versioned JSON as the source of truth; (2) if CMS editing is needed, add read-only EmDash collections for pilots and insights generated from the JSON export, with an import gate that re-runs `test:phase9` and the reviewed-content contract; (3) extend the import contract with relationship subcategory, review-state and source-quality fields.
