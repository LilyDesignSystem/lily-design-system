# Changelog — LocaleChooser (Angular)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## 0.1.0 — 2026-07-21

### Added

- Initial release under this name. `LocaleChooser` is an Angular 20
  headless locale control: a single-glyph button (🌐, U+1F310 U+FE0E)
  that opens a WAI-ARIA APG listbox of locales and sets `lang` (BCP 47,
  hyphenated) and `dir` (`ltr` / `rtl`, auto-detected per script) on the
  document root or a consumer-supplied `target`. It translates nothing.
  Standalone, signal-based, `OnPush`, `@for` control flow, zero CSS.
- Initial selection resolves `value > storage > detection >
  defaultValue > "en" > first locale`, with optional `localStorage`
  persistence via `storageKey` and optional `navigator.language`
  first-visit detection via `detectFromNavigator`.
- Public surface: `LocaleChooser` (selector `lily-locale-chooser`),
  `LocaleChooserIcon` (`ng-template[lilyLocaleChooserIcon]`),
  `nextLocaleChooserId`, `localeName`, `matchNavigatorLanguage`,
  `bcp47LocaleTag`, `isRtlLocale`, `GLOBE_WITH_MERIDIANS`,
  `defaultLocaleLabels`, `RTL_LANGUAGE_TAGS`, `RTL_SCRIPT_SUBTAGS`, and
  the `ChildArgs` type.
- Class hooks: `.locale-chooser`, `-button`, `-icon`, `-list`,
  `-option`. Every user-facing string is an input; the glyph is
  `aria-hidden` and the accessible name comes from `label`.

### Renamed

- **Previously released in-tree as
  `lily-design-system-angular-locale-select`** (last in-tree version
  0.4.0). The package name, directory, component class, selector,
  marker directive and class hooks all changed with it. The version
  resets to 0.1.0 because nothing has ever been published under the new
  name.

The entries below record this package's history under its former name.

---

## Unreleased

### Changed (symmetry with theme-chooser)

- **The default globe glyph gains U+FE0E VARIATION SELECTOR-15.**
  `GLOBE_WITH_MERIDIANS` is now `"\u{1F310}\uFE0E"` rather than
  `"\u{1F310}"`. Without VS15 the browser picks the colour-emoji font
  and the globe renders blue, which does not match theme-chooser's
  monochrome `◑` (U+25D1) — the two controls sit next to each other in
  a page header and should read as one set. Verified in Chromium.
  Consumers who assert on the glyph's exact code points need to expect
  the two-codepoint sequence.

### Added (docs and examples)

- **Five shared topic guides**, so locale-chooser and theme-chooser now
  offer the same doc shape: `docs/props-reference.md`,
  `docs/styling.md`, `docs/custom-rendering.md`, `docs/recipes.md`,
  and `docs/troubleshooting.md`. Written for locale-chooser rather
  than adapted from the theme-chooser copies. The topic-specific
  guides (`bcp47`, `rtl`, `i18n-integration`, `concepts`) stay as
  they are; `preloading` remains theme-only since it is about
  stylesheet preloading.

### Changed (examples renamed)

- **Examples move from the radio-group era's ordinal names to
  descriptive ones**, matching theme-chooser's convention. None of the
  three lead names described their content any more — no example has
  rendered radios, a bare `<select>`, or a button group as the helper
  itself since the listbox port.

  | Was | Now |
  | --- | --- |
  | `01-radios.component.ts` | `basic.component.ts` |
  | `02-select.component.ts` | `sibling-select.component.ts` |
  | `03-buttons.component.ts` | `sibling-buttons.component.ts` |
  | `04-rtl-demo.component.ts` | `rtl-demo.component.ts` |
  | `05-nhs-style.component.ts` | `nhs-style.component.ts` |
  | `06-with-transloco.component.ts` | `with-transloco.component.ts` |
  | `07-with-ngx-translate.component.ts` | `with-ngx-translate.component.ts` |
  | `08-ssr-cookie.component.ts` | `analog-cookie.component.ts` |
  | `09-scoped-target.component.ts` | `scoped-target.component.ts` |
  | `10-combobox.component.ts` | `combobox.component.ts` |

  Stale identifiers went with them: `RadiosExample` → `BasicExample`,
  `SelectExample` → `SiblingSelectExample`, `ButtonsExample` →
  `SiblingButtonsExample`, `SsrCookieExample` → `AnalogCookieExample`,
  and the matching `example-*` selectors. All inbound links in
  `index.md`, `examples/README.md`, `docs/`, and `AGENTS/` follow.

