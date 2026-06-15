# Changelog — LocaleSelect (Svelte)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## 0.1.0 — 2026-06-05

Initial release. This is the **canonical reference implementation**
for Lily's locale picker; the Vue, React, Angular, Blazor, Nunjucks,
and HTML ports port from this contract clause-for-clause.

### Added

- `LocaleSelect.svelte` — Svelte 5 component using runes throughout
  (`$props`, `$bindable`, `$effect`). Implements:
  - Renders `<fieldset role="radiogroup" aria-label="…">` with one
    `<input type="radio">` per locale code, wrapped in a
    `<label lang="{tagFor(locale)}">` per WCAG 3.1.2 (Language of
    Parts).
  - Sets `lang="{bcp47LocaleTag(code)}"` on the resolved target
    element (defaults to `document.documentElement`).
  - Sets `dir="rtl"` / `dir="ltr"` on the target element via
    `isRtlLocale()` auto-detection. Opt-out via `applyDir={false}`.
  - Optional `storageKey` persistence to `localStorage` with
    private-mode-safe try/catch.
  - Optional `detectFromNavigator` first-visit fallback via
    `navigator.languages`.
  - Two-way binding via `bind:value` on a `$bindable("")` prop.
  - `onChange` callback for post-apply side effects.
  - `children` snippet for custom rendering with
    `{ locales, value, setLocale, name, labelFor, tagFor, isRtl }`.
- `locales.ts` — 436-row built-in locale-code → English-name table
  plus RTL language and script subtag sets.
- `locales.tsv` — canonical source for `locales.ts`.
- `index.ts` barrel re-exporting `default`, `LocaleSelect`,
  `bcp47LocaleTag`, `isRtlLocale`, `localeName`,
  `matchNavigatorLanguage`, `defaultLocaleLabels`,
  `RTL_LANGUAGE_TAGS`, `RTL_SCRIPT_SUBTAGS`, and the `Props` +
  `ChildArgs` types.
- `LocaleSelect.test.ts` — vitest suite asserting every numbered
  acceptance criterion in `spec.md` §7 (23 items).
- `spec.md` — spec-driven contract, version 0.1.0.
- `AGENTS.md` — fast-index pointer for AI agents.
- `AGENTS/` subdirectory with `api.md`, `lifecycle.md`,
  `accessibility.md`, `ssr.md`, `testing.md`.
- `docs/` subdirectory with topic guides: `accessibility.md`,
  `bcp47.md`, `concepts.md`, `i18n-integration.md`, `rtl.md`,
  `ssr.md`.
- `examples/` subdirectory: `01-radios.svelte`, `02-select.svelte`,
  `03-buttons.svelte`, `04-rtl-demo.svelte`,
  `05-nhs-style.svelte`, `06-with-svelte-i18n.svelte`,
  `07-with-paraglide.svelte`, `08-ssr-cookie.svelte`,
  `09-scoped-target.svelte`, `10-combobox.svelte`, plus a
  `README.md` index.

### Conventions

- **Svelte 5 runes** throughout. No legacy `export let`, no `$:`,
  no `createEventDispatcher`.
- **TypeScript** on the public surface. `Props` and `ChildArgs`
  exported from a `<script lang="ts" module>` block.
- **Zero runtime dependencies** beyond `svelte`.
- **SSR-safe** — all DOM writes inside `$effect`.
- **No `<style>` block** — consumer styles the `locale-select`
  class hook.
- **Tested** under vitest + jsdom + `@testing-library/svelte`.

### Notes

- The canonical reference catalog for the framework-helper layer.
  Vue, React, Angular, Blazor, Nunjucks, and HTML ports adopt this
  contract; differences are documented in each port's CHANGELOG.
- The `onChange` callback prop maps to a Vue event, a React
  `onChange` prop, an Angular `(change)` output, etc.
- The `children` snippet maps to a Vue default scoped slot, a React
  `children` render prop, an Angular `*ngTemplateOutlet`-based
  pattern, etc.
- The `locales.ts` / `locales.tsv` files are framework-agnostic and
  are byte-identical across every port.

[Unreleased]: https://github.com/lilydesignsystem/lily-design-system
[0.1.0]: https://github.com/lilydesignsystem/lily-design-system
