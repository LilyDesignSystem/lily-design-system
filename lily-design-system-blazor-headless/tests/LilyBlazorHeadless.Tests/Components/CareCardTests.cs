using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class CareCardTests : TestContext
{
    [Fact]
    public void Renders_with_kebab_base_class()
    {
        var cut = RenderComponent<CareCard>(p => p
            .AddChildContent("body"));
        var root = cut.Find(".care-card");
        Assert.NotNull(root);
    }

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class()
    {
        var cut = RenderComponent<CareCard>(p => p
            .AddChildContent("body")
            .Add(x => x.CssClass, "extra"));
        var root = cut.Find(".care-card");
        Assert.Contains("extra", root.GetAttribute("class"));
    }

    [Fact]
    public void AdditionalAttributes_pass_through_to_root()
    {
        var cut = RenderComponent<CareCard>(p => p
            .AddChildContent("body")
            .AddUnmatched("data-test", "value"));
        var root = cut.Find(".care-card");
        Assert.Equal("value", root.GetAttribute("data-test"));
    }

    [Fact]
    public void Renders_Type_as_data_type_for_the_themes()
    {
        Assert.Equal("non-urgent", RenderComponent<CareCard>().Find(".care-card").GetAttribute("data-type"));
        Assert.Equal("immediate", RenderComponent<CareCard>(p => p.Add(x => x.Type, "immediate")).Find(".care-card").GetAttribute("data-type"));
    }
}
