# Testing — LocaleSelect (Blazor)

The select's test suite lives in
[`../LocaleSelectTests.cs`](../LocaleSelectTests.cs) and asserts
every numbered acceptance criterion in `spec/index.md` §7. This file
documents the test harness and the conventions specific to this
helper. For the catalog-wide test rules see
[`../../AGENTS/testing.md`](../../AGENTS/testing.md).

## Setup

```csharp
using Bunit;
using Bunit.JSInterop;
using LilyDesignSystem.Blazor.Helpers;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;
using Xunit;

namespace LilyDesignSystem.Blazor.Helpers.Tests;

public class LocaleSelectTests : TestContext
{
    public LocaleSelectTests()
    {
        JSInterop.Mode = JSRuntimeMode.Loose;
        JSInterop.SetupVoid("eval", _ => true).SetVoidResult();
        JSInterop.Setup<string?>("eval", _ => true).SetResult(null);
        JSInterop.Setup<string[]?>("eval", _ => true).SetResult(System.Array.Empty<string>());
    }
}
```

The third `JSInterop.Setup` covers the `navigator.languages` query
the select makes when `DetectFromNavigator=true`. Loose mode also
absorbs the `ElementReference.FocusAsync` interop the open / close
lifecycle performs, so focus moves never block a render.

## Pure-helper tests

`Bcp47LocaleTag`, `IsRtlLocale`, `LocaleName`, and
`MatchNavigatorLanguage` are pure — no `RenderComponent` needed:

```csharp
[Fact]
public void Section_7_20_Bcp47_ZhHantTw_And_En()
{
    Assert.Equal("zh-Hant-TW", Locales.Bcp47LocaleTag("zh_Hant_TW"));
    Assert.Equal("en", Locales.Bcp47LocaleTag("en"));
}

[Fact]
public void Section_7_21_Rtl_Detection()
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
public void Section_7_1_Renders_Button_Controlling_A_Listbox()
{
    var cut = RenderComponent<LocaleSelect>(p => p
        .Add(x => x.Label, "Language")
        .Add(x => x.Locales, new[] { "en", "fr" }));

    Assert.NotNull(cut.Find("div.locale-select"));
    Assert.Empty(cut.FindAll("select"));

    var button = cut.Find("button.locale-select-button");
    Assert.Equal("listbox", button.GetAttribute("aria-haspopup"));
    Assert.Equal("false", button.GetAttribute("aria-expanded"));

    var list = cut.Find("ul.locale-select-list");
    Assert.Equal(button.GetAttribute("aria-controls"), list.GetAttribute("id"));
    Assert.Equal("listbox", list.GetAttribute("role"));
}
```

The hidden input, not the root, carries `name` and the resolved
value: `cut.Find("input[type='hidden']")`.

## Asserting per-option `lang`

Options are `<li>`, not `<option>`, and there is no leading
placeholder any more — index 0 is the first entry in `Locales`:

```csharp
[Fact]
public void Section_7_5_Option_Lang_Is_Bcp47_Hyphen()
{
    var cut = RenderComponent<LocaleSelect>(p => p
        .Add(x => x.Label, "L")
        .Add(x => x.Locales, new[] { "en", "fr_CA" }));

    var options = cut.FindAll("li.locale-select-option");
    Assert.Equal("en", options[0].GetAttribute("lang"));
    Assert.Equal("fr-CA", options[1].GetAttribute("lang"));

    Assert.Null(cut.Find("button").GetAttribute("lang"));
    Assert.Null(cut.Find("ul").GetAttribute("lang"));
}
```

## Driving the keyboard

bUnit dispatches a keydown with `KeyDown(new KeyboardEventArgs { … })`.
Open from the button, then move inside the `<ul>`:

```csharp
cut.Find("button").KeyDown(new KeyboardEventArgs { Key = "ArrowDown" });
cut.Find("ul").KeyDown(new KeyboardEventArgs { Key = "ArrowDown" });
cut.Find("ul").KeyDown(new KeyboardEventArgs { Key = "Enter" });
```

A small local helper keeps the keyboard facts readable:

```csharp
private static void Key(IRenderedComponent<LocaleSelect> cut, string selector, string key)
    => cut.Find(selector).KeyDown(new KeyboardEventArgs { Key = key });
```

Assert open state via `cut.Find("ul").HasAttribute("hidden")` and the
active option via `cut.Find("ul").GetAttribute("aria-activedescendant")`
compared against `cut.FindAll("li")[i].GetAttribute("id")`.

`Space` is the key string `" "`. Focus departure is
`cut.Find("div.locale-select").FocusOut()` — note that the component
swallows the first `focusout` after a focus move it made itself, so a
test that opens the list must call `FocusOut()` twice to close it.

## Asserting interop calls

bUnit records every interop call. After `await Task.Yield()`,
inspect `JSInterop.Invocations`:

```csharp
private bool SawEvalContaining(string needle)
{
    foreach (var inv in JSInterop.Invocations)
    {
        if (inv.Identifier == "eval" && inv.Arguments.Count > 0
            && inv.Arguments[0] is string s && s.Contains(needle))
        {
            return true;
        }
    }
    return false;
}

Assert.True(SawEvalContaining("setAttribute('lang',\"en-US\")"));
```

The attribute *name* is single-quoted and the *value* is emitted as a
JSON string literal, so the needle mixes both quote styles.

## BuildApplyScript tests

The internal `BuildApplyScript` helper is exposed to the test
assembly via `InternalsVisibleTo` and tested in isolation:

