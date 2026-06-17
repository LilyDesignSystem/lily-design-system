# Testing — Lily Blazor Helpers

Every helper ships a [bUnit](https://bunit.dev/) + xUnit suite.
This page lists the test harness expectations common to all helpers;
per-helper acceptance criteria live in the helper's own
`spec.md` §7.

## Stack

- [xUnit](https://xunit.net/) — test runner + assertion library.
- [bUnit](https://bunit.dev/) — Blazor component testing.
  `TestContext`, `RenderComponent<T>`, `ComponentParameter`,
  `JSInterop` mocking.
- Plain `dotnet test` to run.

## Project shape

Most consumers test the helpers alongside their other Blazor tests
in a single `*.Tests.csproj`. The minimum csproj:

```xml
<Project Sdk="Microsoft.NET.Sdk">
    <PropertyGroup>
        <TargetFramework>net10.0</TargetFramework>
        <Nullable>enable</Nullable>
        <ImplicitUsings>enable</ImplicitUsings>
        <IsPackable>false</IsPackable>
    </PropertyGroup>
    <ItemGroup>
        <PackageReference Include="Microsoft.NET.Test.Sdk" Version="17.*" />
        <PackageReference Include="xunit" Version="2.*" />
        <PackageReference Include="xunit.runner.visualstudio" Version="2.*" />
        <PackageReference Include="bunit" Version="1.*" />
    </ItemGroup>
</Project>
```

## Standard test class

Every test class derives from `Bunit.TestContext`:

```csharp
using Bunit;
using Bunit.JSInterop;
using LilyDesignSystem.Blazor.Helpers;
using Microsoft.AspNetCore.Components;
using Xunit;

namespace LilyDesignSystem.Blazor.Helpers.Tests;

public class ThemeSelectTests : TestContext
{
    public ThemeSelectTests()
    {
        JSInterop.Mode = JSRuntimeMode.Loose;
        JSInterop.SetupVoid("eval", _ => true).SetVoidResult();
        JSInterop.Setup<string?>("eval", _ => true).SetResult(null);
    }
}
```

`JSRuntimeMode.Loose` lets unmatched interop calls return their
default value instead of throwing. The two explicit setups make
sure `eval`-based DOM mutations don't blow up.

## Standard mount

```csharp
[Fact]
public void Section_7_1_Renders_Select_With_Options()
{
    var cut = RenderComponent<ThemeSelect>(p => p
        .Add(x => x.Label, "Theme")
        .Add(x => x.ThemesUrl, "/assets/themes/")
        .Add(x => x.Themes, new[] { "light", "dark" }));

    var root = cut.Find("select");
    Assert.Equal(2, cut.FindAll("option").Count);
}
```

## Common assertions

| Goal                                     | Pattern                                                              |
| ---------------------------------------- | -------------------------------------------------------------------- |
| Wait for `OnAfterRenderAsync`            | `await Task.Yield();` (bUnit pumps the render queue synchronously).  |
| Find an option by value                  | `cut.Find("option[value=\"dark\"]")`                                 |
| Find all options                         | `cut.FindAll("option")`                                              |
| Trigger a select change                  | `await cut.Find("select").ChangeAsync(new() { Value = "dark" })`     |
| Assert `ValueChanged` fired              | Capture into a closure variable via `EventCallback.Factory.Create`   |
| Inspect a captured JS interop call       | `JSInterop.Invocations` (a list of `JSRuntimeInvocation`)            |
| Spread an unmatched attribute            | `p.AddUnmatched("data-testid", "x")`                                 |
| Custom `ChildContent` render fragment    | Pass `RenderFragment<TContext>` directly via `p.Add(x => x.ChildContent, …)` |

## Driving a `@bind-Value` test

`@bind-Value` is sugar for `Value=` + `ValueChanged=`. In tests you
wire the callback explicitly:

```csharp
var captured = "";
var cut = RenderComponent<ThemeSelect>(p => p
    .Add(x => x.Label, "Theme")
    .Add(x => x.ThemesUrl, "/t/")
    .Add(x => x.Themes, new[] { "light", "dark" })
    .Add(x => x.ValueChanged, EventCallback.Factory.Create<string>(
        this, v => captured = v)));
await Task.Yield();
Assert.Equal("light", captured);
```

## Inspecting interop calls

bUnit records every `JS.InvokeAsync` / `InvokeVoidAsync` call in
`JSInterop.Invocations`. Inspect them after `await Task.Yield()`:

```csharp
var sawDark = false;
foreach (var inv in JSInterop.Invocations)
{
    if (inv.Identifier == "eval"
        && inv.Arguments.Count > 0
        && inv.Arguments[0] is string s
        && s.Contains("/assets/themes/dark.css"))
    {
        sawDark = true;
        break;
    }
}
Assert.True(sawDark);
```

The helpers build their own JS snippets via internal static
`Build*Script` methods so each script is unit-testable in isolation
without a `TestContext`.

## RenderFragment<TContext> tests

```csharp
RenderFragment<ThemeSelectContext> custom = ctx => builder =>
{
    builder.OpenElement(0, "div");
    builder.AddAttribute(1, "data-testid", "custom");
    builder.AddAttribute(2, "data-name", ctx.Name);
    builder.AddContent(3, string.Join(",", ctx.Themes));
    builder.CloseElement();
};

var cut = RenderComponent<ThemeSelect>(p => p
    .Add(x => x.Label, "Theme")
    .Add(x => x.ThemesUrl, "/t/")
    .Add(x => x.Themes, new[] { "light", "dark" })
    .Add(x => x.ChildContent, custom));

var div = cut.Find("[data-testid='custom']");
Assert.Equal("theme", div.GetAttribute("data-name"));
```

For more readable tests, bUnit also accepts inline Razor via
`RenderComponent` with markup, but the `RenderFragment` builder
form keeps the test self-contained without an extra .razor file.

## SSR / prerender sanity

There isn't an isolated "render under static SSR" mode in bUnit
1.x, but you can verify SSR safety two ways:

1. **No exceptions during first render.** Use bUnit with a
   permissive interop mock; the markup is identical to what static
   SSR would emit.
2. **Pure-helper tests.** All DOM-touching logic is encapsulated
   in private methods that produce a JS string (`BuildApplyScript`).
   Unit-test those strings — they're SSR-irrelevant by construction
   because they're just strings until they reach `IJSRuntime`.

## One test per spec § acceptance

Each helper's `spec.md` §7 numbers its acceptance criteria, and the
test file names each `[Fact]` after the section number so a reviewer
can cross-reference the spec without scrolling:

```csharp
[Fact]
public void Section_7_6_Initial_Value_Resolves_To_Light_Or_First() { … }
```

This is mechanical and intentional — when a clause is added to the
spec, a test must follow.

## Don't

- Don't mock Blazor's render tree — use bUnit's `RenderComponent`.
- Don't mock `JSRuntime` by hand — use `bUnit.JSInterop`.
- Don't use snapshot tests for HTML; assert specific attributes and
  text. Snapshots invite drift; targeted asserts catch regressions.
- Don't use `Task.Delay` to "wait" for the render queue — bUnit is
  synchronous; `await Task.Yield()` is enough to let
  `OnAfterRenderAsync` continuations run.
- Don't write `[Fact]` tests that don't map to a §7 clause; the
  acceptance criteria are the contract.

## Async lifecycle tests

`OnAfterRenderAsync` is the key lifecycle hook for the helpers.
bUnit runs it as part of the render pipeline; after `RenderComponent`
returns, the first render has happened but async continuations
inside `OnAfterRenderAsync` may still be pending. `await Task.Yield()`
flushes the message loop and lets those continuations land:

```csharp
[Fact]
public async Task Section_7_7_Interop_Fires_With_Constructed_Href()
{
    var cut = RenderComponent<ThemeSelect>(p => p
        .Add(x => x.Label, "Theme")
        .Add(x => x.ThemesUrl, "/assets/themes/")
        .Add(x => x.Themes, new[] { "light" }));

    await Task.Yield();  // let OnAfterRenderAsync continuations run

    Assert.Contains(JSInterop.Invocations,
        inv => inv.Identifier == "eval"
               && inv.Arguments[0] is string s
               && s.Contains("/assets/themes/light.css"));
}
```

## Test naming

Pattern: `Section_<num>_<short_camel_or_snake_description>`. The
underscore separators play well with `dotnet test --logger "console;verbosity=detailed"`
listings and grep.

## Sample fixture data

Helpers use shared fixture arrays:

```csharp
private static readonly string[] Themes = { "light", "dark", "abyss" };
private const string UrlTrailing = "/assets/themes/";
private const string UrlNoTrailing = "/assets/themes";
```

…to keep individual `[Fact]`s lean.
