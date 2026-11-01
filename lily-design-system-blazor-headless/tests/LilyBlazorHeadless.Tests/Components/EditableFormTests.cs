using Bunit;
using LilyBlazorHeadless.Components;
using Microsoft.AspNetCore.Components.Web;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class EditableFormTests : TestContext
{
    [Fact]
    public void Renders_with_kebab_base_class()
    {
        var cut = RenderComponent<EditableForm>(p => p
            .Add(x => x.Editing, true)
            .AddChildContent("body"));
        var root = cut.Find(".editable-form");
        Assert.NotNull(root);
    }

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class()
    {
        var cut = RenderComponent<EditableForm>(p => p
            .Add(x => x.Editing, true)
            .AddChildContent("body")
            .Add(x => x.CssClass, "extra"));
        var root = cut.Find(".editable-form");
        Assert.Contains("extra", root.GetAttribute("class"));
    }

    [Fact]
    public void AdditionalAttributes_pass_through_to_root()
    {
        var cut = RenderComponent<EditableForm>(p => p
            .Add(x => x.Editing, true)
            .AddChildContent("body")
            .AddUnmatched("data-test", "value"));
        var root = cut.Find(".editable-form");
        Assert.Equal("value", root.GetAttribute("data-test"));
    }

    [Fact]
    public void Renders_nothing_while_not_editing()
    {
        var cut = RenderComponent<EditableForm>(p => p.Add(x => x.Label, "Address").AddChildContent("body"));
        Assert.Empty(cut.FindAll("form"));
    }

    [Fact]
    public void Is_a_labelled_focusable_form()
    {
        var cut = RenderComponent<EditableForm>(p => p.Add(x => x.Editing, true).Add(x => x.Label, "Address").AddChildContent("body"));
        var form = cut.Find("form.editable-form");
        Assert.Equal("Address", form.GetAttribute("aria-label"));
        Assert.Equal("-1", form.GetAttribute("tabindex"));
    }

    [Fact]
    public void Submitting_leaves_edit_mode_and_raises_OnSubmit()
    {
        bool? editing = null;
        var submitted = 0;
        var cancelled = 0;
        var cut = RenderComponent<EditableForm>(p => p
            .Add(x => x.Editing, true)
            .Add(x => x.Label, "Address")
            .Add(x => x.EditingChanged, (bool v) => editing = v)
            .Add(x => x.OnSubmit, () => submitted++)
            .Add(x => x.OnCancel, () => cancelled++)
            .AddChildContent("<input name=\"street\" />"));
        cut.Find("form").Submit();
        Assert.False(editing);
        Assert.Equal((1, 0), (submitted, cancelled));
        Assert.Empty(cut.FindAll("form"));
    }

    [Fact]
    public void Escape_leaves_edit_mode_and_raises_OnCancel()
    {
        bool? editing = null;
        var submitted = 0;
        var cancelled = 0;
        var cut = RenderComponent<EditableForm>(p => p
            .Add(x => x.Editing, true)
            .Add(x => x.Label, "Address")
            .Add(x => x.EditingChanged, (bool v) => editing = v)
            .Add(x => x.OnSubmit, () => submitted++)
            .Add(x => x.OnCancel, () => cancelled++)
            .AddChildContent("body"));
        cut.Find("form").KeyDown(new KeyboardEventArgs { Key = "Enter" });
        Assert.Null(editing);
        cut.Find("form").KeyDown(new KeyboardEventArgs { Key = "Escape" });
        Assert.False(editing);
        Assert.Equal((0, 1), (submitted, cancelled));
        Assert.Empty(cut.FindAll("form"));
    }
}
