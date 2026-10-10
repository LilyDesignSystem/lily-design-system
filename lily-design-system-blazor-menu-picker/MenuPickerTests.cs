// MenuPicker tests — one [Fact] per spec/index.md §7 acceptance criterion (with the Blazor
// deviations the spec lists in §4.3).
//
// Harness note (same as LinkPickerTests): bUnit has no live focus model, but ElementReference.
// FocusAsync() goes out over JS interop as "Blazor._internal.domWrapper.focus" carrying the
// ElementReference of its target, and bUnit stamps every @ref'd element with a stable
// blazor:elementReference GUID in the first render's markup.

using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using Bunit;
using Bunit.JSInterop;
using LilyDesignSystem.Blazor.Helpers;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;
using Xunit;

namespace LilyDesignSystem.Blazor.Helpers.Tests;

public class MenuPickerTests : TestContext
{
    private const string FocusIdentifier = "Blazor._internal.domWrapper.focus";

    public MenuPickerTests()
    {
        JSInterop.Mode = JSRuntimeMode.Loose;
    }

    private string? LastFocusedRefId()
        => JSInterop.Invocations
            .Where(i => i.Identifier == FocusIdentifier)
            .Select(i => ((ElementReference)i.Arguments[0]!).Id)
            .LastOrDefault();

    private static readonly Regex RefPattern = new(
        "class=\"(?<class>[^\"]*)\"[^>]*?blazor:elementReference=\"(?<id>[0-9a-fA-F-]{36})\"",
        RegexOptions.Compiled);

    private static (string Trigger, string Panel) MapRefs(IRenderedComponent<MenuPicker> cut)
    {
        var found = RefPattern.Matches(cut.Markup)
            .Select(m => (Class: m.Groups["class"].Value, Id: m.Groups["id"].Value))
            .ToList();
        return (
            found.Single(f => f.Class.Contains("menu-picker-button")).Id,
            found.Single(f => f.Class.Contains("menu-picker-panel")).Id);
    }

    private static RenderFragment<MenuPickerContext> Content(Action<MenuPickerContext>? capture = null)
        => ctx => b =>
        {
            capture?.Invoke(ctx);
            b.AddMarkupContent(0, "<a href=\"/a/\">Alpha</a><button type=\"button\" class=\"b\">Beta</button>");
        };

    private IRenderedComponent<MenuPicker> Render(Action<ComponentParameterCollectionBuilder<MenuPicker>>? extra = null, bool content = true)
        => RenderComponent<MenuPicker>(p =>
        {
            p.Add(x => x.Label, "Menu");
            if (content) p.Add(x => x.ChildContent, Content());
            extra?.Invoke(p);
        });

    private static bool PanelHidden(IRenderedComponent<MenuPicker> cut)
        => cut.Find("div.menu-picker-panel").HasAttribute("hidden");

    // §7.1
    [Fact]
    public void Section_7_1_Renders_The_Root_Button_Tooltip_And_A_Hidden_Panel()
    {
        var cut = Render();
        Assert.NotNull(cut.Find("div.menu-picker"));
        Assert.NotNull(cut.Find("button.menu-picker-button"));
        Assert.NotNull(cut.Find("div.menu-picker-tooltip"));
        Assert.True(PanelHidden(cut));
    }

    // §7.2
    [Fact]
    public void Section_7_2_The_Button_Is_Named_By_Label_With_Aria_Expanded_And_Controls()
    {
        var cut = Render();
        var button = cut.Find("button.menu-picker-button");
        Assert.Equal("button", button.GetAttribute("type"));
        Assert.Equal("Menu", button.GetAttribute("aria-label"));
        Assert.Equal("false", button.GetAttribute("aria-expanded"));
        Assert.Null(button.GetAttribute("role"));
        Assert.Null(button.GetAttribute("aria-haspopup"));
        Assert.Equal(cut.Find("div.menu-picker-panel").GetAttribute("id"), button.GetAttribute("aria-controls"));
    }

    // §7.3
    [Fact]
    public void Section_7_3_The_Default_Icon_Is_An_Aria_Hidden_Svg_And_Icon_Replaces_It()
    {
        var cut = Render();
        var svg = cut.Find("svg.menu-picker-icon");
        Assert.Equal("true", svg.GetAttribute("aria-hidden"));
        Assert.Equal("0 0 16 16", svg.GetAttribute("viewBox"));

        var custom = Render(p => p.Add(x => x.Icon, ctx => b => b.AddMarkupContent(0, "<span class=\"mine\">x</span>")));
        Assert.NotNull(custom.Find("span.mine"));
        Assert.Empty(custom.FindAll("svg.menu-picker-icon"));
    }

