# Conventions — Lily Blazor Helpers

Working rules for every helper in this catalog. The
[shared/](./shared/) files inherit from the Lily-wide
`AGENTS/headless.md`, `internationalization.md`, and `theme.md`; this
file lists the Blazor-specific decisions layered on top.

## File shape per helper

```
lily-design-system-blazor-<name>/
├── spec.md             ← single source of truth, numbered with §
├── AGENTS.md           ← fast-index pointer for agents
├── AGENTS/             ← per-helper topic agent files
│   ├── api.md
│   ├── lifecycle.md
│   ├── accessibility.md
│   ├── testing.md
│   └── ssr.md
├── CLAUDE.md           ← `@AGENTS.md`
├── index.md            ← comprehensive human-readable guide
├── {Pascal}.razor      ← Razor markup, `@namespace …Helpers`
├── {Pascal}.razor.cs   ← partial class with code-behind
├── {Pascal}Tests.cs    ← bUnit + xUnit spec
├── CHANGELOG.md
├── docs/               ← topic-by-topic deep-dives
└── examples/           ← runnable `.razor` files
```

## Namespace

Every `.razor` file declares:

```razor
@namespace LilyDesignSystem.Blazor.Helpers
```

Every `.razor.cs` file declares:

```csharp
namespace LilyDesignSystem.Blazor.Helpers;
```

No exceptions. A consumer adds one `@using LilyDesignSystem.Blazor.Helpers`
to a `_Imports.razor` and all helpers are reachable as
`<ThemePicker …>` / `<LocalePicker …>`.

## Partial class shape

Every helper SFC follows this template.

`{Pascal}.razor`:

```razor
@namespace LilyDesignSystem.Blazor.Helpers

@*
    {Pascal} — Blazor helper component.
    Single source of truth: spec.md (§1–§9).
*@

<root-element class="@RootClass"
              role="..."
              aria-label="@Label"
              @attributes="AdditionalAttributes">
    @if (ChildContent is not null)
    {
        @ChildContent(BuildContext())
    }
    else
    {
        <!-- default markup -->
    }
</root-element>
```

`{Pascal}.razor.cs`:

```csharp
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;

namespace LilyDesignSystem.Blazor.Helpers;

/// <summary>
/// Context for the ChildContent render fragment. See spec.md §4.
/// </summary>
public sealed class {Pascal}Context
{
    public required IReadOnlyList<string> Items { get; init; }
    public required string Value { get; init; }
    public required Func<string, Task> SetValue { get; init; }
    // …
}

public partial class {Pascal} : ComponentBase
{
    // Parameters — see spec.md §4.1.

    [Parameter, EditorRequired] public string Label { get; set; } = "";
    [Parameter, EditorRequired] public IReadOnlyList<string> Items { get; set; }
        = Array.Empty<string>();

    [Parameter] public string Value { get; set; } = "";
    [Parameter] public EventCallback<string> ValueChanged { get; set; }

    [Parameter] public RenderFragment<{Pascal}Context>? ChildContent { get; set; }

    [Parameter] public string CssClass { get; set; } = "";

    [Parameter(CaptureUnmatchedValues = true)]
    public Dictionary<string, object>? AdditionalAttributes { get; set; }

    [Inject] private IJSRuntime JS { get; set; } = default!;

    private bool _initialised;

    private string RootClass => $"{ClassHook} {CssClass}".Trim();

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (!firstRender || _initialised) return;
        _initialised = true;
        // resolve initial value, apply, fire callbacks
    }
}
```

The split between `.razor` (markup) and `.razor.cs` (logic) keeps
the C# tooling (rename, find-references, code lens, decompilation,
analyzers) first-class. It also keeps the Razor file small enough
that a reviewer can scan it in one glance.

## Parameters

- `[Parameter, EditorRequired] public T Name { get; set; } = default!;`
  for required parameters. The compiler warns if a consumer forgets
  to pass them.
- `[Parameter] public T? Name { get; set; }` (nullable) when the
  default is "no value provided"; the component handles `null`
  internally.
- `[Parameter] public T Name { get; set; } = sensibleDefault;` when a
  non-`null` default exists.
- Always assign `Array.Empty<string>()` / `new Dictionary<…>()` to
  collection-typed parameters so consumers never see a `NullReferenceException`.

## Two-way binding

Blazor's two-way binding follows the
`{Name}` + `{Name}Changed` convention. To make `@bind-Value="theme"`
work, expose:

```csharp
[Parameter] public string Value { get; set; } = "";
[Parameter] public EventCallback<string> ValueChanged { get; set; }
```

Inside the component, write to `Value` and then fire
`await ValueChanged.InvokeAsync(Value)`. Consumers write:

