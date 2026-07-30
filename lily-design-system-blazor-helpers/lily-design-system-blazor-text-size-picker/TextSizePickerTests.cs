// TextSizePicker tests — one [Fact] per spec/index.md §7 acceptance criterion.

using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Bunit;
using Bunit.JSInterop;
using LilyDesignSystem.Blazor.Helpers;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;
using Xunit;

namespace LilyDesignSystem.Blazor.Helpers.Tests;

public class TextSizePickerTests : TestContext
{
    private static readonly string[] Sizes = { "small", "medium", "large", "x-large" };

    public TextSizePickerTests()
    {
        // bUnit JSInterop defaults to Strict; relax so the eval call and the
        // FocusAsync interop do not throw during render. Tests inspect
        // invocations.
        JSInterop.Mode = JSRuntimeMode.Loose;
        JSInterop.SetupVoid("eval", _ => true).SetVoidResult();
        JSInterop.Setup<string?>("eval", _ => true).SetResult(null);
    }

    private IRenderedComponent<TextSizePicker> RenderDefault()
        => RenderComponent<TextSizePicker>(p => p
            .Add(x => x.Label, "Text size")
            .Add(x => x.Sizes, Sizes));

    private static void Key(IRenderedComponent<TextSizePicker> cut, string selector, string key)
        => cut.Find(selector).KeyDown(new KeyboardEventArgs { Key = key });

    // =================================================================
    // Markup contract — §7.1–§7.8
    // =================================================================

    // -----------------------------------------------------------------
    // §7.1 — The root is a <div> carrying the class hook; inside it a
    //        <button> controls a <ul role="listbox">.
    // -----------------------------------------------------------------
    [Fact]
    public void Section_7_1_Renders_Button_Controlling_A_Listbox()
    {
        var cut = RenderDefault();

        var root = cut.Find("div.text-size-picker");
        Assert.NotNull(root);
        Assert.Empty(cut.FindAll("select"));

        var button = cut.Find("button.text-size-picker-button");
        Assert.Equal("button", button.GetAttribute("type"));
        Assert.Equal("listbox", button.GetAttribute("aria-haspopup"));
        Assert.Equal("false", button.GetAttribute("aria-expanded"));

        var listId = button.GetAttribute("aria-controls");
        Assert.False(string.IsNullOrEmpty(listId));

        var list = cut.Find("ul.text-size-picker-list");
        Assert.Equal(listId, list.GetAttribute("id"));
        Assert.Equal("listbox", list.GetAttribute("role"));
        Assert.Equal("-1", list.GetAttribute("tabindex"));
    }

    // -----------------------------------------------------------------
    // §7.2 — The button renders the "A" glyph, hidden from assistive
    //        technology.
    // -----------------------------------------------------------------
    [Fact]
    public void Section_7_2_Button_Renders_Glyph_Hidden_From_Assistive_Tech()
    {
        var cut = RenderDefault();

        var icon = cut.Find(".text-size-picker-icon");
        // U+0041 LATIN CAPITAL LETTER A — a letter, not a pictograph, so it
        // renders in the page's own font on every platform.
        Assert.Equal("A", icon.TextContent.Trim());
        Assert.Equal("true", icon.GetAttribute("aria-hidden"));
        Assert.Equal("A", TextSizePicker.LatinCapitalLetterA);
    }

    // -----------------------------------------------------------------
    // §7.3 — aria-label names both the button and the listbox.
    // -----------------------------------------------------------------
    [Fact]
    public void Section_7_3_AriaLabel_Names_Button_And_Listbox()
    {
        var cut = RenderComponent<TextSizePicker>(p => p
            .Add(x => x.Label, "Choose text size")
            .Add(x => x.Sizes, Sizes));

        Assert.Equal("Choose text size", cut.Find("button").GetAttribute("aria-label"));
        Assert.Equal("Choose text size", cut.Find("ul").GetAttribute("aria-label"));
    }

