# Changelog — LocaleSelect (Blazor)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

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
