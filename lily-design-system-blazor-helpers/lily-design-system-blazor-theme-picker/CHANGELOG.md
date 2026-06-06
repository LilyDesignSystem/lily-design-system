# Changelog — ThemePicker (Blazor)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## 0.1.0 — 2026-06-05

Initial release.

### Added

- `ThemePicker.razor` + `ThemePicker.razor.cs` — partial-class Blazor
  component in namespace `LilyDesignSystem.Blazor.Helpers`. Implements
  the full Svelte canonical contract:
  - Renders `<fieldset role="radiogroup" aria-label="…">` with one
    `<input type="radio">` per theme slug.
  - Manages a single
    `<link rel="stylesheet" data-lily-theme-picker="{Name}">` in
    `document.head` and swaps its `href` on each apply via
    `IJSRuntime.InvokeVoidAsync("eval", …)`.
  - Sets `data-theme="{slug}"` on `document.documentElement`.
  - Optional `StorageKey` persistence to `localStorage` with
    private-mode-safe try/catch.
  - Two-way binding via `@bind-Value`.
  - `OnChange` `EventCallback<string>` for post-apply side effects.
  - `RenderFragment<ThemePickerContext>` for custom rendering with
    `{ Themes, Value, SetTheme, Name, LabelFor }`.
  - `[Parameter(CaptureUnmatchedValues = true)] AdditionalAttributes`
    for attribute spread (`@attributes="AdditionalAttributes"`).
- `ThemePicker.NormaliseThemesUrl`, `ThemePicker.ThemeHref` — public
  static helpers for URL construction.
- `ThemePicker.BuildApplyScript` — `internal static` for tests.
- `ThemePickerTests.cs` — bUnit + xUnit suite asserting every
  numbered acceptance criterion in `spec.md` §7 (13 items).
- `spec.md` — spec-driven contract, version 0.1.0.
- `AGENTS/` subdirectory with `api.md`, `lifecycle.md`,
  `accessibility.md`, `testing.md`, `ssr.md`.
- `docs/` subdirectory with topic guides: `accessibility.md`,
  `custom-rendering.md`, `preloading.md`, `parameters-reference.md`,
  `recipes.md`, `ssr.md`, `styling.md`, `troubleshooting.md`.
- `examples/` subdirectory: `Basic.razor`, `TwoWayBinding.razor`,
  `Persistence.razor`, `CustomLabels.razor`, `CustomRendering.razor`,
  `Preloaded.razor`, `MultiplePickers.razor`, `SystemPreference.razor`,
  `LilyThemes.razor`, plus `BlazorServerCookie/` with `App.razor`,
  `SettingsPage.razor`, and a `Program.snippet.cs` outline.

### Conventions

- Blazor 10 / .NET 10, `Nullable enable`, `ImplicitUsings enable`.
- Partial class split between `.razor` and `.razor.cs`.
- Namespace: `LilyDesignSystem.Blazor.Helpers`.
- `[Parameter, EditorRequired]` for required parameters.
- `EventCallback<T>` for events; `{Name}` + `{Name}Changed` for
  `@bind-{Name}`.
- `RenderFragment<TContext>` for custom rendering.
- All DOM writes go through `IJSRuntime` inside
  `OnAfterRenderAsync` so the component is SSR / prerender safe.
- Tested under bUnit + xUnit.

### Parity

This is a direct port of the Svelte canonical
`lily-design-system-svelte-theme-picker` v0.1.0. The DOM contract,
managed-link discriminator, initial-value resolution, and apply
order match clause-for-clause.

### Notes

- The `onChange` callback prop from the Svelte canonical maps to the
  `OnChange` Blazor `EventCallback<string>`. Use
  `OnChange="HandlerMethod"` in markup.
- The `children` snippet from Svelte maps to the
  `ChildContent` `RenderFragment<ThemePickerContext>` in Blazor.
  Use `<ChildContent Context="ctx">` in consumer markup.
- The bindable model name is `Value`, accessed via `@bind-Value`.
- The picker requires an interactive render mode
  (`InteractiveServer`, `InteractiveWebAssembly`, or
  `InteractiveAuto`) for its `OnAfterRenderAsync` lifecycle hook to
  fire. Static SSR renders the markup but doesn't mutate the DOM.

[Unreleased]: https://github.com/lilydesignsystem/lily-design-system
[0.1.0]: https://github.com/lilydesignsystem/lily-design-system
