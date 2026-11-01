using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class SplitButtonTests : TestContext
{
    // The menu is popover="auto"; its JS module (Popover.razor.js) is imported after first render.
    public SplitButtonTests()
    {
        JSInterop.Mode = JSRuntimeMode.Loose;
    }

    [Fact]
    public void Renders_with_kebab_base_class()
    {
        var cut = RenderComponent<SplitButton>(p => p
            .AddChildContent("body"));
        var root = cut.Find(".split-button");
        Assert.NotNull(root);
    }

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class()
    {
        var cut = RenderComponent<SplitButton>(p => p
            .AddChildContent("body")
            .Add(x => x.CssClass, "extra"));
        var root = cut.Find(".split-button");
        Assert.Contains("extra", root.GetAttribute("class"));
    }

    [Fact]
    public void AdditionalAttributes_pass_through_to_root()
    {
        var cut = RenderComponent<SplitButton>(p => p
            .AddChildContent("body")
            .AddUnmatched("data-test", "value"));
        var root = cut.Find(".split-button");
        Assert.Equal("value", root.GetAttribute("data-test"));
    }

    [Fact]
    public void Renders_the_group_primary_trigger_and_popover_menu()
    {
        var cut = RenderComponent<SplitButton>(p => p
            .Add(x => x.Label, "Save options").Add(x => x.PrimaryLabel, "Save").Add(x => x.MenuLabel, "More save options")
            .AddChildContent("<div role=\"menuitem\">Save as</div>"));
        var root = cut.Find("div.split-button");
        var trigger = cut.Find(".split-button-menu-trigger");
        var menu = cut.Find(".split-button-menu");
        Assert.Equal("group", root.GetAttribute("role"));
        Assert.Equal("Save options", root.GetAttribute("aria-label"));
        Assert.Equal("Save", cut.Find(".split-button-primary").TextContent);
        Assert.Equal("More save options", trigger.GetAttribute("aria-label"));
        Assert.Equal("menu", trigger.GetAttribute("aria-haspopup"));
        Assert.Equal("false", trigger.GetAttribute("aria-expanded"));
        Assert.Equal("auto", menu.GetAttribute("popover"));
        Assert.Equal("toggle-popover", trigger.GetAttribute("command"));
        Assert.Equal(menu.Id, trigger.GetAttribute("commandfor"));
        Assert.Equal(menu.Id, trigger.GetAttribute("popovertarget"));
        Assert.Equal(menu.Id, trigger.GetAttribute("aria-controls"));
    }

    [Fact]
    public async Task Toggle_event_writes_back_to_MenuOpen()
    {
        bool? changed = null;
        var cut = RenderComponent<SplitButton>(p => p
            .Add(x => x.Label, "L").Add(x => x.PrimaryLabel, "P").Add(x => x.MenuLabel, "M")
            .Add(x => x.MenuOpenChanged, (bool v) => changed = v));
        await cut.InvokeAsync(() => cut.Instance.OnPopoverToggle(true));
        Assert.Equal("true", cut.Find(".split-button-menu-trigger").GetAttribute("aria-expanded"));
        Assert.Equal(true, changed);
    }

    [Fact]
    public void Disabled_disables_both_buttons_and_primary_click_fires()
    {
        var clicks = 0;
        var cut = RenderComponent<SplitButton>(p => p
            .Add(x => x.Label, "L").Add(x => x.PrimaryLabel, "P").Add(x => x.MenuLabel, "M")
            .Add(x => x.OnPrimaryClick, () => clicks++));
        cut.Find(".split-button-primary").Click();
        Assert.Equal(1, clicks);
        cut.SetParametersAndRender(p => p.Add(x => x.Disabled, true));
        Assert.True(cut.Find(".split-button-primary").HasAttribute("disabled"));
        Assert.True(cut.Find(".split-button-menu-trigger").HasAttribute("disabled"));
    }
}
