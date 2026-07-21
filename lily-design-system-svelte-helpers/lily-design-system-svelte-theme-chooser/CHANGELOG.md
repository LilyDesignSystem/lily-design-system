# Changelog — ThemeChooser (Svelte)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## 0.1.0 — 2026-07-21

### Changed (BREAKING)

- Renamed from `lily-design-system-svelte-theme-select`. Directory,
  component (`ThemeChooser.svelte`), exported symbols (`ThemeChooser`,
  `nextThemeChooserId`), class hooks (`theme-chooser`,
  `theme-chooser-button`, `theme-chooser-icon`, `theme-chooser-list`,
  `theme-chooser-option`, `theme-chooser-option-label`,
  `theme-chooser-placeholder`, `theme-chooser-status`,
  `theme-chooser-swatch`, `theme-chooser-text`) and the managed-link
  data attribute (`data-lily-theme-chooser`, `data-lily-theme-chooser-value`)
  all carry the new name. The old `theme-chooser` hook collided with the
  catalog component of the same name; that collision is now gone.
- A headless Svelte 5 theme chooser: an icon button (`◑`) that opens a
  WAI-ARIA APG listbox, loads theme stylesheets at runtime from a
  developer-specified directory by swapping a managed
  `<link data-lily-theme-chooser>`, and sets `data-theme` on the
  document root. Optional `localStorage` persistence, SSR-safe, ships
  no CSS.

### Versioning

- Version reset to `0.1.0`. Nothing has been published under the name
  `lily-design-system-svelte-theme-chooser`, so continuing the old
  number line would imply releases that never existed under this name.

---

## Prior history — released in-tree as `lily-design-system-svelte-theme-select`

Previously released in-tree as `lily-design-system-svelte-theme-select`. Everything below happened
under that name. Identifiers in these entries (class hooks, symbols, data
attributes) have been updated to their current spellings so the document
reads coherently; the events they describe are unchanged.

### Unreleased

#### Changed (BREAKING)

- **The control is no longer a native `<select>`.** It is now an icon
  button that opens a WAI-ARIA APG listbox. The root is a `<div
  class="theme-chooser">` containing a hidden input, a `<button
  class="theme-chooser-button">` showing the glyph `◑` (U+25D1 CIRCLE
  WITH RIGHT HALF BLACK, `&#9681;`), and a `<ul class="theme-chooser-list"
  role="listbox">` of `<li class="theme-chooser-option" role="option">`
  children.
- **`placeholder` prop removed.** It existed in 0.3.0 to name the
  pinned option of the native `<select>`. There is no `<select>` and no
  pinned option, so the prop is gone; passing it now falls through
  `restProps` onto the root `<div>` as a stray attribute. This
  supersedes the whole 0.3.0 placeholder-pinning design.
- **`ChildArgs` changed shape, and `children` changed meaning.** It was
  `{ themes, value, setTheme, name, labelFor }` and rendered `<option>`
  elements. It is now `{ value, open, labelFor }` and **replaces the
  glyph inside the trigger button**. The listbox and its options are
  component-owned. Any consumer snippet rendering options must be
  rewritten.
- **Class hooks changed.** `theme-chooser` now names the root `<div>`,
  not a `<select>`. Added: `theme-chooser-button`, `theme-chooser-icon`,
  `theme-chooser-list`. Removed: `theme-chooser-placeholder`.
  `theme-chooser-option` survives but now names an `<li>`, not an
  `<option>`.
- **Keyboard interaction is implemented by the component**, not
  inherited from the platform. See `spec/index.md` §6.2 — button keys
  (`Enter` / `Space` / `ArrowDown` open, `ArrowUp` opens at the last
  option) and listbox keys (arrows clamp rather than wrap, `Home` /
  `End`, `Enter` / `Space` select-and-close, `Escape` closes without
  changing, `Tab` closes without stealing focus, 500 ms typeahead over
  the labels).
- **Consumers must now ship positioning CSS** for
  `.theme-chooser-list`, including a `[hidden] { display: none }`
  reset. The package still ships zero CSS, so an unstyled listbox
  renders in normal flow and shifts the page when it opens. See
  `docs/styling.md`.
- The `field-sizing: content` width recipe is obsolete along with the
  `<select>` it sized.

#### Added

- `detectFromSystem` prop (boolean, default `false`) — resolves
  `prefers-color-scheme` to a supported theme on first visit. It sits
  below storage in the resolution order (`value > storage >
  detectFromSystem > defaultValue > "light" > themes[0]`), matching the
  slot `detectFromNavigator` occupies in `locale-chooser`.
- `matchSystemTheme(themes)` exported pure helper. Returns `"dark"` /
  `"light"` when that slug is in `themes`, and `""` when it is not or
  when `matchMedia` is unavailable (SSR, jsdom). Mirrors
  `matchNavigatorLanguage` in `locale-chooser`.
- `themeName(theme)` exported pure helper — title-cases each
  hyphen-separated word (`"high-contrast"` → `"High Contrast"`). The
  internal `labelFor` delegates to it, so there is exactly one
  implementation, and examples no longer hand-duplicate the rule.
  Mirrors `localeName` in `locale-chooser`.
- `CIRCLE_WITH_RIGHT_HALF_BLACK` glyph constant and
  `nextThemeChooserId()` (an SSR-safe incrementing id generator).
- A hidden `<input type="hidden" name="{name}">` preserving form
  participation now that there is no native form control.

#### Changed (accessibility)

- **The 0.3.0 placeholder tradeoff is gone.** There is no pinned
  select, and the listbox marks the active option with
  `aria-selected="true"`, so the selection *is* exposed to assistive
  technology.
