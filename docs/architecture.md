# My Portfolio architecture

## Technology stack

Versions are from [`package.json`](../package.json).

| Layer | Choice |
| --- | --- |
| Build tool | Vite `^5.4.10`, `@vitejs/plugin-react` `^4.3.3` |
| UI | React `^18.3.1`, `react-router-dom` `^6.28.0`, TypeScript `~5.8.0` |
| Styling | Tailwind CSS `^3.4.17`, PostCSS + autoprefixer, Material UI / Emotion, `clsx` |
| Motion and media | Framer Motion `^11.15.0`, AOS `^2.3.4`, Lottie Web `^5.13.0`, lucide-react |
| Metadata and alerts | `react-helmet-async`, SweetAlert2 |
| Backend client | `@supabase/supabase-js` `^2.49.9`, axios |
| PWA | `vite-plugin-pwa` `^1.3.0` (Workbox) |
| Quality / perf tooling | ESLint 9, TypeScript, Lighthouse `^13.4.1`, chrome-launcher |

## Entry points and routes

[`index.html`](../index.html) mounts `#root` through
[`src/main.tsx`](../src/main.tsx):

```text
ThemeProvider → I18nProvider → DataProvider → App
```

[`src/App.tsx`](../src/App.tsx) wraps the tree in `HelmetProvider`, renders the
animated background, PWA update toast, and global key handler, then installs
`BrowserRouter`:

| Route | Component |
| --- | --- |
| `/` | `LandingPage.tsx` |
| `/project/:slug` | `ProjectPageLayout.tsx` |
| `/cv` | lazy `Pages/CV.tsx` |
| `/login` | lazy `Pages/Login.tsx` |
| `/dashboard/*` | lazy `Pages/Dashboard.tsx` behind `ProtectedRoute.tsx` |
| `*` | lazy `Pages/404.tsx` |

`Dashboard.tsx` nests its own routes: `personal-info` (index redirect target),
`projects`, `certificates`, `tech-tools`, `comments`, and `emails`.

## Directory map

```text
public/                     Static assets and generated PWA/SEO files
  icons/, screenshots/      PWA icons and install screenshots
  fonts/, images/           Self-hosted fonts, profile images, OG artwork
  documents/                Downloadable CV PDF
  tools/                    Tech stack SVG/PNG logos
  animations/lottie.json    Hero animation data
  robots.txt, sitemap.xml   Crawler rules; sitemap written at build time
src/
  main.tsx, App.tsx         Bootstrap and router
  Pages/                    Public pages and Pages/dashboard/* admin pages
  components/               Shared UI; components/dashboard/* admin widgets
  context/                  Theme and shared data contexts
  hooks/                    useAOS, useDragOrder, usePWAInstall
  i18n.tsx                  English/Arabic translations and provider
  supabase.ts               Supabase client from VITE_* env vars
  types/, utils/            Shared types and helpers
  index.css                 Global styles and theme variables
scripts/                    generate-sitemap.mjs, generate-icons.py,
                            generate-screenshots.mjs, perf-audit.mjs
dev/                        SQL migrations, plans, performance notes, reports
dist/                       Build output present in the working tree (ignored)
```

## Data and state flow

```text
Supabase project
  ├── Auth: signInWithPassword, getUser, signOut
  ├── Tables: app_settings, projects, certificates, tech_tools,
  │           portfolio_comments, profiles (role check)
  └── Storage: project-images, certificate-images, tool-images,
               profile-images
        │
        ▼
DataContext.fetchData() ──▶ React state ──▶ public pages and dashboard
        │                       │
        ├──▶ localStorage cache │  (app_settings + settings keys, projects,
        │                        │   certificates, tech_tools)
        └──▶ 'portfolioDataLoaded' window event
```

[`src/context/DataContext.tsx`](../src/context/DataContext.tsx) fetches
published projects, certificates, tech tools, and selected `app_settings` rows
with Supabase queries, caches them in `localStorage`, and exposes `refetch`.
The comment component fetches separately and polls every 30 seconds. The
dashboard writes through Supabase and calls `refetch`.

Auth boundary: [`src/supabase.ts`](../src/supabase.ts) creates one client from
`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (throwing if either is
missing). `ProtectedRoute.tsx` gates `/dashboard/*` on an authenticated user
whose `profiles.role` is `admin`; the dashboard itself sets `noindex, nofollow`
through `Helmet`.

Theme and language are independent contexts:
[`ThemeContext.tsx`](../src/context/ThemeContext.tsx) writes `data-theme` on
`<html>` and updates the `theme-color` meta tag; `src/i18n.tsx` stores the
chosen language in `localStorage` and switches direction via React context.

## Build and PWA pipeline

[`vite.config.js`](../vite.config.js) defines three plugins:

1. `react()` — JSX transform.
2. `VitePWA()` — generated manifest (`id: '/'`, standalone display, shortcuts
   for `/` and `/cv`, icons and screenshots from `public/`), `registerType:
   'prompt'`, `injectRegister: false`, and Workbox caching. Precache patterns
   cover `index.html`, the manifest, icons, fonts, and the index/react-vendor
   chunks. Runtime rules cache `/assets/*` with `CacheFirst` (30 days) and the
   configured Supabase host with `NetworkFirst` (1 day, 10 s timeout).
3. `renderBlockOptimizer()` — a local plugin that rewrites stylesheet links to
   preloads in HTML and, in `writeBundle`, injects module preloads for the
   `Home-*` and desktop-only `lottie-*` chunks plus Poppins 400/700 font
   preloads.

Build output uses sourcemaps and manual chunks `react-vendor` and `lottie`.
`npm run build` first type-checks with `tsc --noEmit`, then runs the sitemap
generator, then `vite build`. The sitemap script reads Supabase env vars (or
`.env`) and adds published project URLs from Supabase; on failure it keeps the
static `/` and `/cv` entries. [`vercel.json`](../vercel.json) supplies a single
SPA rewrite so client-side routes resolve to `/`.

## Sources

- [`package.json`](../package.json), [`vite.config.js`](../vite.config.js), [`vercel.json`](../vercel.json), [`index.html`](../index.html), [`tsconfig.json`](../tsconfig.json)
- [`src/main.tsx`](../src/main.tsx), [`src/App.tsx`](../src/App.tsx), [`src/Pages/Dashboard.tsx`](../src/Pages/Dashboard.tsx)
- [`src/context/DataContext.tsx`](../src/context/DataContext.tsx), [`src/context/ThemeContext.tsx`](../src/context/ThemeContext.tsx), [`src/i18n.tsx`](../src/i18n.tsx), [`src/supabase.ts`](../src/supabase.ts)
- [`src/components/ProtectedRoute.tsx`](../src/components/ProtectedRoute.tsx), [`src/components/Commentar.tsx`](../src/components/Commentar.tsx), [`src/hooks/usePWAInstall.ts`](../src/hooks/usePWAInstall.ts)
- [`scripts/generate-sitemap.mjs`](../scripts/generate-sitemap.mjs), [`dev/sqls/README.md`](../dev/sqls/README.md)
