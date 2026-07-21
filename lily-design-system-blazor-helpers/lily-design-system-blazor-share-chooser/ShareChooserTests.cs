// ShareChooser tests — one [Fact] per spec/index.md §7 acceptance criterion.
//
// Two harness notes, both consequences of bUnit rather than of the component:
//
// 1. Focus. bUnit has no live focus model, so `document.activeElement` has no
//    equivalent. Real focus moves ARE observable, though: ElementReference.
//    FocusAsync() goes out over JS interop as
//    "Blazor._internal.domWrapper.focus", carrying the ElementReference of its
//    target. bUnit stamps every @ref'd element with a blazor:elementReference
//    GUID in the first render's markup, and those GUIDs stay stable across
//    re-renders — so mapping GUID -> element once, up front, lets each test
//    assert exactly which element the component asked the browser to focus.
//    See RefMap below.
//
// 2. The browser APIs. The component reaches navigator.share and
//    navigator.clipboard through IJSRuntime "eval". bUnit's Loose mode returns
//    default(T) for any unmatched call, so the baseline with no setup is
//    null (-> Unsupported) for the share script and false for the copy script:
//    a browser with neither API. That is deliberately the same baseline the
//    canonical Svelte suite establishes by deleting both off `navigator`.

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Bunit;
using Bunit.JSInterop;
using LilyDesignSystem.Blazor.Helpers;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.Extensions.DependencyInjection;
using Xunit;

namespace LilyDesignSystem.Blazor.Helpers.Tests;

public class ShareChooserTests : TestContext
{
    private const string UrlUnderTest = "https://example.test/article";

    /// <summary>The interop identifier ElementReference.FocusAsync() uses.</summary>
    private const string FocusIdentifier = "Blazor._internal.domWrapper.focus";

    private static readonly List<ShareTarget> Targets = new()
    {
        new ShareTarget
        {
            Id = "mastodon",
            Label = "Mastodon",
            Href = (u, t, _) =>
                $"https://mastodon.test/share?url={Uri.EscapeDataString(u)}&text={Uri.EscapeDataString(t)}",
        },
        new ShareTarget
        {
            Id = "linkedin",
            Label = "LinkedIn",
            Href = (u, _, _) => $"https://linkedin.test/sharing?url={Uri.EscapeDataString(u)}",
        },
    };

    public ShareChooserTests()
    {
        // Loose so the eval and focus calls do not throw. With no explicit
        // setup, eval yields default(T): no share sheet, no clipboard.
        JSInterop.Mode = JSRuntimeMode.Loose;
    }

    // =================================================================
    // Harness
    // =================================================================

    private static bool IsShareScript(JSRuntimeInvocation inv)
        => inv.Identifier == "eval"
            && inv.Arguments.Count > 0
            && inv.Arguments[0] is string s
            && s.Contains("navigator.share(");

    private static bool IsCopyScript(JSRuntimeInvocation inv)
        => inv.Identifier == "eval"
            && inv.Arguments.Count > 0
            && inv.Arguments[0] is string s
            && s.Contains("navigator.clipboard.writeText(");

    /// <summary>Install a fake native share sheet resolving to a sentinel.</summary>
    private void StubNativeShare(string sentinel)
        => JSInterop.Setup<string?>("eval", IsShareScript).SetResult(sentinel);

    /// <summary>Install a fake async clipboard that succeeds or fails.</summary>
    private void StubClipboard(bool succeed)
        => JSInterop.Setup<bool>("eval", IsCopyScript).SetResult(succeed);

    private IReadOnlyList<JSRuntimeInvocation> ShareCalls()
        => JSInterop.Invocations.Where(IsShareScript).ToList();

    private IReadOnlyList<JSRuntimeInvocation> CopyCalls()
        => JSInterop.Invocations.Where(IsCopyScript).ToList();

    private IReadOnlyList<string> FocusedRefIds()
        => JSInterop.Invocations
            .Where(i => i.Identifier == FocusIdentifier)
            .Select(i => ((ElementReference)i.Arguments[0]!).Id)
            .ToList();