- Three new tradeoffs are documented honestly in
  `docs/accessibility.md`: (a) an icon-only control's accessible name
  rests entirely on `aria-label`, with no visible-text fallback;
  (b) a hand-rolled listbox has weaker assistive-technology and mobile
  support than a native `<select>` — **for some audiences a native
  `<select>` is the better choice**, and the headless `ThemeChooser`
  container upstream is one; (c) the glyph is a font-dependent
  character that may substitute, render as "tofu", or not render at
  all.
- The `.theme-chooser-status` live region is still recommended, but for
  a different reason: it no longer compensates for missing semantics,
  it compensates for the *closed* control showing only a glyph.

#### Unchanged

- Everything downstream: the managed `<link>` swap, `data-theme`,
  `localStorage` persistence, `onChange`, initial-value resolution
  (apart from the new detection step), SSR safety, and the
  `normaliseThemesUrl` / `themeHref` helpers.
- Still ships zero CSS, no fonts, no icons, no images.

#### Known gap

- `index.ts` does not yet re-export `themeName`, `matchSystemTheme`, or
  `CIRCLE_WITH_RIGHT_HALF_BLACK`; import them from
  `./ThemeChooser.svelte` directly. Widening the barrel to match
  `locale-chooser`'s is a pending follow-up.

### 0.3.0 — 2026-07-20

#### Changed (BREAKING)

- The closed `<select>` now always displays a placeholder word ("Theme")
  instead of the active theme name, so the control is only ever as wide
  as that word rather than as wide as the longest theme name. A leading
  `<option class="theme-chooser-option theme-chooser-placeholder" value="">`
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

#### Added

- `placeholder` prop (optional, string, defaults to `label`) — the text
  of the placeholder option.

#### Unchanged

- `value` remains the single source of truth and stays two-way bindable;
  link swapping, `data-theme`, `localStorage` persistence, `onChange`,
  and initial-value resolution all behave exactly as before.
- Still ships zero CSS. The width recipe lives in
  [docs/styling.md](./docs/styling.md) and in the root `themes/`
  stylesheets.

#### Added (examples & docs)

- The compensating status region is now the **default pattern**, not a
  suggestion: the basic example and the `index.md` quick-start both ship
  a visible `<p class="theme-chooser-status" aria-live="polite">` showing
  the active theme. `aria-live="polite"` announces mutations only, so it
  stays silent on first paint and speaks on each change.
  `docs/accessibility.md` reframes opting *out* as the deliberate choice
  and keeps an explicit "what this does and does not fix" note — the
  region announces transitions, it does not restore combobox value
  semantics.

### 0.2.0 — 2026-07-03

#### Changed (BREAKING)

- Migrated from the radio-group "picker" rendering to a native
  `<select>` (landed in-tree 2026-06-17): the root element is now
  `<select class="theme-chooser">` with one `<option class="theme-chooser-option">`
  per choice, replacing the former `<fieldset role="radiogroup">` with
  `<input type="radio">` children. The package was renamed from the
  `*-picker` name to `*-select` accordingly.
- Class-hook contract changed: `theme-chooser` now names the `<select>` root
  and `theme-chooser-option` is the only sub-class; the radio/label sub-class
  hooks are gone.
- Keyboard interaction is the native `<select>` contract (Arrow keys,
  Home / End, first-letter typeahead) instead of radio-group cycling.
- Custom rendering (snippet / render prop / slot / template) now renders
  `<option>` elements inside the `<select>`.

#### Unchanged

- The behaviour contract: DOM application (`data-theme` + managed `<link>` swap), optional
  `localStorage` persistence, SSR safety, and the no-hardcoded-strings
  i18n rule are as in 0.1.0.

### 0.1.0 — 2026-06-05

Initial release. This is the **canonical reference implementation**
for Lily's theme select; the Vue, React, Angular, Blazor, Nunjucks,
and HTML ports port from this contract clause-for-clause.

#### Added

- `ThemeChooser.svelte` — Svelte 5 component using runes throughout
  (`$props`, `$bindable`, `$effect`). Implements:
  - Renders a native `<select aria-label="…" name="…">` with one
    `<option>` per theme slug.
  - Manages a single `<link rel="stylesheet" data-lily-theme-chooser="{name}">`
    in `document.head` and swaps its `href` on each apply.
  - Sets `data-theme="{slug}"` on the resolved target element
    (defaults to `document.documentElement`).
  - Optional `storageKey` persistence to `localStorage` with
    private-mode-safe try/catch.
  - Two-way binding via `bind:value` on a `$bindable("")` prop.
  - `onChange` callback for post-apply side effects.
  - `children` snippet for custom rendering with
    `{ themes, value, setTheme, name, labelFor }`.
- `index.ts` barrel re-exporting `default`, `ThemeChooser`,
  `normaliseThemesUrl`, `themeHref`, and the `Props` + `ChildArgs`
  types.
- `ThemeChooser.test.ts` — vitest suite asserting every numbered
  acceptance criterion in `spec/index.md` §7 (13 items + extras).
- `ThemeChooser.stories.svelte` — Storybook story for the select.
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

#### Conventions

- **Svelte 5 runes** throughout. No legacy `export let`, no `$:`,
  no `createEventDispatcher`.
- **TypeScript** on the public surface. `Props` and `ChildArgs`
  exported from a `<script lang="ts" module>` block.
- **Zero runtime dependencies** beyond `svelte`.
- **SSR-safe** — all DOM writes inside `$effect`.
- **No `<style>` block** — consumer styles the `theme-chooser` class
  hook.
- **Tested** under vitest + jsdom + `@testing-library/svelte`.

#### Notes

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
