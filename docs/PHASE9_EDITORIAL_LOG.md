# Phase 9 editorial log

Phase 9 (2026-11-04) is a scientific editorial review of the portal: validity, representativeness and actionability. Every scientific change made in Phase 9 is listed here with the evidence it rests on. All Phase 9 wording is a **draft awaiting the author's review** (`PHASE9_EDITORIAL.status` in `src/science/phase9/status.mjs`). Nothing here is independent scientific verification or workshop consensus. The bundled package `src/data/personal-synthesis.json` (v1.0.0) is unchanged; Phase 9 adds a layer on top of it.

Rules applied to every entry:

1. Compare each statement with the passage of the converted minutes it cites (line-level locators).
2. Do not add findings, quotations, positions or consensus absent from the minutes.
3. Keep observation, interpretation, hypothesis and proposal distinct; keep forecast skill distinct from physical understanding.
4. Count overlapping records (breakout, plenary, extended, final-day, closing) once.
5. Attribute named speakers only for programme talks; never for discussion sessions.
6. Withhold numbers that the minutes flag as uncertain.

## 9A — Claim validation

### Method

All 88 cited locators were confirmed against the current minute files: every source file and every excerpt matches the hash recorded in the Phase 5/6 exports, so line references are intact. Each of the 189 package statements, 36 theme-page statements, 124 Phase 8 editorial statements and 18 new Phase 9 records was compared with its cited passage (`CHECK_METHOD` in `status.mjs`). This is an AI-assisted consistency check of English paraphrases against ASR-derived Japanese and English minutes; it is not the author's sign-off and says nothing about whether a hypothesis is correct.

### Review states

Three separate dimensions replace the single "source check pending" tag (`status.mjs`): source fidelity (consistent / partly consistent / pending / mapping disputed), interpretation (direct record / supported interpretation / speculative interpretation / research proposal) and publication (revision proposed / awaiting author review / author-approved). No statement is author-approved.

### Results (package and Phase 9 statements: 207)

| Category | Count | Statements |
| --- | --- | --- |
| Sufficiently supported | 197 | all others |
| Requires qualification | 5 | q02-c02, q03-c01, q07-c02, q09-c03, q11-c03 |
| Requires source correction | 5 | q10-c10 (premise is in the Themes 3+4 plenary, not the cited passages); q06-c04, q06-c09, q06-c10, q06-c16 (depend on the disputed Chang Xu mapping) |
| Meaning uncertain / withhold | 0 | — |

Theme pages: 36 statements checked; `theme-indices-diagnostic-comparison-1` needs an added citation (the circulation-dominance premise is in the prediction keynote minutes).