    private string? LastFocusedRefId() => FocusedRefIds().LastOrDefault();

    /// <summary>
    /// A rendered ShareChooser plus the element-reference GUIDs captured from
    /// its first render, so tests can name the element focus landed on.
    /// </summary>
    private sealed class RefMap
    {
        public required string Trigger { get; init; }

        /// <summary>Focusable list items in DOM order: destinations, then copy.</summary>
        public required IReadOnlyList<string> Items { get; init; }
    }

    private static readonly Regex RefPattern = new(
        "class=\"(?<class>[^\"]*)\"[^>]*?blazor:elementReference=\"(?<id>[0-9a-fA-F-]{36})\"",
        RegexOptions.Compiled);

    /// <summary>
    /// Build the GUID map from the FIRST render's markup. bUnit only emits the
    /// GUIDs on that render; they remain valid afterwards, so this must be
    /// called before any interaction.
    /// </summary>
    private static RefMap MapRefs(IRenderedComponent<ShareChooser> cut)
    {
        var found = RefPattern.Matches(cut.Markup)
            .Select(m => (Class: m.Groups["class"].Value, Id: m.Groups["id"].Value))
            .ToList();

        var trigger = found.Single(f => f.Class.Contains("share-chooser-button")).Id;

        // Same order, and the same membership rule, as the canonical Svelte
        // implementation's items(): ".share-chooser-target, .share-chooser-copy".
        var items = found
            .Where(f => f.Class.Contains("share-chooser-target")
                || f.Class.Contains("share-chooser-copy"))
            .Select(f => f.Id)
            .ToList();

        return new RefMap { Trigger = trigger, Items = items };
    }

    private IRenderedComponent<ShareChooser> Render(
        Action<ComponentParameterCollectionBuilder<ShareChooser>>? extra = null)
        => RenderComponent<ShareChooser>(p =>
        {
            p.Add(x => x.Label, "Share")
             .Add(x => x.Targets, Targets)
             .Add(x => x.Url, UrlUnderTest);
            extra?.Invoke(p);
        });

    private static void Key(IRenderedComponent<ShareChooser> cut, string selector, string key)
        => cut.Find(selector).KeyDown(new KeyboardEventArgs { Key = key });

    private static bool ListHidden(IRenderedComponent<ShareChooser> cut)
        => cut.Find("ul.share-chooser-list").HasAttribute("hidden");

    private static string Status(IRenderedComponent<ShareChooser> cut)
        => cut.Find("p.share-chooser-status").TextContent.Trim();

    // =================================================================
    // Markup contract — §7.1–§7.6
    // =================================================================

    // -----------------------------------------------------------------
    // §7.1 — A disclosure <button> whose aria-expanded controls a <ul>.
    // -----------------------------------------------------------------
    [Fact]
    public void Section_7_1_Renders_A_Disclosure_Button_Controlling_A_List()
    {
        var cut = Render();

        Assert.NotNull(cut.Find("div.share-chooser"));

        var button = cut.Find("button.share-chooser-button");
        Assert.Equal("button", button.GetAttribute("type"));
        Assert.Equal("Share", button.GetAttribute("aria-label"));
        Assert.Equal("false", button.GetAttribute("aria-expanded"));

        // A disclosure, not a menu: no menu/menubutton role anywhere.
        Assert.Null(button.GetAttribute("role"));
        Assert.Null(button.GetAttribute("aria-haspopup"));

        var listId = button.GetAttribute("aria-controls");
        Assert.False(string.IsNullOrEmpty(listId));

        var list = cut.Find("ul.share-chooser-list");
        Assert.Equal(listId, list.GetAttribute("id"));
        Assert.Null(list.GetAttribute("role"));
    }

