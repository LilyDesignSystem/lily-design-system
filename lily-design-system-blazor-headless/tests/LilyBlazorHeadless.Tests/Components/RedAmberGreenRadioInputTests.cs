using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class RedAmberGreenRadioInputTests : TestContext
{
    [Fact]
    public void Renders_with_kebab_base_class()
    {
        var cut = RenderComponent<RedAmberGreenRadioInput>(p => { });
        var root = cut.Find(".red-amber-green-radio-input");
        Assert.NotNull(root);
    }

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class()
    {
        var cut = RenderComponent<RedAmberGreenRadioInput>(p => p
            .Add(x => x.CssClass, "extra"));
        var root = cut.Find(".red-amber-green-radio-input");
        Assert.Contains("extra", root.GetAttribute("class"));
    }

    [Fact]
    public void AdditionalAttributes_pass_through_to_root()
    {
        var cut = RenderComponent<RedAmberGreenRadioInput>(p => p
            .AddUnmatched("data-test", "value"));
        var root = cut.Find(".red-amber-green-radio-input");
        Assert.Equal("value", root.GetAttribute("data-test"));
    }

    [Fact]
    public void Names_itself_with_aria_label()
    {
        var cut = RenderComponent<RedAmberGreenRadioInput>(p => p.Add(x => x.Label, "Name"));
        Assert.Equal("Name", cut.Find("input.red-amber-green-radio-input").GetAttribute("aria-label"));
    }

    [Fact]
    public void Exposes_its_value_in_data_value()
    {
        var cut = RenderComponent<RedAmberGreenRadioInput>(p => p.Add(x => x.Label, "A").Add(x => x.Value, "amber"));
        var root = cut.Find("input.red-amber-green-radio-input");
        Assert.Equal("amber", root.GetAttribute("value"));
        Assert.Equal("amber", root.GetAttribute("data-value"));
    }
}
