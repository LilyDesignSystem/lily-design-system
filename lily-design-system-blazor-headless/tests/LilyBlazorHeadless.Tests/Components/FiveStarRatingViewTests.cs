using System.Linq;
using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class FiveStarRatingViewTests : TestContext
{
    [Fact]
    public void Renders_with_kebab_base_class()
    {
        var cut = RenderComponent<FiveStarRatingView>(p => p
            .AddChildContent("body"));
        var root = cut.Find(".five-star-rating-view");
        Assert.NotNull(root);
    }

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class()
    {
        var cut = RenderComponent<FiveStarRatingView>(p => p
            .AddChildContent("body")
            .Add(x => x.CssClass, "extra"));
        var root = cut.Find(".five-star-rating-view");
        Assert.Contains("extra", root.GetAttribute("class"));
    }

    [Fact]
    public void AdditionalAttributes_pass_through_to_root()
    {
        var cut = RenderComponent<FiveStarRatingView>(p => p
            .AddChildContent("body")
            .AddUnmatched("data-test", "value"));
        var root = cut.Find(".five-star-rating-view");
        Assert.Equal("value", root.GetAttribute("data-test"));
    }

    [Fact]
    public void Renders_data_value_and_five_stars_each_with_data_filled()
    {
        var root = RenderComponent<FiveStarRatingView>(p => p.Add(x => x.Label, "3 out of 5").Add(x => x.Value, 3)).Find(".five-star-rating-view");
        Assert.Equal("3", root.GetAttribute("data-value"));
        var stars = root.QuerySelectorAll("span[aria-hidden='true']");
        Assert.Equal(5, stars.Length);
        Assert.Equal(new[] { "true", "true", "true", "false", "false" }, stars.Select(s => s.GetAttribute("data-filled")).ToArray());
    }
}
