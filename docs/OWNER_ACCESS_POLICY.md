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
| Hosting | **Public** Cloudflare host authorized 2026-11-03; live at `https://<worker-name>.<account-subdomain>.workers.dev`; search engines remain **`noindex, nofollow`** until a separate indexing decision |
| Cloudflare Access | Not used for the first public deploy (site is openly reachable by URL) |
| Production admin | EmDash setup + owner passkey completed on the workers.dev origin (2026-11-04); localhost passkeys remain separate |

## Implications for the prototype

1. Visible English disclosure on every page (prototype bar + footer) and a full statement on `/about`.
2. YouTube embed permission already allows participant and future public use for `RPXnSvabsGY`.
3. Theme/issue copy may move from “awaiting formal workshop sign-off” framing to “personal synthesis from minutes,” while keeping origin labels and avoiding false consensus.
4. Scientific theme/issue/action bodies are served from committed `src/data/personal-synthesis.json` in both development and production. Raw minutes, Japanese drafts and private provenance under `exports/` remain gitignored and are not a runtime input.
5. First public host: Cloudflare Workers (`workers.dev` unless a custom domain is later approved). Keep `noindex, nofollow` on every page until the owner explicitly allows indexing.
6. Custom domain, Access, GitHub Actions auto-deploy, and `noindex` removal each need a separate authorization.

## Related files

- Site copy: `src/data/portal.ts` (`SITE_STANCE`), `src/layouts/Base.astro`, `src/pages/index.astro`, `src/pages/about.astro`
- YouTube decisions: `docs/OWNER_YOUTUBE_PERMISSIONS.md`
