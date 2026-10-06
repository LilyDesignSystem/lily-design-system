using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class ReviewDateTests : TestContext
{
    [Fact]
    public void Renders_with_kebab_base_class()
    {
        var cut = RenderComponent<ReviewDate>(p => p
            .AddChildContent("body"));
        var root = cut.Find(".review-date");
        Assert.NotNull(root);
    }

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class()
    {
        var cut = RenderComponent<ReviewDate>(p => p
            .AddChildContent("body")
            .Add(x => x.CssClass, "extra"));
        var root = cut.Find(".review-date");
        Assert.Contains("extra", root.GetAttribute("class"));
    }

    [Fact]
    public void AdditionalAttributes_pass_through_to_root()
    {
        var cut = RenderComponent<ReviewDate>(p => p
            .AddChildContent("body")
            .AddUnmatched("data-test", "value"));
        var root = cut.Find(".review-date");
        Assert.Equal("value", root.GetAttribute("data-test"));
    }

    [Fact]
    public void Renders_a_time_element()
    {
        var cut = RenderComponent<ReviewDate>(p => p
            .Add(x => x.Label, "Last reviewed")
            .Add(x => x.Datetime, "2026-10-06")
            .AddChildContent("6 October 2026"));
        var root = cut.Find("time.review-date");
        Assert.Equal("2026-10-06", root.GetAttribute("datetime"));
        Assert.Equal("Last reviewed", root.GetAttribute("aria-label"));
        Assert.Equal("6 October 2026", root.TextContent);
    }

    [Fact]
    public void Omits_datetime_when_not_given()
    {
        var cut = RenderComponent<ReviewDate>(p => p.AddChildContent("soon"));
        Assert.Null(cut.Find("time").GetAttribute("datetime"));
    }
}
