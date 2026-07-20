# Changelog — ThemeSelect (Blazor)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## Unreleased

### Changed (BREAKING)

- The closed `<select>` now always reads a placeholder word instead of
  the active theme name, so the control stays narrow regardless of how
  long theme names are. Two parts of the DOM contract change:
  - **Option count and ordering.** A component-owned placeholder
    `<option class="theme-select-option theme-select-placeholder"
    value="" selected>` is now the FIRST child of the `<select>`, in
    both the default and the `ChildContent` code paths. Consumers and
    tests that count options or index into them must account for it
    (`Themes.Count + 1`; real slugs start at index 1).
  - **The `<select>`'s own value no longer tracks the selection.** The
    placeholder is the only option ever marked `selected`; after every
    change the component resets the live element's value back to `""`
    via `IJSRuntime`. Read the selection from `Value` (still two-way
    bindable via `@bind-Value`) or from `data-theme` on the document
    root — never from the `<select>` element.

  Everything downstream is unchanged: the managed `<link>` swap,
  `data-theme`, `localStorage` persistence, `OnChange` /
  `ValueChanged`, and initial-value resolution all behave as before.

### Added

- `Placeholder` parameter (`string?`, defaults to `Label`) — the text
  of the always-displayed placeholder option. Like every other
  user-facing string in this package it is consumer-supplied, so no
  hardcoded English is emitted.
- New `.theme-select-placeholder` class hook, and a width recipe
  (`field-sizing: content` with a `max-width` fallback) in
  [`docs/styling.md`](docs/styling.md).

### Accessibility

- Documented tradeoff: because the closed control always reads the
  placeholder, screen-reader users no longer hear the active theme
  announced as the combobox value. Consumers who need it announced
  should surface the active theme in visible text or a polite live
  region — see [`docs/accessibility.md`](docs/accessibility.md).

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

## 0.1.0 — 2026-06-05

Initial release.

### Added

- `ThemeSelect.razor` + `ThemeSelect.razor.cs` — partial-class Blazor
  component in namespace `LilyDesignSystem.Blazor.Helpers`. Implements
  the full Svelte canonical contract:
  - Renders `<select aria-label="…" name="…">` with one `<option>`
    per theme slug.
  - Manages a single
    `<link rel="stylesheet" data-lily-theme-select="{Name}">` in
    `document.head` and swaps its `href` on each apply via
    `IJSRuntime.InvokeVoidAsync("eval", …)`.
  - Sets `data-theme="{slug}"` on `document.documentElement`.
  - Optional `StorageKey` persistence to `localStorage` with
    private-mode-safe try/catch.
  - Two-way binding via `@bind-Value`.
  - `OnChange` `EventCallback<string>` for post-apply side effects.
  - `RenderFragment<ThemeSelectContext>` for custom rendering with
    `{ Themes, Value, SetTheme, Name, LabelFor }`.
  - `[Parameter(CaptureUnmatchedValues = true)] AdditionalAttributes`
    for attribute spread (`@attributes="AdditionalAttributes"`).
- `ThemeSelect.NormaliseThemesUrl`, `ThemeSelect.ThemeHref` — public
  static helpers for URL construction.
- `ThemeSelect.BuildApplyScript` — `internal static` for tests.
- `ThemeSelectTests.cs` — bUnit + xUnit suite asserting every
  numbered acceptance criterion in `spec/index.md` §7 (13 items).
- `spec/index.md` — spec-driven contract, version 0.1.0.
- `AGENTS/` subdirectory with `api.md`, `lifecycle.md`,
  `accessibility.md`, `testing.md`, `ssr.md`.
- `docs/` subdirectory with topic guides: `accessibility.md`,
  `custom-rendering.md`, `preloading.md`, `parameters-reference.md`,
  `recipes.md`, `ssr.md`, `styling.md`, `troubleshooting.md`.
- `examples/` subdirectory: `Basic.razor`, `TwoWayBinding.razor`,
  `Persistence.razor`, `CustomLabels.razor`, `CustomRendering.razor`,
  `Preloaded.razor`, `MultipleSelects.razor`, `SystemPreference.razor`,
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
`lily-design-system-svelte-theme-select` v0.1.0. The DOM contract,
managed-link discriminator, initial-value resolution, and apply
order match clause-for-clause.

### Notes

- The `onChange` callback prop from the Svelte canonical maps to the
  `OnChange` Blazor `EventCallback<string>`. Use
  `OnChange="HandlerMethod"` in markup.
- The `children` snippet from Svelte maps to the
  `ChildContent` `RenderFragment<ThemeSelectContext>` in Blazor.
  Use `<ChildContent Context="ctx">` in consumer markup.
- The bindable model name is `Value`, accessed via `@bind-Value`.
- The select requires an interactive render mode
  (`InteractiveServer`, `InteractiveWebAssembly`, or
  `InteractiveAuto`) for its `OnAfterRenderAsync` lifecycle hook to
  fire. Static SSR renders the markup but doesn't mutate the DOM.

[Unreleased]: https://github.com/lilydesignsystem/lily-design-system
[0.1.0]: https://github.com/lilydesignsystem/lily-design-system
