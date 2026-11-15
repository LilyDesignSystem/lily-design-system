using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class FiveFaceRatingRadioGroupTests : TestContext
{
    [Fact]
    public void Renders_with_kebab_base_class()
    {
        var cut = RenderComponent<FiveFaceRatingRadioGroup>(p => p
            .AddChildContent("body"));
        var root = cut.Find(".five-face-rating-radio-group");
        Assert.NotNull(root);
    }

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class()
    {
        var cut = RenderComponent<FiveFaceRatingRadioGroup>(p => p
            .AddChildContent("body")
            .Add(x => x.CssClass, "extra"));
        var root = cut.Find(".five-face-rating-radio-group");
        Assert.Contains("extra", root.GetAttribute("class"));
    }

    [Fact]
    public void AdditionalAttributes_pass_through_to_root()
    {
        var cut = RenderComponent<FiveFaceRatingRadioGroup>(p => p
            .AddChildContent("body")
            .AddUnmatched("data-test", "value"));
        var root = cut.Find(".five-face-rating-radio-group");
        Assert.Equal("value", root.GetAttribute("data-test"));
    }

    [Fact]
    public void Root_is_a_fieldset_with_role_radiogroup()
    {
        var cut = RenderComponent<FiveFaceRatingRadioGroup>(p => p.AddChildContent("body"));
        var root = cut.Find(".five-face-rating-radio-group");
        Assert.Equal("FIELDSET", root.TagName);
        Assert.Equal("radiogroup", root.GetAttribute("role"));
    }
}
