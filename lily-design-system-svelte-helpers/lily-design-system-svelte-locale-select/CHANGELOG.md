# Changelog — LocaleSelect (Svelte)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## Unreleased

### Changed (BREAKING)

- **The control is no longer a native `<select>`.** It is now an icon
  button that opens a WAI-ARIA APG listbox. The root is a `<div
  class="locale-select">` containing a hidden input, a `<button
  class="locale-select-button">` showing a globe glyph, and a `<ul
  class="locale-select-list" role="listbox">` of `<li
  class="locale-select-option" role="option">` children.
- **`placeholder` prop removed.** It existed in 0.3.0 to name the
  pinned option of the native `<select>`. There is no `<select>` and no
  pinned option, so the prop is gone; passing it now falls through
  `restProps` onto the root `<div>` as a stray attribute. This
  supersedes the whole 0.3.0 placeholder-pinning design.
- **`ChildArgs` changed shape, and `children` changed meaning.** It was
  `{ locales, value, setLocale, name, labelFor, tagFor, isRtl }` and
  rendered `<option>` elements. It is now `{ value, open, labelFor }`
  and **replaces the glyph inside the trigger button**. The listbox and
  its options are component-owned. `tagFor` and `isRtl` live on as the
  exported pure helpers `bcp47LocaleTag` and `isRtlLocale`.

  This removes a capability, not just an API: the snippet's output now
  lives inside a `<button>`, so the radio-group, button-group, custom
  `<select>`, and `<datalist>`-combobox patterns the old examples built
  are no longer possible. Consumers wanting those read `value` and
  drive their own controls.
- **Class hooks changed.** `locale-select` now names the root `<div>`,
  not a `<select>`. Added: `locale-select-button`,
  `locale-select-icon`, `locale-select-list`. Removed:
  `locale-select-placeholder`. `locale-select-option` survives but now
  names an `<li>`, not an `<option>`.
- **Keyboard interaction is implemented by the component**, not
  inherited from the platform. See `spec/index.md` §6.2 — button keys
  (`Enter` / `Space` / `ArrowDown` open, `ArrowUp` opens at the last
  option) and listbox keys (arrows clamp rather than wrap, `Home` /
  `End`, `Enter` / `Space` select-and-close, `Escape` closes without
  changing, `Tab` closes without stealing focus, 500 ms typeahead over
  the labels).
- **Consumers must now ship positioning CSS** for
  `.locale-select-list`, including a `[hidden] { display: none }`
  reset, and it must use **logical properties** — this control flips
  the page to RTL, so a popup pinned with `left: 0` lands on the wrong
  edge exactly when the feature is exercised. See `docs/styling.md`.
- The `field-sizing: content` width recipe is obsolete along with the
  `<select>` it sized.

### Changed

- **The globe glyph gains U+FE0E VARIATION SELECTOR-15.**
  `GLOBE_WITH_MERIDIANS` is now `"\u{1F310}︎"`, not
  `"\u{1F310}"`. VS15 requests text presentation; without it browsers
  pick the colour-emoji font and the globe renders blue, which does not
  match `theme-select`'s monochrome `◑` when the two sit together in a
  page header. Verified in Chromium. Tests assert the full
  two-codepoint sequence.

### Added

- A hidden `<input type="hidden" name="{name}">` preserving form
  participation now that there is no native form control. It carries
  the consumer-form code, not the BCP 47 tag.
- `GLOBE_WITH_MERIDIANS` glyph constant and `nextLocaleSelectId()` (an
  SSR-safe incrementing id generator) on the module script.

### Added (docs and examples)

- Five shared topic guides, so this package offers the same doc set as
  `theme-select` rather than a subset: `docs/props-reference.md`,
  `docs/styling.md`, `docs/custom-rendering.md`, `docs/recipes.md`,
  `docs/troubleshooting.md`. Each is written for locale-select — RTL-safe
  CSS, endonyms, BCP 47 round-tripping, the typeahead-matches-labels
  trap — rather than adapted from the theme-select copy. The
  locale-specific guides (`bcp47`, `concepts`, `i18n-integration`,
  `rtl`) are unchanged in scope; `theme-select`'s `preloading.md` has
  no counterpart here and none was invented.
