// LocaleChooser tests — one [Fact] per spec/index.md §7 acceptance criterion.

using System.Collections.Generic;
using System.Threading.Tasks;
using Bunit;
using Bunit.JSInterop;
using LilyDesignSystem.Blazor.Helpers;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;
using Xunit;

namespace LilyDesignSystem.Blazor.Helpers.Tests;

public class LocaleChooserTests : TestContext
{
    private static readonly string[] LocalesList = { "en", "en_US", "fr", "fr_CA", "ar" };

    public LocaleChooserTests()
    {
        // Loose JSInterop: the apply-script eval, the localStorage /
        // navigator probes, and the FocusAsync interop should not block
        // render.
        JSInterop.Mode = JSRuntimeMode.Loose;
        JSInterop.SetupVoid("eval", _ => true).SetVoidResult();
        JSInterop.Setup<string?>("eval", _ => true).SetResult(null);
        JSInterop.Setup<string[]?>("eval", _ => true).SetResult(System.Array.Empty<string>());
    }

    private IRenderedComponent<LocaleChooser> RenderDefault()
        => RenderComponent<LocaleChooser>(p => p
            .Add(x => x.Label, "Language")
            .Add(x => x.Locales, LocalesList));

    private static void Key(IRenderedComponent<LocaleChooser> cut, string selector, string key)
        => cut.Find(selector).KeyDown(new KeyboardEventArgs { Key = key });

    // =================================================================
    // Markup contract — §7.1–§7.9
    // =================================================================

    // -----------------------------------------------------------------
    // §7.1 — The root is a <div> carrying the class hook; inside it a
    //        <button> controls a <ul role="listbox">.
    // -----------------------------------------------------------------
    [Fact]
    public void Section_7_1_Renders_Button_Controlling_A_Listbox()
    {
        var cut = RenderDefault();

        Assert.NotNull(cut.Find("div.locale-chooser"));
        Assert.Empty(cut.FindAll("select"));

        var button = cut.Find("button.locale-chooser-button");
        Assert.Equal("button", button.GetAttribute("type"));
        Assert.Equal("listbox", button.GetAttribute("aria-haspopup"));
        Assert.Equal("false", button.GetAttribute("aria-expanded"));

        var listId = button.GetAttribute("aria-controls");
        Assert.False(string.IsNullOrEmpty(listId));

        var list = cut.Find("ul.locale-chooser-list");
        Assert.Equal(listId, list.GetAttribute("id"));
        Assert.Equal("listbox", list.GetAttribute("role"));
        Assert.Equal("-1", list.GetAttribute("tabindex"));
    }

    // -----------------------------------------------------------------
    // §7.2 — The button renders the globe glyph, hidden from assistive
    //        technology.
    // -----------------------------------------------------------------
    [Fact]
    public void Section_7_2_Button_Renders_Glyph_Hidden_From_Assistive_Tech()
    {
        var cut = RenderDefault();

        var icon = cut.Find(".locale-chooser-icon");
        // U+1F310 GLOBE WITH MERIDIANS (&#127760;) + U+FE0E VARIATION
        // SELECTOR-15 (&#65038;), which forces the monochrome text
        // presentation so the globe matches ThemeChooser's ◑.
        Assert.Equal("\U0001F310︎", icon.TextContent.Trim());
        Assert.Equal("true", icon.GetAttribute("aria-hidden"));
        Assert.Equal("\U0001F310︎", LocaleChooser.GlobeWithMeridians);
    }

    // -----------------------------------------------------------------
    // §7.3 — aria-label names both the button and the listbox.
    // -----------------------------------------------------------------
    [Fact]
    public void Section_7_3_AriaLabel_Names_Button_And_Listbox()
    {
        var cut = RenderComponent<LocaleChooser>(p => p
            .Add(x => x.Label, "Choose language")
            .Add(x => x.Locales, LocalesList));

        Assert.Equal("Choose language", cut.Find("button").GetAttribute("aria-label"));
        Assert.Equal("Choose language", cut.Find("ul").GetAttribute("aria-label"));
    }

