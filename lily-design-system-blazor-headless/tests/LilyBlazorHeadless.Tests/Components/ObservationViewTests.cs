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

    [Theory]
    [InlineData("amended", "Amended")]
    [InlineData("corrected", "Corrected")]
    [InlineData("entered-in-error", "Entered in error")]
    public void Amended_corrected_and_entered_in_error_show_the_value_with_their_words(string status, string words)
    {
        var cut = RenderComponent<ObservationView>(p => p.Add(x => x.Value, "5.9").Add(x => x.Status, status).Add(x => x.StatusLabel, words));
        Assert.Equal("5.9", cut.Find(".observation-view-value").TextContent);
        Assert.Equal(words, cut.Find(".observation-view-status").TextContent);
    }

    [Theory]
    [InlineData("cancelled", "Test cancelled")]
    [InlineData("masked", "Withheld")]
    public void Cancelled_and_masked_show_their_words_instead_of_a_value(string status, string words)
    {
        var cut = RenderComponent<ObservationView>(p => p.Add(x => x.Value, "5.9").Add(x => x.Status, status).Add(x => x.StatusLabel, words));
        Assert.Empty(cut.FindAll(".observation-view-value"));
        Assert.Equal(words, cut.Find(".observation-view-status").TextContent);
    }

    [Fact]
    public void Label_is_hidden_text_not_aria_label()
    {
        var cut = RenderComponent<ObservationView>(p => p.Add(x => x.Label, "Potassium").Add(x => x.Value, "4.1"));
        Assert.Equal("Potassium ", cut.Find(".screen-reader-span").TextContent);
        Assert.Null(cut.Find(".observation-view").GetAttribute("aria-label"));
    }

    [Fact]
    public void Not_applicable_replaces_the_value_with_the_consumers_words()
    {
        var cut = RenderComponent<ObservationView>(p => p.Add(x => x.Value, "").Add(x => x.Status, "not-applicable").Add(x => x.StatusLabel, "Not applicable"));
        Assert.Equal("not-applicable", cut.Find(".observation-view").GetAttribute("data-status"));
        Assert.Equal("Not applicable", cut.Find(".observation-view-status").TextContent);
        Assert.Empty(cut.FindAll(".observation-view-value"));
    }

    [Fact]
    public void Never_infers_an_interpretation_renders_named_ranges_and_keeps_a_superseded_value()
    {
        var cut = RenderComponent<ObservationView>(p => p.Add(x => x.Value, "4.8").Add(x => x.Range, "3.5–5.3")
            .Add(x => x.Ranges, new[] { new ObservationRange("Critical", "below 2.5") })
            .Add(x => x.Status, "corrected").Add(x => x.StatusLabel, "Corrected")
            .Add(x => x.PreviousValue, "5.1").Add(x => x.PreviousLabel, "was 5.1 until 3 Nov"));
        var root = cut.Find(".observation-view");
        Assert.False(root.HasAttribute("data-interpretation"));
        Assert.Empty(cut.FindAll(".observation-view-flag"));
        var ranges = cut.FindAll(".observation-view-range");
        Assert.Equal(2, ranges.Count);
        Assert.Equal("Critical below 2.5", ranges[1].TextContent);
        Assert.Equal("5.1", cut.Find("del.observation-view-previous-value").TextContent);
        Assert.Equal("was 5.1 until 3 Nov", cut.Find(".observation-view-previous-label").TextContent);
    }
}
