// PickerBar tests — one [Fact] per spec/index.md §7 acceptance criterion.

using System.Collections.Generic;
using System.Linq;
using Bunit;
using Bunit.JSInterop;
using LilyDesignSystem.Blazor.Helpers;
using Microsoft.AspNetCore.Components;
using Xunit;

namespace LilyDesignSystem.Blazor.Helpers.Tests;

public class PickerBarTests : TestContext
{
    private static readonly PickerBarLabels Labels = new()
    {
        Search = "Search this site",
        SearchInput = "Search terms",
        SearchSubmit = "Search",
        Theme = "Theme",
        Locale = "Language",
        TextSize = "Text size",
        Share = "Share",
    };

    private const string ThemesUrl = "/assets/themes/";
    private static readonly string[] Locales = { "en", "cy" };

    public PickerBarTests()
    {
        // The wrapped pickers reach the browser through IJSRuntime "eval";
        // Loose mode returns default(T) for any unmatched call instead of
        // throwing, matching the sibling pickers' own test harnesses.
        JSInterop.Mode = JSRuntimeMode.Loose;
        JSInterop.SetupVoid("eval", _ => true).SetVoidResult();
        JSInterop.Setup<string?>("eval", _ => true).SetResult(null);
    }

    private IRenderedComponent<PickerBar> RenderBar(
        System.Action<ComponentParameterCollectionBuilder<PickerBar>>? extra = null)
        => RenderComponent<PickerBar>(p =>
        {
            p.Add(x => x.Labels, Labels);
            p.Add(x => x.ThemesUrl, ThemesUrl);
            p.Add(x => x.Locales, Locales);
            extra?.Invoke(p);
        });

    // =================================================================
    // DefaultThemes — §3, §5.1
    // =================================================================

    [Fact]
    public void Section_5_1_DefaultThemes_Has_All_63_Slugs()
    {
        Assert.Equal(63, PickerBar.DefaultThemes.Count);
    }

    private static string LabelOf(string slug) =>
        PickerBar.DefaultThemeLabels.TryGetValue(slug, out var label)
            ? label
            : string.Join(" ", slug.Split('-').Select(w => char.ToUpperInvariant(w[0]) + w[1..]));

    [Fact]
    public void Section_5_1_DefaultThemes_Lists_Generic_Themes_First_Then_Official_Ones_By_Label()
    {
        var generic = PickerBar.DefaultThemes.Take(36).ToList();
        var official = PickerBar.DefaultThemes.Skip(36).Select(LabelOf).ToList();
        Assert.Equal(generic.OrderBy(t => t, System.StringComparer.Ordinal), generic);
        Assert.Equal(official.OrderBy(l => l, System.StringComparer.OrdinalIgnoreCase), official);
        Assert.Equal("wireframe", PickerBar.DefaultThemes[35]);
        Assert.Equal("adobe-spectrum", PickerBar.DefaultThemes[36]);
        Assert.Equal("vercel", PickerBar.DefaultThemes[^1]);
    }

    [Fact]
    public void Section_5_1_Abbreviations_And_Public_Bodies_Keep_Their_Own_Spelling()
    {
        Assert.Equal("IBM Carbon", LabelOf("ibm-carbon"));
        Assert.Equal("GitHub Primer", LabelOf("github-primer"));
        Assert.Equal("NHS England (patients)", LabelOf("united-kingdom-national-health-service-england-for-patients"));
        Assert.All(PickerBar.DefaultThemeLabels.Keys, slug => Assert.Contains(slug, PickerBar.DefaultThemes));
    }

    // =================================================================
    // theme-picker wiring — §5.1, §7.3, §7.6, §7.7
    // =================================================================

    [Fact]
    public void Section_7_3_Forwards_ThemesUrl_And_Uses_DefaultThemes_When_Themes_Omitted()
    {
        var cut = RenderBar();
        cut.Find("button[aria-label='Theme']").Click();
        var options = cut.FindAll(".theme-picker-option");
        Assert.Equal(63, options.Count);
        Assert.Equal("Abyss", options[0].TextContent);
        Assert.Equal("Adobe Spectrum", options[36].TextContent);
        Assert.Equal("IBM Carbon", options[47].TextContent);
    }

