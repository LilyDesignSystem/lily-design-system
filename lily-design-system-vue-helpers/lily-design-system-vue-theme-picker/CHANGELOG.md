# Changelog — ThemePicker (Vue)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## 0.1.1 — 2026-08-26

Metadata-only patch; no behaviour change. Ships the corrected package
metadata to the registry: the project SPDX license menu (`MIT OR
Apache-2.0 OR GPL-2.0-only OR GPL-3.0-only OR BSD-3-Clause`) replacing
the single-license field that contradicted the repository's
LICENSE.md, `repository`/`homepage`/`bugs` URLs, a named author, and a
description that says what the package does.

## 0.1.0 — 2026-07-30

First published release. Nothing earlier shipped, so the
accessibility hardening completed after the initial entry below is
part of 0.1.0 rather than a later version.

### Pointer-selection close is now part of the contract (2026-07-31)

#### Changed

- **Clicking an option is specified to close the listbox**, not just to
  select and apply. The behaviour was already correct — and is now
  asserted: the pointer test checks `aria-expanded="false"` and the
  list's `hidden` alongside the applied value. Only `Enter` promised the
  close before, and an untested asymmetry is one refactor away from
  becoming real: a selection that leaves `aria-expanded="true"` over a
  hidden list reports an open popup to assistive technology and makes
  every later click miss the options.

### Accessibility hardening (2026-07-29/30)

#### Changed

- **`Tab` from the open list no longer strands keyboard focus.** The
  handler hid the list while it had focus; the browser then moved focus
  to `<body>` and the default Tab restarted from the top of the
  document. Focus now goes to the trigger button first — without
  cancelling the key — so the default Tab proceeds from the picker's
  own position.
- **Typeahead follows the APG single-character rule.** A single
  character advances to the *next* matching option, and repeating that
  character cycles through the matches; only a buffer of differing
  characters refines the match anchored on the active option.
  Previously a character that matched the active option went nowhere.

#### Added

- **`PageUp` / `PageDown`** move the active option by ten, clamped —
  an APG-optional key for long lists.

#### Fixed

- Opening with an empty option list no longer points
  `aria-activedescendant` at an id that does not exist.

### Initial entry — 2026-07-21

Renamed from `lily-design-system-vue-theme-select`. The old name
collided with `theme-picker`, one of the 490 components in the Lily
catalog, which is a different thing entirely; `picker` also matches the
three sibling helpers. Nothing was ever published under the old name, so
the version resets to 0.1.0 rather than continuing the in-tree 0.4.0.

The rename is full-depth:

- Component and default export: `ThemePicker` -> `ThemePicker`.
- Class hooks: `.theme-picker*` -> `.theme-picker`, `.theme-picker-button`,
  `.theme-picker-icon`, `.theme-picker-list`, `.theme-picker-option`.
- Managed stylesheet link: `data-lily-theme-select` ->
  `data-lily-theme-picker`.
- Id helper: `nextThemeSelectId` -> `nextThemePickerId`.

`themeName` keeps its name -- it never said "select".

#### The package as it stands

- Headless Vue 3 theme picker: an icon button (U+25D1 CIRCLE WITH RIGHT
  HALF BLACK) that opens a WAI-ARIA APG listbox of theme slugs.
- Loads themes at runtime by swapping the `href` of a managed
  `<link rel="stylesheet" data-lily-theme-picker>` and setting
  `data-theme` on the target element.
- Optional `localStorage` persistence; optional `prefers-color-scheme`
  first-visit detection via `detectFromSystem`.
- Exports `ThemePicker`, `normaliseThemesUrl`, `themeHref`, `themeName`,
  `matchSystemTheme`, `nextThemePickerId`,
  `CIRCLE_WITH_RIGHT_HALF_BLACK`, and the `Props` / `SlotArgs` /
  `ChildArgs` types.
- Ships no CSS, fonts, icons, or images. SSR-safe.

## Prior history — released in-tree as `lily-design-system-vue-theme-select`

Everything below happened in-tree under the former name, and is
kept verbatim -- headings demoted one level, old names intact -- so
the record stays accurate. None of it was published to npm.

#### Unreleased

##### Added

- `themeName(slug)` — exported label resolver that title-cases each
  hyphen-separated word (`"high-contrast"` → `"High Contrast"`).
  Mirrors `localeName(code)` on locale-picker. The internal `labelFor`
  now delegates to it, so the title-casing rule has exactly one
  implementation instead of being hand-duplicated across examples.
- `detectFromSystem` prop (optional `boolean`, default `false`) —
  resolves the first-visit theme from `prefers-color-scheme`. Mirrors
  `detectFromNavigator` on locale-picker and occupies the same slot in
  the resolution order: `value` > storage > **detection** >
  `defaultValue` > `"light"` > `themes[0]`.
