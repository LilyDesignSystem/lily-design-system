using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class ImmunizationRecordListItemTests : TestContext
{
    [Fact]
    public void Renders_an_li_with_each_part_and_each_status_as_text_and_data()
    {
        var cut = RenderComponent<ImmunizationRecordListItem>(p => p.Add(x => x.Vaccine, "MMR vaccine").Add(x => x.Occurrence, "2025-09-12").Add(x => x.OccurrenceLabel, "12 Sep 2025").Add(x => x.DoseNumberLabel, "Dose 2 of 2").Add(x => x.Status, "completed").Add(x => x.StatusLabel, "Given").Add(x => x.LotNumber, "AB1234"));
        var root = cut.Find("li.immunization-record-list-item");
        Assert.Equal("completed", root.GetAttribute("data-status"));
        Assert.Equal("MMR vaccine", cut.Find(".immunization-record-list-item-vaccine").TextContent);
        Assert.Equal("2025-09-12", cut.Find("time.immunization-record-list-item-occurrence").GetAttribute("datetime"));
        Assert.Equal("Dose 2 of 2", cut.Find(".immunization-record-list-item-dose-number").TextContent);
        Assert.Equal("Given", cut.Find(".immunization-record-list-item-status").TextContent);
        Assert.Equal("AB1234", cut.Find(".immunization-record-list-item-lot-number").TextContent);
    }

    [Fact]
    public void Renders_only_the_parts_given()
    {
        var cut = RenderComponent<ImmunizationRecordListItem>(p => p.Add(x => x.Vaccine, "MMR vaccine"));
        Assert.Empty(cut.FindAll(".immunization-record-list-item-occurrence"));
        Assert.Empty(cut.FindAll(".immunization-record-list-item-dose-number"));
        Assert.Empty(cut.FindAll(".immunization-record-list-item-status"));
        Assert.Empty(cut.FindAll(".immunization-record-list-item-lot-number"));
        Assert.Null(cut.Find("li").GetAttribute("data-status"));
    }
}