    // -----------------------------------------------------------------
    // §7.4 — One option per size; the hidden input carries the supplied
    //        Name and the resolved Value.
    // -----------------------------------------------------------------
    [Fact]
    public async Task Section_7_4_One_Option_Per_Size_Hidden_Input_Carries_Name_And_Value()
    {
        var cut = RenderComponent<TextSizePicker>(p => p
            .Add(x => x.Label, "Text size")
            .Add(x => x.Sizes, Sizes)
            .Add(x => x.Name, "size"));
        await Task.Yield();

        var options = cut.FindAll("li.text-size-picker-option");
        Assert.Equal(Sizes.Length, options.Count);
        foreach (var option in options)
        {
            Assert.Equal("option", option.GetAttribute("role"));
        }

        var hidden = cut.Find("input[type='hidden']");
        Assert.Equal("size", hidden.GetAttribute("name"));
        Assert.Equal("medium", hidden.GetAttribute("value"));
    }

    // -----------------------------------------------------------------
    // §7.4b — The default Name is "text-size".
    // -----------------------------------------------------------------
    [Fact]
    public void Section_7_4_Default_Name_Is_TextSize()
    {
        var cut = RenderDefault();

        Assert.Equal("text-size", cut.Find("input[type='hidden']").GetAttribute("name"));
    }

    // -----------------------------------------------------------------
    // §7.5 — The listbox is hidden until the button is activated;
    //        aria-expanded tracks the open state.
    // -----------------------------------------------------------------
    [Fact]
    public void Section_7_5_Listbox_Hidden_Until_Activated()
    {
        var cut = RenderDefault();

        Assert.True(cut.Find("ul").HasAttribute("hidden"));

        cut.Find("button").Click();

        Assert.False(cut.Find("ul").HasAttribute("hidden"));
        Assert.Equal("true", cut.Find("button").GetAttribute("aria-expanded"));

        // Clicking again closes.
        cut.Find("button").Click();
        Assert.True(cut.Find("ul").HasAttribute("hidden"));
        Assert.Equal("false", cut.Find("button").GetAttribute("aria-expanded"));
    }

    // -----------------------------------------------------------------
    // §7.6 — The active size is the single aria-selected option, and the
    //        open listbox points aria-activedescendant at the active one.
    // -----------------------------------------------------------------
    [Fact]
    public async Task Section_7_6_Active_Size_Is_The_AriaSelected_Option()
    {
        var cut = RenderDefault();
        await Task.Yield();

        // Closed: no aria-activedescendant.
        Assert.Null(cut.Find("ul").GetAttribute("aria-activedescendant"));

        cut.Find("button").Click();

        var selected = cut.FindAll("li[aria-selected='true']");
        Assert.Single(selected);
        Assert.Equal("Medium", selected[0].TextContent.Trim());

        // Opening puts the active descendant on the selected option, which
        // also carries the data-active styling hook.
        var list = cut.Find("ul");
        Assert.Equal(cut.FindAll("li")[1].GetAttribute("id"),
            list.GetAttribute("aria-activedescendant"));
        Assert.True(cut.FindAll("li")[1].HasAttribute("data-active"));
    }

    // -----------------------------------------------------------------
    // §7.7 — Default labels title-case the slug; SizeLabels overrides the
    //        default rendering.
    // -----------------------------------------------------------------
    [Fact]
    public void Section_7_7_Default_Labels_TitleCase_And_Overrideable()
    {
        var cut = RenderDefault();

        var labels = cut.FindAll("li.text-size-picker-option")
            .Select(li => li.TextContent.Trim()).ToList();
        Assert.Equal(new[] { "Small", "Medium", "Large", "X Large" }, labels);

        var cut2 = RenderComponent<TextSizePicker>(p => p
            .Add(x => x.Label, "Text size")
            .Add(x => x.Sizes, new[] { "small", "large" })
            .Add(x => x.SizeLabels,
                (IReadOnlyDictionary<string, string>)new Dictionary<string, string>
                {
                    ["small"] = "Compact",
                    ["large"] = "Comfortable",
                }));

        var labels2 = cut2.FindAll("li.text-size-picker-option")
            .Select(li => li.TextContent.Trim()).ToList();
        Assert.Equal(new[] { "Compact", "Comfortable" }, labels2);
    }

