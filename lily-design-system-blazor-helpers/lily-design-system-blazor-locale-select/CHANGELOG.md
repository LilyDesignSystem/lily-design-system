# Changelog — LocaleSelect (Blazor)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## Unreleased

### Changed

- **The default glyph gains U+FE0E VARIATION SELECTOR-15.**
  `LocaleSelect.GlobeWithMeridians` is now the two-codepoint sequence
  `"\U0001F310\uFE0E"` (was `"\U0001F310"`). VS15 requests the *text*
  presentation, so the globe renders monochrome in the current text
  colour instead of as a blue colour-emoji — matching ThemeSelect's
  `◑` (U+25D1), which is not an emoji codepoint and already rendered as
  text. Verified in Chromium.

  Consumers asserting on the exact glyph string must update to the
  two-codepoint sequence. VS15 is a *request*: platforms that ignore it
  still paint a colour globe, so `docs/styling.md` documents a
  font-stack fallback and `ChildContent` remains the guaranteed route
  to a monochrome mark.

### Added

- **Five shared topic docs**, bringing the doc set level with
  theme-select's: `docs/parameters-reference.md`, `docs/styling.md`,
  `docs/custom-rendering.md`, `docs/recipes.md`, and
  `docs/troubleshooting.md`. Written for locale-select rather than
  adapted from the theme-select copies. The locale-specific docs
  (`bcp47`, `rtl`, `i18n-integration`, `concepts`) are unchanged;
  `preloading` stays theme-only, since it is about stylesheet
  preloading and has no locale counterpart.

- **Examples renamed to descriptive names**, matching theme-select's
  convention and dropping the numeric prefixes left over from the
  radio-group era. None of these files has rendered radios, a
  `<select>`, or a button group since the icon-button/listbox port:

  | Was | Now |
  | --- | --- |
  | `01_Radios.razor` | `Basic.razor` |
  | `02_Select.razor` | `CustomRendering.razor` |
  | `03_Buttons.razor` | `ExternalButtons.razor` |
  | `04_RtlDemo.razor` | `RtlDemo.razor` |
  | `05_NhsStyle.razor` | `NhsStyle.razor` |
  | `06_WithIStringLocalizer.razor` | `WithIStringLocalizer.razor` |
  | `07_WithResX.razor` | `WithResX.razor` |
  | `08_SsrCookie.razor` | `SsrCookie.razor` |
  | `09_ScopedTarget.razor` | `ScopedTarget.razor` |
  | `10_Combobox.razor` | `Combobox.razor` |

  All inbound links updated (`examples/README.md`, `index.md`,
  `AGENTS/ssr.md`, and the ResX layout comment inside `WithResX.razor`).

### Fixed

- `index.md` no longer marks examples 2, 3, 5, and 10 as "⚠️ Stale —
  written against the previous native-`<select>` API". They were
  rewritten for the icon-button/listbox API; no example passes the
  removed `Placeholder` parameter. The warning was itself stale.

### Changed (BREAKING)

- **The control is no longer a native `<select>`.** It is now an icon
  button that opens a dropdown listbox, built to the WAI-ARIA APG
  listbox pattern. The root element changes from `<select>` to `<div>`:

  ```html
  <div class="locale-select {CssClass}">
    <input type="hidden" name="{Name}" value="{Value}" />
    <button type="button" class="locale-select-button" aria-label="{Label}"
            aria-haspopup="listbox" aria-expanded="false" aria-controls="{listId}">
      <span class="locale-select-icon" aria-hidden="true">&#127760;</span>
    </button>
    <ul class="locale-select-list" id="{listId}" role="listbox" aria-label="{Label}"
        tabindex="-1" hidden aria-activedescendant="{active option id, open only}">
      <li class="locale-select-option" id="{optionId}" role="option"
          aria-selected="true|false" data-active
          lang="{TagFor(code)}">{LabelFor(code)}</li>
    </ul>
  </div>
  ```

  Consumers must update: any CSS or test selector targeting
  `select.locale-select` or `option.locale-select-option`;
  `AdditionalAttributes` and `CssClass` now land on the root `<div>`,
  not on a form control. Per-option `lang` is preserved — and is now
  honoured more reliably, since the options are real DOM nodes rather
  than an OS-drawn popup. The button and the list carry no `lang`.

