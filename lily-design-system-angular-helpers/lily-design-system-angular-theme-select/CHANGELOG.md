# Changelog — ThemeSelect (Angular)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## Unreleased

### Added (symmetry with locale-select)

- **`themeName(theme)` is exported.** locale-select has exported
  `localeName(code)` all along; theme-select had no equivalent, so
  examples across the catalogs hand-duplicated its title-casing rule.
  `themeName("high-contrast")` returns `"High Contrast"`. The
  component's own `labelFor` now delegates to it, so there is exactly
  one implementation of the rule. `themeLabels` entries still override
  it.
- **`detectFromSystem` input and the exported `matchSystemTheme`
  helper**, mirroring locale-select's `detectFromNavigator` /
  `matchNavigatorLanguage`. `matchSystemTheme(themes)` reads
  `matchMedia("(prefers-color-scheme: dark)")`, maps it to `"dark"` /
  `"light"`, and returns `""` when that slug is not in `themes` **or
  when `matchMedia` is unavailable** — the SSR guard, which also
  covers jsdom, since jsdom does not implement `matchMedia`.

  Detection slots into the resolution order in the same position
  navigator detection occupies for locale-select:

  ```
  value > storage > detection > defaultValue > "light"/"en" > first
  ```

  It is a first-visit default, not an override: storage and an
  explicit `value` still win, and nothing runs unless
  `detectFromSystem` is set, so existing behaviour is unchanged.
  `examples/system-preference.component.ts` now uses the input
  instead of hand-rolling the media query.


### Changed (BREAKING — the control is no longer a `<select>`)

- **`<select>` → icon button + WAI-ARIA APG listbox.** The rendered
  control is now a root `<div class="theme-select">` containing a
  `<button class="theme-select-button">` that toggles a
  `<ul class="theme-select-list" role="listbox">` of
  `<li class="theme-select-option" role="option">` children. The
  button carries `aria-haspopup="listbox"`, `aria-expanded`, and
  `aria-controls`; the listbox carries `aria-activedescendant` while
  open; each option carries `aria-selected` plus a `data-active`
  styling hook for the keyboard highlight. Nothing is inherited from
  a native control any more — the component owns every role, state,
  focus move, and keystroke.
- **A hidden `<input type="hidden">` carries the value**, so the
  control still participates in a surrounding `<form>` now that no
  native form control remains. It takes the `name` input, which
  *also* still discriminates the managed
  `<link data-lily-theme-select="{name}">`.
- **The `placeholder` input is removed.** There is no `<select>` left
  to pin an option in, so the "pinned placeholder keeps the control
  narrow" tradeoff introduced in 0.3.0 no longer exists. The
  `.theme-select-placeholder` class hook and the `field-sizing`
  width recipe that served it are gone with it. Consumers passing
  `placeholder` must delete the binding.
- **Class hooks changed.** `theme-select` now names the root `<div>`
  (and is where `className` lands). New: `theme-select-button`,
  `theme-select-icon`, `theme-select-list`. `theme-select-option`
  now names an `<li>`, not an `<option>`. Removed:
  `theme-select-placeholder`. New state selectors:
  `[data-active]` (keyboard highlight) and `[aria-selected="true"]`
  (theme in effect) — different states, usually on different options.
- **The package now needs consumer positioning CSS.** The listbox is
  in normal document flow until styled, so it displaces page content
  when it opens. The package still ships zero CSS; the minimum recipe
  (`position: relative` on the root, `position: absolute` on the
  list) is in `docs/styling.md`.
- **New keyboard contract**, implemented by the component per the APG
  listbox pattern. On the button: `ArrowDown` / `Enter` / `Space`
  open with the selected option active; `ArrowUp` opens with the last
  option active; opening moves focus to the `<ul>`. On the listbox:
  `ArrowDown` / `ArrowUp` move the active option and **clamp** rather
  than wrap; `Home` / `End` jump to the ends; `Enter` / `Space`
  select, apply, close, and return focus to the button; `Escape`
  closes and refocuses without changing the value; `Tab` closes
  without stealing focus back; printable characters run a typeahead
  over the display **labels** with a 500 ms buffer reset. Clicking an
  option selects it; clicking outside or moving focus out closes.
- **Custom rendering is now a projected `<ng-template>` that replaces
  the button glyph** — it no longer renders options, and there is no
  per-option template. The component queries any projected template
  via `contentChild(TemplateRef)` and stamps it with the `ChildArgs`
  context `{ $implicit, value, open, labelFor }`. The previously
  documented "future option-projection slot" is not happening; the
  listbox stays component-owned so the ARIA contract cannot be
  broken by a consumer.
- Default option labels now title-case **each** hyphen-separated word
  and join with spaces (`"high-contrast"` → `"High Contrast"`),
  rather than upper-casing only the first character.

### Added

- `ThemeSelectIcon` — optional exported marker directive
  (`ng-template[lilyThemeSelectIcon]`) giving typed `let-` variables
  for the icon template via `ngTemplateContextGuard`. Purely a
  type-checking aid; the component's query does not require it.
- `CIRCLE_WITH_RIGHT_HALF_BLACK` — the default button glyph, `◑`
  U+25D1 CIRCLE WITH RIGHT HALF BLACK (`&#9681;`), exported so
  consumers can reuse it without hardcoding the code point.
- `nextThemeSelectId` — the per-instance id generator. An
  incrementing module counter rather than `Math.random()` /
  `Date.now()`, which is what makes the `id` / `aria-controls` /
  `aria-activedescendant` wiring stable across server and client
  renders.
- `ChildArgs` — type-only export describing the icon template's
  context.

### Unchanged

Everything downstream of the selection: the managed `<link>` swap,
`data-theme` application, optional `localStorage` persistence, the
`themeChange` output, `[(value)]` two-way binding, initial-value
resolution (`value` > storage > `defaultValue` > `"light"` >
`themes[0]`), SSR safety, and the pure helpers `normaliseThemesUrl` /
`themeHref`.

### Accessibility (docs)

`docs/accessibility.md` replaces the removed 0.3.0 placeholder
tradeoff with the three this change introduces, stated without spin:
an icon-only button depends entirely on `aria-label` for its
accessible name; a custom listbox has weaker and less consistent
assistive-technology support than a native `<select>`, which gets
platform behaviour (including the mobile picker) for free — a real
regression, not a neutral difference; and the glyph may render at an
odd weight, render as tofu, or be missing depending on platform font
coverage. The status-region pattern is retained and still the
default: the closed button shows only a glyph and never names the
active theme.

## 0.3.0 — 2026-07-20

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
[0.3.0]: https://github.com/lilydesignsystem/lily-design-system
[0.1.0]: https://github.com/lilydesignsystem/lily-design-system
