// LocaleSelect tests — one [Fact] per spec/index.md §7 acceptance criterion.

using System.Collections.Generic;
using System.Threading.Tasks;
using Bunit;
using Bunit.JSInterop;
using LilyDesignSystem.Blazor.Helpers;
using Microsoft.AspNetCore.Components;
using Xunit;

namespace LilyDesignSystem.Blazor.Helpers.Tests;

public class LocaleSelectTests : TestContext
{
    private static readonly string[] LocalesList = { "en", "en_US", "fr", "fr_CA", "ar" };

    public LocaleSelectTests()
    {
        // Loose JSInterop: the apply-script eval and the
        // localStorage/navigator probes should not block render.
        JSInterop.Mode = JSRuntimeMode.Loose;
        JSInterop.SetupVoid("eval", _ => true).SetVoidResult();
        JSInterop.Setup<string?>("eval", _ => true).SetResult(null);
        JSInterop.Setup<string[]?>("eval", _ => true).SetResult(System.Array.Empty<string>());
    }

    // -----------------------------------------------------------------
    // §7.1 — Renders a native <select> (no role attribute).
    // -----------------------------------------------------------------
    [Fact]
    public void Section_7_1_Renders_Select()
    {
        var cut = RenderComponent<LocaleSelect>(p => p
            .Add(x => x.Label, "Language")
            .Add(x => x.Locales, LocalesList));

        var root = cut.Find("select");
        Assert.Null(root.GetAttribute("role"));
        Assert.Contains("locale-select", root.GetAttribute("class") ?? "");
    }

    // -----------------------------------------------------------------
    // §7.2 — aria-label is the supplied Label.
    // -----------------------------------------------------------------
    [Fact]
    public void Section_7_2_AriaLabel_Is_Label()
    {
        var cut = RenderComponent<LocaleSelect>(p => p
            .Add(x => x.Label, "Choose language")
            .Add(x => x.Locales, LocalesList));

        Assert.Equal("Choose language", cut.Find("select").GetAttribute("aria-label"));
    }

    // -----------------------------------------------------------------
    // §7.3 — One option per locale; the <select> carries the supplied Name.
    // -----------------------------------------------------------------
    [Fact]
    public void Section_7_3_One_Option_Per_Locale_Select_Has_Name()
    {
        var cut = RenderComponent<LocaleSelect>(p => p
            .Add(x => x.Label, "Language")
            .Add(x => x.Locales, LocalesList)
            .Add(x => x.Name, "lang"));

        var options = cut.FindAll("option");
        // One placeholder option plus one option per locale.
        Assert.Equal(LocalesList.Length + 1, options.Count);
        Assert.Equal("lang", cut.Find("select").GetAttribute("name"));
    }

    // -----------------------------------------------------------------
    // §7.4 — Each option carries the locale code as its value, after the
    //        leading empty-valued placeholder.
    // -----------------------------------------------------------------
    [Fact]
    public void Section_7_4_Option_Value_Is_Locale_Code()
    {
        var cut = RenderComponent<LocaleSelect>(p => p
            .Add(x => x.Label, "Language")
            .Add(x => x.Locales, LocalesList));

        var options = cut.FindAll("option");
        Assert.Equal("", options[0].GetAttribute("value"));
        for (int i = 0; i < LocalesList.Length; i++)
        {
            // Index shifts by one: options[0] is the placeholder.
            Assert.Equal(LocalesList[i], options[i + 1].GetAttribute("value"));
        }
    }

    // -----------------------------------------------------------------
    // §7.5 — Each option carries lang in BCP 47 hyphen form.
    // -----------------------------------------------------------------
    [Fact]
    public void Section_7_5_Option_Lang_Is_Bcp47_Hyphen()
    {
        var cut = RenderComponent<LocaleSelect>(p => p
            .Add(x => x.Label, "Language")
            .Add(x => x.Locales, new[] { "en", "en_US", "zh_Hant_TW" }));

        // Skip index 0: the placeholder is not a locale and carries no lang.
        var labels = cut.FindAll(".locale-select-option");
        Assert.Null(labels[0].GetAttribute("lang"));
        Assert.Equal("en", labels[1].GetAttribute("lang"));
        Assert.Equal("en-US", labels[2].GetAttribute("lang"));
        Assert.Equal("zh-Hant-TW", labels[3].GetAttribute("lang"));
    }

