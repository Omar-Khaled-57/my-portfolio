# My Portfolio testing

## What the manifest provides

[`package.json`](../package.json) declares these scripts:

| Command | Script | Type of check |
| --- | --- | --- |
| `npm run dev` | `vite` | Manual exploration. |
| `npm run sitemap` | `node scripts/generate-sitemap.mjs` | Generates the sitemap. |
| `npm run build` | `tsc --noEmit && node scripts/generate-sitemap.mjs && vite build` | Typecheck + build. |
| `npm run lint` | `eslint .` | Static linting. |
| `npm run typecheck` | `tsc --noEmit` | TypeScript only. |
| `npm run perf:audit` | `node scripts/perf-audit.mjs` | Lighthouse performance audit of a URL you supply. |
| `npm run preview` | `vite preview` | Serve the production build. |

**There is no `test` script**, no test-runner dependency, and no `*.test.*`,
`*.spec.*`, `__tests__/`, or `e2e/` file in the tracked tree. No coverage report
is committed.

## The `perf:audit` script

[`scripts/perf-audit.mjs`](../scripts/perf-audit.mjs) is a Lighthouse runner,
not a test suite. Its usage line is:

```text
perf-audit <url> [--runs N] [--preset mobile|desktop] [--max-spread N]
```

With npm, pass arguments after `--`, for example:

```bash
npm run perf:audit -- https://omar-el-khouly.vercel.app --runs 5 --preset mobile --max-spread 3
```

Defaults in the script: 5 runs, `mobile` preset, maximum score spread of 3
points. It launches Chrome (via `CHROME_PATH` or by searching Puppeteer /
Playwright caches), runs Lighthouse once per pass with only the performance
category, and records score, FCP, LCP, TBT, CLS, and SI. The console output
shows per-run values plus min, median, max, and spread for each metric; the
process exits `0` when score spread ≤ `--max-spread` and `1` otherwise. It does
not write a report file and does not read the committed JSON reports.

## Committed Lighthouse snapshots

Two Lighthouse JSON reports are committed. The values below are transcribed
from those files; they are point-in-time observations of the live URL, not
results produced by `perf:audit` during documentation work, and they should not
be read as current scores.

| Report | Report version | Fetch time (UTC) | Preset | Scores (perf / a11y / best-practices / SEO) |
| --- | --- | --- | --- | --- |
| [`lighthouse-report.json`](../lighthouse-report.json) | 12.8.2 | 2026-05-17T18:13:31.126Z | desktop | 0.87 / 1 / 1 / 1 |
| [`dev/lighthouse/page-loaded.json`](../dev/lighthouse/page-loaded.json) | 13.0.2 | 2026-05-18T12:16:30.682Z | mobile | 0.88 / 1 / 1 / 1 |

Both requested `https://omar-el-khouly.vercel.app/` and recorded no run
warnings. Displayed core metrics in those snapshots:

| Report | FCP | LCP | TBT | CLS | Speed index |
| --- | --- | --- | --- | --- | --- |
| `lighthouse-report.json` | 1.0 s | 1.9 s | 0 ms | 0 | 1.8 s |
| `dev/lighthouse/page-loaded.json` | 2.9 s | 2.9 s | 20 ms | 0.001 | 4.1 s |

There is no committed history of `perf:audit` runs and no assertion that these
snapshots meet a target. The `dev/` performance plans describe intended work;
they are not test results.

## Manual checks grounded in the source

- Run `npm run build` to verify type-checking, sitemap generation, and bundling.
- Run `npm run lint` for ESLint findings (config in
  [`eslint.config.js`](../eslint.config.js)).
- In the browser: check both languages and themes, admin login + `/dashboard`
  gating, project routes `/project/:slug`, `/cv`, the 404 page, comment
  submission/polling, and PWA install/update prompts.
- Serve the build with `npm run preview` and inspect `dist/manifest.webmanifest`
  and `dist/sitemap.xml` for generated output.

## Gaps

- No unit, component, integration, or end-to-end tests.
- No CI workflow runs lint, typecheck, build, or audits.
- No automated accessibility assertions; the accessibility scores above come
  only from the two committed Lighthouse snapshots.
- No test coverage numbers exist.

## Sources

- [`package.json`](../package.json), [`eslint.config.js`](../eslint.config.js)
- [`scripts/perf-audit.mjs`](../scripts/perf-audit.mjs), [`lighthouse-report.json`](../lighthouse-report.json), [`dev/lighthouse/page-loaded.json`](../dev/lighthouse/page-loaded.json)
- [`src/App.tsx`](../src/App.tsx), [`src/components/ProtectedRoute.tsx`](../src/components/ProtectedRoute.tsx), [`src/components/Commentar.tsx`](../src/components/Commentar.tsx)
