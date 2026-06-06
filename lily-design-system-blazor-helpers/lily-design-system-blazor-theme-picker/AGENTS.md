# AGENTS — ThemePicker (Blazor helper)

Single source of truth: [spec.md](./spec.md). Read it first; everything
below is a fast index.

## What this package is

A reusable Blazor headless theme picker that **loads theme CSS files
dynamically at runtime** from a developer-supplied directory URL. Ships
no CSS; consumer styles the `theme-picker` class hook.

## Files

| File                       | Purpose                                          |
| -------------------------- | ------------------------------------------------ |
| `spec.md`                  | Specification-driven contract (canonical).       |
| `ThemePicker.razor`        | Razor markup.                                    |
| `ThemePicker.razor.cs`     | C# code-behind (partial class).                  |
| `ThemePickerTests.cs`      | bUnit + xUnit spec, one `[Fact]` per §7 item.    |
| `index.md`                 | User guide.                                      |

## Public surface

- Component: `ThemePicker` in namespace `LilyDesignSystem.Blazor.Helpers`.
- Context: `ThemePickerContext` for custom `ChildContent` rendering.
- Required parameters: `Label`, `ThemesUrl`, `Themes`.
- Two-way binding: `@bind-Value` (string slug).

## Behaviour contract (one paragraph)

On every theme change the picker (1) sets the `href` of one managed
`<link rel="stylesheet" data-lily-theme-picker="{Name}">` in
`document.head` to `{ThemesUrl}{slug}{Extension}`, (2) sets
`data-theme="{slug}"` on `document.documentElement`, (3) optionally
writes the slug to `localStorage[StorageKey]`, and (4) invokes
`OnChange` and `ValueChanged`. All DOM writes happen through
`IJSRuntime` inside `OnAfterRenderAsync`, so the component is SSR /
prerender safe. Initial value resolves from `Value` > storage >
`DefaultValue` > `"light"` (if present) > `Themes[0]`.

## HTML

`<fieldset class="theme-picker {CssClass}" role="radiogroup"
aria-label="{Label}">` with one native `<input type="radio">` per
slug. Custom rendering via the `ChildContent` render fragment
receiving `ThemePickerContext`.

## Accessibility

- WCAG 2.2 AAA target.
- Native radio inputs provide Arrow / Space / Tab semantics.
- `aria-label` carries the consumer-supplied group name.
- Option labels default to title-cased slugs; the word "default" is
  never emitted.

## Conventions this package follows

- Blazor partial class (`.razor` + `.razor.cs`).
- `[Parameter]` properties; `[Parameter(CaptureUnmatchedValues = true)]`
  for spread.
- `EventCallback<string>` for `ValueChanged`, `OnChange`.
- `IJSRuntime` injected for DOM mutation.
- No runtime dependency beyond `Microsoft.AspNetCore.Components.Web`.
- No bundled CSS, fonts, icons, or images.
- All user-facing strings come from parameters.
