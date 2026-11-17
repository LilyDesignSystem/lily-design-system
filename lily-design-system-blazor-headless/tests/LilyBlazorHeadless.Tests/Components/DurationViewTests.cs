using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class DurationViewTests : TestContext
{
    private IRenderedComponent<DurationView> Make(string value, string duration, string? label = null) =>
        RenderComponent<DurationView>(p =>
        {
            p.Add(x => x.Value, value).Add(x => x.Duration, duration);
            if (label is not null) p.Add(x => x.Label, label);
        });

    [Fact]
    public void Renders_a_time_whose_datetime_is_the_duration_holding_the_consumers_words()
    {
        var root = Make("3 days 4 hours", "P3DT4H").Find("time.duration-view");
        Assert.Equal("P3DT4H", root.GetAttribute("datetime"));
        Assert.Equal("3 days 4 hours", root.TextContent);
        Assert.False(root.HasAttribute("data-negative"));
    }

    [Fact]
    public void A_negative_duration_keeps_its_length_as_datetime_and_is_marked()
    {
        var root = Make("3 days early", "-P3D").Find("time.duration-view");
        Assert.Equal("P3D", root.GetAttribute("datetime"));
        Assert.True(root.HasAttribute("data-negative"));
    }

    [Theory]
    [InlineData("P2Y")]
    [InlineData("P3M")]
    [InlineData("P1W")]
    [InlineData("PT")]
    [InlineData("")]
    public void Years_months_weeks_or_no_duration_give_no_datetime(string duration) =>
        Assert.False(Make("words", duration).Find("time.duration-view").HasAttribute("datetime"));

    [Fact]
    public void Names_the_value_with_hidden_text_when_a_label_is_given() =>
        Assert.Equal("Length of stay 4 days", Make("4 days", "P4D", "Length of stay").Find("time.duration-view").TextContent);

    [Fact]
    public void CssClass_and_attributes_pass_through()
    {
        var root = RenderComponent<DurationView>(p => p.Add(x => x.Value, "5 minutes").Add(x => x.Duration, "PT5M")
            .Add(x => x.CssClass, "extra").AddUnmatched("data-test", "v")).Find("time");
        Assert.Contains("extra", root.GetAttribute("class"));
        Assert.Equal("v", root.GetAttribute("data-test"));
    }
}
