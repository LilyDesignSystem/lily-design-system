# CHANGELOG — lily-design-system-react-theme-chooser

## 0.1.0 — 2026-07-21

Initial release under this name.

`ThemeChooser` is a headless React 19 theme control: an icon button that
opens a WAI-ARIA APG listbox of theme slugs. Choosing one sets the `href`
of a managed `<link rel="stylesheet" data-lily-theme-chooser="{name}">`
in `document.head`, sets `data-theme` on the target element, optionally
persists to `localStorage`, and calls `onChange`. It ships no CSS; the
consumer styles the `theme-chooser`, `theme-chooser-button`,
`theme-chooser-icon`, `theme-chooser-list` and `theme-chooser-option`
class hooks. All DOM writes happen inside `useEffect`, so it is SSR-safe.

Public surface: `ThemeChooser` (default and named), `normalizeThemesUrl`,
`themeHref`, `themeName`, `matchSystemTheme`, plus the `Props` and
`ChildArgs` types. Required props are `label`, `themesUrl`, `themes`.

### Renamed

- Previously released in-tree as `lily-design-system-react-theme-select`.
  The rename to `-theme-chooser` also renames the `ThemeChooser` symbol to
  `ThemeChooser`, the `theme-chooser*` class hooks to `theme-chooser*`, and
  the `data-lily-theme-select` attribute to `data-lily-theme-chooser`.
  It disambiguates this helper from the catalog component of the same
  slug in `components.tsv`, which is a genuine `<select>` and owns the
  `.theme-chooser` hook. Nothing was ever published under the old name, so
  the version restarts at `0.1.0` rather than continuing the in-tree
  numbering; the entries below record that earlier history.

### Added (harmonization with locale-chooser)

- **`themeName(slug)` export.** The title-casing label rule
  (`"high-contrast"` → `"High Contrast"`) is now a named export from
  `ThemeChooser.tsx` and the barrel, mirroring `localeName` in
  locale-chooser. Examples across the catalogs had been hand-duplicating
  it; the internal `labelFor` now delegates to it, so there is exactly
  one implementation.
- **`detectFromSystem` prop** (boolean, default `false`). On a first
  visit — no `value`, nothing in storage — resolves the OS
  `prefers-color-scheme` preference to a supported theme, mirroring
  `detectFromNavigator` in locale-chooser. Off by default, so no
  existing behaviour changes.
- **`matchSystemTheme(themes)` export.** The pure helper behind
  `detectFromSystem`, mirroring `matchNavigatorLanguage`. Reads
  `matchMedia("(prefers-color-scheme: dark)")` and maps it to `"dark"`
  / `"light"`, returning `""` when that slug is not in `themes` or when
  `matchMedia` is unavailable (SSR — and jsdom, which does not
  implement it).
- Initial-value resolution order is now
  `value` > storage > detection > `defaultValue` > `"light"` >
  `themes[0]`, placing detection where locale-chooser places navigator
  detection.

### Changed (BREAKING — DOM contract and public API)

- **The control is no longer a native `<select>`.** It is now an icon
  button that opens a dropdown listbox, following the WAI-ARIA APG
  listbox pattern. The root is a
  `<div class="theme-chooser {className}">` — rest props spread onto that
  `<div>`, not onto a `<select>` — containing:
  - `<input type="hidden" name="{name}" value="{value}">`, so the
    control still submits with a surrounding form;
  - `<button type="button" class="theme-chooser-button" aria-label
    aria-haspopup="listbox" aria-expanded aria-controls>` holding
    `<span class="theme-chooser-icon" aria-hidden="true">◑</span>`;
  - `<ul class="theme-chooser-list" role="listbox" aria-label
    tabindex="-1" hidden>` with one
    `<li class="theme-chooser-option" role="option" aria-selected>` per
    slug, plus `data-active` on the keyboard-active option and
    `aria-activedescendant` on the list while open.

  The glyph is U+25D1 CIRCLE WITH RIGHT HALF BLACK (`&#9681;`),
  exported from `ThemeChooser.tsx` as `CIRCLE_WITH_RIGHT_HALF_BLACK`.
  Option and list ids come from React's `useId`, so they are stable and
  hydration-safe.
