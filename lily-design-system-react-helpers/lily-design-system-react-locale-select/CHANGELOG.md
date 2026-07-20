# CHANGELOG — lily-design-system-react-locale-select

## Unreleased

### Changed (harmonization with theme-select)

- **The default globe glyph gains U+FE0E VARIATION SELECTOR-15.**
  `GLOBE_WITH_MERIDIANS` is now `"\u{1F310}\uFE0E"` rather than
  `"\u{1F310}"`. VS15 requests text presentation; without it browsers
  pick the colour-emoji font and the globe renders blue, which did not
  match theme-select's monochrome `\u25D1` when the two controls sit
  together in a page header. Verified in Chromium. Consumers who
  hard-coded the old single-codepoint string in a `children` override
  should import the constant instead.
- **Examples renamed** from the radio-group era to descriptive names
  matching theme-select's convention — none of them had rendered
  radios, a select, or a button group since the listbox port:
  `01-radios` → `basic`, `02-select` → `custom-rendering`,
  `03-buttons` → `compact-glyph`, `04-rtl-demo` → `rtl-demo`,
  `05-nhs-style` → `nhs-style`, `06-with-react-intl` →
  `with-react-intl`, `07-with-react-i18next` → `with-react-i18next`,
  `08-ssr-cookie` → `ssr-cookie`, `09-scoped-target` → `scoped-target`,
  `10-combobox` → `all-locales`. All inbound links updated.

### Added (harmonization with theme-select)

- **`docs/props-reference.md`, `docs/styling.md`,
  `docs/custom-rendering.md`, `docs/recipes.md`,
  `docs/troubleshooting.md`** — the five topic guides theme-select
  already shipped, written for locale-select. The package's
  topic-specific docs (`bcp47`, `rtl`, `i18n-integration`, `concepts`)
  are unchanged; `preloading` has no locale counterpart and is
  deliberately absent.
- `index.md` no longer claims the package ships no `docs/styling.md`.

### Changed (BREAKING — DOM contract and API)

- **The control is no longer a native `<select>`.** It is now an icon
  button that opens a dropdown listbox, following the WAI-ARIA APG
  Listbox pattern. The root element is a
  `<div class="locale-select {className}">` — rest props spread onto
  that div — containing a hidden input, a
  `<button class="locale-select-button">` with `aria-haspopup="listbox"`,
  `aria-expanded`, and `aria-controls`, and a
  `<ul class="locale-select-list" role="listbox">` of
  `<li class="locale-select-option" role="option">` children. The
  button holds `<span class="locale-select-icon" aria-hidden="true">`
  carrying U+1F310 GLOBE WITH MERIDIANS (`🌐`), exported as the new
  `GLOBE_WITH_MERIDIANS` constant.
- **The `placeholder` prop is REMOVED**, along with the whole 0.3.0
  placeholder-pinning design and the `locale-select-placeholder` class
  hook. There is no `<select>` left to pin: the option count is now
  exactly `locales.length`, and the closed control shows a glyph rather
  than a word.
- **`children` changed meaning entirely.** It was a render prop that
  rendered the `<option>` elements and received
  `{ locales, value, setLocale, name, labelFor, tagFor, isRtl }`. It
  now **replaces the glyph inside the button** and receives only
  `{ value, open, labelFor }`. It no longer renders options — the
  component owns them, along with the keyboard contract. Consumers who
  used it to render a custom `<select>`, a button group, or a combobox
  must compose a different primitive.
- `name` is now the `name` of the hidden input rather than of the
  `<select>`.
- Class-hook contract: `locale-select` names the root `<div>`; the new
  hooks are `locale-select-button`, `locale-select-icon`,
  `locale-select-list`, and `locale-select-option`, plus the
  `[data-active]` and `[aria-selected]` attribute hooks.

### Added

- Full APG Listbox keyboard contract, implemented by the component
  (nothing comes from the platform now). Button: `ArrowDown` / `Enter` /
  `Space` open with the selected option active, `ArrowUp` opens with
  the last option active, and opening moves focus to the list. List:
  `ArrowDown` / `ArrowUp` move the active option and **clamp** rather
  than wrap, `Home` / `End` jump to the ends, `Enter` / `Space` select
  and return focus to the button, `Escape` closes without changing the
  value, `Tab` closes without stealing focus back, and printable
  characters run a typeahead over the option labels with a 500 ms
  buffer reset. Clicking an option selects it; clicking outside or
  moving focus out closes the list.
- `GLOBE_WITH_MERIDIANS` export (U+1F310, the default button glyph).
- Option and list ids derive from React's `useId`, so they are stable
  across server and client render and hydration-safe.

### Unchanged

