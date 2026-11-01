using Bunit;
using LilyBlazorHeadless.Components;
using Microsoft.AspNetCore.Components.Web;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class SliderButtonTests : TestContext
{
    [Fact]
    public void Renders_with_kebab_base_class()
    {
        var cut = RenderComponent<SliderButton>(p => p
            .AddChildContent("body"));
        var root = cut.Find(".slider-button");
        Assert.NotNull(root);
    }

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class()
    {
        var cut = RenderComponent<SliderButton>(p => p
            .AddChildContent("body")
            .Add(x => x.CssClass, "extra"));
        var root = cut.Find(".slider-button");
        Assert.Contains("extra", root.GetAttribute("class"));
    }

    [Fact]
    public void AdditionalAttributes_pass_through_to_root()
    {
        var cut = RenderComponent<SliderButton>(p => p
            .AddChildContent("body")
            .AddUnmatched("data-test", "value"));
        var root = cut.Find(".slider-button");
        Assert.Equal("value", root.GetAttribute("data-test"));
    }

    private int _confirms;

    private IRenderedComponent<SliderButton> Make(int step = 10, bool disabled = false) =>
        RenderComponent<SliderButton>(p => p
            .Add(x => x.Label, "Confirm order")
            .Add(x => x.Step, step)
            .Add(x => x.Disabled, disabled)
            .Add(x => x.OnConfirm, () => _confirms++));

    private static void Press(IRenderedComponent<SliderButton> cut, string key) =>
        cut.Find("button.slider-button").KeyDown(new KeyboardEventArgs { Key = key });

    private static string? Now(IRenderedComponent<SliderButton> cut) =>
        cut.Find("button.slider-button").GetAttribute("aria-valuenow");

    [Fact]
    public void Is_a_labelled_button_with_role_slider_at_0_of_100()
    {
        var button = Make().Find("button.slider-button");
        Assert.Equal("slider", button.GetAttribute("role"));
        Assert.Equal("button", button.GetAttribute("type"));
        Assert.Equal("Confirm order", button.GetAttribute("aria-label"));
        Assert.Equal(new[] { "0", "0", "100" }, new[] { "aria-valuenow", "aria-valuemin", "aria-valuemax" }.Select(a => button.GetAttribute(a)));
    }

    [Fact]
    public void ArrowRight_and_ArrowLeft_move_by_step_and_Home_returns_to_0()
    {
        var cut = Make(step: 25);
        Press(cut, "ArrowRight");
        Press(cut, "ArrowRight");
        Assert.Equal("50", Now(cut));
        Press(cut, "ArrowLeft");
        Assert.Equal("25", Now(cut));
        Press(cut, "Home");
        Assert.Equal("0", Now(cut));
        Press(cut, "ArrowLeft");
        Assert.Equal("0", Now(cut));
    }

    [Fact]
    public void Reaching_100_confirms_once_and_resets()
    {
        var cut = Make(step: 50);
        Press(cut, "ArrowRight");
        Assert.Equal(0, _confirms);
        Press(cut, "ArrowRight");
        Assert.Equal(1, _confirms);
        Assert.Equal("0", Now(cut));
    }

    [Fact]
    public void End_Enter_and_Space_confirm_at_once_and_other_keys_do_nothing()
    {
        var cut = Make();
        foreach (var key in new[] { "End", "Enter", " " }) Press(cut, key);
        Assert.Equal(3, _confirms);
        Press(cut, "Tab");
        Assert.Equal(3, _confirms);
        Assert.Equal("0", Now(cut));
    }

    [Fact]
    public void Disabled_ignores_the_keys()
    {
        var cut = Make(disabled: true);
        Assert.True(cut.Find("button.slider-button").HasAttribute("disabled"));
        Press(cut, "End");
        Press(cut, "ArrowRight");
        Assert.Equal(0, _confirms);
        Assert.Equal("0", Now(cut));
    }
}
