using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class InternationalPatientSummarySectionTests : TestContext
{
    [Fact]
    public void Is_a_section_named_by_its_heading_with_key_code_status_and_required_flag()
    {
        var cut = RenderComponent<InternationalPatientSummarySection>(p => p
            .Add(x => x.Section, "allergies").Add(x => x.Heading, "Allergies and intolerances")
            .AddChildContent("<p>Peanut</p>"));
        var section = cut.Find("section.international-patient-summary-section");
        var heading = cut.Find("h2");
        Assert.Equal(heading.Id, section.GetAttribute("aria-labelledby"));
        Assert.Equal("international-patient-summary-allergies", section.Id);
        Assert.Equal("48765-2", section.GetAttribute("data-code"));
        Assert.Equal("known", section.GetAttribute("data-status"));
        Assert.Equal("true", section.GetAttribute("data-required"));
        Assert.Contains("Peanut", section.TextContent);
        Assert.Empty(cut.FindAll(".international-patient-summary-section-status"));
    }

    [Theory]
    [InlineData("none-known")]
    [InlineData("not-recorded")]
    [InlineData("unavailable")]
    [InlineData("omitted")]
    public void Shows_the_status_words_for_a_status_that_is_not_known(string status)
    {
        var cut = RenderComponent<InternationalPatientSummarySection>(p => p
            .Add(x => x.Section, "problems").Add(x => x.Heading, "Problem list")
            .Add(x => x.Status, status).Add(x => x.StatusLabel, "In words"));
        Assert.Equal("In words", cut.Find(".international-patient-summary-section-status").TextContent);
    }

    [Fact]
    public void Optional_section_is_not_required_and_uses_the_heading_level_asked_for()
    {
        var cut = RenderComponent<InternationalPatientSummarySection>(p => p
            .Add(x => x.Section, "results").Add(x => x.Heading, "Results").Add(x => x.HeadingLevel, 3));
        Assert.False(cut.Find("section").HasAttribute("data-required"));
        Assert.Equal("Results", cut.Find("h3").TextContent);
    }

    [Fact]
    public void Narrative_sits_in_a_details_open_when_asked()
    {
        var cut = RenderComponent<InternationalPatientSummarySection>(p => p
            .Add(x => x.Section, "patient-story").Add(x => x.Heading, "Patient story")
            .Add(x => x.Narrative, "<p>Lives alone.</p>")
            .Add(x => x.NarrativeLabel, "Narrative from the document").Add(x => x.NarrativeOpen, true));
        var details = cut.Find("details.international-patient-summary-section-narrative");
        Assert.True(details.HasAttribute("open"));
        Assert.Equal("Narrative from the document", details.QuerySelector("summary")!.TextContent);
        Assert.Contains("Lives alone.", details.TextContent);
    }

    private IRenderedComponent<InternationalPatientSummarySection> Unavailable(string? placement)
        => RenderComponent<InternationalPatientSummarySection>(p =>
        {
            p.Add(x => x.Section, "problems").Add(x => x.Heading, "Problem list")
                .Add(x => x.Status, "unavailable").Add(x => x.StatusLabel, "In words")
                .AddChildContent("<ul class=\"record-list\"><li class=\"record-list-status\">In words</li></ul>");
            if (placement is not null) p.Add(x => x.StatusPlacement, placement);
        });

    [Fact]
    public void StatusPlacement_list_leaves_the_words_to_the_record_list_so_they_appear_once()
    {
        var section = Unavailable("list").Find("section.international-patient-summary-section");
        Assert.Equal(1, section.TextContent.Split("In words").Length - 1);
        Assert.Empty(section.QuerySelectorAll(".international-patient-summary-section-status"));
        Assert.Equal("unavailable", section.GetAttribute("data-status"));
    }

    [Fact]
    public void StatusPlacement_heading_the_default_still_prints_the_status_line()
    {
        foreach (var placement in new string?[] { null, "heading" })
            Assert.Equal("In words", Unavailable(placement).Find(".international-patient-summary-section-status").TextContent);
    }

    [Theory]
    [InlineData("allergies", null, "required")]
    [InlineData("immunizations", null, "recommended")]
    [InlineData("pregnancy", null, "optional")]
    [InlineData("allergies", "recommended", "recommended")]
    [InlineData("made-up", null, null)]
    public void DataLevel_is_the_sections_level_in_the_IPS_and_Level_overrides_it(string key, string? level, string? expected)
    {
        var section = RenderComponent<InternationalPatientSummarySection>(p =>
        {
            p.Add(x => x.Section, key).Add(x => x.Heading, "Heading");
            if (level is not null) p.Add(x => x.Level, level);
        }).Find("section.international-patient-summary-section");
        Assert.Equal(expected, section.GetAttribute("data-level"));
    }

    [Fact]
    public void Meta_and_Warning_render_nothing_when_omitted()
    {
        var section = RenderComponent<InternationalPatientSummarySection>(p =>
            p.Add(x => x.Section, "allergies").Add(x => x.Heading, "Allergies")).Find("section");
        Assert.Empty(section.QuerySelectorAll(".international-patient-summary-section-meta"));
        Assert.Empty(section.QuerySelectorAll(".international-patient-summary-section-warning"));
    }

    [Fact]
    public void Meta_then_Warning_sit_after_the_heading_and_status_and_before_the_entries()
    {
        var section = RenderComponent<InternationalPatientSummarySection>(p =>
            p.Add(x => x.Section, "allergies").Add(x => x.Heading, "Allergies")
                .Add(x => x.Status, "unavailable").Add(x => x.StatusLabel, "In words")
                .Add(x => x.Warning, "<span>Entries not found</span>")
                .Add(x => x.Meta, "<span>Required</span>")
                .AddChildContent("<ul class=\"entries\"></ul>")).Find("section");
        var order = section.Children.Select(c => c.ClassName!.Split(' ')[0]).ToArray();
        Assert.Equal(new[]
        {
            "international-patient-summary-section-heading",
            "international-patient-summary-section-status",
            "international-patient-summary-section-meta",
            "international-patient-summary-section-warning",
            "entries",
        }, order);
        Assert.Equal("Required", section.QuerySelector(".international-patient-summary-section-meta")!.TextContent);
    }
}
