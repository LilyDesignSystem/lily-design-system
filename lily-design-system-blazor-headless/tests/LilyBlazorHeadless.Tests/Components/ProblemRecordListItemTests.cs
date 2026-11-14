using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class ProblemRecordListItemTests : TestContext
{
    [Fact]
    public void Renders_an_li_with_each_part_and_each_status_as_text_and_data()
    {
        var cut = RenderComponent<ProblemRecordListItem>(p => p.Add(x => x.Condition, "Type 2 diabetes").Add(x => x.ClinicalStatus, "active").Add(x => x.ClinicalStatusLabel, "Active").Add(x => x.VerificationStatus, "confirmed").Add(x => x.VerificationStatusLabel, "Confirmed").Add(x => x.SeverityLabel, "Moderate").Add(x => x.Onset, "2019-06-01").Add(x => x.OnsetLabel, "Since June 2019").Add(x => x.Abatement, "2024-01-15").Add(x => x.AbatementLabel, "Resolved 15 Jan 2024"));
        var root = cut.Find("li.problem-record-list-item");
        Assert.Equal("active", root.GetAttribute("data-clinical-status"));
        Assert.Equal("confirmed", root.GetAttribute("data-verification-status"));
        Assert.Equal("Type 2 diabetes", cut.Find(".problem-record-list-item-condition").TextContent);
        Assert.Equal("Active", cut.Find(".problem-record-list-item-clinical-status").TextContent);
        Assert.Equal("Confirmed", cut.Find(".problem-record-list-item-verification-status").TextContent);
        Assert.Equal("Moderate", cut.Find(".problem-record-list-item-severity").TextContent);
        Assert.Equal("2019-06-01", cut.Find("time.problem-record-list-item-onset").GetAttribute("datetime"));
        Assert.Equal("2024-01-15", cut.Find("time.problem-record-list-item-abatement").GetAttribute("datetime"));
    }

    [Fact]
    public void Renders_only_the_parts_given()
    {
        var cut = RenderComponent<ProblemRecordListItem>(p => p.Add(x => x.Condition, "Type 2 diabetes"));
        Assert.Empty(cut.FindAll(".problem-record-list-item-clinical-status"));
        Assert.Empty(cut.FindAll(".problem-record-list-item-verification-status"));
        Assert.Empty(cut.FindAll(".problem-record-list-item-severity"));
        Assert.Empty(cut.FindAll(".problem-record-list-item-onset"));
        Assert.Empty(cut.FindAll(".problem-record-list-item-abatement"));
        Assert.Null(cut.Find("li").GetAttribute("data-clinical-status"));
        Assert.Null(cut.Find("li").GetAttribute("data-verification-status"));
    }
}
