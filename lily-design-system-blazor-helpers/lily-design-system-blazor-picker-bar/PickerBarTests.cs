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
    public void Section_5_1_DefaultThemes_Has_All_45_Slugs()
    {
        Assert.Equal(45, PickerBar.DefaultThemes.Count);
    }

    [Fact]
    public void Section_5_1_DefaultThemes_Is_Alphabetical_With_UkUs_Group_At_Bottom()
    {
        var nonUkUs = PickerBar.DefaultThemes.Where(t => !t.StartsWith("united-")).ToList();
        var ukUs = PickerBar.DefaultThemes.Where(t => t.StartsWith("united-")).ToList();
        Assert.Equal(nonUkUs.OrderBy(t => t, System.StringComparer.Ordinal), nonUkUs);
        Assert.Equal(ukUs.OrderBy(t => t, System.StringComparer.Ordinal), ukUs);
        Assert.Equal(nonUkUs.Concat(ukUs), PickerBar.DefaultThemes);
    }

    [Fact]
    public void Section_5_1_DefaultThemes_First_And_Last()
    {
        Assert.Equal("abyss", PickerBar.DefaultThemes[0]);
        Assert.Equal("united-states-web-design-system", PickerBar.DefaultThemes[^1]);
    }

    // =================================================================
    // DefaultSizes — §3, §5.2
    // =================================================================

    [Fact]
    public void Section_5_2_DefaultSizes_Is_The_Seven_Step_Scale()
    {
        Assert.Equal(
            new[] { "largest", "larger", "large", "normal", "small", "smaller", "smallest" },
            PickerBar.DefaultSizes);
    }

    // =================================================================
    // Composition — §7.1–§7.5
    // =================================================================

    [Fact]
    public void Section_7_1_Renders_Root_With_Base_Class_Plus_Consumer_Class()
    {
        var cut = RenderBar(p => p.Add(x => x.CssClass, "my-picker-bar"));
        var root = cut.Find("div.picker-bar");
        Assert.Contains("my-picker-bar", root.ClassList);
    }

    [Fact]
    public void Section_7_2_Renders_All_Four_Pickers_Each_Named_From_Labels()
    {
        var cut = RenderBar();
        Assert.NotNull(cut.Find("button[aria-label='Theme']"));
        Assert.NotNull(cut.Find("button[aria-label='Language']"));
        Assert.NotNull(cut.Find("button[aria-label='Text size']"));
        Assert.NotNull(cut.Find("button[aria-label='Share']"));
    }

    [Fact]
    public void Section_7_2_Renders_The_Four_Picker_Roots_In_Order()
    {
        var cut = RenderBar();
        var roots = cut.Find("div.picker-bar").Children
            .Select(el => el.ClassList.FirstOrDefault())
            .ToList();
        Assert.Equal(
            new[] { "theme-picker", "locale-picker", "text-size-picker", "share-picker" },
            roots);
    }

    [Fact]
    public void Section_7_5_Spreads_Extra_Attributes_Onto_Root()
    {
        var cut = RenderBar(p => p.AddUnmatched("data-testid", "header-picker-bar"));
        var root = cut.Find("div.picker-bar");
        Assert.Equal("header-picker-bar", root.GetAttribute("data-testid"));
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
        Assert.Equal(45, options.Count);
        Assert.Equal("Abyss", options[0].TextContent);
        Assert.Equal("United Kingdom Government Digital Service", options[37].TextContent);
    }

    [Fact]
    public void Section_7_6_Explicit_Themes_Overrides_The_Default()
    {
        var cut = RenderBar(p => p.Add(x => x.Themes, new[] { "light", "dark" }));
        cut.Find("button[aria-label='Theme']").Click();
        Assert.Equal(2, cut.FindAll(".theme-picker-option").Count);
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
}
