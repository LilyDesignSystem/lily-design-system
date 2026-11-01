using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class ContextualHelpTests : TestContext
{
    public ContextualHelpTests()
    {
        JSInterop.Mode = JSRuntimeMode.Loose;
    }

    private IRenderedComponent<ContextualHelp> Render(
        Action<ComponentParameterCollectionBuilder<ContextualHelp>>? more = null,
        string triggerLabel = "?") =>
        RenderComponent<ContextualHelp>(p =>
        {
            p.Add(x => x.Label, "Help").Add(x => x.TriggerLabel, triggerLabel).AddChildContent("body");
            more?.Invoke(p);
        });

    [Fact]
    public void Renders_with_kebab_base_class()
    {
        var cut = Render();
        Assert.NotNull(cut.Find("div.contextual-help"));
    }

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class()
    {
        var cut = Render(p => p.Add(x => x.CssClass, "extra"));
        Assert.Contains("extra", cut.Find(".contextual-help").GetAttribute("class"));
    }

    [Fact]
    public void AdditionalAttributes_pass_through_to_root()
    {
        var cut = Render(p => p.AddUnmatched("data-test", "value"));
        Assert.Equal("value", cut.Find(".contextual-help").GetAttribute("data-test"));
    }

    [Fact]
    public void Trigger_has_label_triggerLabel_and_aria_wiring()
    {
        var cut = Render(triggerLabel: "؟");
        var trigger = cut.Find("button.contextual-help-trigger");
        var panel = cut.Find("div.contextual-help-panel");
        Assert.Equal("Help", trigger.GetAttribute("aria-label"));
        Assert.Equal("؟", trigger.TextContent);
        Assert.Equal("dialog", trigger.GetAttribute("aria-haspopup"));
        Assert.Equal("false", trigger.GetAttribute("aria-expanded"));
        Assert.Equal(panel.Id, trigger.GetAttribute("aria-controls"));
        Assert.Equal("dialog", panel.GetAttribute("role"));
    }

    [Fact]
    public void Trigger_opens_the_popover_panel_with_no_script()
    {
        var cut = Render();
        var trigger = cut.Find("button.contextual-help-trigger");
        var panel = cut.Find("div.contextual-help-panel");
        Assert.Equal("auto", panel.GetAttribute("popover"));
        Assert.Equal("toggle-popover", trigger.GetAttribute("command"));
        Assert.Equal(panel.Id, trigger.GetAttribute("commandfor"));
        Assert.Equal(panel.Id, trigger.GetAttribute("popovertarget"));
        Assert.False(panel.HasAttribute("hidden"));
    }

    [Fact]
    public async Task Toggle_event_writes_back_to_Expanded()
    {
        bool? changed = null;
        var cut = Render(p => p.Add(x => x.ExpandedChanged, (bool v) => changed = v));
        await cut.InvokeAsync(() => cut.Instance.OnPopoverToggle(true));
        Assert.Equal("true", cut.Find("button.contextual-help-trigger").GetAttribute("aria-expanded"));
        Assert.Equal(true, changed);
    }

    [Fact]
    public void OnClick_fires_on_trigger_click()
    {
        var clicked = 0;
        var cut = Render(p => p.Add(x => x.OnClick, () => clicked++));
        cut.Find("button.contextual-help-trigger").Click();
        Assert.Equal(1, clicked);
    }
}