    // -----------------------------------------------------------------
    // §7.4 — One option per locale; the hidden input carries the supplied
    //        Name and the resolved Value.
    // -----------------------------------------------------------------
    [Fact]
    public async Task Section_7_4_One_Option_Per_Locale_Hidden_Input_Carries_Name_And_Value()
    {
        var cut = RenderComponent<LocaleChooser>(p => p
            .Add(x => x.Label, "Language")
            .Add(x => x.Locales, LocalesList)
            .Add(x => x.Name, "lang"));
        await Task.Yield();

        var options = cut.FindAll("li.locale-chooser-option");
        Assert.Equal(LocalesList.Length, options.Count);
        foreach (var option in options)
        {
            Assert.Equal("option", option.GetAttribute("role"));
        }

        var hidden = cut.Find("input[type='hidden']");
        Assert.Equal("lang", hidden.GetAttribute("name"));
        Assert.Equal("en", hidden.GetAttribute("value"));
    }

    // -----------------------------------------------------------------
    // §7.5 — Each option carries lang in BCP 47 hyphen form; the button
    //        and the listbox do not.
    // -----------------------------------------------------------------
    [Fact]
    public void Section_7_5_Option_Lang_Is_Bcp47_Hyphen()
    {
        var cut = RenderComponent<LocaleChooser>(p => p
            .Add(x => x.Label, "Language")
            .Add(x => x.Locales, new[] { "en", "en_US", "zh_Hant_TW" }));

        var options = cut.FindAll(".locale-chooser-option");
        Assert.Equal("en", options[0].GetAttribute("lang"));
        Assert.Equal("en-US", options[1].GetAttribute("lang"));
        Assert.Equal("zh-Hant-TW", options[2].GetAttribute("lang"));

        Assert.Null(cut.Find("button").GetAttribute("lang"));
        Assert.Null(cut.Find("ul").GetAttribute("lang"));
    }

    // -----------------------------------------------------------------
    // §7.6 — The listbox is hidden until the button is activated;
    //        aria-expanded tracks the open state.
    // -----------------------------------------------------------------
    [Fact]
    public void Section_7_6_Listbox_Hidden_Until_Activated()
    {
        var cut = RenderDefault();

        Assert.True(cut.Find("ul").HasAttribute("hidden"));

        cut.Find("button").Click();
        Assert.False(cut.Find("ul").HasAttribute("hidden"));
        Assert.Equal("true", cut.Find("button").GetAttribute("aria-expanded"));

        cut.Find("button").Click();
        Assert.True(cut.Find("ul").HasAttribute("hidden"));
        Assert.Equal("false", cut.Find("button").GetAttribute("aria-expanded"));
    }

    // -----------------------------------------------------------------
    // §7.7 — The active locale is the single aria-selected option, and
    //        the open listbox points aria-activedescendant at it.
    // -----------------------------------------------------------------
    [Fact]
    public async Task Section_7_7_Active_Locale_Is_The_AriaSelected_Option()
    {
        var cut = RenderDefault();
        await Task.Yield();

        Assert.Null(cut.Find("ul").GetAttribute("aria-activedescendant"));

        cut.Find("button").Click();

        var selected = cut.FindAll("li[aria-selected='true']");
        Assert.Single(selected);
        Assert.Equal("en", selected[0].GetAttribute("lang"));

        Assert.Equal(cut.FindAll("li")[0].GetAttribute("id"),
            cut.Find("ul").GetAttribute("aria-activedescendant"));
        Assert.True(cut.FindAll("li")[0].HasAttribute("data-active"));
    }

    // -----------------------------------------------------------------
    // §7.8 — Visible option text uses LocaleLabels override, then
    //        DefaultLocaleLabels, then the raw code.
    // -----------------------------------------------------------------
    [Fact]
    public void Section_7_8_Default_Labels_With_Fallback()
    {
        var cut = RenderComponent<LocaleChooser>(p => p
            .Add(x => x.Label, "Language")
            .Add(x => x.Locales, new[] { "en", "fr" })
            .Add(x => x.LocaleLabels,
                (IReadOnlyDictionary<string, string>)new Dictionary<string, string>
                {
                    ["en"] = "English",
                    ["fr"] = "Français",
                }));
        Assert.Contains("English", cut.Markup);
        Assert.Contains("Français", cut.Markup);

        var cut2 = RenderComponent<LocaleChooser>(p => p
            .Add(x => x.Label, "Language")
            .Add(x => x.Locales, new[] { "en_US" }));
        Assert.Contains("English (United States)", cut2.Markup);
    }

