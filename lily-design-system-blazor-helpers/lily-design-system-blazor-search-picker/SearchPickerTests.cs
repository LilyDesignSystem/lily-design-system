// SearchPicker tests — one [Fact] per spec/index.md §7 acceptance criterion.
//
// Three harness notes, all consequences of bUnit rather than of the component:
//
// 1. Focus. bUnit has no live focus model, so `document.activeElement` has no
//    equivalent. Real focus moves ARE observable, though: ElementReference.
//    FocusAsync() goes out over JS interop as
//    "Blazor._internal.domWrapper.focus", carrying the ElementReference of its
//    target and the preventScroll flag. bUnit stamps every @ref'd element with
//    a blazor:elementReference GUID in the first render's markup, and those
//    GUIDs stay stable across re-renders — so mapping GUID -> element once, up
//    front, lets each test assert exactly which element the component asked
//    the browser to focus. Same mechanism as SharePickerTests.
//
// 2. Navigation. The default navigation is NavigationManager.NavigateTo(href,
//    forceLoad: true); bUnit registers a FakeNavigationManager that records
//    each call in History, which is the C# equivalent of the canonical suite
//    stubbing location.assign.
//
// 3. "Has focus really left?" The root's focusout asks the browser through
//    IJSRuntime "eval" (SearchPicker.FocusLeftScript). Loose mode returns
//    default(bool) = false for an unmatched call — "not a confirmed
//    departure", which keeps the panel open, exactly like the canonical
//    rule for a focusout with no relatedTarget — and individual tests stub
//    it true to model a confirmed departure. What the script itself
//    decides (real element outside → left; <body> → wait for the causing
//    click) runs in a browser, not in bUnit; the tests pin its shape.

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using AngleSharp.Dom;
using Bunit;
using Bunit.JSInterop;
using Bunit.TestDoubles;
using LilyDesignSystem.Blazor.Helpers;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.Extensions.DependencyInjection;
using Xunit;

namespace LilyDesignSystem.Blazor.Helpers.Tests;

public class SearchPickerTests : TestContext
{
    private const string LabelText = "Search this site";
    private const string InputLabelText = "Search terms";
    private const string SubmitLabelText = "Search";

    /// <summary>The interop identifier ElementReference.FocusAsync() uses.</summary>
    private const string FocusIdentifier = "Blazor._internal.domWrapper.focus";

    public SearchPickerTests()
    {
        // Loose so the focus and eval calls do not throw.
        JSInterop.Mode = JSRuntimeMode.Loose;
    }

    // =================================================================
    // Harness
    // =================================================================

    private static bool IsFocusLeftScript(JSRuntimeInvocation inv)
        => inv.Identifier == "eval"
            && inv.Arguments.Count > 0
            && inv.Arguments[0] is string s
            && s.Contains("document.activeElement");

    /// <summary>Make the browser answer whether focus has really left the root.</summary>
    private void StubFocusLeft(bool left)
        => JSInterop.Setup<bool>("eval", IsFocusLeftScript).SetResult(left);

    private IReadOnlyList<JSRuntimeInvocation> FocusCalls()
        => JSInterop.Invocations.Where(i => i.Identifier == FocusIdentifier).ToList();

    private string? LastFocusedRefId()
        => FocusCalls().Select(i => ((ElementReference)i.Arguments[0]!).Id).LastOrDefault();

    private sealed class RefMap
    {
        public required string Trigger { get; init; }
        public required string Input { get; init; }
    }

    private static readonly Regex RefPattern = new(
        "class=\"(?<class>[^\"]*)\"[^>]*?blazor:elementReference=\"(?<id>[0-9a-fA-F-]{36})\"",
        RegexOptions.Compiled);

    /// <summary>
    /// Build the GUID map from the FIRST render's markup. bUnit only emits the
    /// GUIDs on that render; they remain valid afterwards.
    /// </summary>
    private static RefMap MapRefs(IRenderedComponent<SearchPicker> cut)
    {
        var found = RefPattern.Matches(cut.Markup)
            .Select(m => (Class: m.Groups["class"].Value, Id: m.Groups["id"].Value))
            .ToList();
        return new RefMap
        {
            Trigger = found.Single(f => f.Class.Contains("search-picker-button")).Id,
            Input = found.Single(f => f.Class.Contains("search-picker-input")).Id,
        };
    }

