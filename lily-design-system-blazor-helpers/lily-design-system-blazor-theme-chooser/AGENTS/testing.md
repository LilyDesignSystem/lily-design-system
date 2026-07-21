# Testing — ThemeChooser (Blazor)

The select's test suite lives in
[`../ThemeChooserTests.cs`](../ThemeChooserTests.cs) and asserts every
numbered acceptance criterion in `spec/index.md` §7. This file documents
the test harness and the conventions specific to this helper. For
the catalog-wide test rules see
[`../../AGENTS/testing.md`](../../AGENTS/testing.md).

## Setup

```csharp
using Bunit;
using Bunit.JSInterop;
using LilyDesignSystem.Blazor.Helpers;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web; // KeyboardEventArgs
using Xunit;

namespace LilyDesignSystem.Blazor.Helpers.Tests;

public class ThemeChooserTests : TestContext
{
    private static readonly string[] Themes = { "light", "dark", "abyss" };
    private const string UrlTrailing = "/assets/themes/";
    private const string UrlNoTrailing = "/assets/themes";

    public ThemeChooserTests()
    {
        JSInterop.Mode = JSRuntimeMode.Loose;
        JSInterop.SetupVoid("eval", _ => true).SetVoidResult();
        JSInterop.Setup<string?>("eval", _ => true).SetResult(null);
    }
}
```

`JSRuntimeMode.Loose` lets unmatched interop calls return their
default value instead of throwing. The two explicit setups make
sure `eval`-based DOM mutations don't blow up, and Loose mode also
covers the `FocusAsync` interop the open / close lifecycle issues.

## Standard mount

```csharp
[Fact]
public void Section_7_1_Renders_Button_Controlling_A_Listbox()
{
    var cut = RenderComponent<ThemeChooser>(p => p
        .Add(x => x.Label, "Theme")
        .Add(x => x.ThemesUrl, UrlTrailing)
        .Add(x => x.Themes, Themes));

    var root = cut.Find("div.theme-chooser");
    Assert.Empty(cut.FindAll("select"));

    var button = cut.Find("button.theme-chooser-button");
    Assert.Equal("listbox", button.GetAttribute("aria-haspopup"));

    var list = cut.Find("ul.theme-chooser-list");
    Assert.Equal(button.GetAttribute("aria-controls"), list.GetAttribute("id"));
}
```

## Async waits

bUnit pumps the render queue synchronously, but `OnAfterRenderAsync`
continuations may still be pending after `RenderComponent` returns.
`await Task.Yield()` flushes the message loop and lets those land:

```csharp
[Fact]
public async Task Section_7_19_Interop_Fires_With_Constructed_Href()
{
    var cut = RenderComponent<ThemeChooser>(p => p
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
var cut = RenderComponent<ThemeChooser>(p => p
    .Add(x => x.Label, "Theme")
    .Add(x => x.ThemesUrl, UrlTrailing)
    .Add(x => x.Themes, Themes)
    .Add(x => x.ValueChanged,
        EventCallback.Factory.Create<string>(this, v => captured = v)));
await Task.Yield();
Assert.Equal("light", captured);
```

## Opening the listbox and choosing an option

Pointer path — click the button, then click an `<li>`:

```csharp
cut.Find("button").Click();
cut.FindAll("li.theme-chooser-option")[2].Click();

Assert.True(cut.Find("ul").HasAttribute("hidden"));
Assert.Equal("abyss", cut.Find("input[type='hidden']").GetAttribute("value"));
```

Keyboard path — bUnit dispatches `keydown` with a
`KeyboardEventArgs`, so the idiom is:

```csharp
cut.Find("ul").KeyDown(new KeyboardEventArgs { Key = "ArrowDown" });
```

The suite wraps that in a helper, because every keyboard test needs
both the button and the listbox target:

```csharp
private static void Key(IRenderedComponent<ThemeChooser> cut, string selector, string key)
    => cut.Find(selector).KeyDown(new KeyboardEventArgs { Key = key });

Key(cut, "button", "ArrowDown");   // open on the selected option
Key(cut, "ul", "End");             // jump to the last option
Key(cut, "ul", " ");               // Space selects, applies, closes
```

