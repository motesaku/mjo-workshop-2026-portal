# Owner access and authorship policy

Decided **2026-11-03** by Qoosaku Moteki. Recorded on the public-facing site (home, top bar, footer, About).

## Decision

| Topic | Choice |
| --- | --- |
| Audience | General public (personal workshop participation report) |
| Authorship | Qoosaku Moteki alone, as one workshop participant |
| Stance | Personal learning and present understanding from the workshop |
| Not claimed | Official ICTP product; convenor product; multi-author consensus; shared participant CMS |
| Accounts | No participant account management; single editor (site owner) |
| Scientific pages | Fill from converted minutes where usable, label uncertainty, complete a readable report |
| Other participants | Not invited as co-editors on this site |
| Hosting | Intended public site; Cloudflare/other go-live remains a separate technical authorization |

## Implications for the prototype

1. Visible English disclosure on every page (prototype bar + footer) and a full statement on `/about`.
2. YouTube embed permission already allows participant and future public use for `RPXnSvabsGY`.
3. Theme/issue copy may move from “awaiting formal workshop sign-off” framing to “personal synthesis from minutes,” while keeping origin labels and avoiding false consensus.
4. Scientific theme/issue/action bodies are served from committed `src/data/personal-synthesis.json` in both development and production. Raw minutes, Japanese drafts and private provenance under `exports/` remain gitignored and are not a runtime input.
5. `noindex, nofollow` stays until an authorized public host is live and the owner asks to allow indexing.
6. AGENTS.md deployment gate remains: do not create tunnels, previews, or Cloudflare resources without an explicit deploy order.

## Related files

- Site copy: `src/data/portal.ts` (`SITE_STANCE`), `src/layouts/Base.astro`, `src/pages/index.astro`, `src/pages/about.astro`
- YouTube decisions: `docs/OWNER_YOUTUBE_PERMISSIONS.md`