    // -----------------------------------------------------------------
    // §7.9 — Option and list ids are stable within an instance and
    //        unique across instances (monotonic counter, not randomness).
    // -----------------------------------------------------------------
    [Fact]
    public void Section_7_9_Option_Ids_Are_Stable_And_Unique_Per_Instance()
    {
        var a = RenderDefault();
        var b = RenderDefault();

        var aList = a.Find("ul").GetAttribute("id")!;
        var bList = b.Find("ul").GetAttribute("id")!;
        Assert.NotEqual(aList, bList);
        Assert.StartsWith("locale-chooser-", aList);

        a.Find("button").Click();
        Assert.Equal(aList, a.Find("ul").GetAttribute("id"));

        var ids = new HashSet<string>();
        foreach (var option in a.FindAll("li"))
        {
            Assert.True(ids.Add(option.GetAttribute("id")!));
        }
    }

    // =================================================================
    // Keyboard contract (WAI-ARIA APG listbox) — §7.10–§7.18
    // =================================================================

    // -----------------------------------------------------------------
    // §7.10 — ArrowDown, Enter and Space on the button all open the
    //         listbox with the selected option active.
    // -----------------------------------------------------------------
    [Fact]
    public async Task Section_7_10_ArrowDown_Enter_And_Space_Open_The_Listbox()
    {
        foreach (var key in new[] { "ArrowDown", "Enter", " " })
        {
            var cut = RenderDefault();
            await Task.Yield();

            Key(cut, "button", key);

            Assert.False(cut.Find("ul").HasAttribute("hidden"));
            Assert.Equal("true", cut.Find("button").GetAttribute("aria-expanded"));
            // Opens on the currently-selected option ("en", index 0).
            Assert.Equal(cut.FindAll("li")[0].GetAttribute("id"),
                cut.Find("ul").GetAttribute("aria-activedescendant"));
        }
    }

    // -----------------------------------------------------------------
    // §7.11 — ArrowUp on the button opens with the LAST option active.
    // -----------------------------------------------------------------
    [Fact]
    public async Task Section_7_11_ArrowUp_Opens_With_Last_Option_Active()
    {
        var cut = RenderDefault();
        await Task.Yield();

        Key(cut, "button", "ArrowUp");

        Assert.False(cut.Find("ul").HasAttribute("hidden"));
        Assert.Equal(cut.FindAll("li")[LocalesList.Length - 1].GetAttribute("id"),
            cut.Find("ul").GetAttribute("aria-activedescendant"));
    }

    // -----------------------------------------------------------------
    // §7.12 — ArrowDown / ArrowUp move the active option and clamp at
    //         both ends (the APG listbox pattern does not wrap).
    // -----------------------------------------------------------------
    [Fact]
    public async Task Section_7_12_Arrows_Move_The_Active_Option_And_Clamp()
    {
        var cut = RenderDefault();
        await Task.Yield();
        Key(cut, "button", "ArrowDown");

        string Active() => cut.Find("ul").GetAttribute("aria-activedescendant")!;
        string OptionId(int i) => cut.FindAll("li")[i].GetAttribute("id")!;

        Assert.Equal(OptionId(0), Active());

        Key(cut, "ul", "ArrowDown");
        Assert.Equal(OptionId(1), Active());

        Key(cut, "ul", "ArrowUp");
        Key(cut, "ul", "ArrowUp");
        Key(cut, "ul", "ArrowUp");
        Assert.Equal(OptionId(0), Active());

        for (var i = 0; i < LocalesList.Length + 2; i++) Key(cut, "ul", "ArrowDown");
        Assert.Equal(OptionId(LocalesList.Length - 1), Active());
    }

    // -----------------------------------------------------------------
    // §7.13 — Home and End jump to the first and last option.
    // -----------------------------------------------------------------
    [Fact]
    public async Task Section_7_13_Home_And_End_Jump_To_First_And_Last()
    {
        var cut = RenderDefault();
        await Task.Yield();
        Key(cut, "button", "ArrowDown");

        Key(cut, "ul", "End");
        Assert.Equal(cut.FindAll("li")[LocalesList.Length - 1].GetAttribute("id"),
            cut.Find("ul").GetAttribute("aria-activedescendant"));

        Key(cut, "ul", "Home");
        Assert.Equal(cut.FindAll("li")[0].GetAttribute("id"),
            cut.Find("ul").GetAttribute("aria-activedescendant"));
    }

