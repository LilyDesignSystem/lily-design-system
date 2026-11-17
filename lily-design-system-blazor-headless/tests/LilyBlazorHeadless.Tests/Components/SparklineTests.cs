using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class SparklineTests : TestContext
{
    [Fact]
    public void Renders_with_kebab_base_class()
    {
        var cut = RenderComponent<Sparkline>(p => p
            .AddChildContent("body"));
        var root = cut.Find(".sparkline");
        Assert.NotNull(root);
    }

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class()
    {
        var cut = RenderComponent<Sparkline>(p => p
            .AddChildContent("body")
            .Add(x => x.CssClass, "extra"));
        var root = cut.Find(".sparkline");
        Assert.Contains("extra", root.GetAttribute("class"));
    }

    [Fact]
    public void AdditionalAttributes_pass_through_to_root()
    {
        var cut = RenderComponent<Sparkline>(p => p
            .AddChildContent("body")
            .AddUnmatched("data-test", "value"));
        var root = cut.Find(".sparkline");
        Assert.Equal("value", root.GetAttribute("data-test"));
    }

    [Fact]
    public void Below_MinimumPoints_shows_the_words_as_text_not_the_graphic()
    {
        var cut = RenderComponent<Sparkline>(p => p
            .Add(x => x.Label, "Weight trend")
            .Add(x => x.PointCount, 2)
            .Add(x => x.MinimumPoints, 3)
            .Add(x => x.InsufficientLabel, "Not enough readings for a trend")
            .AddChildContent("<svg></svg>"));
        var root = cut.Find(".sparkline");
        Assert.True(root.HasAttribute("data-insufficient"));
        Assert.Null(root.GetAttribute("role"));
        Assert.Empty(cut.FindAll("svg"));
        Assert.Equal("Not enough readings for a trend", cut.Find(".sparkline-insufficient").TextContent);
    }
}