    // -----------------------------------------------------------------
    // §7.8 — Option and list ids are stable within an instance and unique
    //        across instances (monotonic counter, not randomness).
    // -----------------------------------------------------------------
    [Fact]
    public void Section_7_8_Option_Ids_Are_Stable_And_Unique_Per_Instance()
    {
        var a = RenderDefault();
        var b = RenderDefault();

        var aList = a.Find("ul").GetAttribute("id")!;
        var bList = b.Find("ul").GetAttribute("id")!;
        Assert.NotEqual(aList, bList);
        Assert.StartsWith("text-size-picker-", aList);

        // Stable across re-render.
        a.Find("button").Click();
        Assert.Equal(aList, a.Find("ul").GetAttribute("id"));

        // Unique per option within an instance.
        var ids = new HashSet<string>();
        foreach (var option in a.FindAll("li"))
        {
            Assert.True(ids.Add(option.GetAttribute("id")!));
            Assert.StartsWith(aList.Replace("-list", "-option-"), option.GetAttribute("id")!);
        }
    }

    // =================================================================
    // Keyboard contract (WAI-ARIA APG listbox) — §7.9–§7.17
    // =================================================================

    // -----------------------------------------------------------------
    // §7.9 — ArrowDown, Enter and Space on the button all open the
    //        listbox with the selected option active.
    // -----------------------------------------------------------------
    [Fact]
    public async Task Section_7_9_ArrowDown_Enter_And_Space_Open_The_Listbox()
    {
        foreach (var key in new[] { "ArrowDown", "Enter", " " })
        {
            var cut = RenderDefault();
            await Task.Yield();

            Key(cut, "button", key);

            Assert.False(cut.Find("ul").HasAttribute("hidden"));
            Assert.Equal("true", cut.Find("button").GetAttribute("aria-expanded"));
            // Opens on the currently-selected option ("medium", index 1).
            Assert.Equal(cut.FindAll("li")[1].GetAttribute("id"),
                cut.Find("ul").GetAttribute("aria-activedescendant"));
        }
    }

    // -----------------------------------------------------------------
    // §7.10 — ArrowUp on the button opens with the LAST option active.
    // -----------------------------------------------------------------
    [Fact]
    public async Task Section_7_10_ArrowUp_Opens_With_Last_Option_Active()
    {
        var cut = RenderDefault();
        await Task.Yield();

        Key(cut, "button", "ArrowUp");

        Assert.False(cut.Find("ul").HasAttribute("hidden"));
        Assert.Equal(cut.FindAll("li")[Sizes.Length - 1].GetAttribute("id"),
            cut.Find("ul").GetAttribute("aria-activedescendant"));
    }

    // -----------------------------------------------------------------
    // §7.11 — ArrowDown / ArrowUp move the active option and clamp at
    //         both ends (the APG listbox pattern does not wrap).
    // -----------------------------------------------------------------
    [Fact]
    public async Task Section_7_11_Arrows_Move_The_Active_Option_And_Clamp()
    {
        var cut = RenderDefault();
        await Task.Yield();
        Key(cut, "button", "ArrowDown");

        string Active() => cut.Find("ul").GetAttribute("aria-activedescendant")!;
        string OptionId(int i) => cut.FindAll("li")[i].GetAttribute("id")!;

        // Opened on the selected option ("medium", index 1).
        Assert.Equal(OptionId(1), Active());

        Key(cut, "ul", "ArrowDown");
        Assert.Equal(OptionId(2), Active());

        // Clamp at the top.
        for (var i = 0; i < Sizes.Length + 2; i++) Key(cut, "ul", "ArrowUp");
        Assert.Equal(OptionId(0), Active());

        // Clamp at the bottom.
        for (var i = 0; i < Sizes.Length + 2; i++) Key(cut, "ul", "ArrowDown");
        Assert.Equal(OptionId(Sizes.Length - 1), Active());
    }

