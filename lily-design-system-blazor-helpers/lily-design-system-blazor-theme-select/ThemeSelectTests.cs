// ThemeSelect tests — one [Fact] per spec/index.md §7 acceptance criterion.

using System.Collections.Generic;
using System.Threading.Tasks;
using Bunit;
using Bunit.JSInterop;
using LilyDesignSystem.Blazor.Helpers;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;
using Xunit;

namespace LilyDesignSystem.Blazor.Helpers.Tests;

public class ThemeSelectTests : TestContext
{
    private static readonly string[] Themes = { "light", "dark", "abyss" };
    private const string UrlTrailing = "/assets/themes/";
    private const string UrlNoTrailing = "/assets/themes";

    public ThemeSelectTests()
    {
        // bUnit JSInterop defaults to Strict; relax so the eval call and the
        // FocusAsync interop do not throw during render. Tests inspect
        // invocations.
        JSInterop.Mode = JSRuntimeMode.Loose;
        JSInterop.SetupVoid("eval", _ => true).SetVoidResult();
        JSInterop.Setup<string?>("eval", _ => true).SetResult(null);
    }

    private IRenderedComponent<ThemeSelect> RenderDefault()
        => RenderComponent<ThemeSelect>(p => p
            .Add(x => x.Label, "Theme")
            .Add(x => x.ThemesUrl, UrlTrailing)
            .Add(x => x.Themes, Themes));

    private static void Key(IRenderedComponent<ThemeSelect> cut, string selector, string key)
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

        var root = cut.Find("div.theme-select");
        Assert.NotNull(root);
        Assert.Empty(cut.FindAll("select"));

        var button = cut.Find("button.theme-select-button");
        Assert.Equal("button", button.GetAttribute("type"));
        Assert.Equal("listbox", button.GetAttribute("aria-haspopup"));
        Assert.Equal("false", button.GetAttribute("aria-expanded"));

        var listId = button.GetAttribute("aria-controls");
        Assert.False(string.IsNullOrEmpty(listId));

