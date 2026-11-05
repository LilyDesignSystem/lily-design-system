using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class SliderTests : TestContext
{
    private IRenderedComponent<Slider> Make(Action<ComponentParameterCollectionBuilder<Slider>>? more = null) =>
        RenderComponent<Slider>(p =>
        {
            p
            .Add(x => x.Label, "Volume");
            more?.Invoke(p);
        });

    [Fact]
    public void Renders_with_kebab_base_class() => Assert.NotNull(Make().Find("input.slider"));

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class() =>
        Assert.Contains("extra", Make(p => p.Add(x => x.CssClass, "extra")).Find("input.slider").GetAttribute("class"));

    [Fact]
    public void AdditionalAttributes_pass_through_to_root() =>
        Assert.Equal("value", Make(p => p.AddUnmatched("data-test", "value")).Find("input.slider").GetAttribute("data-test"));

    [Fact]
    public void Is_a_named_range_with_the_defaults()
    {
        var root = Make().Find("input");
        Assert.Equal("range", root.GetAttribute("type"));
        Assert.Equal("Volume", root.GetAttribute("aria-label"));
        Assert.Equal("0", root.GetAttribute("min"));
        Assert.Equal("100", root.GetAttribute("max"));
        Assert.Equal("1", root.GetAttribute("step"));
        Assert.Equal("50", root.GetAttribute("value"));
    }

    [Fact]
    public void Limits_stay_invariant_in_a_comma_culture()
    {
        var culture = System.Globalization.CultureInfo.CurrentCulture;
        System.Globalization.CultureInfo.CurrentCulture = new System.Globalization.CultureInfo("de-DE");
        try
        {
            Assert.Equal("0.5", Make(p => p.Add(x => x.Step, 0.5)).Find("input").GetAttribute("step"));
        }
        finally
        {
            System.Globalization.CultureInfo.CurrentCulture = culture;
        }
    }

    [Fact]
    public void The_limits_come_before_the_value()
    {
        // The browser clamps the value to the limits present when it arrives.
        var markup = Make(p => p.Add(x => x.Max, 200).Add(x => x.Value, 150)).Markup;
        Assert.True(markup.IndexOf("max=", StringComparison.Ordinal) < markup.IndexOf("value=", StringComparison.Ordinal));
    }

    [Fact]
    public void Moving_it_reports_the_number()
    {
        double? seen = null;
        Make(p => p.Add(x => x.ValueChanged, (double v) => seen = v)).Find("input").Input("30");
        Assert.Equal(30, seen);
    }

    [Fact]
    public void Disabled_reaches_the_input() =>
        Assert.True(Make(p => p.Add(x => x.Disabled, true)).Find("input").HasAttribute("disabled"));
}
