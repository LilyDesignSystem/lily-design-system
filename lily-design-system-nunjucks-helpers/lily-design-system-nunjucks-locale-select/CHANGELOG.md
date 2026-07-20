# Changelog — LocaleSelect (Nunjucks)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## Unreleased

### Changed

- Examples renamed from their radio-group-era filenames to descriptive
  ones matching the theme-select convention. None of them had rendered
  the thing its name claimed for some time:
  - `01-radios.njk` → `01-basic.njk`
  - `02-select.njk` → `02-custom-labels.njk`
  - `03-buttons.njk` → `03-custom-rendering.njk`
  - `10-combobox.njk` → `10-typeahead.njk`

  `examples/README.md` and every inbound link were updated, and the
  in-file "the filename predates the current control" disclaimers were
  dropped as no longer true.

### Changed (BREAKING — DOM contract)

- **The control is no longer a native `<select>`.** It is now an icon
  `<button>` that opens a `<ul role="listbox">`. The root element
  changes from `<select class="locale-select">` to
  `<div class="locale-select">`. Every consumer selector, test, and
  stylesheet that assumed a `<select>` / `<option>` DOM must be
  updated.
- **`placeholder` opt removed.** This supersedes the 0.3.0
  placeholder-pinning work: there is no `<select>` left to pin, and
  the closed control now shows a glyph rather than a word. The
  `.locale-select-placeholder` class hook is removed with it.
- The `name` opt now names a hidden `<input>` inside the root rather
  than the `<select>` itself, and is now also the default id prefix.
- The `{% call %}` block body now replaces the button's **glyph**
  rather than the control's options.

### Added

- Four topic guides, bringing the docs set level with theme-select's:
  `docs/macro-opts-reference.md`, `docs/custom-rendering.md`,
  `docs/recipes.md`, and `docs/troubleshooting.md`. Written for
  locale-select rather than adapted from the theme-select originals.
  The locale-specific guides (`bcp47`, `rtl`, `i18n-integration`,
  `concepts`) are unchanged; `preloading` is theme-only and has no
  locale counterpart.
- Icon button rendering U+1F310 GLOBE WITH MERIDIANS followed by
  U+FE0E VARIATION SELECTOR-15 (`&#127760;&#65038;`)
  inside an `aria-hidden="true"` span, named solely by `aria-label`.
  VS15 requests the text presentation: without it browsers reach for
  the colour-emoji font and the globe renders blue, which does not
  match theme-select's monochrome ◑ (U+25D1 is not an emoji codepoint
  and needs no selector). Verified in Chromium.
- Full WAI-ARIA APG listbox keyboard contract in
  `locale-select.client.js`: `ArrowDown` / `Enter` / `Space` open
  (`ArrowUp` opens on the last option); arrows move the active option
  and clamp without wrapping; `Home` / `End` jump; `Enter` / `Space`
  select, apply, close, and return focus; `Escape` closes without
  changing the value; `Tab` closes without stealing focus back;
  printable characters run a typeahead over the labels with a 500 ms
  buffer reset. Click-to-select, click-outside-to-close, and
  focus-out-to-close are wired too.
- Hidden `<input type="hidden" name="{name}">`, pre-filled
  server-side with the consumer-form code, preserving form
  participation.
- `id` opt (optional, string): id prefix for the listbox
  (`{id}-list`) and its options (`{id}-option-{i}`). Defaults to
  `locale-select-{name}`. Ids are deterministic and SSR-safe — no
  `Math.random`, no `Date.now`. Pass an explicit `id` when two
  instances share a `name`.
- `GLOBE_WITH_MERIDIANS` export from the client module.
- New class hooks: `.locale-select-button`, `.locale-select-icon`,
  `.locale-select-list`, `.locale-select-option`, plus the
  `[data-active]` and `[aria-selected]` state hooks. Positioning CSS
  for the listbox is the consumer's job; the package ships none. See
  [docs/styling.md](./docs/styling.md).
- Server-side selected resolution: the macro marks exactly one option
  `aria-selected="true"` (`value or defaultValue or "en" or
  locales[0]`) and pre-fills the hidden input to match.

### Regression (documented, not fixed)

- **The control does not work without JavaScript.** The button has no
  handler and the listbox renders `hidden`, so with JS disabled there
  is no way to change the locale. The previous native `<select>` was
  fully operable with no JS — it was a real form control that could be
  submitted inside a `<form>` with zero script. The only surviving
  no-JS affordance is the pre-filled hidden input, which lets a form
  submit carry a locale but does not let the user change it. Stated
  plainly in [docs/ssr.md](./docs/ssr.md), which now shows how to
  render your own `<select>` and wire it with the exported pure
  helpers if no-JS operability is required.

