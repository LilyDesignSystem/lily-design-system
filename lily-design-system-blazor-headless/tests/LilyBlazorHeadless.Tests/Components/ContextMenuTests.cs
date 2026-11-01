using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class ContextMenuTests : TestContext
{
    // The menu is popover="auto"; its JS module (Popover.razor.js) is imported after first render.
    public ContextMenuTests()
    {
        JSInterop.Mode = JSRuntimeMode.Loose;
    }

    [Fact]
    public void Renders_with_kebab_base_class()
    {
        var cut = RenderComponent<ContextMenu>(p => p
            .AddChildContent("body"));
        var root = cut.Find(".context-menu");
        Assert.NotNull(root);
    }

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class()
    {
        var cut = RenderComponent<ContextMenu>(p => p
            .AddChildContent("body")
            .Add(x => x.CssClass, "extra"));
        var root = cut.Find(".context-menu");
        Assert.Contains("extra", root.GetAttribute("class"));
    }

    [Fact]
    public void AdditionalAttributes_pass_through_to_root()
    {
        var cut = RenderComponent<ContextMenu>(p => p
            .AddChildContent("body")
            .AddUnmatched("data-test", "value"));
        var root = cut.Find(".context-menu");
        Assert.Equal("value", root.GetAttribute("data-test"));
    }

    [Fact]
    public void Is_a_labelled_popover_menu()
    {
        var cut = RenderComponent<ContextMenu>(p => p.Add(x => x.Label, "Actions").AddChildContent("<div role=\"menuitem\">Edit</div>"));
        var menu = cut.Find(".context-menu");
        Assert.Equal("menu", menu.GetAttribute("role"));
        Assert.Equal("Actions", menu.GetAttribute("aria-label"));
        Assert.Equal("auto", menu.GetAttribute("popover"));
    }

    [Fact]
    public async Task Light_dismiss_writes_back_to_Open()
    {
        bool? changed = null;
        var cut = RenderComponent<ContextMenu>(p => p
            .Add(x => x.Label, "Actions").Add(x => x.Open, true)
            .Add(x => x.OpenChanged, (bool v) => changed = v));
        await cut.InvokeAsync(() => cut.Instance.OnPopoverToggle(false));
        Assert.Equal(false, changed);
    }
}
