using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class RangeFieldsetTests : TestContext
{
    private IRenderedComponent<RangeFieldset> Render(Action<ComponentParameterCollectionBuilder<RangeFieldset>>? more = null) =>
        RenderComponent<RangeFieldset>(p =>
        {
            p.Add(x => x.Legend, "Price")
             .Add(x => x.MinimumLabel, "Lowest price")
             .Add(x => x.MaximumLabel, "Highest price");
            more?.Invoke(p);
        });

    [Fact]
    public void Is_a_fieldset_with_a_legend_and_two_range_inputs_on_one_scale()
    {
        var cut = Render(p => p.Add(x => x.Min, 10).Add(x => x.Max, 90).Add(x => x.Step, 5).Add(x => x.CssClass, "extra"));
        var root = cut.Find("fieldset.range-fieldset");
        Assert.Contains("extra", root.GetAttribute("class"));
        Assert.Equal("Price", cut.Find("legend.range-fieldset-legend").TextContent);
        var lower = cut.Find("input.range-fieldset-minimum");
        var upper = cut.Find("input.range-fieldset-maximum");
        Assert.Equal("Lowest price", lower.GetAttribute("aria-label"));
        Assert.Equal("Highest price", upper.GetAttribute("aria-label"));
        foreach (var input in new[] { lower, upper })
        {
            Assert.Equal("range", input.GetAttribute("type"));
            Assert.Equal("10", input.GetAttribute("min"));
            Assert.Equal("90", input.GetAttribute("max"));
            Assert.Equal("5", input.GetAttribute("step"));
        }
        Assert.Equal("10", lower.GetAttribute("value"));
        Assert.Equal("90", upper.GetAttribute("value"));
    }

    [Fact]
    public void The_lower_thumb_stops_at_the_upper_one()
    {
        double? bound = null;
        (double, double)? changed = null;
        var cut = Render(p => p.Add(x => x.Minimum, 20).Add(x => x.Maximum, 60)
            .Add(x => x.MinimumChanged, v => bound = v)
            .Add(x => x.OnChange, v => changed = v));
        cut.Find("input.range-fieldset-minimum").Input("80");
        cut.WaitForAssertion(() => Assert.Equal("60", cut.Find("input.range-fieldset-minimum").GetAttribute("value")));
        Assert.Equal(60, bound);
        Assert.Equal((60d, 60d), changed);
    }

    [Fact]
    public void The_upper_thumb_stops_at_the_lower_one()
    {
        var cut = Render(p => p.Add(x => x.Minimum, 20).Add(x => x.Maximum, 60));
        cut.Find("input.range-fieldset-maximum").Input("5");
        cut.WaitForAssertion(() => Assert.Equal("20", cut.Find("input.range-fieldset-maximum").GetAttribute("value")));
    }

    [Fact]
    public void A_move_within_bounds_is_kept()
    {
        var cut = Render(p => p.Add(x => x.Minimum, 20).Add(x => x.Maximum, 60));
        cut.Find("input.range-fieldset-minimum").Input("30");
        cut.Find("input.range-fieldset-maximum").Input("70");
        Assert.Equal("30", cut.Find("input.range-fieldset-minimum").GetAttribute("value"));
        Assert.Equal("70", cut.Find("input.range-fieldset-maximum").GetAttribute("value"));
    }

    [Fact]
    public void Each_value_is_its_own_form_field()
    {
        var cut = Render(p => p.Add(x => x.MinimumName, "price-min").Add(x => x.MaximumName, "price-max"));
        Assert.Equal("price-min", cut.Find("input.range-fieldset-minimum").GetAttribute("name"));
        Assert.Equal("price-max", cut.Find("input.range-fieldset-maximum").GetAttribute("name"));
    }

    [Fact]
    public void Disabled_disables_the_fieldset()
    {
        Assert.True(Render(p => p.Add(x => x.Disabled, true)).Find("fieldset").HasAttribute("disabled"));
    }

    [Fact]
    public void AdditionalAttributes_pass_through_to_root()
    {
        Assert.Equal("value", Render(p => p.AddUnmatched("data-test", "value")).Find(".range-fieldset").GetAttribute("data-test"));
    }
}
