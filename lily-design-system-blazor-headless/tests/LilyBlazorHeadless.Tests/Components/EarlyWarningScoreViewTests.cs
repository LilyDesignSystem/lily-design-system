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
}