    // -----------------------------------------------------------------
    // §7.12 — Home and End jump to the first and last option.
    // -----------------------------------------------------------------
    [Fact]
    public async Task Section_7_12_Home_And_End_Jump_To_First_And_Last()
    {
        var cut = RenderDefault();
        await Task.Yield();
        Key(cut, "button", "ArrowDown");

        Key(cut, "ul", "End");
        Assert.Equal(cut.FindAll("li")[Sizes.Length - 1].GetAttribute("id"),
            cut.Find("ul").GetAttribute("aria-activedescendant"));

        Key(cut, "ul", "Home");
        Assert.Equal(cut.FindAll("li")[0].GetAttribute("id"),
            cut.Find("ul").GetAttribute("aria-activedescendant"));
    }

    // -----------------------------------------------------------------
    // §7.13 — Enter selects the active option, applies it, and closes the
    //         listbox.
    // -----------------------------------------------------------------
    [Fact]
    public async Task Section_7_13_Enter_Selects_The_Active_Option_Applies_And_Closes()
    {
        var changed = "";
        var cut = RenderComponent<TextSizePicker>(p => p
            .Add(x => x.Label, "Text size")
            .Add(x => x.Sizes, Sizes)
            .Add(x => x.OnChange, EventCallback.Factory.Create<string>(this, v => changed = v)));
        await Task.Yield();

        Key(cut, "button", "ArrowDown");
        Key(cut, "ul", "ArrowDown");
        Key(cut, "ul", "Enter");

        Assert.True(cut.Find("ul").HasAttribute("hidden"));
        Assert.Equal("false", cut.Find("button").GetAttribute("aria-expanded"));
        Assert.Equal("large", changed);
        Assert.True(SawEvalApplying("large"), "Expected the chosen size to be applied");
        Assert.Equal("large", cut.Find("input[type='hidden']").GetAttribute("value"));
    }

    // -----------------------------------------------------------------
    // §7.13 — Space behaves the same as Enter inside the listbox.
    // -----------------------------------------------------------------
    [Fact]
    public async Task Section_7_13_Space_Selects_The_Active_Option()
    {
        var cut = RenderDefault();
        await Task.Yield();

        Key(cut, "button", "ArrowDown");
        Key(cut, "ul", "End");
        Key(cut, "ul", " ");

        Assert.True(cut.Find("ul").HasAttribute("hidden"));
        Assert.Equal("x-large", cut.Find("input[type='hidden']").GetAttribute("value"));
    }

    // -----------------------------------------------------------------
    // §7.14 — Escape closes the listbox WITHOUT changing the value.
    // -----------------------------------------------------------------
    [Fact]
    public async Task Section_7_14_Escape_Closes_Without_Changing_The_Value()
    {
        var changed = "";
        var cut = RenderComponent<TextSizePicker>(p => p
            .Add(x => x.Label, "Text size")
            .Add(x => x.Sizes, Sizes)
            .Add(x => x.OnChange, EventCallback.Factory.Create<string>(this, v => changed = v)));
        await Task.Yield();
        changed = "";

        Key(cut, "button", "ArrowDown");
        Key(cut, "ul", "ArrowDown");
        Key(cut, "ul", "Escape");

        Assert.True(cut.Find("ul").HasAttribute("hidden"));
        Assert.Equal("", changed);
        Assert.Equal("medium", cut.Find("input[type='hidden']").GetAttribute("value"));
        Assert.False(SawEvalApplying("large"), "Escape must not apply the active option");
    }

    // -----------------------------------------------------------------
    // §7.15 — Printable characters run a typeahead over the labels.
    // -----------------------------------------------------------------
    [Fact]
    public async Task Section_7_15_Typeahead_Moves_The_Active_Option_By_Label_Prefix()
    {
        var cut = RenderDefault();
        await Task.Yield();
        Key(cut, "button", "ArrowDown");

        // Search runs forward from the active option and wraps once, so "s"
        // finds "Small" at index 0.
        Key(cut, "ul", "s");
        Assert.Equal(cut.FindAll("li")[0].GetAttribute("id"),
            cut.Find("ul").GetAttribute("aria-activedescendant"));

        // "x" within the same buffer window makes "sx", which matches
        // nothing, so the active option stays put.
        Key(cut, "ul", "x");
        Assert.Equal(cut.FindAll("li")[0].GetAttribute("id"),
            cut.Find("ul").GetAttribute("aria-activedescendant"));
    }