    // §7.4
    [Fact]
    public void Section_7_4_The_Panel_Is_A_Role_Group_Named_With_Label()
    {
        var cut = Render();
        var panel = cut.Find("div.menu-picker-panel");
        Assert.Equal("group", panel.GetAttribute("role"));
        Assert.Equal("Menu", panel.GetAttribute("aria-label"));
    }

    // §7.5
    [Fact]
    public void Section_7_5_The_Apps_Content_Renders_Inside_And_With_None_The_Panel_Is_Empty()
    {
        var cut = Render();
        Assert.Equal("Alpha", cut.Find("div.menu-picker-panel a").TextContent);
        var empty = Render(content: false);
        Assert.Equal("", empty.Find("div.menu-picker-panel").TextContent.Trim());
    }

    // §7.6
    [Fact]
    public void Section_7_6_Click_Opens_And_Leaves_Focus_On_The_Button()
    {
        var cut = Render();
        cut.Find("button.menu-picker-button").Click();
        Assert.False(PanelHidden(cut));
        Assert.Equal("true", cut.Find("button.menu-picker-button").GetAttribute("aria-expanded"));
        Assert.Null(LastFocusedRefId());
    }

    // §7.7
    [Fact]
    public void Section_7_7_A_Second_Click_Closes()
    {
        var cut = Render();
        cut.Find("button.menu-picker-button").Click();
        cut.Find("button.menu-picker-button").Click();
        Assert.True(PanelHidden(cut));
    }

    // §7.8 (Blazor: the arrows focus the panel itself; Tab then walks its content)
    [Fact]
    public void Section_7_8_Arrows_Open_And_Focus_The_Panel()
    {
        var cut = Render();
        var refs = MapRefs(cut);
        cut.Find("button.menu-picker-button").KeyDown(new KeyboardEventArgs { Key = "ArrowDown" });
        Assert.False(PanelHidden(cut));
        Assert.Equal(refs.Panel, LastFocusedRefId());
        var up = Render();
        var upRefs = MapRefs(up);
        up.Find("button.menu-picker-button").KeyDown(new KeyboardEventArgs { Key = "ArrowUp" });
        Assert.Equal(upRefs.Panel, LastFocusedRefId());
    }

    // §7.9
    [Fact]
    public void Section_7_9_Escape_Closes_And_Returns_Focus_To_The_Button()
    {
        var cut = Render();
        var refs = MapRefs(cut);
        cut.Find("button.menu-picker-button").KeyDown(new KeyboardEventArgs { Key = "ArrowDown" });
        cut.Find("div.menu-picker-panel").KeyDown(new KeyboardEventArgs { Key = "Escape" });
        Assert.True(PanelHidden(cut));
        Assert.Equal(refs.Trigger, LastFocusedRefId());
    }

    // §7.10 (Blazor: Tab is the browser's own; the panel does not trap it)
    [Fact]
    public void Section_7_10_Tab_Is_Not_Trapped()
    {
        var cut = Render();
        cut.Find("button.menu-picker-button").Click();
        cut.Find("div.menu-picker-panel").KeyDown(new KeyboardEventArgs { Key = "Tab" });
        Assert.False(PanelHidden(cut));
    }

    // §7.11 (Blazor: there is no outside-click or focus-out close — documented deviation)
    [Fact]
    public void Section_7_11_Blazor_Has_No_Outside_Click_Close_And_The_Content_Closes_Itself()
    {
        MenuPickerContext? ctx = null;
        var cut = Render(p => p.Add(x => x.ChildContent, Content(c => ctx = c)));
        cut.Find("button.menu-picker-button").Click();
        Assert.False(PanelHidden(cut));
        cut.InvokeAsync(() => ctx!.Close());
        Assert.True(PanelHidden(cut));
    }

    // §7.13 (Blazor: CloseOnSelect closes on any click inside; default false)
    [Fact]
    public void Section_7_13_CloseOnSelect_Closes_On_A_Click_Inside_And_Defaults_Off()
    {
        var off = Render();
        off.Find("button.menu-picker-button").Click();
        off.Find("div.menu-picker-panel").Click();
        Assert.False(PanelHidden(off));
        var on = Render(p => p.Add(x => x.CloseOnSelect, true));
        var refs = MapRefs(on);
        on.Find("button.menu-picker-button").Click();
        on.Find("div.menu-picker-panel").Click();
        Assert.True(PanelHidden(on));
        Assert.Equal(refs.Trigger, LastFocusedRefId());
    }

