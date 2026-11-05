using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class HorizontalScrollerTests : TestContext
{
    public HorizontalScrollerTests() => JSInterop.Mode = JSRuntimeMode.Loose;

    private IRenderedComponent<HorizontalScroller> Make(Action<ComponentParameterCollectionBuilder<HorizontalScroller>>? more = null) =>
        RenderComponent<HorizontalScroller>(p =>
        {
            p
            .Add(x => x.Label, "Gallery");
            more?.Invoke(p);
        });

    [Fact]
    public void Renders_with_kebab_base_class() => Assert.NotNull(Make().Find("div.horizontal-scroller"));

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class() =>
        Assert.Contains("extra", Make(p => p.Add(x => x.CssClass, "extra")).Find("div.horizontal-scroller").GetAttribute("class"));

    [Fact]
    public void AdditionalAttributes_pass_through_to_root() =>
        Assert.Equal("value", Make(p => p.AddUnmatched("data-test", "value")).Find("div.horizontal-scroller").GetAttribute("data-test"));

    [Fact]
    public void Is_a_focusable_named_region()
    {
        var root = Make().Find("div");
        Assert.Equal("region", root.GetAttribute("role"));
        Assert.Equal("Gallery", root.GetAttribute("aria-label"));
        Assert.Equal("0", root.GetAttribute("tabindex"));
    }

    [Fact]
    public void Step_reaches_the_keys_module()
    {
        Assert.Equal("100", Make().Find("div").GetAttribute("data-step"));
        Assert.Equal("40.5", Make(p => p.Add(x => x.Step, 40.5)).Find("div").GetAttribute("data-step"));
        Assert.Contains(JSInterop.Invocations, i => i.Identifier == "import" && (string?)i.Arguments[0] == HorizontalScroller.ModulePath);
    }
}
