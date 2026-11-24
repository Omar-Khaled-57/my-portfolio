# My Portfolio documentation

My Portfolio is Omar Khaled El-Khouly's React/Vite personal site: a bilingual
public portfolio, a Supabase-backed admin dashboard, and an installable PWA.
This index follows the [hub documentation standard](../../docs/DOC-STANDARD.md).

## Start here

- [Product](./product.md) — audience, public pages, dashboard, and gaps.
- [Architecture](./architecture.md) — Vite entry points, routes, data flow,
  Supabase tables, and PWA build pipeline.
- [Development](./development.md) — prerequisites, exact scripts, structure,
  conventions, and troubleshooting.

Configuration, testing, deployment, and release history each have their own
page. The pre-existing [visual identity guide](./visual-identity.md) remains
the design reference.

## Documentation index

| Page | Answers |
| --- | --- |
| [Product](./product.md) | What the site does today and what it does not do. |
| [Architecture](./architecture.md) | Stack, routes, contexts, data flow, storage boundaries, PWA pipeline. |
| [Development](./development.md) | Install, commands, repository map, conventions, fixes. |
| [Configuration](./configuration.md) | Env vars, config files, local storage keys, user settings, security notes. |
| [Testing](./testing.md) | Available checks, perf audit script, committed Lighthouse snapshots, gaps. |
| [Deployment](./deployment.md) | Build command, `dist/` artifact, Vercel rewrite, env requirements. |
| [Changelog](./changelog.md) | Release-note status and version evidence. |
| [Visual identity](./visual-identity.md) | Palette and theme sources (pre-existing guide). |
| [Hub documentation standard](../../docs/DOC-STANDARD.md) | The shared contract all hub projects follow. |

### Pre-existing development notes in `dev/`

These notes are kept where they were; they are working documents and plans, not
replacements for the pages above.

| Document | Topic |
| --- | --- |
| [`dev/sqls/README.md`](../dev/sqls/README.md) | SQL migration order and purpose. |
| [`dev/tech-tools.md`](../dev/tech-tools.md) | Tech tool id reference. |
| [`dev/performance-enhancement.md`](../dev/performance-enhancement.md) | Performance enhancement plan. |
| [`dev/performance-consistency.md`](../dev/performance-consistency.md) | Consistent PageSpeed scores (perf-consistency). |
| [`dev/PLAN-Flameo-Plan_PWA-A.md`](../dev/PLAN-Flameo-Plan_PWA-A.md) | PWA core hardening (manifest + icons). |
| [`dev/PLAN-Flameo-Plan_PWA-Install-C.md`](../dev/PLAN-Flameo-Plan_PWA-Install-C.md) | PWA install button and update toast. |
| [`dev/PLAN-Flameo-Plan_SEO-B.md`](../dev/PLAN-Flameo-Plan_SEO-B.md) | SEO and metadata hardening. |
| [`dev/PLAN-Flameo-Plan_Monitor-D.md`](../dev/PLAN-Flameo-Plan_Monitor-D.md) | Monitoring and verification (parked). |
| [`dev/PLAN-hero-animation-orientation.md`](../dev/PLAN-hero-animation-orientation.md) | Hero animation sizing. |
| [`dev/PLAN-lighthouse-performance-2026-09-11.md`](../dev/PLAN-lighthouse-performance-2026-09-11.md) | Lighthouse performance plan. |
| [`dev/PLAN-mobile-lcp-2026-09-12.md`](../dev/PLAN-mobile-lcp-2026-09-12.md) | Mobile LCP and performance phases. |
| [`dev/PLAN-perf-overhaul-2026-09-11.md`](../dev/PLAN-perf-overhaul-2026-09-11.md) | Performance overhaul plan. |
| [`dev/PLAN-responsive-fixes.md`](../dev/PLAN-responsive-fixes.md) | Responsive fixes. |
| [`dev/PLAN-tech-icon-loader.md`](../dev/PLAN-tech-icon-loader.md) | Tech-icon square-walk loader. |
| [`dev/PLAN-tech-tools.md`](../dev/PLAN-tech-tools.md) | Dynamic tech tools. |
| [`dev/PLAN-ts-migration.md`](../dev/PLAN-ts-migration.md) | TypeScript migration. |
| [`dev/PLAN-versioned-tech-stack-icons.md`](../dev/PLAN-versioned-tech-stack-icons.md) | Versioned tech-stack icon resolution. |

## Canonical source-of-truth files

| File | Authority for |
| --- | --- |
| [`package.json`](../package.json) | Scripts, dependencies, author, version. |
| [`vite.config.js`](../vite.config.js) | React plugin, VitePWA manifest/workbox, HTML optimizer, chunking, sourcemaps. |
| [`vercel.json`](../vercel.json) | SPA rewrite rule for the host. |
| [`index.html`](../index.html) | Static metadata, canonical URL, CSP, social tags. |
| [`src/main.tsx`](../src/main.tsx), [`src/App.tsx`](../src/App.tsx) | Entry point, provider tree, router and routes. |
| [`src/context/DataContext.tsx`](../src/context/DataContext.tsx), [`src/supabase.ts`](../src/supabase.ts) | Supabase queries, settings keys, localStorage cache, client env vars. |
| [`src/context/ThemeContext.tsx`](../src/context/ThemeContext.tsx), [`src/i18n.tsx`](../src/i18n.tsx) | Theme and language persistence. |
| [`src/components/ProtectedRoute.tsx`](../src/components/ProtectedRoute.tsx), [`src/Pages/Dashboard.tsx`](../src/Pages/Dashboard.tsx) | Admin gating and dashboard subroutes. |
| [`scripts/generate-sitemap.mjs`](../scripts/generate-sitemap.mjs), [`scripts/perf-audit.mjs`](../scripts/perf-audit.mjs) | Build-time sitemap generation and the Lighthouse audit runner. |
| [`lighthouse-report.json`](../lighthouse-report.json), [`dev/lighthouse/page-loaded.json`](../dev/lighthouse/page-loaded.json) | Committed Lighthouse snapshots. |
| [`.env.example`](../.env.example) | Documented environment variable names. |
| [`dev/sqls/`](../dev/sqls/) | Database migrations and setup README. |
| [`README.md`](../README.md) | Original overview, live URL, Supabase setup notes. |

## Known gaps

- No `test` script, test runner, or test files are committed. See
  [testing](./testing.md).
- `perf:audit` runs Lighthouse against a URL you supply; it does not read the
  committed JSON reports, and those reports are point-in-time snapshots.
- Public comments refresh by 30-second polling (`src/components/Commentar.tsx`);
  no Supabase realtime subscription is wired.
- No CI workflow is committed. `vercel.json` contains only an SPA rewrite.
