using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class AlertTests : TestContext
{
    [Fact]
    public void Renders_with_kebab_base_class()
    {
        var cut = RenderComponent<Alert>(p => p
            .AddChildContent("body"));
        var root = cut.Find(".alert");
        Assert.NotNull(root);
    }

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class()
    {
        var cut = RenderComponent<Alert>(p => p
            .AddChildContent("body")
            .Add(x => x.CssClass, "extra"));
        var root = cut.Find(".alert");
        Assert.Contains("extra", root.GetAttribute("class"));
    }

    [Fact]
    public void AdditionalAttributes_pass_through_to_root()
    {
        var cut = RenderComponent<Alert>(p => p
            .AddChildContent("body")
            .AddUnmatched("data-test", "value"));
        var root = cut.Find(".alert");
        Assert.Equal("value", root.GetAttribute("data-test"));
    }

    [Fact]
    public void Renders_Type_as_data_type_for_the_themes()
    {
        Assert.Equal("info", RenderComponent<Alert>(p => p.Add(x => x.Label, "A")).Find(".alert").GetAttribute("data-type"));
        Assert.Equal("error", RenderComponent<Alert>(p => p.Add(x => x.Label, "A").Add(x => x.Type, "error")).Find(".alert").GetAttribute("data-type"));
    }
}
