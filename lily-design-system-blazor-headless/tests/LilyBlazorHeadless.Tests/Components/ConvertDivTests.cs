using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class ConvertDivTests : TestContext
{
    [Fact]
    public void Renders_with_kebab_base_class()
    {
        var cut = RenderComponent<ConvertDiv>(p => p
            .Add(x => x.Label, "Currency converter")
            .AddChildContent("body"));
        var root = cut.Find("div.convert-div");
        Assert.NotNull(root);
    }

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class()
    {
        var cut = RenderComponent<ConvertDiv>(p => p
            .Add(x => x.Label, "Currency converter")
            .AddChildContent("body")
            .Add(x => x.CssClass, "extra"));
        var root = cut.Find(".convert-div");
        Assert.Contains("extra", root.GetAttribute("class"));
    }

    [Fact]
    public void AdditionalAttributes_pass_through_to_root()
    {
        var cut = RenderComponent<ConvertDiv>(p => p
            .Add(x => x.Label, "Currency converter")
            .AddChildContent("body")
            .AddUnmatched("data-test", "value"));
        var root = cut.Find(".convert-div");
        Assert.Equal("value", root.GetAttribute("data-test"));
    }

    [Fact]
    public void Is_a_named_group()
    {
        var cut = RenderComponent<ConvertDiv>(p => p
            .Add(x => x.Label, "Currency converter")
            .AddChildContent("body"));
        var root = cut.Find(".convert-div");
        Assert.Equal("group", root.GetAttribute("role"));
        Assert.Equal("Currency converter", root.GetAttribute("aria-label"));
    }
}
