using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class RedAmberGreenViewTests : TestContext
{
    [Fact]
    public void Renders_with_kebab_base_class()
    {
        var cut = RenderComponent<RedAmberGreenView>(p => p
            .AddChildContent("body"));
        var root = cut.Find(".red-amber-green-view");
        Assert.NotNull(root);
    }

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class()
    {
        var cut = RenderComponent<RedAmberGreenView>(p => p
            .AddChildContent("body")
            .Add(x => x.CssClass, "extra"));
        var root = cut.Find(".red-amber-green-view");
        Assert.Contains("extra", root.GetAttribute("class"));
    }

    [Fact]
    public void AdditionalAttributes_pass_through_to_root()
    {
        var cut = RenderComponent<RedAmberGreenView>(p => p
            .AddChildContent("body")
            .AddUnmatched("data-test", "value"));
        var root = cut.Find(".red-amber-green-view");
        Assert.Equal("value", root.GetAttribute("data-test"));
    }

    [Fact]
    public void Renders_Value_as_data_value_and_as_text()
    {
        var cut = RenderComponent<RedAmberGreenView>(p => p.Add(x => x.Value, "amber"));
        Assert.Equal("amber", cut.Find(".red-amber-green-view").GetAttribute("data-value"));
        Assert.Contains("amber", cut.Find(".red-amber-green-view").TextContent);
        Assert.False(RenderComponent<RedAmberGreenView>().Find(".red-amber-green-view").HasAttribute("data-value"));
    }
}
