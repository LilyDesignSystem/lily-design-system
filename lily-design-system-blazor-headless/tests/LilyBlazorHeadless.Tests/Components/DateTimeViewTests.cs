using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class DateTimeViewTests : TestContext
{
    [Fact]
    public void Renders_with_kebab_base_class()
    {
        var cut = RenderComponent<DateTimeView>(p => p
            .AddChildContent("body"));
        var root = cut.Find(".date-time-view");
        Assert.NotNull(root);
    }

    [Fact]
    public void CssClass_is_appended_to_kebab_base_class()
    {
        var cut = RenderComponent<DateTimeView>(p => p
            .AddChildContent("body")
            .Add(x => x.CssClass, "extra"));
        var root = cut.Find(".date-time-view");
        Assert.Contains("extra", root.GetAttribute("class"));
    }

    [Fact]
    public void AdditionalAttributes_pass_through_to_root()
    {
        var cut = RenderComponent<DateTimeView>(p => p
            .AddChildContent("body")
            .AddUnmatched("data-test", "value"));
        var root = cut.Find(".date-time-view");
        Assert.Equal("value", root.GetAttribute("data-test"));
    }

    // HC-F15
    [Fact]
    public void A_leap_second_is_kept_exactly_as_given()
    {
        var time = RenderComponent<DateTimeView>(p => p.Add(x => x.Value, "2016-12-31T23:59:60Z")).Find("time.date-time-view");
        Assert.Equal("2016-12-31T23:59:60Z", time.GetAttribute("datetime"));
        Assert.Equal("2016-12-31T23:59:60Z", time.TextContent);
        Assert.False(time.HasAttribute("aria-label"));
    }

    [Fact]
    public void Text_is_the_content_else_the_format_else_the_value()
    {
        var formatted = RenderComponent<DateTimeView>(p => p.Add(x => x.Value, "2026-11-25").Add(x => x.Format, "25 November 2026").Add(x => x.Label, "Seen on 25 November 2026"));
        Assert.Equal("25 November 2026", formatted.Find("time").TextContent);
        Assert.Equal("2026-11-25", formatted.Find("time").GetAttribute("datetime"));
        Assert.Equal("Seen on 25 November 2026", formatted.Find("time").GetAttribute("aria-label"));
        var content = RenderComponent<DateTimeView>(p => p.Add(x => x.Value, "2026-11-25").Add(x => x.Format, "25 November 2026").AddChildContent("yesterday"));
        Assert.Equal("yesterday", content.Find("time").TextContent);
    }
}
