using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class FloatingPanelTests : TestContext
{
    public FloatingPanelTests() => JSInterop.Mode = JSRuntimeMode.Loose;

    [Fact]
    public void Is_a_labelled_region_and_a_manual_popover()
    {
        var root = RenderComponent<FloatingPanel>(p => p.Add(x => x.Label, "Filters")).Find("div");
        Assert.Equal("region", root.GetAttribute("role"));
        Assert.Equal("Filters", root.GetAttribute("aria-label"));
        Assert.Equal("manual", root.GetAttribute("popover"));
    }

    [Fact]
    public void Open_reaches_the_popover_element()
    {
        var cut = RenderComponent<FloatingPanel>(p => p.Add(x => x.Label, "Filters"));
        var before = JSInterop.Invocations.Count;
        cut.SetParametersAndRender(p => p.Add(x => x.Open, true));
        Assert.Contains(JSInterop.Invocations.Skip(before), i => i.Identifier == "set" && (bool)i.Arguments[0]!);
    }

    [Fact]
    public void Renders_with_kebab_base_class()
    {
        var cut = RenderComponent<FloatingPanel>(p => p
            .AddChildContent("body"));
        var root = cut.Find(".floating-panel");
        Assert.NotNull(root);
    }

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class()
    {
        var cut = RenderComponent<FloatingPanel>(p => p
            .AddChildContent("body")
            .Add(x => x.CssClass, "extra"));
        var root = cut.Find(".floating-panel");
        Assert.Contains("extra", root.GetAttribute("class"));
    }

    [Fact]
    public void AdditionalAttributes_pass_through_to_root()
    {
        var cut = RenderComponent<FloatingPanel>(p => p
            .AddChildContent("body")
            .AddUnmatched("data-test", "value"));
        var root = cut.Find(".floating-panel");
        Assert.Equal("value", root.GetAttribute("data-test"));
    }
}
