using Bunit;
using LilyBlazorHeadless.Components;
using Microsoft.AspNetCore.Components.Web;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class EditableTests : TestContext
{
    public EditableTests() => JSInterop.Mode = JSRuntimeMode.Loose;

    [Fact]
    public void Renders_with_kebab_base_class()
    {
        var cut = RenderComponent<Editable>(p => p
            .AddChildContent("body"));
        var root = cut.Find(".editable");
        Assert.NotNull(root);
    }

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class()
    {
        var cut = RenderComponent<Editable>(p => p
            .AddChildContent("body")
            .Add(x => x.CssClass, "extra"));
        var root = cut.Find(".editable");
        Assert.Contains("extra", root.GetAttribute("class"));
    }

    [Fact]
    public void AdditionalAttributes_pass_through_to_root()
    {
        var cut = RenderComponent<Editable>(p => p
            .AddChildContent("body")
            .AddUnmatched("data-test", "value"));
        var root = cut.Find(".editable");
        Assert.Equal("value", root.GetAttribute("data-test"));
    }

    [Fact]
    public void Accessible_name_includes_the_visible_value()
    {
        var cut = RenderComponent<Editable>(p => p
            .Add(x => x.Label, "Project title")
            .Add(x => x.Value, "Q1 plan")
            .AddChildContent("Q1 plan"));
        Assert.Equal("Q1 plan, Project title", cut.Find(".editable-button").GetAttribute("aria-label"));
    }

    [Fact]
    public void Accessible_name_is_the_label_when_there_is_no_value()
    {
        var cut = RenderComponent<Editable>(p => p
            .Add(x => x.Label, "Project title")
            .AddChildContent("body"));
        Assert.Equal("Project title", cut.Find(".editable-button").GetAttribute("aria-label"));
    }

    private string? _value;
    private bool? _editing;

    private IRenderedComponent<Editable> Make(string value = "Q1 plan", bool disabled = false) =>
        RenderComponent<Editable>(p => p
            .Add(x => x.Label, "Project title")
            .Add(x => x.Value, value)
            .Add(x => x.Disabled, disabled)
            .Add(x => x.ValueChanged, (string v) => _value = v)
            .Add(x => x.EditingChanged, (bool v) => _editing = v));

    [Fact]
    public void The_root_is_a_div_holding_a_native_button_showing_the_value()
    {
        var cut = Make();
        Assert.Equal("DIV", cut.Find(".editable").TagName);
        var button = cut.Find("div.editable > button.editable-button");
        Assert.Equal("button", button.GetAttribute("type"));
        Assert.False(button.HasAttribute("role"));
        Assert.Equal("Q1 plan", button.TextContent);
        Assert.Empty(cut.FindAll("input"));
    }

    [Fact]
    public void A_click_which_is_what_Enter_and_Space_do_on_a_button_starts_editing_and_focuses_the_field()
    {
        var cut = Make();
        cut.Find(".editable-button").Click();
        var input = cut.Find("div.editable > input.editable-input");
        Assert.Equal("Q1 plan", input.GetAttribute("value"));
        Assert.Equal("Project title", input.GetAttribute("aria-label"));
        Assert.True(_editing);
        JSInterop.VerifyFocusAsyncInvoke();
    }

    [Fact]
    public void Enter_in_the_input_confirms_the_draft()
    {
        var cut = Make();
        cut.Find(".editable-button").Click();
        cut.Find("input").Input("Q2 plan");
        Assert.Equal("Q2 plan", cut.Find("input").GetAttribute("value"));
        cut.Find("input").KeyDown(new KeyboardEventArgs { Key = "Enter" });
        Assert.Equal("Q2 plan", _value);
        Assert.False(_editing);
        Assert.Equal("Q2 plan", cut.Find(".editable-button").TextContent);
        Assert.Equal("Q2 plan, Project title", cut.Find(".editable-button").GetAttribute("aria-label"));
    }

    [Fact]
    public void Escape_in_the_input_cancels_the_draft()
    {
        var cut = Make();
        cut.Find(".editable-button").Click();
        cut.Find("input").Input("Q2 plan");
        cut.Find("input").KeyDown(new KeyboardEventArgs { Key = "Escape" });
        Assert.Null(_value);
        Assert.False(_editing);
        Assert.Equal("Q1 plan", cut.Find(".editable-button").TextContent);
        cut.Find(".editable-button").Click();
        Assert.Equal("Q1 plan", cut.Find("input").GetAttribute("value"));
    }

    [Fact]
    public void Other_keys_in_the_input_keep_editing()
    {
        var cut = Make();
        cut.Find(".editable-button").Click();
        cut.Find("input").KeyDown(new KeyboardEventArgs { Key = "ArrowLeft" });
        Assert.NotNull(cut.Find("input.editable-input"));
        Assert.Null(_value);
    }

    [Fact]
    public void Disabled_disables_the_button_and_never_edits()
    {
        var cut = Make(disabled: true);
        var button = cut.Find(".editable-button");
        Assert.True(button.HasAttribute("disabled"));
        button.Click();
        Assert.Empty(cut.FindAll("input"));
        Assert.Null(_editing);
    }
}
