// LinkPicker tests — one [Fact] per spec/index.md §7 acceptance criterion.
//
// Harness note (same as SharePickerTests): bUnit has no live focus model, but ElementReference.
// FocusAsync() goes out over JS interop as "Blazor._internal.domWrapper.focus" carrying the
// ElementReference of its target, and bUnit stamps every @ref'd element with a stable
// blazor:elementReference GUID in the first render's markup. Mapping GUID -> element once, up
// front, lets each test assert exactly which element the component asked the browser to focus.

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using Bunit;
using Bunit.JSInterop;
using LilyDesignSystem.Blazor.Helpers;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;
using Xunit;

namespace LilyDesignSystem.Blazor.Helpers.Tests;

public class LinkPickerTests : TestContext
{
    private const string FocusIdentifier = "Blazor._internal.domWrapper.focus";

    private static readonly List<LinkItem> Links = new()
    {
        new LinkItem { Label = "Home", Href = "/" },
        new LinkItem { Label = "About Us", Href = "/about/" },
        new LinkItem { Label = "Contact Us", Href = "/contact/" },
        new LinkItem { Label = "Privacy Policy", Href = "/privacy/" },
    };

    public LinkPickerTests()
    {
        JSInterop.Mode = JSRuntimeMode.Loose;
    }

    private IReadOnlyList<string> FocusedRefIds()
        => JSInterop.Invocations
            .Where(i => i.Identifier == FocusIdentifier)
            .Select(i => ((ElementReference)i.Arguments[0]!).Id)
            .ToList();

    private string? LastFocusedRefId() => FocusedRefIds().LastOrDefault();

    private sealed class RefMap
    {
        public required string Trigger { get; init; }
        public required IReadOnlyList<string> Items { get; init; }
    }

    private static readonly Regex RefPattern = new(
        "class=\"(?<class>[^\"]*)\"[^>]*?blazor:elementReference=\"(?<id>[0-9a-fA-F-]{36})\"",
        RegexOptions.Compiled);

    /// <summary>Build the GUID map from the FIRST render's markup, before any interaction.</summary>
    private static RefMap MapRefs(IRenderedComponent<LinkPicker> cut)
    {
        var found = RefPattern.Matches(cut.Markup)
            .Select(m => (Class: m.Groups["class"].Value, Id: m.Groups["id"].Value))
            .ToList();
        return new RefMap
        {
            Trigger = found.Single(f => f.Class.Contains("link-picker-button")).Id,
            Items = found.Where(f => f.Class.Contains("link-picker-link")).Select(f => f.Id).ToList(),
        };
    }

    private IRenderedComponent<LinkPicker> Render(
        Action<ComponentParameterCollectionBuilder<LinkPicker>>? extra = null,
        IReadOnlyList<LinkItem>? links = null)
        => RenderComponent<LinkPicker>(p =>
        {
            p.Add(x => x.Label, "Pages").Add(x => x.Links, links ?? Links);
            extra?.Invoke(p);
        });

    private static void Key(IRenderedComponent<LinkPicker> cut, string selector, string key)
        => cut.Find(selector).KeyDown(new KeyboardEventArgs { Key = key });

    private static bool ListHidden(IRenderedComponent<LinkPicker> cut)
        => cut.Find("ul.link-picker-list").HasAttribute("hidden");

    // §7.1
    [Fact]
    public void Section_7_1_Renders_The_Root_Button_Tooltip_And_A_Hidden_List()
    {
        var cut = Render();
        Assert.NotNull(cut.Find("div.link-picker"));
        Assert.NotNull(cut.Find("button.link-picker-button"));
        Assert.NotNull(cut.Find("div.link-picker-tooltip"));
        Assert.True(ListHidden(cut));
    }