```csharp
[Fact]
public void Section_7_24_Apply_Script_Dir_Handling()
{
    Assert.Contains("setAttribute('dir',\"rtl\")",
        LocaleSelect.BuildApplyScript("ar", applyDir: true, storageKey: null));

    var noDir = LocaleSelect.BuildApplyScript("ar", applyDir: false, storageKey: null);
    Assert.DoesNotContain("setAttribute('dir'", noDir);
    Assert.Contains("setAttribute('lang',\"ar\")", noDir);
}

[Fact]
public void Section_7_25_StorageKey_Embedded_In_Apply_Script()
{
    Assert.Contains("localStorage.setItem(\"lily-locale\",\"fr\")",
        LocaleSelect.BuildApplyScript("fr", applyDir: true, storageKey: "lily-locale"));
    Assert.DoesNotContain("localStorage.setItem",
        LocaleSelect.BuildApplyScript("fr", applyDir: true, storageKey: null));
}
```

## @bind-Value emulation

```csharp
var captured = "";
var cut = RenderComponent<LocaleSelect>(p => p
    .Add(x => x.Label, "L")
    .Add(x => x.Locales, new[] { "en", "fr", "ar" })
    .Add(x => x.ValueChanged,
        EventCallback.Factory.Create<string>(this, v => captured = v)));
await Task.Yield();
Assert.Equal("en", captured);
```

## Triggering a selection

Either pointer or keyboard; both end with the listbox closed and the
hidden input updated:

```csharp
cut.Find("button").Click();
cut.FindAll("li")[3].Click();

Assert.True(cut.Find("ul").HasAttribute("hidden"));
Assert.Equal("fr_CA", capturedValueChanged);
Assert.Equal("fr_CA", cut.Find("input[type='hidden']").GetAttribute("value"));
```

## Custom ChildContent

`ChildContent` replaces the glyph inside the button; the context
carries `Value`, `Open`, and `LabelFor` only:

```csharp
RenderFragment<LocaleSelectContext> custom = ctx => builder =>
{
    builder.OpenElement(0, "span");
    builder.AddAttribute(1, "data-testid", "custom");
    builder.AddAttribute(2, "data-open", ctx.Open.ToString());
    builder.AddAttribute(3, "data-label", ctx.LabelFor(ctx.Value));
    builder.AddContent(4, ctx.Value);
    builder.CloseElement();
};

var cut = RenderComponent<LocaleSelect>(p => p
    .Add(x => x.Label, "L")
    .Add(x => x.Locales, new[] { "en", "fr" })
    .Add(x => x.ChildContent, custom));

// Replaced, not supplemented.
Assert.Empty(cut.FindAll(".locale-select-icon"));

var fragment = cut.Find("[data-testid='custom']");
Assert.Contains("locale-select-button",
    fragment.ParentElement?.GetAttribute("class") ?? "");
Assert.Equal("False", fragment.GetAttribute("data-open"));

cut.Find("button").Click();
Assert.Equal("True", cut.Find("[data-testid='custom']").GetAttribute("data-open"));
```

## Testing the Blazor deviations

Two behaviours exist only because of Blazor's event model, and each
needs a test that would otherwise look wrong:

- **Suppress-next-click.** `@onkeydown:preventDefault` is evaluated at
  render time, so it cannot be applied to the arrow keys while sparing
  `Tab`; nothing is prevented. Because a `<button>` synthesises a click
  for `Enter` and `Space`, the component swallows the click that
  follows a keydown it already handled. A test that sends
  `Key(cut, "button", "Enter")` must therefore expect the listbox
  **open**, not toggled twice shut.
- **`focusout` instead of a document click listener.** The package
  ships no JS, so closing on outside interaction rides the root's
  `focusout`, and `FocusEventArgs` carries no `relatedTarget`. The
  component flags its own focus moves and ignores the matching
  `focusout` — hence the doubled `FocusOut()` in the §7.18 test.

`@onmousedown:preventDefault` **is** applied to the `<ul>`; it needs no
special handling in tests because bUnit's `Click()` on an option
dispatches the click directly.

## One test per §7 acceptance

Section map:

| §7 group                      | Clauses | Test focus                                              |
| ----------------------------- | ------- | ------------------------------------------------------- |
| 7.1 markup contract           | 1–9     | root `<div>`, button + `<ul role="listbox">`, glyph, `aria-label` on both, one `<li>` per locale + hidden input, per-option `lang`, `hidden` / `aria-expanded`, `aria-selected` + `aria-activedescendant` + `data-active`, label fallback, stable unique ids |
| 7.2 keyboard contract         | 10–18   | button open keys, `ArrowUp` opens on last, arrow clamping, `Home` / `End`, `Enter` / `Space` select-apply-close, `Escape` closes unchanged, typeahead, option click, `focusout` |
| 7.3 pure helpers              | 19–26   | `Bcp47LocaleTag`, `IsRtlLocale`, `LocaleName`, apply-script `lang` / `dir` / storage, `MatchNavigatorLanguage` |
| 7.4 lifecycle, spread, custom | 27–29   | explicit `Value` wins, `AdditionalAttributes` spread onto the root, `ChildContent` replaces the glyph |

Each `[Fact]` method name starts with the clause number:

```csharp
[Fact]
public void Section_7_19_Bcp47_EnUs() { … }
```

## Don't

- Don't mock Blazor's render tree — use bUnit's `RenderComponent`.
- Don't mock `JSRuntime` by hand — use `bUnit.JSInterop`.
- Don't use snapshot tests for HTML; assert specific attributes and
  text.
- Don't introduce tests that don't map to a §7 clause.
- Don't query `option.locale-select-option` — options are `<li>`.