### Changed (BREAKING — DOM contract, API, and keyboard)

- **The control is no longer a native `<select>`.** It is now an icon
  button that opens a WAI-ARIA APG listbox. The root is a
  `<div class="locale-chooser {className}">` containing a
  `<button class="locale-chooser-button">` with
  `aria-haspopup="listbox"`, `aria-expanded`, and `aria-controls`, and
  a `<ul class="locale-chooser-list" role="listbox">` of
  `<li class="locale-chooser-option" role="option">` children. Any
  consumer CSS, test, or e2e selector targeting `select.locale-chooser`
  or `option.locale-chooser-option` must be updated.
- **The `placeholder` input is removed.** With no `<select>` to pin,
  the "pinned placeholder keeps the control narrow" tradeoff from
  0.3.0 no longer exists. The `locale-chooser-placeholder` class hook
  is gone with it. There is no deprecation shim: passing
  `placeholder` is now a template type error.
- **Form participation moves to a hidden input.**
  `<input type="hidden" [name] [value]>` carries the value into an
  enclosing `<form>`; `name` now lands there rather than on a
  `<select>`.
- **`className` lands on the root `<div>`**, not on a `<select>`.
- **New keyboard contract**, implemented in the component rather than
  inherited from the platform. On the button: `ArrowDown` / `Enter` /
  `Space` open on the selected option, `ArrowUp` opens on the last.
  On the list: arrows move the active option and clamp rather than
  wrap, `Home` / `End` jump, `Enter` / `Space` commit and return focus
  to the button, `Escape` cancels and returns focus, `Tab` closes
  without stealing focus back, and printable characters run a
  typeahead over the option labels with a 500 ms buffer. Clicking
  outside the root or moving focus out of it closes the list.
- **The custom-render contract changed shape and narrowed.** The old
  Svelte-parity `children` contract exposed
  `{ locales, value, setLocale, name, labelFor, tagFor, isRtl }` and
  rendered options. Angular now takes a projected `<ng-template>`
  that replaces the **button glyph only** — it never renders options —
  and receives `ChildArgs`: `{ $implicit, value, open, labelFor }`.

### Added

- `locale-chooser-button`, `locale-chooser-icon`, and
  `locale-chooser-list` class hooks. The package still ships zero CSS.
  Note that the list now needs positioning CSS from the consumer
  (`position: absolute` on the list, `position: relative` on the root)
  or it will push page content down when opened.
- `GLOBE_WITH_MERIDIANS` export — the default button glyph, U+1F310
  GLOBE WITH MERIDIANS (`&#127760;`), rendered inside an
  `aria-hidden` span.
- `LocaleChooserIcon` export — an optional marker directive
  (`ng-template[lilyLocaleChooserIcon]`) giving consumers typed `let-`
  variables on the projected icon template. The component matches any
  projected `<ng-template>` via `contentChild(TemplateRef)`, so the
  marker is never required.
- `nextLocaleChooserId` export — the module-counter id generator behind
  the per-instance list and option ids. Deliberately not
  `Math.random()` / `Date.now()`, so SSR and client renders agree and
  hydration stays clean.
- `ChildArgs` type export — the projected template's context.

### Unchanged