    // §7.2
    [Fact]
    public void Section_7_2_The_Button_Is_Named_By_Label_With_Aria_Expanded_And_Controls()
    {
        var cut = Render();
        var button = cut.Find("button.link-picker-button");
        Assert.Equal("button", button.GetAttribute("type"));
        Assert.Equal("Pages", button.GetAttribute("aria-label"));
        Assert.Equal("false", button.GetAttribute("aria-expanded"));
        Assert.Null(button.GetAttribute("role"));
        Assert.Null(button.GetAttribute("aria-haspopup"));
        Assert.Equal(cut.Find("ul.link-picker-list").GetAttribute("id"), button.GetAttribute("aria-controls"));
    }

    // §7.3
    [Fact]
    public void Section_7_3_The_Default_Icon_Is_An_Aria_Hidden_Svg_And_ChildContent_Replaces_It()
    {
        var cut = Render();
        var svg = cut.Find("svg.link-picker-icon");
        Assert.Equal("true", svg.GetAttribute("aria-hidden"));
        Assert.Equal("0 0 16 16", svg.GetAttribute("viewBox"));

        var custom = Render(p => p.Add(x => x.ChildContent, ctx => b => b.AddMarkupContent(0, "<span class=\"mine\">x</span>")));
        Assert.NotNull(custom.Find("span.mine"));
        Assert.Empty(custom.FindAll("svg.link-picker-icon"));
    }

    // §7.4
    [Fact]
    public void Section_7_4_One_Real_Link_Per_Entry_In_Order()
    {
        var cut = Render();
        var anchors = cut.FindAll("a.link-picker-link");
        Assert.Equal(new[] { "Home", "About Us", "Contact Us", "Privacy Policy" }, anchors.Select(a => a.TextContent.Trim()));
        Assert.Equal(new[] { "/", "/about/", "/contact/", "/privacy/" }, anchors.Select(a => a.GetAttribute("href")));
        Assert.All(anchors, a => Assert.Null(a.GetAttribute("role")));
    }

    // §7.5
    [Fact]
    public void Section_7_5_No_Links_Are_Invented()
    {
        var cut = Render(links: new List<LinkItem>());
        Assert.Empty(cut.FindAll("a.link-picker-link"));
    }

    // §7.6
    [Fact]
    public void Section_7_6_The_List_Is_Named_With_Label()
    {
        Assert.Equal("Pages", Render().Find("ul.link-picker-list").GetAttribute("aria-label"));
    }

    // §7.7
    [Fact]
    public void Section_7_7_Click_Opens_The_List_And_Focuses_The_First_Link()
    {
        var cut = Render();
        var refs = MapRefs(cut);
        cut.Find("button.link-picker-button").Click();
        Assert.False(ListHidden(cut));
        Assert.Equal("true", cut.Find("button.link-picker-button").GetAttribute("aria-expanded"));
        Assert.Equal(refs.Items[0], LastFocusedRefId());
    }

    // §7.8
    [Fact]
    public void Section_7_8_A_Second_Click_Closes()
    {
        var cut = Render();
        cut.Find("button.link-picker-button").Click();
        cut.Find("button.link-picker-button").Click();
        Assert.True(ListHidden(cut));
    }

    // §7.9
    [Fact]
    public void Section_7_9_ArrowDown_Opens_At_The_First_Link_And_ArrowUp_At_The_Last()
    {
        var down = Render();
        var downRefs = MapRefs(down);
        Key(down, "button.link-picker-button", "ArrowDown");
        Assert.Equal(downRefs.Items[0], LastFocusedRefId());

        var up = Render();
        var upRefs = MapRefs(up);
        Key(up, "button.link-picker-button", "ArrowUp");
        Assert.Equal(upRefs.Items[3], LastFocusedRefId());
    }

    // §7.10
    [Fact]
    public void Section_7_10_Arrows_Move_And_Clamp_Home_And_End_Jump()
    {
        var cut = Render();
        var refs = MapRefs(cut);
        cut.Find("button.link-picker-button").Click();
        Key(cut, "ul.link-picker-list", "ArrowUp");
        Assert.Equal(refs.Items[0], LastFocusedRefId());
        Key(cut, "ul.link-picker-list", "ArrowDown");
        Assert.Equal(refs.Items[1], LastFocusedRefId());
        Key(cut, "ul.link-picker-list", "End");
        Assert.Equal(refs.Items[3], LastFocusedRefId());
        Key(cut, "ul.link-picker-list", "ArrowDown");
        Assert.Equal(refs.Items[3], LastFocusedRefId());
        Key(cut, "ul.link-picker-list", "Home");
        Assert.Equal(refs.Items[0], LastFocusedRefId());
    }

