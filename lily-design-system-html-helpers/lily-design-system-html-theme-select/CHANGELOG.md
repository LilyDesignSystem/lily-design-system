# Changelog — `<theme-select>` (HTML helper)

The format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

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

Initial release. Ported from the Svelte canonical
`lily-design-system-svelte-theme-select`. The DOM contract,
behaviour, and acceptance criteria match the canonical clause-for-
clause.

### Added

- `<theme-select>` custom element extending `HTMLElement`.
- Side-effectful registration in `index.ts`, guarded by
  `customElements.get("theme-select")` for idempotence.
- Required attributes: `label`, `themes-url`, `themes` (CSV).
- Optional attributes: `value`, `default-value`, `storage-key`,
  `name`, `extension`, `theme-labels` (JSON), `class`.
- Mirroring JS properties for every observed attribute.
- `el.themes`: `string[]` getter / setter — CSV-encoded in the
  attribute.
- `el.themeLabels`: `Record<string, string>` getter / setter —
  JSON-encoded in the attribute.
- `el.target`: `HTMLElement | null` — JS-only (no attribute form).
- `themechange` `CustomEvent` (`bubbles: true, composed: true`)
  with `detail: { theme: string }`.
- Pure exports: `normalizeThemesUrl`, `themeHref`.
- Type exports: `ThemeSelectProps`, `ThemeSelectChangeDetail`.
- 13 acceptance criteria in `spec/index.md` §7; one vitest test per
  clause in `theme-select.test.ts`.

### Conventions

- Light DOM rendering — no Shadow DOM.
- One managed `<link rel="stylesheet" data-lily-theme-select="{name}">`
  per select; reused across theme changes, garbage-collected when
  no select with the same `name` remains in the document.
- `data-theme="{slug}"` on `el.target ?? document.documentElement`
  on every successful apply.
- `localStorage` persistence opt-in via `storage-key`;
  read/write errors silently swallowed.
- Initial value resolves from
  `value > localStorage > default-value > "light" > themes[0]`.

### Spelling note

The HTML catalog uses `normalizeThemesUrl` (American `z`) to match
DOM-API convention. The Svelte canonical uses `normaliseThemesUrl`
(British `s`). Consumers porting between frameworks rename the
import.

### Subclassing for custom rendering

Custom rendering happens by extending the `ThemeSelect` class and
overriding `connectedCallback` / `attributeChangedCallback` (private
methods cannot be overridden). The base class keeps owning the
lifecycle (managed `<link>`, `data-theme` write, `themechange`
event). See `docs/custom-rendering.md`.

[Unreleased]: https://github.com/lilydesignsystem/lily-design-system
[0.1.0]: https://github.com/lilydesignsystem/lily-design-system
