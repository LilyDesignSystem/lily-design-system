# Changelog — LocaleSelect (Svelte)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## Unreleased

### Changed (BREAKING)

- The closed `<select>` now always displays a placeholder word ("Locale")
  instead of the active locale name, so the control is only ever as wide
  as that word rather than as wide as the longest locale name. A leading
  `<option class="locale-select-option locale-select-placeholder" value="">`
  is always rendered, and the element's own selection snaps back to it
  after every change.
- DOM contract changes accordingly: the option count is now
  `locales.length + 1`, the first option's `value` is `""` and it carries
  no `lang` attribute, and the `<select>` element's own `value` no longer
  tracks the active locale — it stays `""`. Consumers reading
  `selectEl.value` must read the bindable `value` prop instead.
- Accessibility tradeoff: the active locale is no longer announced as the
  combobox value. See [docs/accessibility.md](./docs/accessibility.md)
  for how to surface it separately — this matters more for locale than
  for most controls.

### Added

- `placeholder` prop (optional, string, defaults to `label`) — the text
  of the placeholder option.

### Unchanged

- `value` remains the single source of truth and stays two-way bindable;
  `lang` / `dir` application, `localStorage` persistence,
  `navigator.languages` detection, `onChange`, and initial-value
  resolution all behave exactly as before.
- Per-option `lang` attributes are unchanged on the locale options.
- Still ships zero CSS. The width recipe lives in the root `themes/`
  stylesheets.

## 0.2.0 — 2026-07-03

### Changed (BREAKING)

- Migrated from the radio-group "picker" rendering to a native
  `<select>` (landed in-tree 2026-06-17): the root element is now
  `<select class="locale-select">` with one `<option class="locale-select-option">`
  per choice, replacing the former `<fieldset role="radiogroup">` with
  `<input type="radio">` children. The package was renamed from the
  `*-picker` name to `*-select` accordingly.
- Class-hook contract changed: `locale-select` now names the `<select>` root
  and `locale-select-option` is the only sub-class; the radio/label sub-class
  hooks are gone.
- Keyboard interaction is the native `<select>` contract (Arrow keys,
  Home / End, first-letter typeahead) instead of radio-group cycling.
- Custom rendering (snippet / render prop / slot / template) now renders
  `<option>` elements inside the `<select>`.

### Unchanged

- The behaviour contract: DOM application (`lang` / `dir`), optional
  `localStorage` persistence, SSR safety, and the no-hardcoded-strings
  i18n rule are as in 0.1.0.

## 0.1.0 — 2026-06-05

Initial release. This is the **canonical reference implementation**
for Lily's locale select; the Vue, React, Angular, Blazor, Nunjucks,
and HTML ports port from this contract clause-for-clause.

### Added

- `LocaleSelect.svelte` — Svelte 5 component using runes throughout
  (`$props`, `$bindable`, `$effect`). Implements:
  - Renders `<select aria-label="…" name="…">` with one
    `<option lang="{tagFor(locale)}">` per locale code per WCAG 3.1.2
    (Language of Parts).
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
  acceptance criterion in `spec/index.md` §7 (23 items). The markup-contract
  tests assert a `<select>` with `<option>` children.
- `spec/index.md` — spec-driven contract, version 0.1.0.
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
