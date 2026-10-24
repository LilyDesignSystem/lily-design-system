using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class ConvertFromValueDivTests : TestContext
{
    [Fact]
    public void Renders_with_kebab_base_class()
    {
        var cut = RenderComponent<ConvertFromValueDiv>(p => p
            .AddChildContent("body"));
        var root = cut.Find("div.convert-from-value-div");
        Assert.NotNull(root);
    }

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class()
    {
        var cut = RenderComponent<ConvertFromValueDiv>(p => p
            .AddChildContent("body")
            .Add(x => x.CssClass, "extra"));
        var root = cut.Find(".convert-from-value-div");
        Assert.Contains("extra", root.GetAttribute("class"));
    }

    [Fact]
    public void AdditionalAttributes_pass_through_to_root()
    {
        var cut = RenderComponent<ConvertFromValueDiv>(p => p
            .AddChildContent("body")
            .AddUnmatched("data-test", "value"));
        var root = cut.Find(".convert-from-value-div");
        Assert.Equal("value", root.GetAttribute("data-test"));
    }

    [Fact]
    public void Has_no_role_and_no_aria_label()
    {
        var cut = RenderComponent<ConvertFromValueDiv>(p => p
            .AddChildContent("body"));
        var root = cut.Find(".convert-from-value-div");
        Assert.Null(root.GetAttribute("role"));
        Assert.Null(root.GetAttribute("aria-label"));
    }
}