    // -----------------------------------------------------------------
    // §7.14 — Enter selects the active option, applies it, closes, and
    //         reports the CONSUMER-form code (not the BCP 47 tag).
    // -----------------------------------------------------------------
    [Fact]
    public async Task Section_7_14_Enter_Selects_The_Active_Option_Applies_And_Closes()
    {
        var changed = "";
        var valueChanged = "";
        var cut = RenderComponent<LocaleChooser>(p => p
            .Add(x => x.Label, "Language")
            .Add(x => x.Locales, LocalesList)
            .Add(x => x.OnChange, EventCallback.Factory.Create<string>(this, v => changed = v))
            .Add(x => x.ValueChanged,
                EventCallback.Factory.Create<string>(this, v => valueChanged = v)));
        await Task.Yield();

        // Move to index 1 == "en_US".
        Key(cut, "button", "ArrowDown");
        Key(cut, "ul", "ArrowDown");
        Key(cut, "ul", "Enter");

        Assert.True(cut.Find("ul").HasAttribute("hidden"));
        Assert.Equal("false", cut.Find("button").GetAttribute("aria-expanded"));
        Assert.Equal("en_US", changed);
        Assert.Equal("en_US", valueChanged);
        Assert.True(SawEvalContaining("setAttribute('lang',\"en-US\")"),
            "Expected an interop eval call setting lang=en-US");
        Assert.Equal("en_US", cut.Find("input[type='hidden']").GetAttribute("value"));
    }

    // -----------------------------------------------------------------
    // §7.14 — Space behaves the same as Enter inside the listbox.
    // -----------------------------------------------------------------
    [Fact]
    public async Task Section_7_14_Space_Selects_The_Active_Option()
    {
        var cut = RenderDefault();
        await Task.Yield();

        Key(cut, "button", "ArrowDown");
        Key(cut, "ul", "End");
        Key(cut, "ul", " ");

        Assert.True(cut.Find("ul").HasAttribute("hidden"));
        Assert.Equal("ar", cut.Find("input[type='hidden']").GetAttribute("value"));
        Assert.True(SawEvalContaining("setAttribute('dir',\"rtl\")"),
            "Expected the RTL locale to set dir=rtl");
    }

    // -----------------------------------------------------------------
    // §7.15 — Escape closes the listbox WITHOUT changing the value.
    // -----------------------------------------------------------------
    [Fact]
    public async Task Section_7_15_Escape_Closes_Without_Changing_The_Value()
    {
        var changed = "";
        var cut = RenderComponent<LocaleChooser>(p => p
            .Add(x => x.Label, "Language")
            .Add(x => x.Locales, LocalesList)
            .Add(x => x.OnChange, EventCallback.Factory.Create<string>(this, v => changed = v)));
        await Task.Yield();
        changed = "";

        Key(cut, "button", "ArrowDown");
        Key(cut, "ul", "ArrowDown");
        Key(cut, "ul", "Escape");

        Assert.True(cut.Find("ul").HasAttribute("hidden"));
        Assert.Equal("", changed);
        Assert.Equal("en", cut.Find("input[type='hidden']").GetAttribute("value"));
        Assert.False(SawEvalContaining("setAttribute('lang',\"en-US\")"),
            "Escape must not apply the active option");
    }

    // -----------------------------------------------------------------
    // §7.16 — Printable characters run a typeahead over the labels.
    // -----------------------------------------------------------------
    [Fact]
    public async Task Section_7_16_Typeahead_Moves_The_Active_Option_By_Label_Prefix()
    {
        var cut = RenderComponent<LocaleChooser>(p => p
            .Add(x => x.Label, "Language")
            .Add(x => x.Locales, LocalesList)
            .Add(x => x.LocaleLabels,
                (IReadOnlyDictionary<string, string>)new Dictionary<string, string>
                {
                    ["en"] = "English",
                    ["en_US"] = "English (United States)",
                    ["fr"] = "French",
                    ["fr_CA"] = "French (Canada)",
                    ["ar"] = "Arabic",
                }));
        await Task.Yield();
        Key(cut, "button", "ArrowDown");

        // "Arabic" is index 4.
        Key(cut, "ul", "a");
        Assert.Equal(cut.FindAll("li")[4].GetAttribute("id"),
            cut.Find("ul").GetAttribute("aria-activedescendant"));

        // "z" within the same buffer window makes "az", which matches
        // nothing, so the active option stays put.
        Key(cut, "ul", "z");
        Assert.Equal(cut.FindAll("li")[4].GetAttribute("id"),
            cut.Find("ul").GetAttribute("aria-activedescendant"));
    }

