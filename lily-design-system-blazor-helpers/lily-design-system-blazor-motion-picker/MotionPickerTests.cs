// MotionPicker tests — one [Fact] per spec/index.md §7 acceptance criterion.

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

public class MotionPickerTests : TestContext
{
    private static readonly string[] Motions = { "no-preference", "reduce" };

    public MotionPickerTests()
    {
        // bUnit JSInterop defaults to Strict; relax so the eval call and the
        // FocusAsync interop do not throw during render. Tests inspect
        // invocations.
        JSInterop.Mode = JSRuntimeMode.Loose;
        JSInterop.SetupVoid("eval", _ => true).SetVoidResult();
        JSInterop.Setup<string?>("eval", _ => true).SetResult(null);
        // Default: OS reports no reduced-motion preference. Individual
        // tests override this to exercise the OS-preference branch.
        JSInterop.Setup<bool>("eval", _ => true).SetResult(false);
    }

    private IRenderedComponent<MotionPicker> RenderDefault()
        => RenderComponent<MotionPicker>(p => p
            .Add(x => x.Label, "Motion")
            .Add(x => x.Motions, Motions));

    private static void Key(IRenderedComponent<MotionPicker> cut, string selector, string key)
        => cut.Find(selector).KeyDown(new KeyboardEventArgs { Key = key });

    /// <summary>Reconfigure the mocked (prefers-reduced-motion: reduce) answer.</summary>
    private void MockReducedMotion(bool matches)
        => JSInterop.Setup<bool>("eval", _ => true).SetResult(matches);

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

        var root = cut.Find("div.motion-picker");
        Assert.NotNull(root);
        Assert.Empty(cut.FindAll("select"));

        var button = cut.Find("button.motion-picker-button");
        Assert.Equal("button", button.GetAttribute("type"));
        Assert.Equal("listbox", button.GetAttribute("aria-haspopup"));
        Assert.Equal("false", button.GetAttribute("aria-expanded"));

        var listId = button.GetAttribute("aria-controls");
        Assert.False(string.IsNullOrEmpty(listId));

