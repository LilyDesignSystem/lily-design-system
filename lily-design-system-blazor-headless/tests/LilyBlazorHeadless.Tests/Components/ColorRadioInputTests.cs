using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class ColorRadioInputTests : TestContext
{
    [Fact]
    public void Renders_with_kebab_base_class()
    {
        var cut = RenderComponent<ColorRadioInput>(p => { });
        var root = cut.Find(".color-radio-input");
        Assert.NotNull(root);
    }

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class()
    {
        var cut = RenderComponent<ColorRadioInput>(p => p
            .Add(x => x.CssClass, "extra"));
        var root = cut.Find(".color-radio-input");
        Assert.Contains("extra", root.GetAttribute("class"));
    }

    [Fact]
    public void AdditionalAttributes_pass_through_to_root()
    {
        var cut = RenderComponent<ColorRadioInput>(p => p
            .AddUnmatched("data-test", "value"));
        var root = cut.Find(".color-radio-input");
        Assert.Equal("value", root.GetAttribute("data-test"));
    }

    [Fact]
    public void Names_itself_with_aria_label()
    {
        var cut = RenderComponent<ColorRadioInput>(p => p.Add(x => x.Label, "Name"));
        Assert.Equal("Name", cut.Find("input.color-radio-input").GetAttribute("aria-label"));
    }

    [Fact]
    public void Exposes_its_colour_and_submits_it_by_default()
    {
        var cut = RenderComponent<ColorRadioInput>(p => p.Add(x => x.Color, "#005eb8").Add(x => x.Label, "Blue"));
        var root = cut.Find("input.color-radio-input");
        Assert.Equal("#005eb8", root.GetAttribute("data-color"));
        Assert.Equal("#005eb8", root.GetAttribute("value"));
        Assert.Equal("--color-radio-input-color: #005eb8", root.GetAttribute("style"));
    }
}
