using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class ContentsLinkTests : TestContext
{
    [Fact]
    public void Renders_with_kebab_base_class()
    {
        var cut = RenderComponent<ContentsLink>(p => p
            .AddChildContent("body"));
        var root = cut.Find(".contents-link");
        Assert.NotNull(root);
    }

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class()
    {
        var cut = RenderComponent<ContentsLink>(p => p
            .AddChildContent("body")
            .Add(x => x.CssClass, "extra"));
        var root = cut.Find(".contents-link");
        Assert.Contains("extra", root.GetAttribute("class"));
    }

    [Fact]
    public void AdditionalAttributes_pass_through_to_root()
    {
        var cut = RenderComponent<ContentsLink>(p => p
            .AddChildContent("body")
            .AddUnmatched("data-test", "value"));
        var root = cut.Find(".contents-link");
        Assert.Equal("value", root.GetAttribute("data-test"));
    }

    [Fact]
    public void CountLabel_renders_inside_the_link()
    {
        var cut = RenderComponent<ContentsLink>(p => p
            .Add(x => x.Href, "#a").Add(x => x.Count, 3).Add(x => x.CountLabel, "3 to do").AddChildContent("Address"));
        Assert.Equal("3 to do", cut.Find("a .contents-link-count").TextContent);
    }

    [Fact]
    public void No_CountLabel_renders_no_count_element()
    {
        var cut = RenderComponent<ContentsLink>(p => p.Add(x => x.Href, "#a").Add(x => x.Count, 3).AddChildContent("Address"));
        Assert.Empty(cut.FindAll(".contents-link-count"));
    }

    [Fact]
    public void Count_sets_data_count_zero_adds_data_complete_none_sets_neither()
    {
        var three = RenderComponent<ContentsLink>(p => p.Add(x => x.Href, "#a").Add(x => x.Count, 3).AddChildContent("x")).Find("a");
        Assert.Equal("3", three.GetAttribute("data-count"));
        Assert.False(three.HasAttribute("data-complete"));
        var zero = RenderComponent<ContentsLink>(p => p.Add(x => x.Href, "#a").Add(x => x.Count, 0).AddChildContent("x")).Find("a");
        Assert.Equal("0", zero.GetAttribute("data-count"));
        Assert.True(zero.HasAttribute("data-complete"));
        var none = RenderComponent<ContentsLink>(p => p.Add(x => x.Href, "#a").AddChildContent("x")).Find("a");
        Assert.False(none.HasAttribute("data-count"));
        Assert.False(none.HasAttribute("data-complete"));
    }
}