        var list = cut.Find("ul.motion-picker-list");
        Assert.Equal(listId, list.GetAttribute("id"));
        Assert.Equal("listbox", list.GetAttribute("role"));
        Assert.Equal("-1", list.GetAttribute("tabindex"));
    }

    // -----------------------------------------------------------------
    // §7.2 — The button renders the pause-sign glyph, hidden from
    //        assistive technology.
    // -----------------------------------------------------------------
    [Fact]
    public void Section_7_2_Button_Renders_Glyph_Hidden_From_Assistive_Tech()
    {
        var cut = RenderDefault();

        var icon = cut.Find(".motion-picker-icon");
        // U+23F8 PAUSE SIGN + U+FE0E (text presentation).
        Assert.Equal("\u23F8\uFE0E", icon.TextContent.Trim());
        Assert.Equal("true", icon.GetAttribute("aria-hidden"));
        Assert.Equal("\u23F8\uFE0E", MotionPicker.PauseSign);
    }

    // -----------------------------------------------------------------
    // §7.3 — aria-label names both the button and the listbox.
    // -----------------------------------------------------------------
    [Fact]
    public void Section_7_3_AriaLabel_Names_Button_And_Listbox()
    {
        var cut = RenderComponent<MotionPicker>(p => p
            .Add(x => x.Label, "Choose motion")
            .Add(x => x.Motions, Motions));

        Assert.Equal("Choose motion", cut.Find("button").GetAttribute("aria-label"));
        Assert.Equal("Choose motion", cut.Find("ul").GetAttribute("aria-label"));
    }

    // -----------------------------------------------------------------
    // §7.4 — One option per motion; the hidden input carries the
    //        supplied Name and the resolved Value.
    // -----------------------------------------------------------------
    [Fact]
    public async Task Section_7_4_One_Option_Per_Motion_Hidden_Input_Carries_Name_And_Value()
    {
        var cut = RenderComponent<MotionPicker>(p => p
            .Add(x => x.Label, "Motion")
            .Add(x => x.Motions, Motions)
            .Add(x => x.Name, "reduced-motion"));
        await Task.Yield();

        var options = cut.FindAll("li.motion-picker-option");
        Assert.Equal(Motions.Length, options.Count);
        foreach (var option in options)
        {
            Assert.Equal("option", option.GetAttribute("role"));
        }

        var hidden = cut.Find("input[type='hidden']");
        Assert.Equal("reduced-motion", hidden.GetAttribute("name"));
        Assert.Equal("no-preference", hidden.GetAttribute("value"));
    }

    // -----------------------------------------------------------------
    // §7.4b — The default Name is "motion".
    // -----------------------------------------------------------------
    [Fact]
    public void Section_7_4_Default_Name_Is_Motion()
    {
        var cut = RenderDefault();

        Assert.Equal("motion", cut.Find("input[type='hidden']").GetAttribute("name"));
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
    // §7.6 — The active motion is the single aria-selected option, and
    //        the open listbox points aria-activedescendant at the
    //        active one.
    // -----------------------------------------------------------------
    [Fact]
    public async Task Section_7_6_Active_Motion_Is_The_AriaSelected_Option()
    {
        var cut = RenderDefault();
        await Task.Yield();

        // Closed: no aria-activedescendant.
        Assert.Null(cut.Find("ul").GetAttribute("aria-activedescendant"));

        cut.Find("button").Click();

        var selected = cut.FindAll("li[aria-selected='true']");
        Assert.Single(selected);
        Assert.Equal("No Preference", selected[0].TextContent.Trim());

        // Opening puts the active descendant on the selected option, which
        // also carries the data-active styling hook.
        var list = cut.Find("ul");
        Assert.Equal(cut.FindAll("li")[0].GetAttribute("id"),
            list.GetAttribute("aria-activedescendant"));
        Assert.True(cut.FindAll("li")[0].HasAttribute("data-active"));
    }

    // -----------------------------------------------------------------
    // §7.7 — Default labels title-case the slug; MotionLabels overrides
    //        the default rendering.
    // -----------------------------------------------------------------
    [Fact]
    public void Section_7_7_Default_Labels_TitleCase_And_Overrideable()
    {
        var cut = RenderDefault();

        var labels = cut.FindAll("li.motion-picker-option")
            .Select(li => li.TextContent.Trim()).ToList();
        Assert.Equal(new[] { "No Preference", "Reduce" }, labels);

        var cut2 = RenderComponent<MotionPicker>(p => p
            .Add(x => x.Label, "Motion")
            .Add(x => x.Motions, new[] { "no-preference", "reduce" })
            .Add(x => x.MotionLabels,
                (IReadOnlyDictionary<string, string>)new Dictionary<string, string>
                {
                    ["no-preference"] = "Full motion",
                    ["reduce"] = "Reduced motion",
                }));

        var labels2 = cut2.FindAll("li.motion-picker-option")
            .Select(li => li.TextContent.Trim()).ToList();
        Assert.Equal(new[] { "Full motion", "Reduced motion" }, labels2);
    }

    // -----------------------------------------------------------------
    // §7.8 — Option and list ids are stable within an instance and
    //        unique across instances (monotonic counter, not
    //        randomness).
    // -----------------------------------------------------------------
    [Fact]
    public void Section_7_8_Option_Ids_Are_Stable_And_Unique_Per_Instance()
    {
        var a = RenderDefault();
        var b = RenderDefault();

        var aList = a.Find("ul").GetAttribute("id")!;
        var bList = b.Find("ul").GetAttribute("id")!;
        Assert.NotEqual(aList, bList);
        Assert.StartsWith("motion-picker-", aList);

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
            // Opens on the currently-selected option ("no-preference", index 0).
            Assert.Equal(cut.FindAll("li")[0].GetAttribute("id"),
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
        Assert.Equal(cut.FindAll("li")[Motions.Length - 1].GetAttribute("id"),
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

        // Opened on the selected option ("no-preference", index 0).
        Assert.Equal(OptionId(0), Active());

        Key(cut, "ul", "ArrowDown");
        Assert.Equal(OptionId(1), Active());

        // Clamp at the bottom.
        for (var i = 0; i < Motions.Length + 2; i++) Key(cut, "ul", "ArrowDown");
        Assert.Equal(OptionId(Motions.Length - 1), Active());

        // Clamp at the top.
        for (var i = 0; i < Motions.Length + 2; i++) Key(cut, "ul", "ArrowUp");
        Assert.Equal(OptionId(0), Active());
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
        Assert.Equal(cut.FindAll("li")[Motions.Length - 1].GetAttribute("id"),
            cut.Find("ul").GetAttribute("aria-activedescendant"));

        Key(cut, "ul", "Home");
        Assert.Equal(cut.FindAll("li")[0].GetAttribute("id"),
            cut.Find("ul").GetAttribute("aria-activedescendant"));
    }

    // -----------------------------------------------------------------
    // §7.13 — Enter selects the active option, applies it, and closes
    //         the listbox.
    // -----------------------------------------------------------------
    [Fact]
    public async Task Section_7_13_Enter_Selects_The_Active_Option_Applies_And_Closes()
    {
        var changed = "";
        var cut = RenderComponent<MotionPicker>(p => p
            .Add(x => x.Label, "Motion")
            .Add(x => x.Motions, Motions)
            .Add(x => x.OnChange, EventCallback.Factory.Create<string>(this, v => changed = v)));
        await Task.Yield();

        Key(cut, "button", "ArrowDown");
        Key(cut, "ul", "ArrowDown");
        Key(cut, "ul", "Enter");

        Assert.True(cut.Find("ul").HasAttribute("hidden"));
        Assert.Equal("false", cut.Find("button").GetAttribute("aria-expanded"));
        Assert.Equal("reduce", changed);
        Assert.True(SawEvalApplying("reduce"), "Expected the chosen motion to be applied");
        Assert.Equal("reduce", cut.Find("input[type='hidden']").GetAttribute("value"));
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
        Assert.Equal("reduce", cut.Find("input[type='hidden']").GetAttribute("value"));
    }

    // -----------------------------------------------------------------
    // §7.14 — Escape closes the listbox WITHOUT changing the value.
    // -----------------------------------------------------------------
    [Fact]
    public async Task Section_7_14_Escape_Closes_Without_Changing_The_Value()
    {
        var changed = "";
        var cut = RenderComponent<MotionPicker>(p => p
            .Add(x => x.Label, "Motion")
            .Add(x => x.Motions, Motions)
            .Add(x => x.OnChange, EventCallback.Factory.Create<string>(this, v => changed = v)));
        await Task.Yield();
        changed = "";

        Key(cut, "button", "ArrowDown");
        Key(cut, "ul", "ArrowDown");
        Key(cut, "ul", "Escape");

        Assert.True(cut.Find("ul").HasAttribute("hidden"));
        Assert.Equal("", changed);
        Assert.Equal("no-preference", cut.Find("input[type='hidden']").GetAttribute("value"));
        Assert.False(SawEvalApplying("reduce"), "Escape must not apply the active option");
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

        Key(cut, "ul", "r");
        Assert.Equal(cut.FindAll("li")[1].GetAttribute("id"),
            cut.Find("ul").GetAttribute("aria-activedescendant"));
    }

    // -----------------------------------------------------------------
    // §7.16 — Clicking an option selects it, applies it, and closes.
    // -----------------------------------------------------------------
    [Fact]
    public async Task Section_7_16_Clicking_An_Option_Selects_And_Closes()
    {
        var valueChanged = "";
        var cut = RenderComponent<MotionPicker>(p => p
            .Add(x => x.Label, "Motion")
            .Add(x => x.Motions, Motions)
            .Add(x => x.ValueChanged,
                EventCallback.Factory.Create<string>(this, v => valueChanged = v)));
        await Task.Yield();

        cut.Find("button").Click();
        cut.FindAll("li")[1].Click();

        Assert.True(cut.Find("ul").HasAttribute("hidden"));
        // A pointer selection closes, exactly as Enter does. The
        // asymmetry would be invisible to a consumer reading the DOM: a
        // stale aria-expanded over a hidden list makes every later click
        // miss the options.
        Assert.Equal("false", cut.Find("button").GetAttribute("aria-expanded"));
        Assert.Equal("reduce", valueChanged);
        Assert.True(SawEvalApplying("reduce"), "Expected the clicked motion to be applied");
        Assert.Equal("Reduce", cut.Find("li[aria-selected='true']").TextContent.Trim());
    }

    // -----------------------------------------------------------------
    // §7.17 — Focus leaving the root closes the listbox without
    //         changing the value and without pulling focus back.
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
        cut.Find("div.motion-picker").FocusOut();
        cut.Find("div.motion-picker").FocusOut();

        Assert.True(cut.Find("ul").HasAttribute("hidden"));
        Assert.Equal("no-preference", cut.Find("input[type='hidden']").GetAttribute("value"));
    }

    // =================================================================
    // Application and lifecycle — §7.18–§7.22
    // =================================================================

    // -----------------------------------------------------------------
    // §7.18 — Resolved initial value defers to the OS's
    //         (prefers-reduced-motion: reduce) preference — "reduce"
    //         when it matches, else "no-preference" — falling back to
    //         Motions[0] when neither slug is offered.
    // -----------------------------------------------------------------
    [Fact]
    public async Task Section_7_18_Initial_Value_Defers_To_OS_Preference()
    {
        MockReducedMotion(false);
        var observed = "";
        RenderComponent<MotionPicker>(p => p
            .Add(x => x.Label, "Motion")
            .Add(x => x.Motions, Motions)
            .Add(x => x.ValueChanged, EventCallback.Factory.Create<string>(this, v => observed = v)));
        await Task.Yield();
        Assert.Equal("no-preference", observed);

        MockReducedMotion(true);
        var observed2 = "";
        RenderComponent<MotionPicker>(p => p
            .Add(x => x.Label, "Motion")
            .Add(x => x.Motions, Motions)
            .Add(x => x.ValueChanged, EventCallback.Factory.Create<string>(this, v => observed2 = v)));
        await Task.Yield();
        Assert.Equal("reduce", observed2);

        MockReducedMotion(true);
        var observed3 = "";
        RenderComponent<MotionPicker>(p => p
            .Add(x => x.Label, "Motion")
            .Add(x => x.Motions, new[] { "standard", "minimal" })
            .Add(x => x.ValueChanged, EventCallback.Factory.Create<string>(this, v => observed3 = v)));
        await Task.Yield();
        Assert.Equal("standard", observed3);
    }

    // -----------------------------------------------------------------
    // §7.19 — The interop eval call sets data-motion on the document
    //         root after first render.
    // -----------------------------------------------------------------
    [Fact]
    public async Task Section_7_19_Applies_DataMotion_On_First_Render()
    {
        RenderDefault();
        await Task.Yield();

        Assert.True(SawEvalApplying("no-preference"),
            "Expected an interop eval call setting data-motion=no-preference");

        // The pure builder embeds the slug the same way.
        Assert.Contains("setAttribute('data-motion',\"reduce\")",
            MotionPicker.BuildApplyScript("reduce", storageKey: null));
    }

    // -----------------------------------------------------------------
    // §7.20 — When StorageKey is set, the apply script carries the key.
    // -----------------------------------------------------------------
    [Fact]
    public async Task Section_7_20_StorageKey_Embedded_In_Apply_Script()
    {
        var with = MotionPicker.BuildApplyScript("reduce", storageKey: "lily-motion");
        Assert.Contains("localStorage.setItem(\"lily-motion\",\"reduce\")", with);

        var without = MotionPicker.BuildApplyScript("reduce", storageKey: null);
        Assert.DoesNotContain("localStorage.setItem", without);

        RenderComponent<MotionPicker>(p => p
            .Add(x => x.Label, "Motion")
            .Add(x => x.Motions, Motions)
            .Add(x => x.StorageKey, "lily-motion"));
        await Task.Yield();

        Assert.True(SawEvalContaining("\"lily-motion\""),
            "Expected an eval interop call carrying the storage key");
    }

    // -----------------------------------------------------------------
    // §7.21 — A supplied non-empty Value wins over storage, OS
    //         preference, and defaults.
    // -----------------------------------------------------------------
    [Fact]
    public async Task Section_7_21_Explicit_Value_Wins()
    {
        MockReducedMotion(true);
        RenderComponent<MotionPicker>(p => p
            .Add(x => x.Label, "Motion")
            .Add(x => x.Motions, Motions)
            .Add(x => x.Value, "no-preference")
            .Add(x => x.DefaultValue, "reduce")
            .Add(x => x.StorageKey, "lily-motion"));
        await Task.Yield();

        Assert.True(SawEvalApplying("no-preference"), "Expected Value='no-preference' to be applied");
        Assert.False(SawEvalApplying("reduce"));
    }

    // -----------------------------------------------------------------
    // §7.22 — MotionName is the ONE public title-casing rule; the
    //         instance label resolution delegates to it, and
    //         MotionLabels still overrides it.
    // -----------------------------------------------------------------
    [Fact]
    public void Section_7_22_MotionName_Is_The_Shared_Public_Label_Rule()
    {
        Assert.Equal("No Preference", MotionPicker.MotionName("no-preference"));
        Assert.Equal("Reduce", MotionPicker.MotionName("reduce"));
        Assert.Equal("Extra Reduced Motion", MotionPicker.MotionName("extra-reduced-motion"));
        Assert.Equal("", MotionPicker.MotionName(""));

        // The rendered option labels come from the very same function, so
        // consumers can reproduce them without duplicating the rule.
        var cut = RenderComponent<MotionPicker>(p => p
            .Add(x => x.Label, "Motion")
            .Add(x => x.Motions, new[] { "reduce", "no-preference" }));

        var labels = cut.FindAll("li.motion-picker-option")
            .Select(li => li.TextContent.Trim()).ToList();
        Assert.Equal(
            new[] { MotionPicker.MotionName("reduce"), MotionPicker.MotionName("no-preference") },
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
        var cut = RenderComponent<MotionPicker>(p => p
            .Add(x => x.Label, "Motion")
            .Add(x => x.Motions, Motions)
            .AddUnmatched("data-testid", "mp"));

        Assert.Equal("mp", cut.Find("div.motion-picker").GetAttribute("data-testid"));
    }

    // -----------------------------------------------------------------
    // §7.24 — ChildContent replaces the glyph inside the button and
    //         receives Value / Open / LabelFor.
    // -----------------------------------------------------------------
    [Fact]
    public async Task Section_7_24_ChildContent_Replaces_The_Glyph_And_Receives_Context()
    {
        RenderFragment<MotionPickerContext> custom = ctx => builder =>
        {
            builder.OpenElement(0, "span");
            builder.AddAttribute(1, "data-testid", "custom");
            builder.AddAttribute(2, "data-open", ctx.Open.ToString());
            builder.AddAttribute(3, "data-label", ctx.LabelFor(ctx.Value));
            builder.AddContent(4, ctx.Value);
            builder.CloseElement();
        };

        var cut = RenderComponent<MotionPicker>(p => p
            .Add(x => x.Label, "Motion")
            .Add(x => x.Motions, Motions)
            .Add(x => x.ChildContent, custom));
        await Task.Yield();

        // The default glyph is replaced, not supplemented.
        Assert.Empty(cut.FindAll(".motion-picker-icon"));

        var custom_ = cut.Find("[data-testid='custom']");
        Assert.Contains("motion-picker-button",
            custom_.ParentElement?.GetAttribute("class") ?? "");
        Assert.Equal("False", custom_.GetAttribute("data-open"));
        Assert.Equal("No Preference", custom_.GetAttribute("data-label"));
        Assert.Equal("no-preference", custom_.TextContent.Trim());

        cut.Find("button").Click();
        Assert.Equal("True", cut.Find("[data-testid='custom']").GetAttribute("data-open"));
    }

    // =================================================================
    // Accessibility hardening — §7.25–§7.28, mirroring the canonical
    // Svelte clauses §7.14–§7.17.
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
    //         the browser's default Tab put it (canonical §7.14).
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
        var cut = RenderComponent<MotionPicker>(p => p
            .Add(x => x.Label, "Motion")
            .Add(x => x.Motions, new[] { "r1", "r2", "r3", "m" })
            .Add(x => x.MotionLabels,
                (IReadOnlyDictionary<string, string>)new Dictionary<string, string>
                {
                    ["r1"] = "Reduce a lot",
                    ["r2"] = "Reduce more",
                    ["r3"] = "Reduce most",
                    ["m"] = "Minimal",
                })
            .Add(x => x.DefaultValue, "m"));
        await Task.Yield();
        cut.Find("button").Click();

        string Active() => cut.Find("[data-active]").TextContent.Trim();

        Key(cut, "ul", "r");
        Assert.Equal("Reduce a lot", Active());
        Key(cut, "ul", "r");
        Assert.Equal("Reduce more", Active());
        Key(cut, "ul", "r");
        Assert.Equal("Reduce most", Active());

        // And a buffer of DIFFERING characters refines from the active
        // option instead of cycling (canonical §7.15's second half).
        var cut2 = RenderComponent<MotionPicker>(p => p
            .Add(x => x.Label, "Motion")
            .Add(x => x.Motions, new[] { "r1", "r2", "r3", "m" })
            .Add(x => x.MotionLabels,
                (IReadOnlyDictionary<string, string>)new Dictionary<string, string>
                {
                    ["r1"] = "Reduce a lot",
                    ["r2"] = "Reduce more",
                    ["r3"] = "Reduce most",
                    ["m"] = "Minimal",
                })
            .Add(x => x.DefaultValue, "m"));
        await Task.Yield();
        cut2.Find("button").Click();
        Key(cut2, "ul", "r");
        Key(cut2, "ul", "e");
        Assert.Equal("Reduce a lot", cut2.Find("[data-active]").TextContent.Trim());
    }

    // -----------------------------------------------------------------
    // §7.27 — PageUp / PageDown move the cursor by ten, clamped
    //         (canonical §7.16).
    // -----------------------------------------------------------------
    [Fact]
    public async Task Section_7_27_PageUp_And_PageDown_Move_The_Cursor_By_Ten_Clamped()
    {
        var many = Enumerable.Range(0, 25).Select(i => $"s{i:D2}").ToArray();
        var cut = RenderComponent<MotionPicker>(p => p
            .Add(x => x.Label, "Motion")
            .Add(x => x.Motions, many));
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
        var cut = RenderComponent<MotionPicker>(p => p
            .Add(x => x.Label, "Motion")
            .Add(x => x.Motions, System.Array.Empty<string>()));
        await Task.Yield();

        cut.Find("button").Click();

        Assert.False(cut.Find("ul").HasAttribute("hidden"));
        Assert.Null(cut.Find("ul").GetAttribute("aria-activedescendant"));
    }

    // -----------------------------------------------------------------
    // §7.29 — PrefersReducedMotionAsync reads the OS media query and
    //         is prerender-safe (false on interop failure).
    // -----------------------------------------------------------------
    [Fact]
    public async Task Section_7_29_PrefersReducedMotionAsync_Reads_The_OS_Preference()
    {
        var cut = RenderDefault();
        await Task.Yield();

        MockReducedMotion(true);
        Assert.True(await cut.Instance.PrefersReducedMotionAsync());

        MockReducedMotion(false);
        Assert.False(await cut.Instance.PrefersReducedMotionAsync());
    }

    /// <summary>True when some eval interop call applied the given slug.</summary>
    private bool SawEvalApplying(string slug)
        => SawEvalContaining($"setAttribute('data-motion',\"{slug}\")");

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