- `matchSystemTheme(themes)` — exported pure helper behind that prop.
  Maps the OS colour-scheme preference to `"dark"` / `"light"` and
  returns `""` when the resolved slug is not in `themes`, or when
  `matchMedia` is unavailable (SSR; jsdom does not implement it
  either). Mirrors `matchNavigatorLanguage`.
- Both new helpers are re-exported from the `index.ts` barrel.

##### Changed

- `examples/system-preference.vue` now uses `detect-from-system`
  instead of hand-resolving the media query into `default-value`, and
  keeps the live-tracking listener as the documented opt-in.
- `examples/lily-themes.vue` regenerated from the root `themes/`
  catalog: 45 slugs, up from a stale 41 that predated the
  Adobe Spectrum, Mozilla Protocol, GOV.UK GDS, and USWDS themes.
  `index.md` and `examples/README.md` corrected to say 45.

##### Fixed

- CHANGELOG entry order: 0.3.0 now precedes 0.2.0 (they were inverted).
- `spec/index.md` claimed "Spec version: 0.1.0" despite 0.2.0 and
  0.3.0 having shipped; now 0.3.0.
- `spec/index.md` listed "a `prefers-color-scheme` integration" as
  out-of-scope while this release implements it. The out-of-scope
  entry is narrowed to _tracking_ the preference after first paint,
  which remains a consumer concern.

##### Changed (BREAKING)

- **The control is no longer a native `<select>`.** It is now an icon
  button that opens a WAI-ARIA APG listbox. The root element changes
  from a `<select>` to a `<div>`, both carrying the
  `theme-picker` hook, containing three children:
  - a hidden `<input type="hidden" name="{name}" value="{value}">`,
    which preserves form participation;
  - a `<button type="button" class="theme-picker-button"
aria-label="{label}" aria-haspopup="listbox" aria-expanded
aria-controls="{listId}">` wrapping
    `<span class="theme-picker-icon" aria-hidden="true">&#9681;</span>`;
  - a `<ul class="theme-picker-list" role="listbox"
aria-label="{label}" tabindex="-1" hidden aria-activedescendant>`
    of `<li class="theme-picker-option" role="option" aria-selected
data-active>`.

  Consumers selecting `select.theme-picker`, reading `selectEl.value`,
  or styling `option.theme-picker-option` must migrate. The active
  theme is read from the `v-model:value` binding, from `data-theme` on
  the target, or from the hidden input.

- **The `placeholder` prop is removed.** It described the leading
  `<option>` of the old `<select>`, and there is no `<select>` left to
  pin. The `.theme-picker-placeholder` class hook is removed with it,
  along with the 0.3.0 "snapping back to the placeholder" behaviour —
  there is nothing left that snaps.

- **The default slot now replaces the button glyph, not the options.**
  `SlotArgs` changes from
  `{ themes, value, setTheme, name, labelFor }` to
  `{ value, open, labelFor }`. The listbox, its options, the keyboard
  contract, and the apply lifecycle are component-owned and can no
  longer be overridden from the slot. Slot content is decorative: the
  accessible name always comes from `label` via `aria-label`, so slot
  markup should be `aria-hidden="true"` or text-free, and must not be
  interactive (it renders inside the `<button>`).

- **Keyboard interaction is now component-implemented** rather than
  inherited from the platform. Following the APG listbox pattern: on
  the button, `ArrowDown` / `Enter` / `Space` open with the selected
  option active and `ArrowUp` opens with the last option active, and
  opening moves focus to the `<ul>`. On the listbox, `ArrowDown` /
  `ArrowUp` move the active option and **clamp** rather than wrap,
  `Home` / `End` jump to the first / last, `Enter` / `Space` commit and
  refocus the button, `Escape` closes without changing the value, `Tab`
  closes without stealing focus back, and printable characters run a
  typeahead over the option labels with a 500 ms buffer reset. Clicking
  an option selects it; clicking outside or moving focus out of the
  root closes the listbox.

##### Added

- `nextThemeSelectId()` — SSR-safe per-instance id generator backed by
  a module counter (never `Math.random()` / `Date.now()`), used for the
  listbox and option ids.
- `CIRCLE_WITH_RIGHT_HALF_BLACK` — the default button glyph, `"◑"`
  (U+25D1, `&#9681;`).
- `type ChildArgs` — alias of `SlotArgs`, matching the canonical Svelte
  helper's type name.
- New acceptance clauses §7.13–§7.17 in `spec/index.md` with matching
  tests: the slot replaces the glyph and receives `SlotArgs`; the three
  open keys and the `ArrowUp`-opens-last rule; active-descendant
  movement, clamping, and `Home` / `End`; commit / cancel / `Tab`
  semantics and `aria-activedescendant` teardown; typeahead, option
  clicks, and outside-click close.