    // -----------------------------------------------------------------
    // §7.1 — The button renders ↪, hidden from assistive technology.
    // -----------------------------------------------------------------
    [Fact]
    public void Section_7_1_Button_Renders_Arrow_Glyph_Hidden_From_Assistive_Tech()
    {
        var cut = Render();

        var icon = cut.Find(".share-chooser-icon");
        // U+21AA RIGHTWARDS ARROW WITH HOOK.
        Assert.Equal("↪", icon.TextContent.Trim());
        Assert.Equal("↪", ShareChooser.RightwardsArrowWithHook);
        // The accessible name is the button's aria-label, never the glyph.
        Assert.Equal("true", icon.GetAttribute("aria-hidden"));
    }

    // -----------------------------------------------------------------
    // §7.1 — Ids are minted per instance, so two on a page never collide.
    // -----------------------------------------------------------------
    [Fact]
    public void Section_7_1_Each_Instance_Gets_A_Distinct_List_Id()
    {
        var first = Render().Find("button.share-chooser-button").GetAttribute("aria-controls");
        var second = Render().Find("button.share-chooser-button").GetAttribute("aria-controls");

        Assert.NotEqual(first, second);
        Assert.NotEqual(ShareChooser.NextShareChooserId(), ShareChooser.NextShareChooserId());
    }

    // -----------------------------------------------------------------
    // §7.2 — The list is hidden until the button is activated.
    // -----------------------------------------------------------------
    [Fact]
    public void Section_7_2_List_Is_Hidden_Until_The_Button_Is_Activated()
    {
        var cut = Render();
        Assert.True(ListHidden(cut));

        cut.Find("button.share-chooser-button").Click();

        Assert.False(ListHidden(cut));
        Assert.Equal("true", cut.Find("button.share-chooser-button").GetAttribute("aria-expanded"));
    }

    // -----------------------------------------------------------------
    // §7.3 — Destinations are real links, not role="menuitem", and carry
    //        safe cross-origin defaults.
    // -----------------------------------------------------------------
    [Fact]
    public void Section_7_3_Destinations_Are_Real_Links_Not_Menuitems()
    {
        var cut = Render();
        cut.Find("button.share-chooser-button").Click();

        var links = cut.FindAll("a.share-chooser-target");
        Assert.Equal(2, links.Count);

        foreach (var link in links)
        {
            Assert.Equal("A", link.TagName);
            // Real link semantics are the point: role="menuitem" would strip
            // middle-click, open-in-new-tab and copy-link-address.
            Assert.Null(link.GetAttribute("role"));
            Assert.Equal("_blank", link.GetAttribute("target"));
            Assert.Equal("noopener noreferrer", link.GetAttribute("rel"));
        }
    }

    // -----------------------------------------------------------------
    // §7.3 — newTab:false drops target="_blank" for that destination.
    // -----------------------------------------------------------------
    [Fact]
    public void Section_7_3_NewTab_False_Renders_No_Target_Attribute()
    {
        var sameTab = new List<ShareTarget>
        {
            new()
            {
                Id = "intranet",
                Label = "Intranet",
                Href = (u, _, _) => $"https://intranet.test/?u={u}",
                NewTab = false,
            },
        };

        var cut = RenderComponent<ShareChooser>(p => p
            .Add(x => x.Label, "Share")
            .Add(x => x.Targets, sameTab)
            .Add(x => x.Url, UrlUnderTest));
        cut.Find("button.share-chooser-button").Click();

        Assert.Null(cut.Find("a.share-chooser-target").GetAttribute("target"));
    }

    // -----------------------------------------------------------------
    // §7.4 — Each destination's href comes from its own Href().
    // -----------------------------------------------------------------
    [Fact]
    public void Section_7_4_Each_Destination_Href_Comes_From_Its_Own_Href_Function()
    {
        var cut = Render(p => p.Add(x => x.Title, "Hello"));
        cut.Find("button.share-chooser-button").Click();

        var links = cut.FindAll("a.share-chooser-target");

        Assert.Equal(
            $"https://mastodon.test/share?url={Uri.EscapeDataString(UrlUnderTest)}"
                + $"&text={Uri.EscapeDataString("Hello")}",
            links[0].GetAttribute("href"));

        Assert.Equal(
            $"https://linkedin.test/sharing?url={Uri.EscapeDataString(UrlUnderTest)}",
            links[1].GetAttribute("href"));
    }

