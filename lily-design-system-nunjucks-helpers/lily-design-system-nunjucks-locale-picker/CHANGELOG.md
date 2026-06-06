# Changelog — LocalePicker (Nunjucks)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## 0.1.0 — 2026-06-05

Initial release.

### Added

- `locale-picker.njk` — Nunjucks 3 macro emitting a
  `<fieldset role="radiogroup">` with one `<input type="radio">`
  per locale code. Single `opts` parameter; required keys are
  `label` and `locales`. Renders deterministic markup with
  `data-lily-locale-picker-*` configuration attributes for the
  client.js to read. Each option `<label>` carries `lang="{tag}"`
  for WCAG 3.1.2 (Language of Parts).
- `locale-picker.client.js` — vanilla ES module owning the runtime
  lifecycle:
  - `initLocalePicker(root, opts)` — wires one fieldset; returns a
    `{setLocale, destroy}` controller.
  - `autoInit(opts)` — finds every
    `[data-lily-locale-picker-root]` on the page and wires it.
  - `bcp47LocaleTag(code)` — pure helper, normalises `_` → `-`.
  - `isRtlLocale(code)` — pure helper, RTL script + language
    detection.
  - `localeName(code)` — pure helper, English name lookup.
  - `matchNavigatorLanguage(navLangs, locales)` — pure helper,
    two-step exact-then-prefix match.
  - Sets `lang="{tag}"` (BCP 47 hyphen form) and (by default)
    `dir="rtl|ltr"` on the resolved target element (defaults to
    `document.documentElement`).
  - Optional `storageKey` persistence to `localStorage` with
    private-mode-safe try/catch.
  - Optional `detectFromNavigator` falls back to
    `navigator.languages` on a fresh mount with no stored value.
  - `onChange(code)` callback for post-apply side effects.
- `locale-picker.test.ts` — vitest suite asserting every numbered
  acceptance criterion in `spec.md` §7.
- `spec.md` — spec-driven contract, version 0.1.0.
- `locales.ts` / `locales.tsv` — built-in locale code → English-name
  table and RTL sets (436-row table; verbatim copy of the Svelte
  canonical).
- `AGENTS/` subdirectory with `api.md`, `lifecycle.md`,
  `accessibility.md`, `ssr.md`, `testing.md`.
- `docs/` subdirectory with topic guides:
  - `accessibility.md`
  - `bcp47.md`
  - `concepts.md`
  - `i18n-integration.md`
  - `rtl.md`
  - `ssr.md`
- `examples/` subdirectory:
  - `01-radios.njk`
  - `02-select.njk`
  - `03-buttons.njk`
  - `04-rtl-demo.njk`
  - `05-nhs-style.njk`
  - `06-with-eleventy-i18n.njk`
  - `07-with-intl.njk`
  - `08-ssr-cookie.njk`
  - `09-scoped-target.njk`
  - `10-combobox.njk`
  - `localePickerCustom.njk` — helper fork that delegates the
    per-option body to a `{% call %}` block, used by examples
    02, 03, 05, and 10.
  - `README.md` — examples index.

### Conventions

- Nunjucks 3 macro syntax with a single `opts` parameter object.
- camelCase macro name (`localePicker`); kebab-case file path
  (`locale-picker.njk`) and CSS class (`locale-picker`).
- Companion ES-module runtime, framework-agnostic.
- Zero runtime dependencies beyond `nunjucks` server-side and DOM
  APIs client-side.
- SSR-safe: the macro is pure; the client.js guards every DOM
  access behind `typeof document !== "undefined"`.
- Tested under vitest + jsdom; macro rendered via
  `nunjucks.renderString`.

### Parity

This is a direct port of the Svelte canonical
`lily-design-system-svelte-locale-picker` v0.1.0. The DOM
contract, initial-value resolution, BCP 47 normalisation, RTL
detection, navigator matching, and apply order match clause-for-
clause.

### Notes

- The `onChange` callback prop from the Svelte canonical maps to
  the `onChange` field on the client.js init opts.
- The Svelte canonical's `children` snippet (and the Vue port's
  default scoped slot) maps to the Nunjucks `{% call %}` caller
  block. The shipped macro does not currently inspect `caller`;
  see [`examples/localePickerCustom.njk`](./examples/localePickerCustom.njk)
  for the fork pattern.
- The 436-row `locales.tsv` is the canonical source. The
  `locales.ts` file is generated from it; both are kept in lock-
  step with the Svelte canonical.
