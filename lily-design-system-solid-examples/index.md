# Lily Design System™ Solid examples

A Solid 2.0 web app showing every component of the [Lily Design System](../index.md) catalog with real styling: the
NHS UK visual reference by default, switchable to any of the reference themes from the header.

- `/` — the home page.
- `/components` — the full catalog, searchable by name, slug or description, and filterable by category and suffix
  pattern.
- `/components/{slug}` — one page per component: a live demo, its markup, more examples where there are any, the
  catalog details, a usage example and the import line.

The header's theme, language and text size pickers are the published Solid helpers
[`@lilydesignsystem/solid-theme-picker`](../lily-design-system-solid-theme-picker/),
[`@lilydesignsystem/solid-locale-picker`](../lily-design-system-solid-locale-picker/) and
[`@lilydesignsystem/solid-text-size-picker`](../lily-design-system-solid-text-size-picker/); the skip link is
`SkipLink` from [`@lilydesignsystem/solid-headless`](../lily-design-system-solid-headless/).

## Run it

```sh
pnpm install
pnpm dev          # http://localhost:5173
pnpm build        # dist/, a single-page app
pnpm preview      # serves dist/ with the fallback to index.html every route needs
pnpm test:e2e     # Playwright: the catalog search, axe and the responsive sweep
```

It is a single-page app on [Solid Router](https://github.com/solidjs/solid-router) 2.0 and Solid's Vite plugin
(SolidStart is retired for Solid 2.0). A static host must answer every route with `index.html`.

## Where things come from

- The catalog, the demo markup and the usage examples are generated: `src/data/components.ts` and
  `src/data/component-demos.ts` by `bin/generate-registries`, `src/data/component-examples.ts` by
  `bin/generate-examples`. Never edit them by hand.
- `public/themes/` is a copy of the repository's `themes/`, made by `bin/sync`.
- Usage examples are the React ones with `className` and `htmlFor` as `class` and `for`; one that uses a React-only API
  falls back to the demo's own markup.

Spec: [spec/index.md](spec/index.md). Agents: [AGENTS.md](AGENTS.md).

---

Lily™ and Lily Design System™ are trademarks.
