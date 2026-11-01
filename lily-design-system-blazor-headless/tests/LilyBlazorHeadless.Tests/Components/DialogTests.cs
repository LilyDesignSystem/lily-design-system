using Bunit;
using LilyBlazorHeadless.Components;
using Microsoft.AspNetCore.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

// tasks.md P14-T4: the dialog is opened with showModal() through Drawer.razor.js (ModalDialogBase). bUnit mocks the
// JS, so these tests assert the markup, the open/close state and the module call; the Tab trap and inert page are the
// browser's part.
public class DialogTests : TestContext
{
    public DialogTests()
    {
        JSInterop.Mode = JSRuntimeMode.Loose;
    }

    private IRenderedComponent<Dialog> Render(Action<ComponentParameterCollectionBuilder<Dialog>>? more = null, bool open = true) =>
        RenderComponent<Dialog>(p =>
        {
            p.Add(x => x.Label, "Settings").Add(x => x.Open, open).AddChildContent("<button>Inside</button>");
            more?.Invoke(p);
        });

    [Fact]
    public void Renders_with_kebab_base_class()
    {
        Assert.NotNull(Render().Find("dialog.dialog"));
    }

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class()
    {
        Assert.Contains("extra", Render(p => p.Add(x => x.CssClass, "extra")).Find(".dialog").GetAttribute("class"));
    }

    [Fact]
    public void AdditionalAttributes_pass_through_to_root()
    {
        Assert.Equal("value", Render(p => p.AddUnmatched("data-test", "value")).Find(".dialog").GetAttribute("data-test"));
    }

    [Fact]
    public void Open_dialog_is_opened_through_the_modal_module()
    {
        Render();
        var import = Assert.Single(JSInterop.Invocations, i => i.Identifier == "import");
        Assert.Equal(Drawer.ModulePath, import.Arguments[0]);
        var open = Assert.Single(JSInterop.Invocations, i => i.Identifier == "open");
        Assert.Equal(true, open.Arguments[1]);
    }

    [Fact]
    public void Closed_it_is_not_rendered_and_loads_no_module()
    {
        var cut = Render(open: false);
        Assert.Empty(cut.FindAll("dialog"));
        Assert.Empty(JSInterop.Invocations);
    }

    [Fact]
    public void The_native_cancel_event_closes_it_and_raises_OpenChanged()
    {
        bool? changed = null;
        var cut = Render(p => p.Add(x => x.OpenChanged, (bool v) => changed = v));
        cut.Find("dialog").TriggerEvent("oncancel", new EventArgs());
        Assert.Equal(false, changed);
        Assert.Empty(cut.FindAll("dialog"));
    }

    [Fact]
    public void Escape_closes_it()
    {
        bool? changed = null;
        var cut = Render(p => p.Add(x => x.OpenChanged, (bool v) => changed = v));
        cut.Find("dialog").KeyDown("Escape");
        Assert.Equal(false, changed);
    }

    [Fact]
    public void Is_labelled_focusable_and_modal_by_default()
    {
        var el = Render().Find("dialog");
        Assert.Equal("Settings", el.GetAttribute("aria-label"));
        Assert.Equal("-1", el.GetAttribute("tabindex"));
        Assert.Equal("true", el.GetAttribute("aria-modal"));
    }

    [Fact]
    public void Modal_false_drops_aria_modal_and_asks_the_module_for_a_non_modal_open()
    {
        var cut = Render(p => p.Add(x => x.Modal, false));
        Assert.False(cut.Find("dialog").HasAttribute("aria-modal"));
        var open = Assert.Single(JSInterop.Invocations, i => i.Identifier == "open");
        Assert.Equal(false, open.Arguments[1]);
    }
}
