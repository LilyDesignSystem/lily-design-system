using Bunit;
using LilyBlazorHeadless.Components;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

// Modality (tasks.md P18-T6): Drawer is a <dialog> opened with showModal() through the Drawer.razor.js interop
// module. bUnit has no browser, so these tests assert the interop calls (open on show, close on hide, which also
// returns focus); the Tab trap and the inert page are the browser's part.
public class DrawerTests : TestContext
{
    private readonly BunitJSModuleInterop _module;
    private readonly BunitJSModuleInterop _handle;

    public DrawerTests()
    {
        _module = JSInterop.SetupModule(Drawer.ModulePath);
        // open(dialog) returns a handle object whose close() closes the dialog and restores focus.
        _handle = _module.SetupModule(i => i.Identifier == "open");
        _handle.SetupVoid("close").SetVoidResult();
    }

    private IRenderedComponent<Drawer> Open(Action<ComponentParameterCollectionBuilder<Drawer>>? extra = null) =>
        RenderComponent<Drawer>(p =>
        {
            p.Add(x => x.Label, "Panel").Add(x => x.Open, true).AddChildContent("body");
            extra?.Invoke(p);
        });

    [Fact]
    public void Renders_with_kebab_base_class()
    {
        var root = Open().Find(".drawer");
        Assert.Equal("DIALOG", root.TagName);
    }

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class()
    {
        var root = Open(p => p.Add(x => x.CssClass, "extra")).Find(".drawer");
        Assert.Contains("extra", root.GetAttribute("class"));
    }

    [Fact]
    public void AdditionalAttributes_pass_through_to_root()
    {
        var root = Open(p => p.AddUnmatched("data-test", "value")).Find(".drawer");
        Assert.Equal("value", root.GetAttribute("data-test"));
    }

    [Fact]
    public void Renders_nothing_and_calls_no_interop_while_closed()
    {
        var cut = RenderComponent<Drawer>(p => p.Add(x => x.Label, "Panel").AddChildContent("body"));
        Assert.Empty(cut.FindAll("dialog"));
        Assert.Empty(JSInterop.Invocations);
    }

    [Fact]
    public void Is_a_labelled_modal_dialog_opened_with_showModal_interop()
    {
        var cut = Open();
        var dialog = cut.Find("dialog");
        Assert.False(dialog.HasAttribute("role"));
        Assert.Equal("true", dialog.GetAttribute("aria-modal"));
        Assert.Equal("Panel", dialog.GetAttribute("aria-label"));
        Assert.Equal("-1", dialog.GetAttribute("tabindex"));
        Assert.Contains(JSInterop.Invocations, i => i.Identifier == "import" && (string?)i.Arguments[0] == Drawer.ModulePath);
        Assert.Single(_module.Invocations, i => i.Identifier == "open");
    }

    [Fact]
    public void Data_side_defaults_to_left_and_follows_Side()
    {
        Assert.Equal("left", Open().Find("dialog").GetAttribute("data-side"));
        var cut = Open(p => p.Add(x => x.Side, "bottom"));
        Assert.Equal("bottom", cut.Find("dialog").GetAttribute("data-side"));
    }

    [Fact]
    public void Escape_closes_and_reports_OpenChanged()
    {
        bool? reported = null;
        var cut = Open(p => p.Add(x => x.OpenChanged, EventCallback.Factory.Create<bool>(this, v => reported = v)));
        cut.Find("dialog").KeyDown(new KeyboardEventArgs { Key = "Escape" });
        Assert.False(reported);
        Assert.Empty(cut.FindAll("dialog"));
    }

    [Fact]
    public void Native_cancel_event_closes()
    {
        var cut = Open();
        cut.Find("dialog").TriggerEvent("oncancel", new EventArgs());
        Assert.Empty(cut.FindAll("dialog"));
    }

    [Fact]
    public void Closing_calls_close_on_the_handle_which_returns_focus()
    {
        var cut = Open();
        cut.SetParametersAndRender(p => p.Add(x => x.Open, false));
        Assert.Empty(cut.FindAll("dialog"));
        Assert.Single(_handle.Invocations, i => i.Identifier == "close");
    }
}
