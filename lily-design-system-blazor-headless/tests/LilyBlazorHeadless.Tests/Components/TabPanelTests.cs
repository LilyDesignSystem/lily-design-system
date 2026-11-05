using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class TabPanelTests : TestContext
{
    [Fact]
    public void Renders_with_kebab_base_class()
    {
        var cut = RenderComponent<TabPanel>(p => p
            .AddChildContent("body"));
        var root = cut.Find(".tab-panel");
        Assert.NotNull(root);
    }

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class()
    {
        var cut = RenderComponent<TabPanel>(p => p
            .AddChildContent("body")
            .Add(x => x.CssClass, "extra"));
        var root = cut.Find(".tab-panel");
        Assert.Contains("extra", root.GetAttribute("class"));
    }

    [Fact]
    public void AdditionalAttributes_pass_through_to_root()
    {
        var cut = RenderComponent<TabPanel>(p => p
            .AddChildContent("body")
            .AddUnmatched("data-test", "value"));
        var root = cut.Find(".tab-panel");
        Assert.Equal("value", root.GetAttribute("data-test"));
    }

    [Fact]
    public void The_selected_panel_shows_and_takes_focus()
    {
        var cut = RenderComponent<TabPanel>(p => p.Add(x => x.Label, "Details").Add(x => x.Selected, true));
        var panel = cut.Find(".tab-panel");
        Assert.Equal("tabpanel", panel.GetAttribute("role"));
        Assert.Equal("Details", panel.GetAttribute("aria-label"));
        Assert.Equal("0", panel.GetAttribute("tabindex"));
        Assert.False(panel.HasAttribute("hidden"));
    }

    [Fact]
    public void An_unselected_panel_is_hidden_and_labelledBy_wins()
    {
        var cut = RenderComponent<TabPanel>(p => p.Add(x => x.Label, "Details").Add(x => x.LabelledBy, "tab-1"));
        var panel = cut.Find(".tab-panel");
        Assert.True(panel.HasAttribute("hidden"));
        Assert.Equal("tab-1", panel.GetAttribute("aria-labelledby"));
        Assert.False(panel.HasAttribute("aria-label"));
    }
}
