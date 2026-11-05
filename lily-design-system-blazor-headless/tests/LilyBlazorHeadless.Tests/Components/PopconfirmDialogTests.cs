using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class PopconfirmDialogTests : TestContext
{
    public PopconfirmDialogTests() => JSInterop.Mode = JSRuntimeMode.Loose;

    private IRenderedComponent<PopconfirmDialog> Make(Action<ComponentParameterCollectionBuilder<PopconfirmDialog>>? more = null) =>
        RenderComponent<PopconfirmDialog>(p =>
        {
            p
            .Add(x => x.Title, "Delete?")
            .Add(x => x.ConfirmLabel, "Yes")
            .Add(x => x.CancelLabel, "No");
            more?.Invoke(p);
        });

    [Fact]
    public void Renders_with_kebab_base_class() => Assert.NotNull(Make().Find("div.popconfirm-dialog"));

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class() =>
        Assert.Contains("extra", Make(p => p.Add(x => x.CssClass, "extra")).Find("div.popconfirm-dialog").GetAttribute("class"));

    [Fact]
    public void AdditionalAttributes_pass_through_to_root() =>
        Assert.Equal("value", Make(p => p.AddUnmatched("data-test", "value")).Find("div.popconfirm-dialog").GetAttribute("data-test"));

    [Fact]
    public void Is_a_non_modal_alertdialog_in_a_manual_popover()
    {
        var root = Make().Find("div");
        Assert.Equal("alertdialog", root.GetAttribute("role"));
        Assert.Equal("false", root.GetAttribute("aria-modal"));
        Assert.Equal("manual", root.GetAttribute("popover"));
    }

    [Fact]
    public void The_title_names_it_and_the_description_describes_it()
    {
        var cut = Make(p => p.Add(x => x.Description, "It cannot be undone."));
        var root = cut.Find("div");
        Assert.Equal(root.GetAttribute("aria-labelledby"), cut.Find("h2.popconfirm-dialog-title").Id);
        Assert.Equal("Delete?", cut.Find("h2").TextContent);
        Assert.Equal(root.GetAttribute("aria-describedby"), cut.Find("p.popconfirm-dialog-description").Id);
    }

    [Fact]
    public void Without_a_description_nothing_is_described()
    {
        var cut = Make();
        Assert.False(cut.Find("div").HasAttribute("aria-describedby"));
        Assert.Empty(cut.FindAll("p"));
    }

    [Fact]
    public void The_buttons_report()
    {
        var (confirmed, cancelled) = (0, 0);
        var cut = Make(p => p.Add(x => x.OnConfirm, () => confirmed++).Add(x => x.OnCancel, () => cancelled++));
        cut.Find(".popconfirm-dialog-confirm").Click();
        cut.Find(".popconfirm-dialog-cancel").Click();
        Assert.Equal((1, 1), (confirmed, cancelled));
        Assert.Equal("Yes", cut.Find(".popconfirm-dialog-confirm").TextContent);
        Assert.Equal("No", cut.Find(".popconfirm-dialog-cancel").TextContent);
    }

    [Fact]
    public void Open_is_sent_to_the_module_when_it_changes()
    {
        var cut = Make();
        var handle = JSInterop.Invocations.Count;
        cut.SetParametersAndRender(p => p.Add(x => x.Open, true));
        Assert.Contains(JSInterop.Invocations.Skip(handle), i => i.Identifier == "set" && (bool)i.Arguments[0]!);
    }
}
