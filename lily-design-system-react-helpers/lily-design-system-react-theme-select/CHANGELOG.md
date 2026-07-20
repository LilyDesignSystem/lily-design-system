# CHANGELOG — lily-design-system-react-theme-select

## 0.3.0 — 2026-07-20

### Added

- `placeholder` prop (optional, `string`, defaults to `label`): the text
  of the always-displayed placeholder option. Keeps the package
  i18n-clean — no hardcoded user-facing string is ever emitted.
- `theme-select-placeholder` class hook on the placeholder `<option>`
  (alongside `theme-select-option`).

### Changed (BREAKING — DOM contract)

- The `<select>` now renders a placeholder `<option value="">` as its
  **first child**, in both the default and the custom-`children` code
  paths. Option count is therefore `themes.length + 1` and the option
  value list is `["", ...themes]`. Consumers asserting on option counts
  or indices must account for the leading placeholder.
- The `<select>`'s own `value` is pinned to `""` and no longer tracks
  the active theme. After every change the DOM selection snaps back to
  the placeholder, so the closed control always reads
  `placeholder ?? label` and stays as narrow as that word.

### Unchanged

- The behaviour contract: the resolved selection still lives in `value`
  / internal state, and `data-theme`, the managed `<link>` swap,
  optional `localStorage` persistence, `onChange`, initial-value
  resolution, and SSR safety are all as in 0.2.0.

### Accessibility note

- Because the closed control always reads the placeholder, screen-reader
  users no longer hear the active theme announced as the combobox
  value. Consumers who need that should surface the active theme
  separately — as visible text or via a polite live region. See
  `docs/accessibility.md`.

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

## [0.1.0] — 2026-06-05

### Added

- Initial implementation of `ThemeSelect` for React 19.
- `ThemeSelect.tsx` — function component with hooks
  (`useState`, `useEffect`, `useRef`). Carries the `"use client"`
  directive.
- `ThemeSelect.test.tsx` — vitest spec with one assertion per
  acceptance criterion in `spec/index.md §7` (criteria 1–13).
- `index.ts` — barrel re-export of `ThemeSelect`, `normalizeThemesUrl`,
  `themeHref`, `Props`, `ChildArgs`, and the default export.
- `spec/index.md` — canonical specification mirroring the Svelte
  counterpart's contract; spec version 0.1.0.
- `index.md` — comprehensive user guide with table of contents,
  quick start, props, custom rendering, persistence, accessibility,
  SSR, preloading, multiple-selects, recipes, troubleshooting.
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
  `multiple-selects.tsx`, `system-preference.tsx`, `lily-themes.tsx`,
  `next-cookie/` (Next.js App Router cookie SSR recipe).

### Parity with Svelte counterpart

This helper mirrors
`lily-design-system-svelte-helpers/lily-design-system-svelte-theme-select`:

- Same `<select>` + `<option>` DOM contract.
- Same `data-theme` attribute target.
- Same managed `<link data-lily-theme-select="…">` discriminator.
- Same `themeHref` URL construction.
- Same initial-value resolution order (`value` > storage >
  `defaultValue` > `"light"` > `themes[0]`).
- Same `localStorage` try/catch persistence with silent error
  swallowing.
- Same `onChange(slug)` callback firing after every apply.
- Same `ChildArgs` shape passed to the render prop.

### Differences from the Svelte counterpart

- `value` is a controlled prop, not a `$bindable()` two-way binding.
  Consumer pairs `value` + `onChange` (or omits both for uncontrolled
  mode).
- `children` is a render prop function, not a `Snippet`.
- `className` not `class`.
- The select carries `"use client"` for the React Server Components
  boundary.
- SSR recipe uses Next.js App Router `cookies()` + a client component
  wrapper, not SvelteKit's `transformPageChunk`.

### Tracking

- Package directory:
  `lily-design-system-react-helpers/lily-design-system-react-theme-select/`
- Spec version: 0.1.0
- Created: 2026-06-05
- License: MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause
- Contact: Joel Parker Henderson <joel@joelparkerhenderson.com>