Phase 8 editorial statements: 13 need action — seven clip key messages (Themes 3+4 plenary, Daehyun Kim, Stephanie Rushley, Daisuke Takasuka, Themes 3+4 breakout, the site author's own talk, Kenedy Silverio), insights 1–3, the Q07 relationship, the AI contested topic and the executive synthesis. Proposed wording for each is in `claim-review.mjs` (`REVIEW_OVERRIDES[…].proposed`) and, for key messages, applied as Phase 9 drafts in `videos.mjs`.

### Publication risks on the live site (reported, not changed in production)

Listed in `PUBLICATION_RISKS`: "Editorial synthesis of reviewed minutes" (home) and "recur in the reviewed records" (synthesis) overstate the review status of the minutes; the Q07 verdict "Mostly complementary, with a residual disagreement" understates a disagreement recorded explicitly by two discussion groups; the Themes 3+4 plenary key message includes content from minutes whose clip mapping is withheld; three key messages shift or over-specify the minutes (Daehyun Kim, Stephanie Rushley, breakout); "Video evidence" labels imply clip-level verification; the CENS clip does not disclose that it is the site author's own record. All are fixed in the local build.

## 9A — New records (`claims.mjs`, `provenance.mjs`)

Eighteen Phase 9 records paraphrase sections of the minutes that the package did not cite. Two sources were added: the opening session (`src-welcome`, unattributed) and the Themes 1+2 keynote (`src-moncrieff`). Eighteen new public locators.

| Record | Question | Locator | Why added |
| --- | --- | --- | --- |
| p9-q02-r01 | Q02 | e-closing-138-146 | Theory gaps; boreal-summer ISO |
| p9-q02-r02 | Q02 | e-khouider-19-25 | Multiscale caution in the theory keynote |
| p9-q03-r01 | Q03 | e-khouider-19-25 | Multicloud / low-level convergence |
| p9-q03-r02 | Q03 | e-dkim-19-26 | Shallow-convective moistening in models |
| p9-q05-r01 | Q05 | e-moncrieff-20-25 | Themes 1+2 keynote (absent before) |
| p9-q07-r01 | Q07 | e-final-88-98 | Different uses of AI |
| p9-q07-r02 | Q07 | e-closing-23-34, e-closing-189-200 | Skill vs understanding as central question |
| p9-q07-r03 | Q07 | e-final-275-289 | The minutes' own disagreement/convergence labels |
| p9-q07-r04 | Q07 | e-closing-220-226 | Evidence from AI must be tested |
| p9-q09-r01 | Q09 | e-moncrieff-27-33 | Organized-convection evaluation targets |
| p9-q09-r02 | Q09 | e-welcome-40-43 | Resolution alone is not the solution |
| p9-q10-r01 | Q10 | e-p34-23-23 | Correct source for q10-c10 |
| p9-q11-r01 | Q11 | e-robertson-17-22 | Index skill ≠ regional skill |
| p9-q11-r02 | Q11 | e-welcome-33-36 | Weak reforecast teleconnection responses |
| p9-q11-r03 | Q11 | e-rushley-13-13 | Framing of the North Pacific talk |
| p9-q11-r04 | Q11 | e-final-45-68, e-final-80-86, e-final-116-118 | Skill ≠ societal value |
| p9-q11-r05 | Q11 | e-closing-230-236, e-closing-250-256 | Probabilistic, state-dependent verification |
| p9-q11-r06 | Q11 | e-final-236-260 | Multiscale diagnostics proposal |

Numbers flagged as ASR-uncertain (for example the reforecast teleconnection amplitude ratio) are not reproduced. The Themes 5+6 breakout notes found in the private workspace are the author's own preparation notes, not minutes, and were not used.

## 9B — Representativeness (`coverage.mjs`, `synthesis.mjs`)

### Theme coverage

Theme 6 (Applications & Remote Regional Impacts) had no headline insight, and the Themes 1+2 keynote was absent. Theme 3 was over-weighted (three of seven insights). Source coverage is thin for Themes 5–6 (short compiled minutes without Q&A for several talks; Themes 5+6 breakout not converted), which is a recording gap, not evidence of absence.

### Reassessment of the seven Phase 8 insights

| Phase 8 | Decision | Reason |
| --- | --- | --- |
| 1 Different theories may explain different aspects | Merged with 2 | Same question and records; title foregrounded one of three recorded views |
| 2 Reproducing structure is not evidence for a mechanism | Merged into new 1 | — |
| 3 Lifecycle definitions | Revised | Breakout asked for criteria; did not establish them |
| 4 Maritime Continent | Revised | Adds the modeling keynote and opening session |
| 5 Forecast skill vs understanding | Revised | Aligned with the Q07 reassessment |
| 6 Indices | Retained | Minor wording |
| 7 Observations | Revised | Adds independence of validation data |

New: **multiscale interactions** (two keynotes, final-day proposal, case studies; stated as a framing, not a mechanism) and **"Improved MJO prediction does not automatically translate into improved regional forecast value"** (applications keynote, Rushley case study, opening session, final-day reports, regional talks). The latter is accompanied by a four-level distinction — index accuracy, regional atmospheric response, hazard skill, decision value — stating what the records show and do not show at each level. No decision benefit is claimed.

### Executive synthesis

Rewritten around the question "What prevents the community from turning increasingly realistic MJO representations into reliable physical understanding and useful regional prediction?", connecting observations, theory, modeling/prediction and applications, with an explicit statement that the connections are the author's reading and not a framework the workshop adopted.

## 9C — Disagreement, complementarity and uncertainty (`classification.mjs`)

- **Q07**: primary relationship changed from C (complementary) to **B (different evaluation standards)**, secondary C. Phase 8 had placed a "not a disagreement" primary label under the Diverging Perspectives class, while the final-day record calls the contrast one of the clearest disagreements and the closing record leaves it unsettled. The analysis now has three layers: complementary objectives (not a disagreement), different evaluation standards (the recorded disagreement), and four open empirical questions (observation sufficiency, generalization, physical consistency, robustness of AI-derived mechanisms).
- **Q03**: retained as competing hypotheses; restated over five process families (horizontal advection, convergence, shallow-convective moistening, boundary-layer processes, temperature contributions) and four hypotheses about relative roles, ordering and necessity, with discriminating budgets and mechanism-denial experiments. The explicit contrast rests on a single Q&A exchange; the author may prefer to move Q03 to Open Questions. Withheld percentages remain withheld.
- **Q06, Q08, Q11**: agreement separated into four forms (problem recognition, methodological direction, physical explanation, formal endorsement). No formal endorsement is recorded for any of them.
- **Disagreement matrix** (Q01, Q03, Q05, Q07, Q08, Q09) and a separate list of seven complementary perspectives on `/questions`.

## 9D — Actionable strategy (`roadmap.mjs`)

Fifteen prerequisite relations among the twelve workflows (seven required, eight helpful), forming an acyclic graph with three stages; five workflows can start in parallel. External prerequisites (a defined hazard or decision target, data access, model outputs) are listed and not assumed. Three pilots — A Maritime Continent prediction barrier, B index disagreement catalogue, C observational requirements and data rescue — each with hypotheses, data, tools, classification, metrics, uncertainty, minimum viable experiment, criteria, outputs, risks, dependencies, roles (not people) and 30/60/90-day planning horizons. Qualitative assessment against six criteria; "unknown" where evidence is missing; no scores.

## 9E — Video evidence and usability (`videos.mjs`)

Every clip page shows five relationship dimensions: programme mapping, minutes-based relationship, key message checked against minutes, key message checked against the clip (never), and withheld mappings. "Video evidence" → "Related video highlights"; "Key message" → "Key Message from Session Minutes". Eight key messages were revised or added (Moncrieff keynote is new). Re-examination of withheld mappings: Chang Xu — the recording's opening indicates the minutes do belong to the talk (candidate resolution, author confirmation needed); final-day and closing records — partly clarified (group reports match the 11:00 Themes 5+6 plenary; the closing record may include the 14:00 final plenary); observation and theory extended minutes — unresolved. No mapping was changed.
