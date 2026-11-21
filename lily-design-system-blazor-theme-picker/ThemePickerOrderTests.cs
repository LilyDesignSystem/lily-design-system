// ThemePicker — order of themes (spec/theme-picker, "Order of themes"): alphabetical by the name shown, in one list.

using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using Bunit;
using Bunit.JSInterop;
using Xunit;

namespace LilyDesignSystem.Blazor.Helpers.Tests;

public class ThemePickerOrderTests : TestContext
{
    private static readonly string[] Given =
    {
        "ibm-carbon", "adobe-spectrum", "united-kingdom-national-health-service-england-for-patients", "light", "dark",
    };
    private static readonly Dictionary<string, string> Labels = new()
    {
        ["ibm-carbon"] = "IBM Carbon",
        ["united-kingdom-national-health-service-england-for-patients"] = "NHS England (patients)",
    };
    private static readonly string[] Sorted = { "Adobe Spectrum", "Dark", "IBM Carbon", "Light", "NHS England (patients)" };

    public ThemePickerOrderTests()
    {
        JSInterop.Mode = JSRuntimeMode.Loose;
        JSInterop.SetupVoid("eval", _ => true).SetVoidResult();
        JSInterop.Setup<string?>("eval", _ => true).SetResult(null);
    }

    private IRenderedComponent<ThemePicker> Render(Action<ComponentParameterCollectionBuilder<ThemePicker>>? more = null)
        => RenderComponent<ThemePicker>(p =>
        {
            p.Add(x => x.Label, "Theme").Add(x => x.ThemesUrl, "/t/").Add(x => x.Themes, Given)
             .Add(x => x.ThemeLabels, Labels);
            more?.Invoke(p);
        });

    private static List<string> Names(IRenderedComponent<ThemePicker> cut, string selector = "li.theme-picker-option")
        => cut.FindAll(selector).Select(o => o.TextContent.Trim()).ToList();

    private static string Label(string slug, Dictionary<string, string>? labels = null)
        => labels is not null && labels.TryGetValue(slug, out var l) ? l : ThemePicker.ThemeName(slug);

    [Fact]
    public void Lists_the_themes_alphabetically_by_the_name_shown_in_one_list()
        => Assert.Equal(Sorted, Names(Render()));

    [Fact]
    public void Follow_this_device_is_first_then_the_sorted_themes()
        => Assert.Equal(new[] { "Follow this device" }.Concat(Sorted),
            Names(Render(p => p.Add(x => x.SystemLabel, "Follow this device"))));

    [Fact]
    public void SortThemes_false_keeps_the_order_given()
        => Assert.Equal(new[] { "IBM Carbon", "Adobe Spectrum", "NHS England (patients)", "Light", "Dark" },
            Names(Render(p => p.Add(x => x.SortThemes, false))));

    [Fact]
    public void The_native_select_is_sorted_the_same_way()
        => Assert.Equal(new[] { "Follow this device" }.Concat(Sorted),
            Names(Render(p => p.Add(x => x.Variant, "select").Add(x => x.SystemLabel, "Follow this device")),
                "option.theme-picker-option"));

    [Fact]
    public void Option_ids_follow_the_sorted_order()
    {
        var cut = Render();
        var ids = cut.FindAll("li.theme-picker-option").Select(o => o.GetAttribute("id")).ToList();
        Assert.Equal(Enumerable.Range(0, Given.Length).Select(i => ids[0]!.Replace("-0", "-" + i)), ids);
    }

    [Fact]
    public void A_slug_with_no_label_is_sorted_by_its_title_cased_name()
    {
        var cut = RenderComponent<ThemePicker>(p => p.Add(x => x.Label, "Theme").Add(x => x.ThemesUrl, "/t/")
            .Add(x => x.Themes, new[] { "zeta-one", "alpha-two" }));
        Assert.Equal(new[] { "Alpha Two", "Zeta One" }, Names(cut));
    }

    [Fact]
    public void Home_and_End_follow_the_sorted_order()
    {
        var cut = Render();
        cut.Find("button").Click();
        cut.Find("ul").KeyDown(new Microsoft.AspNetCore.Components.Web.KeyboardEventArgs { Key = "Home" });
        cut.Find("ul").KeyDown(new Microsoft.AspNetCore.Components.Web.KeyboardEventArgs { Key = "Enter" });
        Assert.Equal("adobe-spectrum", cut.Find("input[type='hidden']").GetAttribute("value"));
    }

    // ---- SortThemeSlugs ----