    // -----------------------------------------------------------------
    // §7.5 — The copy item renders only when CopyLabel is supplied. There
    //        is no default, because a default would be hardcoded English.
    // -----------------------------------------------------------------
    [Fact]
    public void Section_7_5_Copy_Item_Renders_Only_When_CopyLabel_Is_Supplied()
    {
        var without = Render();
        without.Find("button.share-chooser-button").Click();
        Assert.Empty(without.FindAll("button.share-chooser-copy"));

        var with = Render(p => p.Add(x => x.CopyLabel, "Copy link"));
        with.Find("button.share-chooser-button").Click();

        var copy = with.Find("button.share-chooser-copy");
        Assert.Equal("BUTTON", copy.TagName);
        Assert.Equal("button", copy.GetAttribute("type"));
        Assert.Equal("Copy link", copy.TextContent.Trim());
    }

    // -----------------------------------------------------------------
    // §7.6 — The status region is present, polite, and silent on load.
    // -----------------------------------------------------------------
    [Fact]
    public void Section_7_6_Status_Region_Is_Present_Polite_And_Silent_On_Load()
    {
        var cut = Render();

        var status = cut.Find("p.share-chooser-status");
        Assert.Equal("polite", status.GetAttribute("aria-live"));
        // Empty on load, so it announces the copy outcome and nothing else.
        Assert.Equal("", status.TextContent.Trim());
    }

    // =================================================================
    // Copy to clipboard — §7.7–§7.10
    // =================================================================

    // -----------------------------------------------------------------
    // §7.7 — Copying writes the URL and fires OnCopy.
    // -----------------------------------------------------------------
    [Fact]
    public void Section_7_7_Copying_Writes_The_Url_And_Fires_OnCopy()
    {
        StubClipboard(true);
        string? copied = null;

        var cut = Render(p => p
            .Add(x => x.CopyLabel, "Copy link")
            .Add(x => x.OnCopy, url => copied = url));

        cut.Find("button.share-chooser-button").Click();
        cut.Find("button.share-chooser-copy").Click();

        var call = Assert.Single(CopyCalls());
        // The script the component sent carries the URL it meant to write.
        Assert.Equal(ShareChooser.BuildCopyScript(UrlUnderTest), (string)call.Arguments[0]!);
        Assert.Contains($"\"{UrlUnderTest}\"", (string)call.Arguments[0]!);

        Assert.Equal(UrlUnderTest, copied);
    }

    // -----------------------------------------------------------------
    // §7.8 — A successful copy announces CopiedLabel and closes the list.
    // -----------------------------------------------------------------
    [Fact]
    public void Section_7_8_Successful_Copy_Announces_CopiedLabel_And_Closes()
    {
        StubClipboard(true);

        var cut = Render(p => p
            .Add(x => x.CopyLabel, "Copy link")
            .Add(x => x.CopiedLabel, "Link copied"));

        cut.Find("button.share-chooser-button").Click();
        cut.Find("button.share-chooser-copy").Click();

        Assert.Equal("Link copied", Status(cut));
        Assert.True(ListHidden(cut));
    }

    // -----------------------------------------------------------------
    // §7.9 — A failed copy announces CopyFailedLabel and does not throw.
    // -----------------------------------------------------------------
    [Fact]
    public void Section_7_9_Failed_Copy_Announces_CopyFailedLabel_And_Does_Not_Throw()
    {
        StubClipboard(false);

        var cut = Render(p => p
            .Add(x => x.CopyLabel, "Copy link")
            .Add(x => x.CopiedLabel, "Link copied")
            .Add(x => x.CopyFailedLabel, "Could not copy"));

        cut.Find("button.share-chooser-button").Click();
        // Reaching the assertions at all is the "does not throw" half.
        cut.Find("button.share-chooser-copy").Click();

        Assert.Equal("Could not copy", Status(cut));
        Assert.True(ListHidden(cut));
    }