- **Examples renamed off the radio-group era.** `01-radios`,
  `02-select`, and `03-buttons` had not rendered radios, a `<select>`,
  or a button group for some time; the numeric prefixes had stopped
  describing anything. They now use descriptive names matching
  `theme-select`'s convention:

  | Old | New |
  | --- | --- |
  | `01-radios.svelte` | `basic.svelte` |
  | `02-select.svelte` | `many-locales.svelte` |
  | `03-buttons.svelte` | `custom-rendering.svelte` |
  | `04-rtl-demo.svelte` | `rtl-demo.svelte` |
  | `05-nhs-style.svelte` | `nhs-style.svelte` |
  | `06-with-svelte-i18n.svelte` | `with-svelte-i18n.svelte` |
  | `07-with-paraglide.svelte` | `with-paraglide.svelte` |
  | `08-ssr-cookie.svelte` | `ssr-cookie.svelte` |
  | `09-scoped-target.svelte` | `scoped-target.svelte` |
  | `10-combobox.svelte` | `persistence.svelte` |

  Four were rewritten rather than merely renamed, because the pattern
  each demonstrated is no longer possible: `many-locales` now shows a
  long list in the default listbox, `custom-rendering` shows the glyph
  override, `nhs-style` uses the default listbox with a `class` hook,
  and `persistence` replaces the `<datalist>` combobox with
  `storageKey` + `detectFromNavigator`.

### Changed (accessibility)

- **The 0.3.0 placeholder tradeoff is gone.** There is no pinned
  select, and the listbox marks the active option with
  `aria-selected="true"`, so the selection *is* exposed to assistive
  technology.
- Three new tradeoffs are documented honestly in
  `docs/accessibility.md`: (a) an icon-only control's accessible name
  rests entirely on `aria-label` — which for a *locale* select is
  circular, since the label is written in one language and this is the
  control a user reaches for when they cannot read the page;
  (b) a hand-rolled listbox has weaker assistive-technology and mobile
  support than a native `<select>` — **for some audiences, public-service
  ones especially, a native `<select>` is the better choice**, and a
  hand-written one is about fifteen lines; (c) the glyph is a
  font-dependent character that may render in colour despite VS15,
  substitute, or not render at all.
- The `.locale-select-status` live region is still recommended, but for
  a different reason: it no longer compensates for missing semantics,
  it compensates for the *closed* control showing only a glyph — which
  matters more here than for a theme select, because the active locale
  is only self-evident to someone who can already read the page.

### Unchanged

- Everything downstream: `lang` / `dir` application, RTL detection,
  `localStorage` persistence, `navigator.languages` detection,
  `onChange`, initial-value resolution, SSR safety, and all the
  exported pure helpers (`bcp47LocaleTag`, `isRtlLocale`, `localeName`,
  `matchNavigatorLanguage`, `defaultLocaleLabels`, `RTL_LANGUAGE_TAGS`,
  `RTL_SCRIPT_SUBTAGS`).
- Per-option `lang` attributes, now on the `<li role="option">`
  elements.
- `locales.ts` / `locales.tsv` are untouched and remain byte-identical
  across every port.
- Still ships zero CSS, no fonts, no icons, no images.

## 0.3.0 — 2026-07-20

### Changed (BREAKING)

- The closed `<select>` now always displays a placeholder word ("Locale")
  instead of the active locale name, so the control is only ever as wide
  as that word rather than as wide as the longest locale name. A leading
  `<option class="locale-select-option locale-select-placeholder" value="">`
  is always rendered, and the element's own selection snaps back to it
  after every change.
- DOM contract changes accordingly: the option count is now
  `locales.length + 1`, the first option's `value` is `""` and it carries
  no `lang` attribute, and the `<select>` element's own `value` no longer
  tracks the active locale — it stays `""`. Consumers reading
  `selectEl.value` must read the bindable `value` prop instead.
- Accessibility tradeoff: the active locale is no longer announced as the
  combobox value. See [docs/accessibility.md](./docs/accessibility.md)
  for how to surface it separately — this matters more for locale than
  for most controls.

### Added

- `placeholder` prop (optional, string, defaults to `label`) — the text
  of the placeholder option.

### Unchanged

- `value` remains the single source of truth and stays two-way bindable;
  `lang` / `dir` application, `localStorage` persistence,
  `navigator.languages` detection, `onChange`, and initial-value
  resolution all behave exactly as before.
