# AGENTS — Lily HTML Helpers

Catalog and conventions: [index.md](./index.md).

Each sibling directory is a self-contained helper, packaged as a
vanilla HTML/JS **web component** (custom element). Find the
helper's `spec.md` for the canonical contract before changing it.
Each helper follows the file shape in
[index.md § Conventions](./index.md#conventions).

## Helpers currently in the catalog

- [`lily-design-system-html-theme-select`](./lily-design-system-html-theme-select/) — `<theme-select>` dynamic theme CSS loader.
- [`lily-design-system-html-locale-select`](./lily-design-system-html-locale-select/) — `<locale-select>` `lang` + `dir` locale select.
- [`lily-design-system-html-text-size-select`](./lily-design-system-html-text-size-select/) — `<text-size-select>` `data-text-size` text-size select.

## Working rules

- Treat each helper's `spec.md` as the single source of truth.
- The custom-element class is defined on import (side-effectful
  registration via `customElements.define(...)`). The class itself
  remains exported so consumers who want to control registration
  themselves can import it without the auto-define — see each
  helper's spec.md §3 (Architectural decisions) for the exact
  rule.
- Tests use vitest + jsdom.
- No hardcoded user-facing strings; everything comes from
  attributes or properties.
- Light DOM only — no Shadow DOM, no scoped styling. The
  consumer's CSS targets the rendered children directly via the
  kebab-case class hooks the element emits (`theme-select-option`,
  `locale-select-option`, etc.).
- Attributes are kebab-case; observed attributes trigger
  `attributeChangedCallback`. Array attributes are
  comma-separated strings; the matching JS property accepts an
  `Array<string>` for ergonomic programmatic use. Object
  attributes are JSON-encoded; the JS property accepts a native
  `Record<string, string>`.
- Change notifications fire as `CustomEvent`s with `bubbles: true`
  and `composed: true`.

## Topic agent files

- [`AGENTS/conventions.md`](./AGENTS/conventions.md) — custom-element
  shape, attribute/property mirroring, CustomEvent contract, light
  DOM, naming.
- [`AGENTS/testing.md`](./AGENTS/testing.md) — vitest + jsdom harness,
  attribute timing, CustomEvent capture, mocking.
- [`AGENTS/accessibility.md`](./AGENTS/accessibility.md) — WCAG 2.2 AAA,
  native `<select>` (combobox) semantics, light-DOM rationale.
- [`AGENTS/ssr.md`](./AGENTS/ssr.md) — Eleventy / Astro / Hugo
  prerender + client upgrade.
- [`AGENTS/shared/`](./AGENTS/shared/) — Lily-wide headless / i18n /
  theme principles adapted for this catalog.
