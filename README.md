# MJO Workshop 2026 Knowledge & Action Portal

Private, local development prototype for workshop participants. English-only.
This repository is independent of the private `researcher_os` research environment.
No scientific content has been imported. No remote repository or deployment has been created.

## Local development

Use Node.js 24.15+ in the 24.x line (see `.nvmrc`). A project-local Node 24 runtime is also installed as a dev dependency, so npm scripts use that runtime without changing the machine-wide installation.

```sh
npm ci
npm run dev
```

- Homepage: http://localhost:4321/
- EmDash administration: http://localhost:4321/_emdash/admin/
- Fresh database: the administration route opens the initial setup wizard.
- The development server binds to loopback only. Do not add `--host 0.0.0.0`, a tunnel, or a public preview without authorization.
- This Astro version runs the development server in the background. Use `npm exec astro dev status` to check it and `npm exec astro dev stop` to stop it.

The official scaffolder generated `.env` with a private `EMDASH_ENCRYPTION_KEY`. Preserve it; do not commit or share it. For a fresh clone with no `.env`, use the following command once to create one with a cryptographically random key (it refuses to overwrite an existing file):

```sh
node --input-type=module -e 'import { randomBytes } from "node:crypto"; import { writeFileSync } from "node:fs"; writeFileSync(".env", `EMDASH_ENCRYPTION_KEY=${randomBytes(32).toString("hex")}
`, { flag: "wx", mode: 0o600 });'
```

`.env.example` documents the required variable without a real key. Never use a `PUBLIC_` variable for secrets. Back up the key securely and separately from database backups.

## Manual administrator setup

1. Open the admin URL in your own browser on this Mac. Use `localhost` consistently for setup and later sign-in.
2. Use site title **MJO Workshop 2026** and tagline **Knowledge & Action Portal**. Select **Empty site**; the seed deliberately contains no posts or pages.
3. Enter your administrator email and name.
4. Register a passkey using the browser/OS prompt, then open the dashboard.
5. Keep scientific content unpublished until its reviewed source and publication approval have been recorded.

No administrator identity or passkey was created by the implementation agent. A verified setup screen is not a verified authenticated editor session. Email delivery is not configured.

## Commands and structure

```sh
npm run typecheck
npm run verify:local  # Requires the local dev server
npm run build
npm run preview
```

| Path | Purpose |
| --- | --- |
| `astro.config.mjs` | Official Node adapter, English React admin, EmDash SQLite/local storage integration and private-file HTTP exclusions |
| `src/live.config.ts` | Official EmDash live content loader |
| `src/pages/` | Server-rendered homepage and Starter post/page/taxonomy routes |
| `src/layouts/Base.astro` | Shared English layout with official EmDash page contributions |
| `src/styles/portal.css` | Small responsive local prototype stylesheet |
| `seed/seed.json` | Starter Posts/Pages schema; no sample or scientific content |
| `data.db`, `uploads/` | Local runtime data; ignored by Git |
| `docs/PROJECT_BRIEF.md` | Audience, boundaries, editorial rules and future scope |
| `docs/IMPLEMENTATION_PLAN.md` | Phase checklist, acceptance criteria and deployment gates |
| `docs/VERIFICATION.md` | Actual implementation checks, limitations and dependency findings |

## GitHub preparation

Intended destination: **`motesaku/mjo-workshop-2026-portal`**, private.
The local Git repository has no commits and no configured remote. This is intentional: no remote creation, push, publication, or automated deployment is authorized. After explicit authorization, create the remote as private, review the files and ignored paths, and then configure/push it. A private GitHub repository does not make a deployed website private.

## Later Cloudflare deployment

Plan only: Cloudflare Workers + D1 (`DB`) + R2 (`MEDIA`). See the implementation plan before changing the adapter. No Wrangler deployment configuration, cloud resources, GitHub Actions, deployment button, or deploy script is enabled in this phase. Videos will remain YouTube embeds; R2 is only for approved site assets and carefully protected backups.

## Official sources and scaffold provenance

Generated on 2026-11-01 using `create-emdash@1.4.0`:

```sh
npm create emdash@latest mjo-workshop-2026-portal -- --template starter --platform node --pm npm --install --yes
```

- [EmDash Getting Started](https://docs.emdashcms.com/getting-started/)
- [EmDash Node.js guide](https://docs.emdashcms.com/deployment/nodejs/)
- [EmDash Cloudflare guide](https://docs.emdashcms.com/deployment/cloudflare/)

The npm lockfile records installed versions. The scaffold's transitive dependencies currently have an audit finding; see `docs/VERIFICATION.md`. Do not apply `npm audit fix --force`: the suggested EmDash downgrade is incompatible with this scaffold.
