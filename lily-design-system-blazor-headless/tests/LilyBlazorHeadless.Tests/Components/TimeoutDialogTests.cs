using Bunit;
using LilyBlazorHeadless.Components;
using Microsoft.AspNetCore.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

// tasks.md P14-T4: the dialog is opened with showModal() through Drawer.razor.js (ModalDialogBase). bUnit mocks the
// JS, so these tests assert the markup, the open/close state and the module call; the Tab trap and inert page are the
// browser's part.
public class TimeoutDialogTests : TestContext
{
    public TimeoutDialogTests()
    {
        JSInterop.Mode = JSRuntimeMode.Loose;
    }

    private IRenderedComponent<TimeoutDialog> Render(Action<ComponentParameterCollectionBuilder<TimeoutDialog>>? more = null, bool open = true) =>
        RenderComponent<TimeoutDialog>(p =>
        {
            p.Add(x => x.Label, "Session timeout").Add(x => x.Open, open).AddChildContent("<button>Inside</button>");
            more?.Invoke(p);
        });

    [Fact]
    public void Renders_with_kebab_base_class()
    {
        Assert.NotNull(Render().Find("dialog.timeout-dialog"));
    }

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class()
    {
        Assert.Contains("extra", Render(p => p.Add(x => x.CssClass, "extra")).Find(".timeout-dialog").GetAttribute("class"));
    }

    [Fact]
    public void AdditionalAttributes_pass_through_to_root()
    {
        Assert.Equal("value", Render(p => p.AddUnmatched("data-test", "value")).Find(".timeout-dialog").GetAttribute("data-test"));
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
    public void Is_an_always_rendered_alertdialog_that_loads_no_module_while_closed()
    {
        var cut = Render(open: false);
        var el = cut.Find("dialog.timeout-dialog");
        Assert.Equal("alertdialog", el.GetAttribute("role"));
        Assert.Equal("Session timeout", el.GetAttribute("aria-label"));
        Assert.Empty(JSInterop.Invocations);
    }

    [Fact]
    public void Closing_releases_the_modal_handle()
    {
        var cut = Render();
        cut.SetParametersAndRender(p => p.Add(x => x.Open, false));
        Assert.Contains(JSInterop.Invocations, i => i.Identifier == "close");
    }
}