### Unchanged

- Options keep `lang="{tagFor(code)}"` for WCAG 3.1.2 (Language of
  Parts); the button and the listbox deliberately do not.
- `data-lily-locale-select-value` remains the sole channel by which
  `opts.value` reaches the client, and still prevents a pre-hydration
  flash.
- `lang` / `dir` application, RTL detection, `localStorage`
  persistence, `navigator.languages` detection, `onChange` (still
  receives the consumer-form code, not the BCP 47 tag), initial-value
  resolution order, SSR safety, and every exported pure helper
  (`bcp47LocaleTag`, `isRtlLocale`, `localeName`,
  `matchNavigatorLanguage`, `defaultLocaleLabels`,
  `RTL_LANGUAGE_TAGS`, `RTL_SCRIPT_SUBTAGS`).
- `initLocaleSelect(root, opts?)` and `autoInit(opts?)` keep their
  signatures and still return `{setLocale, destroy}`. `destroy()` now
  also detaches the `document` click listener.

### Documentation

- `docs/accessibility.md` rewritten. The 0.3.0 placeholder tradeoff is
  gone; three new tradeoffs are stated honestly: the accessible name
  rests entirely on `aria-label`, a custom listbox has weaker AT
  support than a native `<select>`, and the glyph may render
  differently or be missing depending on platform fonts. The
  status-region guidance is kept — the closed button shows only a
  glyph, so it matters more than before.
- `docs/ssr.md` reverses its former "client.js is progressive
  enhancement" claim, which is no longer true.

## 0.3.0 — 2026-07-20

### Changed (BREAKING — DOM contract)

- The `<select>` now always displays a component-owned placeholder
  option, so the closed control reads the literal placeholder word
  ("Locale") instead of the active locale's name. This keeps the
  control's width constant regardless of locale-name length.
- The macro renders a new leading
  `<option class="locale-select-option locale-select-placeholder"
  value="" selected>` as the FIRST child of the `<select>`. **Option
  count is now `locales.length + 1`**, the first option value is `""`,
  and per-option `lang` assertions shift by one index (the
  placeholder carries no `lang` — it is not a locale). Consumers
  asserting on option count or index will need to account for it.
- **The `<select>`'s own `value` no longer tracks the selection.**
  The client snaps `select.value` back to `""` after every apply. A
  consumer `change` listener reading `event.target.value` now sees
  `""`; use the `onChange(code)` callback or read `lang` from the
  target instead.

### Added

- `placeholder` macro opt (optional, string): text of the placeholder
  option. Defaults to `label`, so no hardcoded user-facing string is
  ever emitted. Supply it when you want a long descriptive
  `aria-label` but a short visible word.
- `.locale-select-placeholder` class hook, plus a new
  [docs/styling.md](./docs/styling.md) with the class/attribute hook
  tables and a width recipe (`field-sizing: content` / `max-width`).

### Unchanged

- `lang` / `dir` application, RTL auto-detection, `localStorage`
  persistence, `navigator.languages` detection, `onChange`,
  initial-value resolution, and SSR safety all behave exactly as
  before.

### Accessibility note

- Because the closed control always reads the placeholder, a
  screen-reader user no longer hears the active locale announced as
  the combobox value. Consumers who need that should surface the
  active locale in visible text or a polite live region — see
  [docs/accessibility.md](./docs/accessibility.md).

### Added (examples & docs)

- The compensating status region is now the **default pattern**, not a
  suggestion: the entry-point example and the `index.md` quick-start
  both ship a visible `<p class="locale-select-status" aria-live="polite">`
  using the exported `localeName()`, wired through the existing
  `autoInit({ onChange })` callback. `docs/accessibility.md` reframes
  opting *out* as the deliberate choice and keeps an explicit note that
  focusing the closed control still announces only the placeholder.

### Fixed

- Pre-hydration flash. The macro previously signalled `opts.value` by
  server-rendering `selected` on the matching real option; the browser
  honoured that over the placeholder, so the real locale name flashed
  before the client snapped it back. The initial value now travels as a
  `data-lily-locale-select-value` attribute on the `<select>` root
  (emitted only when `opts.value` is set), and the placeholder is the
  only `selected` option in the server-rendered HTML. Initial-value
  resolution order is unchanged.

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

## Unreleased

### Changed

