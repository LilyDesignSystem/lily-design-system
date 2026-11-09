using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class AddressInputTests : TestContext
{
    [Fact]
    public void Renders_with_kebab_base_class()
    {
        var cut = RenderComponent<AddressInput>(p => { });
        var root = cut.Find(".address-input");
        Assert.NotNull(root);
    }

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class()
    {
        var cut = RenderComponent<AddressInput>(p => p
            .Add(x => x.CssClass, "extra"));
        var root = cut.Find(".address-input");
        Assert.Contains("extra", root.GetAttribute("class"));
    }

    [Fact]
    public void AdditionalAttributes_pass_through_to_root()
    {
        var cut = RenderComponent<AddressInput>(p => p
            .AddUnmatched("data-test", "value"));
        var root = cut.Find(".address-input");
        Assert.Equal("value", root.GetAttribute("data-test"));
    }

    [Fact]
    public void Is_a_named_group_holding_the_fields()
    {
        var cut = RenderComponent<AddressInput>(p => p
            .Add(x => x.Label, "Delivery address")
            .AddChildContent("<input id=\"street\" />"));
        var root = cut.Find(".address-input");
        Assert.Equal("DIV", root.TagName);
        Assert.Equal("group", root.GetAttribute("role"));
        Assert.Equal("Delivery address", root.GetAttribute("aria-label"));
        Assert.NotNull(root.QuerySelector("input#street"));
    }
}
