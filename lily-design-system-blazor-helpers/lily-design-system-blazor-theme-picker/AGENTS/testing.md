# Testing — ThemePicker (Blazor)

The picker's test suite lives in
[`../ThemePickerTests.cs`](../ThemePickerTests.cs) and asserts every
numbered acceptance criterion in `spec.md` §7. This file documents
the test harness and the conventions specific to this helper. For
the catalog-wide test rules see
[`../../AGENTS/testing.md`](../../AGENTS/testing.md).

## Setup

```csharp
using Bunit;
using Bunit.JSInterop;
using LilyDesignSystem.Blazor.Helpers;
using Microsoft.AspNetCore.Components;
using Xunit;

namespace LilyDesignSystem.Blazor.Helpers.Tests;

public class ThemePickerTests : TestContext
{
    private static readonly string[] Themes = { "light", "dark", "abyss" };
    private const string UrlTrailing = "/assets/themes/";
    private const string UrlNoTrailing = "/assets/themes";

    public ThemePickerTests()
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
public void Section_7_1_Renders_Fieldset_With_Radiogroup_Role()
{
    var cut = RenderComponent<ThemePicker>(p => p
        .Add(x => x.Label, "Theme")
        .Add(x => x.ThemesUrl, UrlTrailing)
        .Add(x => x.Themes, Themes));

    var root = cut.Find("fieldset");
    Assert.Equal("radiogroup", root.GetAttribute("role"));
    Assert.Contains("theme-picker", root.GetAttribute("class") ?? "");
}
```

## Async waits

bUnit pumps the render queue synchronously, but `OnAfterRenderAsync`
continuations may still be pending after `RenderComponent` returns.
`await Task.Yield()` flushes the message loop and lets those land:

```csharp
[Fact]
public async Task Section_7_7_Interop_Fires_With_Constructed_Href()
{
    var cut = RenderComponent<ThemePicker>(p => p
        .Add(x => x.Label, "Theme")
        .Add(x => x.ThemesUrl, UrlTrailing)
        .Add(x => x.Themes, Themes));

    await Task.Yield();

    Assert.Contains(JSInterop.Invocations,
        inv => inv.Identifier == "eval"
               && inv.Arguments[0] is string s
               && s.Contains("/assets/themes/light.css"));
}
```

## @bind-Value emulation

`@bind-Value` is sugar for `Value=` + `ValueChanged=`. Wire the
callback explicitly:

```csharp
var captured = "";
var cut = RenderComponent<ThemePicker>(p => p
    .Add(x => x.Label, "Theme")
    .Add(x => x.ThemesUrl, UrlTrailing)
    .Add(x => x.Themes, Themes)
    .Add(x => x.ValueChanged,
        EventCallback.Factory.Create<string>(this, v => captured = v)));
await Task.Yield();
Assert.Equal("light", captured);
```

## Triggering a radio change

```csharp
var radios = cut.FindAll("input[type=radio]");
await radios[2].ChangeAsync(new() { Value = "abyss" });
```

`ChangeAsync` dispatches the `change` event with the supplied
payload. The picker's `@onchange` handler reads `e.Value`.

## Asserting interop calls

bUnit records every `JS.InvokeAsync` / `InvokeVoidAsync` call in
`JSInterop.Invocations`:

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

## Pure-helper tests

`NormaliseThemesUrl` and `ThemeHref` are pure — no `RenderComponent`
needed:

```csharp
[Fact]
public void Section_7_11_Url_Normalisation()
{
    Assert.Equal("/assets/themes/", ThemePicker.NormaliseThemesUrl(UrlTrailing));
    Assert.Equal("/assets/themes/", ThemePicker.NormaliseThemesUrl(UrlNoTrailing));
    Assert.Equal("/a/light.css", ThemePicker.ThemeHref("/a", "light", ".css"));
    Assert.Equal("/a/light.css", ThemePicker.ThemeHref("/a/", "light", ".css"));
}
```

The internal `BuildApplyScript` is `internal` so the test assembly
can reach it via `[InternalsVisibleTo("LilyDesignSystem.Blazor.Helpers.Tests")]`
on the implementation assembly. This lets tests assert against the
emitted JS string without an integration test:

```csharp
var script = ThemePicker.BuildApplyScript("theme", "/t/dark.css", "dark", "lily-theme");
Assert.Contains("localStorage.setItem(\"lily-theme\"", script);
Assert.Contains("\"dark\"", script);
```

## ChildContent tests

```csharp
[Fact]
public void Section_7_13_ChildContent_Receives_Context()
{
    RenderFragment<ThemePickerContext> custom = ctx => builder =>
    {
        builder.OpenElement(0, "div");
        builder.AddAttribute(1, "data-testid", "custom");
        builder.AddAttribute(2, "data-name", ctx.Name);
        builder.AddContent(3, string.Join(",", ctx.Themes));
        builder.CloseElement();
    };

    var cut = RenderComponent<ThemePicker>(p => p
        .Add(x => x.Label, "Theme")
        .Add(x => x.ThemesUrl, UrlTrailing)
        .Add(x => x.Themes, Themes)
        .Add(x => x.Name, "scheme")
        .Add(x => x.ChildContent, custom));

    var div = cut.Find("[data-testid='custom']");
    Assert.Equal("scheme", div.GetAttribute("data-name"));
    Assert.Contains("light,dark,abyss", div.TextContent);
}
```

The `RenderFragment` builder form keeps the test self-contained
without an extra .razor file.

## AdditionalAttributes spread tests

```csharp
[Fact]
public void Section_7_12_AdditionalAttributes_Spread()
{
    var cut = RenderComponent<ThemePicker>(p => p
        .Add(x => x.Label, "Theme")
        .Add(x => x.ThemesUrl, UrlTrailing)
        .Add(x => x.Themes, Themes)
        .AddUnmatched("data-testid", "tp"));

    Assert.Equal("tp", cut.Find("fieldset").GetAttribute("data-testid"));
}
```

`AddUnmatched` adds the attribute to the
`CaptureUnmatchedValues = true` parameter dictionary; the picker
binds it via `@attributes="AdditionalAttributes"`.

## One test per §7 acceptance

The convention from the Svelte canonical applies: each `[Fact]`
method is named after the section number so a reviewer can
cross-reference the spec without scrolling:

```csharp
[Fact]
public async Task Section_7_6_Initial_Value_Resolves_To_Light_Or_First() { … }
```

Section map:

| §7 group       | Test focus                                       |
| -------------- | ------------------------------------------------ |
| 7.1–7.5 markup | DOM contract: fieldset, role, radios, labels     |
| 7.6 init       | Initial-value resolution order                   |
| 7.7 apply      | Interop call carries the constructed href        |
| 7.8 change     | Radio click updates Value + fires callbacks      |
| 7.9 storage    | StorageKey embedded in apply script              |
| 7.10 explicit  | Explicit Value wins over storage / defaults      |
| 7.11 normalise | URL normalisation                                |
| 7.12 spread    | AdditionalAttributes fall-through                |
| 7.13 children  | ChildContent receives ThemePickerContext         |

## Don't

- Don't mock Blazor's render tree — use bUnit's `RenderComponent`.
- Don't mock `JSRuntime` by hand — use `bUnit.JSInterop`.
- Don't use snapshot tests for HTML; assert specific attributes and
  text.
- Don't use `Task.Delay` to wait — `await Task.Yield()` is enough.
- Don't introduce tests that don't map to a §7 clause; the
  acceptance criteria are the contract.
