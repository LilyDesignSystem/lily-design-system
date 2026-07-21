# Changelog — ThemeChooser (Nunjucks)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## 0.1.0 — 2026-07-21

First release under the name `lily-design-system-nunjucks-theme-chooser`.
The package was renamed from `lily-design-system-nunjucks-theme-select`;
because no release has ever been published under the new name, the
version restarts at 0.1.0 rather than continuing the old 0.4.0 line.

The rename also retires a real collision: `theme-chooser` is the slug of
a catalog component in `components.tsv`, and the helper shared its
`.theme-chooser` class hook while being a completely different control.
`theme-chooser` is unambiguous.

### The package as it stands

- **`theme-chooser.njk`** — the `themeChooser(opts)` macro. Renders a
  `<div class="theme-chooser">` root containing a hidden `<input>`, a
  glyph-only `<button class="theme-chooser-button">` (U+25D1), and a
  `<ul class="theme-chooser-list" role="listbox" hidden>` of
  `<li class="theme-chooser-option" role="option">`. Ids default to
  `theme-chooser-{name}`; every server-rendered instance marks exactly
  one option `aria-selected="true"`.
- **`theme-chooser.client.js`** — the runtime. Owns open/close, focus,
  the keyboard contract, `localStorage` persistence, system
  colour-scheme detection, and swapping the managed
  `<link data-lily-theme-chooser="{name}">`. Exports
  `initThemeChooser`, `autoInit`, `themeName`, `matchSystemTheme`,
  `normaliseThemesUrl`, `themeHref`, and
  `CIRCLE_WITH_RIGHT_HALF_BLACK`.
- **DOM hooks** — `data-lily-theme-chooser-root`, `-name`, `-themes-url`,
  `-extension`, `-storage-key`, `-default-value`, `-detect-from-system`,
  `-value`, `-input`, `-button`, `-list`.
- **`theme-chooser.test.ts`** — 61 vitest cases mapped onto the clauses
  of `spec/index.md`.

---

## Prior history — released in-tree as `lily-design-system-nunjucks-theme-select`

The entries below record this package's development under its
former name. Nothing was ever published under the
`lily-design-system-nunjucks-theme-chooser` name before 0.1.0 above,
so these version numbers do not describe releases of the current
package. They are kept because the DOM contract, keyboard
behaviour and breaking changes they describe are still the ones
in force.

### Unreleased

#### Added

- A one-time `console.warn` when `value` and a stored theme disagree,
  naming both and the version the precedence reversed in. The order flip
  below is otherwise silent for exactly the consumers it affects — those
  setting both `value` and `storageKey` — so it is surfaced at runtime
  rather than left to be discovered. No warning when the two agree, when
  only one is set, or on any other path.

#### Changed (BREAKING — initial-value resolution order)

