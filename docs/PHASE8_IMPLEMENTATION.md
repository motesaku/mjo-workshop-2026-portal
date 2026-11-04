# Phase 8 — Scientific synthesis, cross-linking and research roadmap

Started 2026-11-04. This file records the audit, architecture, and validation of Phase 8. Scientific content changes are logged separately in [`PHASE8_EDITORIAL_LOG.md`](PHASE8_EDITORIAL_LOG.md).

Phase 8 does **not** deploy, change YouTube visibility, modify Cloudflare resources, import new minutes, or alter `src/data/personal-synthesis.json`. All new editorial text is marked as a Phase 8 draft awaiting the author's review.

## 8A — Audit (2026-11-04)

### Counts verified against the repository

| Item | Count | Where |
| --- | --- | --- |
| Workshop days | 5 | `src/data/program.ts` |
| Official program themes | 6 (keynote pairs 1+2, 3+4, 5+6) | `src/data/program.ts` |
| One-minute YouTube highlights | 38 (33 mapped, 2 provisional, 2 alternate, 1 unmapped) | `src/data/highlights.ts` |
| Cross-session scientific questions | 12 (Q01–Q12) | `personal-synthesis.json` → `issues` |
| Diverging perspectives / emerging alignment / open questions | 3 / 3 / 6 | Q01, Q03, Q07 / Q06, Q08, Q11 / Q02, Q04, Q05, Q09, Q10, Q12 |
| Illustrative research actions | 12 (one per question) | `personal-synthesis.json` → `actions` |
| Dedicated scientific themes | 2 (AI; indices) | `personal-synthesis.json` → `themes` |
| Workshop source records / evidence locators / external references | 32 / 82 / 4 | `personal-synthesis.json` |

Provisional: closing discussion; observations/AI/international-collaboration discussion. Alternate: Hyemi Kim alternate cut; group reports on theory and modelling. Unmapped: isotope discussion.

### Hard-coded cross-links found

| Location | Behaviour |
| --- | --- |
| `src/pages/actions/[issue].astro` | Every one of the 12 action pages linked to `/videos/breakout-themes-3-4` regardless of topic. |
| `src/components/Journey.astro` | Fixed path: Themes 3+4 breakout → Q01 → action Q01, shown on unrelated action pages. |
| `src/components/VideoHighlightPage.astro` | Only the breakout clip showed related questions/actions (hard-coded to Q01); 37 clips had none. |
| `src/components/ScientificTheme.astro` | Both theme pages linked the breakout clip; the indices page explicitly noted the clip was not index-related. |

### Editorial and integrity gaps found

1. **Dangling evidence identifiers.** Six identifiers cited in issue comparison/limitation/proposal fields are absent from the public `evidence` list (`e-g3-284-341`, `e-lin-43-49`, `e-closing-268-284`, `e-final-144-147`, `e-robertson-23-28`, `e-brennek-45-51`). Cause: `scripts/build-personal-synthesis.mjs` only collected evidence from `records` and `positions`. A rebuild to a scratch location confirmed the six entries exist in the local (gitignored) provenance export, but a full rebuild would also revert later manual wording edits to 28 source descriptions, so the committed package is **not** regenerated. Phase 8 supplies the six locators (public fields only) plus the missing `src-brennek` source record in `src/science/phase8/provenance-supplement.mjs`, and the build script now collects evidence from every issue field for future rebuilds.
2. **No video summaries are reviewed.** All 38 clips are one-minute derivatives; no clip has been checked against the minutes. Video pages must not present scientific content as derived from the clip.
3. **Ambiguous source-to-session mappings.** `src-final` (11:00 vs 14:00 Friday unresolved), `src-closing` (extent unresolved; closing clip mapping provisional), `src-obs` (date and group numbering provisional), and `src-g34` (inferred date; overlaps the 28 October plenary) cannot be tied to one clip. `src-xu` describes short-record wave detection, which differs from the programme title of the Chang Xu talk; its mapping is disputed.
4. **Q03 numbers.** Temperature-contribution percentages remain withheld (unresolved denominator in the minutes).
5. **Q07 classification.** The final-day record explicitly contrasts two positions, but the existing comparison already states they "differ partly in purpose". A subcategory is needed to avoid presenting compatible objectives as substantive disagreement.
6. **Outdated deployment text.** The top bar still read "Local build until public hosting is switched on"; About still described local-only hosting. The site runs on Cloudflare Workers with `noindex, nofollow` retained.
7. **Repetitive disclaimers.** Long authorship notices were repeated on the homepage (twice), every science page, the footer and About.
8. **Identifier-first provenance.** Issue pages showed claim IDs and evidence IDs as the primary reader-facing labels.