    [Fact]
    public void Section_7_6_Explicit_Themes_Overrides_The_Default()
    {
        var cut = RenderBar(p => p.Add(x => x.Themes, new[] { "light", "dark" }));
        cut.Find("button[aria-label='Theme']").Click();
        Assert.Equal(2, cut.FindAll(".theme-picker-option").Count);
    }

    [Fact]
    public void A_Consumers_Own_Theme_Label_Wins_Over_The_Default()
    {
        var cut = RenderBar(p => p.Add(
            x => x.ThemeAttributes,
            new Dictionary<string, object>
            {
                ["ThemeLabels"] = new Dictionary<string, string> { ["sap-fiori"] = "Fiori" },
            }));
        cut.Find("button[aria-label='Theme']").Click();
        var text = cut.FindAll(".theme-picker-option").Select(o => o.TextContent).ToList();
        Assert.Contains("Fiori", text);
        Assert.Contains("IBM Carbon", text);
        Assert.DoesNotContain("SAP Fiori", text);
    }

    [Fact]
    public void Section_7_7_ThemeAttributes_Reaches_ThemePicker()
    {
        var cut = RenderBar(p => p.Add(
            x => x.ThemeAttributes,
            new Dictionary<string, object> { ["StorageKey"] = "lily-theme" }));
        cut.Find("button[aria-label='Theme']").Click();
        cut.FindAll(".theme-picker-option")[0].Click();

        var sawStorageKey = JSInterop.Invocations.Any(inv =>
            inv.Identifier == "eval"
            && inv.Arguments.Count > 0
            && inv.Arguments[0] is string s
            && s.Contains("\"lily-theme\""));
        Assert.True(sawStorageKey, "Expected the storage key to reach ThemePicker's apply script");
    }

    // =================================================================
    // locale-picker wiring — §5.2, §7.4
    // =================================================================

    [Fact]
    public void Section_7_4_Forwards_The_Required_Locales_List()
    {
        var cut = RenderBar();
        cut.Find("button[aria-label='Language']").Click();
        Assert.Equal(Locales.Length, cut.FindAll(".locale-picker-option").Count);
    }

    // =================================================================
    // text-size-picker wiring — §5.3, §7.8, §7.9
    // =================================================================

    [Fact]
    public void Section_7_8_Uses_DefaultSizes_When_Sizes_Omitted_Largest_To_Smallest()
    {
        var cut = RenderBar();
        cut.Find("button[aria-label='Text size']").Click();
        var labels = cut.FindAll(".text-size-picker-option").Select(el => el.TextContent).ToList();
        Assert.Equal(
            new[] { "Largest", "Larger", "Large", "Normal", "Small", "Smaller", "Smallest" },
            labels);
    }

    [Fact]
    public void Section_7_9_Defaults_The_Initial_Value_To_Normal()
    {
        var cut = RenderBar();
        var hidden = cut.FindAll("input[type='hidden']")
            .First(el => el.GetAttribute("name") == "text-size");
        Assert.Equal("normal", hidden.GetAttribute("value"));
    }

    [Fact]
    public void Section_7_9_TextSizeAttributes_DefaultValue_Overrides_The_Built_In_Default()
    {
        var cut = RenderBar(p => p.Add(
            x => x.TextSizeAttributes,
            new Dictionary<string, object> { ["DefaultValue"] = "small" }));
        var hidden = cut.FindAll("input[type='hidden']")
            .First(el => el.GetAttribute("name") == "text-size");
        Assert.Equal("small", hidden.GetAttribute("value"));
    }

    // =================================================================
    // share-picker wiring — §5.4, §7.10
    // =================================================================

    [Fact]
    public void Section_7_10_Forwards_ShareTargets_To_SharePickers_List()
    {
        var targets = new List<ShareTarget>
        {
            new()
            {
                Id = "email",
                Label = "Email",
                Href = (url, _, _) => $"mailto:?body={url}",
            },
        };
        var cut = RenderBar(p => p.Add(x => x.ShareTargets, targets));
        cut.Find("button[aria-label='Share']").Click();
        Assert.Contains("Email", cut.Find(".share-picker-list").TextContent);
    }