    // -----------------------------------------------------------------
    // §7.24 — The placeholder option is first, renders the Label, carries
    //         value="", is the only selected option, and does not stop the
    //         resolved locale from being applied.
    // -----------------------------------------------------------------
    [Fact]
    public async Task Section_7_24_Placeholder_Option_Renders_Label_And_Stays_Selected()
    {
        var cut = RenderComponent<LocaleSelect>(p => p
            .Add(x => x.Label, "Locale")
            .Add(x => x.Locales, LocalesList));
        await Task.Yield();

        // The placeholder is the FIRST child of the <select>.
        Assert.Contains("locale-select-placeholder",
            cut.FindAll("option")[0].GetAttribute("class") ?? "");

        var placeholder = cut.Find(".locale-select-placeholder");
        Assert.Equal("Locale", placeholder.TextContent.Trim());
        Assert.Equal("", placeholder.GetAttribute("value"));
        Assert.NotNull(placeholder.GetAttribute("selected"));

        // The closed control shows the placeholder, not the active locale:
        // no real option is marked selected.
        foreach (var option in cut.FindAll(".locale-select-option"))
        {
            if (option.ClassList.Contains("locale-select-placeholder")) continue;
            Assert.Null(option.GetAttribute("selected"));
        }

        // The resolved locale is still applied.
        Assert.True(SawEvalContaining("setAttribute('lang',\"en\")"),
            "Expected the resolved locale to still be applied");
    }

    // -----------------------------------------------------------------
    // §7.25 — The Placeholder parameter overrides Label as placeholder text,
    //         while aria-label keeps the Label.
    // -----------------------------------------------------------------
    [Fact]
    public void Section_7_25_Placeholder_Parameter_Overrides_Label()
    {
        var cut = RenderComponent<LocaleSelect>(p => p
            .Add(x => x.Label, "Choose a locale")
            .Add(x => x.Placeholder, "Locale")
            .Add(x => x.Locales, LocalesList));

        Assert.Equal("Locale", cut.Find(".locale-select-placeholder").TextContent.Trim());
        Assert.Equal("Choose a locale", cut.Find("select").GetAttribute("aria-label"));
    }

