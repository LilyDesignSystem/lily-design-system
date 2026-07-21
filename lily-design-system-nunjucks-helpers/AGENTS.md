# AGENTS — Lily Nunjucks Helpers

Catalog and conventions: [index.md](./index.md).

Each sibling directory is a self-contained helper. Find the helper's
`spec/index.md` for the canonical contract before changing it. Each helper
follows the file shape in [index.md § Conventions](./index.md#conventions).

## Helpers currently in the catalog

- [`lily-design-system-nunjucks-theme-chooser`](./lily-design-system-nunjucks-theme-chooser/) — dynamic theme CSS loader.
- [`lily-design-system-nunjucks-locale-chooser`](./lily-design-system-nunjucks-locale-chooser/) — `lang` + `dir` locale chooser.
- [`lily-design-system-nunjucks-text-size-chooser`](./lily-design-system-nunjucks-text-size-chooser/) — `data-text-size` text-size chooser.
- [`lily-design-system-nunjucks-share-chooser`](./lily-design-system-nunjucks-share-chooser/) — native share sheet / destination list + copy. Owns an **action**, not a preference: applies nothing to the document, persists nothing. Note the documented `href`-is-a-string deviation in its `spec/index.md` §3.3 — a Nunjucks macro cannot call an arbitrary JS function.

## Working rules

- Treat each helper's `spec/index.md` as the single source of truth.
- Match the upstream Nunjucks conventions in
  [`../lily-design-system-nunjucks-headless/AGENTS/nunjucks.md`](../lily-design-system-nunjucks-headless/AGENTS/nunjucks.md)
  where they apply (camelCase macro names, kebab-case file paths and
  CSS classes, single `opts` / `params` object, no inline `<style>` /
  `<script>`).
- Each helper is a **macro + client.js pair**:
  - The macro renders markup with `data-lily-*` hooks.
  - The companion `*.client.js` ES module reads those hooks at runtime
    and owns persistence, dynamic CSS loading, and attribute
    application.
- Tests use vitest + jsdom. The macro is rendered via
  `nunjucks.renderString`; the client.js is exercised against a jsdom
  document.
- No hardcoded user-facing strings; everything comes from `opts`.