    // -----------------------------------------------------------------
    // §7.10 — An absent clipboard API is a failure, not a crash.
    // -----------------------------------------------------------------
    [Fact]
    public async Task Section_7_10_Absent_Clipboard_Api_Is_A_Failure_Not_A_Crash()
    {
        // No StubClipboard: the copy script is unmatched, so it resolves
        // false — a browser with no navigator.clipboard at all.
        JSInterop.Setup<bool>("eval", inv => (string)inv.Arguments[0]! == ShareChooser.CanCopyScript)
            .SetResult(false);
        Assert.False(await ShareChooser.CanCopyAsync(JSInterop.JSRuntime));

        var cut = Render(p => p
            .Add(x => x.CopyLabel, "Copy link")
            .Add(x => x.CopyFailedLabel, "Could not copy"));

        cut.Find("button.share-chooser-button").Click();
        cut.Find("button.share-chooser-copy").Click();

        Assert.Equal("Could not copy", Status(cut));
    }

    // =================================================================
    // Native share sheet — §7.11–§7.14
    // =================================================================

    // -----------------------------------------------------------------
    // §7.11 — CanShareNativelyAsync reflects navigator.share.
    // -----------------------------------------------------------------
    [Fact]
    public async Task Section_7_11_CanShareNatively_Reflects_Navigator_Share()
    {
        // Unmatched -> false: no sheet.
        Assert.False(await ShareChooser.CanShareNativelyAsync(JSInterop.JSRuntime));

        JSInterop.Setup<bool>("eval", inv => (string)inv.Arguments[0]! == ShareChooser.CanShareScript)
            .SetResult(true);

        Assert.True(await ShareChooser.CanShareNativelyAsync(JSInterop.JSRuntime));
    }

    // -----------------------------------------------------------------
    // §7.12 — strategy=auto uses the sheet when available, fires
    //         OnNativeShare, and does NOT also open the list.
    // -----------------------------------------------------------------
    [Fact]
    public void Section_7_12_Auto_Uses_The_Sheet_And_Skips_The_List()
    {
        StubNativeShare("shared");
        string? shared = null;

        var cut = Render(p => p
            .Add(x => x.Title, "Hello")
            .Add(x => x.Text, "Body")
            .Add(x => x.OnNativeShare, url => shared = url));

        cut.Find("button.share-chooser-button").Click();

        var call = Assert.Single(ShareCalls());
        var script = (string)call.Arguments[0]!;
        Assert.Contains($"url:\"{UrlUnderTest}\"", script);
        Assert.Contains("title:\"Hello\"", script);
        Assert.Contains("text:\"Body\"", script);

        Assert.Equal(UrlUnderTest, shared);
        // The list must NOT also open.
        Assert.True(ListHidden(cut));
    }

    // -----------------------------------------------------------------
    // §7.13 — strategy=auto falls back to the list with no native sheet.
    // -----------------------------------------------------------------
    [Fact]
    public void Section_7_13_Auto_Falls_Back_To_The_List_With_No_Native_Sheet()
    {
        // Unmatched -> null -> Unsupported.
        var cut = Render();
        cut.Find("button.share-chooser-button").Click();

        Assert.Single(ShareCalls());
        Assert.False(ListHidden(cut));
    }

    // -----------------------------------------------------------------
    // §7.13 — strategy=list ignores an available native sheet.
    // -----------------------------------------------------------------
    [Fact]
    public void Section_7_13_List_Strategy_Ignores_An_Available_Native_Sheet()
    {
        StubNativeShare("shared");

        var cut = Render(p => p.Add(x => x.Strategy, ShareStrategy.List));
        cut.Find("button.share-chooser-button").Click();

        // Never even asked.
        Assert.Empty(ShareCalls());
        Assert.False(ListHidden(cut));
    }

