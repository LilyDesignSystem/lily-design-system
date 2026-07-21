# AGENTS — Lily HTML Helpers

Catalog and conventions: [index.md](./index.md).

Each sibling directory is a self-contained helper, packaged as a
vanilla HTML/JS **web component** (custom element). Find the
helper's `spec/index.md` for the canonical contract before changing it.
Each helper follows the file shape in
[index.md § Conventions](./index.md#conventions).

## Helpers currently in the catalog

- [`lily-design-system-html-theme-select`](./lily-design-system-html-theme-select/) — `<theme-select>` dynamic theme CSS loader.
- [`lily-design-system-html-locale-select`](./lily-design-system-html-locale-select/) — `<locale-select>` `lang` + `dir` locale select.
- [`lily-design-system-html-text-size-select`](./lily-design-system-html-text-size-select/) — `<text-size-select>` `data-text-size` text-size select.
- [`lily-design-system-html-share-button`](./lily-design-system-html-share-button/) — `<share-button>` native-sheet / disclosure share control.

## Working rules

- Treat each helper's `spec/index.md` as the single source of truth.
- The custom-element class is defined on import (side-effectful
  registration via `customElements.define(...)`). The class itself
  remains exported so consumers who want to control registration
  themselves can import it without the auto-define — see each
  helper's spec/index.md §3 (Architectural decisions) for the exact
  rule.
- Tests use vitest + jsdom.
- No hardcoded user-facing strings; everything comes from
  attributes or properties.
- Light DOM only — no Shadow DOM, no scoped styling. The
  consumer's CSS targets the rendered children directly via the
  kebab-case class hooks the element emits (`theme-select-option`,
  `locale-select-option`, etc.).
- One rendering shape for the `*-select` helpers. All three render an
  icon button that opens a `role="listbox"` dropdown (WAI-ARIA APG
  listbox pattern, keyboard implemented in JS). Do not reintroduce the
  native `<select>` — or its `placeholder` attribute — to any of them.
  `<text-size-select>` was the last holdout and joined the other two;
  its glyph is `"A"` (U+0041) rather than a pictograph.
- `<share-button>` is the deliberate exception to that rule: it is a
  **disclosure** whose items are real `<a>` elements with no `role`
  override, and focus moves to the item rather than staying on the
  `<ul>` with `aria-activedescendant`. Share destinations are
  navigation, so a listbox or `role="menuitem"` would strip
  middle-click, open-in-new-tab and copy-link-address. Do not
  "harmonise" it into a listbox. It is also the first helper that owns
  an **action** rather than a user preference: it applies nothing to the
  document and persists nothing.
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
  the APG listbox pattern all three helpers implement, the tradeoffs
  against the native `<select>` they replaced, light-DOM rationale.
- [`AGENTS/ssr.md`](./AGENTS/ssr.md) — Eleventy / Astro / Hugo
  prerender + client upgrade.
- [`AGENTS/shared/`](./AGENTS/shared/) — Lily-wide headless / i18n /
  theme principles adapted for this catalog.