- Per-option `lang` attributes are unchanged on the locale options.
- Still ships zero CSS. The width recipe lives in the root `themes/`
  stylesheets.

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

## 0.1.0 — 2026-06-05

Initial release. This is the **canonical reference implementation**
for Lily's locale select; the Vue, React, Angular, Blazor, Nunjucks,
and HTML ports port from this contract clause-for-clause.

### Added

- `LocaleSelect.svelte` — Svelte 5 component using runes throughout
  (`$props`, `$bindable`, `$effect`). Implements:
  - Renders `<select aria-label="…" name="…">` with one
    `<option lang="{tagFor(locale)}">` per locale code per WCAG 3.1.2
    (Language of Parts).
  - Sets `lang="{bcp47LocaleTag(code)}"` on the resolved target
    element (defaults to `document.documentElement`).
  - Sets `dir="rtl"` / `dir="ltr"` on the target element via
    `isRtlLocale()` auto-detection. Opt-out via `applyDir={false}`.
  - Optional `storageKey` persistence to `localStorage` with
    private-mode-safe try/catch.
  - Optional `detectFromNavigator` first-visit fallback via
    `navigator.languages`.
  - Two-way binding via `bind:value` on a `$bindable("")` prop.
  - `onChange` callback for post-apply side effects.
  - `children` snippet for custom rendering with
    `{ locales, value, setLocale, name, labelFor, tagFor, isRtl }`.
- `locales.ts` — 436-row built-in locale-code → English-name table
  plus RTL language and script subtag sets.
- `locales.tsv` — canonical source for `locales.ts`.
- `index.ts` barrel re-exporting `default`, `LocaleSelect`,
  `bcp47LocaleTag`, `isRtlLocale`, `localeName`,
  `matchNavigatorLanguage`, `defaultLocaleLabels`,
  `RTL_LANGUAGE_TAGS`, `RTL_SCRIPT_SUBTAGS`, and the `Props` +
  `ChildArgs` types.
- `LocaleSelect.test.ts` — vitest suite asserting every numbered
  acceptance criterion in `spec/index.md` §7 (23 items). The markup-contract
  tests assert a `<select>` with `<option>` children.
- `spec/index.md` — spec-driven contract, version 0.1.0.
- `AGENTS.md` — fast-index pointer for AI agents.
- `AGENTS/` subdirectory with `api.md`, `lifecycle.md`,
  `accessibility.md`, `ssr.md`, `testing.md`.
- `docs/` subdirectory with topic guides: `accessibility.md`,
  `bcp47.md`, `concepts.md`, `i18n-integration.md`, `rtl.md`,
  `ssr.md`.
- `examples/` subdirectory: `01-radios.svelte`, `02-select.svelte`,
  `03-buttons.svelte`, `04-rtl-demo.svelte`,
  `05-nhs-style.svelte`, `06-with-svelte-i18n.svelte`,
  `07-with-paraglide.svelte`, `08-ssr-cookie.svelte`,
  `09-scoped-target.svelte`, `10-combobox.svelte`, plus a
  `README.md` index.

### Conventions

- **Svelte 5 runes** throughout. No legacy `export let`, no `$:`,
  no `createEventDispatcher`.
- **TypeScript** on the public surface. `Props` and `ChildArgs`
  exported from a `<script lang="ts" module>` block.
- **Zero runtime dependencies** beyond `svelte`.
- **SSR-safe** — all DOM writes inside `$effect`.
- **No `<style>` block** — consumer styles the `locale-select`
  class hook.
- **Tested** under vitest + jsdom + `@testing-library/svelte`.

### Notes

- The canonical reference catalog for the framework-helper layer.
  Vue, React, Angular, Blazor, Nunjucks, and HTML ports adopt this
  contract; differences are documented in each port's CHANGELOG.
- The `onChange` callback prop maps to a Vue event, a React
  `onChange` prop, an Angular `(change)` output, etc.
- The `children` snippet maps to a Vue default scoped slot, a React
  `children` render prop, an Angular `*ngTemplateOutlet`-based
  pattern, etc.
- The `locales.ts` / `locales.tsv` files are framework-agnostic and
  are byte-identical across every port.

[Unreleased]: https://github.com/lilydesignsystem/lily-design-system
[0.3.0]: https://github.com/lilydesignsystem/lily-design-system
[0.1.0]: https://github.com/lilydesignsystem/lily-design-system
