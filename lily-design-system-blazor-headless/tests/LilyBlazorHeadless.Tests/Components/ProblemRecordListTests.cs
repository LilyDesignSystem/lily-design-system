using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class ProblemRecordListTests : TestContext
{
    [Fact]
    public void Known_list_is_named_by_its_status_and_holds_its_items()
    {
        var cut = RenderComponent<ProblemRecordList>(p => p
            .Add(x => x.Status, "known").Add(x => x.StatusLabel, "Problems")
            .AddChildContent("<li class=\"problem-record-list-item\">One record</li>"));
        var list = cut.Find("ul.problem-record-list");
        Assert.Equal("Problems", list.GetAttribute("aria-label"));
        Assert.Equal("known", list.GetAttribute("data-status"));
        Assert.Empty(cut.FindAll(".problem-record-list-status"));
        Assert.Contains("One record", list.TextContent);
    }

    [Theory]
    [InlineData("none-known", "No known problems (none-known)")]
    [InlineData("not-recorded", "No known problems (not-recorded)")]
    [InlineData("unavailable", "No known problems (unavailable)")]
    [InlineData("omitted", "No known problems (omitted)")]
    public void Other_statuses_are_the_lists_one_item(string status, string words)
    {
        var cut = RenderComponent<ProblemRecordList>(p => p.Add(x => x.Status, status).Add(x => x.StatusLabel, words));
        var items = cut.FindAll("li");
        Assert.Single(items);
        Assert.Equal("problem-record-list-status", items[0].ClassName);
        Assert.Equal(words, items[0].TextContent);
    }
}
