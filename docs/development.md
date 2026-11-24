# My Portfolio development

## Prerequisites

- Node.js 18+ and npm (stated in the original [`README.md`](../README.md)).
- A Supabase project for the data/auth features; copy `.env.example` to `.env`
  and fill in the keys before running the app.
- Chrome/Chromium only for the optional screenshot and Lighthouse scripts.

## Install and run

```bash
npm install
cp .env.example .env
npm run dev
```

`.env` must define `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` or
[`src/supabase.ts`](../src/supabase.ts) throws at startup. See
[configuration](./configuration.md) for all variables and
[`dev/sqls/README.md`](../dev/sqls/README.md) for database setup.

## Command reference

Every command below is copied verbatim from the `scripts` block of
[`package.json`](../package.json).

| Command | Script | Purpose |
| --- | --- | --- |
| `npm run dev` | `vite` | Start the dev server. |
| `npm run sitemap` | `node scripts/generate-sitemap.mjs` | Regenerate `public/sitemap.xml`. |
| `npm run build` | `tsc --noEmit && node scripts/generate-sitemap.mjs && vite build` | Typecheck, sitemap, production bundle. |
| `npm run lint` | `eslint .` | Lint the repo. |
| `npm run typecheck` | `tsc --noEmit` | TypeScript check only. |
| `npm run perf:audit` | `node scripts/perf-audit.mjs` | Run a Lighthouse audit against a URL you pass. |
| `npm run preview` | `vite preview` | Serve the production build locally. |

There is no `test` script. See [testing](./testing.md) for what `perf:audit`
actually does and for the committed Lighthouse snapshots.

Standalone helper scripts are not npm scripts:

| Script | Invocation and requirements |
| --- | --- |
| [`scripts/generate-icons.py`](../scripts/generate-icons.py) | `python3 scripts/generate-icons.py`; requires Pillow; regenerates icons from `scripts/assets/icon.png`. |
| [`scripts/generate-screenshots.mjs`](../scripts/generate-screenshots.mjs) | `CHROME_PATH=... node scripts/generate-screenshots.mjs`; uses `puppeteer-core`, needs a preview server (default `http://localhost:4173/`) and writes desktop/mobile screenshots into `public/screenshots/`. |

## Repository structure

```text
public/                  Static assets, PWA icons, fonts, images, robots.txt
src/
  main.tsx               React bootstrap and provider tree
  App.tsx                BrowserRouter routes and global UI
  Pages/                 Public pages + dashboard/* admin pages
  components/            Shared components + dashboard/* widgets
  context/               ThemeContext, DataContext
  hooks/                 useAOS, useDragOrder, usePWAInstall
  i18n.tsx               EN/AR strings and language provider
  supabase.ts            Supabase client
  types/, utils/         Types and helpers
  index.css              Tailwind layers and theme variables
scripts/                 Sitemap, icons, screenshots, perf-audit
dev/                     SQL migrations, plans, notes, Lighthouse JSON
dist/                    Build output (present locally, gitignored)
```

## Conventions evidenced in the tree

- TypeScript is strict and `noEmit`; `vite/client` and `vite-plugin-pwa/client`
  types are included through [`tsconfig.json`](../tsconfig.json).
- Public pages import shared components from `src/components/` and data from
  `useSharedData()` in `DataContext.tsx`; dashboard pages write through
  `supabase` directly and call `refetch()`.
- User-facing text goes through `useI18n()` / `src/i18n.tsx` for both EN and AR;
  RTL is handled through direction attributes in the components.
- Theme values are CSS variables defined in [`src/index.css`](../src/index.css)
  and documented in [visual identity](./visual-identity.md).
- Ordered content uses `src/hooks/useDragOrder.ts` and order fields in
  Supabase; slugs are normalized in `src/utils/slug.ts`.
- `public/sitemap.xml` is generated, so edit
  [`scripts/generate-sitemap.mjs`](../scripts/generate-sitemap.mjs) rather than
  the generated file.

## Adding a feature

1. Add a page under `src/Pages/` and register it in
   [`src/App.tsx`](../src/App.tsx) (or under `src/Pages/dashboard/` and
   `Dashboard.tsx` for admin-only features).
2. Put reusable UI in `src/components/`; use `Helmet` from
   `react-helmet-async` for page-specific metadata.
3. Add all new strings to both languages in [`src/i18n.tsx`](../src/i18n.tsx).
4. If the feature needs persisted content, add the table/column via a new SQL
   migration in [`dev/sqls/`](../dev/sqls/) and update `DataContext.tsx` plus any
   dashboard editor.
5. Verify with `npm run typecheck`, `npm run lint`, and `npm run build`. Use
   `npm run preview` for a production smoke test.

## Troubleshooting grounded in the code

| Symptom | Check |
| --- | --- |
| App throws "Supabase URL and Anon Key are required" | `.env` is missing `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`, or the dev server was not restarted after editing it. |
| Dashboard redirects to `/login` | `ProtectedRoute.tsx` requires a signed-in user with `profiles.role === 'admin'`; check the profile row created per the README SQL step. |
| Content shows stale values | `DataContext.tsx` caches rows in `localStorage`; dashboard edits call `refetch()`, but a hard reload may be needed after manual storage changes. |
| Comments do not update immediately | `Commentar.tsx` polls every 30 seconds; there is no realtime subscription. |
| Deep link 404s on the host | `vercel.json` rewrites extensionless paths to `/`; verify the host applies the rewrite. |
| PWA update does not appear | VitePWA is configured with `registerType: 'prompt'` and `injectRegister: false`; the UI lives in `PWAUpdateToast.tsx` and `usePWAInstall.ts`. |
| Sitemap has only `/` and `/cv` | `generate-sitemap.mjs` could not read Supabase vars or the project query failed; the script warns and keeps static entries. |
| Icon generation fails | `generate-icons.py` requires Pillow (a Python dependency, not in `package.json`). |

## Sources

- [`README.md`](../README.md), [`package.json`](../package.json), [`tsconfig.json`](../tsconfig.json)
- [`src/`](../src/), [`scripts/`](../scripts/), [`dev/sqls/README.md`](../dev/sqls/README.md), [`vite.config.js`](../vite.config.js), [`vercel.json`](../vercel.json)