    // §7.11
    [Fact]
    public void Section_7_11_Escape_Closes_And_Returns_Focus_To_The_Button()
    {
        var cut = Render();
        var refs = MapRefs(cut);
        cut.Find("button.link-picker-button").Click();
        Key(cut, "ul.link-picker-list", "Escape");
        Assert.True(ListHidden(cut));
        Assert.Equal(refs.Trigger, LastFocusedRefId());
    }

    // §7.12
    [Fact]
    public void Section_7_12_Tab_Closes_With_Focus_On_The_Button_First()
    {
        var cut = Render();
        var refs = MapRefs(cut);
        cut.Find("button.link-picker-button").Click();
        Key(cut, "ul.link-picker-list", "Tab");
        Assert.True(ListHidden(cut));
        Assert.Equal(refs.Trigger, LastFocusedRefId());
    }

    // §7.13 (Blazor deviation: no document-level click listener without JS interop; focus leaving the
    // root closes the list instead.)
    [Fact]
    public void Section_7_13_Focus_Leaving_The_Root_Closes()
    {
        var cut = Render();
        cut.Find("button.link-picker-button").Click();
        cut.Find("div.link-picker").FocusOut();
        // The first focusout after opening is the component's own focus move; the next is a departure.
        if (!ListHidden(cut)) cut.Find("div.link-picker").FocusOut();
        Assert.True(ListHidden(cut));
    }

    // §7.14
    [Fact]
    public void Section_7_14_Current_Marks_Only_That_Link_Aria_Current_Page()
    {
        var links = new List<LinkItem>
        {
            Links[0],
            new LinkItem { Label = "About Us", Href = "/about/", Current = true },
            Links[2],
        };
        var cut = Render(links: links);
        Assert.Equal(new string?[] { null, "page", null }, cut.FindAll("a.link-picker-link").Select(a => a.GetAttribute("aria-current")));
    }

    // §7.15
    [Fact]
    public void Section_7_15_NewTab_Adds_Target_And_Rel()
    {
        var links = new List<LinkItem> { new LinkItem { Label = "Docs", Href = "https://example.test/", NewTab = true }, Links[0] };
        var anchors = Render(links: links).FindAll("a.link-picker-link");
        Assert.Equal("_blank", anchors[0].GetAttribute("target"));
        Assert.Equal("noopener noreferrer", anchors[0].GetAttribute("rel"));
        Assert.Null(anchors[1].GetAttribute("target"));
    }

    // §7.16
    [Fact]
    public void Section_7_16_OnNavigate_Reports_The_Id_Else_The_Href()
    {
        var seen = new List<(string Id, string Href)>();
        var links = new List<LinkItem> { new LinkItem { Id = "about", Label = "About Us", Href = "/about/" }, Links[0] };
        var cut = Render(
            p => p.Add(x => x.OnNavigate, EventCallback.Factory.Create<LinkNavigateEventArgs>(this, e => seen.Add((e.Id, e.Href)))),
            links);
        cut.Find("button.link-picker-button").Click();
        cut.FindAll("a.link-picker-link")[0].Click();
        cut.Find("button.link-picker-button").Click();
        cut.FindAll("a.link-picker-link")[1].Click();
        Assert.Equal(new[] { ("about", "/about/"), ("/", "/") }, seen);
        Assert.Equal("/y", LinkPicker.LinkId(new LinkItem { Label = "x", Href = "/y" }));
    }

    // §7.17
    [Fact]
    public void Section_7_17_Choosing_A_Link_Closes_The_List()
    {
        var cut = Render();
        cut.Find("button.link-picker-button").Click();
        cut.FindAll("a.link-picker-link")[1].Click();
        Assert.True(ListHidden(cut));
    }