    // -----------------------------------------------------------------
    // §7.26 — Choosing an option applies it AND snaps the <select> back to
    //         the placeholder: the DOM value is reset via interop and the
    //         placeholder stays the only selected option.
    // -----------------------------------------------------------------
    [Fact]
    public async Task Section_7_26_Choosing_Option_Applies_And_Snaps_Back()
    {
        var cut = RenderComponent<LocaleSelect>(p => p
            .Add(x => x.Label, "Locale")
            .Add(x => x.Locales, LocalesList));
        await Task.Yield();

        cut.Find("select").Change("fr_CA");

        // Applied.
        Assert.True(SawEvalContaining("setAttribute('lang',\"fr-CA\")"),
            "Expected the chosen locale to be applied");

        // Snapped back: the live element's value was reset through interop.
        Assert.Contains(JSInterop.Invocations,
            inv => inv.Identifier == "Object.assign");

        // Snapped back: the placeholder is still the only selected option.
        Assert.NotNull(cut.Find(".locale-select-placeholder").GetAttribute("selected"));
        foreach (var option in cut.FindAll(".locale-select-option"))
        {
            if (option.ClassList.Contains("locale-select-placeholder")) continue;
            Assert.Null(option.GetAttribute("selected"));
        }
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

    // -----------------------------------------------------------------
    // §7.6 — Visible option text uses LocaleLabels override, then
    //        DefaultLocaleLabels, then the raw code.
    // -----------------------------------------------------------------
    [Fact]
    public void Section_7_6_Default_Labels_With_Fallback()
    {
        var cut = RenderComponent<LocaleSelect>(p => p
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

        var cut2 = RenderComponent<LocaleSelect>(p => p
            .Add(x => x.Label, "Language")
            .Add(x => x.Locales, new[] { "en_US" }));
        Assert.Contains("English (United States)", cut2.Markup);
    }

    // -----------------------------------------------------------------
    // §7.7 — Bcp47LocaleTag("en_US") == "en-US".
    // -----------------------------------------------------------------
    [Fact]
    public void Section_7_7_Bcp47_EnUs()
        => Assert.Equal("en-US", Locales.Bcp47LocaleTag("en_US"));

    // §7.8 — Bcp47LocaleTag("zh_Hant_TW") == "zh-Hant-TW".
    [Fact]
    public void Section_7_8_Bcp47_ZhHantTw()
        => Assert.Equal("zh-Hant-TW", Locales.Bcp47LocaleTag("zh_Hant_TW"));

    // §7.9 — Bcp47LocaleTag("en") == "en".
    [Fact]
    public void Section_7_9_Bcp47_En_Unchanged()
        => Assert.Equal("en", Locales.Bcp47LocaleTag("en"));

    // §7.10 — RTL detection for ar, he_IL, uz_Arab_AF.
    [Fact]
    public void Section_7_10_Rtl_Detection_True()
    {
        Assert.True(Locales.IsRtlLocale("ar"));
        Assert.True(Locales.IsRtlLocale("he_IL"));
        Assert.True(Locales.IsRtlLocale("uz_Arab_AF"));
        Assert.True(Locales.IsRtlLocale("uz_arab_af"));
        Assert.True(Locales.IsRtlLocale("UZ_ARAB_AF"));
    }

    // §7.11 — LTR detection for en and fr_CA.
    [Fact]
    public void Section_7_11_Rtl_Detection_False()
    {
        Assert.False(Locales.IsRtlLocale("en"));
        Assert.False(Locales.IsRtlLocale("fr_CA"));
        Assert.False(Locales.IsRtlLocale(""));
    }

    // §7.12 — LocaleName resolves en_US via the built-in table.
    [Fact]
    public void Section_7_12_LocaleName_From_Builtin_Table()
        => Assert.Equal("English (United States)", Locales.LocaleName("en_US"));

    // -----------------------------------------------------------------
    // §7.13 — Apply-script sets lang to the BCP 47 form.
    // -----------------------------------------------------------------
    [Fact]
    public void Section_7_13_Apply_Script_Sets_Lang_To_Bcp47_Tag()
    {
        var script = LocaleSelect.BuildApplyScript("en_US", applyDir: true, storageKey: null);
        Assert.Contains("setAttribute('lang',\"en-US\")", script);
    }

    // §7.14 — Apply-script sets dir=rtl for an RTL locale and dir=ltr otherwise.
    [Fact]
    public void Section_7_14_Apply_Script_Sets_Dir_Based_On_Rtl()
    {
        var rtl = LocaleSelect.BuildApplyScript("ar", applyDir: true, storageKey: null);
        Assert.Contains("setAttribute('dir',\"rtl\")", rtl);

        var ltr = LocaleSelect.BuildApplyScript("en", applyDir: true, storageKey: null);
        Assert.Contains("setAttribute('dir',\"ltr\")", ltr);
    }

    // §7.15 — Apply-script omits the dir write when ApplyDir is false.
    [Fact]
    public void Section_7_15_Apply_Script_Skips_Dir_When_Disabled()
    {
        var noDir = LocaleSelect.BuildApplyScript("ar", applyDir: false, storageKey: null);
        Assert.DoesNotContain("setAttribute('dir'", noDir);
        // lang must still be set.
        Assert.Contains("setAttribute('lang',\"ar\")", noDir);
    }

    // §7.16 — Selecting a different option updates Value, fires OnChange /
    //         ValueChanged with the consumer-form code (not the BCP 47 tag),
    //         and invokes interop with the new lang/dir.
    [Fact]
    public async Task Section_7_16_Selecting_Option_Fires_Callbacks_With_Consumer_Form()
    {
        var changed = "";
        var valueChanged = "";
        var cut = RenderComponent<LocaleSelect>(p => p
            .Add(x => x.Label, "Language")
            .Add(x => x.Locales, LocalesList)
            .Add(x => x.DefaultValue, "en")
            .Add(x => x.OnChange,
                EventCallback.Factory.Create<string>(this, v => changed = v))
            .Add(x => x.ValueChanged,
                EventCallback.Factory.Create<string>(this, v => valueChanged = v)));
        await Task.Yield();

        // Select "en_US". Callback must receive the consumer form en_US,
        // not the BCP 47 tag en-US.
        cut.Find("select").Change("en_US");

        Assert.Equal("en_US", changed);
        Assert.Equal("en_US", valueChanged);

        var sawLang = false;
        foreach (var inv in JSInterop.Invocations)
        {
            if (inv.Identifier == "eval" && inv.Arguments.Count > 0
                && inv.Arguments[0] is string s
                && s.Contains("setAttribute('lang',\"en-US\")"))
            {
                sawLang = true;
                break;
            }
        }
        Assert.True(sawLang, "Expected an interop eval call setting lang=en-US");
    }

    // §7.17 — The interop script normalises via Bcp47LocaleTag.
    [Fact]
    public void Section_7_17_Apply_Script_Normalises_Via_Bcp47()
    {
        var script = LocaleSelect.BuildApplyScript("zh_Hant_TW", applyDir: true, storageKey: null);
        Assert.Contains("setAttribute('lang',\"zh-Hant-TW\")", script);
    }

    // §7.18 — When StorageKey is set, the apply-script writes to localStorage.
    [Fact]
    public void Section_7_18_StorageKey_Embedded_In_Apply_Script()
    {
        var with = LocaleSelect.BuildApplyScript("fr", applyDir: true, storageKey: "lily-locale");
        Assert.Contains("localStorage.setItem(\"lily-locale\",\"fr\")", with);

        var without = LocaleSelect.BuildApplyScript("fr", applyDir: true, storageKey: null);
        Assert.DoesNotContain("localStorage.setItem", without);
    }

    // §7.19 — A supplied non-empty Value wins over storage and defaults.
    [Fact]
    public async Task Section_7_19_Explicit_Value_Wins()
    {
        var observed = "";
        var cut = RenderComponent<LocaleSelect>(p => p
            .Add(x => x.Label, "Language")
            .Add(x => x.Locales, LocalesList)
            .Add(x => x.Value, "fr_CA")
            .Add(x => x.DefaultValue, "en")
            .Add(x => x.StorageKey, "lily-locale")
            .Add(x => x.OnChange,
                EventCallback.Factory.Create<string>(this, v => observed = v)));
        await Task.Yield();

        var sawFrCa = false;
        foreach (var inv in JSInterop.Invocations)
        {
            if (inv.Identifier == "eval" && inv.Arguments.Count > 0
                && inv.Arguments[0] is string s
                && s.Contains("setAttribute('lang',\"fr-CA\")"))
            {
                sawFrCa = true;
                break;
            }
        }
        Assert.True(sawFrCa, "Expected Value=fr_CA to be applied as lang=fr-CA");
    }

    // §7.20 — Reserved: navigator detection exact-match (unit-tested via
    //         Locales.MatchNavigatorLanguage).
    [Fact]
    public void Section_7_20_Navigator_Exact_Match()
        => Assert.Equal("fr_CA", Locales.MatchNavigatorLanguage(new[] { "fr-CA" }, new[] { "en", "fr_CA" }));

    // §7.21 — Reserved: navigator detection language-only fallback.
    [Fact]
    public void Section_7_21_Navigator_Language_Only_Fallback()
    {
        Assert.Equal("fr", Locales.MatchNavigatorLanguage(new[] { "fr-CA" }, new[] { "en", "fr" }));
        Assert.Equal("", Locales.MatchNavigatorLanguage(new[] { "xx-YY" }, new[] { "en", "fr" }));
    }

    // -----------------------------------------------------------------
    // §7.22 — Extra attributes spread onto the <select>.
    // -----------------------------------------------------------------
    [Fact]
    public void Section_7_22_AdditionalAttributes_Spread()
    {
        var cut = RenderComponent<LocaleSelect>(p => p
            .Add(x => x.Label, "Language")
            .Add(x => x.Locales, LocalesList)
            .AddUnmatched("data-testid", "lp"));

        Assert.Equal("lp", cut.Find("select").GetAttribute("data-testid"));
    }

    // -----------------------------------------------------------------
    // §7.23 — Custom ChildContent receives LocaleSelectContext.
    // -----------------------------------------------------------------
    [Fact]
    public void Section_7_23_ChildContent_Receives_Context()
    {
        // Render an <option> (a valid <select> child) so the parser keeps it.
        RenderFragment<LocaleSelectContext> custom = ctx => builder =>
        {
            builder.OpenElement(0, "option");
            builder.AddAttribute(1, "data-testid", "custom");
            builder.AddAttribute(2, "data-name", ctx.Name);
            builder.AddAttribute(3, "data-tag-en-us", ctx.TagFor("en_US"));
            builder.AddAttribute(4, "data-rtl-ar", ctx.IsRtl("ar").ToString());
            builder.AddContent(5, string.Join(",", ctx.Locales));
            builder.CloseElement();
        };

        var cut = RenderComponent<LocaleSelect>(p => p
            .Add(x => x.Label, "Language")
            .Add(x => x.Locales, LocalesList)
            .Add(x => x.Name, "lang")
            .Add(x => x.ChildContent, custom));

        var div = cut.Find("[data-testid='custom']");
        Assert.Equal("lang", div.GetAttribute("data-name"));
        Assert.Equal("en-US", div.GetAttribute("data-tag-en-us"));
        Assert.Equal("True", div.GetAttribute("data-rtl-ar"));
        Assert.Contains("en,en_US,fr,fr_CA,ar", div.TextContent);
    }
}