Assert the active option through `aria-activedescendant` rather than
focus — the APG listbox pattern keeps focus on the `<ul>`:

```csharp
Assert.Equal(cut.FindAll("li")[0].GetAttribute("id"),
    cut.Find("ul").GetAttribute("aria-activedescendant"));
```

Focus departure is `FocusOut()` on the root. The component swallows
the first one (its own button → listbox move), so a test that wants a
real departure dispatches two:

```csharp
cut.Find("div.theme-chooser").FocusOut();
cut.Find("div.theme-chooser").FocusOut();
```

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
public void Section_7_22_Url_Normalisation()
{
    Assert.Equal("/assets/themes/", ThemeChooser.NormaliseThemesUrl(UrlTrailing));
    Assert.Equal("/assets/themes/", ThemeChooser.NormaliseThemesUrl(UrlNoTrailing));
    Assert.Equal("/a/light.css", ThemeChooser.ThemeHref("/a", "light", ".css"));
    Assert.Equal("/a/light.css", ThemeChooser.ThemeHref("/a/", "light", ".css"));
}
```

The internal `BuildApplyScript` is `internal` so the test assembly
can reach it via `[InternalsVisibleTo("LilyDesignSystem.Blazor.Helpers.Tests")]`
on the implementation assembly. This lets tests assert against the
emitted JS string without an integration test:

```csharp
var script = ThemeChooser.BuildApplyScript("theme", "/t/dark.css", "dark", "lily-theme");
Assert.Contains("localStorage.setItem(\"lily-theme\"", script);
Assert.Contains("\"dark\"", script);
```

## ChildContent tests

`ChildContent` replaces the glyph inside the button, so the test
asserts both that the default `.theme-chooser-icon` is gone and that
the fragment received `Value`, `Open`, and `LabelFor`:

```csharp
[Fact]
public async Task Section_7_24_ChildContent_Replaces_The_Glyph_And_Receives_Context()
{
    RenderFragment<ThemeChooserContext> custom = ctx => builder =>
    {
        builder.OpenElement(0, "span");
        builder.AddAttribute(1, "data-testid", "custom");
        builder.AddAttribute(2, "data-open", ctx.Open.ToString());
        builder.AddAttribute(3, "data-label", ctx.LabelFor(ctx.Value));
        builder.AddContent(4, ctx.Value);
        builder.CloseElement();
    };

    var cut = RenderComponent<ThemeChooser>(p => p
        .Add(x => x.Label, "Theme")
        .Add(x => x.ThemesUrl, UrlTrailing)
        .Add(x => x.Themes, Themes)
        .Add(x => x.ChildContent, custom));
    await Task.Yield();

    Assert.Empty(cut.FindAll(".theme-chooser-icon"));

    var custom_ = cut.Find("[data-testid='custom']");
    Assert.Contains("theme-chooser-button",
        custom_.ParentElement?.GetAttribute("class") ?? "");
    Assert.Equal("Light", custom_.GetAttribute("data-label"));

    cut.Find("button").Click();
    Assert.Equal("True", cut.Find("[data-testid='custom']").GetAttribute("data-open"));
}
```

The `RenderFragment` builder form keeps the test self-contained
without an extra .razor file.

## AdditionalAttributes spread tests

```csharp
[Fact]
public void Section_7_23_AdditionalAttributes_Spread_Onto_The_Root()
{
    var cut = RenderComponent<ThemeChooser>(p => p
        .Add(x => x.Label, "Theme")
        .Add(x => x.ThemesUrl, UrlTrailing)
        .Add(x => x.Themes, Themes)
        .AddUnmatched("data-testid", "ts"));

    Assert.Equal("ts", cut.Find("div.theme-chooser").GetAttribute("data-testid"));
}
```

`AddUnmatched` adds the attribute to the
`CaptureUnmatchedValues = true` parameter dictionary; the select
binds it via `@attributes="AdditionalAttributes"` on the root
`<div>`.

## One test per §7 acceptance

The convention from the Svelte canonical applies: each `[Fact]`
method is named after the section number so a reviewer can
cross-reference the spec without scrolling:

```csharp
[Fact]
public async Task Section_7_18_Initial_Value_Resolves_To_Light_Or_First() { … }
```

Section map:

| §7 clause        | Test focus                                                        |
| ---------------- | ----------------------------------------------------------------- |
| **Markup contract** |                                                                |
| 7.1 structure    | Root `<div>`, button with `aria-haspopup`/`aria-expanded`/`aria-controls`, `<ul role="listbox" tabindex="-1">`, no `<select>` |
| 7.2 glyph        | `.theme-chooser-icon` renders `◑`, `aria-hidden="true"`, matches `CircleWithRightHalfBlack` |
| 7.3 naming       | `aria-label` on BOTH the button and the listbox                   |
| 7.4 options      | One `li.theme-chooser-option` per theme; hidden input carries `Name` + resolved `Value` |
| 7.5 open state   | `hidden` until activated; activating toggles `hidden` + `aria-expanded` |
| 7.6 selection    | Exactly one `aria-selected="true"`; no `aria-activedescendant` while closed; opening points it at the active option, which also carries `data-active` |
| 7.7 labels       | Title-cased slugs, `ThemeLabels` override, "default" never emitted |
| 7.8 ids          | List / option ids stable across re-render, unique across instances, `theme-chooser-` prefixed |
| **Keyboard contract (WAI-ARIA APG listbox)** |                                       |
| 7.9 open         | `ArrowDown` / `Enter` / `Space` on the button open on the selected option |
| 7.10 open-last   | `ArrowUp` on the button opens with the last option active         |
| 7.11 arrows      | Arrows move the active option and **clamp** at both ends          |
| 7.12 home/end    | `Home` / `End` jump to first / last                               |
| 7.13 commit      | `Enter` and `Space` in the listbox select, apply, and close       |
| 7.14 escape      | `Escape` closes without changing the value or applying anything   |
| 7.15 typeahead   | Printable characters run a label typeahead; a non-matching buffer leaves the active option unmoved |
| 7.16 click       | Clicking an option selects, applies, and closes                   |
| 7.17 focusout    | Focus leaving the root closes without changing the value          |
| **Dynamic loading and lifecycle** |                                                  |
| 7.18 init        | Initial value resolves to `"light"` or `Themes[0]`; `ValueChanged` fires |
| 7.19 apply       | Interop call carries the constructed href                         |
| 7.20 storage     | `StorageKey` embedded in the apply script (absent when unset); managed `<link>` discriminated by `Name` |
| 7.21 explicit    | Explicit `Value` wins over storage / defaults                     |
| 7.22 normalise   | URL normalisation                                                 |
| **Spread and custom rendering** |                                                    |
| 7.23 spread      | `AdditionalAttributes` fall through onto the root `<div>`         |
| 7.24 children    | `ChildContent` replaces the glyph and receives `Value` / `Open` / `LabelFor` |

## Testing the Blazor deviations

Two behaviours exist only because of Blazor's event model
(`spec/index.md` §6.4), and they shape how the tests are written:

- **Suppress-next-click.** `@onkeydown:preventDefault` is evaluated
  at render time, so it cannot be applied to the arrows while sparing
  `Tab`; instead a flag swallows the click a `<button>` synthesises
  after `Enter` / `Space`. A test that sends `Enter` to the button
  should assert the listbox ends up **open**, not toggled twice.
- **`focusout` instead of a document click listener.** The package
  ships no JS, and `FocusEventArgs` has no `relatedTarget`, so
  self-made focus moves are flagged and ignored. Hence the two
  `FocusOut()` dispatches shown above.

## Don't

- Don't mock Blazor's render tree — use bUnit's `RenderComponent`.
- Don't mock `JSRuntime` by hand — use `bUnit.JSInterop`.
- Don't use snapshot tests for HTML; assert specific attributes and
  text.
- Don't use `Task.Delay` to wait — `await Task.Yield()` is enough.
- Don't introduce tests that don't map to a §7 clause; the
  acceptance criteria are the contract.
