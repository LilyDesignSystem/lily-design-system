# Testing — Lily Blazor Helpers

Every helper ships a [bUnit](https://bunit.dev/) + xUnit suite.
This page lists the test harness expectations common to all helpers;
per-helper acceptance criteria live in the helper's own
`spec/index.md` §7.

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

`ThemeSelect` and `LocaleSelect` are icon button + listbox controls;
`TextSizeSelect` is a native `<select>`. The mount differs accordingly.

```csharp
[Fact]
public void Section_7_1_Renders_Button_And_Listbox()
{
    var cut = RenderComponent<ThemeSelect>(p => p
        .Add(x => x.Label, "Theme")
        .Add(x => x.ThemesUrl, "/assets/themes/")
        .Add(x => x.Themes, new[] { "light", "dark" }));

    var button = cut.Find("button");
    Assert.Equal("listbox", button.GetAttribute("aria-haspopup"));
    Assert.Equal("false", button.GetAttribute("aria-expanded"));

    var list = cut.Find("ul");
    Assert.Equal("listbox", list.GetAttribute("role"));
    Assert.NotNull(list.GetAttribute("hidden"));      // closed on mount
    Assert.Equal(2, cut.FindAll("li[role='option']").Count);
    Assert.Empty(cut.FindAll("select"));              // no native select
}
```

`TextSizeSelect` keeps the original shape:

```csharp
[Fact]
public void Section_7_1_Renders_Select_With_Options()
{
    var cut = RenderComponent<TextSizeSelect>(p => p
        .Add(x => x.Label, "Text size")
        .Add(x => x.Sizes, new[] { "small", "medium" }));

    var root = cut.Find("select");
    Assert.Equal(2, cut.FindAll("option").Count);
}
```

## Common assertions

| Goal                                     | Pattern                                                              |
| ---------------------------------------- | -------------------------------------------------------------------- |
| Wait for `OnAfterRenderAsync`            | `await Task.Yield();` (bUnit pumps the render queue synchronously).  |
| Trigger a select change (**text-size only**) | `await cut.Find("select").ChangeAsync(new() { Value = "large" })` |
| Find an option by value (**text-size only**) | `cut.Find("option[value=\"large\"]")`                            |
| Open a listbox                           | `cut.Find("button").Click()`                                         |
| Find all listbox options                 | `cut.FindAll("li[role='option']")`                                   |
| Press a key on the listbox               | `cut.Find("ul").KeyDown(new KeyboardEventArgs { Key = "ArrowDown" })` |
| Press a key on the trigger               | `cut.Find("button").KeyDown(new KeyboardEventArgs { Key = "ArrowUp" })` |
| Assert which option is active            | `cut.Find("ul").GetAttribute("aria-activedescendant")` equals `cut.FindAll("li")[i].Id` |
| Assert open / closed                     | `cut.Find("ul").GetAttribute("hidden")` — non-null closed, null open |
| Select an option by pointer              | `cut.FindAll("li")[2].Click()`                                       |
| Close by focus leaving                   | Doubled `FocusOut()` — see below.                                    |
| Assert `ValueChanged` fired              | Capture into a closure variable via `EventCallback.Factory.Create`   |
| Inspect a captured JS interop call       | `JSInterop.Invocations` (a list of `JSRuntimeInvocation`)            |
| Spread an unmatched attribute            | `p.AddUnmatched("data-testid", "x")`                                 |
| Custom `ChildContent` render fragment    | Pass `RenderFragment<TContext>` directly via `p.Add(x => x.ChildContent, …)` |

## Listbox idioms

`KeyDown` / `Click` are bUnit's synchronous event dispatchers; the
async `KeyDownAsync` / `ClickAsync` forms exist too and are worth using
when the handler awaits interop you then assert on.

A full open-move-select cycle:

```csharp
var cut = RenderComponent<ThemeSelect>(p => p
    .Add(x => x.Label, "Theme")
    .Add(x => x.ThemesUrl, "/assets/themes/")
    .Add(x => x.Themes, new[] { "light", "dark", "abyss" }));
await Task.Yield();

cut.Find("button").KeyDown(new KeyboardEventArgs { Key = "ArrowDown" });
var list = cut.Find("ul");
Assert.Null(list.GetAttribute("hidden"));                 // open
Assert.Equal(cut.FindAll("li")[0].Id,
             list.GetAttribute("aria-activedescendant")); // "light" selected

cut.Find("ul").KeyDown(new KeyboardEventArgs { Key = "End" });
Assert.Equal(cut.FindAll("li")[2].Id,
             cut.Find("ul").GetAttribute("aria-activedescendant"));

await cut.Find("ul").KeyDownAsync(new KeyboardEventArgs { Key = "Enter" });
Assert.NotNull(cut.Find("ul").GetAttribute("hidden"));    // closed again
```

Assert clamping by pressing past the end and checking
`aria-activedescendant` did **not** wrap:

```csharp
cut.Find("ul").KeyDown(new KeyboardEventArgs { Key = "End" });
cut.Find("ul").KeyDown(new KeyboardEventArgs { Key = "ArrowDown" });
Assert.Equal(cut.FindAll("li")[2].Id,
             cut.Find("ul").GetAttribute("aria-activedescendant"));
```

### The doubled `FocusOut()` idiom

Closing on outside interaction is driven by the root's `focusout`,
because the packages ship no JavaScript and so have no document-level
click listener. In a real browser, opening the listbox *itself* emits a
`focusout` as focus moves button → listbox; the component flags that
move and swallows the matching event. Tests have to reproduce both:

```csharp
cut.Find("button").Click();                 // open; focus moves to the <ul>
cut.Find("div.theme-select").FocusOut();    // swallowed — the component's own move
cut.Find("div.theme-select").FocusOut();    // the real departure
Assert.NotNull(cut.Find("ul").GetAttribute("hidden"));
```

One `FocusOut()` leaves the listbox open and looks like a bug in the
component; it isn't. Blazor's `FocusEventArgs` exposes no
`relatedTarget`, so the component cannot tell the two apart by target
and counts them instead.

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

For the listbox helpers, `ChildContent` replaces the **glyph inside the
button**, not the options, and the context is
`{ Value, Open, LabelFor }`:

```csharp
RenderFragment<ThemeSelectContext> custom = ctx => builder =>
{
    builder.OpenElement(0, "span");
    builder.AddAttribute(1, "data-testid", "custom");
    builder.AddAttribute(2, "data-open", ctx.Open ? "true" : "false");
    builder.AddContent(3, ctx.LabelFor(ctx.Value));
    builder.CloseElement();
};

var cut = RenderComponent<ThemeSelect>(p => p
    .Add(x => x.Label, "Theme")
    .Add(x => x.ThemesUrl, "/t/")
    .Add(x => x.Themes, new[] { "light", "dark" })
    .Add(x => x.ChildContent, custom));
await Task.Yield();

var span = cut.Find("[data-testid='custom']");
Assert.Equal("Light", span.TextContent);
Assert.Empty(cut.FindAll(".theme-select-icon"));   // default glyph replaced
Assert.Equal(2, cut.FindAll("li[role='option']").Count);  // options untouched
```

`TextSizeSelect`'s `ChildContent` still replaces the `<option>`
elements and still receives `Sizes`, `Value`, `SetSize`, `Name`, and
`LabelFor`.

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

Each helper's `spec/index.md` §7 numbers its acceptance criteria, and the
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
