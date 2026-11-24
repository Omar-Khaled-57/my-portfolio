# My Portfolio deployment

## Build

```bash
npm install
npm run build
```

[`package.json`](../package.json) defines `build` as
`tsc --noEmit && node scripts/generate-sitemap.mjs && vite build`. The steps
are:

1. Typecheck with `tsc --noEmit`.
2. Regenerate `public/sitemap.xml` with
   [`scripts/generate-sitemap.mjs`](../scripts/generate-sitemap.mjs). With
   Supabase env vars available it adds published project URLs; otherwise it
   keeps static `/` and `/cv` entries and warns.
3. Bundle with `vite build` into `dist/`.

`dist/` is gitignored but a built copy is present in the working tree. It
contains hashed JS/CSS, the generated `manifest.webmanifest`, service worker
`sw.js` plus Workbox files, icons, screenshots, fonts, `robots.txt`,
`sitemap.xml`, and a Google verification HTML file.

Serve a local production build with `npm run preview` (`vite preview`).

## Configuration present in the repo

- [`vercel.json`](../vercel.json) declares a single SPA rewrite: extensionless
  paths are rewritten to `/`, so client-side routes such as `/project/:slug`
  resolve to the Vite entry document.
- [`index.html`](../index.html) supplies canonical URL, language alternates,
  Open Graph / Twitter metadata, theme color, and a CSP meta tag.
- [`vite.config.js`](../vite.config.js) generates the PWA manifest and service
  worker; precache patterns cover the entry chunks, CSS, fonts, icons, and
  manifest. `registerType: 'prompt'` leaves updates to the UI in
  `PWAUpdateToast.tsx`.
- Required runtime env vars are `VITE_SUPABASE_URL` and
  `VITE_SUPABASE_ANON_KEY`; without them `src/supabase.ts` throws. See
  [configuration](./configuration.md) for optional vars.
- The README lists `https://omar-el-khouly.vercel.app` as the live site; the
  same URL is the canonical/default sitemap URL and the target of the committed
  Lighthouse reports. No deployment log or verification output beyond those
  reports is committed.

## Database prerequisites

The README points to
[`dev/sqls/001_full_schema.sql`](../dev/sqls/001_full_schema.sql) and
[`dev/sqls/README.md`](../dev/sqls/README.md) for tables, RLS, and storage
buckets; it also describes creating an admin user and inserting a row into
`profiles` with role `admin`. The dashboard will not be reachable without that
setup.

## What is not configured

- No CI/CD workflow, GitHub Action, or deploy script is committed.
- No Docker, server, or alternative host configuration is present; the only
  platform config in the repo is the Vercel rewrite.
- No environment template for production beyond `.env.example`; values must be
  injected into the build/runtime environment by the host.
- No custom cache invalidation or rollout strategy is committed. Workbox
  runtime rules are defined in `vite.config.js` (30-day `asset-cache` for
  `/assets/*`, 1-day `NetworkFirst` `supabase-cache` for the configured
  Supabase host).
- No post-deploy smoke test or automated audit command is wired into build or
  deployment. `npm run perf:audit` is a separate, URL-driven command.

## Sources

- [`package.json`](../package.json), [`vite.config.js`](../vite.config.js), [`vercel.json`](../vercel.json), [`index.html`](../index.html), [`.gitignore`](../.gitignore)
- [`scripts/generate-sitemap.mjs`](../scripts/generate-sitemap.mjs), [`src/supabase.ts`](../src/supabase.ts), [`src/components/PWAUpdateToast.tsx`](../src/components/PWAUpdateToast.tsx)
- [`README.md`](../README.md), [`dev/sqls/README.md`](../dev/sqls/README.md), [`lighthouse-report.json`](../lighthouse-report.json), [`dev/lighthouse/page-loaded.json`](../dev/lighthouse/page-loaded.json)
