# Solid examples — specification

`lily-design-system-solid-examples` (2026-11-18, tasks.md P36-T4): the Solid 2.0 example app.

## Requirements

1. The three routes [AGENTS/examples.md](../AGENTS/examples.md) requires: `/`, `/components` and `/components/{slug}`.
2. `/components` lists all catalog components, searchable by name, slug and description and filterable by category and
   suffix pattern, with a polite status line, "N of M components".
3. `/components/{slug}` shows the live demo, its markup, the curated extra examples with their markup, the catalog
   details, a real usage example and the import line; an unknown slug shows the not-found page.
4. A skip link is the first focusable element; the page has header, main and footer landmarks.
5. The theme is applied before first paint (a script in `index.html` creates the managed theme `<link>`), and the theme
   picker adopts it.
6. No horizontal overflow at 375, 768, 1280 and 2560 pixels wide; no axe WCAG 2.2 AA violations on the routes sampled.

## Decisions

- **Solid Router 2.0, not SolidStart.** SolidStart is retired for Solid 2.0; the app is a Vite single-page app with
  `createRouter`. A static host needs the fallback to `index.html`.
- **The published packages.** The app depends on `@lilydesignsystem/solid-headless` and the Solid pickers from npm, as an
  adopter would, not on the monorepo's sources.
- **No mirror of the headless components.** The demos are the catalog's HTML strings, the same in every example app, so
  the app needs no copy of the components (`bin/sync-example-components` has no Solid pair).
- **Composed pages are not ported yet.** The React app's fourteen composed pages (dashboard, contact form and the rest)
  are encouraged, not required; they are later work.

## Verify

`pnpm exec tsc --noEmit`, `pnpm build`, `pnpm test:e2e` (Chromium runs every spec; Firefox and WebKit the axe baseline
and the responsive sweep), and `bin/test`.

---

Lily™ and Lily Design System™ are trademarks.