- **The `placeholder` prop is REMOVED.** The 0.3.0 placeholder-pinning
  design is gone with the `<select>` it pinned; there is nothing left to
  pin. The `theme-chooser-placeholder` class hook is removed too.
- **`children` changed meaning entirely.** It no longer renders the
  `<option>` elements — the component owns the options. It now replaces
  the glyph **inside the button** and receives
  `{ value, open, labelFor }`. The former `themes`, `setTheme`, and
  `name` fields of `ChildArgs` are gone; consumers who drove the
  selection from the render prop should use controlled
  `value` + `onChange` instead.
- `Props` now extends `HTMLAttributes<HTMLDivElement>` minus `onChange`,
  `children`, and `defaultValue`. `<select>`-only attributes
  (`required`, `disabled`, `form`, …) are no longer part of the surface.

### Added

- A component-implemented keyboard contract, replacing the platform
  semantics the native `<select>` used to supply. On the button:
  `ArrowDown` / `Enter` / `Space` open with the selected option active
  (or the first), `ArrowUp` opens with the last option active, and
  opening moves focus to the listbox. On the listbox: `ArrowDown` /
  `ArrowUp` move the active option and clamp rather than wrap,
  `Home` / `End` jump to the ends, `Enter` / `Space` select and apply
  and close and return focus to the button, `Escape` closes and
  refocuses without changing the value, `Tab` closes without stealing
  focus back, and printable characters run a typeahead over the option
  labels with a 500 ms buffer reset.
- Pointer behaviour: clicking an option selects it; clicking the button
  again, clicking outside the root, or focus leaving the root closes
  without changing the value.
- New class hooks: `theme-chooser-button`, `theme-chooser-icon`,
  `theme-chooser-list`. New attribute hooks for styling:
  `[data-active]` and `[aria-selected]` on the options,
  `[aria-expanded]` on the button, `[hidden]` on the list.

### Unchanged

- The behaviour contract: the managed
  `<link data-lily-theme-chooser="{name}">` swap, `data-theme` on the
  target, optional `localStorage` persistence, `onChange`,
  initial-value resolution (`value` > storage > `defaultValue` >
  `"light"` > `themes[0]`), SSR safety, and the exported pure helpers
  `normalizeThemesUrl` / `themeHref`.
- `name` still discriminates the managed `<link>`.
- The no-hardcoded-strings i18n rule: every user-facing string still
  comes from props.

### Accessibility notes

- The glyph is `aria-hidden`, so `label` is now the **only** accessible
  name the control has. It is not optional.
- A custom listbox does not receive the platform-level assistive-tech
  treatment a native `<select>` gets; `aria-activedescendant` support
  varies across screen reader and browser combinations. Manual
  screen-reader passes matter more than they did in 0.3.0.
- The default glyph depends on the user's installed fonts and may render
  as a box or not at all; consumers who need certainty should supply
  their own `children` glyph or an SVG.
- The status-region pattern from 0.3.0 is **retained and still the
  default** — arguably more necessary now, since the closed button shows
  only a glyph and never announces the active theme. See
  `docs/accessibility.md`.

### Styling

- The package still ships no CSS, which now includes no positioning: the
  listbox renders in normal flow until the consumer supplies the
  `position: relative` / `position: absolute` pair. Open and close are
  driven by the `hidden` attribute. See `docs/styling.md`.

---

## Prior history — released in-tree as `lily-design-system-react-theme-select`

The releases below were never published to npm under any name; they are
the in-tree development history of this package before the rename.

### 0.3.0 — 2026-07-20

#### Added

- `placeholder` prop (optional, `string`, defaults to `label`): the text
  of the always-displayed placeholder option. Keeps the package
  i18n-clean — no hardcoded user-facing string is ever emitted.
- `theme-chooser-placeholder` class hook on the placeholder `<option>`
  (alongside `theme-chooser-option`).

#### Changed (BREAKING — DOM contract)