    // -----------------------------------------------------------------
    // §7.16 — Clicking an option selects it, applies it, and closes.
    // -----------------------------------------------------------------
    [Fact]
    public async Task Section_7_16_Clicking_An_Option_Selects_And_Closes()
    {
        var valueChanged = "";
        var cut = RenderComponent<TextSizePicker>(p => p
            .Add(x => x.Label, "Text size")
            .Add(x => x.Sizes, Sizes)
            .Add(x => x.ValueChanged,
                EventCallback.Factory.Create<string>(this, v => valueChanged = v)));
        await Task.Yield();

        cut.Find("button").Click();
        cut.FindAll("li")[3].Click();

        Assert.True(cut.Find("ul").HasAttribute("hidden"));
        Assert.Equal("x-large", valueChanged);
        Assert.True(SawEvalApplying("x-large"), "Expected the clicked size to be applied");
        Assert.Equal("X Large", cut.Find("li[aria-selected='true']").TextContent.Trim());
    }

    // -----------------------------------------------------------------
    // §7.17 — Focus leaving the root closes the listbox without changing
    //         the value and without pulling focus back.
    // -----------------------------------------------------------------
    [Fact]
    public async Task Section_7_17_Focus_Leaving_The_Root_Closes_The_Listbox()
    {
        var cut = RenderDefault();
        await Task.Yield();

        cut.Find("button").Click();
        Assert.False(cut.Find("ul").HasAttribute("hidden"));

        // A browser emits one focusout for the component's own button →
        // listbox move; that one is swallowed. The next one is a real
        // departure and closes the control.
        cut.Find("div.text-size-picker").FocusOut();
        cut.Find("div.text-size-picker").FocusOut();

        Assert.True(cut.Find("ul").HasAttribute("hidden"));
        Assert.Equal("medium", cut.Find("input[type='hidden']").GetAttribute("value"));
    }

    // =================================================================
    // Application and lifecycle — §7.18–§7.22
    // =================================================================

    // -----------------------------------------------------------------
    // §7.18 — Resolved initial value is "medium" when present, else
    //         Sizes[0], and ValueChanged fires with that value.
    // -----------------------------------------------------------------
    [Fact]
    public async Task Section_7_18_Initial_Value_Prefers_Medium_Then_First()
    {
        var observed = "";
        RenderComponent<TextSizePicker>(p => p
            .Add(x => x.Label, "Text size")
            .Add(x => x.Sizes, Sizes)
            .Add(x => x.ValueChanged, EventCallback.Factory.Create<string>(this, v => observed = v)));
        await Task.Yield();
        Assert.Equal("medium", observed);

        var observed2 = "";
        RenderComponent<TextSizePicker>(p => p
            .Add(x => x.Label, "Text size")
            .Add(x => x.Sizes, new[] { "compact", "cozy" })
            .Add(x => x.ValueChanged, EventCallback.Factory.Create<string>(this, v => observed2 = v)));
        await Task.Yield();
        Assert.Equal("compact", observed2);
    }

    // -----------------------------------------------------------------
    // §7.19 — The interop eval call sets data-text-size on the document
    //         root after first render.
    // -----------------------------------------------------------------
    [Fact]
    public async Task Section_7_19_Applies_DataTextSize_On_First_Render()
    {
        RenderDefault();
        await Task.Yield();

        Assert.True(SawEvalApplying("medium"),
            "Expected an interop eval call setting data-text-size=medium");

        // The pure builder embeds the slug the same way.
        Assert.Contains("setAttribute('data-text-size',\"large\")",
            TextSizePicker.BuildApplyScript("large", storageKey: null));
    }

