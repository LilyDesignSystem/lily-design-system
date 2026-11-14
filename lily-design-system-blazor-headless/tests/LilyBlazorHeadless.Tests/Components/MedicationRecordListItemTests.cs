using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class MedicationRecordListItemTests : TestContext
{
    [Fact]
    public void Renders_an_li_with_each_part_and_each_status_as_text_and_data()
    {
        var cut = RenderComponent<MedicationRecordListItem>(p => p.Add(x => x.Status, "active").Add(x => x.StatusLabel, "Active").Add(x => x.Effective, "2025-03-03").Add(x => x.EffectiveLabel, "Since 3 Mar 2025").AddChildContent("<span class=\"content\">ramipril 5 mg capsule, oral, once a day</span>"));
        var root = cut.Find("li.medication-record-list-item");
        Assert.Equal("active", root.GetAttribute("data-status"));
        Assert.Equal("Active", cut.Find(".medication-record-list-item-status").TextContent);
        Assert.Equal("2025-03-03", cut.Find("time.medication-record-list-item-effective").GetAttribute("datetime"));
    }

    [Fact]
    public void Renders_only_the_parts_given()
    {
        var cut = RenderComponent<MedicationRecordListItem>(p => { });
        Assert.Empty(cut.FindAll(".medication-record-list-item-status"));
        Assert.Empty(cut.FindAll(".medication-record-list-item-effective"));
        Assert.Null(cut.Find("li").GetAttribute("data-status"));
    }
}
