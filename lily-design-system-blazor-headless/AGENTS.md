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
- **License**: MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause or contact us for more
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

**Most components do NOT declare `Value`/`ValueChanged`, `Checked`/`CheckedChanged`, or `OnSubmit`.** The form-field primitives (`TextInput`, `EmailInput`, `TextAreaInput`, `Select`, `Option`, `RadioInput`, `CheckboxInput`, `Form`, `Field`, `Fieldset`, `SummaryListItem`, and most others) declare only `Label`/`CssClass`/`ChildContent`/`AdditionalAttributes` — they are thin wrappers around the native element. Passing a PascalCase `Value="..."` or `OnSubmit="..."` to one of these compiles cleanly (it lands in `AdditionalAttributes`) but does **nothing**: it is not wired as a real DOM value or event. This bit five composed pages in `lily-design-system-blazor-web-examples` before being fixed (P7-T8) — see that app's `BookAnAppointment.razor` header comment for the full incident writeup.

The correct idiom for these thin wrappers is the **native-attribute pattern**: lowercase `value="@x"` / `checked="@x"` / `name="@x"` plus a `@onchange`/`@oninput` directive with a `ChangeEventArgs` handler, and `novalidate @onsubmit="Handler"` on `Form`. Razor directive attributes (`@onchange`, `@oninput`, `@onclick`, `@onsubmit`, `@onkeydown`) always compile to their fixed lowercase DOM event name regardless of whether the component declares that parameter, so they splat and wire correctly through `AdditionalAttributes` even on these minimal components. A plain PascalCase attribute name does not get this treatment.

A small number of components genuinely DO declare a real bindable pair, and `@bind-X`/`XChanged` works as expected on them — check the component's own `.razor` source before assuming either way:

- `SwitchButton`: real `Checked`/`CheckedChanged`, invoked on click.
- `Combobox`: real `Value`/`ValueChanged` and `Open`/`OpenChanged`; it renders its own `<input role="combobox">` internally, so its `ChildContent` is just the listbox's option elements, not another wrapper.
- `AccordionCheckbox`: real `Checked`/`CheckedChanged`.
- `Dialog`/`Drawer`-family components: check `Open`/`OpenChanged` individually; do not assume.

Auto-generate IDs with `Guid.NewGuid().ToString("N")[..8]` when a component needs one internally (e.g. `Combobox`'s listbox id, `AccordionCheckbox`'s checkbox/panel ids).

### Callback Naming Convention

Where a component genuinely owns a callback parameter (see the short list above), it uses PascalCase EventCallback: `ValueChanged`, `CheckedChanged`, `OpenChanged` for two-way binding; `OnAdd`, `OnInputChange` for domain-specific events. Do not assume a component has one of these without checking its source — most don't.

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
- `Alert` uses `Label` parameter (not `Heading` or `Title`) -- put a heading in `ChildContent` if you need one
- `Dialog` uses `Label` parameter (not `Title`)
- `ErrorSummary` uses `Label` parameter (not `Title`) + `ChildContent` (no `Errors` parameter -- render errors as children)
- `TabBarButton` requires `Controls` parameter (id of the associated panel)
- `Combobox` has real `Value`/`ValueChanged` and separate `Open`/`OpenChanged` callbacks; renders its own `<input role="combobox">` internally -- `ChildContent` is the option elements only
- `TextInput`/`EmailInput`/`TextAreaInput`/`Select`/`Option`/`RadioInput`/`CheckboxInput`/`Form`/`Field`/`Fieldset` have NO `Value`/`ValueChanged`/`Checked`/`CheckedChanged`/`OnSubmit`/`Legend` parameters -- only `Label`/`CssClass`/`ChildContent`/`AdditionalAttributes`. Use the native-attribute idiom (see "State Management" above).
- `SwitchButton` has real `Checked`/`CheckedChanged`, invoked internally on click -- `@bind-Checked` works
- Blazor uses `EventCallback` not plain delegates for component callbacks