    // -----------------------------------------------------------------
    // §7.20 — When StorageKey is set, the apply script carries the key.
    // -----------------------------------------------------------------
    [Fact]
    public async Task Section_7_20_StorageKey_Embedded_In_Apply_Script()
    {
        var with = TextSizePicker.BuildApplyScript("large", storageKey: "lily-text-size");
        Assert.Contains("localStorage.setItem(\"lily-text-size\",\"large\")", with);

        var without = TextSizePicker.BuildApplyScript("large", storageKey: null);
        Assert.DoesNotContain("localStorage.setItem", without);

        RenderComponent<TextSizePicker>(p => p
            .Add(x => x.Label, "Text size")
            .Add(x => x.Sizes, Sizes)
            .Add(x => x.StorageKey, "lily-text-size"));
        await Task.Yield();

        Assert.True(SawEvalContaining("\"lily-text-size\""),
            "Expected an eval interop call carrying the storage key");
    }

    // -----------------------------------------------------------------
    // §7.21 — A supplied non-empty Value wins over storage and defaults.
    // -----------------------------------------------------------------
    [Fact]
    public async Task Section_7_21_Explicit_Value_Wins()
    {
        RenderComponent<TextSizePicker>(p => p
            .Add(x => x.Label, "Text size")
            .Add(x => x.Sizes, Sizes)
            .Add(x => x.Value, "large")
            .Add(x => x.DefaultValue, "small")
            .Add(x => x.StorageKey, "lily-text-size"));
        await Task.Yield();

        Assert.True(SawEvalApplying("large"), "Expected Value='large' to be applied");
        Assert.False(SawEvalApplying("small"));
    }

    // -----------------------------------------------------------------
    // §7.22 — SizeName is the ONE public title-casing rule; the instance
    //         label resolution delegates to it, and SizeLabels still
    //         overrides it.
    // -----------------------------------------------------------------
    [Fact]
    public void Section_7_22_SizeName_Is_The_Shared_Public_Label_Rule()
    {
        Assert.Equal("X Large", TextSizePicker.SizeName("x-large"));
        Assert.Equal("Medium", TextSizePicker.SizeName("medium"));
        Assert.Equal("Extra Extra Large", TextSizePicker.SizeName("extra-extra-large"));
        Assert.Equal("", TextSizePicker.SizeName(""));

        // The rendered option labels come from the very same function, so
        // consumers can reproduce them without duplicating the rule.
        var cut = RenderComponent<TextSizePicker>(p => p
            .Add(x => x.Label, "Text size")
            .Add(x => x.Sizes, new[] { "x-large", "medium" }));

        var labels = cut.FindAll("li.text-size-picker-option")
            .Select(li => li.TextContent.Trim()).ToList();
        Assert.Equal(
            new[] { TextSizePicker.SizeName("x-large"), TextSizePicker.SizeName("medium") },
            labels);
    }

    // =================================================================
    // Spread and custom rendering — §7.23–§7.24
    // =================================================================

    // -----------------------------------------------------------------
    // §7.23 — Extra attributes spread onto the root <div>.
    // -----------------------------------------------------------------
    [Fact]
    public void Section_7_23_AdditionalAttributes_Spread_Onto_The_Root()
    {
        var cut = RenderComponent<TextSizePicker>(p => p
            .Add(x => x.Label, "Text size")
            .Add(x => x.Sizes, Sizes)
            .AddUnmatched("data-testid", "ts"));

        Assert.Equal("ts", cut.Find("div.text-size-picker").GetAttribute("data-testid"));
    }

