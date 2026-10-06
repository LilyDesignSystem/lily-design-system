using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class DateRangeTests : TestContext
{
    private IRenderedComponent<DateRange> Render(Action<ComponentParameterCollectionBuilder<DateRange>>? more = null) =>
        RenderComponent<DateRange>(p =>
        {
            p.Add(x => x.Label, "Trip dates")
             .Add(x => x.StartLabel, "Departure")
             .Add(x => x.EndLabel, "Return");
            more?.Invoke(p);
        });

    [Fact]
    public void Renders_a_fieldset_with_kebab_base_class()
    {
        var root = Render().Find("fieldset.date-range");
        Assert.NotNull(root);
        Assert.Equal("Trip dates", root.GetAttribute("aria-label"));
    }

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class()
    {
        var root = Render(p => p.Add(x => x.CssClass, "extra")).Find(".date-range");
        Assert.Contains("extra", root.GetAttribute("class"));
    }

    [Fact]
    public void AdditionalAttributes_pass_through_to_root()
    {
        var root = Render(p => p.AddUnmatched("data-test", "value")).Find(".date-range");
        Assert.Equal("value", root.GetAttribute("data-test"));
    }

    [Fact]
    public void Renders_two_date_inputs_each_with_its_own_accessible_name()
    {
        var inputs = Render().FindAll("input.date-input[type=date]");
        Assert.Equal(2, inputs.Count);
        Assert.Equal("Departure", inputs[0].GetAttribute("aria-label"));
        Assert.Equal("Return", inputs[1].GetAttribute("aria-label"));
    }

    [Fact]
    public void Reflects_start_and_end_values()
    {
        var inputs = Render(p => p.Add(x => x.Start, "2026-01-02").Add(x => x.End, "2026-01-09")).FindAll("input");
        Assert.Equal("2026-01-02", inputs[0].GetAttribute("value"));
        Assert.Equal("2026-01-09", inputs[1].GetAttribute("value"));
    }

    [Fact]
    public void Changing_an_input_raises_the_matching_changed_callback()
    {
        string? start = null, end = null;
        var cut = Render(p => p
            .Add(x => x.StartChanged, (string v) => { start = v; })
            .Add(x => x.EndChanged, (string v) => { end = v; }));
        var inputs = cut.FindAll("input");
        inputs[1].Change("2026-02-01");
        Assert.Equal("2026-02-01", end);
        Assert.Null(start);
        inputs[0].Change("2026-01-15");
        Assert.Equal("2026-01-15", start);
    }
}