Everything downstream of the selection behaves exactly as before:
`lang` / `dir` application, RTL detection, `localStorage`
persistence, `navigator.languages` detection, the `localeChange`
output, initial-value resolution (`value` > storage > navigator >
`defaultValue` > `"en"` > `locales[0]`), SSR safety, and the pure
helpers `bcp47LocaleTag` / `isRtlLocale` / `localeName` /
`matchNavigatorLanguage` plus the constants `defaultLocaleLabels` /
`RTL_LANGUAGE_TAGS` / `RTL_SCRIPT_SUBTAGS`. Options still carry
`lang="{bcp47}"` for WCAG 3.1.2 (Language of Parts); the button and
the list still carry none.

### Accessibility

The 0.3.0 placeholder tradeoff is gone, replaced by three new ones,
documented without spin in `docs/accessibility.md`: an icon-only
control depends entirely on `aria-label` for its accessible name; a
custom listbox has weaker and less consistent assistive-technology
support than a native `<select>`, which is a real regression; and the
globe glyph may render differently, render as tofu, or be missing
entirely depending on platform fonts. The status-region guidance is
retained and still applies — the closed button shows only a glyph and
never the active locale name.

## 0.3.0 — 2026-07-20

### Added

- `placeholder` input (optional, `string`). Sets the text of the new
  leading placeholder option. Defaults to the `label` value, so the
  package still emits no hardcoded user-facing string.
- `.locale-chooser-placeholder` class hook on the placeholder option.
  The package still ships zero CSS; see the root `themes/` stylesheets
  for the shipped width implementation.

### Changed (BREAKING — DOM contract)

- The `<select>` now renders a leading
  `<option class="locale-chooser-option locale-chooser-placeholder" value="" selected>`
  before the locale options. **Option count is one greater than
  `locales.length`**, and the first option's `value` is `""`.
  Consumers asserting on option count or index will need to account
  for it — including the per-option `lang` assertions, which now start
  at index 1. The placeholder is not a locale and carries no `lang`.
- **The `<select>`'s own `value` no longer tracks the selection.** It
  stays pinned to the placeholder, so the closed control always reads
  the placeholder word rather than the active locale name — keeping
  the control as narrow as that word instead of as wide as the longest
  locale name. No real option carries a `selected` binding any more.
  Read the active locale from `[(value)]` or the `localeChange`
  output; reading `selectElement.value` now always yields `""`.
- Accessibility tradeoff, documented in `docs/accessibility.md`: the
  closed control no longer announces the active locale to
  screen-reader users. Consumers who need that should surface the
  active selection in visible text (with its own `lang`) or a polite
  live region.

Downstream behaviour is otherwise unchanged: `lang` / `dir`
application, `localStorage` persistence, `navigator` detection,
`localeChange`, and initial-value resolution all behave exactly as
before, and `value` remains the two-way bindable source of truth.

### Added (examples & docs)

- The compensating status region is now the **default pattern**, not a
  suggestion: the entry-point example and the `index.md` quick-start both
  ship a visible `<p class="locale-chooser-status" aria-live="polite">`
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
  `<select class="locale-chooser">` with one `<option class="locale-chooser-option">`
  per choice, replacing the former `<fieldset role="radiogroup">` with
  `<input type="radio">` children. The package was renamed from the
  `*-picker` name to `*-select` accordingly.
- Class-hook contract changed: `locale-chooser` now names the `<select>` root
  and `locale-chooser-option` is the only sub-class; the radio/label sub-class
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

Initial release.

### Added

- `locale-chooser.component.ts` — Angular 20 standalone component.
  Implements the full Svelte canonical contract:
  - Renders `<select [attr.aria-label]="…" [name]="…">` with one
    `<option [attr.lang]="tagFor(locale)">` per locale code per
    WCAG 3.1.2 (Language of Parts).
  - Sets `lang="{bcp47LocaleTag(code)}"` on the resolved target
    element (defaults to `document.documentElement`).
  - Sets `dir="rtl"` / `dir="ltr"` on the target element via
    `isRtlLocale()` auto-detection. Opt-out via
    `[applyDir]="false"`.
  - Optional `storageKey` persistence to `localStorage` with
    private-mode-safe try/catch.
  - Optional `detectFromNavigator` first-visit fallback via
    `navigator.languages`.
  - Two-way binding via `[(value)]` (model signal).
  - `localeChange` output for post-apply side effects.
  - `className` input for the consumer's CSS hook on the root
    `<select>`.