    // §7.18
    [Fact]
    public void Section_7_18_Links_Are_Left_To_The_Browser_And_Router()
    {
        // No @onclick:preventDefault anywhere on a link: Blazor's router handles same-origin clicks itself.
        var cut = Render();
        Assert.DoesNotContain("onclick:preventDefault", cut.Markup, StringComparison.OrdinalIgnoreCase);
    }

    // §7.19
    [Fact]
    public void Section_7_19_The_Tooltip_Is_A_Hidden_Role_Tooltip_Holding_The_Label()
    {
        var tip = Render().Find("div.link-picker-tooltip");
        Assert.Equal("tooltip", tip.GetAttribute("role"));
        Assert.Equal("Pages", tip.TextContent.Trim());
        Assert.True(tip.HasAttribute("hidden"));
    }

    // §7.20
    [Fact]
    public void Section_7_20_The_Tooltip_Shows_On_Hover_Hides_On_Escape_And_Never_Shows_While_Open()
    {
        var cut = Render();
        cut.Find("button.link-picker-button").TriggerEvent("onmouseenter", new MouseEventArgs());
        Assert.False(cut.Find("div.link-picker-tooltip").HasAttribute("hidden"));
        Key(cut, "button.link-picker-button", "Escape");
        Assert.True(cut.Find("div.link-picker-tooltip").HasAttribute("hidden"));
        cut.Find("button.link-picker-button").TriggerEvent("onmouseleave", new MouseEventArgs());
        cut.Find("button.link-picker-button").TriggerEvent("onmouseenter", new MouseEventArgs());
        Assert.False(cut.Find("div.link-picker-tooltip").HasAttribute("hidden"));
        cut.Find("button.link-picker-button").Click();
        Assert.True(cut.Find("div.link-picker-tooltip").HasAttribute("hidden"));
    }

    // §7.21
    [Fact]
    public void Section_7_21_The_Tooltip_Is_Not_Wired_With_Aria_Describedby()
    {
        Assert.Null(Render().Find("button.link-picker-button").GetAttribute("aria-describedby"));
    }

    // §7.22
    [Fact]
    public void Section_7_22_CssClass_Is_Appended_And_Unmatched_Attributes_Reach_The_Root()
    {
        var cut = Render(p => p.Add(x => x.CssClass, "extra").AddUnmatched("data-x", "1"));
        var root = cut.Find("div.link-picker");
        Assert.Contains("extra", root.GetAttribute("class"));
        Assert.Equal("1", root.GetAttribute("data-x"));
    }

    // §7.23
    [Fact]
    public void Section_7_23_Two_Instances_Get_Distinct_Ids()
    {
        Assert.NotEqual(LinkPicker.NextLinkPickerId(), LinkPicker.NextLinkPickerId());
        var a = Render().Find("ul.link-picker-list").GetAttribute("id");
        var b = Render().Find("ul.link-picker-list").GetAttribute("id");
        Assert.NotEqual(a, b);
    }

    // §7.24
    [Fact]
    public void Section_7_24_The_Source_Ships_No_Stylesheet_Inline_Style_English_Default_Or_Route()
    {
        var dir = AppContext.BaseDirectory;
        while (dir is not null && !File.Exists(Path.Combine(dir, "lily-design-system-blazor-link-picker", "LinkPicker.razor")))
            dir = Path.GetDirectoryName(dir);
        Assert.NotNull(dir);
        foreach (var f in new[] { "LinkPicker.razor", "LinkPicker.razor.cs" })
        {
            var src = File.ReadAllText(Path.Combine(dir!, "lily-design-system-blazor-link-picker", f));
            src = Regex.Replace(src, @"@\*[\s\S]*?\*@", "");
            src = Regex.Replace(src, @"/\*[\s\S]*?\*/", "");
            src = Regex.Replace(src, @"(?m)^\s*//.*$", "");
            Assert.DoesNotMatch(@"<style|\sstyle=", src);
            Assert.DoesNotMatch(@"(Label|Href)\s*=\s*""[A-Za-z/]", src);
        }
    }
}
