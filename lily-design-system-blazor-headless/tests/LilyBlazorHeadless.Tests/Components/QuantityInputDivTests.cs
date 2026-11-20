using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class QuantityInputDivTests : TestContext
{
    private static readonly QuantityUnit[] TwoUnits =
    [
        new("kg", "kilograms", 0, 300, 0.1m),
        new("[lb_av]", "pounds", 0, 660, 0.1m),
    ];

    private IRenderedComponent<QuantityInputDiv> Make(IReadOnlyList<QuantityUnit> units, Action<ComponentParameterCollectionBuilder<QuantityInputDiv>>? more = null) =>
        RenderComponent<QuantityInputDiv>(p =>
        {
            p.Add(x => x.Label, "Weight").Add(x => x.MagnitudeLabel, "Amount").Add(x => x.UnitLabel, "Unit").Add(x => x.Units, units);
            more?.Invoke(p);
        });

    [Fact]
    public void Renders_a_named_group_with_a_labelled_number_and_unit_select()
    {
        var cut = Make(TwoUnits);
        var group = cut.Find("div.quantity-input-div");
        Assert.Equal("group", group.GetAttribute("role"));
        Assert.Equal("Weight", group.GetAttribute("aria-label"));
        Assert.Equal("number", cut.Find(".quantity-input-div-magnitude").GetAttribute("type"));
        Assert.Equal(2, cut.FindAll("select option").Count);
    }

    [Fact]
    public void The_number_takes_the_limits_of_the_unit_chosen_and_keeps_its_value()
    {
        string? unit = null;
        var cut = Make(TwoUnits, p => p.Add(x => x.Magnitude, "70").Add(x => x.UnitChanged, v => unit = v));
        Assert.Equal("300", cut.Find(".quantity-input-div-magnitude").GetAttribute("max"));
        cut.Find("select").Change("[lb_av]");
        Assert.Equal("[lb_av]", unit);
        Assert.Equal("660", cut.Find(".quantity-input-div-magnitude").GetAttribute("max"));
        Assert.Equal("70", cut.Find(".quantity-input-div-magnitude").GetAttribute("value"));
    }

    [Fact]
    public void One_unit_is_text_linked_to_the_number_and_submitted_with_it()
    {
        var cut = Make([TwoUnits[0]], p => p.Add(x => x.Name, "weight"));
        Assert.Empty(cut.FindAll("select"));
        var unit = cut.Find(".quantity-input-div-unit");
        Assert.Equal("SPAN", unit.TagName);
        Assert.Equal(unit.Id, cut.Find(".quantity-input-div-magnitude").GetAttribute("aria-describedby"));
        Assert.Equal("weight-unit", cut.Find("input[type=hidden]").GetAttribute("name"));
    }

    [Fact]
    public void Typing_the_magnitude_reports_it()
    {
        string? reported = null;
        var cut = RenderComponent<QuantityInputDiv>(p => p
            .Add(x => x.Label, "Dose")
            .Add(x => x.MagnitudeLabel, "Amount")
            .Add(x => x.Units, new[] { new QuantityUnit("mg", "mg") })
            .Add(x => x.MagnitudeChanged, v => reported = v));
        cut.Find(".quantity-input-div-magnitude").Input("2.5");
        Assert.Equal("2.5", reported);
        Assert.Equal("2.5", cut.Instance.Magnitude);
    }
}
