using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class PopupTests : TestContext
{
    public PopupTests()
    {
        JSInterop.Mode = JSRuntimeMode.Loose;
    }

    [Fact]
    public void Renders_with_kebab_base_class()
    {
        var cut = RenderComponent<Popup>(p => p
            .AddChildContent("body"));
        var root = cut.Find(".popup");
        Assert.NotNull(root);
    }

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class()
    {
        var cut = RenderComponent<Popup>(p => p
            .AddChildContent("body")
            .Add(x => x.CssClass, "extra"));
        var root = cut.Find(".popup");
        Assert.Contains("extra", root.GetAttribute("class"));
    }

    [Fact]
    public void AdditionalAttributes_pass_through_to_root()
    {
        var cut = RenderComponent<Popup>(p => p
            .AddChildContent("body")
            .AddUnmatched("data-test", "value"));
        var root = cut.Find(".popup");
        Assert.Equal("value", root.GetAttribute("data-test"));
    }

    [Fact]
    public void Renders_a_popover_auto_dialog_with_its_id_and_label()
    {
        var cut = RenderComponent<Popup>(p => p
            .Add(x => x.Label, "Info")
            .Add(x => x.Id, "info")
            .AddChildContent("body"));
        var root = cut.Find("div.popup");
        Assert.Equal("auto", root.GetAttribute("popover"));
        Assert.Equal("dialog", root.GetAttribute("role"));
        Assert.Equal("Info", root.GetAttribute("aria-label"));
        Assert.Equal("info", root.GetAttribute("id"));
        Assert.False(root.HasAttribute("hidden"));
    }

    [Fact]
    public void Attaches_the_popover_module_with_the_open_state()
    {
        var module = JSInterop.SetupModule(Popover.ModulePath);
        module.Mode = JSRuntimeMode.Loose;
        RenderComponent<Popup>(p => p
            .Add(x => x.Label, "Info")
            .Add(x => x.Open, true)
            .AddChildContent("body"));
        var attach = Assert.Single(module.Invocations, i => i.Identifier == "attach");
        Assert.Equal(true, attach.Arguments[2]);
    }

    [Fact]
    public async Task Toggle_event_writes_back_to_Open()
    {
        bool? changed = null;
        var cut = RenderComponent<Popup>(p => p
            .Add(x => x.Label, "Info")
            .Add(x => x.Open, true)
            .Add(x => x.OpenChanged, (bool v) => changed = v)
            .AddChildContent("body"));
        await cut.InvokeAsync(() => cut.Instance.OnPopoverToggle(false));
        Assert.False(cut.Instance.Open);
        Assert.Equal(false, changed);
    }
}