## Architecture

### Principle: relations are derived from cited evidence, not from titles

A clip is related to a scientific question only when the question's personal synthesis cites minutes of the **same talk or session** that the clip is mapped to:

```
issue claim ── evidence_id ──► source_id ──► SOURCE_VIDEO_RULES ──► highlight slug(s)
```

- `src/science/phase8/source-video-map.mjs` lists, for each of the 33 source records, either the highlight slugs of the same named talk / session, or a `withheld` reason. Talk sources map only to the clip(s) of that programme talk; session sources map only to clips mapped to that session. Withheld: `src-xu`, `src-final`, `src-closing`, `src-obs`, `src-g34`.
- A relation records **which claims** cite the source and whether they are workshop-record paraphrases or editorial synthesis. The clip itself is never treated as evidence for the claim.
- Action ↔ video relations use the evidence cited in the action's own proposal fields.
- Question ↔ action: each action keeps its primary question; a small number of editorial cross-links ("also informs") carry a written rationale and the claim they rest on.

### Modules

| File | Role |
| --- | --- |
| `src/science/phase8/relations.mjs` | Pure functions: `createRelationIndex()` → videos ↔ issues ↔ actions, claim index, source grouping. Testable with `node --test`. |
| `src/science/phase8/source-video-map.mjs` | Source → clip mapping rules with withheld reasons. |
| `src/science/phase8/provenance-supplement.mjs` | Six missing evidence locators + `src-brennek` (public fields only). |
| `src/science/phase8/editorial.mjs` | Phase 8 editorial layer: relationship subcategories, Q01/Q03/Q07 analyses, alignment analyses, question significance, clip key messages, priority areas, action chains, synthesis page. Every item lists the claim IDs it rests on. |
| `src/science/phase8.ts` | Binds the bundled package and highlight list; typed helpers for Astro pages. |

### Labels shown to readers

- **Interpretation type**: Workshop record · Editorial synthesis · External scientific reference · New research proposal.
- **Review status**: Programme metadata verified · External definition checked · Personal synthesis (source check pending) · Phase 8 draft (awaiting author review). No formal workshop decision is documented, so that label is never used.
- Identifiers (claim IDs, evidence IDs, line ranges) move into expandable sections.

## Phase checklist

- [x] 8A audit and architecture (this file)
- [x] 8B relations and video pages
- [x] 8C classification layer
- [x] 8D four-area roadmap
- [x] 8E workshop synthesis page and homepage
- [x] 8F validation

## 8F — Validation (2026-11-04)

| Check | Result |
| --- | --- |
| `npm run typecheck` | 0 errors, 0 warnings, 0 hints (65 files) |
| `npm run test:science` | 59 pass, 0 fail |
| `npm run test:security` | 12 pass, 0 fail |
| `npm run test:phase8` (new) | 15 pass, 0 fail — counts, supplement, source→clip rules vs programme, withheld sources, bidirectional links, key-message provenance, classification, roadmap, synthesis |
| `npm run science:check` | Generated artifacts match the contract |
| `npm run verify:local` (dev) | PASS |
| `node scripts/verify-phase4-http.mjs` (dev) | PASS (breakout status regex updated for Phase 8 wording) |
| `node scripts/verify-phase6.mjs dev` | PASS (hard-coded breakout link check replaced by an evidence-derived highlight check) |
| `npm run verify:phase8` (dev, new) | PASS — 74 pages (38 highlights, 12 questions, 12 actions), all internal links and in-page anchors resolve, 47 bidirectional video↔question links, action asides match evidence-derived clips, private files 403/404 |
| `npm run build` | Complete (pre-existing >500 kB chunk warning) |
| Build output scan | 1,288 files, no private export names, path fields or fingerprints |
| `npm run cf:dev` + `verify:phase8 http://127.0.0.1:8787` | PASS on the built Worker (local emulation only) |
| Browser (Chrome) | Desktop and narrow layouts inspected; 14 key pages checked at 390 px / 16 px root font with no horizontal overflow; mobile menu works |

