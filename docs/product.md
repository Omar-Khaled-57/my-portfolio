# My Portfolio product

## Problem and audience

A software developer needs one site that presents projects, CV, and contact
details in two languages, while allowing content edits without a code deploy.
This portfolio serves visitors in English and Arabic and gives the owner an
admin dashboard backed by Supabase.

The audience is:

- **Visitors** — browse the landing page, projects, project details, CV, and
  contact form; install the site as a PWA.
- **The owner / admin** — manage personal info, projects, certificates, tech
  tools, comments, and contact settings from `/dashboard`.

## What it does today

Routes come from [`src/App.tsx`](../src/App.tsx) and
[`src/Pages/Dashboard.tsx`](../src/Pages/Dashboard.tsx).

| Capability | Implementation |
| --- | --- |
| Bilingual landing page | `/` renders `LandingPage.tsx`; `src/i18n.tsx` provides EN/AR strings and `dir` switching. Theme + language state is in `src/context/`. |
| Public pages | `/project/:slug` renders `ProjectPageLayout.tsx` with `ProjectDetail.tsx`; `/cv` is a lazy-loaded page with `CVModal.tsx`; `*` renders `Pages/404.tsx`. |
| Project cards | `CardProject.tsx` and `src/utils/slug.ts` resolve project links; `TechStackIcon.tsx` and `src/utils/techTools.ts` map tool names to icons in `public/tools/`. |
| About / contact | `Pages/About.tsx` reads cached settings and local profile values; `Pages/Contact.tsx` uses the contact email from settings with a fallback and posts through `https://formsubmit.co/...`. |
| Comments | `components/Commentar.tsx` reads and inserts rows in Supabase `portfolio_comments`, polls every 30 seconds, and shows a single pinned comment. |
| Admin access | `/login` signs in with `supabase.auth.signInWithPassword`; `ProtectedRoute.tsx` checks `profiles.role === "admin"` before rendering `/dashboard/*`. |
| Dashboard | `Pages/Dashboard.tsx` has subroutes `personal-info` (default), `projects`, `certificates`, `tech-tools`, `comments`, and `emails` under `src/Pages/dashboard/`. |
| Content management | Dashboard pages write Supabase tables (`projects`, `certificates`, `tech_tools`, `app_settings`, `portfolio_comments`) and upload images to storage buckets (`project-images`, `certificate-images`, `tool-images`, `profile-images`). |
| Freeze controls | `app_settings` keys `comments_frozen` and `emails_frozen` are toggled in the dashboard and read by public pages. |
| Drag ordering | `src/hooks/useDragOrder.ts` updates order fields in Supabase for ordered content. |
| PWA | `vite.config.js` configures VitePWA with a manifest, `registerType: 'prompt'`, workbox caching, and install/update UI in `hooks/usePWAInstall.ts` and `components/PWAUpdateToast.tsx`. |
| SEO | `index.html` has canonical/hreflang/OG/Twitter tags and a CSP; `scripts/generate-sitemap.mjs` writes `public/sitemap.xml` at build time; `public/robots.txt` is shipped. |
| Performance tooling | `vite.config.js` includes a render-block optimizer and manual chunks; `npm run perf:audit` runs Lighthouse (see [testing](./testing.md)). |

## Data that exists today

- Content is fetched by `DataContext.tsx` from Supabase tables and cached in
  browser `localStorage` (`app_settings` plus settings keys, `projects`,
  `certificates`, `tech_tools`). Public comments are fetched separately.
- Database schema and migrations live in
  [`dev/sqls/`](../dev/sqls/README.md); setup instructions are in
  [`README.md`](../README.md).
- The site's live URL is listed in the README as
  `https://omar-el-khouly.vercel.app`; the same URL is the default for
  canonical tags, sitemap generation, and committed Lighthouse reports.

## Non-goals and known gaps

- **Comments are polled, not realtime.** `Commentar.tsx` polls every 30 seconds;
  no Supabase `channel()` subscription exists in the source.
- **No automated tests.** There is no `test` script, no test runner dependency,
  and no test files. Lint, typecheck, build, and `perf:audit` are the available
  checks.
- **No CI workflow** is committed; only a Vercel SPA rewrite is in
  [`vercel.json`](../vercel.json).
- **Lighthouse JSON files are snapshots**, not results of the `perf:audit`
  script; see [testing](./testing.md) for exact report metadata.
- **Content depends on Supabase env vars.** Without them, `src/supabase.ts`
  throws at startup.
- The `dev/` folder holds plans, SQL, and performance notes; it is development
  material, not shipped application code.

## Sources

- [`README.md`](../README.md), [`package.json`](../package.json)
- [`src/App.tsx`](../src/App.tsx), [`src/Pages/`](../src/Pages/), [`src/components/`](../src/components/)
- [`src/context/DataContext.tsx`](../src/context/DataContext.tsx), [`src/supabase.ts`](../src/supabase.ts), [`src/i18n.tsx`](../src/i18n.tsx)
- [`vite.config.js`](../vite.config.js), [`vercel.json`](../vercel.json), [`index.html`](../index.html), [`scripts/`](../scripts/), [`dev/sqls/README.md`](../dev/sqls/README.md)
