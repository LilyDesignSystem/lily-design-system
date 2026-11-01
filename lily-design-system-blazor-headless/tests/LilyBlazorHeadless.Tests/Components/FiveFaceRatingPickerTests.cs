using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

// The arrow keys are the native radio group's, which bUnit cannot drive; the html-headless wdio test proves them in a
// browser. These tests prove what the keys depend on: five radios sharing one name, checked from Value.
public class FiveFaceRatingPickerTests : TestContext
{
    [Fact]
    public void Renders_a_labelled_fieldset_radiogroup()
    {
        var cut = RenderComponent<FiveFaceRatingPicker>(p => p
            .Add(x => x.Label, "Rating")
            .Add(x => x.CssClass, "extra")
            .AddUnmatched("data-test", "value"));
        var root = cut.Find("fieldset.five-face-rating-picker");
        Assert.Contains("extra", root.GetAttribute("class"));
        Assert.Equal("radiogroup", root.GetAttribute("role"));
        Assert.Equal("Rating", root.GetAttribute("aria-label"));
        Assert.Equal("value", root.GetAttribute("data-test"));
        Assert.False(root.HasAttribute("disabled"));
    }

    [Fact]
    public void Holds_five_radios_valued_1_to_5_sharing_one_name()
    {
        var cut = RenderComponent<FiveFaceRatingPicker>(p => p.Add(x => x.Label, "Rating"));
        var radios = cut.FindAll("input[type=radio]");
        Assert.Equal(["1", "2", "3", "4", "5"], radios.Select(r => r.GetAttribute("value")));
        Assert.All(radios, r => Assert.Equal("face-rating", r.GetAttribute("name")));
        var named = RenderComponent<FiveFaceRatingPicker>(p => p.Add(x => x.Label, "Rating").Add(x => x.Name, "q1"));
        Assert.All(named.FindAll("input[type=radio]"), r => Assert.Equal("q1", r.GetAttribute("name")));
    }

    [Fact]
    public void Labels_the_options_with_the_numbers_by_default()
    {
        var cut = RenderComponent<FiveFaceRatingPicker>(p => p.Add(x => x.Label, "Rating"));
        Assert.Equal(["1", "2", "3", "4", "5"], cut.FindAll("label").Select(l => l.TextContent.Trim()));
    }

    [Fact]
    public void Labels_the_options_with_the_consumer_text()
    {
        var cut = RenderComponent<FiveFaceRatingPicker>(p => p.Add(x => x.Label, "Rating").Add(x => x.Labels, new[] { "Awful", "Poor", "OK", "Good", "Great" }));
        Assert.Equal(new[] { "Awful", "Poor", "OK", "Good", "Great" }, cut.FindAll("label").Select(l => l.TextContent.Trim()));
    }

    [Fact]
    public void Checks_the_radio_for_Value_and_reports_a_change()
    {
        int? reported = null;
        var cut = RenderComponent<FiveFaceRatingPicker>(p => p
            .Add(x => x.Label, "Rating")
            .Add(x => x.Value, 2)
            .Add(x => x.ValueChanged, (int v) => reported = v));
        var radios = cut.FindAll("input[type=radio]");
        Assert.Equal([false, true, false, false, false], radios.Select(r => r.HasAttribute("checked")));
        radios[3].Change(true);
        Assert.Equal(4, reported);
        Assert.True(cut.FindAll("input[type=radio]")[3].HasAttribute("checked"));
    }

    [Fact]
    public void Disabled_disables_the_whole_group()
    {
        var cut = RenderComponent<FiveFaceRatingPicker>(p => p.Add(x => x.Label, "Rating").Add(x => x.Disabled, true));
        Assert.True(cut.Find("fieldset").HasAttribute("disabled"));
    }
}