- Default rendering changed from a single-selection group of native
  toggle controls to a native `<select>` with one
  `<option lang="{tag}">` per locale code. The `<select>` carries
  `name`, `aria-label`, and the `data-lily-locale-select-*` hooks;
  each `<option>` keeps its per-option `lang` for WCAG 3.1.2
  (Language of Parts). Keyboard interaction is now provided entirely
  by the native `<select>` (Arrow / Home / End / typeahead); the
  client.js adds no JS keyboard handlers. The former per-option
  label span is removed — the label text is now the `<option>`'s own
  text content. Matches the Svelte canonical's `<select>` rendering
  clause-for-clause.

## 0.1.0 — 2026-06-05

Initial release.

### Added

- `locale-select.njk` — Nunjucks 3 macro emitting a native
  `<select>` with one `<option>` per locale code. Single `opts`
  parameter; required keys are `label` and `locales`. Renders
  deterministic markup with `data-lily-locale-select-*`
  configuration attributes for the client.js to read. Each
  `<option>` carries `lang="{tag}"` for WCAG 3.1.2 (Language of
  Parts).
- `locale-select.client.js` — vanilla ES module owning the runtime
  lifecycle:
  - `initLocaleSelect(root, opts)` — wires one `<select>`; returns a
    `{setLocale, destroy}` controller.
  - `autoInit(opts)` — finds every
    `[data-lily-locale-select-root]` on the page and wires it.
  - `bcp47LocaleTag(code)` — pure helper, normalises `_` → `-`.
  - `isRtlLocale(code)` — pure helper, RTL script + language
    detection.
  - `localeName(code)` — pure helper, English name lookup.
  - `matchNavigatorLanguage(navLangs, locales)` — pure helper,
    two-step exact-then-prefix match.
  - Sets `lang="{tag}"` (BCP 47 hyphen form) and (by default)
    `dir="rtl|ltr"` on the resolved target element (defaults to
    `document.documentElement`).
  - Optional `storageKey` persistence to `localStorage` with
    private-mode-safe try/catch.
  - Optional `detectFromNavigator` falls back to
    `navigator.languages` on a fresh mount with no stored value.
  - `onChange(code)` callback for post-apply side effects.
- `locale-select.test.ts` — vitest suite asserting every numbered
  acceptance criterion in `spec/index.md` §7.
- `spec/index.md` — spec-driven contract, version 0.1.0.
- `locales.ts` / `locales.tsv` — built-in locale code → English-name
  table and RTL sets (436-row table; verbatim copy of the Svelte
  canonical).
- `AGENTS/` subdirectory with `api.md`, `lifecycle.md`,
  `accessibility.md`, `ssr.md`, `testing.md`.
- `docs/` subdirectory with topic guides:
  - `accessibility.md`
  - `bcp47.md`
  - `concepts.md`
  - `i18n-integration.md`
  - `rtl.md`
  - `ssr.md`
- `examples/` subdirectory:
  - `01-radios.njk` — default native `<select>` rendering.
  - `02-select.njk`
  - `03-buttons.njk`
  - `04-rtl-demo.njk`
  - `05-nhs-style.njk`
  - `06-with-eleventy-i18n.njk`
  - `07-with-intl.njk`
  - `08-ssr-cookie.njk`
  - `09-scoped-target.njk`
  - `10-combobox.njk`
  - `localeSelectCustom.njk` — helper fork that delegates the
    per-option body to a `{% call %}` block, used by examples
    02, 03, 05, and 10.
  - `README.md` — examples index.

### Conventions

- Nunjucks 3 macro syntax with a single `opts` parameter object.
- camelCase macro name (`localeSelect`); kebab-case file path
  (`locale-select.njk`) and CSS class (`locale-select`).
- Companion ES-module runtime, framework-agnostic.
- Zero runtime dependencies beyond `nunjucks` server-side and DOM
  APIs client-side.
- SSR-safe: the macro is pure; the client.js guards every DOM
  access behind `typeof document !== "undefined"`.
- Tested under vitest + jsdom; macro rendered via
  `nunjucks.renderString`.

### Parity

This is a direct port of the Svelte canonical
`lily-design-system-svelte-locale-select` v0.1.0. The DOM
contract, initial-value resolution, BCP 47 normalisation, RTL
detection, navigator matching, and apply order match clause-for-
clause.

### Notes

- The `onChange` callback prop from the Svelte canonical maps to
  the `onChange` field on the client.js init opts.
- The Svelte canonical's `children` snippet (and the Vue port's
  default scoped slot) maps to the Nunjucks `{% call %}` caller
  block. The shipped macro does not currently inspect `caller`;
  see [`examples/localeSelectCustom.njk`](./examples/localeSelectCustom.njk)
  for the fork pattern.
- The 436-row `locales.tsv` is the canonical source. The
  `locales.ts` file is generated from it; both are kept in lock-
  step with the Svelte canonical.