##### Unchanged

- The whole downstream lifecycle: the managed
  `<link data-lily-theme-select="{name}">` swap, `data-theme` on the
  target, optional `localStorage` persistence, the `change` and
  `update:value` events, `v-model:value`, initial-value resolution
  (`value` > storage > `defaultValue` > `"light"` > `themes[0]`), SSR
  safety, and the exported pure helpers `normaliseThemesUrl` /
  `themeHref`.
- `name` still discriminates the managed `<link>`; it is now also the
  hidden input's `name`.
- The no-hardcoded-strings i18n rule.

##### Accessibility

`docs/accessibility.md` is rewritten around the three tradeoffs this
design makes, replacing the 0.3.0 placeholder-pinning tradeoff (which
no longer exists):

1. **Icon-only control.** `aria-label` from `label` is the button's
   entire accessible name; a wrong or untranslated `label` leaves it
   unnamed, and WCAG 2.5.3 (Label in Name) has no visible text to match
   against.
2. **A scripted listbox is less robust than a native `<select>`.** No
   platform-native screen reader behaviour, no OS picker on touch
   devices, and uneven real-world `aria-activedescendant` and
   forms-mode support. APG-conformant and keyboard-complete, but a
   genuine robustness regression traded for a compact, consistent,
   styleable control.
3. **The `◑` glyph is font-dependent** — it may be re-weighted,
   substituted, or missing (tofu). Ship an SVG through the slot if that
   matters.

The `.theme-picker-status` live-region guidance is retained and is now
more load-bearing, not less: the closed button shows only a glyph, so
the active theme has no on-screen and no announced representation
unless the consumer renders one.

##### Docs

- `docs/styling.md` — hooks are now `theme-picker`,
  `theme-picker-button`, `theme-picker-icon`, `theme-picker-list`,
  `theme-picker-option`, plus `[data-active]` and `[aria-selected]`;
  `theme-picker-placeholder` is gone. Adds a positioning section: the
  package ships no CSS, so the listbox needs `position: absolute` under
  a `position: relative` root, and `[data-active]` must be styled or
  keyboard navigation looks inert.
- `AGENTS.md`, `AGENTS/{accessibility,api,lifecycle,ssr,testing}.md`,
  `index.md`, `docs/{custom-rendering,props-reference,recipes,ssr,troubleshooting}.md`,
  and `examples/README.md` updated for the new markup, props, slot
  contract, keyboard model, and test harness.

#### 0.3.0 — 2026-07-20

##### Changed (BREAKING)

- **The closed `<select>` now always reads a placeholder word rather
  than the active theme name.** Two DOM-contract changes follow:
  - A component-owned placeholder `<option class="theme-picker-option
theme-picker-placeholder" value="" selected>` is rendered as the
    **first child** of the `<select>`, in both the default and the
    custom-slot code paths. Option count is now `themes.length + 1`
    and the first option's value is `""`. Tests and CSS that assume
    one option per theme, or that index options positionally, must
    shift by one.
  - The `<select>` element's own `value` **no longer tracks the
    selection**. On `change` the component reads the chosen slug,
    resets `select.value = ""`, then applies the slug. Code reading
    `selectEl.value` to learn the active theme must read the
    `v-model:value` binding or `data-theme` on the target instead.

  Motivation: the control now stays as narrow as the placeholder word
  instead of growing to fit the longest theme name. Pair with the
  `field-sizing: content` / `max-width` recipe in `docs/styling.md`.

  Accessibility tradeoff, documented in `docs/accessibility.md`: a
  screen-reader user no longer hears the active theme announced as
  the combobox value. Consumers who need that should surface the
  active selection in visible text or a polite live region.

##### Added

- `placeholder` prop (optional `string`, defaults to the value of
  `label`) — the text of the placeholder option. Keeps the package
  i18n-clean: no hardcoded user-facing string is ever emitted.
- Acceptance clauses §7.14–§7.16 in `spec/index.md` with matching
  tests: the placeholder renders the label text and holds the
  select's value at `""` while the theme is still applied; the
  `placeholder` prop overrides the label; choosing an option applies
  it and snaps the select back to the placeholder.

##### Changed

- **Root markup migrated to a native `<select>`.** The select now
  renders `<select class="theme-picker" aria-label="…" name="…">`
  with one `<option class="theme-picker-option">` per theme slug,
  replacing the previous grouped-control markup. This matches the
  Svelte canonical, removes the per-option label span, and inherits
  the platform combobox semantics (implicit `role="combobox"` on
  `<select>`, `role="option"` on each `<option>`, Arrow / Home / End
  / typeahead keyboard behaviour) for free. The selected-state ARIA
  and manual focus notes are gone; the accessible name still comes
  from `aria-label`. The default scoped slot now renders `<option>`
  elements; `SlotArgs` (`{ themes, value, setTheme, name, labelFor }`)
  is unchanged.