    // -----------------------------------------------------------------
    // §7.17 — Clicking an option selects it, applies it, and closes.
    // -----------------------------------------------------------------
    [Fact]
    public async Task Section_7_17_Clicking_An_Option_Selects_And_Closes()
    {
        var valueChanged = "";
        var cut = RenderComponent<LocaleChooser>(p => p
            .Add(x => x.Label, "Language")
            .Add(x => x.Locales, LocalesList)
            .Add(x => x.ValueChanged,
                EventCallback.Factory.Create<string>(this, v => valueChanged = v)));
        await Task.Yield();

        cut.Find("button").Click();
        cut.FindAll("li")[3].Click();

        Assert.True(cut.Find("ul").HasAttribute("hidden"));
        Assert.Equal("fr_CA", valueChanged);
        Assert.True(SawEvalContaining("setAttribute('lang',\"fr-CA\")"),
            "Expected the clicked locale to be applied");
        Assert.Equal("fr-CA", cut.Find("li[aria-selected='true']").GetAttribute("lang"));
    }

    // -----------------------------------------------------------------
    // §7.18 — Focus leaving the root closes the listbox without changing
    //         the value and without pulling focus back.
    // -----------------------------------------------------------------
    [Fact]
    public async Task Section_7_18_Focus_Leaving_The_Root_Closes_The_Listbox()
    {
        var cut = RenderDefault();
        await Task.Yield();

        cut.Find("button").Click();
        Assert.False(cut.Find("ul").HasAttribute("hidden"));

        // A browser emits one focusout for the component's own button →
        // listbox move; that one is swallowed. The next one is a real
        // departure and closes the control.
        cut.Find("div.locale-chooser").FocusOut();
        cut.Find("div.locale-chooser").FocusOut();

        Assert.True(cut.Find("ul").HasAttribute("hidden"));
        Assert.Equal("en", cut.Find("input[type='hidden']").GetAttribute("value"));
    }

    // =================================================================
    // Pure helpers — §7.19–§7.26 (unchanged by the icon-button rewrite)
    // =================================================================

    // §7.19 — Bcp47LocaleTag("en_US") == "en-US".
    [Fact]
    public void Section_7_19_Bcp47_EnUs()
        => Assert.Equal("en-US", Locales.Bcp47LocaleTag("en_US"));

    // §7.20 — Bcp47LocaleTag("zh_Hant_TW") == "zh-Hant-TW"; "en" unchanged.
    [Fact]
    public void Section_7_20_Bcp47_ZhHantTw_And_En()
    {
        Assert.Equal("zh-Hant-TW", Locales.Bcp47LocaleTag("zh_Hant_TW"));
        Assert.Equal("en", Locales.Bcp47LocaleTag("en"));
    }

    // §7.21 — RTL detection for ar, he_IL, uz_Arab_AF; LTR for en, fr_CA.
    [Fact]
    public void Section_7_21_Rtl_Detection()
    {
        Assert.True(Locales.IsRtlLocale("ar"));
        Assert.True(Locales.IsRtlLocale("he_IL"));
        Assert.True(Locales.IsRtlLocale("uz_Arab_AF"));
        Assert.True(Locales.IsRtlLocale("uz_arab_af"));
        Assert.True(Locales.IsRtlLocale("UZ_ARAB_AF"));

        Assert.False(Locales.IsRtlLocale("en"));
        Assert.False(Locales.IsRtlLocale("fr_CA"));
        Assert.False(Locales.IsRtlLocale(""));
    }

    // §7.22 — LocaleName resolves en_US via the built-in table.
    [Fact]
    public void Section_7_22_LocaleName_From_Builtin_Table()
        => Assert.Equal("English (United States)", Locales.LocaleName("en_US"));

    // §7.23 — Apply-script sets lang to the BCP 47 form and normalises.
    [Fact]
    public void Section_7_23_Apply_Script_Sets_Lang_To_Bcp47_Tag()
    {
        Assert.Contains("setAttribute('lang',\"en-US\")",
            LocaleChooser.BuildApplyScript("en_US", applyDir: true, storageKey: null));
        Assert.Contains("setAttribute('lang',\"zh-Hant-TW\")",
            LocaleChooser.BuildApplyScript("zh_Hant_TW", applyDir: true, storageKey: null));
    }

