using Bunit;
using LilyBlazorHeadless.Components;
using Microsoft.AspNetCore.Components.Web;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class ColorPickerTests : TestContext
{
    [Fact]
    public void Renders_with_kebab_base_class()
    {
        var cut = RenderComponent<ColorPicker>(p => p
            .AddChildContent("body"));
        var root = cut.Find(".color-picker");
        Assert.NotNull(root);
    }

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class()
    {
        var cut = RenderComponent<ColorPicker>(p => p
            .AddChildContent("body")
            .Add(x => x.CssClass, "extra"));
        var root = cut.Find(".color-picker");
        Assert.Contains("extra", root.GetAttribute("class"));
    }

    [Fact]
    public void AdditionalAttributes_pass_through_to_root()
    {
        var cut = RenderComponent<ColorPicker>(p => p
            .AddChildContent("body")
            .AddUnmatched("data-test", "value"));
        var root = cut.Find(".color-picker");
        Assert.Equal("value", root.GetAttribute("data-test"));
    }

    private double? _x, _y;

    private IRenderedComponent<ColorPicker> Make(double x, double y, bool disabled = false) =>
        RenderComponent<ColorPicker>(p => p
            .Add(c => c.Label, "Saturation and lightness")
            .Add(c => c.X, x)
            .Add(c => c.Y, y)
            .Add(c => c.Disabled, disabled)
            .Add(c => c.XChanged, (double v) => _x = v)
            .Add(c => c.YChanged, (double v) => _y = v));

    private static void Press(IRenderedComponent<ColorPicker> cut, string key, bool shift = false) =>
        cut.Find(".color-picker").KeyDown(new KeyboardEventArgs { Key = key, ShiftKey = shift });

    private static (string?, string?, string?) At(IRenderedComponent<ColorPicker> cut)
    {
        var root = cut.Find(".color-picker");
        return (root.GetAttribute("data-x"), root.GetAttribute("data-y"), root.GetAttribute("aria-valuenow"));
    }

    [Fact]
    public void Is_a_focusable_labelled_slider_whose_value_is_x()
    {
        var cut = Make(30, 70);
        var root = cut.Find(".color-picker");
        Assert.Equal("slider", root.GetAttribute("role"));
        Assert.Equal("0", root.GetAttribute("tabindex"));
        Assert.Equal("Saturation and lightness", root.GetAttribute("aria-label"));
        Assert.Equal("0", root.GetAttribute("aria-valuemin"));
        Assert.Equal("100", root.GetAttribute("aria-valuemax"));
        Assert.Equal(("30", "70", "30"), At(cut));
    }

    [Fact]
    public void Right_and_Left_move_x_and_Down_and_Up_move_y()
    {
        var cut = Make(50, 50);
        Press(cut, "ArrowRight");
        Assert.Equal(("51", "50", "51"), At(cut));
        Press(cut, "ArrowLeft");
        Press(cut, "ArrowLeft");
        Assert.Equal(("49", "50", "49"), At(cut));
        Press(cut, "ArrowDown");
        Assert.Equal(("49", "51", "49"), At(cut));
        Press(cut, "ArrowUp");
        Press(cut, "ArrowUp");
        Assert.Equal(("49", "49", "49"), At(cut));
        Assert.Equal(49, _x);
        Assert.Equal(49, _y);
    }

    [Fact]
    public void Shift_moves_ten_and_both_axes_stay_inside_0_to_100()
    {
        var cut = Make(95, 5);
        Press(cut, "ArrowRight", shift: true);
        Assert.Equal(("100", "5", "100"), At(cut));
        Press(cut, "ArrowUp", shift: true);
        Assert.Equal(("100", "0", "100"), At(cut));
        Press(cut, "ArrowLeft", shift: true);
        Press(cut, "ArrowDown", shift: true);
        Assert.Equal(("90", "10", "90"), At(cut));
        for (var i = 0; i < 12; i++) Press(cut, "ArrowDown", shift: true);
        for (var i = 0; i < 12; i++) Press(cut, "ArrowLeft", shift: true);
        Assert.Equal(("0", "100", "0"), At(cut));
    }

    [Fact]
    public void Home_and_End_set_x_to_the_ends_and_leave_y()
    {
        var cut = Make(40, 60);
        Press(cut, "End");
        Assert.Equal(("100", "60", "100"), At(cut));
        Press(cut, "Home");
        Assert.Equal(("0", "60", "0"), At(cut));
        Assert.Null(_y);
    }

    [Fact]
    public void Disabled_leaves_the_tab_order_and_ignores_keys()
    {
        var cut = Make(40, 60, disabled: true);
        var root = cut.Find(".color-picker");
        Assert.Equal("-1", root.GetAttribute("tabindex"));
        Assert.Equal("true", root.GetAttribute("aria-disabled"));
        Press(cut, "ArrowRight");
        Press(cut, "ArrowDown");
        Press(cut, "End");
        Assert.Equal(("40", "60", "40"), At(cut));
        Assert.Null(_x);
        Assert.Null(_y);
    }
}