    // -----------------------------------------------------------------
    // §7.24 — ChildContent replaces the glyph inside the button and
    //         receives Value / Open / LabelFor.
    // -----------------------------------------------------------------
    [Fact]
    public async Task Section_7_24_ChildContent_Replaces_The_Glyph_And_Receives_Context()
    {
        RenderFragment<TextSizePickerContext> custom = ctx => builder =>
        {
            builder.OpenElement(0, "span");
            builder.AddAttribute(1, "data-testid", "custom");
            builder.AddAttribute(2, "data-open", ctx.Open.ToString());
            builder.AddAttribute(3, "data-label", ctx.LabelFor(ctx.Value));
            builder.AddContent(4, ctx.Value);
            builder.CloseElement();
        };

        var cut = RenderComponent<TextSizePicker>(p => p
            .Add(x => x.Label, "Text size")
            .Add(x => x.Sizes, Sizes)
            .Add(x => x.ChildContent, custom));
        await Task.Yield();

        // The default glyph is replaced, not supplemented.
        Assert.Empty(cut.FindAll(".text-size-picker-icon"));

        var custom_ = cut.Find("[data-testid='custom']");
        Assert.Contains("text-size-picker-button",
            custom_.ParentElement?.GetAttribute("class") ?? "");
        Assert.Equal("False", custom_.GetAttribute("data-open"));
        Assert.Equal("Medium", custom_.GetAttribute("data-label"));
        Assert.Equal("medium", custom_.TextContent.Trim());

        cut.Find("button").Click();
        Assert.Equal("True", cut.Find("[data-testid='custom']").GetAttribute("data-open"));
    }

    // =================================================================
    // Accessibility hardening — §7.25–§7.28, mirroring the canonical
    // Svelte clauses §7.14–§7.17 (this port's §7 list was already
    // numbered through §7.24, so the new clauses continue from §7.25).
    //
    // Focus assertions read the FocusAsync interop invocations against
    // the component's internal reference-id seams (InternalsVisibleTo),
    // the same technique the DateTimePicker suite uses — bUnit has no
    // live focus model. bUnit also cannot run the browser's REAL
    // default-Tab move, so the Tab clause asserts the observable state
    // and the comment explains the platform difference.
    // =================================================================

    /// <summary>The interop identifier ElementReference.FocusAsync() uses.</summary>
    private const string FocusIdentifier = "Blazor._internal.domWrapper.focus";

    /// <summary>The ElementReference ids the component asked the browser to
    /// focus, oldest first.</summary>
    private IReadOnlyList<string> FocusedRefIds()
        => JSInterop.Invocations
            .Where(i => i.Identifier == FocusIdentifier)
            .Select(i => ((ElementReference)i.Arguments[0]!).Id)
            .ToList();

    // -----------------------------------------------------------------
    // §7.25 — Tab from the open list closes it and leaves focus where
    //         the browser's default Tab put it (canonical §7.14). The
    //         canonical Svelte fix refocuses the button BEFORE hiding
    //         the list because Svelte hides synchronously, ahead of the
    //         browser's default Tab; Blazor's async handler always runs
    //         AFTER the default Tab has proceeded from the still-visible
    //         list — the picker's own position — so the component must
    //         NOT issue a focus call, which would yank the user back to
    //         the trigger they just left. Both ports end with focus on
    //         the tab stop after the picker.
    // -----------------------------------------------------------------
    [Fact]
    public async Task Section_7_25_Tab_Closes_And_Does_Not_Fight_The_Default_Tab()
    {
        var cut = RenderDefault();
        await Task.Yield();

        cut.Find("button").Click();
        // Opening moved focus to the listbox.
        Assert.Equal(cut.Instance.ListReferenceId, FocusedRefIds()[^1]);
        var beforeTab = FocusedRefIds().Count;

        Key(cut, "ul", "Tab");

        Assert.True(cut.Find("ul").HasAttribute("hidden"));
        Assert.Equal("false", cut.Find("button").GetAttribute("aria-expanded"));
        // No focus interop was issued on Tab: focus stays where the
        // browser's uncancelled default Tab moved it.
        Assert.Equal(beforeTab, FocusedRefIds().Count);
        Assert.DoesNotContain(cut.Instance.ButtonReferenceId, FocusedRefIds());
    }

