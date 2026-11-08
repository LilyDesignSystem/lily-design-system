using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class FiveFaceRatingViewTests : TestContext
{
    [Fact]
    public void Renders_with_kebab_base_class()
    {
        var cut = RenderComponent<FiveFaceRatingView>(p => p
            .AddChildContent("body"));
        var root = cut.Find(".five-face-rating-view");
        Assert.NotNull(root);
    }

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class()
    {
        var cut = RenderComponent<FiveFaceRatingView>(p => p
            .AddChildContent("body")
            .Add(x => x.CssClass, "extra"));
        var root = cut.Find(".five-face-rating-view");
        Assert.Contains("extra", root.GetAttribute("class"));
    }

    [Fact]
    public void AdditionalAttributes_pass_through_to_root()
    {
        var cut = RenderComponent<FiveFaceRatingView>(p => p
            .AddChildContent("body")
            .AddUnmatched("data-test", "value"));
        var root = cut.Find(".five-face-rating-view");
        Assert.Equal("value", root.GetAttribute("data-test"));
    }

    [Fact]
    public void Renders_data_value_and_the_face_label_for_the_value()
    {
        var root = RenderComponent<FiveFaceRatingView>(p => p.Add(x => x.Label, "Rating").Add(x => x.Value, 4)
            .Add(x => x.Labels, new[] { "Very poor", "Poor", "Fair", "Good", "Very good" })).Find(".five-face-rating-view");
        Assert.Equal("4", root.GetAttribute("data-value"));
        Assert.Equal("Good", root.TextContent.Trim());
    }
}
