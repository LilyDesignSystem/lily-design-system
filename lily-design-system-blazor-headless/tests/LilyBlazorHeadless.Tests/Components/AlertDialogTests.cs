using Bunit;
using LilyBlazorHeadless.Components;
using Microsoft.AspNetCore.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

// tasks.md P14-T4: the dialog is opened with showModal() through Drawer.razor.js (ModalDialogBase). bUnit mocks the
// JS, so these tests assert the markup, the open/close state and the module call; the Tab trap and inert page are the
// browser's part.
public class AlertDialogTests : TestContext
{
    public AlertDialogTests()
    {
        JSInterop.Mode = JSRuntimeMode.Loose;
    }

    private IRenderedComponent<AlertDialog> Render(Action<ComponentParameterCollectionBuilder<AlertDialog>>? more = null, bool open = true) =>
        RenderComponent<AlertDialog>(p =>
        {
            p.Add(x => x.Title, "Delete file?").Add(x => x.Open, open).AddChildContent("<button>Inside</button>");
            more?.Invoke(p);
        });

    [Fact]
    public void Renders_with_kebab_base_class()
    {
        Assert.NotNull(Render().Find("dialog.alert-dialog"));
    }

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class()
    {
        Assert.Contains("extra", Render(p => p.Add(x => x.CssClass, "extra")).Find(".alert-dialog").GetAttribute("class"));
    }

    [Fact]
    public void AdditionalAttributes_pass_through_to_root()
    {
        Assert.Equal("value", Render(p => p.AddUnmatched("data-test", "value")).Find(".alert-dialog").GetAttribute("data-test"));
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
    public void Is_an_alertdialog_named_by_its_title_and_described_by_its_description()
    {
        var cut = Render(p => p.Add(x => x.Description, "This cannot be undone."));
        var el = cut.Find("dialog");
        Assert.Equal("alertdialog", el.GetAttribute("role"));
        Assert.Equal("true", el.GetAttribute("aria-modal"));
        Assert.Equal("Delete file?", cut.Find($"#{el.GetAttribute("aria-labelledby")}").TextContent);
        Assert.Equal("This cannot be undone.", cut.Find($"#{el.GetAttribute("aria-describedby")}").TextContent);
    }

    [Fact]
    public void Without_a_description_there_is_no_aria_describedby()
    {
        Assert.False(Render().Find("dialog").HasAttribute("aria-describedby"));
    }
}
