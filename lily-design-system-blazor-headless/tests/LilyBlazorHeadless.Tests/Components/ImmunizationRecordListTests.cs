using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class ImmunizationRecordListTests : TestContext
{
    [Fact]
    public void Known_list_is_named_by_its_status_and_holds_its_items()
    {
        var cut = RenderComponent<ImmunizationRecordList>(p => p
            .Add(x => x.Status, "known").Add(x => x.StatusLabel, "Immunizations")
            .AddChildContent("<li class=\"immunization-record-list-item\">One record</li>"));
        var list = cut.Find("ul.immunization-record-list");
        Assert.Equal("Immunizations", list.GetAttribute("aria-label"));
        Assert.Equal("known", list.GetAttribute("data-status"));
        Assert.Empty(cut.FindAll(".immunization-record-list-status"));
        Assert.Contains("One record", list.TextContent);
    }

    [Theory]
    [InlineData("none-known", "No immunizations recorded (none-known)")]
    [InlineData("not-recorded", "No immunizations recorded (not-recorded)")]
    [InlineData("unavailable", "No immunizations recorded (unavailable)")]
    [InlineData("omitted", "No immunizations recorded (omitted)")]
    public void Other_statuses_are_the_lists_one_item(string status, string words)
    {
        var cut = RenderComponent<ImmunizationRecordList>(p => p.Add(x => x.Status, status).Add(x => x.StatusLabel, words));
        var items = cut.FindAll("li");
        Assert.Single(items);
        Assert.Equal("immunization-record-list-status", items[0].ClassName);
        Assert.Equal(words, items[0].TextContent);
    }
}
