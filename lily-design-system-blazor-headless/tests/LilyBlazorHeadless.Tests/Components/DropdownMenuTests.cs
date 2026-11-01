using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class DropdownMenuTests : TestContext
{
    // The menu is popover="auto"; its JS module (Popover.razor.js) is imported after first render.
    public DropdownMenuTests()
    {
        JSInterop.Mode = JSRuntimeMode.Loose;
    }

    [Fact]
    public void Renders_with_kebab_base_class()
    {
        var cut = RenderComponent<DropdownMenu>(p => p
            .AddChildContent("body"));
        var root = cut.Find(".dropdown-menu");
        Assert.NotNull(root);
    }

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class()
    {
        var cut = RenderComponent<DropdownMenu>(p => p
            .AddChildContent("body")
            .Add(x => x.CssClass, "extra"));
        var root = cut.Find(".dropdown-menu");
        Assert.Contains("extra", root.GetAttribute("class"));
    }

    [Fact]
    public void AdditionalAttributes_pass_through_to_root()
    {
        var cut = RenderComponent<DropdownMenu>(p => p
            .AddChildContent("body")
            .AddUnmatched("data-test", "value"));
        var root = cut.Find(".dropdown-menu");
        Assert.Equal("value", root.GetAttribute("data-test"));
    }

    [Fact]
    public void Trigger_names_the_popover_menu_and_carries_the_label()
    {
        var cut = RenderComponent<DropdownMenu>(p => p.Add(x => x.Label, "Options").AddChildContent("<div role=\"menuitem\">Edit</div>"));
        var trigger = cut.Find(".dropdown-menu > button");
        var menu = cut.Find(".dropdown-menu > [role=menu]");
        Assert.Equal("Options", trigger.TextContent);
        Assert.Equal("true", trigger.GetAttribute("aria-haspopup"));
        Assert.Equal("false", trigger.GetAttribute("aria-expanded"));
        Assert.Equal("auto", menu.GetAttribute("popover"));
        Assert.Equal("Options", menu.GetAttribute("aria-label"));
        Assert.Equal("toggle-popover", trigger.GetAttribute("command"));
        Assert.Equal(menu.Id, trigger.GetAttribute("commandfor"));
        Assert.Equal(menu.Id, trigger.GetAttribute("popovertarget"));
        Assert.Equal(menu.Id, trigger.GetAttribute("aria-controls"));
        Assert.False(menu.HasAttribute("hidden"));
    }

    [Fact]
    public async Task Toggle_event_writes_back_to_Open()
    {
        bool? changed = null;
        var cut = RenderComponent<DropdownMenu>(p => p.Add(x => x.Label, "Options").Add(x => x.OpenChanged, (bool v) => changed = v));
        await cut.InvokeAsync(() => cut.Instance.OnPopoverToggle(true));
        Assert.Equal("true", cut.Find(".dropdown-menu > button").GetAttribute("aria-expanded"));
        Assert.Equal(true, changed);
    }

    [Fact]
    public void Attaches_the_menu_through_the_popover_module_with_the_menu_option()
    {
        RenderComponent<DropdownMenu>(p => p.Add(x => x.Label, "Options"));
        var import = Assert.Single(JSInterop.Invocations, i => i.Identifier == "import");
        Assert.Equal(Popover.ModulePath, import.Arguments[0]);
    }
}
