using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class NumericRatingScalePickerTests : TestContext
{
    [Fact]
    public void Is_a_fieldset_with_a_legend_radios_and_described_ends()
    {
        var cut = RenderComponent<NumericRatingScalePicker>(p => p
            .Add(x => x.Label, "How bad is your pain now?").Add(x => x.MinLabel, "No pain").Add(x => x.MaxLabel, "Worst pain imaginable"));
        Assert.Equal("How bad is your pain now?", cut.Find("fieldset legend").TextContent);
        var radios = cut.FindAll("input[type=radio]");
        Assert.Equal(11, radios.Count);
        Assert.Equal("No pain", cut.Find($"#{radios[0].GetAttribute("aria-describedby")}").TextContent);
        Assert.Equal("Worst pain imaginable", cut.Find($"#{radios[10].GetAttribute("aria-describedby")}").TextContent);
        Assert.Null(radios[5].GetAttribute("aria-describedby"));
    }

    [Fact]
    public void Choosing_a_radio_reports_the_value()
    {
        string? chosen = null;
        var cut = RenderComponent<NumericRatingScalePicker>(p => p
            .Add(x => x.Label, "Pain").Add(x => x.Min, 1).Add(x => x.Max, 5)
            .Add(x => x.ValueChanged, (string v) => chosen = v));
        Assert.Equal(5, cut.FindAll("input[type=radio]").Count);
        cut.FindAll("input[type=radio]")[3].Change("4");
        Assert.Equal("4", chosen);
    }
}
