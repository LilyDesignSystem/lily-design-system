# Changelog — ThemeSelect (Angular)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## Unreleased

### Added

- `placeholder` input (optional, `string`). Sets the text of the new
  leading placeholder option. Defaults to the `label` value, so the
  package still emits no hardcoded user-facing string.
- `.theme-select-placeholder` class hook on the placeholder option, and
  a width recipe (`field-sizing: content` + `max-width`) in
  `docs/styling.md`. The package still ships zero CSS.

### Changed (BREAKING — DOM contract)

- The `<select>` now renders a leading
  `<option class="theme-select-option theme-select-placeholder" value="" selected>`
  before the theme options. **Option count is one greater than
  `themes.length`**, and the first option's `value` is `""`. Consumers
  asserting on option count or index will need to account for it.
- **The `<select>`'s own `value` no longer tracks the selection.** It
  stays pinned to the placeholder, so the closed control always reads
  the placeholder word rather than the active theme name — keeping the
  control as narrow as that word instead of as wide as the longest
  theme name. No real option carries a `selected` binding any more.
  Read the active theme from `[(value)]` or the `themeChange` output;
  reading `selectElement.value` now always yields `""`.
- Accessibility tradeoff, documented in `docs/accessibility.md`: the
  closed control no longer announces the active theme to screen-reader
  users. Consumers who need that should surface the active selection
  in visible text or a polite live region.

Downstream behaviour is otherwise unchanged: the managed `<link>`
swap, `data-theme` application, `localStorage` persistence,
`themeChange`, and initial-value resolution all behave exactly as
before, and `value` remains the two-way bindable source of truth.

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

Initial release.

### Added

- `theme-select.component.ts` — Angular 20 standalone component.
  Implements the full Svelte canonical contract:
  - Renders `<select class="theme-select …" [attr.aria-label]="…"
    [name]="…">` with one `<option class="theme-select-option">`
    per theme slug.
  - Manages a single `<link rel="stylesheet"
    data-lily-theme-select="{name}">` in `document.head` and swaps
    its `href` on each apply.
  - Sets `data-theme="{slug}"` on the resolved target element
    (defaults to `document.documentElement`).
  - Optional `storageKey` persistence to `localStorage` with
    private-mode-safe try/catch.
  - Two-way binding via `[(value)]` (model signal).
  - `themeChange` output for post-apply side effects.
  - `className` input for the consumer's CSS hook on the root
    `<select>`.
- `index.ts` barrel re-exporting `ThemeSelect`, `normaliseThemesUrl`,
  `themeHref`.
- `theme-select.component.spec.ts` — vitest suite asserting every
  numbered acceptance criterion in `spec/index.md` §7 (13 items + extras).
- `spec/index.md` — spec-driven contract, version 0.1.0.
- `AGENTS/` subdirectory with `api.md`, `lifecycle.md`,
  `accessibility.md`, `testing.md`, `ssr.md`.
- `docs/` subdirectory with topic guides: `accessibility.md`,
  `custom-rendering.md`, `preloading.md`, `props-reference.md`,
  `recipes.md`, `ssr.md` (Analog notes), `styling.md`,
  `troubleshooting.md`.
- `examples/` subdirectory: `basic.component.ts`,
  `custom-labels.component.ts`, `custom-rendering.component.ts`,
  `lily-themes.component.ts`, `multiple-selects.component.ts`,
  `persistence.component.ts`, `preloaded.component.ts`,
  `system-preference.component.ts`, `two-way-binding.component.ts`,
  plus `analog-cookie/` with `app.component.ts`,
  `app.config.server.ts`, `tokens/initial-theme.ts`,
  `server/middleware/theme.ts`, `server/routes/api/theme.post.ts`.

### Conventions

- Angular 20 standalone component, `OnPush`, `@for` control flow.
- Signal inputs (`input<T>()`, `input.required<T>()`), model signal
  for `value`, signal output for `themeChange`.
- Template-inline only (no `templateUrl`, `styles`, `styleUrls`).
- Template-cast pattern: `$any($event.target).value`.
- Zero runtime dependencies beyond `@angular/core` and
  `@angular/common`.
- SSR-safe: all DOM writes inside `effect()` and guarded by
  `typeof document !== "undefined"`.
- Tested under vitest + jsdom + `@angular/core/testing` `TestBed`.

### Parity

This is a direct port of the Svelte canonical
`lily-design-system-svelte-theme-select` v0.1.0. The DOM contract,
managed-link discriminator, initial-value resolution, and apply
order match clause-for-clause.

### Notes

- The `onChange` callback prop from the Svelte canonical maps to
  the `themeChange` Angular output. Use `(themeChange)="..."` in
  templates.
- The `children` snippet from Svelte does not yet have an Angular
  equivalent — content projection via `<ng-content>` and
  `@ContentChild(TemplateRef)` is planned. See
  `docs/custom-rendering.md`.
- The `class` consumer hook from Svelte maps to the `className`
  input in Angular (Angular has no implicit attribute
  fall-through).

[Unreleased]: https://github.com/lilydesignsystem/lily-design-system
[0.1.0]: https://github.com/lilydesignsystem/lily-design-system
