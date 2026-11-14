using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class ProcedureRecordListItemTests : TestContext
{
    [Fact]
    public void Renders_an_li_with_each_part_and_each_status_as_text_and_data()
    {
        var cut = RenderComponent<ProcedureRecordListItem>(p => p.Add(x => x.Procedure, "Appendectomy").Add(x => x.Status, "completed").Add(x => x.StatusLabel, "Completed").Add(x => x.Performed, "2018-04-22").Add(x => x.PerformedLabel, "22 Apr 2018"));
        var root = cut.Find("li.procedure-record-list-item");
        Assert.Equal("completed", root.GetAttribute("data-status"));
        Assert.Equal("Appendectomy", cut.Find(".procedure-record-list-item-procedure").TextContent);
        Assert.Equal("Completed", cut.Find(".procedure-record-list-item-status").TextContent);
        Assert.Equal("2018-04-22", cut.Find("time.procedure-record-list-item-performed").GetAttribute("datetime"));
    }

    [Fact]
    public void Renders_only_the_parts_given()
    {
        var cut = RenderComponent<ProcedureRecordListItem>(p => p.Add(x => x.Procedure, "Appendectomy"));
        Assert.Empty(cut.FindAll(".procedure-record-list-item-status"));
        Assert.Empty(cut.FindAll(".procedure-record-list-item-performed"));
        Assert.Null(cut.Find("li").GetAttribute("data-status"));
    }
}
