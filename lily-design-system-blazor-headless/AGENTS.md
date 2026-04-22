# Lily Design System - Blazor Headless

A headless Blazor component library with accessible, unstyled Razor components. Based on the Lily Design System canonical component list.

@AGENTS/lily.md
@AGENTS/components.md
@AGENTS/accessibility.md
@AGENTS/internationalization.md
@AGENTS/headless.md
@AGENTS/theme.md
@AGENTS/nhs-uk-design-system-references.md

## Quick Reference

- **Package**: lily-design-system-blazor-headless
- **Version**: 0.1.0
- **Created**: 2026-03-03
- **License**: MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or contact us for more
- **Contact**: Joel Parker Henderson (joel@joelparkerhenderson.com)

## IMPORTANT Architecture

- .NET 10.0 with C#
- Blazor Razor components (no class components)
- Each component: `.razor` + test `.cs` + `.md`
- All component files in `Components/` directory (flat structure)
- Namespace: `LilyBlazorHeadless.Components`

## STRICT Prohibitions

- **No CSS** -- no Tailwind, no Bootstrap, no inline styles
- **No images, icons, or fonts** -- consumers provide these
- **No hardcoded user-facing strings** -- all text through parameters
- **No JavaScript** -- pure Blazor/C# only unless absolutely necessary for browser APIs

## Component Patterns

### File Naming

Each component has exactly three files:

```
{ComponentPascalCase}.razor       # Implementation
{ComponentPascalCase}Tests.cs     # Tests
{ComponentPascalCase}.md          # Documentation
```

### Root Element CSS Class

Every component's first HTML element sets a class combining the kebab-case name with consumer CssClass:

```razor
<button class="@($"button {CssClass}")">
<div class="@($"banner {CssClass}")">
<nav class="@($"breadcrumb-nav {CssClass}")">
```

### Parameter Pattern

```razor
@namespace LilyBlazorHeadless.Components

<button class="@($"button {CssClass}")" @attributes="AdditionalAttributes">
    @ChildContent
</button>

@code {
    [Parameter] public string CssClass { get; set; } = "";
    [Parameter] public RenderFragment? ChildContent { get; set; }
    [Parameter(CaptureUnmatchedValues = true)]
    public Dictionary<string, object>? AdditionalAttributes { get; set; }
}
```

### State Management

- Two-way binding: `Value`/`ValueChanged` (TextInput, Select), `Checked`/`CheckedChanged` (SwitchButton, CheckboxInput), `Open`/`OpenChanged` (Dialog, Drawer)
- Events: `OnSubmit` (Form), `EventCallback` for custom events
- Cascading parameters for shared state
- Auto-generate IDs with `Guid.NewGuid().ToString("N")[..8]` when not provided

### Callback Naming Convention

All custom callback parameters use PascalCase EventCallback:

- `ValueChanged`, `CheckedChanged`, `OpenChanged` -- two-way binding callbacks
- `OnSubmit`, `OnClose`, `OnCancel` -- event callbacks
- `OnAdd`, `OnInputChange` -- domain-specific callbacks

### Input/View Pattern

Paired components for data entry vs. read-only display:

- `FiveStarRatingPicker` (interactive) / `FiveStarRatingView` (read-only)
- `NetPromoterScorePicker` / `NetPromoterScoreView`
- `MeasurementInstanceInput` / `MeasurementInstanceView`
- `PostalCodeInput` / `PostalCodeView`

## Testing

### Stack

- **bUnit** -- Blazor component testing library
- **xUnit** -- test framework
- **dotnet test** -- test runner

### Test File Pattern

```csharp
using Bunit;
using Xunit;
using LilyBlazorHeadless.Components;

public class ButtonTests : TestContext
{
    [Fact]
    public void Renders_With_Correct_Tag()
    {
        var cut = RenderComponent<Button>(parameters =>
            parameters.AddChildContent("Click me"));
        var button = cut.Find("button");
        Assert.NotNull(button);
        Assert.Contains("Click me", button.TextContent);
    }

    [Fact]
    public void Handles_Click_Events()
    {
        var clicked = false;
        var cut = RenderComponent<Button>(parameters =>
            parameters
                .AddChildContent("Click")
                .Add(p => p.AdditionalAttributes,
                    new Dictionary<string, object> { ["onclick"] = EventCallback.Factory.Create(this, () => clicked = true) }));
        cut.Find("button").Click();
        Assert.True(clicked);
    }
}
```

## Accessibility

### Standards

- WCAG 2.2 AAA compliance
- WAI-ARIA Authoring Practices patterns
- Semantic HTML elements over generic divs

### Common Patterns

- `<label for="@id">` -- link labels to inputs
- `aria-labelledby` / `aria-describedby` -- link related elements
- `aria-invalid` + `aria-errormessage` -- error state
- `role="alert"` -- announce dynamic content
- `role="group"` with `aria-label` -- group related controls
- Roving tabindex (`tabindex="@(selected ? 0 : -1)"`) -- grid navigation
- `aria-pressed` -- toggle button state
- `aria-expanded` -- expandable sections
- `aria-current` -- current item in navigation

### Auto-Generated IDs

Components auto-generate unique IDs for ARIA linking:

```csharp
private string generatedId = $"component-{Guid.NewGuid().ToString("N")[..8]}";
private string inputId => Id ?? generatedId;
private string descriptionId => $"{inputId}-desc";
private string errorId => $"{inputId}-error";
```

## Build & Test Commands

```bash
dotnet build    # Build the project
dotnet test     # Run all tests
```

## Known Gotchas

- `BreadcrumbListItem` has NO `Href` parameter -- wrap links in child `<a>` elements
- `Alert` uses `Heading` parameter (not `Label` or `Title`)
- `Dialog` uses `Label` parameter (not `Title`)
- `ErrorSummary` has `Title` parameter + `ChildContent` (no `Errors` parameter -- render errors as children)
- `TabBarButton` requires `Controls` parameter (id of the associated panel)
- `Combobox` has separate `ValueChanged` (value) and `OpenChanged` (open state) callbacks
- Blazor uses `EventCallback` not plain delegates for component callbacks
