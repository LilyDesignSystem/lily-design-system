# Changelog — ThemeSelect (Svelte)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## 0.3.0 — 2026-07-20

### Changed (BREAKING)

- The closed `<select>` now always displays a placeholder word ("Theme")
  instead of the active theme name, so the control is only ever as wide
  as that word rather than as wide as the longest theme name. A leading
  `<option class="theme-select-option theme-select-placeholder" value="">`
  is always rendered, and the element's own selection snaps back to it
  after every change.
- DOM contract changes accordingly: the option count is now
  `themes.length + 1`, the first option's `value` is `""`, and the
  `<select>` element's own `value` no longer tracks the active theme —
  it stays `""`. Consumers reading `selectEl.value` must read the
  bindable `value` prop instead.
- Accessibility tradeoff: the active theme is no longer announced as the
  combobox value. See [docs/accessibility.md](./docs/accessibility.md)
  for how to surface it separately.

### Added

- `placeholder` prop (optional, string, defaults to `label`) — the text
  of the placeholder option.

### Unchanged

- `value` remains the single source of truth and stays two-way bindable;
  link swapping, `data-theme`, `localStorage` persistence, `onChange`,
  and initial-value resolution all behave exactly as before.
- Still ships zero CSS. The width recipe lives in
  [docs/styling.md](./docs/styling.md) and in the root `themes/`
  stylesheets.

### Added (examples & docs)

- The compensating status region is now the **default pattern**, not a
  suggestion: the basic example and the `index.md` quick-start both ship
  a visible `<p class="theme-select-status" aria-live="polite">` showing
  the active theme. `aria-live="polite"` announces mutations only, so it
  stays silent on first paint and speaks on each change.
  `docs/accessibility.md` reframes opting *out* as the deliberate choice
  and keeps an explicit "what this does and does not fix" note — the
  region announces transitions, it does not restore combobox value
  semantics.

## 0.2.0 — 2026-07-03

### Changed (BREAKING)

- Migrated from the radio-group "picker" rendering to a native
  `<select>` (landed in-tree 2026-06-17): the root element is now
  `<select class="theme-select">` with one `<option class="theme-select-option">`
  per choice, replacing the former `<fieldset role="radiogroup">` with
  `<input type="radio">` children. The package was renamed from the
  `*-picker` name to `*-select` accordingly.
- Class-hook contract changed: `theme-select` now names the `<select>` root
  and `theme-select-option` is the only sub-class; the radio/label sub-class
  hooks are gone.
- Keyboard interaction is the native `<select>` contract (Arrow keys,
  Home / End, first-letter typeahead) instead of radio-group cycling.
- Custom rendering (snippet / render prop / slot / template) now renders
  `<option>` elements inside the `<select>`.

### Unchanged

- The behaviour contract: DOM application (`data-theme` + managed `<link>` swap), optional
  `localStorage` persistence, SSR safety, and the no-hardcoded-strings
  i18n rule are as in 0.1.0.

## 0.1.0 — 2026-06-05

Initial release. This is the **canonical reference implementation**
for Lily's theme select; the Vue, React, Angular, Blazor, Nunjucks,
and HTML ports port from this contract clause-for-clause.

### Added

- `ThemeSelect.svelte` — Svelte 5 component using runes throughout
  (`$props`, `$bindable`, `$effect`). Implements:
  - Renders a native `<select aria-label="…" name="…">` with one
    `<option>` per theme slug.
  - Manages a single `<link rel="stylesheet" data-lily-theme-select="{name}">`
    in `document.head` and swaps its `href` on each apply.
  - Sets `data-theme="{slug}"` on the resolved target element
    (defaults to `document.documentElement`).
  - Optional `storageKey` persistence to `localStorage` with
    private-mode-safe try/catch.
  - Two-way binding via `bind:value` on a `$bindable("")` prop.
  - `onChange` callback for post-apply side effects.
  - `children` snippet for custom rendering with
    `{ themes, value, setTheme, name, labelFor }`.
- `index.ts` barrel re-exporting `default`, `ThemeSelect`,
  `normaliseThemesUrl`, `themeHref`, and the `Props` + `ChildArgs`
  types.
- `ThemeSelect.test.ts` — vitest suite asserting every numbered
  acceptance criterion in `spec/index.md` §7 (13 items + extras).
- `ThemeSelect.stories.svelte` — Storybook story for the select.
- `spec/index.md` — spec-driven contract, version 0.1.0.
- `AGENTS.md` — fast-index pointer for AI agents.
- `AGENTS/` subdirectory with `api.md`, `lifecycle.md`,
  `accessibility.md`, `testing.md`, `ssr.md`.
- `docs/` subdirectory with topic guides: `accessibility.md`,
  `custom-rendering.md`, `preloading.md`, `props-reference.md`,
  `recipes.md`, `ssr.md`, `styling.md`, `troubleshooting.md`.
- `examples/` subdirectory: `basic.svelte`, `custom-labels.svelte`,
  `custom-rendering.svelte`, `lily-themes.svelte`,
  `multiple-selects.svelte`, `persistence.svelte`,
  `preloaded.svelte`, `system-preference.svelte`,
  `two-way-binding.svelte`, plus a `sveltekit-cookie/` directory
  with `hooks.server.ts`, `app.html.snippet`, `+layout.server.ts`,
  `+layout.svelte`, `+page.svelte`, `api+server.ts`, `README.md`.

### Conventions

- **Svelte 5 runes** throughout. No legacy `export let`, no `$:`,
  no `createEventDispatcher`.
- **TypeScript** on the public surface. `Props` and `ChildArgs`
  exported from a `<script lang="ts" module>` block.
- **Zero runtime dependencies** beyond `svelte`.
- **SSR-safe** — all DOM writes inside `$effect`.
- **No `<style>` block** — consumer styles the `theme-select` class
  hook.
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

[Unreleased]: https://github.com/lilydesignsystem/lily-design-system
[0.3.0]: https://github.com/lilydesignsystem/lily-design-system
[0.1.0]: https://github.com/lilydesignsystem/lily-design-system
