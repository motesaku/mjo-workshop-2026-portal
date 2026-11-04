# Phase 8 editorial log

Every scientific-content change made in Phase 8 is listed here with the existing claims it rests on. All Phase 8 wording is a **draft awaiting the author's review** (`PHASE8_EDITORIAL.status` in `src/science/phase8/status.mjs`). Nothing here is independent scientific verification, and no workshop consensus is claimed.

Rules applied to every entry:

1. Identify the existing evidence (claim IDs in `personal-synthesis.json`).
2. Check consistency with those claims; do not add facts absent from them.
3. Preserve uncertainty wording (e.g. "candidate", "not established", "withheld").
4. Mark new conclusions as editorial synthesis, distinct from workshop records.
5. Never attribute positions to named participants in discussion sessions.

The bundled package `src/data/personal-synthesis.json` (v1.0.0) is unchanged.

## 8B — Relations and clip pages (2026-11-04)

### Provenance supplement

Six evidence locators cited in the package but missing from its public `evidence` list were supplied from the local provenance export (public fields only), plus the source record `src-brennek`. File: `src/science/phase8/provenance-supplement.mjs`. No claim text changed.

### Source → clip mapping

`src/science/phase8/source-video-map.mjs`. 25 programme-talk sources map to the clip(s) of the same talk; 3 discussion sources (`src-g3`, `src-p12`, `src-p34`) map to the clip mapped to the same session. Withheld, with reasons shown to readers: `src-xu` (content differs from programme title), `src-final` (11:00 vs 14:00 unresolved), `src-closing` (extent unresolved; clip provisional), `src-obs` (provisional date, overlaps plenary), `src-g34` (inferred date, overlaps plenary).

Result: 29 of 38 clips are linked to at least one question. Unlinked: welcome/introductory talks, Mitch Moncrieff keynote, Chang Xu talk (disputed), Themes 5+6 plenary, final plenary, closing discussion, group reports (alternate), observations/AI discussion (provisional), isotope discussion (unmapped).

### Clip key messages (28 clips)

Each one-sentence key message condenses the listed workshop-record claims, which cite the minutes of that clip's talk or session. Programme-derived context is marked "programme topic". None was checked against the clip.

| Clip | Basis claims |
| --- | --- |
| Kunio Yoneyama — Field Data & Tropical Variability | q03-c03 |
| Jiawei Bao — Tropics-wide ISO | q04-c01, q04-c02, q04-c04 |
| Naoko Sakaeda — Global energy cycle | q04-c03, q04-c05 |
| Shuyi Chen — MJO precipitation trend | q06-c01, q12-c01 |
| Qoosaku Moteki — CENS and the MJO | q11-c03 |
| Boualem Khouider — Theory and modelling | q01-c01 |
| Daehyun Kim — Modeling | q09-c07 |
| Jonathan Lin — Stratospheric interactions | q05-c01, q05-c03 |
| Daisuke Takasuka — Deterministic chaos | q02-c03, q02-c05, q09-c06 |
| Bernardo Maraldi — IFS-NEMO | q09-c02, q12-c02 |
| Satoru Yokoi — Boundary layer | q03-c03 |
| Ray Pallav Kumar — Temperature and MSE | q03-c02 (percentages still withheld) |
| Breakout — Themes 3+4 | q02-c02, q07-c03 |
| Plenary — Themes 1+2 | q10-c01, q10-c03 |
| Plenary — Themes 3+4 | q01-c02, q07-c02 |
| Hyemi Kim — Prediction (and alternate cut) | q06-c02, q08-c01, q09-c01 |
| Andrew Robertson — Applications | q11-c02, q11-c05 |
| Matthew Janiga — Object-based verification | q02-c04, q06-c02, q06-c06 |
| Matteo Siena — Hectometric ICON | q09-c04 |
| Stephanie Rushley — North Pacific cyclones | q11-c01, q11-c06 |
| Yan Liu — Shallow convection | q02-c03 |
| Bibian Ekot — West Africa | q11-c02 |
| Luana Scheibe — South America | q11-c02 |
| Hera Kim — Predictability limit | q08-c03 |
| Simon Peatman — Sumatra squalls | q12-c03, q12-c05 |
| Yu-Cian Tsai — Easterly waves | q11-c03 |
| Kenedy Silverio — Southern Africa | q11-c02 |

The Michał Brennek talk is linked to Q11 only through an editorial comparison (q11-c07); it has no key message.

### Why each question matters (12 entries)

Editorial framing of scientific significance, `ISSUE_SIGNIFICANCE` in `editorial-videos.mjs`. Bases: Q01 q01-c07 · Q02 q02-c01, q02-c08 · Q03 q03-c06, q03-c08 · Q04 q04-c06 · Q05 q05-c02, q05-c05 · Q06 q06-c07, q06-c08 · Q07 e-hkim-43-48, q07-c07 · Q08 q08-c07, q08-c10 · Q09 q09-c01, q09-c08 · Q10 q10-c02, q10-c08 · Q11 q11-c06, q11-c07 · Q12 q12-c05, q12-c07.

### Action cross-links (8)

Each existing action keeps its primary question. Added "also informs" links: action Q03 → Q01; Q02 → Q09; Q08 → Q07; Q09 → Q07; Q06 → Q08; Q06 → Q11; Q10 → Q03; Q12 → Q06. Rationales and basis claims are in `ACTION_CROSS_LINKS`.