    // =================================================================
    // search-picker wiring — §7.12, §7.13
    // =================================================================

    [Fact]
    public void Section_7_12_Search_Is_First_With_Field_And_Submit_Named_From_Labels()
    {
        var cut = RenderBar();
        var first = cut.Find("div.picker-bar").Children.First();
        Assert.Contains("search-picker", first.ClassList);

        cut.Find("div.picker-bar > div.search-picker button.search-picker-button").Click();
        // The panel is open and its field and ⏎ button carry the bar's labels.
        Assert.False(cut.Find(".search-picker-panel").HasAttribute("hidden"));
        Assert.Equal("search", cut.Find("input[aria-label='Search terms']").GetAttribute("type"));
        Assert.Equal("submit", cut.Find("button[aria-label='Search']").GetAttribute("type"));
        Assert.Equal("Search this site", cut.Find("form.search-picker-form").GetAttribute("aria-label"));
    }

    [Fact]
    public void Section_7_13_SearchAttributes_Reach_SearchPicker()
    {
        var navigated = new List<string>();
        var cut = RenderBar(p => p.Add(x => x.SearchAttributes, new Dictionary<string, object>
        {
            ["Action"] = "/search",
            ["Navigate"] = (System.Action<string>)(href => navigated.Add(href)),
        }));

        cut.Find("button.search-picker-button").Click();
        cut.Find("input.search-picker-input").Input("foo");
        cut.Find("form.search-picker-form").Submit();

        Assert.Equal(new[] { "/search?foo" }, navigated);
    }

    // =================================================================
    // link-picker wiring — §L1–§L4
    // =================================================================

    private static readonly List<LinkItem> PageLinks = new()
    {
        new LinkItem { Label = "Home", Href = "/" },
        new LinkItem { Label = "About Us", Href = "/about/" },
        new LinkItem { Label = "Contact Us", Href = "/contact/" },
        new LinkItem { Label = "Privacy Policy", Href = "/privacy/" },
    };

    private static readonly PickerBarLabels LabelsWithLink = Labels with { Link = "Pages" };

    private IRenderedComponent<PickerBar> RenderBarWithLinks(
        System.Action<ComponentParameterCollectionBuilder<PickerBar>>? extra = null)
        => RenderComponent<PickerBar>(p =>
        {
            p.Add(x => x.Labels, LabelsWithLink);
            p.Add(x => x.ThemesUrl, ThemesUrl);
            p.Add(x => x.Locales, Locales);
            p.Add(x => x.Links, PageLinks);
            extra?.Invoke(p);
        });

    [Fact]
    public void Section_L1_A_Link_Picker_Renders_First_When_Links_And_Labels_Link_Are_Given()
    {
        var cut = RenderBarWithLinks();
        var classes = cut.FindAll(".picker-bar > div").Select(d => d.GetAttribute("class")!.Split(' ')[0]).ToArray();
        Assert.Equal(new[] { "link-picker", "search-picker", "theme-picker", "locale-picker", "text-size-picker", "share-picker" }, classes);
        Assert.Equal("Pages", cut.Find("button.link-picker-button").GetAttribute("aria-label"));
        Assert.Equal(new[] { "Home", "About Us", "Contact Us", "Privacy Policy" },
            cut.FindAll("a.link-picker-link").Select(a => a.TextContent.Trim()));
    }

    [Fact]
    public void Section_L2_No_Link_Picker_Without_Links_Empty_Links_Or_Labels_Link()
    {
        var none = RenderBar();
        Assert.Empty(none.FindAll(".link-picker"));
        Assert.Contains("search-picker", none.Find(".picker-bar > div").GetAttribute("class"));

        var empty = RenderComponent<PickerBar>(p =>
        {
            p.Add(x => x.Labels, LabelsWithLink);
            p.Add(x => x.ThemesUrl, ThemesUrl);
            p.Add(x => x.Locales, Locales);
            p.Add(x => x.Links, new List<LinkItem>());
        });
        Assert.Empty(empty.FindAll(".link-picker"));

        var noLabel = RenderBar(p => p.Add(x => x.Links, PageLinks));
        Assert.Empty(noLabel.FindAll(".link-picker"));
    }