    private IRenderedComponent<SearchPicker> Render(
        Action<ComponentParameterCollectionBuilder<SearchPicker>>? extra = null)
        => RenderComponent<SearchPicker>(p =>
        {
            p.Add(x => x.Label, LabelText)
             .Add(x => x.InputLabel, InputLabelText)
             .Add(x => x.SubmitLabel, SubmitLabelText);
            extra?.Invoke(p);
        });

    /// <summary>Render with a recording Navigate, and open the panel.</summary>
    private IRenderedComponent<SearchPicker> RenderOpen(
        List<string> navigated,
        Action<ComponentParameterCollectionBuilder<SearchPicker>>? extra = null)
    {
        var cut = Render(p =>
        {
            p.Add(x => x.Navigate, href => navigated.Add(href));
            extra?.Invoke(p);
        });
        cut.Find("button.search-picker-button").Click();
        return cut;
    }

    private static bool PanelHidden(IRenderedComponent<SearchPicker> cut)
        => cut.Find("div.search-picker-panel").HasAttribute("hidden");

    private static void Type(IRenderedComponent<SearchPicker> cut, string text)
        => cut.Find("input.search-picker-input").Input(text);

    private static void Submit(IRenderedComponent<SearchPicker> cut)
        => cut.Find("form.search-picker-form").Submit();

    // =================================================================
    // Structure — §7.1–§7.6
    // =================================================================

    // -----------------------------------------------------------------
    // §7.1 — A named disclosure button controlling the panel.
    // -----------------------------------------------------------------
    [Fact]
    public void Section_7_1_Renders_A_Named_Disclosure_Button_Controlling_The_Panel()
    {
        var cut = Render();

        var button = cut.Find("button.search-picker-button");
        Assert.Equal("button", button.GetAttribute("type"));
        Assert.Equal(LabelText, button.GetAttribute("aria-label"));
        Assert.Equal("false", button.GetAttribute("aria-expanded"));
        // A disclosure, not a menu or a listbox.
        Assert.Null(button.GetAttribute("aria-haspopup"));

        var panel = cut.Find("div.search-picker-panel");
        Assert.False(string.IsNullOrEmpty(panel.Id));
        Assert.Equal(panel.Id, button.GetAttribute("aria-controls"));

        // Ids are minted per instance, so two on a page never collide.
        var other = Render().Find("div.search-picker-panel").Id;
        Assert.NotEqual(panel.Id, other);
        Assert.NotEqual(SearchPicker.NextSearchPickerId(), SearchPicker.NextSearchPickerId());
    }

    // -----------------------------------------------------------------
    // §7.2 — The panel is hidden until the button is activated, and
    //        activating again closes it.
    // -----------------------------------------------------------------
    [Fact]
    public void Section_7_2_Panel_Is_Hidden_Until_Activated_And_Toggles()
    {
        var cut = Render();
        Assert.True(PanelHidden(cut));

        cut.Find("button.search-picker-button").Click();
        Assert.False(PanelHidden(cut));
        Assert.Equal("true", cut.Find("button.search-picker-button").GetAttribute("aria-expanded"));

        cut.Find("button.search-picker-button").Click();
        Assert.True(PanelHidden(cut));
        Assert.Equal("false", cut.Find("button.search-picker-button").GetAttribute("aria-expanded"));
    }

    // -----------------------------------------------------------------
    // §7.3 — The default icon is an aria-hidden magnifying-glass SVG.
    // -----------------------------------------------------------------
    [Fact]
    public void Section_7_3_Default_Icon_Is_An_AriaHidden_Magnifying_Glass_Svg()
    {
        var cut = Render();

        var icon = cut.Find("button.search-picker-button svg.search-picker-icon");
        Assert.Equal("true", icon.GetAttribute("aria-hidden"));
        Assert.Equal("0 0 16 16", icon.GetAttribute("viewBox"));
        Assert.NotNull(icon.QuerySelector("circle"));
        Assert.NotNull(icon.QuerySelector("path"));
    }

