using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class SplitterTests : TestContext
{
    public SplitterTests()
    {
        JSInterop.Mode = JSRuntimeMode.Loose;
    }

    [Fact]
    public void Renders_with_kebab_base_class()
    {
        var cut = RenderComponent<Splitter>(p => p
            .Add(x => x.Label, "Panes"));
        var root = cut.Find(".splitter");
        Assert.NotNull(root);
    }

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class()
    {
        var cut = RenderComponent<Splitter>(p => p
            .Add(x => x.Label, "Panes")
            .Add(x => x.CssClass, "extra"));
        var root = cut.Find(".splitter");
        Assert.Contains("extra", root.GetAttribute("class"));
    }

    [Fact]
    public void AdditionalAttributes_pass_through_to_root()
    {
        var cut = RenderComponent<Splitter>(p => p
            .Add(x => x.Label, "Panes")
            .AddUnmatched("data-test", "value"));
        var root = cut.Find(".splitter");
        Assert.Equal("value", root.GetAttribute("data-test"));
    }
}
