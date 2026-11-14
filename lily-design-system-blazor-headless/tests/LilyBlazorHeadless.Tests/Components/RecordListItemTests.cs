using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class RecordListItemTests : TestContext
{
    [Fact]
    public void Renders_an_li_with_each_part_and_each_status_as_text_and_data()
    {
        var cut = RenderComponent<RecordListItem>(p => p.Add(x => x.Status, "final").Add(x => x.StatusLabel, "Final").Add(x => x.Updated, "2026-11-03").Add(x => x.UpdatedLabel, "Updated 3 Nov 2026").AddChildContent("<span class=\"content\">Blood pressure 128/82 mmHg</span>"));
        var root = cut.Find("li.record-list-item");
        Assert.Equal("final", root.GetAttribute("data-status"));
        Assert.Equal("Final", cut.Find(".record-list-item-status").TextContent);
        Assert.Equal("2026-11-03", cut.Find("time.record-list-item-updated").GetAttribute("datetime"));
    }

    [Fact]
    public void Renders_only_the_parts_given()
    {
        var cut = RenderComponent<RecordListItem>(p => { });
        Assert.Empty(cut.FindAll(".record-list-item-status"));
        Assert.Empty(cut.FindAll(".record-list-item-updated"));
        Assert.Null(cut.Find("li").GetAttribute("data-status"));
    }
}
