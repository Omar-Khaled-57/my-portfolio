# My Portfolio changelog

## Release-note pointer

No `CHANGELOG.md`, release notes, or tagged version file is committed in this
project. [`package.json`](../package.json) declares version `0.0.0` and marks
the package private. [`README.md`](../README.md) is a product/setup overview,
not a release log.

Dated work logs and plans do exist under [`dev/`](../dev/): see
[`dev/performance-enhancement.md`](../dev/performance-enhancement.md),
[`dev/performance-consistency.md`](../dev/performance-consistency.md), and the
`PLAN-*.md` files indexed in [the docs index](./README.md). They describe
intended or completed work, not a curated release history.

## Release-history summary

The only version history available in the repo is the local git log. Recent
commit subjects include `feat(projects): support curated short URL slugs with
title-slug fallback`, `perf(mobile): paint hero role text statically at reveal
and defer lottie until LCP settles`, `fix: refine browser and maskable icons`,
and PWA/SEO work such as `feat(pwa-c): install button, update toast, pwa meta +
fix lcp regression`. These are commit subjects, not semantic releases; no
versions, dates, or release artifacts are inferred from them.

Feature evidence for the current state is in [`src/App.tsx`](../src/App.tsx),
[`src/Pages/`](../src/Pages/), [`vite.config.js`](../vite.config.js), and
[product](./product.md).

## Sources

- [`package.json`](../package.json)
- [`README.md`](../README.md)
- [`dev/`](../dev/) markdown notes
- Local git history in the `my-portfolio/` repository