- **`Placeholder` is removed.** It existed only to pin the native
  `<select>`'s closed display to a short word. There is no `<select>`
  left to pin, so the parameter is gone and passing it is a compile
  error. The closed control is an icon button; to show the active
  locale, render a status region beside it — see
  [`docs/accessibility.md`](./docs/accessibility.md#the-status-region-is-still-the-recommended-pattern).

- **The 0.3.0 snap-back interop write is removed.** The component no
  longer calls `Object.assign(el, { value: "" })` through `IJSRuntime`.
  There is no `<select>` DOM value to reset.

- **`LocaleSelectContext` is narrowed, and `ChildContent` changes
  meaning.** The fragment now **replaces the glyph inside the button**
  rather than rendering the options; options are always
  component-owned, so neither the listbox semantics nor the per-option
  `lang` can be broken by a consumer override. The context drops
  `Locales`, `SetLocale`, `Name`, `TagFor` and `IsRtl`, keeping
  `{ Value, Open, LabelFor }` to mirror the canonical Svelte
  `ChildArgs`. The dropped helpers remain available as statics on the
  `Locales` class; to drive selection imperatively, call the public
  `SetLocaleAsync(string)` on a `@ref` to the component.

- **The `.locale-select-placeholder` CSS hook is gone.** The hooks are
  now `.locale-select`, `.locale-select-button`, `.locale-select-icon`,
  `.locale-select-list`, `.locale-select-option`, plus the
  `[data-active]` and `[aria-selected]` state selectors.

### Added

- Full WAI-ARIA APG listbox keyboard contract, implemented by the
  component: `ArrowDown` / `Enter` / `Space` open on the selected
  option and `ArrowUp` opens on the last; arrows move and **clamp**
  (no wrapping); `Home` / `End` jump; `Enter` / `Space` select-apply-
  close-and-refocus; `Escape` closes without changing the value; `Tab`
  closes without stealing focus; printable characters run a 500 ms
  typeahead over the labels. Clicking an option selects it; focus
  leaving the root closes the listbox.
- Focus management via `ElementReference.FocusAsync()` — opening moves
  focus to the `<ul>`, selecting or escaping returns it to the button.
- `LocaleSelect.GlobeWithMeridians` — the default glyph constant,
  `"🌐"` (U+1F310).
- A hidden `<input>` carrying `Name` / `Value` so the control still
  participates in form submission.
- Stable, SSR-safe element ids from a monotonic process-wide counter
  (`locale-select-{n}-list`, `locale-select-{n}-option-{i}`) — no
  randomness and no clock reads.

### Unchanged

`lang` / `dir` application, RTL detection, `localStorage` persistence,
`navigator` detection, `OnChange` / `ValueChanged`, initial-value
resolution, SSR safety, and every pure helper on the static `Locales`
class (`Bcp47LocaleTag`, `IsRtlLocale`, `LocaleName`,
`MatchNavigatorLanguage`, `DefaultLocaleLabels`, `RtlLanguageTags`,
`RtlScriptSubtags`) all behave exactly as before.

### Known deviations from the canonical Svelte implementation

- No `preventDefault` on keydown: Blazor evaluates
  `@onkeydown:preventDefault` at render time, not per event, so it
  cannot spare `Tab`. Arrow keys and `Space` therefore still scroll the
  page. A suppress-next-click flag stops `Enter` / `Space` toggling the
  listbox twice.
- No document-level click listener (this package ships no JavaScript);
  outside interaction closes the listbox via the root's `focusout`
  instead.

## 0.3.0 — 2026-07-20

### Changed (BREAKING)

- The closed `<select>` now always reads a placeholder word instead of
  the active locale name, so the control stays narrow regardless of how
  long locale names are. Two parts of the DOM contract change:
  - **Option count and ordering.** A component-owned placeholder
    `<option class="locale-select-option locale-select-placeholder"
    value="" selected>` is now the FIRST child of the `<select>`, in
    both the default and the `ChildContent` code paths. It carries no
    `lang`, since it is not a locale. Consumers and tests that count
    options or index into them must account for it (`Locales.Count + 1`;
    real codes start at index 1).
  - **The `<select>`'s own value no longer tracks the selection.** The
    placeholder is the only option ever marked `selected`; after every
    change the component resets the live element's value back to `""`
    via `IJSRuntime`. Read the selection from `Value` (still two-way
    bindable via `@bind-Value`) or from `lang` on the document root —
    never from the `<select>` element.

  Everything downstream is unchanged: `lang` / `dir` application,
  `localStorage` persistence, `navigator` detection, `OnChange` /
  `ValueChanged`, and initial-value resolution all behave as before.

### Added

- `Placeholder` parameter (`string?`, defaults to `Label`) — the text
  of the always-displayed placeholder option. Like every other
  user-facing string in this package it is consumer-supplied, so no
  hardcoded English is emitted.
- New `.locale-select-placeholder` class hook, and a width recipe
  (`field-sizing: content` with a `max-width` fallback) in
  [`index.md`](index.md).

### Accessibility

- Documented tradeoff: because the closed control always reads the
  placeholder, screen-reader users no longer hear the active locale
  announced as the combobox value. Consumers who need it announced
  should surface the active locale in visible text (with its own `lang`)
  or a polite live region — see
  [`docs/accessibility.md`](docs/accessibility.md).

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

Initial release.

### Added

- `LocaleSelect.razor` + `LocaleSelect.razor.cs` — partial-class
  Blazor component in namespace `LilyDesignSystem.Blazor.Helpers`.
  Implements the full Svelte canonical contract:
  - Renders `<select aria-label="…" name="…">` with one
    `<option value="{locale}" lang="{TagFor(locale)}">` per locale
    code per WCAG 3.1.2 (Language of Parts).
  - Sets `lang="{Bcp47LocaleTag(code)}"` on
    `document.documentElement` via `IJSRuntime.InvokeVoidAsync`.
  - Sets `dir="rtl"` / `dir="ltr"` on the document root via
    `Locales.IsRtlLocale()` auto-detection. Opt-out via
    `ApplyDir="false"`.
  - Optional `StorageKey` persistence to `localStorage` with
    private-mode-safe try/catch.
  - Optional `DetectFromNavigator` first-visit fallback via
    `navigator.languages`.
  - Two-way binding via `@bind-Value`.
  - `OnChange` `EventCallback<string>` for post-apply side effects
    (consumer-form code, not BCP 47 normalised).
  - `RenderFragment<LocaleSelectContext>` for custom rendering
    with `{ Locales, Value, SetLocale, Name, LabelFor, TagFor,
    IsRtl }`.
  - `[Parameter(CaptureUnmatchedValues = true)] AdditionalAttributes`
    for attribute spread.
- `Locales` static class with 436-row built-in locale-code →
  English-name table plus RTL language and script subtag sets.
  Public methods: `Bcp47LocaleTag`, `IsRtlLocale`, `LocaleName`,
  `MatchNavigatorLanguage`. Public properties:
  `DefaultLocaleLabels`, `RtlLanguageTags`, `RtlScriptSubtags`.
- `locales.tsv` — canonical 436-row source for `Locales.cs`.
  Byte-identical to the Svelte canonical helper's
  `locales.tsv`.
- `LocaleSelectTests.cs` — bUnit + xUnit suite asserting every
  numbered acceptance criterion in `spec/index.md` §7 (23 items).
- `spec/index.md` — spec-driven contract, version 0.1.0.
- `AGENTS/` subdirectory with `api.md`, `lifecycle.md`,
  `accessibility.md`, `ssr.md`, `testing.md`.
- `docs/` subdirectory with topic guides: `accessibility.md`,
  `bcp47.md`, `concepts.md`, `i18n-integration.md`, `rtl.md`,
  `ssr.md`.
- `examples/` subdirectory: `01_Radios.razor`, `02_Select.razor`,
  `03_Buttons.razor`, `04_RtlDemo.razor`, `05_NhsStyle.razor`,
  `06_WithIStringLocalizer.razor`, `07_WithResX.razor`,
  `08_SsrCookie.razor`, `09_ScopedTarget.razor`,
  `10_Combobox.razor`, plus a `README.md` index.

### Conventions

- Blazor 10 / .NET 10, `Nullable enable`, `ImplicitUsings enable`.
- Partial class split between `.razor` and `.razor.cs`.
- Namespace: `LilyDesignSystem.Blazor.Helpers`.
- `[Parameter, EditorRequired]` for required parameters.
- `EventCallback<T>` for events; `{Name}` + `{Name}Changed` for
  `@bind-{Name}`.
- `RenderFragment<LocaleSelectContext>` for custom rendering.
- All DOM writes go through `IJSRuntime` inside
  `OnAfterRenderAsync` so the component is SSR / prerender safe.
- Tested under bUnit + xUnit.

### Parity

This is a direct port of the Svelte canonical
`lily-design-system-svelte-locale-select` v0.1.0. The DOM contract,
BCP 47 normalisation rules, RTL detection sets, initial-value
resolution order, and apply order match clause-for-clause.

### Notes

- The `onChange` callback prop from the Svelte canonical maps to
  the `OnChange` Blazor `EventCallback<string>`. Use
  `OnChange="HandlerMethod"` in markup.
- The `children` snippet from Svelte maps to the `ChildContent`
  `RenderFragment<LocaleSelectContext>` in Blazor. Use
  `<ChildContent Context="ctx">` in consumer markup.
- The bindable model name is `Value`, accessed via `@bind-Value`.
- The pure helpers from the Svelte canonical (`bcp47LocaleTag`,
  `isRtlLocale`, `localeName`, `matchNavigatorLanguage`,
  `defaultLocaleLabels`, `RTL_LANGUAGE_TAGS`,
  `RTL_SCRIPT_SUBTAGS`) live on the `Locales` static class with
  PascalCase names per .NET convention.
- The select requires an interactive render mode
  (`InteractiveServer`, `InteractiveWebAssembly`, or
  `InteractiveAuto`) for its `OnAfterRenderAsync` lifecycle hook to
  fire. Static SSR renders the markup but doesn't mutate the DOM.

[Unreleased]: https://github.com/lilydesignsystem/lily-design-system
[0.3.0]: https://github.com/lilydesignsystem/lily-design-system
[0.1.0]: https://github.com/lilydesignsystem/lily-design-system