- The `<select>` now renders a placeholder `<option value="">` as its
  **first child**, in both the default and the custom-`children` code
  paths. Option count is therefore `themes.length + 1` and the option
  value list is `["", ...themes]`. Consumers asserting on option counts
  or indices must account for the leading placeholder.
- The `<select>`'s own `value` is pinned to `""` and no longer tracks
  the active theme. After every change the DOM selection snaps back to
  the placeholder, so the closed control always reads
  `placeholder ?? label` and stays as narrow as that word.

#### Unchanged

- The behaviour contract: the resolved selection still lives in `value`
  / internal state, and `data-theme`, the managed `<link>` swap,
  optional `localStorage` persistence, `onChange`, initial-value
  resolution, and SSR safety are all as in 0.2.0.

#### Accessibility note

- Because the closed control always reads the placeholder, screen-reader
  users no longer hear the active theme announced as the combobox
  value. Consumers who need that should surface the active theme
  separately — as visible text or via a polite live region. See
  `docs/accessibility.md`.

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

### [0.1.0] — 2026-06-05

#### Added

- Initial implementation of `ThemeChooser` for React 19.
- `ThemeChooser.tsx` — function component with hooks
  (`useState`, `useEffect`, `useRef`). Carries the `"use client"`
  directive.
- `ThemeChooser.test.tsx` — vitest spec with one assertion per
  acceptance criterion in `spec/index.md §7` (criteria 1–13).
- `index.ts` — barrel re-export of `ThemeChooser`, `normalizeThemesUrl`,
  `themeHref`, `Props`, `ChildArgs`, and the default export.
- `spec/index.md` — canonical specification mirroring the Svelte
  counterpart's contract; spec version 0.1.0.
- `index.md` — comprehensive user guide with table of contents,
  quick start, props, custom rendering, persistence, accessibility,
  SSR, preloading, multiple-choosers, recipes, troubleshooting.
- `AGENTS.md` — AI-coding entrypoint.
- `AGENTS/` — five topic files for AI agents:
  `api.md`, `lifecycle.md`, `accessibility.md`, `testing.md`,
  `ssr.md`.
- `docs/` — eight topic guides for humans:
  `props-reference.md`, `accessibility.md`, `styling.md`, `ssr.md`,
  `preloading.md`, `custom-rendering.md`, `recipes.md`,
  `troubleshooting.md`, plus a `README.md` index.
- `examples/` — ten runnable examples plus a `README.md` index:
  `basic.tsx`, `two-way-binding.tsx`, `persistence.tsx`,
  `custom-labels.tsx`, `custom-rendering.tsx`, `preloaded.tsx`,
  `multiple-choosers.tsx`, `system-preference.tsx`, `lily-themes.tsx`,
  `next-cookie/` (Next.js App Router cookie SSR recipe).

#### Parity with Svelte counterpart

This helper mirrors
`lily-design-system-svelte-helpers/lily-design-system-svelte-theme-chooser`:

- Same `<select>` + `<option>` DOM contract.
- Same `data-theme` attribute target.
- Same managed `<link data-lily-theme-chooser="…">` discriminator.
- Same `themeHref` URL construction.
- Same initial-value resolution order (`value` > storage >
  `defaultValue` > `"light"` > `themes[0]`).
- Same `localStorage` try/catch persistence with silent error
  swallowing.
- Same `onChange(slug)` callback firing after every apply.
- Same `ChildArgs` shape passed to the render prop.

#### Differences from the Svelte counterpart

- `value` is a controlled prop, not a `$bindable()` two-way binding.
  Consumer pairs `value` + `onChange` (or omits both for uncontrolled
  mode).
- `children` is a render prop function, not a `Snippet`.
- `className` not `class`.
- The select carries `"use client"` for the React Server Components
  boundary.
- SSR recipe uses Next.js App Router `cookies()` + a client component
  wrapper, not SvelteKit's `transformPageChunk`.

#### Tracking

- Package directory:
  `lily-design-system-react-helpers/lily-design-system-react-theme-chooser/`
- Spec version: 0.1.0
- Created: 2026-06-05
- License: MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause
- Contact: Joel Parker Henderson <joel@joelparkerhenderson.com>