    // -----------------------------------------------------------------
    // §7.26 — A repeated typeahead character cycles through its matches
    //         (canonical §7.15).
    // -----------------------------------------------------------------
    [Fact]
    public async Task Section_7_26_A_Repeated_Typeahead_Character_Cycles_Through_Its_Matches()
    {
        var cut = RenderComponent<TextSizePicker>(p => p
            .Add(x => x.Label, "Text size")
            .Add(x => x.Sizes, new[] { "d1", "d2", "d3", "m" })
            .Add(x => x.SizeLabels,
                (IReadOnlyDictionary<string, string>)new Dictionary<string, string>
                {
                    ["d1"] = "Dark",
                    ["d2"] = "Dim",
                    ["d3"] = "Dracula",
                    ["m"] = "Light",
                })
            .Add(x => x.DefaultValue, "m"));
        await Task.Yield();
        cut.Find("button").Click();

        string Active() => cut.Find("[data-active]").TextContent.Trim();

        // The cursor opens on the selected "m" (label "Light").
        Key(cut, "ul", "d");
        Assert.Equal("Dark", Active());
        Key(cut, "ul", "d");
        Assert.Equal("Dim", Active());
        Key(cut, "ul", "d");
        Assert.Equal("Dracula", Active());

        // And a buffer of DIFFERING characters refines from the active
        // option instead of cycling (canonical §7.15's second half).
        var cut2 = RenderComponent<TextSizePicker>(p => p
            .Add(x => x.Label, "Text size")
            .Add(x => x.Sizes, new[] { "d1", "d2", "d3", "m" })
            .Add(x => x.SizeLabels,
                (IReadOnlyDictionary<string, string>)new Dictionary<string, string>
                {
                    ["d1"] = "Dark",
                    ["d2"] = "Dim",
                    ["d3"] = "Dracula",
                    ["m"] = "Light",
                })
            .Add(x => x.DefaultValue, "m"));
        await Task.Yield();
        cut2.Find("button").Click();
        Key(cut2, "ul", "d");
        Key(cut2, "ul", "r");
        Assert.Equal("Dracula", cut2.Find("[data-active]").TextContent.Trim());
    }

    // -----------------------------------------------------------------
    // §7.27 — PageUp / PageDown move the cursor by ten, clamped
    //         (canonical §7.16).
    // -----------------------------------------------------------------
    [Fact]
    public async Task Section_7_27_PageUp_And_PageDown_Move_The_Cursor_By_Ten_Clamped()
    {
        var many = Enumerable.Range(0, 25).Select(i => $"s{i:D2}").ToArray();
        var cut = RenderComponent<TextSizePicker>(p => p
            .Add(x => x.Label, "Text size")
            .Add(x => x.Sizes, many));
        await Task.Yield();
        cut.Find("button").Click();

        string Active() => cut.Find("[data-active]").TextContent.Trim();

        Key(cut, "ul", "PageDown");
        Assert.Equal("S10", Active());
        Key(cut, "ul", "PageDown");
        Assert.Equal("S20", Active());
        Key(cut, "ul", "PageDown");
        Assert.Equal("S24", Active());
        Key(cut, "ul", "PageUp");
        Assert.Equal("S14", Active());
    }

    // -----------------------------------------------------------------
    // §7.28 — An empty list opens without aria-activedescendant
    //         (canonical §7.17).
    // -----------------------------------------------------------------
    [Fact]
    public async Task Section_7_28_An_Empty_List_Opens_Without_AriaActivedescendant()
    {
        var cut = RenderComponent<TextSizePicker>(p => p
            .Add(x => x.Label, "Text size")
            .Add(x => x.Sizes, System.Array.Empty<string>()));
        await Task.Yield();

        cut.Find("button").Click();

        Assert.False(cut.Find("ul").HasAttribute("hidden"));
        Assert.Null(cut.Find("ul").GetAttribute("aria-activedescendant"));
    }

    /// <summary>True when some eval interop call applied the given slug.</summary>
    private bool SawEvalApplying(string slug)
        => SawEvalContaining($"setAttribute('data-text-size',\"{slug}\")");

    /// <summary>True when some eval interop call carried the given substring.</summary>
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
}
