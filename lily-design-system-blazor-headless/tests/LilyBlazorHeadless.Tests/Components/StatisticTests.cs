using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class StatisticTests : TestContext
{
    [Fact]
    public void Renders_with_kebab_base_class()
    {
        var cut = RenderComponent<Statistic>(p => p
            .AddChildContent("body"));
        var root = cut.Find(".statistic");
        Assert.NotNull(root);
    }

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class()
    {
        var cut = RenderComponent<Statistic>(p => p
            .AddChildContent("body")
            .Add(x => x.CssClass, "extra"));
        var root = cut.Find(".statistic");
        Assert.Contains("extra", root.GetAttribute("class"));
    }

    [Fact]
    public void AdditionalAttributes_pass_through_to_root()
    {
        var cut = RenderComponent<Statistic>(p => p
            .AddChildContent("body")
            .AddUnmatched("data-test", "value"));
        var root = cut.Find(".statistic");
        Assert.Equal("value", root.GetAttribute("data-test"));
    }

    [Fact]
    public void A_change_is_text_with_the_direction_as_data_trend()
    {
        var cut = RenderComponent<Statistic>(p => p
            .Add(x => x.Label, "Index")
            .Add(x => x.Change, "0.5 more than October 2024")
            .Add(x => x.Trend, "up"));
        var change = cut.Find(".statistic-change");
        Assert.Equal("0.5 more than October 2024", change.TextContent);
        Assert.Equal("up", change.GetAttribute("data-trend"));
    }

    [Fact]
    public void The_as_of_line_is_a_time_element_shown_only_with_its_words()
    {
        var without = RenderComponent<Statistic>(p => p.Add(x => x.AsOf, "2024-12-01"));
        Assert.Empty(without.FindAll(".statistic-as-of"));
        var cut = RenderComponent<Statistic>(p => p
            .Add(x => x.AsOf, "2024-12-01")
            .Add(x => x.AsOfLabel, "Data as of 1 December 2024"));
        var time = cut.Find("time.statistic-as-of");
        Assert.Equal("2024-12-01", time.GetAttribute("datetime"));
        Assert.Equal("Data as of 1 December 2024", time.TextContent);
    }

    [Fact]
    public void Without_a_change_there_is_no_change_part()
    {
        var cut = RenderComponent<Statistic>(p => p.Add(x => x.Trend, "down"));
        Assert.Empty(cut.FindAll(".statistic-change"));
        Assert.Empty(cut.FindAll("[data-trend]"));
    }
}
