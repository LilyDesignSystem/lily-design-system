using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class ObservationViewTests : TestContext
{
    // HC-F4
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

    // HC-C3
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

    // HC-C1
    [Fact]
    public void Interpretation_is_data_and_the_flag_is_only_the_consumers_words()
    {
        var cut = RenderComponent<ObservationView>(p => p.Add(x => x.Value, "2.1").Add(x => x.Interpretation, "LL").Add(x => x.FlagLabel, "Critically low"));
        var root = cut.Find(".observation-view");
        Assert.Equal("LL", root.GetAttribute("data-interpretation"));
        Assert.DoesNotContain("LL", root.TextContent);
        Assert.Contains("Critically low", root.TextContent);
    }

    [Theory]
    [InlineData("amended", "Amended")]
    [InlineData("corrected", "Corrected")]
    public void Amended_and_corrected_show_the_value_with_their_words(string status, string words)
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

    // HC-C2, HC-C4
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

    [Fact]
    public void A_meter_shows_where_the_value_sits_hidden_from_assistive_technology()
    {
        var previous = System.Globalization.CultureInfo.CurrentCulture;
        System.Globalization.CultureInfo.CurrentCulture = new System.Globalization.CultureInfo("de-DE");
        try
        {
            var cut = RenderComponent<ObservationView>(p => p
                .Add(x => x.Value, "5,9")
                .Add(x => x.MeterValue, 5.9)
                .Add(x => x.MeterMin, 2)
                .Add(x => x.MeterMax, 8)
                .Add(x => x.MeterLow, 3.5)
                .Add(x => x.MeterHigh, 5.3)
                .Add(x => x.MeterOptimum, 4.4));
            var meter = cut.Find("meter.observation-view-meter");
            Assert.Equal("true", meter.GetAttribute("aria-hidden"));
            // Invariant numbers, even under a German culture.
            Assert.Equal(["5.9", "2", "8", "3.5", "5.3", "4.4"],
                new[] { "value", "min", "max", "low", "high", "optimum" }.Select(a => meter.GetAttribute(a)));
        }
        finally
        {
            System.Globalization.CultureInfo.CurrentCulture = previous;
        }
    }

    [Fact]
    public void No_meter_without_a_value_min_and_max_or_for_a_missing_result()
    {
        var partial = RenderComponent<ObservationView>(p => p.Add(x => x.Value, "5.9").Add(x => x.MeterValue, 5.9).Add(x => x.MeterMin, 2));
        Assert.Empty(partial.FindAll("meter"));
        var missing = RenderComponent<ObservationView>(p => p
            .Add(x => x.Status, "unavailable")
            .Add(x => x.StatusLabel, "Unavailable")
            .Add(x => x.MeterValue, 5.9)
            .Add(x => x.MeterMin, 2)
            .Add(x => x.MeterMax, 8));
        Assert.Empty(missing.FindAll("meter"));
    }

    // docs/audits/gpt-6-2-astra-high finding 2.
    private IRenderedComponent<ObservationView> Stale(string status, string? words, bool showWithdrawn = false) =>
        RenderComponent<ObservationView>(p => p
            .Add(x => x.Value, "5.9").Add(x => x.Unit, "mmol/L").Add(x => x.Interpretation, "HH").Add(x => x.FlagLabel, "Critically high")
            .Add(x => x.Range, "3.5-5.3").Add(x => x.Ranges, [new ObservationRange("Critical", "above 6.5")])
            .Add(x => x.MeterValue, 5.9).Add(x => x.MeterMin, 2).Add(x => x.MeterMax, 8)
            .Add(x => x.PreviousValue, "5.1").Add(x => x.PreviousLabel, "was 5.1")
            .Add(x => x.Status, status).Add(x => x.StatusLabel, words).Add(x => x.ShowWithdrawn, showWithdrawn));

    private static void AssertNoRecord(IRenderedComponent<ObservationView> cut)
    {
        foreach (var trace in new[] { "5.9", "HH", "Critically", "3.5", "6.5", "5.1", "<meter", "<del", "data-interpretation" })
            Assert.DoesNotContain(trace, cut.Markup);
    }

    // HC-C12, HC-C13 (spec/healthcare-ui/requirements.md)
    [Theory]
    [InlineData("masked", "Withheld")]
    [InlineData("registered", "Not yet available")]
    [InlineData("cancelled", "Test cancelled")]
    [InlineData("unavailable", "Result unavailable")]
    [InlineData("not-applicable", "Not applicable")]
    [InlineData("entered-in-error", "Entered in error")]
    public void A_withheld_or_withdrawn_result_shows_only_its_words(string status, string words)
    {
        var cut = Stale(status, words);
        Assert.Equal(words, cut.Find(".observation-view").TextContent.Trim());
        AssertNoRecord(cut);
    }

    // HC-C13 (spec/healthcare-ui/requirements.md)
    [Fact]
    public void In_a_history_view_the_former_value_follows_its_words()
    {
        var cut = Stale("entered-in-error", "Entered in error", showWithdrawn: true);
        Assert.Equal("Entered in error 5.9\u00a0mmol/L", cut.Find(".observation-view").TextContent.Trim());
        Assert.Equal("5.9\u00a0mmol/L", cut.Find("del.observation-view-withdrawn-value").TextContent);
        foreach (var trace in new[] { "HH", "Critically", "3.5", "6.5", "<meter", "5.1" }) Assert.DoesNotContain(trace, cut.Markup);
    }

    // HC-C14 (spec/healthcare-ui/requirements.md)
    [Theory]
    [InlineData("preliminary")]
    [InlineData("amended")]
    [InlineData("corrected")]
    [InlineData("unknown")]
    [InlineData("entered-in-error")]
    [InlineData("masked")]
    public void A_result_with_no_words_shows_no_value(string status) => AssertNoRecord(Stale(status, null, showWithdrawn: true));

    // HC-C12, HC-C13 (spec/healthcare-ui/requirements.md)
    [Fact]
    public void A_result_that_becomes_masked_or_withdrawn_stops_showing_its_value()
    {
        var cut = Stale("final", null);
        Assert.Contains("5.9", cut.Markup);
        cut.SetParametersAndRender(p => p.Add(x => x.Status, "masked").Add(x => x.StatusLabel, "Withheld"));
        AssertNoRecord(cut);
        cut.SetParametersAndRender(p => p.Add(x => x.Status, "entered-in-error").Add(x => x.StatusLabel, "Entered in error"));
        AssertNoRecord(cut);
    }
}