Not run: any remote or production check. Nothing was deployed.

## Files

New: `src/science/phase8.ts`, `src/science/phase8/{relations,source-video-map,provenance-supplement,status,editorial-videos,editorial-classification,editorial-roadmap,editorial-synthesis}.mjs`, `src/components/{ContextNote,ClaimEntry,RelatedVideos,RelationshipBadge,DivergenceAnalysis,AlignmentAnalysis}.astro`, `src/pages/workshop-synthesis.astro`, `tests/phase8-relations.test.mjs`, `scripts/verify-phase8.mjs`, `docs/PHASE8_EDITORIAL_LOG.md`.

Modified: `src/components/{VideoHighlightPage,Journey,ScientificTheme,ThemeReferences,EditorialPage,HighlightCard,ScienceNavigation}.astro`, `src/pages/{index,questions,about}.astro`, `src/pages/questions/themes/[issue].astro`, `src/pages/actions/{index,[issue]}.astro`, `src/pages/videos/index.astro`, `src/layouts/Base.astro`, `src/data/portal.ts`, `src/styles/portal.css`, `scripts/build-personal-synthesis.mjs`, `scripts/verify-phase4-http.mjs`, `scripts/verify-phase6.mjs`, `package.json`.

Unchanged by design: `src/data/personal-synthesis.json`, `src/data/highlights.ts`, `src/data/program.ts`, the import contract and generated schema, `wrangler.jsonc`, `noindex, nofollow`.

## Remaining scientific review items

1. **Author review of all Phase 8 wording** (`docs/PHASE8_EDITORIAL_LOG.md`), then set `PHASE8_EDITORIAL.status` to `"author_reviewed"` in `src/science/phase8/status.mjs`. Until then every Phase 8 statement is labelled as a draft.
2. Claim-level source checks remain pending for all 82 + 6 locators (unchanged from Phase 7).
3. `src-xu`: confirm whether the minutes filed under the Chang Xu talk belong to that talk.
4. `src-final` / `src-closing`: resolve the Friday 11:00 vs 14:00 boundary and the closing record's extent; this would allow links to the Themes 5+6 plenary, final plenary and closing clips.
5. `src-obs` / `src-g34`: confirm dates and overlap with the 28 October plenaries.
6. Q03 temperature-contribution percentages remain withheld (unresolved denominator).
7. Key messages were condensed from minutes, not from the clips. A viewing check of each clip against its key message is still needed before describing any clip's content.
8. Nine clips have no question link (welcome, Moncrieff keynote, Chang Xu talk, Themes 5+6 plenary, final plenary, closing, group reports, observations/AI discussion, isotope discussion). The Brennek talk is linked to Q11 only through an editorial comparison and has no key message.
9. Future import contract: consider adding the relationship subcategory, source→session mapping and Phase 8 provenance fields to the reviewed-content schema (not changed here to keep `science:check` stable).
10. `scripts/build-personal-synthesis.mjs` now collects evidence from every issue field, but a full rebuild would also revert later manual edits to 28 source descriptions; reconcile the exports before rebuilding.

## Local preview

```sh
npm run dev            # http://127.0.0.1:4321/  (loopback only)
npm run test:phase8
npm run verify:phase8  # with the dev server running
npm run build && npm run cf:dev   # built Worker on http://127.0.0.1:8787 (local emulation)
```

## Deployment (requires explicit owner authorization)

Not performed. When authorized: complete item 1 above, run the full check list, `npm run build` (uses the gitignored `wrangler.site.jsonc`), then `npm run deploy` following `docs/PHASE7_DEPLOYMENT_GUIDE.md`. Keep `noindex, nofollow` unless indexing is separately decided. Pushing the commits to GitHub is also a separate authorization.