    [Fact]
    public void Section_L3_LinkAttributes_Reach_The_LinkPicker()
    {
        var cut = RenderBarWithLinks(p => p.Add(x => x.LinkAttributes, new Dictionary<string, object> { ["data-x"] = "1" }));
        Assert.Equal("1", cut.Find("div.link-picker").GetAttribute("data-x"));
    }

    [Fact]
    public void Section_L4_The_Links_Are_Real_Anchors_Not_Menu_Items()
    {
        var cut = RenderBarWithLinks();
        Assert.Equal(4, cut.FindAll(".link-picker-list a[href]").Count);
        Assert.Empty(cut.FindAll(".link-picker-list [role=menuitem]"));
    }

    // =================================================================
    // TimeZonePicker wiring — §T1–§T3
    // =================================================================

    private static readonly PickerBarLabels LabelsWithTimeZone = new()
    {
        Search = "Search this site",
        SearchInput = "Search terms",
        SearchSubmit = "Search",
        Theme = "Theme",
        Locale = "Language",
        TimeZone = "Time zone",
        TextSize = "Text size",
        Share = "Share",
    };

    [Fact]
    public void Section_T1_TimeZonePicker_Renders_After_The_Locale_Picker_When_Label_And_Locale_Are_Given()
    {
        var cut = RenderComponent<PickerBar>(p =>
        {
            p.Add(x => x.Labels, LabelsWithTimeZone);
            p.Add(x => x.ThemesUrl, ThemesUrl);
            p.Add(x => x.Locales, Locales);
            p.Add(x => x.TimeZoneLocale, "en");
        });
        var kinds = cut.FindAll(".picker-bar > div").Select(d => d.ClassList.First()).ToArray();
        Assert.Equal(new[] { "search-picker", "theme-picker", "locale-picker", "time-zone-picker", "text-size-picker", "share-picker" }, kinds);
        Assert.Equal("Time zone", cut.Find(".time-zone-picker-button").GetAttribute("aria-label"));
    }

    [Fact]
    public void Section_T2_No_TimeZonePicker_Without_Label_Or_Locale()
    {
        Assert.Empty(RenderBar().FindAll(".time-zone-picker"));
        Assert.Empty(RenderBar(p => p.Add(x => x.TimeZoneLocale, "en")).FindAll(".time-zone-picker"));
        var noLocale = RenderComponent<PickerBar>(p =>
        {
            p.Add(x => x.Labels, LabelsWithTimeZone);
            p.Add(x => x.ThemesUrl, ThemesUrl);
            p.Add(x => x.Locales, Locales);
        });
        Assert.Empty(noLocale.FindAll(".time-zone-picker"));
    }

    [Fact]
    public void Section_T3_TimeZoneAttributes_Reach_The_TimeZonePicker()
    {
        var cut = RenderComponent<PickerBar>(p =>
        {
            p.Add(x => x.Labels, LabelsWithTimeZone);
            p.Add(x => x.ThemesUrl, ThemesUrl);
            p.Add(x => x.Locales, Locales);
            p.Add(x => x.TimeZoneLocale, "en");
            p.Add(x => x.TimeZoneAttributes, new Dictionary<string, object> { ["Zones"] = new[] { "UTC", "Europe/London" } });
        });
        Assert.Equal(2, cut.FindAll(".time-zone-picker-option").Count);
    }

    // search is optional — tasks.md P28-T7
    [Fact]
    public void Without_Labels_Search_there_is_no_search_picker_and_theme_comes_first()
    {
        var cut = RenderComponent<PickerBar>(p =>
        {
            p.Add(x => x.Labels, Labels with { Search = null, SearchInput = null, SearchSubmit = null });
            p.Add(x => x.ThemesUrl, ThemesUrl);
            p.Add(x => x.Locales, Locales);
        });
        Assert.Empty(cut.FindAll(".search-picker"));
        Assert.Contains("theme-picker", cut.Find("div.picker-bar > div").ClassList);
    }
}
