using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class TabBarButtonTests : TestContext
{
    [Fact]
    public void Renders_with_kebab_base_class()
    {
        var cut = RenderComponent<TabBarButton>(p => p
            .AddChildContent("body"));
        var root = cut.Find(".tab-bar-button");
        Assert.NotNull(root);
    }

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class()
    {
        var cut = RenderComponent<TabBarButton>(p => p
            .AddChildContent("body")
            .Add(x => x.CssClass, "extra"));
        var root = cut.Find(".tab-bar-button");
        Assert.Contains("extra", root.GetAttribute("class"));
    }

    [Fact]
    public void AdditionalAttributes_pass_through_to_root()
    {
        var cut = RenderComponent<TabBarButton>(p => p
            .AddChildContent("body")
            .AddUnmatched("data-test", "value"));
        var root = cut.Find(".tab-bar-button");
        Assert.Equal("value", root.GetAttribute("data-test"));
    }

    [Fact]
    public void The_selected_tab_is_the_tab_stop()
    {
        var cut = RenderComponent<TabBarButton>(p => p.Add(x => x.Selected, true).Add(x => x.Controls, "panel-1"));
        var tab = cut.Find("button.tab-bar-button");
        Assert.Equal("true", tab.GetAttribute("aria-selected"));
        Assert.Equal("panel-1", tab.GetAttribute("aria-controls"));
        Assert.Equal("0", tab.GetAttribute("tabindex"));
    }

    [Fact]
    public void An_unselected_tab_is_out_of_the_tab_order()
    {
        var cut = RenderComponent<TabBarButton>();
        var tab = cut.Find("button.tab-bar-button");
        Assert.Equal("false", tab.GetAttribute("aria-selected"));
        Assert.Equal("-1", tab.GetAttribute("tabindex"));
    }
}