```razor
<ThemePicker @bind-Value="theme" … />
```

## EventCallback vs Action

- `EventCallback<T>` — the right choice in 99% of cases. It tracks
  the receiving component so a Blazor `StateHasChanged` happens
  automatically.
- `Action<T>` — only for purely-functional callbacks where the
  consumer doesn't need the receiving component to re-render.

The helpers in this catalog use `EventCallback<string>` exclusively
for `ValueChanged` and `OnChange`.

## CaptureUnmatchedValues spread

Every helper exposes:

```csharp
[Parameter(CaptureUnmatchedValues = true)]
public Dictionary<string, object>? AdditionalAttributes { get; set; }
```

…and binds it on the root element with `@attributes="AdditionalAttributes"`.
Consumers can pass arbitrary attributes (`id`, `data-*`,
`@onclick`, ARIA overrides) and they fall through onto the root.

## RenderFragment<TContext> for custom rendering

The Blazor analogue of Vue scoped slots / Svelte snippets / React
render-props is `RenderFragment<TContext>`. Each helper exposes:

```csharp
[Parameter] public RenderFragment<{Pascal}Context>? ChildContent { get; set; }
```

Inside the markup:

```razor
@if (ChildContent is not null)
{
    @ChildContent(BuildContext())
}
else
{
    <!-- default markup -->
}
```

The `*Context` record is a `sealed class` with `required init` fields,
typed for clarity. Consumers write:

```razor
<ThemePicker Label="Theme" ThemesUrl="/t/" Themes="…">
    <ChildContent Context="ctx">
        @foreach (var t in ctx.Themes)
        {
            <button @onclick="@(() => ctx.SetTheme(t))">@t</button>
        }
    </ChildContent>
</ThemePicker>
```

## OnAfterRenderAsync

All DOM-touching work happens in `OnAfterRenderAsync(bool firstRender)`,
not in `OnInitializedAsync` or `OnParametersSetAsync`. Reason: only
`OnAfterRenderAsync` has a guaranteed-interactive `IJSRuntime`. Under
static SSR / prerender, the other lifecycle hooks may run server-
side where `IJSRuntime` cannot fire.

Pattern:

```csharp
private bool _initialised;

protected override async Task OnAfterRenderAsync(bool firstRender)
{
    if (!firstRender || _initialised) return;
    _initialised = true;
    // ... resolve initial, apply, callbacks ...
}
```

The `_initialised` guard prevents a second `firstRender` if the
component is re-rendered without re-mounting (Blazor's render-tree
preserves component instances).

## IJSRuntime

DOM mutation (managed `<link>` swap, `data-theme`, `lang`, `dir`,
`localStorage`) goes through `IJSRuntime`. The helpers use
`JS.InvokeVoidAsync("eval", "(function() { … })();")` with a
pre-built JS snippet rather than a separate `.js` module file —
this keeps the helpers single-file-droppable and avoids a static
asset dependency.

Errors are swallowed in try/catch so a prerender circuit that
hasn't yet established interactivity doesn't throw:

```csharp
try
{
    await JS.InvokeVoidAsync("eval", script);
}
catch
{
    // prerender / interop unavailable
}
```

## SSR safety

`Razor` markup renders on the server when interactivity is `Server`
or `Auto` or `Static`. No DOM access happens during render. The
component does not touch `document.*` inside `OnInitialized*` or
in the markup itself.

If a future helper needs SSR-side DOM hints (`<HeadContent>` /
`<PageTitle>`), it adds them as an additional `RenderFragment`
parameter; the existing helpers don't.

## What never lives in the helper

- Bundled CSS, fonts, icons, or images.
- A locale-aware default for `Label` / `Placeholder` / `Error`.
- Routing, data fetching, persistence wrappers, network calls.
- Animations or transitions.

Everything visual and locale-specific is the consumer's. See
[`shared/headless-principles.md`](./shared/headless-principles.md).

## Naming

- Class hooks are kebab-case derivatives of the file name:
  `theme-picker`, `theme-picker-option`, `theme-picker-option-label`.
- Data attributes the consumer / CSS may want to observe use
  `data-*` (e.g. `data-theme`, `data-lily-theme-picker`).
- Don't introduce new ARIA attributes — use the platform's.
- C# names are PascalCase; field names are `_camelCase`.

## Nullability

All projects compile with `<Nullable>enable</Nullable>`. The helpers
respect this:

- Parameters that may be omitted are typed `T?`.
- Internal fields that are always set during render are typed `T`
  and assigned a sensible default (`""`, `Array.Empty<T>()`, etc.).
- Injected services are non-null and use the `= default!;` pattern
  because Blazor's DI assigns them after construction.
