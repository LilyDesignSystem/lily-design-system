using Bunit;
using LilyBlazorHeadless.Components;
using Microsoft.AspNetCore.Components.Web;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class DialTests : TestContext
{
    [Fact]
    public void Renders_with_kebab_base_class()
    {
        var cut = RenderComponent<Dial>(p => p
            .AddChildContent("body"));
        var root = cut.Find(".dial");
        Assert.NotNull(root);
    }

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class()
    {
        var cut = RenderComponent<Dial>(p => p
            .AddChildContent("body")
            .Add(x => x.CssClass, "extra"));
        var root = cut.Find(".dial");
        Assert.Contains("extra", root.GetAttribute("class"));
    }

    [Fact]
    public void AdditionalAttributes_pass_through_to_root()
    {
        var cut = RenderComponent<Dial>(p => p
            .AddChildContent("body")
            .AddUnmatched("data-test", "value"));
        var root = cut.Find(".dial");
        Assert.Equal("value", root.GetAttribute("data-test"));
    }

    private double? _reported;

    private IRenderedComponent<Dial> Make(double value, double min = 0, double max = 100, double step = 1, bool disabled = false) =>
        RenderComponent<Dial>(p => p
            .Add(x => x.Label, "Volume")
            .Add(x => x.Value, value)
            .Add(x => x.Min, min)
            .Add(x => x.Max, max)
            .Add(x => x.Step, step)
            .Add(x => x.Disabled, disabled)
            .Add(x => x.ValueChanged, (double v) => _reported = v));

    private static void Press(IRenderedComponent<Dial> cut, string key, bool shift = false) =>
        cut.Find(".dial").KeyDown(new KeyboardEventArgs { Key = key, ShiftKey = shift });

    private static string? Now(IRenderedComponent<Dial> cut) => cut.Find(".dial").GetAttribute("aria-valuenow");

    [Fact]
    public void Is_a_focusable_labelled_slider_reporting_value_and_bounds()
    {
        var cut = Make(50, -10, 90);
        var root = cut.Find(".dial");
        Assert.Equal("slider", root.GetAttribute("role"));
        Assert.Equal("0", root.GetAttribute("tabindex"));
        Assert.Equal("Volume", root.GetAttribute("aria-label"));
        Assert.Equal(new[] { "50", "-10", "90" }, new[] { "aria-valuenow", "aria-valuemin", "aria-valuemax" }.Select(a => root.GetAttribute(a)));
        Assert.False(root.HasAttribute("aria-disabled"));
    }

    [Fact]
    public void Right_and_Up_raise_and_Left_and_Down_lower_by_one_step()
    {
        var cut = Make(50, step: 2);
        Press(cut, "ArrowRight");
        Assert.Equal("52", Now(cut));
        Press(cut, "ArrowUp");
        Assert.Equal("54", Now(cut));
        Press(cut, "ArrowLeft");
        Press(cut, "ArrowDown");
        Press(cut, "ArrowDown");
        Assert.Equal("48", Now(cut));
        Assert.Equal(48, _reported);
    }

    [Fact]
    public void Shift_moves_ten_steps_and_the_value_stays_in_bounds()
    {
        var cut = Make(50);
        Press(cut, "ArrowRight", shift: true);
        Assert.Equal("60", Now(cut));
        for (var i = 0; i < 5; i++) Press(cut, "ArrowUp", shift: true);
        Assert.Equal("100", Now(cut));
        Press(cut, "ArrowDown", shift: true);
        Assert.Equal("90", Now(cut));
        for (var i = 0; i < 12; i++) Press(cut, "ArrowLeft", shift: true);
        Assert.Equal("0", Now(cut));
    }

    [Fact]
    public void Home_and_End_jump_to_the_bounds()
    {
        var cut = Make(50, -20, 150);
        Press(cut, "End");
        Assert.Equal("150", Now(cut));
        Press(cut, "Home");
        Assert.Equal("-20", Now(cut));
        Assert.Equal(-20, _reported);
    }

    [Fact]
    public void Other_keys_change_nothing()
    {
        var cut = Make(50);
        Press(cut, "Enter");
        Press(cut, "PageUp");
        Assert.Equal("50", Now(cut));
        Assert.Null(_reported);
    }

    [Fact]
    public void Disabled_leaves_the_tab_order_and_ignores_keys()
    {
        var cut = Make(50, disabled: true);
        var root = cut.Find(".dial");
        Assert.Equal("-1", root.GetAttribute("tabindex"));
        Assert.Equal("true", root.GetAttribute("aria-disabled"));
        Press(cut, "ArrowRight");
        Press(cut, "End");
        Assert.Equal("50", Now(cut));
        Assert.Null(_reported);
    }
}