    // -----------------------------------------------------------------
    // §7.4 — ChildContent replaces the icon and receives the context.
    // -----------------------------------------------------------------
    [Fact]
    public void Section_7_4_ChildContent_Replaces_The_Icon_And_Gets_Context()
    {
        RenderFragment<SearchPickerContext> custom = context => builder =>
        {
            builder.OpenElement(0, "span");
            builder.AddAttribute(1, "data-testid", "custom");
            builder.AddAttribute(2, "data-open", context.Open.ToString().ToLowerInvariant());
            builder.AddAttribute(3, "data-query", context.Query);
            builder.CloseElement();
        };

        var cut = Render(p => p.Add(x => x.Value, "foo").Add(x => x.ChildContent, custom));

        var span = cut.Find("button.search-picker-button [data-testid='custom']");
        Assert.Equal("false", span.GetAttribute("data-open"));
        Assert.Equal("foo", span.GetAttribute("data-query"));
        Assert.Empty(cut.FindAll(".search-picker-icon"));

        // The context tracks the open state.
        cut.Find("button.search-picker-button").Click();
        Assert.Equal("true", cut.Find("[data-testid='custom']").GetAttribute("data-open"));
    }

    // -----------------------------------------------------------------
    // §7.5 — A named search form, field, and submit button after the field.
    // -----------------------------------------------------------------
    [Fact]
    public void Section_7_5_Panel_Holds_A_Named_Search_Form_Field_And_Submit_After_It()
    {
        var cut = RenderOpen(new List<string>());

        var form = cut.Find("div.search-picker-panel > form.search-picker-form");
        Assert.Equal("search", form.GetAttribute("role"));
        Assert.Equal(LabelText, form.GetAttribute("aria-label"));
        Assert.Equal("/", form.GetAttribute("action"));
        Assert.Equal("get", form.GetAttribute("method"));

        var input = cut.Find("input.search-picker-input");
        Assert.Equal("search", input.GetAttribute("type"));
        Assert.Equal(InputLabelText, input.GetAttribute("aria-label"));
        Assert.Equal("search", input.GetAttribute("enterkeyhint"));

        var submit = cut.Find("button.search-picker-submit");
        Assert.Equal("submit", submit.GetAttribute("type"));
        Assert.Equal(SubmitLabelText, submit.GetAttribute("aria-label"));

        // The submit button follows the field in DOM order.
        var order = form.Children.Select(c => c.ClassName).ToList();
        Assert.Equal(new[] { "search-picker-input", "search-picker-submit" }, order);
    }

    // -----------------------------------------------------------------
    // §7.6 — The submit button shows ⏎ in an aria-hidden span.
    // -----------------------------------------------------------------
    [Fact]
    public void Section_7_6_Submit_Button_Shows_Return_Symbol_In_AriaHidden_Span()
    {
        var cut = RenderOpen(new List<string>());

        var symbol = cut.Find("button.search-picker-submit > span.search-picker-submit-symbol");
        Assert.Equal("⏎", symbol.TextContent);
        Assert.Equal("true", symbol.GetAttribute("aria-hidden"));
    }

    // =================================================================
    // Searching — §7.7–§7.15
    // =================================================================

    // -----------------------------------------------------------------
    // §7.7 — Opening focuses the search field with preventScroll.
    // -----------------------------------------------------------------
    [Fact]
    public void Section_7_7_Opening_Focuses_The_Field_With_PreventScroll()
    {
        var cut = Render();
        var refs = MapRefs(cut);

        cut.Find("button.search-picker-button").Click();

        Assert.Equal(refs.Input, LastFocusedRefId());
        Assert.True((bool)FocusCalls().Last().Arguments[1]!);
    }

    // -----------------------------------------------------------------
    // §7.8 — Return in the field (form submit) navigates to /?<query>,
    //        and the native form submission is cancelled.
    // -----------------------------------------------------------------
    [Fact]
    public void Section_7_8_Submitting_The_Form_Navigates_To_Bare_Query()
    {
        var navigated = new List<string>();
        var cut = RenderOpen(navigated);

        // The native GET (which would send /?name=value) is cancelled: the
        // form's submit handler carries preventDefault.
        Assert.Contains("blazor:onsubmit:preventDefault", cut.Markup);

        Type(cut, "foo");
        Submit(cut);

        Assert.Equal(new[] { "/?foo" }, navigated);
    }

    // -----------------------------------------------------------------
    // §7.9 — Clicking the submit button navigates the same way.
    // -----------------------------------------------------------------
    [Fact]
    public void Section_7_9_Clicking_The_Submit_Button_Navigates()
    {
        var navigated = new List<string>();
        var cut = RenderOpen(navigated);

        Type(cut, "foo");
        cut.Find("button.search-picker-submit").Click();

        Assert.Equal(new[] { "/?foo" }, navigated);
    }

