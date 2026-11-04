using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class ActionGroupTests : TestContext
{
    // The menu is popover="auto"; its JS module (Popover.razor.js) is imported after first render.
    public ActionGroupTests()
    {
        JSInterop.Mode = JSRuntimeMode.Loose;
    }

    [Fact]
    public void Renders_with_kebab_base_class()
    {
        var cut = RenderComponent<ActionGroup>(p => p
            .AddChildContent("body"));
        var root = cut.Find(".action-group");
        Assert.NotNull(root);
    }

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class()
    {
        var cut = RenderComponent<ActionGroup>(p => p
            .AddChildContent("body")
            .Add(x => x.CssClass, "extra"));
        var root = cut.Find(".action-group");
        Assert.Contains("extra", root.GetAttribute("class"));
    }

    [Fact]
    public void AdditionalAttributes_pass_through_to_root()
    {
        var cut = RenderComponent<ActionGroup>(p => p
            .AddChildContent("body")
            .AddUnmatched("data-test", "value"));
        var root = cut.Find(".action-group");
        Assert.Equal("value", root.GetAttribute("data-test"));
    }

    [Fact]
    public void No_overflow_renders_no_trigger_and_no_menu()
    {
        var cut = RenderComponent<ActionGroup>(p => p.Add(x => x.Label, "Editing").AddChildContent("<button>Bold</button>"));
        Assert.Empty(cut.FindAll(".action-group-overflow-trigger"));
        Assert.Empty(cut.FindAll(".action-group-overflow-menu"));
        Assert.DoesNotContain(JSInterop.Invocations, i => i.Identifier == "import" && (string?)i.Arguments[0] == Popover.ModulePath);
    }

    [Fact]
    public void Overflow_renders_the_trigger_and_its_popover_menu()
    {
        var cut = RenderComponent<ActionGroup>(p => p
            .Add(x => x.Label, "Editing").Add(x => x.OverflowLabel, "More")
            .Add(x => x.Overflow, "<div role=\"menuitem\">Export</div>"));
        var trigger = cut.Find(".action-group-overflow-trigger");
        var menu = cut.Find(".action-group-overflow-menu");
        Assert.Equal("More", trigger.GetAttribute("aria-label"));
        Assert.Equal("menu", trigger.GetAttribute("aria-haspopup"));
        Assert.Equal("false", trigger.GetAttribute("aria-expanded"));
        Assert.Equal("…", trigger.TextContent);
        Assert.Equal("auto", menu.GetAttribute("popover"));
        Assert.Equal("toggle-popover", trigger.GetAttribute("command"));
        Assert.Equal(menu.Id, trigger.GetAttribute("commandfor"));
        Assert.Equal(menu.Id, trigger.GetAttribute("popovertarget"));
        Assert.Equal(menu.Id, trigger.GetAttribute("aria-controls"));
    }

    [Fact]
    public async Task Toggle_event_writes_back_to_OverflowOpen()
    {
        bool? changed = null;
        var cut = RenderComponent<ActionGroup>(p => p
            .Add(x => x.Label, "Editing").Add(x => x.OverflowLabel, "More")
            .Add(x => x.Overflow, "<div role=\"menuitem\">Export</div>")
            .Add(x => x.OverflowOpenChanged, (bool v) => changed = v));
        await cut.InvokeAsync(() => cut.Instance.OnPopoverToggle(true));
        Assert.Equal("true", cut.Find(".action-group-overflow-trigger").GetAttribute("aria-expanded"));
        Assert.Equal(true, changed);
    }
}
