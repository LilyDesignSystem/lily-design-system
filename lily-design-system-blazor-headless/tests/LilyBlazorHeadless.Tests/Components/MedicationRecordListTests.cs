using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class MedicationRecordListTests : TestContext
{
    [Fact]
    public void Known_list_is_named_by_its_status_and_holds_its_items()
    {
        var cut = RenderComponent<MedicationRecordList>(p => p
            .Add(x => x.Status, "known").Add(x => x.StatusLabel, "Current medicines")
            .AddChildContent("<li class=\"medication-record-list-item\">One record</li>"));
        var list = cut.Find("ul.medication-record-list");
        Assert.Equal("Current medicines", list.GetAttribute("aria-label"));
        Assert.Equal("known", list.GetAttribute("data-status"));
        Assert.Empty(cut.FindAll(".medication-record-list-status"));
        Assert.Contains("One record", list.TextContent);
    }

    [Theory]
    [InlineData("none-known", "No known medicines (none-known)")]
    [InlineData("not-recorded", "No known medicines (not-recorded)")]
    [InlineData("unavailable", "No known medicines (unavailable)")]
    [InlineData("omitted", "No known medicines (omitted)")]
    public void Other_statuses_are_the_lists_one_item(string status, string words)
    {
        var cut = RenderComponent<MedicationRecordList>(p => p.Add(x => x.Status, status).Add(x => x.StatusLabel, words));
        var items = cut.FindAll("li");
        Assert.Single(items);
        Assert.Equal("medication-record-list-status", items[0].ClassName);
        Assert.Equal(words, items[0].TextContent);
    }
}