    // -----------------------------------------------------------------
    // §7.10 — The query is trimmed and URI-encoded.
    // -----------------------------------------------------------------
    [Fact]
    public void Section_7_10_Query_Is_Trimmed_And_Uri_Encoded()
    {
        var navigated = new List<string>();
        var cut = RenderOpen(navigated);

        Type(cut, "  foo bar ");
        Submit(cut);
        Assert.Equal("/?foo%20bar", navigated.Last());

        cut.Find("button.search-picker-button").Click();
        Type(cut, "a&b");
        Submit(cut);
        Assert.Equal("/?a%26b", navigated.Last());
    }

    // -----------------------------------------------------------------
    // §7.10 — The encoding is JavaScript's encodeURIComponent exactly, not
    //         Uri.EscapeDataString: ! ' ( ) * stay bare, and non-ASCII is
    //         UTF-8 percent-encoded, so every catalog builds the same URL.
    // -----------------------------------------------------------------
    [Fact]
    public void Section_7_10_Encoding_Matches_EncodeURIComponent()
    {
        // encodeURIComponent("it's (a)!*~-_.") === "it's%20(a)!*~-_."
        Assert.Equal("/?it's%20(a)!*~-_.", SearchPicker.SearchHref("it's (a)!*~-_."));
        // encodeURIComponent("café/?#=+") === "caf%C3%A9%2F%3F%23%3D%2B"
        Assert.Equal("/?caf%C3%A9%2F%3F%23%3D%2B", SearchPicker.SearchHref("café/?#=+"));
        // A literal "%21" in the query is still escaped as "%2521", not unescaped.
        Assert.Equal("/?%2521", SearchPicker.SearchHref("%21"));
    }

    // -----------------------------------------------------------------
    // §7.11 — An empty or whitespace-only query does nothing and stays open.
    // -----------------------------------------------------------------
    [Fact]
    public void Section_7_11_Empty_Or_Whitespace_Query_Does_Nothing()
    {
        var navigated = new List<string>();
        SearchEventArgs? searched = null;
        var cut = RenderOpen(navigated, p => p.Add(x => x.OnSearch, a => searched = a));

        Submit(cut);
        Type(cut, "   ");
        Submit(cut);

        Assert.Empty(navigated);
        Assert.Null(searched);
        Assert.False(PanelHidden(cut));
    }

    // -----------------------------------------------------------------
    // §7.12 — Action changes the path.
    // -----------------------------------------------------------------
    [Fact]
    public void Section_7_12_Action_Changes_The_Path()
    {
        var navigated = new List<string>();
        var cut = RenderOpen(navigated, p => p.Add(x => x.Action, "/search"));

        Assert.Equal("/search", cut.Find("form.search-picker-form").GetAttribute("action"));
        Type(cut, "foo");
        Submit(cut);

        Assert.Equal(new[] { "/search?foo" }, navigated);
    }

    // -----------------------------------------------------------------
    // §7.13 — OnSearch fires with the trimmed query and href, before
    //         Navigate.
    // -----------------------------------------------------------------
    [Fact]
    public void Section_7_13_OnSearch_Fires_With_Query_And_Href_Before_Navigate()
    {
        var calls = new List<string>();
        var cut = Render(p => p
            .Add(x => x.OnSearch, a => calls.Add($"search:{a.Query}:{a.Href}"))
            .Add(x => x.Navigate, href => calls.Add($"navigate:{href}")));

        cut.Find("button.search-picker-button").Click();
        Type(cut, " foo ");
        Submit(cut);

        Assert.Equal(new[] { "search:foo:/?foo", "navigate:/?foo" }, calls);
    }

    // -----------------------------------------------------------------
    // §7.14 — Without Navigate, the default is a real GET:
    //         NavigationManager.NavigateTo(href, forceLoad: true) — the
    //         Blazor equivalent of the canonical location.assign(href).
    // -----------------------------------------------------------------
    [Fact]
    public void Section_7_14_Without_Navigate_The_Default_Is_A_Forced_Load()
    {
        var nav = Services.GetRequiredService<FakeNavigationManager>();

        var cut = Render();
        cut.Find("button.search-picker-button").Click();
        Type(cut, "foo");
        Submit(cut);

        var entry = Assert.Single(nav.History);
        Assert.Equal("/?foo", entry.Uri);
        Assert.True(entry.Options.ForceLoad);
        Assert.EndsWith("/?foo", nav.Uri);
    }

