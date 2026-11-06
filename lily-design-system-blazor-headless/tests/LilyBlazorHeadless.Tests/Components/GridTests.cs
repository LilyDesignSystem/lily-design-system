using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class GridTests : TestContext
{
    [Fact]
    public void Renders_with_kebab_base_class()
    {
        var cut = RenderComponent<Grid>(p => p
            .AddChildContent("body"));
        var root = cut.Find(".grid");
        Assert.NotNull(root);
    }

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class()
    {
        var cut = RenderComponent<Grid>(p => p
            .AddChildContent("body")
            .Add(x => x.CssClass, "extra"));
        var root = cut.Find(".grid");
        Assert.Contains("extra", root.GetAttribute("class"));
    }

    [Fact]
    public void AdditionalAttributes_pass_through_to_root()
    {
        var cut = RenderComponent<Grid>(p => p
            .AddChildContent("body")
            .AddUnmatched("data-test", "value"));
        var root = cut.Find(".grid");
        Assert.Equal("value", root.GetAttribute("data-test"));
    }

    [Fact]
    public void Defaults_to_twelve_equal_columns()
    {
        var cut = RenderComponent<Grid>(p => p.AddChildContent("body"));
        Assert.Contains("repeat(12, minmax(0, 1fr))", cut.Find(".grid").GetAttribute("style"));
    }

    [Fact]
    public void MinColumnWidth_generates_a_fluid_auto_fit_template()
    {
        var cut = RenderComponent<Grid>(p => p
            .AddChildContent("body")
            .Add(x => x.MinColumnWidth, "12rem"));
        var root = cut.Find(".grid");
        Assert.Contains("repeat(auto-fit, minmax(min(12rem, 100%), 1fr))", root.GetAttribute("style"));
        Assert.Equal("12rem", root.GetAttribute("data-min-column-width"));
    }

    [Fact]
    public void MinColumnWidth_wins_over_Columns()
    {
        var cut = RenderComponent<Grid>(p => p
            .AddChildContent("body")
            .Add(x => x.Columns, "3")
            .Add(x => x.MinColumnWidth, "120px"));
        var style = cut.Find(".grid").GetAttribute("style");
        Assert.Contains("min(120px, 100%)", style);
        Assert.DoesNotContain("repeat(3,", style);
    }

    [Fact]
    public void Never_names_its_root()
    {
        var cut = RenderComponent<Grid>();
        Assert.False(cut.Find(".grid").HasAttribute("aria-label"));
    }
}