    // -----------------------------------------------------------------
    // §7.14 — A dismissed (rejected) sheet does not fall through to the
    //         list. Opening it would resurrect UI the user just dismissed.
    // -----------------------------------------------------------------
    [Fact]
    public void Section_7_14_Dismissed_Sheet_Does_Not_Fall_Through_To_The_List()
    {
        StubNativeShare("dismissed");

        var cut = Render();
        cut.Find("button.share-chooser-button").Click();

        Assert.Single(ShareCalls());
        Assert.True(ListHidden(cut));
    }

    // -----------------------------------------------------------------
    // §7.14 — The three outcomes stay distinct: only "unsupported"
    //         reaches the list. This is the distinction a bare try/catch
    //         around the interop call would collapse.
    // -----------------------------------------------------------------
    [Theory]
    [InlineData("shared", true)]
    [InlineData("dismissed", true)]
    [InlineData("unsupported", false)]
    public void Section_7_14_Only_An_Unsupported_Sheet_Opens_The_List(
        string sentinel, bool expectHidden)
    {
        StubNativeShare(sentinel);

        var cut = Render();
        cut.Find("button.share-chooser-button").Click();

        Assert.Equal(expectHidden, ListHidden(cut));
    }

    // =================================================================
    // Keyboard and dismissal — §7.15–§7.19
    // =================================================================

    // -----------------------------------------------------------------
    // §7.15 — Opening moves focus to the first item.
    // -----------------------------------------------------------------
    [Fact]
    public void Section_7_15_Opening_Focuses_The_First_Item()
    {
        var cut = Render(p => p.Add(x => x.CopyLabel, "Copy link"));
        var refs = MapRefs(cut);

        cut.Find("button.share-chooser-button").Click();

        Assert.Equal(refs.Items[0], LastFocusedRefId());
    }

    // -----------------------------------------------------------------
    // §7.15 — ArrowDown on the closed button opens on the first item.
    // -----------------------------------------------------------------
    [Fact]
    public void Section_7_15_ArrowDown_On_Closed_Button_Opens_On_First_Item()
    {
        var cut = Render(p => p.Add(x => x.CopyLabel, "Copy link"));
        var refs = MapRefs(cut);

        Key(cut, "button.share-chooser-button", "ArrowDown");

        Assert.False(ListHidden(cut));
        Assert.Equal(refs.Items[0], LastFocusedRefId());
    }

    // -----------------------------------------------------------------
    // §7.15 — ArrowUp on the closed button opens on the LAST item.
    // -----------------------------------------------------------------
    [Fact]
    public void Section_7_15_ArrowUp_On_Closed_Button_Opens_On_Last_Item()
    {
        var cut = Render(p => p.Add(x => x.CopyLabel, "Copy link"));
        var refs = MapRefs(cut);

        Key(cut, "button.share-chooser-button", "ArrowUp");

        Assert.False(ListHidden(cut));
        // Two destinations then copy: the copy button is last.
        Assert.Equal(refs.Items[^1], LastFocusedRefId());
    }

    // -----------------------------------------------------------------
    // §7.16 — Arrows move focus between items and CLAMP at the ends.
    //         A disclosure list does not wrap.
    // -----------------------------------------------------------------
    [Fact]
    public void Section_7_16_Arrows_Move_Focus_And_Clamp_At_The_Ends()
    {
        var cut = Render(p => p.Add(x => x.CopyLabel, "Copy link"));
        var refs = MapRefs(cut);

        cut.Find("button.share-chooser-button").Click();
        Assert.Equal(refs.Items[0], LastFocusedRefId());

        Key(cut, "ul.share-chooser-list", "ArrowDown");
        Assert.Equal(refs.Items[1], LastFocusedRefId());

        Key(cut, "ul.share-chooser-list", "ArrowUp");
        Assert.Equal(refs.Items[0], LastFocusedRefId());

        // Clamps rather than wrapping: still the first item, not the last.
        Key(cut, "ul.share-chooser-list", "ArrowUp");
        Assert.Equal(refs.Items[0], LastFocusedRefId());

        // And clamps at the bottom too.
        Key(cut, "ul.share-chooser-list", "End");
        Key(cut, "ul.share-chooser-list", "ArrowDown");
        Assert.Equal(refs.Items[^1], LastFocusedRefId());
    }