    // -----------------------------------------------------------------
    // §7.15 — A search closes the panel.
    // -----------------------------------------------------------------
    [Fact]
    public void Section_7_15_A_Search_Closes_The_Panel()
    {
        var cut = RenderOpen(new List<string>());

        Type(cut, "foo");
        Submit(cut);

        Assert.True(PanelHidden(cut));
        Assert.Equal("false", cut.Find("button.search-picker-button").GetAttribute("aria-expanded"));
    }

    // =================================================================
    // Closing — §7.16–§7.18
    // =================================================================

    // -----------------------------------------------------------------
    // §7.16 — Escape closes and returns focus to the button with
    //         preventScroll.
    // -----------------------------------------------------------------
    [Fact]
    public void Section_7_16_Escape_Closes_And_Returns_Focus_To_The_Button()
    {
        var cut = Render();
        var refs = MapRefs(cut);
        cut.Find("button.search-picker-button").Click();

        cut.Find("input.search-picker-input").KeyDown(new KeyboardEventArgs { Key = "Escape" });

        Assert.True(PanelHidden(cut));
        Assert.Equal(refs.Trigger, LastFocusedRefId());
        Assert.True((bool)FocusCalls().Last().Arguments[1]!);
        // Every focus move the component made passed preventScroll.
        Assert.All(FocusCalls(), i => Assert.True((bool)i.Arguments[1]!));
    }

    // -----------------------------------------------------------------
    // §7.17 — Clicking outside closes the panel.
    //
    // DEVIATION (spec §9): no document-level click listener is installed
    // up front — this package ships no JS file. A click outside blurs the
    // field; on that focusout the component asks the browser whether focus
    // really left, and the script answers "yes" for a click that landed
    // outside the root (it waits for that click when focus went to
    // <body>). The stub models that answer.
    // -----------------------------------------------------------------
    [Fact]
    public void Section_7_17_Clicking_Outside_Closes_The_Panel()
    {
        var cut = RenderOpen(new List<string>());
        Assert.False(PanelHidden(cut));

        StubFocusLeft(true);
        cut.Find("div.search-picker").TriggerEvent("onfocusout", new FocusEventArgs());

        Assert.True(PanelHidden(cut));
        // Closing on an outside click does not steal focus back: the only
        // focus move is the open-time one onto the field.
        Assert.Single(FocusCalls());

        // The script resolves an outside click itself: it listens (capture)
        // for the click that caused a blur to <body>, and calls it a
        // departure only when that click's target is outside the root.
        var script = (string)JSInterop.Invocations.Last(IsFocusLeftScript).Arguments[0]!;
        Assert.Contains("document.body", script);
        Assert.Contains("addEventListener('click'", script);
        Assert.Contains("!root.contains(e.target)", script);
    }

    // -----------------------------------------------------------------
    // §7.18 — Focus moving to an element outside the root closes the
    //         panel; focus moving between the root's own controls
    //         (field → ⏎ → trigger) does not. Blazor has no
    //         relatedTarget, so the browser is asked.
    // -----------------------------------------------------------------
    [Fact]
    public void Section_7_18_Focus_Moving_Outside_The_Root_Closes_The_Panel()
    {
        var cut = RenderOpen(new List<string>());
        var root = cut.Find("div.search-picker");

        // Tab from the field to ⏎: focus is still inside, stays open.
        StubFocusLeft(false);
        root.TriggerEvent("onfocusout", new FocusEventArgs());
        Assert.False(PanelHidden(cut));

        // The script names this instance's panel, waits for focus to
        // settle before reading document.activeElement, and treats a real
        // active element as "left" exactly when it is outside the root.
        var script = (string)JSInterop.Invocations.Last(IsFocusLeftScript).Arguments[0]!;
        Assert.Contains(cut.Find("div.search-picker-panel").Id!, script);
        Assert.Contains("setTimeout", script);
        Assert.Contains("r(!root.contains(a))", script);

        // Tab off ⏎ out of the control: closes.
        StubFocusLeft(true);
        root.TriggerEvent("onfocusout", new FocusEventArgs());
        Assert.True(PanelHidden(cut));
    }

