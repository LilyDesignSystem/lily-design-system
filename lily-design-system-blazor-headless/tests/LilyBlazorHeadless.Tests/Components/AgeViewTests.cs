using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class AgeViewTests : TestContext
{
    [Fact]
    public void Renders_the_consumers_words_and_the_duration()
    {
        var cut = RenderComponent<AgeView>(p => p.Add(x => x.Label, "Age").Add(x => x.Value, "3 weeks 2 days").Add(x => x.Duration, "P23D"));
        var root = cut.Find("span.age-view");
        Assert.Equal("P23D", root.GetAttribute("data-duration"));
        Assert.Equal("Age 3 weeks 2 days", root.TextContent);
        Assert.Null(root.GetAttribute("aria-label"));
    }
}
