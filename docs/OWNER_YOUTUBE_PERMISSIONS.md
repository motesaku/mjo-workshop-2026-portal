# Owner worksheet — YouTube highlight permissions

Created 2026-11-03 for the local prototype. Videos stay on YouTube; this portal only embeds approved IDs.

Related risks: R3 (permissions / representative versions — **cleared for this one ID**), R11 (channel display name — accepted). Admin registration (R4) is complete for the local prototype.

## A. Already verified (do not re-decide)

| Item | Status |
| --- | --- |
| Video ID | `RPXnSvabsGY` |
| Rendered YouTube title | `MJO Workshop 2026: Discussion — Breakout Discussion — Themes 3 + 4` |
| Duration | 1:00 (60 seconds) |
| Visibility | Unlisted (kept) |
| Official session mapping | 2026-10-27 16:30–18:00 Europe/Rome — Breakout Themes 3 + 4 (`tue-breakout-3-4`) |
| Not the same as | 2026-10-28 11:00 Themes 3 + 4 plenary |
| Site technical embedding | Click-to-load `youtube-nocookie.com` iframe works locally |
| Scientific summary from this clip | Still not approved; clip is not independent evidence |

## B. Decisions for `RPXnSvabsGY` (recorded)

| # | Question | Decision | Date |
| --- | --- | --- | --- |
| B2 | Embed for final workshop participants on a private site? | **Yes** | 2026-11-03 |
| B3 | Embed on a future public site? | **Yes** (does not authorize deployment by itself) | 2026-11-03 |
| B4 | Representative one-minute version? | **Yes** — keep `RPXnSvabsGY` | 2026-11-03 |
| B6 | YouTube visibility | **Keep Unlisted** | 2026-11-03 |
| B8 | Japanese channel display name in the embed | **Accept as shown by YouTube** | 2026-11-03 |

Site updates applied the same day: `src/data/portal.ts`, video detail / home / about copy, Phase 6 local package highlight flags. Package-level `scientific_review` / `publication_approval` remain `pending`.

## C. Additional highlights (still open)

| Working title / session | Candidate YouTube ID | Mapping | Permission | Representative | Notes |
| --- | --- | --- | --- | --- | --- |
| Themes 3+4 breakout (current) | `RPXnSvabsGY` | Yes | Owner approved | Owner approved | Contextual only |
| Index / diagnostics highlight | — | No | — | — | Still needed for Indices page gap |
| Prediction / predictability highlight | — | No | — | — | Optional for AI page |
| Other | — | No | — | — | |

## D. Audience and access (recorded 2026-11-03)

| # | Question | Status |
| --- | --- | --- |
| D1 | Who may see the portal? | **General public** — personal workshop report by Qoosaku Moteki |
| D2 | How do readers authenticate? | **No participant accounts**; open reading; single editor |
| D3 | Backup/restore owner for CMS later | Qoosaku Moteki (same as site author) until named otherwise |

See `docs/OWNER_ACCESS_POLICY.md` for the full authorship statement.

## E. What remains blocked

- Scientific summary / discussion points for this clip
- CMS import of scientific records
- Public Cloudflare deployment (separate authorization)
- Adding any further YouTube IDs without repeating B2–B4 for each