    // =================================================================
    // Value, exports, root — §7.19–§7.23
    // =================================================================

    // -----------------------------------------------------------------
    // §7.19 — An initial Value pre-fills the field; typing updates the
    //         bound Value (ValueChanged) and the search uses it.
    // -----------------------------------------------------------------
    [Fact]
    public void Section_7_19_Initial_Value_Prefills_And_Typing_Updates_Binding()
    {
        var navigated = new List<string>();
        string? bound = null;
        var cut = RenderOpen(navigated, p => p
            .Add(x => x.Value, "preset")
            .Add(x => x.ValueChanged, v => bound = v));

        Assert.Equal("preset", cut.Find("input.search-picker-input").GetAttribute("value"));

        Type(cut, "typed");
        Assert.Equal("typed", bound);

        Submit(cut);
        Assert.Equal(new[] { "/?typed" }, navigated);
    }

    // -----------------------------------------------------------------
    // §7.20 — SearchHref() builds the destination the component uses.
    // -----------------------------------------------------------------
    [Fact]
    public void Section_7_20_SearchHref_Builds_The_Destination()
    {
        Assert.Equal("/?foo", SearchPicker.SearchHref("foo"));
        Assert.Equal("/?foo%20bar", SearchPicker.SearchHref(" foo bar "));
        Assert.Equal("/search?foo", SearchPicker.SearchHref("foo", "/search"));
        Assert.Equal("/?a%26b", SearchPicker.SearchHref("a&b"));
    }

    // -----------------------------------------------------------------
    // §7.21 — ReturnSymbol is the bare ⏎ (U+23CE).
    // -----------------------------------------------------------------
    [Fact]
    public void Section_7_21_ReturnSymbol_Is_The_Bare_Return_Symbol()
    {
        Assert.Equal("⏎", SearchPicker.ReturnSymbol);
        Assert.Equal(1, SearchPicker.ReturnSymbol.Length);
        Assert.Equal(0x23CE, char.ConvertToUtf32(SearchPicker.ReturnSymbol, 0));
    }

    // -----------------------------------------------------------------
    // §7.22 — CssClass merges onto the root and unmatched attributes
    //         spread onto it.
    // -----------------------------------------------------------------
    [Fact]
    public void Section_7_22_CssClass_And_Attributes_Land_On_The_Root()
    {
        var cut = Render(p => p
            .Add(x => x.CssClass, "site-search")
            .AddUnmatched("data-testid", "root")
            .AddUnmatched("id", "search-1"));

        var root = cut.Find("div.search-picker");
        Assert.Equal("search-picker site-search", root.GetAttribute("class"));
        Assert.Equal("root", root.GetAttribute("data-testid"));
        Assert.Equal("search-1", root.GetAttribute("id"));
    }

    // -----------------------------------------------------------------
    // §7.23 — No user-facing text of its own: no placeholder by default,
    //         and the only text node is the aria-hidden ⏎ (the tooltip, which holds the
    //         button's Label, aside).
    // -----------------------------------------------------------------
    [Fact]
    public void Section_7_23_No_User_Facing_Text_Of_Its_Own()
    {
        var cut = RenderOpen(new List<string>());

        Assert.False(cut.Find("input.search-picker-input").HasAttribute("placeholder"));

        // The tooltip's text is the button's Label (spec §4.2 "Tooltip"),
        // not text of its own; set it aside like the canonical suite does.
        cut.Find("div.search-picker-tooltip").Remove();
        var texts = cut.Find("div.search-picker")
            .GetDescendants()
            .OfType<IText>()
            .Select(t => t.TextContent.Trim())
            .Where(t => t.Length > 0)
            .ToList();
        Assert.Equal(new[] { "⏎" }, texts);

        // And a supplied placeholder is passed through verbatim.
        var with = Render(p => p.Add(x => x.Placeholder, "Search…"));
        Assert.Equal("Search…", with.Find("input.search-picker-input").GetAttribute("placeholder"));
    }

    // =================================================================
    // Safari focus regression — §7.24
    // =================================================================

