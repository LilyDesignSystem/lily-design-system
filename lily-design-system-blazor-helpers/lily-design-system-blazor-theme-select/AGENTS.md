# AGENTS — ThemeSelect (Blazor helper)

Single source of truth: [spec/index.md](./spec/index.md). Read it first; everything
below is a fast index.

## What this package is

A reusable Blazor headless theme select that **loads theme CSS files
dynamically at runtime** from a developer-supplied directory URL. Ships
no CSS; consumer styles the `theme-select` class hook.

## Files

| File                       | Purpose                                          |
| -------------------------- | ------------------------------------------------ |
| `spec/index.md`                  | Specification-driven contract (canonical).       |
| `ThemeSelect.razor`        | Razor markup.                                    |
| `ThemeSelect.razor.cs`     | C# code-behind (partial class).                  |
| `ThemeSelectTests.cs`      | bUnit + xUnit spec, one `[Fact]` per §7 item.    |
| `index.md`                 | User guide.                                      |

## Public surface

- Component: `ThemeSelect` in namespace `LilyDesignSystem.Blazor.Helpers`.
- Context: `ThemeSelectContext` for custom `ChildContent` rendering.
- Required parameters: `Label`, `ThemesUrl`, `Themes`.
- Optional `Placeholder` (defaults to `Label`).
- Two-way binding: `@bind-Value` (string slug).

## Behaviour contract (one paragraph)

On every theme change the select (1) sets the `href` of one managed
`<link rel="stylesheet" data-lily-theme-select="{Name}">` in
`document.head` to `{ThemesUrl}{slug}{Extension}`, (2) sets
`data-theme="{slug}"` on `document.documentElement`, (3) optionally
writes the slug to `localStorage[StorageKey]`, and (4) invokes
`OnChange` and `ValueChanged`. All DOM writes happen through
`IJSRuntime` inside `OnAfterRenderAsync`, so the component is SSR /
prerender safe. Initial value resolves from `Value` > storage >
`DefaultValue` > `"light"` (if present) > `Themes[0]`.

The `<select>`'s own DOM value never tracks `Value`. A component-owned
placeholder `<option value="" selected>` is always the selected one, and
after every change the handler snaps the live element's value back to it
(`Object.assign(el, { value: "" })` via `IJSRuntime`, wrapped in
try/catch for prerender) before applying the chosen slug. The closed
control therefore always reads `Placeholder ?? Label` rather than the
active theme name. The real selection lives in `Value`; everything
downstream is unchanged.

## HTML

`<select class="theme-select @CssClass" aria-label="@Label"
name="@Name">` whose FIRST child is
`<option class="theme-select-option theme-select-placeholder" value=""
selected>{Placeholder ?? Label}</option>`, followed by one native
`<option class="theme-select-option" value="{slug}">` per slug. Real
options are never marked `selected`. Custom rendering via the
`ChildContent` render fragment receiving `ThemeSelectContext`; the
placeholder is rendered in that path too, before the fragment.

## Accessibility

- WCAG 2.2 AAA target.
- The native `<select>` provides Arrow / Home / End / typeahead semantics.
- `aria-label` carries the consumer-supplied accessible name.
- Option labels default to title-cased slugs; the word "default" is
  never emitted.
- Known tradeoff: because the closed control always reads the
  placeholder, the active theme is not announced as the combobox value.
  Consumers should surface it in visible text or a polite live region.
  See `docs/accessibility.md`.

## Conventions this package follows

- Blazor partial class (`.razor` + `.razor.cs`).
- `[Parameter]` properties; `[Parameter(CaptureUnmatchedValues = true)]`
  for spread.
- `EventCallback<string>` for `ValueChanged`, `OnChange`.
- `IJSRuntime` injected for DOM mutation.
- No runtime dependency beyond `Microsoft.AspNetCore.Components.Web`.
- No bundled CSS, fonts, icons, or images.
- All user-facing strings come from parameters.