    // -----------------------------------------------------------------
    // §7.16 — Home and End jump to the first and last item.
    // -----------------------------------------------------------------
    [Fact]
    public void Section_7_16_Home_And_End_Jump_To_First_And_Last()
    {
        var cut = Render(p => p.Add(x => x.CopyLabel, "Copy link"));
        var refs = MapRefs(cut);

        cut.Find("button.share-chooser-button").Click();

        Key(cut, "ul.share-chooser-list", "End");
        Assert.Equal(refs.Items[^1], LastFocusedRefId());

        Key(cut, "ul.share-chooser-list", "Home");
        Assert.Equal(refs.Items[0], LastFocusedRefId());
    }

    // -----------------------------------------------------------------
    // §7.17 — Escape closes and returns focus to the button.
    // -----------------------------------------------------------------
    [Fact]
    public void Section_7_17_Escape_Closes_And_Returns_Focus_To_The_Button()
    {
        var cut = Render(p => p.Add(x => x.CopyLabel, "Copy link"));
        var refs = MapRefs(cut);

        cut.Find("button.share-chooser-button").Click();
        Key(cut, "ul.share-chooser-list", "Escape");

        Assert.True(ListHidden(cut));
        Assert.Equal("false", cut.Find("button.share-chooser-button").GetAttribute("aria-expanded"));
        Assert.Equal(refs.Trigger, LastFocusedRefId());
    }

    // -----------------------------------------------------------------
    // §7.17 — Tab closes WITHOUT stealing focus back to the button.
    // -----------------------------------------------------------------
    [Fact]
    public void Section_7_17_Tab_Closes_Without_Stealing_Focus_Back()
    {
        var cut = Render(p => p.Add(x => x.CopyLabel, "Copy link"));
        var refs = MapRefs(cut);

        cut.Find("button.share-chooser-button").Click();
        var beforeTab = FocusedRefIds().Count;

        Key(cut, "ul.share-chooser-list", "Tab");

        Assert.True(ListHidden(cut));
        // Focus goes where the browser was already sending it: the component
        // must not have issued a focus call of its own.
        Assert.Equal(beforeTab, FocusedRefIds().Count);
        Assert.NotEqual(refs.Trigger, LastFocusedRefId());
    }

    // -----------------------------------------------------------------
    // §7.18 — Choosing a destination fires OnShare with its id, and closes.
    // -----------------------------------------------------------------
    [Fact]
    public void Section_7_18_Choosing_A_Destination_Fires_OnShare_And_Closes()
    {
        ShareEventArgs? chosen = null;

        var cut = Render(p => p.Add(x => x.OnShare, args => chosen = args));

        cut.Find("button.share-chooser-button").Click();
        cut.Find("a[data-target-id='linkedin']").Click();

        Assert.NotNull(chosen);
        Assert.Equal("linkedin", chosen!.TargetId);
        Assert.Equal(UrlUnderTest, chosen.Url);
        Assert.True(ListHidden(cut));
    }

    // -----------------------------------------------------------------
    // §7.19 — Focus leaving the root closes the list.
    //
    // DEVIATION from the canonical Svelte suite, which asserts "clicking
    // outside closes". Svelte reaches that via a document-level click
    // listener; this package ships no JS and adds no document listener, so
    // the root's focusout does the job — the same deviation TextSizeChooser
    // documents. Two focusouts are fired because that is what a browser
    // does: the first is the component's own open-time focus move (which
    // must be ignored), the second is the genuine departure.
    // -----------------------------------------------------------------
    [Fact]
    public void Section_7_19_Focus_Leaving_The_Root_Closes_The_List()
    {
        var cut = Render(p => p.Add(x => x.CopyLabel, "Copy link"));

        cut.Find("button.share-chooser-button").Click();
        Assert.False(ListHidden(cut));

        var root = cut.Find("div.share-chooser");

        // The component's own focus move: ignored, list stays open.
        root.TriggerEvent("onfocusout", new FocusEventArgs());
        Assert.False(ListHidden(cut));

        // A genuine departure: closes.
        root.TriggerEvent("onfocusout", new FocusEventArgs());
        Assert.True(ListHidden(cut));
    }

