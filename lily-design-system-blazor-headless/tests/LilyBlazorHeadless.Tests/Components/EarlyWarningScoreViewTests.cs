using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class EarlyWarningScoreViewTests : TestContext
{
    [Fact]
    public void Renders_system_score_band_and_escalation()
    {
        var cut = RenderComponent<EarlyWarningScoreView>(p => p
            .Add(x => x.System, "NEWS2").Add(x => x.Score, "7").Add(x => x.Band, "high")
            .Add(x => x.BandLabel, "High").Add(x => x.Escalation, "Urgent response"));
        Assert.Equal("high", cut.Find(".early-warning-score-view").GetAttribute("data-band"));
        Assert.Equal("NEWS2", cut.Find(".early-warning-score-view-system").TextContent);
        Assert.Equal("7", cut.Find(".early-warning-score-view-score").TextContent);
        Assert.Equal("High", cut.Find(".early-warning-score-view-band").TextContent);
        Assert.Equal("Urgent response", cut.Find(".early-warning-score-view-escalation").TextContent);
    }

    // HC-C9
    [Fact]
    public void A_score_alone_shows_only_the_score_with_no_empty_band()
    {
        var cut = RenderComponent<EarlyWarningScoreView>(p => p.Add(x => x.Score, "3"));
        var root = cut.Find(".early-warning-score-view");
        Assert.Null(root.GetAttribute("data-band"));
        Assert.Equal("3", root.TextContent);
        Assert.Empty(cut.FindAll(".early-warning-score-view-system, .early-warning-score-view-band, .early-warning-score-view-escalation, .screen-reader-span"));
    }

    [Fact]
    public void A_label_is_read_before_the_score_but_not_shown()
    {
        var cut = RenderComponent<EarlyWarningScoreView>(p => p.Add(x => x.Score, "3").Add(x => x.Label, "Early warning score"));
        Assert.Equal("Early warning score ", cut.Find(".screen-reader-span").TextContent);
        Assert.Equal("Early warning score 3", cut.Find(".early-warning-score-view").TextContent);
    }
}
