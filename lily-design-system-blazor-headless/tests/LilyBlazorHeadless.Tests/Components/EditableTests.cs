using Bunit;
using LilyBlazorHeadless.Components;
using Microsoft.AspNetCore.Components.Web;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class EditableTests : TestContext
{
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
        Assert.Equal("Q1 plan, Project title", cut.Find(".editable").GetAttribute("aria-label"));
    }

    [Fact]
    public void Accessible_name_is_the_label_when_there_is_no_value()
    {
        var cut = RenderComponent<Editable>(p => p
            .Add(x => x.Label, "Project title")
            .AddChildContent("body"));
        Assert.Equal("Project title", cut.Find(".editable").GetAttribute("aria-label"));
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
    public void Display_mode_is_a_focusable_button_showing_the_value()
    {
        var cut = Make();
        var span = cut.Find("span.editable");
        Assert.Equal("button", span.GetAttribute("role"));
        Assert.Equal("0", span.GetAttribute("tabindex"));
        Assert.Equal("Q1 plan", span.TextContent);
        Assert.Empty(cut.FindAll("input"));
    }

    [Theory]
    [InlineData("Enter")]
    [InlineData(" ")]
    public void Enter_or_Space_start_editing_with_the_value_as_the_draft(string key)
    {
        var cut = Make();
        cut.Find("span.editable").KeyDown(new KeyboardEventArgs { Key = key });
        var input = cut.Find("input.editable");
        Assert.Equal("Q1 plan", input.GetAttribute("value"));
        Assert.Equal("Project title", input.GetAttribute("aria-label"));
        Assert.True(_editing);
    }

    [Fact]
    public void A_click_starts_editing_and_other_keys_do_not()
    {
        var cut = Make();
        cut.Find("span.editable").KeyDown(new KeyboardEventArgs { Key = "a" });
        Assert.Empty(cut.FindAll("input"));
        cut.Find("span.editable").Click();
        Assert.NotNull(cut.Find("input.editable"));
    }

    [Fact]
    public void Enter_in_the_input_confirms_the_draft()
    {
        var cut = Make();
        cut.Find("span.editable").Click();
        cut.Find("input").Input("Q2 plan");
        Assert.Equal("Q2 plan", cut.Find("input").GetAttribute("value"));
        cut.Find("input").KeyDown(new KeyboardEventArgs { Key = "Enter" });
        Assert.Equal("Q2 plan", _value);
        Assert.False(_editing);
        Assert.Equal("Q2 plan", cut.Find("span.editable").TextContent);
        Assert.Equal("Q2 plan, Project title", cut.Find("span.editable").GetAttribute("aria-label"));
    }

    [Fact]
    public void Escape_in_the_input_cancels_the_draft()
    {
        var cut = Make();
        cut.Find("span.editable").Click();
        cut.Find("input").Input("Q2 plan");
        cut.Find("input").KeyDown(new KeyboardEventArgs { Key = "Escape" });
        Assert.Null(_value);
        Assert.False(_editing);
        Assert.Equal("Q1 plan", cut.Find("span.editable").TextContent);
        cut.Find("span.editable").Click();
        Assert.Equal("Q1 plan", cut.Find("input").GetAttribute("value"));
    }

    [Fact]
    public void Other_keys_in_the_input_keep_editing()
    {
        var cut = Make();
        cut.Find("span.editable").Click();
        cut.Find("input").KeyDown(new KeyboardEventArgs { Key = "ArrowLeft" });
        Assert.NotNull(cut.Find("input.editable"));
        Assert.Null(_value);
    }

    [Fact]
    public void Disabled_is_out_of_the_tab_order_and_never_edits()
    {
        var cut = Make(disabled: true);
        var span = cut.Find("span.editable");
        Assert.Equal("-1", span.GetAttribute("tabindex"));
        Assert.Equal("true", span.GetAttribute("aria-disabled"));
        span.Click();
        cut.Find("span.editable").KeyDown(new KeyboardEventArgs { Key = "Enter" });
        Assert.Empty(cut.FindAll("input"));
        Assert.Null(_editing);
    }
}