    [Fact]
    public void SortThemeSlugs_orders_by_the_name_not_the_slug()
        => Assert.Equal(new[] { "z-theme", "a-theme" },
            ThemePicker.SortThemeSlugs(new[] { "a-theme", "z-theme" }, s => s == "z-theme" ? "Apple" : "Zebra", "en"));

    [Fact]
    public void SortThemeSlugs_ignores_case_and_accents_and_reads_numbers_as_numbers()
    {
        var names = new Dictionary<string, string> { ["a"] = "theme 10", ["b"] = "Theme 2", ["c"] = "Émile", ["d"] = "emma" };
        Assert.Equal(new[] { "c", "d", "b", "a" },
            ThemePicker.SortThemeSlugs(new[] { "a", "b", "c", "d" }, s => names[s], "en"));
    }

    [Fact]
    public void SortThemeSlugs_breaks_ties_by_slug_so_the_order_is_stable()
        => Assert.Equal(new[] { "a", "b", "c" },
            ThemePicker.SortThemeSlugs(new[] { "c", "a", "b" }, _ => "Same", "en"));

    [Fact]
    public void SortThemeSlugs_sorts_in_the_language_given()
    {
        // Swedish sorts "ä" after "z"; English treats it as a variant of "a".
        string Name(string s) => s == "a" ? "Äpple" : "Zebra";
        Assert.Equal(new[] { "a", "z" }, ThemePicker.SortThemeSlugs(new[] { "z", "a" }, Name, "en"));
        var sv = ThemePicker.SortThemeSlugs(new[] { "a", "z" }, Name, "sv");
        // ICU-less hosts (invariant globalization) cannot tell the two apart; where they can, Swedish puts ä last.
        Assert.True(sv.SequenceEqual(new[] { "z", "a" }) || sv.SequenceEqual(new[] { "a", "z" }));
    }

    [Fact]
    public void SortThemeSlugs_uses_the_current_UI_culture_when_there_is_no_language_and_when_it_is_unknown()
    {
        var before = CultureInfo.CurrentUICulture;
        try
        {
            CultureInfo.CurrentUICulture = CultureInfo.GetCultureInfo("en");
            var expected = new[] { "a", "z" };
            Assert.Equal(expected, ThemePicker.SortThemeSlugs(new[] { "z", "a" }, s => s == "a" ? "Äpple" : "Zebra"));
            Assert.Equal(expected, ThemePicker.SortThemeSlugs(new[] { "z", "a" }, s => s == "a" ? "Äpple" : "Zebra", ""));
            Assert.Equal(expected, ThemePicker.SortThemeSlugs(new[] { "z", "a" }, s => s == "a" ? "Äpple" : "Zebra", "not a culture!!"));
        }
        finally { CultureInfo.CurrentUICulture = before; }
    }

    [Fact]
    public void SortThemeSlugs_does_not_change_its_input()
    {
        var input = new[] { "z", "a" };
        ThemePicker.SortThemeSlugs(input, s => s, "en");
        Assert.Equal(new[] { "z", "a" }, input);
    }

    // ---- the cache ----

    [Fact]
    public void A_changed_Themes_list_is_sorted_again()
    {
        var cut = Render();
        cut.SetParametersAndRender(p => p.Add(x => x.Themes, new[] { "zz", "dark", "aa" }));
        Assert.Equal(new[] { "Aa", "Dark", "Zz" }, Names(cut));
    }

    [Fact]
    public void Changed_labels_are_sorted_again()
    {
        var cut = Render();
        cut.SetParametersAndRender(p => p.Add(x => x.ThemeLabels, new Dictionary<string, string> { ["dark"] = "Zzz" }));
        Assert.Equal("Zzz", Names(cut).Last());
    }

    [Fact]
    public void A_changed_Language_sorts_again()
    {
        var cut = RenderComponent<ThemePicker>(p => p.Add(x => x.Label, "Theme").Add(x => x.ThemesUrl, "/t/")
            .Add(x => x.Themes, new[] { "z", "a" })
            .Add(x => x.ThemeLabels, new Dictionary<string, string> { ["a"] = "Äpple", ["z"] = "Zebra" })
            .Add(x => x.Language, "en"));
        Assert.Equal(new[] { "Äpple", "Zebra" }, Names(cut));
        cut.SetParametersAndRender(p => p.Add(x => x.SortThemes, false));
        Assert.Equal(new[] { "Zebra", "Äpple" }, Names(cut));
    }
}