- `locales.ts` — 436-row built-in locale-code → English-name table
  plus RTL language and script subtag sets. Byte-identical to the
  Svelte / Vue canonical helpers (framework-agnostic data).
- `locales.tsv` — canonical source for `locales.ts`. Byte-identical
  to the Svelte / Vue canonical helpers.
- `index.ts` barrel re-exporting `LocaleChooser`, `bcp47LocaleTag`,
  `isRtlLocale`, `localeName`, `matchNavigatorLanguage`,
  `defaultLocaleLabels`, `RTL_LANGUAGE_TAGS`,
  `RTL_SCRIPT_SUBTAGS`.
- `locale-chooser.component.spec.ts` — vitest suite asserting every
  numbered acceptance criterion in `spec/index.md` §7 (23 items).
- `spec/index.md` — spec-driven contract, version 0.1.0.
- `AGENTS/` subdirectory with `api.md`, `lifecycle.md`,
  `accessibility.md`, `ssr.md`, `testing.md`.
- `docs/` subdirectory with topic guides: `accessibility.md`,
  `bcp47.md`, `concepts.md`, `i18n-integration.md`, `rtl.md`,
  `ssr.md`.
- `examples/` subdirectory: `01-radios.component.ts`,
  `02-select.component.ts`, `03-buttons.component.ts`,
  `04-rtl-demo.component.ts`, `05-nhs-style.component.ts`,
  `06-with-transloco.component.ts`,
  `07-with-ngx-translate.component.ts`,
  `08-ssr-cookie.component.ts`, `09-scoped-target.component.ts`,
  `10-combobox.component.ts`, plus a `README.md` index.

### Conventions

- Angular 20 standalone component, `OnPush`, `@for` control flow.
- Signal inputs (`input<T>()`, `input.required<T>()`), model signal
  for `value`, signal output for `localeChange`.
- Template-inline only (no `templateUrl`, `styles`, `styleUrls`).
- Template-cast pattern: `$any($event.target).value`.
- Zero runtime dependencies beyond `@angular/core` and
  `@angular/common`.
- SSR-safe: all DOM writes inside `effect()` and guarded by
  `typeof document !== "undefined"`.
- Tested under vitest + jsdom + `@angular/core/testing` `TestBed`.

### Parity

This is a direct port of the Svelte canonical
`lily-design-system-svelte-locale-chooser` v0.1.0. The DOM
contract, BCP 47 normalisation rules, RTL detection sets,
initial-value resolution order, and apply order match
clause-for-clause.

### Notes

- The `onChange` callback prop from the Svelte canonical maps to
  the `localeChange` Angular output. Use `(localeChange)="..."`
  in templates.
- The `children` snippet from Svelte does not yet have an Angular
  equivalent — content projection via `<ng-content>` and
  `@ContentChild(TemplateRef)` is planned. The v0.1.0 workaround is
  a sibling widget bound to the same `[(value)]` signal (see
  `examples/02-select.component.ts`, `03-buttons.component.ts`,
  `10-combobox.component.ts`).
- The bindable model name is `value`, not the legacy `value`
  decorator name. Use `[(value)]="locale"` and not
  `[(modelValue)]="locale"`.
- `target` accepts an `HTMLElement` or `null`; templates pass a
  template ref's `nativeElement` (`[target]="panel.nativeElement"`).

[Unreleased]: https://github.com/lilydesignsystem/lily-design-system
[0.3.0]: https://github.com/lilydesignsystem/lily-design-system
[0.1.0]: https://github.com/lilydesignsystem/lily-design-system