##### Added (examples & docs)

- The compensating status region is now the **default pattern**, not a
  suggestion: the basic example and the `index.md` quick-start both ship
  a visible `<p class="theme-picker-status" aria-live="polite">` showing
  the active theme. `aria-live="polite"` announces mutations only, so it
  stays silent on first paint and speaks on each change.
  `docs/accessibility.md` reframes opting _out_ as the deliberate choice
  and keeps an explicit "what this does and does not fix" note — the
  region announces transitions, it does not restore combobox value
  semantics.

#### 0.2.0 — 2026-07-03

##### Changed (BREAKING)

- Migrated from the radio-group "picker" rendering to a native
  `<select>` (landed in-tree 2026-06-17): the root element is now
  `<select class="theme-picker">` with one `<option class="theme-picker-option">`
  per choice, replacing the former `<fieldset role="radiogroup">` with
  `<input type="radio">` children. The package was renamed from the
  `*-picker` name to `*-select` accordingly.
- Class-hook contract changed: `theme-picker` now names the `<select>` root
  and `theme-picker-option` is the only sub-class; the radio/label sub-class
  hooks are gone.
- Keyboard interaction is the native `<select>` contract (Arrow keys,
  Home / End, first-letter typeahead) instead of radio-group cycling.
- Custom rendering (snippet / render prop / slot / template) now renders
  `<option>` elements inside the `<select>`.

##### Unchanged

- The behaviour contract: DOM application (`data-theme` + managed `<link>` swap), optional
  `localStorage` persistence, SSR safety, and the no-hardcoded-strings
  i18n rule are as in 0.1.0.

#### 0.1.0 — 2026-06-05

Initial release.

##### Added

- `ThemePicker.vue` — Vue 3 SFC with `<script setup lang="ts">`.
  Implements the full Svelte canonical contract:
  - Renders `<select aria-label="…" name="…">` with one
    `<option>` per theme slug.
  - Manages a single `<link rel="stylesheet" data-lily-theme-select="{name}">`
    in `document.head` and swaps its `href` on each apply.
  - Sets `data-theme="{slug}"` on the resolved target element
    (defaults to `document.documentElement`).
  - Optional `storageKey` persistence to `localStorage` with
    private-mode-safe try/catch.
  - Two-way binding via `v-model:value`.
  - `change` event for post-apply side effects.
  - Default scoped slot for custom rendering with
    `{ themes, value, setTheme, name, labelFor }`.
- `index.ts` barrel re-exporting `default`, `ThemePicker`,
  `normaliseThemesUrl`, `themeHref`, and the `Props` + `SlotArgs`
  types.
- `ThemePicker.test.ts` — vitest suite asserting every numbered
  acceptance criterion in `spec/index.md` §7 (13 items + extras).
- `spec/index.md` — spec-driven contract, version 0.1.0.
- `AGENTS/` subdirectory with `api.md`, `lifecycle.md`,
  `accessibility.md`, `testing.md`, `ssr.md`.
- `docs/` subdirectory with topic guides: `accessibility.md`,
  `custom-rendering.md`, `preloading.md`, `props-reference.md`,
  `recipes.md`, `ssr.md` (Nuxt notes), `styling.md`,
  `troubleshooting.md`.
- `examples/` subdirectory: `basic.vue`, `custom-labels.vue`,
  `custom-rendering.vue`, `lily-themes.vue`, `multiple-selects.vue`,
  `persistence.vue`, `preloaded.vue`, `system-preference.vue`,
  `two-way-binding.vue`, plus `nuxt-cookie/` with `app.vue`,
  `plugins/theme.ts`, `server/middleware/theme.ts`,
  `server/api/theme.post.ts`.

##### Conventions

- Vue 3 Composition API, `<script setup lang="ts">`.
- Zero runtime dependencies beyond `vue`.
- SSR-safe: all DOM writes inside `onMounted` / `watch`.
- Tested under vitest + jsdom + `@vue/test-utils`.

##### Parity

This is a direct port of the Svelte canonical
`lily-design-system-svelte-theme-select` v0.1.0. The DOM contract,
managed-link discriminator, initial-value resolution, and apply
order match clause-for-clause.

##### Notes

- The `onChange` callback prop from the Svelte canonical maps to the
  `change` Vue event. Use `@change="..."` in templates.
- The `children` snippet from Svelte maps to the default scoped
  slot in Vue. Slot args are camelCase in TypeScript, kebab-case in
  template attribute bindings.
