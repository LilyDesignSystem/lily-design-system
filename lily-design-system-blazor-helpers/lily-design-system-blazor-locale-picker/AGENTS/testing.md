# Testing — LocalePicker (Blazor)

The picker's test suite lives in
[`../LocalePickerTests.cs`](../LocalePickerTests.cs) and asserts
every numbered acceptance criterion in `spec.md` §7. This file
documents the test harness and the conventions specific to this
helper. For the catalog-wide test rules see
[`../../AGENTS/testing.md`](../../AGENTS/testing.md).

## Setup

```csharp
using Bunit;
using Bunit.JSInterop;
using LilyDesignSystem.Blazor.Helpers;
using Microsoft.AspNetCore.Components;
using Xunit;

namespace LilyDesignSystem.Blazor.Helpers.Tests;

public class LocalePickerTests : TestContext
{
    public LocalePickerTests()
    {
        JSInterop.Mode = JSRuntimeMode.Loose;
        JSInterop.SetupVoid("eval", _ => true).SetVoidResult();
        JSInterop.Setup<string?>("eval", _ => true).SetResult(null);
        JSInterop.Setup<string[]?>("eval", _ => true).SetResult(null);
    }
}
```

The third `JSInterop.Setup` covers the `navigator.languages` query
the picker makes when `DetectFromNavigator=true`.

## Pure-helper tests

`Bcp47LocaleTag`, `IsRtlLocale`, `LocaleName`, and
`MatchNavigatorLanguage` are pure — no `RenderComponent` needed:

```csharp
[Fact]
public void Section_7_7_Bcp47LocaleTag()
{
    Assert.Equal("en-US", Locales.Bcp47LocaleTag("en_US"));
    Assert.Equal("zh-Hant-TW", Locales.Bcp47LocaleTag("zh_Hant_TW"));
    Assert.Equal("en", Locales.Bcp47LocaleTag("en"));
}

[Fact]
public void Section_7_10_IsRtlLocale_Script_Subtag()
{
    Assert.True(Locales.IsRtlLocale("ar"));
    Assert.True(Locales.IsRtlLocale("he_IL"));
    Assert.True(Locales.IsRtlLocale("uz_Arab_AF"));
    Assert.False(Locales.IsRtlLocale("en"));
    Assert.False(Locales.IsRtlLocale("fr_CA"));
}
```

## Standard mount

```csharp
[Fact]
public void Section_7_1_Renders_Fieldset_With_Radiogroup_Role()
{
    var cut = RenderComponent<LocalePicker>(p => p
        .Add(x => x.Label, "Language")
        .Add(x => x.Locales, new[] { "en", "fr" }));

    var root = cut.Find("fieldset");
    Assert.Equal("radiogroup", root.GetAttribute("role"));
    Assert.Equal("Language", root.GetAttribute("aria-label"));
}
```

## Asserting per-option `lang`

```csharp
[Fact]
public void Section_7_5_Per_Option_Lang_Is_Bcp47()
{
    var cut = RenderComponent<LocalePicker>(p => p
        .Add(x => x.Label, "L")
        .Add(x => x.Locales, new[] { "en", "fr_CA" }));

    var labels = cut.FindAll("label.locale-picker-option");
    Assert.Equal("en", labels[0].GetAttribute("lang"));
    Assert.Equal("fr-CA", labels[1].GetAttribute("lang"));
}
```

## Asserting interop calls

bUnit records every interop call. After `await Task.Yield()`,
inspect `JSInterop.Invocations`:

```csharp
[Fact]
public async Task Section_7_13_Interop_Sets_Lang()
{
    var cut = RenderComponent<LocalePicker>(p => p
        .Add(x => x.Label, "L")
        .Add(x => x.Locales, new[] { "en_US", "fr" }));

    await Task.Yield();

    var sawLang = JSInterop.Invocations.Any(inv =>
        inv.Identifier == "eval"
        && inv.Arguments[0] is string s
        && s.Contains("setAttribute('lang','en-US')"));
    Assert.True(sawLang);
}
```

