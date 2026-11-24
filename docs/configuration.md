# My Portfolio configuration

## Environment variables

Variable names come from [`.env.example`](../.env.example),
[`src/supabase.ts`](../src/supabase.ts), and the scripts under
[`scripts/`](../scripts/). A local `.env` exists in the working tree and is
gitignored; only the example file is tracked.

| Variable | Read in | Default | Purpose |
| --- | --- | --- | --- |
| `VITE_SUPABASE_URL` | `src/supabase.ts`, `scripts/generate-sitemap.mjs` | none | Supabase project URL; required at app startup. Vite exposes `VITE_*` values to the browser. |
| `VITE_SUPABASE_ANON_KEY` | `src/supabase.ts`, `scripts/generate-sitemap.mjs` | none | Supabase anonymous key; required at app startup. |
| `DATABASE_URL` | listed in `.env.example` only | none | Direct PostgreSQL connection for server-side / CLI tools; not read by the browser app. |
| `SITE_URL` | `scripts/generate-sitemap.mjs` | `https://omar-el-khouly.vercel.app` | Base URL for generated sitemap entries. |
| `CHROME_PATH` | `scripts/perf-audit.mjs`, `scripts/generate-screenshots.mjs` | none | Optional explicit Chrome/Chromium binary path; the audit script also searches Puppeteer/Playwright caches. |
| `URL` | `scripts/generate-screenshots.mjs` | `http://localhost:4173/` | Preview URL for screenshot generation only. |

[`src/vite-env.d.ts`](../src/vite-env.d.ts) declares the two `VITE_SUPABASE_*`
variables for TypeScript. No other `import.meta.env` reads exist in `src/`.

## Config files

| File | What it sets |
| --- | --- |
| [`vite.config.js`](../vite.config.js) | React + VitePWA plugins, generated web manifest, Workbox precache/runtime caches, HTML render-block optimizer, manual chunks, sourcemaps. |
| [`vercel.json`](../vercel.json) | One SPA rewrite: extensionless paths → `/`. |
| [`tsconfig.json`](../tsconfig.json) | Strict TypeScript, `noEmit`, bundler resolution, Vite + PWA client types, `src` only. |
| [`tailwind.config.js`](../tailwind.config.js) | Content globs and an extended `backdropBlur.sm` value; no plugins. |
| [`postcss.config.js`](../postcss.config.js) | Tailwind and autoprefixer plugins. |
| [`eslint.config.js`](../eslint.config.js) | ESLint 9 flat config with TypeScript, React, hooks, and refresh plugins. |
| [`index.html`](../index.html) | Title/description, canonical and hreflang tags, Open Graph/Twitter tags, theme color, and a `Content-Security-Policy` meta tag. |
| [`.npmrc`](../.npmrc) | `legacy-peer-deps=true`. |
| [`.gitignore`](../.gitignore) | Ignores `dist/`, `node_modules`, `*.env`, and most of `dev/` (except `dev/sqls/` and `dev/tech-tools.md`). |
| [`src/index.css`](../src/index.css) | Theme CSS variables and Tailwind layers; canonical palette source for [visual identity](./visual-identity.md). |

The generated PWA manifest is not hand-edited: its name, icons, shortcuts,
screenshots, colors, and display modes are declared in `vite.config.js` and
emitted into `dist/manifest.webmanifest` at build time.

## Local storage keys and user settings

