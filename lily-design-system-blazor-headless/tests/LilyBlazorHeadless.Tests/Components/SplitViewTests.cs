using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class SplitViewTests : TestContext
{
    public SplitViewTests()
    {
        JSInterop.Mode = JSRuntimeMode.Loose;
    }

    [Fact]
    public void Renders_with_kebab_base_class()
    {
        var cut = RenderComponent<SplitView>(p => p
            .Add(x => x.Label, "Panes"));
        var root = cut.Find(".split-view");
        Assert.NotNull(root);
    }

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class()
    {
        var cut = RenderComponent<SplitView>(p => p
            .Add(x => x.Label, "Panes")
            .Add(x => x.CssClass, "extra"));
        var root = cut.Find(".split-view");
        Assert.Contains("extra", root.GetAttribute("class"));
    }

    [Fact]
    public void AdditionalAttributes_pass_through_to_root()
    {
        var cut = RenderComponent<SplitView>(p => p
            .Add(x => x.Label, "Panes")
            .AddUnmatched("data-test", "value"));
        var root = cut.Find(".split-view");
        Assert.Equal("value", root.GetAttribute("data-test"));
    }
}
