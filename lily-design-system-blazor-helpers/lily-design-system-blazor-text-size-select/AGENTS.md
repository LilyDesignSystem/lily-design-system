# AGENTS — TextSizeSelect (Blazor helper)

Single source of truth: [spec/index.md](./spec/index.md). Read it first; everything
below is a fast index.

## What this package is

A reusable Blazor headless text-size select that applies the chosen
size slug to the document root via `data-text-size`, with optional
`localStorage` persistence. Ships no CSS; consumer styles the
`text-size-select` class hook and maps each `[data-text-size="…"]`
slug to real typography.

## Files

| File                       | Purpose                                          |
| -------------------------- | ------------------------------------------------ |
| `spec/index.md`                  | Specification-driven contract (canonical).       |
| `TextSizeSelect.razor`     | Razor markup.                                    |
| `TextSizeSelect.razor.cs`  | C# code-behind (partial class).                  |
| `TextSizeSelectTests.cs`   | bUnit + xUnit spec, one `[Fact]` per §7 item.    |
| `index.md`                 | User guide.                                      |

## Public surface

- Component: `TextSizeSelect` in namespace
  `LilyDesignSystem.Blazor.Helpers`.
- Context: `TextSizeSelectContext` for custom `ChildContent` rendering.
- Internal static helpers (visible to the test project):
  `BuildApplyScript(string, string?)`, `TitleCase(string)`.

Required parameters: `Label`, `Sizes`.

## Behaviour contract (one paragraph)

On every size change the select (1) sets
`document.documentElement` `data-text-size` to the chosen slug, (2)
optionally writes the slug to `localStorage[StorageKey]`, and (3)
invokes `OnChange` and `ValueChanged` with the slug. All DOM writes
happen through `IJSRuntime` inside `OnAfterRenderAsync`. Initial value
resolves from `Value` > storage > `DefaultValue` > `"medium"` (if
present) > `Sizes[0]`.

## HTML

`<select class="text-size-select @CssClass" aria-label="@Label"
name="@Name">` with one native `<option class="text-size-select-option">`
per slug. Custom rendering via the `ChildContent` render fragment
receiving `TextSizeSelectContext`.

## Accessibility

- WCAG 2.2 AAA target; supports 1.4.4 (Resize Text).
- The native `<select>` provides Arrow / Home / End / typeahead.
- `aria-label` carries the consumer-supplied accessible name.
- Option labels default to title-cased slugs.

## Conventions this package follows

- Blazor partial class (`.razor` + `.razor.cs`).
- `[Parameter]` properties; `[Parameter(CaptureUnmatchedValues = true)]`
  for spread.
- `EventCallback<string>` for `ValueChanged`, `OnChange`.
- `IJSRuntime` injected for DOM mutation.
- No runtime dependency beyond `Microsoft.AspNetCore.Components.Web`.
- No bundled CSS, fonts, icons, or images.
- All user-facing strings come from parameters.