    // -----------------------------------------------------------------
    // §7.24 — A focusout that is not a confirmed departure (Safari's
    //         click on ⏎ or on the icon button, which blurs the field to
    //         <body> without focusing the button; a window blur; an
    //         interop failure) leaves the panel open, so the click that
    //         caused it still lands. On the icon button that click then
    //         toggles the panel CLOSED — before this fix, the blur closed
    //         it and the click re-opened it, so it never closed.
    // -----------------------------------------------------------------
    [Fact]
    public void Section_7_24_Unconfirmed_Focusout_Leaves_Panel_Open_So_Icon_Click_Closes()
    {
        var cut = RenderOpen(new List<string>());
        var root = cut.Find("div.search-picker");

        // Safari: mousedown on the icon button blurs the field to <body>;
        // the script waits for the click, which lands inside — not left.
        StubFocusLeft(false);
        root.TriggerEvent("onfocusout", new FocusEventArgs());
        Assert.False(PanelHidden(cut));

        // The click then reaches the trigger and toggles the panel closed.
        cut.Find("button.search-picker-button").Click();
        Assert.True(PanelHidden(cut));
        Assert.Equal("false", cut.Find("button.search-picker-button").GetAttribute("aria-expanded"));
    }

    [Fact]
    public void Section_7_24_Unconfirmed_Focusout_Leaves_Panel_Open_So_Submit_Click_Searches()
    {
        var navigated = new List<string>();
        var cut = RenderOpen(navigated);
        Type(cut, "foo");

        // An interop failure is not a confirmed departure either.
        JSInterop.Setup<bool>("eval", IsFocusLeftScript)
            .SetException(new InvalidOperationException("interop unavailable"));
        cut.Find("div.search-picker").TriggerEvent("onfocusout", new FocusEventArgs());
        Assert.False(PanelHidden(cut));

        cut.Find("button.search-picker-submit").Click();
        Assert.Equal(new[] { "/?foo" }, navigated);
    }

    // =================================================================
    // Tooltip — §7.25–§7.30 (spec §4.2 "Tooltip"). Method names carry a
    // Tooltip_ prefix: this file's older Section_7_* numbering has drifted
    // from the spec's, so the prefix keeps the names collision-free.
    // =================================================================

    private IRenderedComponent<SearchPicker> TipRender() => Render();

    private static AngleSharp.Dom.IElement TipButton(IRenderedComponent<SearchPicker> cut)
        => cut.Find("button.search-picker-button");

    private static AngleSharp.Dom.IElement TipEl(IRenderedComponent<SearchPicker> cut)
        => cut.Find("div.search-picker-tooltip");

    private static bool TipHidden(IRenderedComponent<SearchPicker> cut)
        => TipEl(cut).HasAttribute("hidden");

    [Fact]
    public void Tooltip_Section_7_25_Renders_A_Hidden_Role_Tooltip_Holding_The_Label_Not_Described_By()
    {
        var cut = TipRender();
        var button = TipButton(cut);
        var tip = TipEl(cut);
        Assert.Equal("tooltip", tip.GetAttribute("role"));
        Assert.Equal(button.GetAttribute("aria-label"), tip.TextContent);
        Assert.True(tip.HasAttribute("hidden"));
        Assert.False(string.IsNullOrEmpty(tip.Id));
        // A sibling right after the icon button.
        Assert.Equal(button.ClassName, tip.PreviousElementSibling?.ClassName);
        // Purely visual: it duplicates aria-label, so it is not linked.
        Assert.False(button.HasAttribute("aria-describedby"));
    }

    [Fact]
    public void Tooltip_Section_7_26_Pointer_Over_The_Button_Shows_It_Leaving_Hides_It()
    {
        var cut = TipRender();
        TipButton(cut).TriggerEvent("onmouseenter", new MouseEventArgs());
        Assert.False(TipHidden(cut));
        TipButton(cut).TriggerEvent("onmouseleave", new MouseEventArgs());
        Assert.True(TipHidden(cut));
    }

    [Fact]
    public void Tooltip_Section_7_27_It_Stays_Visible_While_The_Pointer_Is_Over_The_Tooltip()
    {
        var cut = TipRender();
        TipButton(cut).TriggerEvent("onmouseenter", new MouseEventArgs());
        TipButton(cut).TriggerEvent("onmouseleave", new MouseEventArgs());
        TipEl(cut).TriggerEvent("onmouseenter", new MouseEventArgs());
        Assert.False(TipHidden(cut));
        TipEl(cut).TriggerEvent("onmouseleave", new MouseEventArgs());
        Assert.True(TipHidden(cut));
    }