| Key | Reader / writer | Meaning |
| --- | --- | --- |
| `portfolio-theme` | `src/context/ThemeContext.tsx` | Explicit `'dark'` / `'light'` choice; otherwise the OS `prefers-color-scheme` is followed until the user chooses. |
| `portfolio-language` | `src/i18n.tsx` | Stored language selection (`en` / `ar`). |
| `projects` | `DataContext.tsx`, `Pages/About.tsx`, `components/ProjectDetail.tsx` | Cached published projects from Supabase. |
| `certificates` | `DataContext.tsx`, `Pages/About.tsx` | Cached certificates. |
| `tech_tools` | `DataContext.tsx` | Cached tech tools. |
| `app_settings` | `DataContext.tsx` | Cached map of `app_settings` rows. |
| `personalInfo_socialLinks` | `DataContext.tsx`, `CVModal.tsx` | Cached social links array. |
| `personalInfo_email`, `personalInfo_totalProjects`, `personalInfo_yearsExperience`, `personalInfo_showYearsExperience`, `personalInfo_profileImage`, `personalInfo_fullName`, `personalInfo_fullNameAr`, `personalInfo_quote`, `personalInfo_quoteAr` | `DataContext.tsx`, `Pages/About.tsx`, `Pages/Contact.tsx` | Individual settings mirrored from Supabase or edited in the dashboard. |
| `emails_frozen`, `comments_frozen` | `DataContext.tsx`, public/dashboard pages | Freeze switches stored as strings in `app_settings`. |

The full settings key list is the `SETTINGS_KEYS` constant in
[`DataContext.tsx`](../src/context/DataContext.tsx). The dashboard personal-info
editor uses a `personalInfo_` prefix constant in
[`src/Pages/dashboard/PersonalInfo.tsx`](../src/Pages/dashboard/PersonalInfo.tsx).

## External hardcoded values (not env vars)

- `src/supabase.ts` receives the Supabase URL from env, but
  [`index.html`](../index.html) contains a hardcoded Supabase host in a
  `preconnect` link and [`vite.config.js`](../vite.config.js) hardcodes the same
  host in Workbox's `NetworkFirst` rule. Keep these in sync when changing
  projects.
- `index.html` hardcodes the live URL in canonical, hreflang, OG/Twitter tags;
  `scripts/generate-sitemap.mjs` uses the same URL as its `SITE_URL` default.
- `Pages/Contact.tsx` posts to `https://formsubmit.co/${email}`, where the email
  comes from settings with a fallback literal in the source.

## Security notes

- `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are bundled into client
  JavaScript by Vite. The anon key is intended to be public; protect data with
  Supabase Row Level Security. [`dev/sqls/004_harden_profiles_rls.sql`](../dev/sqls/004_harden_profiles_rls.sql)
  is part of the committed migration set.
- `DATABASE_URL` would carry database credentials; keep it server-side/CLI only
  and never commit it. `.env` is gitignored; `.env.example` contains only
  placeholders.
- Do not commit real Supabase keys, database passwords, or other credentials
  in `dev/` notes or source. Most of `dev/` is excluded by `.gitignore` (with
  exceptions for `dev/sqls/` and `dev/tech-tools.md`).
- Admin actions are gated in the client by `Profiles.role === 'admin'`; the
  Supabase tables and buckets must enforce their own access rules for
  untrusted visitors.
- The CSP in `index.html` allows inline scripts/styles and `'unsafe-eval'`;
  review it before tightening deployment security.

## Sources

- [`.env.example`](../.env.example), [`src/vite-env.d.ts`](../src/vite-env.d.ts), [`src/supabase.ts`](../src/supabase.ts)
- [`src/context/DataContext.tsx`](../src/context/DataContext.tsx), [`src/context/ThemeContext.tsx`](../src/context/ThemeContext.tsx), [`src/i18n.tsx`](../src/i18n.tsx), [`src/Pages/dashboard/PersonalInfo.tsx`](../src/Pages/dashboard/PersonalInfo.tsx)
- [`scripts/generate-sitemap.mjs`](../scripts/generate-sitemap.mjs), [`scripts/perf-audit.mjs`](../scripts/perf-audit.mjs), [`scripts/generate-screenshots.mjs`](../scripts/generate-screenshots.mjs)
- [`vite.config.js`](../vite.config.js), [`vercel.json`](../vercel.json), [`index.html`](../index.html), [`.gitignore`](../.gitignore), [`.npmrc`](../.npmrc), [`dev/sqls/`](../dev/sqls/)
