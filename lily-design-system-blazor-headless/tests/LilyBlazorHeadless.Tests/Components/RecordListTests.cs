using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class RecordListTests : TestContext
{
    [Fact]
    public void Known_list_is_named_by_its_status_and_holds_its_items()
    {
        var cut = RenderComponent<RecordList>(p => p
            .Add(x => x.Status, "known").Add(x => x.StatusLabel, "Vital signs")
            .AddChildContent("<li class=\"record-list-item\">One record</li>"));
        var list = cut.Find("ul.record-list");
        Assert.Equal("Vital signs", list.GetAttribute("aria-label"));
        Assert.Equal("known", list.GetAttribute("data-status"));
        Assert.Empty(cut.FindAll(".record-list-status"));
        Assert.Contains("One record", list.TextContent);
    }

    [Theory]
    [InlineData("none-known", "No vital signs recorded (none-known)")]
    [InlineData("not-recorded", "No vital signs recorded (not-recorded)")]
    [InlineData("unavailable", "No vital signs recorded (unavailable)")]
    [InlineData("omitted", "No vital signs recorded (omitted)")]
    public void Other_statuses_are_the_lists_one_item(string status, string words)
    {
        var cut = RenderComponent<RecordList>(p => p.Add(x => x.Status, status).Add(x => x.StatusLabel, words));
        var items = cut.FindAll("li");
        Assert.Single(items);
        Assert.Equal("record-list-status", items[0].ClassName);
        Assert.Equal(words, items[0].TextContent);
    }

    [Fact]
    public void Not_applicable_is_its_own_status_shown_in_words()
    {
        var cut = RenderComponent<RecordList>(p => p.Add(x => x.Status, "not-applicable").Add(x => x.StatusLabel, "Pregnancy: not applicable"));
        Assert.Equal("not-applicable", cut.Find("ul.record-list").GetAttribute("data-status"));
        Assert.Equal("Pregnancy: not applicable", cut.Find(".record-list-status").TextContent);
    }

    [Fact]
    public void CoverageLabel_says_what_the_list_is_a_view_of_as_its_first_item()
    {
        var cut = RenderComponent<RecordList>(p => p.Add(x => x.Status, "known").Add(x => x.StatusLabel, "Vital signs").Add(x => x.CoverageLabel, "Last 12 months, newest first. The GP record did not answer."));
        var first = cut.Find(".record-list").FirstElementChild!;
        Assert.Equal("LI", first.TagName);
        Assert.Equal("record-list-coverage", first.ClassName);
        Assert.Equal("Last 12 months, newest first. The GP record did not answer.", first.TextContent);
    }
}
