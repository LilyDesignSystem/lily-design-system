using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class ObservationViewTests : TestContext
{
    [Fact]
    public void Renders_value_unit_flag_and_range_as_parts()
    {
        var cut = RenderComponent<ObservationView>(p => p
            .Add(x => x.Value, "5.9").Add(x => x.Unit, "mmol/L").Add(x => x.Interpretation, "H")
            .Add(x => x.FlagLabel, "High").Add(x => x.Range, "3.5–5.3"));
        var root = cut.Find("span.observation-view");
        Assert.Equal("H", root.GetAttribute("data-interpretation"));
        Assert.Equal("5.9", cut.Find(".observation-view-value").TextContent);
        Assert.Equal("mmol/L", cut.Find(".observation-view-unit").TextContent);
        Assert.Equal("High", cut.Find(".observation-view-flag").TextContent);
        Assert.Equal("3.5–5.3", cut.Find(".observation-view-range").TextContent);
        Assert.Contains("5.9 mmol/L", root.TextContent);
    }

    [Theory]
    [InlineData("not-recorded", "Not recorded")]
    [InlineData("unavailable", "Result unavailable")]
    public void Missing_results_show_their_words_never_a_blank(string status, string words)
    {
        var cut = RenderComponent<ObservationView>(p => p.Add(x => x.Status, status).Add(x => x.StatusLabel, words));
        Assert.Equal(status, cut.Find(".observation-view").GetAttribute("data-status"));
        Assert.Equal(words, cut.Find(".observation-view-status").TextContent);
        Assert.Empty(cut.FindAll(".observation-view-value"));
    }

    [Fact]
    public void Label_is_hidden_text_not_aria_label()
    {
        var cut = RenderComponent<ObservationView>(p => p.Add(x => x.Label, "Potassium").Add(x => x.Value, "4.1"));
        Assert.Equal("Potassium ", cut.Find(".screen-reader-span").TextContent);
        Assert.Null(cut.Find(".observation-view").GetAttribute("aria-label"));
    }
}
