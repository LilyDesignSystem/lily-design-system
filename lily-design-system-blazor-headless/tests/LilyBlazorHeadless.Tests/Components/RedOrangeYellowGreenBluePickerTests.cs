using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

// The arrow keys are the native radio group's, which bUnit cannot drive; the html-headless wdio test proves them in a
// browser. These tests prove what the keys depend on: one radio per status sharing one name, checked from Value.
public class RedOrangeYellowGreenBluePickerTests : TestContext
{
    private static readonly Dictionary<string, string> French = new Dictionary<string, string> { ["red"] = "Rouge", ["orange"] = "Orange", ["yellow"] = "Jaune", ["green"] = "Vert", ["blue"] = "Bleu" };

    [Fact]
    public void Renders_a_labelled_fieldset_radiogroup()
    {
        var cut = RenderComponent<RedOrangeYellowGreenBluePicker>(p => p
            .Add(x => x.Label, "Status")
            .Add(x => x.StatusLabel, s => French[s])
            .Add(x => x.CssClass, "extra")
            .AddUnmatched("data-test", "value"));
        var root = cut.Find("fieldset.red-orange-yellow-green-blue-picker");
        Assert.Contains("extra", root.GetAttribute("class"));
        Assert.Equal("radiogroup", root.GetAttribute("role"));
        Assert.Equal("Status", root.GetAttribute("aria-label"));
        Assert.Equal("value", root.GetAttribute("data-test"));
        Assert.False(root.HasAttribute("disabled"));
    }

    [Fact]
    public void Holds_one_radio_per_status_sharing_one_name()
    {
        var cut = RenderComponent<RedOrangeYellowGreenBluePicker>(p => p.Add(x => x.Label, "Status").Add(x => x.StatusLabel, s => French[s]));
        var radios = cut.FindAll("input[type=radio]");
        Assert.Equal(["red", "orange", "yellow", "green", "blue"], radios.Select(r => r.GetAttribute("value")));
        Assert.All(radios, r => Assert.Equal("status", r.GetAttribute("name")));
    }

    [Fact]
    public void Labels_the_options_with_the_consumer_text_or_else_the_value()
    {
        var cut = RenderComponent<RedOrangeYellowGreenBluePicker>(p => p.Add(x => x.Label, "Status").Add(x => x.StatusLabel, s => French[s]));
        Assert.Equal(["Rouge", "Orange", "Jaune", "Vert", "Bleu"], cut.FindAll("label").Select(l => l.TextContent.Trim()));
        var bare = RenderComponent<RedOrangeYellowGreenBluePicker>(p => p.Add(x => x.Label, "Status"));
        Assert.Equal(["red", "orange", "yellow", "green", "blue"], bare.FindAll("label").Select(l => l.TextContent.Trim()));
    }

    [Fact]
    public void Checks_the_radio_for_Value_and_reports_a_change()
    {
        string? reported = null;
        var cut = RenderComponent<RedOrangeYellowGreenBluePicker>(p => p
            .Add(x => x.Label, "Status")
            .Add(x => x.StatusLabel, s => French[s])
            .Add(x => x.Value, "orange")
            .Add(x => x.ValueChanged, (string v) => reported = v));
        var radios = cut.FindAll("input[type=radio]");
        Assert.Equal([false, true, false, false, false], radios.Select(r => r.HasAttribute("checked")));
        radios[0].Change(true);
        Assert.Equal("red", reported);
        Assert.True(cut.FindAll("input[type=radio]")[0].HasAttribute("checked"));
    }

    [Fact]
    public void Disabled_disables_the_whole_group()
    {
        var cut = RenderComponent<RedOrangeYellowGreenBluePicker>(p => p.Add(x => x.Label, "Status").Add(x => x.Disabled, true));
        Assert.True(cut.Find("fieldset").HasAttribute("disabled"));
    }
}
