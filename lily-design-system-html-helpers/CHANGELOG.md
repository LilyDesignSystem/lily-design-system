# Changelog — Lily Design System HTML Helpers

All notable changes to this catalog are documented in this file. The
catalog version mirrors the highest-versioned helper at release time.

The format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows
[Semantic Versioning](https://semver.org/).

## Unreleased

### Changed (BREAKING)

- `text-size-select` is now an **icon button that opens a WAI-ARIA APG
  listbox**, matching `theme-select` and `locale-select`. It was
  deliberately left as a native `<select>` when those two converted;
  it now joins them, so all three helpers in this catalog are the same
  shape and share one keyboard implementation.
- DOM contract replaced. The rendered root is a
  `<div class="text-size-select {class}">` holding a hidden
  `<input name="{name}">`, a
  `<button class="text-size-select-button" aria-haspopup="listbox"
  aria-expanded aria-controls>` whose content defaults to
  `<span class="text-size-select-icon" aria-hidden="true">A</span>`,
  and a `<ul class="text-size-select-list" role="listbox" tabindex="-1"
  hidden>` of `<li class="text-size-select-option" role="option">`.
  The `<select>` and its `<option>` children are gone. Consumer CSS
  targeting `select.text-size-select` or `option.text-size-select-option`
  must be rewritten, and the list needs positioning
  (`position: absolute`) or it renders in normal flow.
- The keyboard contract is now implemented in JS rather than inherited
  from the platform: `ArrowDown`/`Enter`/`Space` open (`ArrowUp` opens
  on the last option), arrows move the active descendant and clamp,
  `Home`/`End` jump, `Enter`/`Space` select and refocus the button,
  `Escape` closes without changing the value, `Tab` closes without
  stealing focus, and printable characters run a 500 ms typeahead over
  the option labels.
- The `class` attribute now lands on the root `<div>`, not on a
  `<select>`; `name` now lands on the hidden `<input>`.

### Added

- `sizeName(slug)` exported resolver (title-cases hyphen-separated
  words: `"x-large"` → `"X Large"`), mirroring `themeName` and
  `localeName`. The internal `labelFor` delegates to it, so there is
  exactly one implementation of the title-casing rule.
- `LATIN_CAPITAL_LETTER_A` exported glyph constant, and
  `nextTextSizeSelectId()` for the SSR-safe module-counter ids.
- `renderButtonContent()` — the overridable rendering hook standing in
  for the `children` snippet the Svelte/React/Vue siblings take. It
  re-runs on every structural rebuild *and* every state sync, so
  derived content never goes stale.
- Public `open` / `listId` getters, `optionId(index)`,
  `openList(startIndex?)`, `closeList(refocus?)`, and `labelFor(slug)`.
- `docs/accessibility.md`, covering roles, the focus model,
  `data-active` vs `aria-selected`, the status-region pattern, and the
  three known tradeoffs. WCAG 1.4.4 (Resize Text) guidance is kept and
  expanded — it is this helper's specific concern.
- A keyboard test suite mirroring the canonical Svelte one. The
  catalog suite goes from 116 to 141 passing tests.

### Notes

- The glyph is `"A"` (U+0041), not a pictograph. U+1F5DB DECREASE FONT
  SIZE SYMBOL has no real glyph in common font stacks and means
  *decrease* rather than *size*; "A" renders in the page's own font
  everywhere and is materially safer than any pictograph on the
  font-dependence tradeoff.
- No detection prop was added: there is no OS "preferred text size"
  media query equivalent to `prefers-color-scheme` or
  `navigator.languages`.
- Unchanged: `data-text-size` application, `localStorage` persistence,
  the `textsizechange` event, initial-value resolution
  (`value` > storage > `default-value` > `"medium"` > `sizes[0]`), and
  SSR safety.

## 0.3.0 — 2026-07-20

### Changed (BREAKING)

- `theme-select` and `locale-select` bumped to **0.3.0**: both are now
  *placeholder-pinned*. The closed `<select>` always displays a short
  placeholder word ("Theme", "Locale") instead of the active value, so
  the control is only ever as wide as that word rather than as wide as
  the longest option. Each renders a leading placeholder `<option>` with
  an empty value, carrying a new optional `placeholder` prop (defaults
  to the existing `label`, so no user-facing string is hardcoded), and
  pins the element's own selection to it — snapping back after every
  change.
- DOM contract: option count is `choices.length + 1`, the first option's
  value is `""`, and the element's own `value` no longer tracks the
  selection. The bindable `value` prop is the single source of truth.
  Behaviour contracts (DOM application, persistence, SSR safety, i18n)
  are otherwise unchanged.
- `text-size-select` is untouched and stays at **0.1.0**.

### Added

- The compensating status region is now the default pattern in the
  examples and quick-starts: a visible `aria-live="polite"` element
  reporting the active value. It exists because placeholder-pinning
  means the control no longer announces its value to a screen reader;
  each package's `docs/accessibility.md` documents that tradeoff
  honestly rather than treating it as solved.

## 0.2.0 — 2026-07-03

### Changed (BREAKING)

- `theme-select` and `locale-select` bumped to **0.2.0**: migrated from
  the radio-group "picker" rendering to a native `<select>` with
  `<option>` children (landed in-tree 2026-06-17), with renamed packages
  (`*-picker` → `*-select`), changed class hooks, and native `<select>`
  keyboard semantics. Behaviour contracts (DOM application, persistence,
  SSR safety, i18n) are unchanged.

### Added

- `text-size-select` **0.1.0** — native-`<select>` text-size helper that
  sets `data-text-size` on the document root, with optional
  `localStorage` persistence (added 2026-06-17; born select-based, so it
  carries no picker migration).

## 0.1.0 — 2026-06-05

Initial release. Two helpers ported from the Svelte canonical
catalog to vanilla web-component (custom-element) idioms:

### Added

- `lily-design-system-html-theme-select` v0.1.0 — `<theme-select>`
  runtime-loading theme select. Imperatively swaps a managed
  `<link rel="stylesheet" data-lily-theme-select="{name}">` in
  `<head>`, writes `data-theme` to `<html>`, optionally persists to
  `localStorage`, dispatches a `themechange` `CustomEvent`. 13
  acceptance criteria covered.
- `lily-design-system-html-locale-select` v0.1.0 — `<locale-select>`
  BCP 47 locale select that writes `lang` and `dir` on the document
  root, with optional `localStorage` persistence and
  `navigator.languages` detection. Built-in 436-row locale-name
  table and RTL detection. Dispatches a `localechange`
  `CustomEvent`. 23 acceptance criteria covered.
- Parent-level `AGENTS/` with `conventions.md`, `testing.md`,
  `accessibility.md`, `ssr.md`.
- Parent-level `AGENTS/shared/` with `headless-principles.md`,
  `i18n-principles.md`, `theme-principles.md` adapted from the
  Lily-wide root `AGENTS/`.
- Each helper subproject ships `AGENTS/`, `docs/`, and `examples/`
  subdirectories mirroring the Svelte canonical depth.

### Conventions established

- `class extends HTMLElement` for every helper.
- `static get observedAttributes()` enumerates the watched kebab-case
  attributes.
- Side-effectful registration via `customElements.define(...)` in
  `index.ts`, guarded by `customElements.get(tag)` for idempotence.
- Kebab-case attributes mirror camelCase JS properties.
- Array properties accept native `string[]`; CSV-encoded in the
  attribute.
- Object properties accept native `Record<string, string>`;
  JSON-encoded in the attribute.
- `CustomEvent` (`bubbles: true, composed: true`) for change
  notifications.
- Light DOM only — no Shadow DOM, no scoped styling.
- Zero CSS shipped — consumer styles the kebab-case class hook.
- SSR-safe: no top-level DOM access, `customElements.define`
  guarded.
- Tests use vitest + jsdom.

### Differences from the Svelte canonical

| Concept              | Svelte canonical                       | HTML port (custom element)                                  |
| -------------------- | -------------------------------------- | ----------------------------------------------------------- |
| Two-way binding      | `bind:value`                           | Read/write `el.value` / `el.setAttribute("value", …)`       |
| Reactive state       | `$state`, `$bindable`                  | Internal `#private` fields + `attributeChangedCallback`     |
| Reactive side-effects | `$effect`                              | `connectedCallback` + `attributeChangedCallback`            |
| Render props / slots | Snippet (`{#snippet children(...)}`)   | Subclass the class, override `#render()`                    |
| Stylesheet head      | `<svelte:head>`                        | Imperative `document.head.appendChild(...)`                 |
| Change notification  | `onchange` prop callback               | `CustomEvent("themechange" / "localechange")`               |
| SSR                  | `hooks.server.ts` + `transformPageChunk` | Static-site generator renders attributes; client upgrades   |
| Storybook            | `*.stories.svelte`                     | Static `.html` files in `examples/`                         |
| File ext             | `.svelte`                              | `.ts` (class) + `.html` (examples)                          |

The DOM contract and behaviour are otherwise identical; the tests
match clause-for-clause.

### Spelling note

The HTML catalog uses `normalizeThemesUrl` (American `z`) to match
DOM-API convention (`document.normalize`, `Intl.NumberFormat`,
`String.normalize`). The Svelte canonical uses `normaliseThemesUrl`
(British `s`). Both libraries document the divergence.

[Unreleased]: https://github.com/lilydesignsystem/lily-design-system
[0.1.0]: https://github.com/lilydesignsystem/lily-design-system
