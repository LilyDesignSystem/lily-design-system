using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class AllergyRecordListItemTests : TestContext
{
    [Fact]
    public void Renders_an_li_with_each_part_and_each_status_as_text_and_data()
    {
        var cut = RenderComponent<AllergyRecordListItem>(p => p.Add(x => x.Substance, "Penicillin").Add(x => x.Reaction, "Anaphylaxis").Add(x => x.Severity, "severe").Add(x => x.SeverityLabel, "Severe").Add(x => x.Criticality, "high").Add(x => x.CriticalityLabel, "High risk").Add(x => x.ClinicalStatus, "active").Add(x => x.ClinicalStatusLabel, "Active").Add(x => x.VerificationStatus, "confirmed").Add(x => x.VerificationStatusLabel, "Confirmed").Add(x => x.TypeLabel, "Allergy").Add(x => x.CategoryLabel, "Medication").Add(x => x.Updated, "2026-11-03").Add(x => x.UpdatedLabel, "Updated 3 Nov 2026"));
        var root = cut.Find("li.allergy-record-list-item");
        Assert.Equal("severe", root.GetAttribute("data-severity"));
        Assert.Equal("high", root.GetAttribute("data-criticality"));
        Assert.Equal("active", root.GetAttribute("data-clinical-status"));
        Assert.Equal("confirmed", root.GetAttribute("data-verification-status"));
        Assert.Equal("Penicillin", cut.Find(".allergy-record-list-item-substance").TextContent);
        Assert.Equal("Anaphylaxis", cut.Find(".allergy-record-list-item-reaction").TextContent);
        Assert.Equal("Severe", cut.Find(".allergy-record-list-item-severity").TextContent);
        Assert.Equal("High risk", cut.Find(".allergy-record-list-item-criticality").TextContent);
        Assert.Equal("Active", cut.Find(".allergy-record-list-item-clinical-status").TextContent);
        Assert.Equal("Confirmed", cut.Find(".allergy-record-list-item-verification-status").TextContent);
        Assert.Equal("Allergy", cut.Find(".allergy-record-list-item-type").TextContent);
        Assert.Equal("Medication", cut.Find(".allergy-record-list-item-category").TextContent);
        Assert.Equal("2026-11-03", cut.Find("time.allergy-record-list-item-updated").GetAttribute("datetime"));
    }

    [Fact]
    public void Renders_only_the_parts_given()
    {
        var cut = RenderComponent<AllergyRecordListItem>(p => p.Add(x => x.Substance, "Penicillin"));
        Assert.Empty(cut.FindAll(".allergy-record-list-item-reaction"));
        Assert.Empty(cut.FindAll(".allergy-record-list-item-severity"));
        Assert.Empty(cut.FindAll(".allergy-record-list-item-criticality"));
        Assert.Empty(cut.FindAll(".allergy-record-list-item-clinical-status"));
        Assert.Empty(cut.FindAll(".allergy-record-list-item-verification-status"));
        Assert.Empty(cut.FindAll(".allergy-record-list-item-type"));
        Assert.Empty(cut.FindAll(".allergy-record-list-item-category"));
        Assert.Empty(cut.FindAll(".allergy-record-list-item-updated"));
        Assert.Null(cut.Find("li").GetAttribute("data-severity"));
        Assert.Null(cut.Find("li").GetAttribute("data-criticality"));
        Assert.Null(cut.Find("li").GetAttribute("data-clinical-status"));
        Assert.Null(cut.Find("li").GetAttribute("data-verification-status"));
    }
}
