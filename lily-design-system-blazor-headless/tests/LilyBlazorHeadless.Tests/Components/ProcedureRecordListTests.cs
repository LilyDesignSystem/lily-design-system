using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class ProcedureRecordListTests : TestContext
{
    [Fact]
    public void Known_list_is_named_by_its_status_and_holds_its_items()
    {
        var cut = RenderComponent<ProcedureRecordList>(p => p
            .Add(x => x.Status, "known").Add(x => x.StatusLabel, "Procedures")
            .AddChildContent("<li class=\"procedure-record-list-item\">One record</li>"));
        var list = cut.Find("ul.procedure-record-list");
        Assert.Equal("Procedures", list.GetAttribute("aria-label"));
        Assert.Equal("known", list.GetAttribute("data-status"));
        Assert.Empty(cut.FindAll(".procedure-record-list-status"));
        Assert.Contains("One record", list.TextContent);
    }

    [Theory]
    [InlineData("none-known", "No known procedures (none-known)")]
    [InlineData("not-recorded", "No known procedures (not-recorded)")]
    [InlineData("unavailable", "No known procedures (unavailable)")]
    [InlineData("omitted", "No known procedures (omitted)")]
    public void Other_statuses_are_the_lists_one_item(string status, string words)
    {
        var cut = RenderComponent<ProcedureRecordList>(p => p.Add(x => x.Status, status).Add(x => x.StatusLabel, words));
        var items = cut.FindAll("li");
        Assert.Single(items);
        Assert.Equal("procedure-record-list-status", items[0].ClassName);
        Assert.Equal(words, items[0].TextContent);
    }
}
