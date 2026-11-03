# Phase 7 — Scientific review checklist

Prepared 3 November 2026 for the Phase 5/6 editorial packages (`exports/phase5-20261102-v1/`, `exports/phase6-20261103-v1/`; both gitignored and HTTP-denied). Status column: **Mechanical** = checked by script; **Human** = requires the scientific reviewer; **Open** = known gap.

The mechanical scan ran over `themes.en.json` (2 themes, 10 sections, 36 items, 6 issues, 22 sources, 49 evidence passages, 4 external references). Its output is reproducible with the commands at the end.

## 1. Source traceability

| Check | Status | Finding |
| --- | --- | --- |
| Every item carries at least one reference | Mechanical ✔ | Enforced by `verify-phase6.mjs` |
| Every evidence ID resolves to a source with matching SHA-256 | Mechanical ✔ | 49/49; sources are unchanged private minutes |
| No filesystem paths, `researcher_os` or `"path"` keys in the web derivative | Mechanical ✔ | Private paths live only in `provenance.private.json` |
| Source versions, coverage and review status are displayed | Mechanical ✔ | All 22 sources: coverage `partial`, review status `not_established` |
| Hashes re-verified against originals in the research environment | Human/Open | Last done by the Phase 6 author on 3 Nov; the final hash check was interrupted (usage limit). Repeat in the private environment before any import |

## 2. Session attribution

| Check | Status | Finding |
| --- | --- | --- |
| Named speakers appear only for programme-listed individual talks | Mechanical ✔ | 14 named records; all names tie to `talk-*` sources |
| Discussion/plenary/breakout content carries no individual names | Mechanical ✔ | Two records mix a talk and a discussion source (q09 Takasuka, q11 Tsai); the discussion clause is anonymous ("the final discussion left…", "the CENS Q&A record left…") |
| Reviewer confirms the two mixed records read as talk attribution only | Human | Suggested wording check |
| `src-xu` content differs from the official talk title | Open | Already labelled in the text; confirm that the passage is from the talk and not misfiled |
| Highlight `RPXnSvabsGY` mapped to 27 Oct breakout (not 28 Oct plenary) | Mechanical ✔ / Human | Title/description/timetable mapping verified 2 Nov; representative version and permission still pending |

## 3. Evidence vs interpretation

| Check | Status | Finding |
| --- | --- | --- |
| Origin labels present on every item | Mechanical ✔ | Workshop record 6 · Editorial synthesis 20 · External definition 4 · New research proposal 6 |
| Issue records labelled `workshop_statement_as_paraphrased_in_minutes` vs editorial | Mechanical ✔ | |
| Evidence verification state visible | Mechanical ✔ | 49/49 `pending_human_review` |
| Editorial syntheses do not introduce facts absent from cited passages | Human | Spot-check at least the 20 synthesis items against line locators |
| Proportion of synthesis (20/36) is acceptable for a workshop portal | Human | Consider whether more items should be reclassified or trimmed |

## 4. Disagreement

| Check | Status | Finding |
| --- | --- | --- |
| Diverging-perspective issues cite both positions | Human | 1 of 6 Phase 6 issues (3 of 12 in Phase 5) |
| No position is attributed to a named individual in a discussion | Mechanical ✔ | |
| "Disagreement" is not inferred from silence or a single remark | Human | Phase 5 rule; verify in `SCIENTIFIC_REVIEW.ja.md` |

## 5. Emerging agreement

| Check | Status | Finding |
| --- | --- | --- |
| `formal_consensus` = `not_established` | Mechanical ✔ | |
| Strong-claim scan (consensus / proves / superior / settled …) | Mechanical ✔ | 2 hits, both explicit disclaimers ("without formal consensus", "not a formal consensus or independent vote count") |
| Repeated reporting (breakout → plenary → closing) not double-counted as independent support | Human | Stated in the Japanese synthesis; confirm per item |

## 6. Proposed research actions

| Check | Status | Finding |
| --- | --- | --- |
| Proposals labelled `New research proposal` and separated from workshop statements | Mechanical ✔ | 6 (A1–A3, B1–B3) |
| Actions are illustrative, not commitments/owners/deadlines | Mechanical ✔ | Import validator rejects commitment language (tests pass) |
| Each proposal is testable and states a negative-result reporting path | Human | B3 explicitly; check A1–A3, B1–B2 |
| Workshop-derived constraints vs editor-added constraints distinguished | Human | Mass/moisture (minutes) vs energy budget/tolerances (editorial) per the synthesis |

## 7. Terminology (AI and MJO indices)

| Check | Status | Finding |
| --- | --- | --- |
| RMM, OMI, ROMI defined separately with provider/version/phase convention | Mechanical ✔ / Human | External definitions cite Wheeler & Hendon 2004, Kiladis et al. 2014, NOAA PSL (checked 3 Nov) |
| No equivalence implied between similarly named indices | Human | Text says so; confirm wording in each comparison item |
| "Predictability" vs "skill" used consistently | Human | 10 uses of skill, 3 of predictability; confirm member-as-truth vs observation-verified distinction in q08 |
| "Explainability" vs "interpretability" | Human | 2 vs 1 use; decide whether to standardise |
| Hyphenation consistent (physics-informed, end-to-end, real-time) | Mechanical ✔ | No inconsistent spellings found |
| NeuralGCM cited only as architecture example | Mechanical ✔ | Reference scope recorded |

## 8. Publication gate (does not replace the above)

- `scientific_review`, `publication_approval`, `language_review` are all `pending` in the package; `loadThemeReview()` refuses any package where review is not `pending`-labelled (fail-closed for drafts) and normal builds never load it.
- The CMS publish/schedule blocker (`mjo-scientific-publication-policy`) remains active for all scientific collections.
- Sign-off should be recorded in the private research environment and exported as a reviewed v1.0.0 package, not by editing `themes.en.json` flags.

## Reproduce the mechanical scan

```sh
node scripts/verify-phase6.mjs dev          # requires the dev server
npm run test:science && npm run science:check
```

The name/origin/strong-claim scan used during Phase 7 is a short Python script over `exports/phase6-20261103-v1/themes.en.json`; its output is saved in `.verification/phase7-20261103-v1/` and in this file's tables.
