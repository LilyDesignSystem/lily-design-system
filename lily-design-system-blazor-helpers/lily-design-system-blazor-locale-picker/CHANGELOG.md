# Changelog — LocalePicker (Blazor)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## 0.1.0 — 2026-06-05

Initial release.

### Added

- `LocalePicker.razor` + `LocalePicker.razor.cs` — partial-class
  Blazor component in namespace `LilyDesignSystem.Blazor.Helpers`.
  Implements the full Svelte canonical contract:
  - Renders `<fieldset role="radiogroup" aria-label="…">` with one
    `<input type="radio">` per locale code, wrapped in a
    `<label lang="{TagFor(locale)}">` per WCAG 3.1.2 (Language of
    Parts).
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
  - `RenderFragment<LocalePickerContext>` for custom rendering
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
- `LocalePickerTests.cs` — bUnit + xUnit suite asserting every
  numbered acceptance criterion in `spec.md` §7 (23 items).
- `spec.md` — spec-driven contract, version 0.1.0.
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
- `RenderFragment<LocalePickerContext>` for custom rendering.
- All DOM writes go through `IJSRuntime` inside
  `OnAfterRenderAsync` so the component is SSR / prerender safe.
- Tested under bUnit + xUnit.

### Parity

This is a direct port of the Svelte canonical
`lily-design-system-svelte-locale-picker` v0.1.0. The DOM contract,
BCP 47 normalisation rules, RTL detection sets, initial-value
resolution order, and apply order match clause-for-clause.

### Notes

- The `onChange` callback prop from the Svelte canonical maps to
  the `OnChange` Blazor `EventCallback<string>`. Use
  `OnChange="HandlerMethod"` in markup.
- The `children` snippet from Svelte maps to the `ChildContent`
  `RenderFragment<LocalePickerContext>` in Blazor. Use
  `<ChildContent Context="ctx">` in consumer markup.
- The bindable model name is `Value`, accessed via `@bind-Value`.
- The pure helpers from the Svelte canonical (`bcp47LocaleTag`,
  `isRtlLocale`, `localeName`, `matchNavigatorLanguage`,
  `defaultLocaleLabels`, `RTL_LANGUAGE_TAGS`,
  `RTL_SCRIPT_SUBTAGS`) live on the `Locales` static class with
  PascalCase names per .NET convention.
- The picker requires an interactive render mode
  (`InteractiveServer`, `InteractiveWebAssembly`, or
  `InteractiveAuto`) for its `OnAfterRenderAsync` lifecycle hook to
  fire. Static SSR renders the markup but doesn't mutate the DOM.

[Unreleased]: https://github.com/lilydesignsystem/lily-design-system
[0.1.0]: https://github.com/lilydesignsystem/lily-design-system