    [Fact]
    public void Tooltip_Section_7_28_Keyboard_Focus_Shows_It_Blur_Hides_It_Mouse_Focus_Does_Not()
    {
        var cut = TipRender();
        TipButton(cut).Focus();
        Assert.False(TipHidden(cut));
        TipButton(cut).Blur();
        Assert.True(TipHidden(cut));

        // A mousedown immediately before focus marks the focus as
        // pointer-induced (Blazor stand-in for :focus-visible, spec §9).
        TipButton(cut).MouseDown();
        TipButton(cut).Focus();
        Assert.True(TipHidden(cut));
        TipButton(cut).Blur();

        // ... and the mark is consumed: the next focus is keyboard focus.
        TipButton(cut).Focus();
        Assert.False(TipHidden(cut));
    }

    [Fact]
    public void Tooltip_Section_7_29_Escape_Dismisses_It_Without_Moving_Focus_Reentering_Shows_It_Again()
    {
        var cut = TipRender();
        TipButton(cut).TriggerEvent("onmouseenter", new MouseEventArgs());
        TipButton(cut).KeyDown(new KeyboardEventArgs { Key = "Escape" });
        Assert.True(TipHidden(cut));
        // No focus request: dismissal never moves focus.
        Assert.DoesNotContain(JSInterop.Invocations,
            i => i.Identifier == "Blazor._internal.domWrapper.focus");
        TipButton(cut).TriggerEvent("onmouseleave", new MouseEventArgs());
        TipButton(cut).TriggerEvent("onmouseenter", new MouseEventArgs());
        Assert.False(TipHidden(cut));
    }

    [Fact]
    public void Tooltip_Section_7_30_It_Is_Never_Shown_While_The_Popup_Is_Open()
    {
        var cut = TipRender();
        TipButton(cut).TriggerEvent("onmouseenter", new MouseEventArgs());
        TipButton(cut).Click();
        Assert.Equal("true", TipButton(cut).GetAttribute("aria-expanded"));
        Assert.True(TipHidden(cut));
        TipButton(cut).TriggerEvent("onmouseenter", new MouseEventArgs());
        Assert.True(TipHidden(cut));
        TipButton(cut).Focus();
        Assert.True(TipHidden(cut));
    }

    [Fact]
    public void Tooltip_Section_7_31_Escape_From_Elsewhere_In_The_Root_Dismisses_A_Hover_Shown_Tooltip()
    {
        var cut = TipRender();
        TipButton(cut).TriggerEvent("onmouseenter", new MouseEventArgs());
        Assert.False(TipHidden(cut));
        // Escape arrives at the root (or tooltip), not at the button.
        cut.Find("div.search-picker").KeyDown(new KeyboardEventArgs { Key = "Escape" });
        Assert.True(TipHidden(cut));
        Assert.DoesNotContain(JSInterop.Invocations,
            i => i.Identifier == "Blazor._internal.domWrapper.focus");
        TipButton(cut).TriggerEvent("onmouseleave", new MouseEventArgs());
        TipButton(cut).TriggerEvent("onmouseenter", new MouseEventArgs());
        Assert.False(TipHidden(cut));
        TipEl(cut).KeyDown(new KeyboardEventArgs { Key = "Escape" });
        Assert.True(TipHidden(cut));
    }

    [Fact]
    public void Tooltip_Section_7_31_Root_Escape_While_Hidden_Is_A_NoOp_And_Does_Not_Pre_Dismiss()
    {
        var cut = TipRender();
        TipButton(cut).TriggerEvent("onmouseenter", new MouseEventArgs());
        TipButton(cut).TriggerEvent("onmouseleave", new MouseEventArgs());
        Assert.True(TipHidden(cut));
        cut.Find("div.search-picker").KeyDown(new KeyboardEventArgs { Key = "Escape" });
        Assert.True(TipHidden(cut));
        // Nothing lingers: a later keyboard focus still shows the tooltip.
        TipButton(cut).Focus();
        Assert.False(TipHidden(cut));
        Assert.DoesNotContain(JSInterop.Invocations,
            i => i.Identifier == "Blazor._internal.domWrapper.focus");
    }
}
