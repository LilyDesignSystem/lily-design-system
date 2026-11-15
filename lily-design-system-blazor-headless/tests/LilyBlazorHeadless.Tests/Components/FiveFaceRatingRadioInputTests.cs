using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class FiveFaceRatingRadioInputTests : TestContext
{
    [Fact]
    public void Renders_with_kebab_base_class()
    {
        var cut = RenderComponent<FiveFaceRatingRadioInput>(p => { });
        var root = cut.Find(".five-face-rating-radio-input");
        Assert.NotNull(root);
    }

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class()
    {
        var cut = RenderComponent<FiveFaceRatingRadioInput>(p => p
            .Add(x => x.CssClass, "extra"));
        var root = cut.Find(".five-face-rating-radio-input");
        Assert.Contains("extra", root.GetAttribute("class"));
    }

    [Fact]
    public void AdditionalAttributes_pass_through_to_root()
    {
        var cut = RenderComponent<FiveFaceRatingRadioInput>(p => p
            .AddUnmatched("data-test", "value"));
        var root = cut.Find(".five-face-rating-radio-input");
        Assert.Equal("value", root.GetAttribute("data-test"));
    }

    [Fact]
    public void Names_itself_with_aria_label()
    {
        var cut = RenderComponent<FiveFaceRatingRadioInput>(p => p.Add(x => x.Label, "Name"));
        Assert.Equal("Name", cut.Find("input.five-face-rating-radio-input").GetAttribute("aria-label"));
    }

    [Fact]
    public void Exposes_its_value_in_data_value()
    {
        var cut = RenderComponent<FiveFaceRatingRadioInput>(p => p.Add(x => x.Label, "A").Add(x => x.Value, "4"));
        var root = cut.Find("input.five-face-rating-radio-input");
        Assert.Equal("4", root.GetAttribute("value"));
        Assert.Equal("4", root.GetAttribute("data-value"));
    }
}