    // =================================================================
    // URL resolution and custom glyph — §7.20–§7.22
    // =================================================================

    // -----------------------------------------------------------------
    // §7.20 — An explicit Url wins.
    // -----------------------------------------------------------------
    [Fact]
    public void Section_7_20_Explicit_Url_Wins()
    {
        var cut = Render();
        cut.Find("button.share-chooser-button").Click();

        var href = cut.Find("a.share-chooser-target").GetAttribute("href")!;
        Assert.Contains(Uri.EscapeDataString(UrlUnderTest), href);
    }

    // -----------------------------------------------------------------
    // §7.21 — With no Url, the current page URL is used. Resolved lazily
    //         from NavigationManager, which is server-known, so nothing
    //         reads the browser during prerender.
    // -----------------------------------------------------------------
    [Fact]
    public void Section_7_21_With_No_Url_The_Current_Page_Url_Is_Used()
    {
        var navigation = Services.GetRequiredService<NavigationManager>();

        var cut = RenderComponent<ShareChooser>(p => p
            .Add(x => x.Label, "Share")
            .Add(x => x.Targets, Targets));
        cut.Find("button.share-chooser-button").Click();

        var href = cut.Find("a.share-chooser-target").GetAttribute("href")!;
        Assert.Contains(Uri.EscapeDataString(navigation.Uri), href);
    }

    // -----------------------------------------------------------------
    // §7.22 — ChildContent replaces the glyph and receives the context.
    // -----------------------------------------------------------------
    [Fact]
    public void Section_7_22_ChildContent_Replaces_The_Glyph_And_Gets_Context()
    {
        RenderFragment<ShareChooserContext> custom_glyph = context => builder =>
        {
            builder.OpenElement(0, "span");
            builder.AddAttribute(1, "data-testid", "custom");
            builder.AddAttribute(2, "data-open", context.Open.ToString().ToLowerInvariant());
            builder.AddAttribute(3, "data-url", context.Url);
            builder.AddContent(4, "custom glyph");
            builder.CloseElement();
        };

        var cut = Render(p => p.Add(x => x.ChildContent, custom_glyph));

        var custom = cut.Find("[data-testid='custom']");
        Assert.Equal("custom glyph", custom.TextContent.Trim());
        Assert.Equal("false", custom.GetAttribute("data-open"));
        Assert.Equal(UrlUnderTest, custom.GetAttribute("data-url"));

        // It replaces the glyph rather than sitting beside it.
        Assert.Empty(cut.FindAll(".share-chooser-icon"));
        // And it lives inside the trigger.
        Assert.NotNull(cut.Find("button.share-chooser-button [data-testid='custom']"));

        // The context tracks the open state.
        cut.Find("button.share-chooser-button").Click();
        Assert.Equal("true", cut.Find("[data-testid='custom']").GetAttribute("data-open"));
    }

    // =================================================================
    // Spread and class hooks — §4.1
    // =================================================================

    // -----------------------------------------------------------------
    // §4.1 — CssClass merges onto the root and unmatched attributes
    //        spread onto it, so consumers are never blocked.
    // -----------------------------------------------------------------
    [Fact]
    public void Section_4_1_CssClass_Merges_And_Attributes_Spread_Onto_Root()
    {
        var cut = Render(p => p
            .Add(x => x.CssClass, "my-share")
            .AddUnmatched("data-testid", "root")
            .AddUnmatched("id", "share-1"));

        var root = cut.Find("div.share-chooser");
        Assert.Equal("share-chooser my-share", root.GetAttribute("class"));
        Assert.Equal("root", root.GetAttribute("data-testid"));
        Assert.Equal("share-1", root.GetAttribute("id"));
    }
}
