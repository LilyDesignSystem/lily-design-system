using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class SummaryListItemTests : TestContext
{
    [Fact]
    public void Renders_with_kebab_base_class()
    {
        var cut = RenderComponent<SummaryListItem>(p => p
            .AddChildContent("body"));
        var root = cut.Find(".summary-list-item");
        Assert.NotNull(root);
    }

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class()
    {
        var cut = RenderComponent<SummaryListItem>(p => p
            .AddChildContent("body")
            .Add(x => x.CssClass, "extra"));
        var root = cut.Find(".summary-list-item");
        Assert.Contains("extra", root.GetAttribute("class"));
    }

    [Fact]
    public void AdditionalAttributes_pass_through_to_root()
    {
        var cut = RenderComponent<SummaryListItem>(p => p
            .AddChildContent("body")
            .AddUnmatched("data-test", "value"));
        var root = cut.Find(".summary-list-item");
        Assert.Equal("value", root.GetAttribute("data-test"));
    }

    [Fact]
    public void Renders_a_div_holding_the_term_and_the_value()
    {
        var cut = RenderComponent<SummaryListItem>(p => p
            .AddChildContent("Ada")
            .Add(x => x.Term, "Name"));
        Assert.Equal("DIV", cut.Find(".summary-list-item").TagName);
        Assert.Equal("Name", cut.Find("dt").TextContent);
        Assert.Equal("Ada", cut.Find("dd").TextContent);
    }
}