    // §7.24 — Apply-script sets dir from RTL detection, and omits the dir
    //         write when ApplyDir is false.
    [Fact]
    public void Section_7_24_Apply_Script_Dir_Handling()
    {
        Assert.Contains("setAttribute('dir',\"rtl\")",
            LocaleChooser.BuildApplyScript("ar", applyDir: true, storageKey: null));
        Assert.Contains("setAttribute('dir',\"ltr\")",
            LocaleChooser.BuildApplyScript("en", applyDir: true, storageKey: null));

        var noDir = LocaleChooser.BuildApplyScript("ar", applyDir: false, storageKey: null);
        Assert.DoesNotContain("setAttribute('dir'", noDir);
        Assert.Contains("setAttribute('lang',\"ar\")", noDir);
    }

    // §7.25 — When StorageKey is set, the apply-script writes to localStorage.
    [Fact]
    public void Section_7_25_StorageKey_Embedded_In_Apply_Script()
    {
        Assert.Contains("localStorage.setItem(\"lily-locale\",\"fr\")",
            LocaleChooser.BuildApplyScript("fr", applyDir: true, storageKey: "lily-locale"));
        Assert.DoesNotContain("localStorage.setItem",
            LocaleChooser.BuildApplyScript("fr", applyDir: true, storageKey: null));
    }

    // §7.26 — Navigator detection: exact match, then language-only fallback.
    [Fact]
    public void Section_7_26_Navigator_Matching()
    {
        Assert.Equal("fr_CA",
            Locales.MatchNavigatorLanguage(new[] { "fr-CA" }, new[] { "en", "fr_CA" }));
        Assert.Equal("fr",
            Locales.MatchNavigatorLanguage(new[] { "fr-CA" }, new[] { "en", "fr" }));
        Assert.Equal("",
            Locales.MatchNavigatorLanguage(new[] { "xx-YY" }, new[] { "en", "fr" }));
    }

    // =================================================================
    // Lifecycle, spread, custom rendering — §7.27–§7.29
    // =================================================================

    // -----------------------------------------------------------------
    // §7.27 — A supplied non-empty Value wins over storage and defaults.
    // -----------------------------------------------------------------
    [Fact]
    public async Task Section_7_27_Explicit_Value_Wins()
    {
        RenderComponent<LocaleChooser>(p => p
            .Add(x => x.Label, "Language")
            .Add(x => x.Locales, LocalesList)
            .Add(x => x.Value, "fr_CA")
            .Add(x => x.DefaultValue, "en")
            .Add(x => x.StorageKey, "lily-locale"));
        await Task.Yield();

        Assert.True(SawEvalContaining("setAttribute('lang',\"fr-CA\")"),
            "Expected Value=fr_CA to be applied as lang=fr-CA");
    }

    // -----------------------------------------------------------------
    // §7.28 — Extra attributes spread onto the root <div>.
    // -----------------------------------------------------------------
    [Fact]
    public void Section_7_28_AdditionalAttributes_Spread_Onto_The_Root()
    {
        var cut = RenderComponent<LocaleChooser>(p => p
            .Add(x => x.Label, "Language")
            .Add(x => x.Locales, LocalesList)
            .AddUnmatched("data-testid", "ls"));

        Assert.Equal("ls", cut.Find("div.locale-chooser").GetAttribute("data-testid"));
    }

    // -----------------------------------------------------------------
    // §7.29 — ChildContent replaces the glyph inside the button and
    //         receives Value / Open / LabelFor.
    // -----------------------------------------------------------------
    [Fact]
    public async Task Section_7_29_ChildContent_Replaces_The_Glyph_And_Receives_Context()
    {
        RenderFragment<LocaleChooserContext> custom = ctx => builder =>
        {
            builder.OpenElement(0, "span");
            builder.AddAttribute(1, "data-testid", "custom");
            builder.AddAttribute(2, "data-open", ctx.Open.ToString());
            builder.AddAttribute(3, "data-label", ctx.LabelFor(ctx.Value));
            builder.AddContent(4, ctx.Value);
            builder.CloseElement();
        };

        var cut = RenderComponent<LocaleChooser>(p => p
            .Add(x => x.Label, "Language")
            .Add(x => x.Locales, LocalesList)
            .Add(x => x.ChildContent, custom));
        await Task.Yield();

        // The default glyph is replaced, not supplemented.
        Assert.Empty(cut.FindAll(".locale-chooser-icon"));

        var fragment = cut.Find("[data-testid='custom']");
        Assert.Contains("locale-chooser-button",
            fragment.ParentElement?.GetAttribute("class") ?? "");
        Assert.Equal("False", fragment.GetAttribute("data-open"));
        Assert.Equal("English", fragment.GetAttribute("data-label"));
        Assert.Equal("en", fragment.TextContent.Trim());

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