## BuildApplyScript tests

The internal `BuildApplyScript` helper is exposed to the test
assembly via `InternalsVisibleTo` and tested in isolation:

```csharp
[Fact]
public void Section_7_14_Script_Includes_Dir_When_ApplyDir_True()
{
    var script = LocalePicker.BuildApplyScript("ar", applyDir: true, storageKey: null);
    Assert.Contains("setAttribute('lang','ar')", script);
    Assert.Contains("setAttribute('dir','rtl')", script);
}

[Fact]
public void Section_7_15_Script_Omits_Dir_When_ApplyDir_False()
{
    var script = LocalePicker.BuildApplyScript("ar", applyDir: false, storageKey: null);
    Assert.Contains("setAttribute('lang','ar')", script);
    Assert.DoesNotContain("setAttribute('dir'", script);
}

[Fact]
public void Section_7_18_Script_Includes_Storage_Write_When_StorageKey_Set()
{
    var script = LocalePicker.BuildApplyScript("en", applyDir: true, storageKey: "lily-locale");
    Assert.Contains("localStorage.setItem(\"lily-locale\"", script);
    Assert.Contains("\"en\"", script);
}
```

## @bind-Value emulation

```csharp
var captured = "";
var cut = RenderComponent<LocalePicker>(p => p
    .Add(x => x.Label, "L")
    .Add(x => x.Locales, new[] { "en", "fr", "ar" })
    .Add(x => x.ValueChanged,
        EventCallback.Factory.Create<string>(this, v => captured = v)));
await Task.Yield();
Assert.Equal("en", captured);
```

## Triggering a radio change

```csharp
var radios = cut.FindAll("input[type=radio]");
await radios[2].ChangeAsync(new() { Value = "ar" });

Assert.Equal("ar", capturedValueChanged);
Assert.Equal("ar", capturedOnChange);
```

## Custom ChildContent

```csharp
RenderFragment<LocalePickerContext> custom = ctx => builder =>
{
    builder.OpenElement(0, "div");
    builder.AddAttribute(1, "data-testid", "custom");
    builder.AddAttribute(2, "data-name", ctx.Name);
    builder.AddAttribute(3, "data-is-rtl-ar", ctx.IsRtl("ar").ToString());
    builder.AddAttribute(4, "data-tag-en-us", ctx.TagFor("en_US"));
    builder.CloseElement();
};

var cut = RenderComponent<LocalePicker>(p => p
    .Add(x => x.Label, "L")
    .Add(x => x.Locales, new[] { "en", "fr" })
    .Add(x => x.Name, "lang")
    .Add(x => x.ChildContent, custom));

var div = cut.Find("[data-testid='custom']");
Assert.Equal("lang", div.GetAttribute("data-name"));
Assert.Equal("True", div.GetAttribute("data-is-rtl-ar"));
Assert.Equal("en-US", div.GetAttribute("data-tag-en-us"));
```

## One test per §7 acceptance

Section map:

| §7 group        | Test focus                                       |
| --------------- | ------------------------------------------------ |
| 7.1–7.6 markup  | DOM contract: fieldset, role, radios, per-option lang |
| 7.7–7.12 helpers| Bcp47LocaleTag, IsRtlLocale, LocaleName, MatchNavigatorLanguage |
| 7.13–7.17 apply | target.lang, target.dir, ApplyDir behaviour      |
| 7.18 storage    | StorageKey embedded in apply script              |
| 7.19 explicit   | Explicit Value wins                              |
| 7.22 spread     | AdditionalAttributes fall-through                |
| 7.23 children   | ChildContent receives LocalePickerContext        |

Each `[Fact]` method name starts with the clause number:

```csharp
[Fact]
public void Section_7_7_Bcp47LocaleTag() { … }
```

## Don't

- Don't mock Blazor's render tree — use bUnit's `RenderComponent`.
- Don't mock `JSRuntime` by hand — use `bUnit.JSInterop`.
- Don't use snapshot tests for HTML; assert specific attributes and
  text.
- Don't introduce tests that don't map to a §7 clause.
