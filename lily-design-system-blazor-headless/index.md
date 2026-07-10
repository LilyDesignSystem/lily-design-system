# Lily Design System™ - Blazor Headless

A comprehensive headless Blazor component library with accessible, unstyled Razor components for building design systems. Every component follows WCAG 2.2 AAA guidelines with full ARIA support, keyboard navigation, and internationalization readiness.

**Headless** means zero CSS, zero styles, zero opinions about appearance. You provide all styling. Components provide structure, semantics, accessibility, and behavior.

## Features

- Headless Blazor Razor components
- .NET 10 with C#
- WCAG 2.2 AAA accessibility compliance
- Full keyboard navigation support
- ARIA attributes and roles
- Internationalization-ready (no hardcoded strings)
- Zero dependencies beyond Blazor
- Works with any CSS framework or custom styles

## Quick Start

### Install

Add a ProjectReference to the library:

```xml
<ProjectReference Include="../lily-design-system-blazor-headless/src/LilyBlazorHeadless/LilyBlazorHeadless.csproj" />
```

### Basic Usage

```razor
@using LilyBlazorHeadless.Components

<Form Label="Contact" OnSubmit="HandleSubmit">
    <Field Label="Name" Required="true" Error="@GetError("name")">
        <TextInput Label="Name" Value="@name" ValueChanged="v => name = v" Required="true" />
    </Field>
    <Button Type="submit">Submit</Button>
</Form>
```

## Commands

| Command        | Description       |
| -------------- | ----------------- |
| `dotnet build` | Build the project |
| `dotnet test`  | Run all tests     |

## Project Structure

```
lily-design-system-blazor-headless/
├── AGENTS.md
├── CLAUDE.md
├── README.md -> index.md
├── index.md
├── spec/index.md
├── AGENTS/
│   ├── accessibility.md
│   ├── components.md
│   ├── headless.md
│   ├── internationalization.md
│   ├── lily.md
│   └── theme.md
├── src/LilyBlazorHeadless/
│   ├── LilyBlazorHeadless.csproj
│   └── Components/
│       └── {ComponentPascalCase}.razor
└── tests/LilyBlazorHeadless.Tests/
    ├── LilyBlazorHeadless.Tests.csproj
    └── Components/
        └── {ComponentPascalCase}Tests.cs
```

## Architecture

### Component Patterns

Each component is a Razor component (`.razor` file) in `Components/`:

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

### Blazor Patterns

| Pattern             | Example                                                                       |
| ------------------- | ----------------------------------------------------------------------------- |
| Two-way binding     | `@bind-Value`, `@bind-Checked`, `@bind-Open` or manual `Value`/`ValueChanged` |
| Events              | `OnSubmit` (Form), `@onclick` (Button)                                        |
| Child content       | `RenderFragment` / `RenderFragment<T>` for templating                         |
| Cascading values    | `CascadingValue` / `CascadingParameter` for shared state                      |
| Attribute splatting | `[Parameter(CaptureUnmatchedValues = true)]` for rest props                   |

### Root Element CSS Class

Every component's first HTML element sets a class combining the kebab-case name with consumer CssClass:

```razor
<button class="@($"button {CssClass}")">
<div class="@($"banner {CssClass}")">
<nav class="@($"breadcrumb-nav {CssClass}")">
```

### Headless Principles

- Zero CSS in any component -- fully headless
- Semantic HTML structure
- ARIA attributes for accessibility
- Consumers provide all CSS via CssClass parameter
- Consumers provide all user-facing text via parameters (i18n-ready)
- No inline styles, colors, sizes, spacing, or visual treatment

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
}
```

## Related Projects

- [Lily Design System](https://github.com/LilyDesignSystem/lily) - Parent project
- [Blazor Web Examples](../lily-design-system-blazor-web-examples/) - Blazor styled example app
- [React Headless](../lily-design-system-react-headless/) - React equivalent
- [Svelte Headless](../lily-design-system-svelte-headless/) - Svelte equivalent
- [Vue Headless](../lily-design-system-vue-headless/) - Vue equivalent
- [Angular Headless](../lily-design-system-angular-headless/) — Angular 20 equivalent

## License

MIT or Apache-2.0 or GPL-2.0 or GPL-3.0, or contact us for more options.

## Contact

Joel Parker Henderson (joel@joelparkerhenderson.com)

---

Lily™ and Lily Design System™ are trademarks.