    // §7.15
    [Fact]
    public void Section_7_15_OpenChanged_Fires_Once_Per_Actual_Change_And_Open_Is_Bindable()
    {
        var seen = new List<bool>();
        var cut = Render(p => p.Add(x => x.OpenChanged, EventCallback.Factory.Create<bool>(this, v => seen.Add(v))));
        cut.Find("button.menu-picker-button").Click();
        cut.Find("button.menu-picker-button").Click();
        Assert.Equal(new[] { true, false }, seen);
        var preopened = Render(p => p.Add(x => x.Open, true));
        Assert.False(PanelHidden(preopened));
    }

    // §7.16
    [Fact]
    public void Section_7_16_The_Tooltip_Is_A_Hidden_Role_Tooltip_Holding_The_Label()
    {
        var cut = Render();
        var tip = cut.Find("div.menu-picker-tooltip");
        Assert.Equal("tooltip", tip.GetAttribute("role"));
        Assert.Equal("Menu", tip.TextContent);
        Assert.True(tip.HasAttribute("hidden"));
    }

    // §7.17
    [Fact]
    public void Section_7_17_The_Tooltip_Shows_On_Hover_Hides_On_Escape_And_Never_Shows_While_Open()
    {
        var cut = Render();
        cut.Find("button.menu-picker-button").TriggerEvent("onmouseenter", new MouseEventArgs());
        Assert.False(cut.Find("div.menu-picker-tooltip").HasAttribute("hidden"));
        cut.Find("div.menu-picker-tooltip").KeyDown(new KeyboardEventArgs { Key = "Escape" });
        Assert.True(cut.Find("div.menu-picker-tooltip").HasAttribute("hidden"));
        cut.Find("button.menu-picker-button").TriggerEvent("onmouseleave", new MouseEventArgs());
        cut.Find("button.menu-picker-button").TriggerEvent("onmouseenter", new MouseEventArgs());
        Assert.False(cut.Find("div.menu-picker-tooltip").HasAttribute("hidden"));
        cut.Find("button.menu-picker-button").Click();
        Assert.True(cut.Find("div.menu-picker-tooltip").HasAttribute("hidden"));
    }

    // §7.18
    [Fact]
    public void Section_7_18_The_Tooltip_Is_Not_Wired_With_Aria_Describedby()
    {
        var cut = Render();
        Assert.Null(cut.Find("button.menu-picker-button").GetAttribute("aria-describedby"));
    }

    // §7.19
    [Fact]
    public void Section_7_19_CssClass_Is_Appended_And_Additional_Attributes_Are_Spread_On_The_Root()
    {
        var cut = Render(p => p.Add(x => x.CssClass, "extra").AddUnmatched("data-x", "1"));
        var root = cut.Find("div.menu-picker");
        Assert.Contains("extra", root.ClassList);
        Assert.Equal("1", root.GetAttribute("data-x"));
    }

    // §7.20
    [Fact]
    public void Section_7_20_Two_Instances_Get_Distinct_Ids()
    {
        Assert.NotEqual(MenuPicker.NextMenuPickerId(), MenuPicker.NextMenuPickerId());
        var a = Render();
        var b = Render();
        Assert.NotEqual(a.Find("div.menu-picker-panel").GetAttribute("id"), b.Find("div.menu-picker-panel").GetAttribute("id"));
    }

    // §7.21
    [Fact]
    public void Section_7_21_The_Source_Ships_No_Stylesheet_Inline_Style_Or_English_Default()
    {
        var dir = AppContext.BaseDirectory;
        string? razor = null;
        for (var d = new DirectoryInfo(dir); d is not null; d = d.Parent)
        {
            var candidate = Path.Combine(d.FullName, "lily-design-system-blazor-menu-picker", "MenuPicker.razor");
            if (File.Exists(candidate)) { razor = candidate; break; }
        }
        Assert.NotNull(razor);
        var src = Regex.Replace(File.ReadAllText(razor!), @"@\*[\s\S]*?\*@", "");
        Assert.DoesNotContain("<style", src);
        Assert.DoesNotContain("style=", src);
    }
}