- The behaviour contract: `lang` + `dir` application to the target,
  RTL / bidi detection, `localStorage` persistence,
  `navigator.languages` detection, `onChange` (still called with the
  consumer-form code, not the BCP 47 form), initial-value resolution
  (`value` > storage > navigator > `defaultValue` > `"en"` >
  `locales[0]`), `applyDir`, `target`, and SSR safety.
- The exported pure helpers `bcp47LocaleTag`, `isRtlLocale`,
  `localeName`, `matchNavigatorLanguage`, `defaultLocaleLabels`,
  `RTL_LANGUAGE_TAGS`, and `RTL_SCRIPT_SUBTAGS`.
- Per-option `lang` in BCP 47 hyphen form, for WCAG 3.1.2 (Language of
  Parts). The button and the list carry no `lang` of their own.

### Accessibility note

- The tradeoffs changed rather than disappeared. An icon-only button
  depends entirely on `aria-label` (the `label` prop) for its
  accessible name; a custom listbox has weaker assistive-technology
  support than a native `<select>`, since it depends on correct
  `aria-activedescendant` handling rather than platform-level
  treatment; and the globe glyph is font-dependent (it may render
  differently, as a box, or not at all) as well as culturally loaded,
  since a globe is not a universal symbol for "language". Consumers
  who need certainty should supply their own `children` glyph or an
  SVG.
- The status-region pattern is retained and is arguably more important
  now: the closed button shows only a glyph and never announces the
  active language. `docs/accessibility.md` carries the full discussion.

## 0.3.0 — 2026-07-20

### Added

- `placeholder` prop (optional, `string`, defaults to `label`): the text
  of the always-displayed placeholder option. Keeps the package
  i18n-clean — no hardcoded user-facing string is ever emitted.
- `locale-select-placeholder` class hook on the placeholder `<option>`
  (alongside `locale-select-option`).

### Changed (BREAKING — DOM contract)

- The `<select>` now renders a placeholder `<option value="">` as its
  **first child**, in both the default and the custom-`children` code
  paths. Option count is therefore `locales.length + 1` and the option
  value list is `["", ...locales]`. Consumers asserting on option
  counts or indices must account for the leading placeholder — notably,
  the per-option `lang` attributes now start at index 1.
- The `<select>`'s own `value` is pinned to `""` and no longer tracks
  the active locale. After every change the DOM selection snaps back to
  the placeholder, so the closed control always reads
  `placeholder ?? label` and stays as narrow as that word.

### Unchanged

- The behaviour contract: the resolved selection still lives in `value`
  / internal state, and `lang` / `dir` application, optional
  `localStorage` persistence, `navigator.language` detection,
  `onChange`, initial-value resolution, and SSR safety are all as in
  0.2.0. The placeholder carries no `lang` — it is not a locale.

### Accessibility note

- Because the closed control always reads the placeholder,
  screen-reader users no longer hear the active locale announced as the
  combobox value. The document root's `lang` still reflects it, so
  voice switching is unaffected. Consumers who need the selection
  announced should surface it separately — as visible text or via a
  polite live region. See `docs/accessibility.md`.

### Added (examples & docs)

- The compensating status region is now the **default pattern**, not a
  suggestion: the entry-point example and the `index.md` quick-start both
  ship a visible `<p class="locale-select-status" aria-live="polite">`
  showing the active locale via the exported `localeName`.
  `aria-live="polite"` announces mutations only, so it stays silent on
  first paint and speaks on each change. `docs/accessibility.md`
  reframes opting *out* as the deliberate choice and keeps an explicit
  "what this does and does not fix" note — the region announces
  transitions, it does not restore combobox value semantics.

## 0.2.0 — 2026-07-03

### Changed (BREAKING)

- Migrated from the radio-group "picker" rendering to a native
  `<select>` (landed in-tree 2026-06-17): the root element is now
  `<select class="locale-select">` with one `<option class="locale-select-option">`
  per choice, replacing the former `<fieldset role="radiogroup">` with
  `<input type="radio">` children. The package was renamed from the
  `*-picker` name to `*-select` accordingly.
- Class-hook contract changed: `locale-select` now names the `<select>` root
  and `locale-select-option` is the only sub-class; the radio/label sub-class
  hooks are gone.
- Keyboard interaction is the native `<select>` contract (Arrow keys,
  Home / End, first-letter typeahead) instead of radio-group cycling.
- Custom rendering (snippet / render prop / slot / template) now renders
  `<option>` elements inside the `<select>`.

### Unchanged

- The behaviour contract: DOM application (`lang` / `dir`), optional
  `localStorage` persistence, SSR safety, and the no-hardcoded-strings
  i18n rule are as in 0.1.0.

## [0.1.0] — 2026-06-05

### Added