- **`opts.value` now beats `localStorage`.** The initial-theme
  resolution order changes from

  ```
  storage > value > defaultValue > "light" > first
  ```

  to

  ```
  value > storage > system detection > defaultValue > "light" > first
  ```

  **Who is affected.** Any consumer that passes `opts.value` *and*
  sets `storageKey`. If you set only one of the two, nothing changes
  for you.

  **What was wrong.** `opts.value` is how a Nunjucks consumer passes a
  theme they already resolved on the server — from a cookie, a
  session, a signed-in user's stored preference. That is precisely the
  case this catalog exists to serve. Storage-first silently overrode
  it with whatever was left in `localStorage`, so a user who changed
  their theme on another device, or whose account preference was
  updated server-side, got the stale local value and the consumer had
  no way to win short of clearing storage themselves. Every other Lily
  helper — the canonical Svelte one, and every locale-chooser in every
  catalog — already resolved value-first; nunjucks-theme-chooser was
  the lone outlier.

  **Migration.** If you relied on storage outranking a passed value,
  make it explicit at the call site: read `localStorage` in your own
  page script and pass the result as `opts.value`. Consumers who set
  `storageKey` and pass no `opts.value` need no change — storage is
  still the next input consulted, so a returning visitor with a saved
  choice and no server-resolved theme lands exactly where they did
  before.

  The old rationale in `AGENTS/lifecycle.md` ("a user who picked dark
  two weeks ago should land on dark today") has been rewritten rather
  than left contradicting the code.

#### Changed (BREAKING — DOM contract)

- **The control is no longer a native `<select>`.** It is now an icon
  `<button>` that opens a `<ul role="listbox">`. The root element
  changes from a `<select>` to a
  `<div>`, both carrying the `theme-chooser` hook. Every consumer selector, test, and
  stylesheet that assumed a `<select>` / `<option>` DOM must be
  updated.
- **`placeholder` opt removed.** This supersedes the 0.3.0
  placeholder-pinning work: there is no `<select>` left to pin, and
  the closed control now shows a glyph rather than a word. The
  `.theme-chooser-placeholder` class hook is removed with it.
- The `name` opt now names a hidden `<input>` inside the root rather
  than the `<select>` itself. It still discriminates the managed
  `<link data-lily-theme-chooser="{name}">`, and it is now also the
  default id prefix.
- The `{% call %}` block body now replaces the button's **glyph**
  rather than the control's options.

#### Added

- `themeName(slug)` export on `theme-chooser.client.js`:
  `"high-contrast"` → `"High Contrast"`. Mirrors locale-chooser's
  `localeName(code)`, and replaces the title-casing rule that examples
  across the catalogs had been hand-duplicating. The macro applies the
  same rule in template syntax — a Nunjucks macro cannot call into the
  client module — and a test asserts the two agree for every slug.
- `detectFromSystem` opt (boolean, default `false`) plus the
  `matchSystemTheme(themes)` export. Mirrors locale-chooser's
  `detectFromNavigator` / `matchNavigatorLanguage`. Reads
  `matchMedia("(prefers-color-scheme: dark)")`, maps to `"dark"` /
  `"light"`, and returns `""` when that slug is not among the rendered
  options or when `matchMedia` is unavailable. It resolves in the
  client only — there is no `matchMedia` at Nunjucks render time — so
  the macro emits `data-lily-theme-chooser-detect-from-system` and its
  server-rendered `aria-selected` continues to resolve from
  `value or defaultValue or "light" or themes[0]`. See spec §5.8.
- Icon button rendering U+25D1 CIRCLE WITH RIGHT HALF BLACK
  (`&#9681;`) inside an `aria-hidden="true"` span, named solely by
  `aria-label`.
- Full WAI-ARIA APG listbox keyboard contract in
  `theme-chooser.client.js`: `ArrowDown` / `Enter` / `Space` open (
  `ArrowUp` opens on the last option); arrows move the active option
  and clamp without wrapping; `Home` / `End` jump; `Enter` / `Space`
  select, apply, close, and return focus; `Escape` closes without
  changing the value; `Tab` closes without stealing focus back;
  printable characters run a typeahead over the labels with a 500 ms
  buffer reset. Click-to-select, click-outside-to-close, and
  focus-out-to-close are wired too.
- Hidden `<input type="hidden" name="{name}">`, pre-filled
  server-side, preserving form participation.
- `id` opt (optional, string): id prefix for the listbox
  (`{id}-list`) and its options (`{id}-option-{i}`). Defaults to
  `theme-chooser-{name}`. Ids are deterministic and SSR-safe — no
  `Math.random`, no `Date.now`. Pass an explicit `id` when two
  instances share a `name`.
- `CIRCLE_WITH_RIGHT_HALF_BLACK` export from the client module.
- New class hooks: `.theme-chooser-button`, `.theme-chooser-icon`,
  `.theme-chooser-list`, `.theme-chooser-option`, plus the
  `[data-active]` and `[aria-selected]` state hooks. Positioning CSS
  for the listbox is the consumer's job; the package ships none. See
  [docs/styling.md](./docs/styling.md).
- Server-side selected resolution: the macro marks exactly one option
  `aria-selected="true"` (`value or defaultValue or "light" or
  themes[0]`) and pre-fills the hidden input to match.

#### Regression (documented, not fixed)

- **The control does not work without JavaScript.** The button has no
  handler and the listbox renders `hidden`, so with JS disabled there
  is no way to change the theme. The previous native `<select>` was
  fully operable with no JS. The only surviving no-JS affordance is
  the pre-filled hidden input, which lets a form submit carry a theme.
  Stated plainly in [docs/ssr.md](./docs/ssr.md); consumers who need
  no-JS operability should use the headless catalog's plain
  `theme-chooser` `<select>` container instead.

#### Unchanged

- `data-lily-theme-chooser-value` remains the sole channel by which
  `opts.value` reaches the client, and still prevents a pre-hydration
  flash.
- `data-theme` application, the managed `<link>` swap, `localStorage`
  persistence, `onChange`, initial-value resolution order, SSR safety,
  and the exported pure helpers `normaliseThemesUrl` / `themeHref`.
- `initThemeChooser(root, opts?)` and `autoInit(opts?)` keep their
  signatures and still return `{setTheme, destroy}`. `destroy()` now
  also detaches the `document` click listener.

#### Documentation

- `docs/accessibility.md` rewritten. The 0.3.0 placeholder tradeoff is
  gone; three new tradeoffs are stated honestly: the accessible name
  rests entirely on `aria-label`, a custom listbox has weaker AT
  support than a native `<select>`, and the glyph may render
  differently or be missing depending on platform fonts. The
  status-region guidance is kept — the closed button shows only a
  glyph, so it matters more than before.

### 0.3.0 — 2026-07-20

#### Changed (BREAKING — DOM contract)

- The `<select>` now always displays a component-owned placeholder
  option, so the closed control reads the literal placeholder word
  ("Theme") instead of the active theme's name. This keeps the
  control's width constant regardless of theme-name length.
- The macro renders a new leading
  `<option class="theme-chooser-option theme-chooser-placeholder"
  value="" selected>` as the FIRST child of the `<select>`. **Option
  count is now `themes.length + 1`** and the first option value is
  `""`. Consumers asserting on option count or index will need to
  account for it.
- **The `<select>`'s own `value` no longer tracks the selection.**
  The client snaps `select.value` back to `""` after every apply. A
  consumer `change` listener reading `event.target.value` now sees
  `""`; use the `onChange(slug)` callback or read `data-theme` from
  the target instead.

#### Added

- `placeholder` macro opt (optional, string): text of the placeholder
  option. Defaults to `label`, so no hardcoded user-facing string is
  ever emitted. Supply it when you want a long descriptive
  `aria-label` but a short visible word.
- `.theme-chooser-placeholder` class hook, plus a width recipe
  (`field-sizing: content` / `max-width`) in
  [docs/styling.md](./docs/styling.md).

#### Unchanged

- `data-theme` application, the managed `<link>` swap, `localStorage`
  persistence, `onChange`, initial-value resolution, and SSR safety
  all behave exactly as before.

#### Accessibility note

- Because the closed control always reads the placeholder, a
  screen-reader user no longer hears the active theme announced as the
  combobox value. Consumers who need that should surface the active
  theme in visible text or a polite live region — see
  [docs/accessibility.md](./docs/accessibility.md).

#### Added (examples & docs)

- The compensating status region is now the **default pattern**, not a
  suggestion: the basic example and the `index.md` quick-start both ship
  a visible `<p class="theme-chooser-status" aria-live="polite">` wired
  through the existing `autoInit({ onChange })` callback.
  `docs/accessibility.md` reframes opting *out* as the deliberate choice
  and keeps an explicit note that focusing the closed control still
  announces only the placeholder.

#### Fixed

- Pre-hydration flash. The macro previously signalled `opts.value` by
  server-rendering `selected` on the matching real option; the browser
  honoured that over the placeholder, so the real theme name flashed
  before the client snapped it back. The initial value now travels as a
  `data-lily-theme-chooser-value` attribute on the `<select>` root
  (emitted only when `opts.value` is set), and the placeholder is the
  only `selected` option in the server-rendered HTML. Initial-value
  resolution order is unchanged.

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

Initial release.

#### Added

- `theme-chooser.njk` — Nunjucks 3 macro emitting a native
  `<select class="theme-chooser">` with one
  `<option class="theme-chooser-option">` per theme slug. Single
  `opts` parameter; required keys are `label`, `themesUrl`, `themes`.
  Renders deterministic markup with `data-lily-theme-chooser-*`
  configuration attributes for the client.js to read.
- `theme-chooser.client.js` — vanilla ES module owning the runtime
  lifecycle:
  - `initThemeChooser(root, opts)` — wires one `<select>`; returns a
    `{setTheme, destroy}` controller.
  - `autoInit(opts)` — finds every
    `[data-lily-theme-chooser-root]` on the page and wires it.
  - `normaliseThemesUrl(url)` and
    `themeHref(url, slug, extension)` — pure URL helpers.
  - Manages a single
    `<link rel="stylesheet" data-lily-theme-chooser="{name}">` in
    `document.head` and swaps its `href` on each apply.
  - Sets `data-theme="{slug}"` on the resolved target element
    (defaults to `document.documentElement`).
  - Optional `storageKey` persistence to `localStorage` with
    private-mode-safe try/catch.
  - `onChange(slug)` callback for post-apply side effects.
- `theme-chooser.test.ts` — vitest suite asserting every numbered
  acceptance criterion in `spec/index.md` §7 (13 items + extras).
- `spec/index.md` — spec-driven contract, version 0.1.0.
- `AGENTS/` subdirectory with `api.md`, `lifecycle.md`,
  `accessibility.md`, `testing.md`, `ssr.md`.
- `docs/` subdirectory with topic guides:
  - `accessibility.md`
  - `custom-rendering.md`
  - `preloading.md`
  - `macro-opts-reference.md`
  - `recipes.md`
  - `ssr.md` (Eleventy / Express / Workers notes)
  - `styling.md`
  - `troubleshooting.md`
- `examples/` subdirectory:
  - `01-basic.njk`
  - `02-custom-labels.njk`
  - `03-multiple-selects.njk`
  - `04-persistence.njk`
  - `05-preloaded.njk`
  - `06-system-preference.njk`
  - `07-two-way-binding.njk`
  - `08-lily-themes.njk`
  - `09-custom-rendering.njk` (with companion
    `themeChooserCustom.njk`)
  - `eleventy-cookie/` end-to-end recipe with
    `_includes/base.njk`, `_data/site.js`, `index.njk`,
    `functions/_middleware.js`, `functions/api/theme.js`.

#### Conventions

- Nunjucks 3 macro syntax with a single `opts` parameter object.
- camelCase macro name (`themeChooser`); kebab-case file path
  (`theme-chooser.njk`) and CSS class (`theme-chooser`).
- Companion ES-module runtime, framework-agnostic.
- Zero runtime dependencies beyond `nunjucks` server-side and DOM
  APIs client-side.
- SSR-safe: the macro is pure; the client.js guards every DOM
  access behind `typeof document !== "undefined"`.
- Tested under vitest + jsdom; macro rendered via
  `nunjucks.renderString`.

#### Parity

This is a direct port of the Svelte canonical
`lily-design-system-svelte-theme-chooser` v0.1.0 and the Vue port
`lily-design-system-vue-theme-chooser` v0.1.0. The DOM contract,
managed-link discriminator, initial-value resolution, and apply
order match clause-for-clause.

#### Notes

- The `onChange` callback prop from the Svelte canonical maps to
  the `onChange` field on the client.js init opts.
- The `children` snippet from Svelte (and the default scoped slot
  from Vue) maps to the Nunjucks `{% call %}` caller block. The
  shipped macro does not currently inspect `caller`; see
  [`docs/custom-rendering.md`](./docs/custom-rendering.md) for the
  fork pattern.
