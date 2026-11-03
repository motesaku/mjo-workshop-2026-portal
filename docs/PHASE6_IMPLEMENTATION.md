# Phase 6 — Dedicated scientific themes

Implemented and checked on 3 November 2026 (Asia/Tokyo).

## Delivery

- Independent `/ai-for-mjo-research` and `/mjo-indices-and-diagnostics` sections, directly accessible from primary navigation.
- Six related scientific issue pages at `/questions/themes/q02`, `q06`, `q07`, `q08`, `q09` and `q11`, retaining Phase 5 draft provenance. The sections remain separate.
- English content distinguishes workshop records, external definitions, editorial synthesis and new research proposals. Both themes include methodological comparisons, emerging alignment, unresolved questions and three testable proposals.
- Private Japanese synthesis: `exports/phase6-20261103-v1/SCIENTIFIC_SYNTHESIS.ja.md`.
- Edited English derivative: `exports/phase6-20261103-v1/themes.en.json`; 49 passage references from 22 source minutes across the themes and linked issue pages. Source hashes were rechecked against the unchanged private originals during authoring.
- Private source paths remain only in the private provenance companion. The web renderer exposes source IDs, versions, coverage, line locators and review status, without original documents or transcript text.

## Publication boundary

Scientific sign-off, language review and formal workshop publication approval remain pending. Owner policy (2026-11-03) treats the site as a **personal public report**. English paraphrases from converted minutes are therefore bundled as `src/data/personal-synthesis.json` (12 issues, 2 themes, 12 illustrative actions, 32 sources, 82 evidence locators) and rendered in both development and production via `loadThemeReview()`. Labels retain personal-synthesis / non-consensus framing. Raw Phase 5/6 exports, Japanese drafts and private provenance stay gitignored under `exports/` and are never a runtime input. Rebuild the bundle with `npm run science:build-synthesis` when those private drafts change. The loader never reads `researcher_os`. Existing CMS publication controls remain in place.

Three pre-existing files were backed up after explicit approval to `backups/phase6-20261103-v1/src/`: the two theme routes and `layouts/Base.astro`. These were untracked at the initial inspection; retain their backups. No packages were installed, and this task performed no commit, push, CMS publication or deployment.

## Science and video limits

RMM was checked against Wheeler & Hendon (2004); OMI/ROMI against Kiladis et al. (2014) and current NOAA PSL documentation. The site preserves distinct definitions and highlights provider/version/phase-convention differences. Kochkov et al. (2024) is used only as an external hybrid-model architecture example. Full citations are rendered beside the relevant content.

`RPXnSvabsGY` retains the 2 November verified mapping to the 27 October Themes 3 + 4 breakout. It is linked as explainability/process-research context, not an index-definitions highlight or independent scientific evidence. Its publication permission and representative-version approval remain pending. No index-specific highlight mapping was verified in this phase; the gap is visible on the index page. No inference of formal consensus, universal AI superiority or universal predictability horizon was made.

## Verification

- `npm run typecheck`: 0 errors, 0 warnings, 0 hints.
- `npm run test:science`: 59/59 passed.
- `npm run science:check`: generated schema matches the contract.
- `npm run build`: passed using Node 24.22.2 and the existing loopback helper; existing large-chunk warning only.
- `node scripts/verify-phase6.mjs dev`: both themes, six issue pages, unknown-issue 404, direct navigation, source-reference closure, English rendering, anchor targets, private-file protection and admin reachability passed.
- `node scripts/verify-phase6.mjs production` (rechecked 2026-11-03 after personal-synthesis wiring): themes and issues visible from the committed package; private export paths excluded from `dist`; private-file HTTP denial and admin reachability passed.
- `node scripts/verify-phase4-http.mjs`: all 14 existing routes and detail-miss checks passed.
- `npm run verify:local`: homepage, posts, admin and private-file checks passed.
- Real browser inspection: desktop AI page, narrow-screen index definitions, direct primary links, related q06 issue, keyboard navigation and both themes at actual 320 CSS px without horizontal overflow. Temporary viewport override reset.

Initial sandbox HTTP/build attempts returned EPERM; restricted operations were rerun with approval while binding only to loopback. One test assertion was narrowed to rendered main content because Vite adds local CSS paths in development head metadata; private source paths remain forbidden. Logs, backup fingerprints and the screenshot are under `.verification/phase6-20261103-v1/`.

These mechanical checks do not establish scientific correctness. Human scientific review and additional video mapping remain open.