- Initial implementation of `LocaleSelect` for React 19.
- `LocaleSelect.tsx` — function component with hooks
  (`useState`, `useEffect`, `useRef`). Carries the `"use client"`
  directive. Writes `lang` (BCP 47 hyphen form) and `dir` (`"rtl"` /
  `"ltr"`) to a target element (defaults to `document.documentElement`).
- `LocaleSelect.test.tsx` — vitest spec with one assertion per
  acceptance criterion in `spec/index.md §7`. Covers pure helpers, the
  markup contract, the DOM apply contract, persistence, custom
  `target`, `applyDir={false}`, `children` render prop, navigator
  detection, and rest-prop spread.
- `locales.ts` — 436-row built-in table mapping locale code →
  English name. Also exports `RTL_LANGUAGE_TAGS` and
  `RTL_SCRIPT_SUBTAGS` for the RTL detection algorithm. Byte-identical
  to the Svelte counterpart.
- `locales.tsv` — canonical 436-row source for `locales.ts`. Byte-
  identical to the Svelte counterpart.
- `index.ts` — barrel re-export of `LocaleSelect`, the pure helpers
  (`bcp47LocaleTag`, `isRtlLocale`, `localeName`,
  `matchNavigatorLanguage`), the static data exports
  (`defaultLocaleLabels`, `RTL_LANGUAGE_TAGS`, `RTL_SCRIPT_SUBTAGS`),
  the `Props` and `ChildArgs` types, and the default export.
- `spec/index.md` — canonical specification mirroring the Svelte
  counterpart's contract; spec version 0.1.0.
- `index.md` — comprehensive user guide with table of contents,
  quick start, props, custom rendering, persistence, navigator
  detection, RTL, accessibility, SSR, i18n integration, recipes,
  troubleshooting.
- `AGENTS.md` — AI-coding entrypoint.
- `AGENTS/` — five topic files for AI agents:
  `api.md`, `lifecycle.md`, `accessibility.md`, `ssr.md`, `testing.md`.
- `docs/` — six topic guides for humans:
  `accessibility.md`, `bcp47.md`, `concepts.md`,
  `i18n-integration.md`, `rtl.md`, `ssr.md`.
- `examples/` — ten runnable examples plus a `README.md` index:
  `01-radios.tsx`, `02-select.tsx`, `03-buttons.tsx`,
  `04-rtl-demo.tsx`, `05-nhs-style.tsx`, `06-with-react-intl.tsx`,
  `07-with-react-i18next.tsx`, `08-ssr-cookie.tsx`,
  `09-scoped-target.tsx`, `10-combobox.tsx`.

### Parity with Svelte counterpart

This helper mirrors
`lily-design-system-svelte-helpers/lily-design-system-svelte-locale-select`:

- Same native `<select>` DOM contract.
- Same per-option `<option lang={tagFor(locale)}>` for WCAG 3.1.2.
- Same `lang` + `dir` apply target (default `document.documentElement`).
- Same BCP 47 hyphen-form normalisation on the wire.
- Same RTL detection algorithm (`RTL_LANGUAGE_TAGS` ∪ `RTL_SCRIPT_SUBTAGS`).
- Same initial-value resolution order (`value` > storage > navigator >
  `defaultValue` > `"en"` > `locales[0]`).
- Same `localStorage` try/catch persistence with silent error
  swallowing.
- Same `onChange(code)` callback firing after every apply, with
  consumer-form code (not BCP 47-normalised).
- Same `ChildArgs` shape passed to the render prop:
  `{ locales, value, setLocale, name, labelFor, tagFor, isRtl }`.
- Same `defaultLocaleLabels` 436-row table (byte-identical
  `locales.tsv`).

### Differences from the Svelte counterpart

- `value` is a controlled prop paired with `onChange`, not a
  `$bindable()` two-way binding.
- `children` is a render prop function `(args: ChildArgs) => ReactNode`,
  not a `Snippet`.
- `className` not `class`.
- The select carries `"use client"` for the React Server Components
  boundary.
- SSR recipe uses Next.js App Router `cookies()` + a client component
  wrapper, not SvelteKit's `transformPageChunk`.
- Hooks (`useState`, `useEffect`, `useRef`) replace runes (`$state`,
  `$effect`, `$bindable`).
- `i18n-integration.md` covers the four common React i18n stacks
  (`react-intl`, `react-i18next`, Lingui, raw `Intl.*`) rather than the
  Svelte-specific four (`svelte-i18n`, Paraglide, Tolgee, raw `Intl.*`).

### Tracking

- Package directory:
  `lily-design-system-react-helpers/lily-design-system-react-locale-select/`
- Spec version: 0.1.0
- Created: 2026-06-05
- License: MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause
- Contact: Joel Parker Henderson <joel@joelparkerhenderson.com>
