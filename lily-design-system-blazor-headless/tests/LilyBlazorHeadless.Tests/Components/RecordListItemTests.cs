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

    [Fact]
    public void Withheld_shows_only_the_words_and_in_error_strikes_the_content_through()
    {
        var withheld = RenderComponent<RecordListItem>(p => p
            .Add(x => x.EntryState, "withheld")
            .Add(x => x.EntryStateLabel, "Restricted")
            .AddChildContent("Blood pressure"));
        var li = withheld.Find("li.record-list-item");
        Assert.Equal("withheld", li.GetAttribute("data-entry-state"));
        Assert.DoesNotContain("Blood pressure", li.TextContent);
        Assert.Equal("Restricted", withheld.Find(".record-list-item-entry-state").TextContent);
        var inError = RenderComponent<RecordListItem>(p => p
            .Add(x => x.EntryState, "entered-in-error")
            .Add(x => x.EntryStateLabel, "Entered in error")
            .AddChildContent("Blood pressure"));
        Assert.Equal("Blood pressure", inError.Find("del.record-list-item-entry").TextContent);
        Assert.Equal("Entered in error", inError.Find(".record-list-item-entry-state").TextContent);
    }
}