        var list = cut.Find("ul.theme-select-list");
        Assert.Equal(listId, list.GetAttribute("id"));
        Assert.Equal("listbox", list.GetAttribute("role"));
        Assert.Equal("-1", list.GetAttribute("tabindex"));
    }

    // -----------------------------------------------------------------
    // §7.2 — The button renders the half-circle glyph, hidden from
    //        assistive technology.
    // -----------------------------------------------------------------
    [Fact]
    public void Section_7_2_Button_Renders_Glyph_Hidden_From_Assistive_Tech()
    {
        var cut = RenderDefault();

        var icon = cut.Find(".theme-select-icon");
        // U+25D1 CIRCLE WITH RIGHT HALF BLACK, decimal &#9681;
        Assert.Equal("◑", icon.TextContent.Trim());
        Assert.Equal("true", icon.GetAttribute("aria-hidden"));
        Assert.Equal("◑", ThemeSelect.CircleWithRightHalfBlack);
    }

    // -----------------------------------------------------------------
    // §7.3 — aria-label names both the button and the listbox.
    // -----------------------------------------------------------------
    [Fact]
    public void Section_7_3_AriaLabel_Names_Button_And_Listbox()
    {
        var cut = RenderComponent<ThemeSelect>(p => p
            .Add(x => x.Label, "Choose theme")
            .Add(x => x.ThemesUrl, UrlTrailing)
            .Add(x => x.Themes, Themes));

        Assert.Equal("Choose theme", cut.Find("button").GetAttribute("aria-label"));
        Assert.Equal("Choose theme", cut.Find("ul").GetAttribute("aria-label"));
    }

    // -----------------------------------------------------------------
    // §7.4 — One option per theme; the hidden input carries the supplied
    //        Name and the resolved Value.
    // -----------------------------------------------------------------
    [Fact]
    public async Task Section_7_4_One_Option_Per_Theme_Hidden_Input_Carries_Name_And_Value()
    {
        var cut = RenderComponent<ThemeSelect>(p => p
            .Add(x => x.Label, "Theme")
            .Add(x => x.ThemesUrl, UrlTrailing)
            .Add(x => x.Themes, Themes)
            .Add(x => x.Name, "appearance"));
        await Task.Yield();

        var options = cut.FindAll("li.theme-select-option");
        Assert.Equal(Themes.Length, options.Count);
        foreach (var option in options)
        {
            Assert.Equal("option", option.GetAttribute("role"));
        }

        var hidden = cut.Find("input[type='hidden']");
        Assert.Equal("appearance", hidden.GetAttribute("name"));
        Assert.Equal("light", hidden.GetAttribute("value"));
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
    // §7.6 — The active theme is the single aria-selected option, and the
    //        open listbox points aria-activedescendant at the active one.
    // -----------------------------------------------------------------
    [Fact]
    public async Task Section_7_6_Active_Theme_Is_The_AriaSelected_Option()
    {
        var cut = RenderDefault();
        await Task.Yield();

        // Closed: no aria-activedescendant.
        Assert.Null(cut.Find("ul").GetAttribute("aria-activedescendant"));

        cut.Find("button").Click();

        var selected = cut.FindAll("li[aria-selected='true']");
        Assert.Single(selected);
        Assert.Equal("Light", selected[0].TextContent.Trim());

        // Opening puts the active descendant on the selected option, which
        // also carries the data-active styling hook.
        var list = cut.Find("ul");
        Assert.Equal(cut.FindAll("li")[0].GetAttribute("id"),
            list.GetAttribute("aria-activedescendant"));
        Assert.True(cut.FindAll("li")[0].HasAttribute("data-active"));
    }

    // -----------------------------------------------------------------
    // §7.7 — Default labels title-case the slug; "default" never appears;
    //        ThemeLabels overrides the default rendering.
    // -----------------------------------------------------------------
    [Fact]
    public void Section_7_7_Default_Labels_TitleCase_And_Overrideable()
    {
        var cut = RenderComponent<ThemeSelect>(p => p
            .Add(x => x.Label, "Theme")
            .Add(x => x.ThemesUrl, UrlTrailing)
            .Add(x => x.Themes, new[] { "light", "dark" }));

        var labels = cut.FindAll("li.theme-select-option")
            .Select(li => li.TextContent.Trim()).ToList();
        Assert.Equal(new[] { "Light", "Dark" }, labels);
        // The word "default" is never emitted as a user-facing label.
        // (Asserted over the option text, not cut.Markup: bUnit renders its
        // own `:onmousedown:preventDefault` bookkeeping attribute there.)
        foreach (var label in labels)
        {
            Assert.DoesNotContain("default", label, System.StringComparison.OrdinalIgnoreCase);
        }

        var cut2 = RenderComponent<ThemeSelect>(p => p
            .Add(x => x.Label, "Theme")
            .Add(x => x.ThemesUrl, UrlTrailing)
            .Add(x => x.Themes, new[] { "light", "dark" })
            .Add(x => x.ThemeLabels,
                (IReadOnlyDictionary<string, string>)new Dictionary<string, string>
                {
                    ["light"] = "Bright",
                    ["dark"] = "Midnight",
                }));
        Assert.Contains("Bright", cut2.Markup);
        Assert.Contains("Midnight", cut2.Markup);
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
        Assert.StartsWith("theme-select-", aList);

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
            // Opens on the currently-selected option ("light", index 0).
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
        Assert.Equal(cut.FindAll("li")[Themes.Length - 1].GetAttribute("id"),
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

        Assert.Equal(OptionId(0), Active());

        Key(cut, "ul", "ArrowDown");
        Assert.Equal(OptionId(1), Active());

        // Clamp at the top.
        Key(cut, "ul", "ArrowUp");
        Key(cut, "ul", "ArrowUp");
        Key(cut, "ul", "ArrowUp");
        Assert.Equal(OptionId(0), Active());

        // Clamp at the bottom.
        for (var i = 0; i < Themes.Length + 2; i++) Key(cut, "ul", "ArrowDown");
        Assert.Equal(OptionId(Themes.Length - 1), Active());
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
        Assert.Equal(cut.FindAll("li")[Themes.Length - 1].GetAttribute("id"),
            cut.Find("ul").GetAttribute("aria-activedescendant"));

        Key(cut, "ul", "Home");
        Assert.Equal(cut.FindAll("li")[0].GetAttribute("id"),
            cut.Find("ul").GetAttribute("aria-activedescendant"));
    }

    // -----------------------------------------------------------------
    // §7.13 — Enter (and Space) select the active option, apply it, and
    //         close the listbox.
    // -----------------------------------------------------------------
    [Fact]
    public async Task Section_7_13_Enter_Selects_The_Active_Option_Applies_And_Closes()
    {
        var changed = "";
        var cut = RenderComponent<ThemeSelect>(p => p
            .Add(x => x.Label, "Theme")
            .Add(x => x.ThemesUrl, UrlTrailing)
            .Add(x => x.Themes, Themes)
            .Add(x => x.OnChange, EventCallback.Factory.Create<string>(this, v => changed = v)));
        await Task.Yield();

        Key(cut, "button", "ArrowDown");
        Key(cut, "ul", "ArrowDown");
        Key(cut, "ul", "Enter");

        Assert.True(cut.Find("ul").HasAttribute("hidden"));
        Assert.Equal("false", cut.Find("button").GetAttribute("aria-expanded"));
        Assert.Equal("dark", changed);
        Assert.True(SawEvalContaining("/assets/themes/dark.css"),
            "Expected the chosen theme to be applied");
        Assert.Equal("dark", cut.Find("input[type='hidden']").GetAttribute("value"));
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
        Assert.Equal("abyss", cut.Find("input[type='hidden']").GetAttribute("value"));
    }

    // -----------------------------------------------------------------
    // §7.14 — Escape closes the listbox WITHOUT changing the value.
    // -----------------------------------------------------------------
    [Fact]
    public async Task Section_7_14_Escape_Closes_Without_Changing_The_Value()
    {
        var changed = "";
        var cut = RenderComponent<ThemeSelect>(p => p
            .Add(x => x.Label, "Theme")
            .Add(x => x.ThemesUrl, UrlTrailing)
            .Add(x => x.Themes, Themes)
            .Add(x => x.OnChange, EventCallback.Factory.Create<string>(this, v => changed = v)));
        await Task.Yield();
        changed = "";

        Key(cut, "button", "ArrowDown");
        Key(cut, "ul", "ArrowDown");
        Key(cut, "ul", "Escape");

        Assert.True(cut.Find("ul").HasAttribute("hidden"));
        Assert.Equal("", changed);
        Assert.Equal("light", cut.Find("input[type='hidden']").GetAttribute("value"));
        Assert.False(SawEvalContaining("/assets/themes/dark.css"),
            "Escape must not apply the active option");
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

        // "Abyss" is index 2 in Themes.
        Key(cut, "ul", "a");
        Assert.Equal(cut.FindAll("li")[2].GetAttribute("id"),
            cut.Find("ul").GetAttribute("aria-activedescendant"));

        // "d" within the same buffer window makes "ad", which matches
        // nothing, so the active option stays put.
        Key(cut, "ul", "d");
        Assert.Equal(cut.FindAll("li")[2].GetAttribute("id"),
            cut.Find("ul").GetAttribute("aria-activedescendant"));
    }

    // -----------------------------------------------------------------
    // §7.16 — Clicking an option selects it, applies it, and closes.
    // -----------------------------------------------------------------
    [Fact]
    public async Task Section_7_16_Clicking_An_Option_Selects_And_Closes()
    {
        var valueChanged = "";
        var cut = RenderComponent<ThemeSelect>(p => p
            .Add(x => x.Label, "Theme")
            .Add(x => x.ThemesUrl, UrlTrailing)
            .Add(x => x.Themes, Themes)
            .Add(x => x.ValueChanged,
                EventCallback.Factory.Create<string>(this, v => valueChanged = v)));
        await Task.Yield();

        cut.Find("button").Click();
        cut.FindAll("li")[2].Click();

        Assert.True(cut.Find("ul").HasAttribute("hidden"));
        Assert.Equal("abyss", valueChanged);
        Assert.True(SawEvalContaining("/assets/themes/abyss.css"),
            "Expected the clicked theme to be applied");
        Assert.Equal("abyss", cut.Find("li[aria-selected='true']").TextContent.Trim().ToLowerInvariant());
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
        cut.Find("div.theme-select").FocusOut();
        cut.Find("div.theme-select").FocusOut();

        Assert.True(cut.Find("ul").HasAttribute("hidden"));
        Assert.Equal("light", cut.Find("input[type='hidden']").GetAttribute("value"));
    }

    // =================================================================
    // Dynamic loading and lifecycle — §7.18–§7.22
    // =================================================================

    // -----------------------------------------------------------------
    // §7.18 — Resolved initial value is "light" when present, else
    //         Themes[0], and ValueChanged fires with that value.
    // -----------------------------------------------------------------
    [Fact]
    public async Task Section_7_18_Initial_Value_Resolves_To_Light_Or_First()
    {
        var observed = "";
        RenderComponent<ThemeSelect>(p => p
            .Add(x => x.Label, "Theme")
            .Add(x => x.ThemesUrl, UrlTrailing)
            .Add(x => x.Themes, Themes)
            .Add(x => x.ValueChanged, EventCallback.Factory.Create<string>(this, v => observed = v)));

        await Task.Yield();
        Assert.Equal("light", observed);

        var observed2 = "";
        RenderComponent<ThemeSelect>(p => p
            .Add(x => x.Label, "Theme")
            .Add(x => x.ThemesUrl, UrlTrailing)
            .Add(x => x.Themes, new[] { "dark", "abyss" })
            .Add(x => x.ValueChanged, EventCallback.Factory.Create<string>(this, v => observed2 = v)));
        await Task.Yield();
        Assert.Equal("dark", observed2);
    }

    // -----------------------------------------------------------------
    // §7.19 — The interop eval call carries the constructed href.
    // -----------------------------------------------------------------
    [Fact]
    public async Task Section_7_19_Interop_Fires_With_Constructed_Href()
    {
        RenderDefault();
        await Task.Yield();

        Assert.True(SawEvalContaining("/assets/themes/light.css"),
            "Expected an eval interop call carrying /assets/themes/light.css");
    }

    // -----------------------------------------------------------------
    // §7.20 — When StorageKey is set, the apply script carries the key.
    // -----------------------------------------------------------------
    [Fact]
    public async Task Section_7_20_StorageKey_Embedded_In_Apply_Script()
    {
        var script = ThemeSelect.BuildApplyScript("theme", "/assets/themes/dark.css", "dark", "lily-theme");
        Assert.Contains("localStorage.setItem(\"lily-theme\"", script);
        Assert.Contains("\"dark\"", script);

        var noKey = ThemeSelect.BuildApplyScript("theme", "/assets/themes/dark.css", "dark", null);
        Assert.DoesNotContain("localStorage.setItem", noKey);

        RenderComponent<ThemeSelect>(p => p
            .Add(x => x.Label, "Theme")
            .Add(x => x.ThemesUrl, UrlTrailing)
            .Add(x => x.Themes, Themes)
            .Add(x => x.StorageKey, "lily-theme"));
        await Task.Yield();

        Assert.True(SawEvalContaining("\"lily-theme\""),
            "Expected an eval interop call carrying the storage key");
    }

    // -----------------------------------------------------------------
    // §7.20 — The managed <link> is discriminated by Name.
    // -----------------------------------------------------------------
    [Fact]
    public void Section_7_20_Managed_Link_Is_Discriminated_By_Name()
    {
        var script = ThemeSelect.BuildApplyScript("appearance", "/a/dark.css", "dark", null);
        Assert.Contains("data-lily-theme-select", script);
        Assert.Contains("\"appearance\"", script);
    }

    // -----------------------------------------------------------------
    // §7.21 — Supplied non-empty Value wins over storage and defaults.
    // -----------------------------------------------------------------
    [Fact]
    public async Task Section_7_21_Explicit_Value_Wins()
    {
        RenderComponent<ThemeSelect>(p => p
            .Add(x => x.Label, "Theme")
            .Add(x => x.ThemesUrl, UrlTrailing)
            .Add(x => x.Themes, Themes)
            .Add(x => x.Value, "abyss")
            .Add(x => x.DefaultValue, "light")
            .Add(x => x.StorageKey, "lily-theme"));
        await Task.Yield();

        Assert.True(SawEvalContaining("/assets/themes/abyss.css"),
            "Expected Value='abyss' to be applied");
    }

    // -----------------------------------------------------------------
    // §7.21 — ThemeName is the ONE public title-casing rule; the
    //         instance label resolution delegates to it, and ThemeLabels
    //         still overrides it.
    // -----------------------------------------------------------------
    [Fact]
    public void Section_7_21_ThemeName_Is_The_Shared_Public_Label_Rule()
    {
        Assert.Equal("High Contrast", ThemeSelect.ThemeName("high-contrast"));
        Assert.Equal("Light", ThemeSelect.ThemeName("light"));
        Assert.Equal(
            "United Kingdom National Health Service England For Patients",
            ThemeSelect.ThemeName("united-kingdom-national-health-service-england-for-patients"));
        Assert.Equal("", ThemeSelect.ThemeName(""));

        // The rendered option labels come from the very same function, so
        // consumers can reproduce them without duplicating the rule.
        var cut = RenderComponent<ThemeSelect>(p => p
            .Add(x => x.Label, "Theme")
            .Add(x => x.ThemesUrl, UrlTrailing)
            .Add(x => x.Themes, new[] { "high-contrast", "dark" }));

        var labels = cut.FindAll("li.theme-select-option")
            .Select(li => li.TextContent.Trim()).ToList();
        Assert.Equal(
            new[] { ThemeSelect.ThemeName("high-contrast"), ThemeSelect.ThemeName("dark") },
            labels);
    }

    // =================================================================
    // System-preference detection — §7.25
    // =================================================================

    // -----------------------------------------------------------------
    // §7.25 — MatchSystemTheme resolves dark / light, and returns "" when
    //         the slug is unsupported or matchMedia is unavailable.
    // -----------------------------------------------------------------
    [Fact]
    public void Section_7_25_MatchSystemTheme_Resolves_Dark_Light_And_Guards()
    {
        // Resolves dark.
        Assert.Equal("dark", ThemeSelect.MatchSystemTheme(true, Themes));
        // Resolves light.
        Assert.Equal("light", ThemeSelect.MatchSystemTheme(false, Themes));

        // Returns "" when the preferred slug is not among the themes.
        Assert.Equal("", ThemeSelect.MatchSystemTheme(true, new[] { "light", "sepia" }));
        Assert.Equal("", ThemeSelect.MatchSystemTheme(false, new[] { "dark", "abyss" }));
        Assert.Equal("", ThemeSelect.MatchSystemTheme(true, System.Array.Empty<string>()));

        // Returns "" when matchMedia is unavailable (null probe result:
        // prerender / static SSR / host without the API).
        Assert.Equal("", ThemeSelect.MatchSystemTheme(null, Themes));
    }

    // -----------------------------------------------------------------
    // §7.25 — DetectFromSystem resolves the initial theme from the OS
    //         preference when nothing else supplies one.
    // -----------------------------------------------------------------
    [Fact]
    public async Task Section_7_25_DetectFromSystem_Resolves_The_Initial_Theme()
    {
        // Probe reports "prefers dark".
        JSInterop.Setup<bool?>("eval", _ => true).SetResult(true);

        var observed = "";
        RenderComponent<ThemeSelect>(p => p
            .Add(x => x.Label, "Theme")
            .Add(x => x.ThemesUrl, UrlTrailing)
            .Add(x => x.Themes, Themes)
            .Add(x => x.DetectFromSystem, true)
            .Add(x => x.ValueChanged, EventCallback.Factory.Create<string>(this, v => observed = v)));
        await Task.Yield();

        // Without detection this would have resolved to "light".
        Assert.Equal("dark", observed);
        Assert.True(SawEvalContaining("/assets/themes/dark.css"));
    }

    // -----------------------------------------------------------------
    // §7.25 — Detection is opt-in: without DetectFromSystem the OS
    //         preference is never consulted.
    // -----------------------------------------------------------------
    [Fact]
    public async Task Section_7_25_Detection_Is_Off_Unless_Opted_In()
    {
        JSInterop.Setup<bool?>("eval", _ => true).SetResult(true);

        var observed = "";
        RenderComponent<ThemeSelect>(p => p
            .Add(x => x.Label, "Theme")
            .Add(x => x.ThemesUrl, UrlTrailing)
            .Add(x => x.Themes, Themes)
            .Add(x => x.ValueChanged, EventCallback.Factory.Create<string>(this, v => observed = v)));
        await Task.Yield();

        // Falls through to "light", not the system's "dark".
        Assert.Equal("light", observed);
        Assert.False(SawEvalContaining("prefers-color-scheme"),
            "matchMedia must not be probed unless DetectFromSystem is set");
    }

    // -----------------------------------------------------------------
    // §7.25 — Storage still beats detection: the resolution order is
    //         Value > storage > detection > DefaultValue > "light" > first.
    // -----------------------------------------------------------------
    [Fact]
    public async Task Section_7_25_Storage_Beats_Detection()
    {
        // Storage says "abyss"; the OS says dark. Storage wins.
        JSInterop.Setup<string?>("eval", _ => true).SetResult("abyss");
        JSInterop.Setup<bool?>("eval", _ => true).SetResult(true);

        var observed = "";
        RenderComponent<ThemeSelect>(p => p
            .Add(x => x.Label, "Theme")
            .Add(x => x.ThemesUrl, UrlTrailing)
            .Add(x => x.Themes, Themes)
            .Add(x => x.StorageKey, "lily-theme")
            .Add(x => x.DetectFromSystem, true)
            .Add(x => x.ValueChanged, EventCallback.Factory.Create<string>(this, v => observed = v)));
        await Task.Yield();

        Assert.Equal("abyss", observed);
    }

    // -----------------------------------------------------------------
    // §7.25 — An explicit Value still beats detection.
    // -----------------------------------------------------------------
    [Fact]
    public async Task Section_7_25_Explicit_Value_Beats_Detection()
    {
        JSInterop.Setup<bool?>("eval", _ => true).SetResult(true);

        RenderComponent<ThemeSelect>(p => p
            .Add(x => x.Label, "Theme")
            .Add(x => x.ThemesUrl, UrlTrailing)
            .Add(x => x.Themes, Themes)
            .Add(x => x.Value, "abyss")
            .Add(x => x.DetectFromSystem, true));
        await Task.Yield();

        Assert.True(SawEvalContaining("/assets/themes/abyss.css"));
        Assert.False(SawEvalContaining("/assets/themes/dark.css"));
    }

    // -----------------------------------------------------------------
    // §7.22 — Missing trailing slash on ThemesUrl still yields one slash.
    // -----------------------------------------------------------------
    [Fact]
    public void Section_7_22_Url_Normalisation()
    {
        Assert.Equal("/assets/themes/", ThemeSelect.NormaliseThemesUrl(UrlTrailing));
        Assert.Equal("/assets/themes/", ThemeSelect.NormaliseThemesUrl(UrlNoTrailing));
        Assert.Equal("/a/light.css", ThemeSelect.ThemeHref("/a", "light", ".css"));
        Assert.Equal("/a/light.css", ThemeSelect.ThemeHref("/a/", "light", ".css"));
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
        var cut = RenderComponent<ThemeSelect>(p => p
            .Add(x => x.Label, "Theme")
            .Add(x => x.ThemesUrl, UrlTrailing)
            .Add(x => x.Themes, Themes)
            .AddUnmatched("data-testid", "ts"));

        Assert.Equal("ts", cut.Find("div.theme-select").GetAttribute("data-testid"));
    }

    // -----------------------------------------------------------------
    // §7.24 — ChildContent replaces the glyph inside the button and
    //         receives Value / Open / LabelFor.
    // -----------------------------------------------------------------
    [Fact]
    public async Task Section_7_24_ChildContent_Replaces_The_Glyph_And_Receives_Context()
    {
        RenderFragment<ThemeSelectContext> custom = ctx => builder =>
        {
            builder.OpenElement(0, "span");
            builder.AddAttribute(1, "data-testid", "custom");
            builder.AddAttribute(2, "data-open", ctx.Open.ToString());
            builder.AddAttribute(3, "data-label", ctx.LabelFor(ctx.Value));
            builder.AddContent(4, ctx.Value);
            builder.CloseElement();
        };

        var cut = RenderComponent<ThemeSelect>(p => p
            .Add(x => x.Label, "Theme")
            .Add(x => x.ThemesUrl, UrlTrailing)
            .Add(x => x.Themes, Themes)
            .Add(x => x.ChildContent, custom));
        await Task.Yield();

        // The default glyph is replaced, not supplemented.
        Assert.Empty(cut.FindAll(".theme-select-icon"));

        var custom_ = cut.Find("[data-testid='custom']");
        Assert.Contains("theme-select-button",
            custom_.ParentElement?.GetAttribute("class") ?? "");
        Assert.Equal("False", custom_.GetAttribute("data-open"));
        Assert.Equal("Light", custom_.GetAttribute("data-label"));
        Assert.Equal("light", custom_.TextContent.Trim());

        cut.Find("button").Click();
        Assert.Equal("True", cut.Find("[data-testid='custom']").GetAttribute("data-open"));
    }

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
