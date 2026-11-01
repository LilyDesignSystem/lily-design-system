using Bunit;
using LilyBlazorHeadless.Components;
using Microsoft.AspNetCore.Components.Web;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class ScrollBarTests : TestContext
{
    [Fact]
    public void Renders_with_kebab_base_class()
    {
        var cut = RenderComponent<ScrollBar>(p => p
            .AddChildContent("body"));
        var root = cut.Find(".scroll-bar");
        Assert.NotNull(root);
    }

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class()
    {
        var cut = RenderComponent<ScrollBar>(p => p
            .AddChildContent("body")
            .Add(x => x.CssClass, "extra"));
        var root = cut.Find(".scroll-bar");
        Assert.Contains("extra", root.GetAttribute("class"));
    }

    [Fact]
    public void AdditionalAttributes_pass_through_to_root()
    {
        var cut = RenderComponent<ScrollBar>(p => p
            .AddChildContent("body")
            .AddUnmatched("data-test", "value"));
        var root = cut.Find(".scroll-bar");
        Assert.Equal("value", root.GetAttribute("data-test"));
    }

    private IRenderedComponent<ScrollBar> Bar(double value, double min = 0, double max = 100, double step = 1, double pageStep = 10) =>
        RenderComponent<ScrollBar>(p => p
            .Add(x => x.Label, "Scroll")
            .Add(x => x.Value, value)
            .Add(x => x.Min, min)
            .Add(x => x.Max, max)
            .Add(x => x.Step, step)
            .Add(x => x.PageStep, pageStep)
            .AddChildContent("thumb"));

    private static void Press(IRenderedComponent<ScrollBar> cut, string key) =>
        cut.Find(".scroll-bar").KeyDown(new KeyboardEventArgs { Key = key });

    private static string? Now(IRenderedComponent<ScrollBar> cut) =>
        cut.Find(".scroll-bar").GetAttribute("aria-valuenow");

    [Fact]
    public void Is_a_focusable_labelled_scrollbar_naming_what_it_scrolls()
    {
        var cut = RenderComponent<ScrollBar>(p => p
            .Add(x => x.Label, "Scroll")
            .Add(x => x.Orientation, "horizontal")
            .Add(x => x.Controls, "messages")
            .AddChildContent("thumb"));
        var root = cut.Find(".scroll-bar");
        Assert.Equal("scrollbar", root.GetAttribute("role"));
        Assert.Equal("0", root.GetAttribute("tabindex"));
        Assert.Equal("Scroll", root.GetAttribute("aria-label"));
        Assert.Equal("horizontal", root.GetAttribute("aria-orientation"));
        Assert.Equal("messages", root.GetAttribute("aria-controls"));
    }

    [Fact]
    public void Arrow_keys_move_the_value_by_step_clamped_to_the_range()
    {
        var cut = Bar(1, step: 2);
        Press(cut, "ArrowDown");
        Assert.Equal("3", Now(cut));
        Press(cut, "ArrowRight");
        Assert.Equal("5", Now(cut));
        Press(cut, "ArrowUp");
        Press(cut, "ArrowLeft");
        Press(cut, "ArrowLeft");
        Assert.Equal("0", Now(cut));
    }

    [Fact]
    public void Page_keys_move_the_value_by_page_step()
    {
        var cut = Bar(50, pageStep: 25);
        Press(cut, "PageDown");
        Assert.Equal("75", Now(cut));
        Press(cut, "PageDown");
        Assert.Equal("100", Now(cut));
        Press(cut, "PageUp");
        Assert.Equal("75", Now(cut));
    }

    [Fact]
    public void Home_and_End_jump_to_min_and_max()
    {
        var cut = Bar(40, min: -20, max: 150);
        Assert.Equal("-20", cut.Find(".scroll-bar").GetAttribute("aria-valuemin"));
        Press(cut, "End");
        Assert.Equal("150", Now(cut));
        Press(cut, "Home");
        Assert.Equal("-20", Now(cut));
    }

    [Fact]
    public void A_key_reports_the_new_value_through_ValueChanged()
    {
        double? reported = null;
        var cut = RenderComponent<ScrollBar>(p => p
            .Add(x => x.Label, "Scroll")
            .Add(x => x.Value, 20)
            .Add(x => x.ValueChanged, (double v) => reported = v)
            .AddChildContent("thumb"));
        Press(cut, "PageDown");
        Assert.Equal(30, reported);
    }
}
