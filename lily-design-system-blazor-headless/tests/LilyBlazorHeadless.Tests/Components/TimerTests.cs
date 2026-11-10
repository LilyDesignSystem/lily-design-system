using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class TimerTests : TestContext
{
    [Fact]
    public void Renders_with_kebab_base_class()
    {
        var cut = RenderComponent<LilyBlazorHeadless.Components.Timer>(p => p
            .AddChildContent("body"));
        var root = cut.Find(".timer");
        Assert.NotNull(root);
    }

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class()
    {
        var cut = RenderComponent<LilyBlazorHeadless.Components.Timer>(p => p
            .AddChildContent("body")
            .Add(x => x.CssClass, "extra"));
        var root = cut.Find(".timer");
        Assert.Contains("extra", root.GetAttribute("class"));
    }

    [Fact]
    public void AdditionalAttributes_pass_through_to_root()
    {
        var cut = RenderComponent<LilyBlazorHeadless.Components.Timer>(p => p
            .AddChildContent("body")
            .AddUnmatched("data-test", "value"));
        var root = cut.Find(".timer");
        Assert.Equal("value", root.GetAttribute("data-test"));
    }

    [Fact]
    public void Is_not_a_live_region_so_a_ticking_value_is_not_announced()
    {
        var cut = RenderComponent<LilyBlazorHeadless.Components.Timer>(p => p.AddChildContent("05:30"));
        var root = cut.Find(".timer");
        Assert.Equal("timer", root.GetAttribute("role"));
        Assert.False(root.HasAttribute("aria-live"));
    }
}
