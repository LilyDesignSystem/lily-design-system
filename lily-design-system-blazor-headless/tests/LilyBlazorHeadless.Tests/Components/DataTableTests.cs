using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class DataTableTests : TestContext
{
    public DataTableTests()
    {
        JSInterop.Mode = JSRuntimeMode.Loose;
    }

    [Fact]
    public void Renders_with_kebab_base_class()
    {
        var cut = RenderComponent<DataTable>(p => p
            .AddChildContent("body"));
        var root = cut.Find(".data-table");
        Assert.NotNull(root);
    }

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class()
    {
        var cut = RenderComponent<DataTable>(p => p
            .AddChildContent("body")
            .Add(x => x.CssClass, "extra"));
        var root = cut.Find(".data-table");
        Assert.Contains("extra", root.GetAttribute("class"));
    }

    [Fact]
    public void AdditionalAttributes_pass_through_to_root()
    {
        var cut = RenderComponent<DataTable>(p => p
            .AddChildContent("body")
            .AddUnmatched("data-test", "value"));
        var root = cut.Find(".data-table");
        Assert.Equal("value", root.GetAttribute("data-test"));
    }

    [Fact]
    public void Label_names_the_root_with_aria_label()
    {
        var cut = RenderComponent<DataTable>(p => p
            .AddChildContent("body")
            .Add(x => x.Label, "Named"));
        Assert.Equal("Named", cut.Find(".data-table").GetAttribute("aria-label"));
    }
}
