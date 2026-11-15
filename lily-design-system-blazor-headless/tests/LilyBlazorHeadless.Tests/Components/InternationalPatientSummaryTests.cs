using Bunit;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class InternationalPatientSummaryTests : TestContext
{
    private static readonly Dictionary<string, string> Headings = new()
    {
        ["medications"] = "Medication summary",
        ["allergies"] = "Allergies and intolerances",
        ["problems"] = "Problem list",
    };

    private IRenderedComponent<InternationalPatientSummary> Render(IReadOnlyList<IpsSectionEntry> sections, string? contents = null) =>
        RenderComponent<InternationalPatientSummary>(p => p
            .Add(x => x.Label, "Patient summary")
            .Add(x => x.Sections, sections)
            .Add(x => x.RequiredHeadings, Headings)
            .Add(x => x.OmittedLabel, "Section missing from document")
            .Add(x => x.ContentsLabel, contents)
            .Add(x => x.Banner, "<p>Banner</p>")
            .Add(x => x.Details, "<p>Details</p>")
            .AddChildContent("<section class=\"given\">Entries</section>"));

    [Fact]
    public void Is_an_article_named_by_its_label_with_banner_first_and_details_last()
    {
        var cut = Render([new("medications", "Medication summary"), new("allergies", "Allergies"), new("problems", "Problem list")]);
        var article = cut.Find("article.international-patient-summary");
        Assert.Equal("Patient summary", article.GetAttribute("aria-label"));
        var parts = article.Children.Select(c => c.GetAttribute("class")).ToList();
        Assert.Equal("international-patient-summary-banner", parts.First());
        Assert.Equal("international-patient-summary-details", parts.Last());
        Assert.NotNull(cut.Find(".international-patient-summary-sections .given"));
        Assert.Empty(cut.FindAll("section[data-status=omitted]"));
    }

    [Fact]
    public void Adds_each_missing_required_section_in_words_after_the_given_ones()
    {
        var cut = Render([new("problems", "Problem list", "none-known")]);
        var added = cut.FindAll("section[data-status=omitted]");
        Assert.Equal(new[] { "medications", "allergies" }, added.Select(s => s.GetAttribute("data-section")));
        Assert.All(added, s =>
        {
            Assert.Equal("true", s.GetAttribute("data-required"));
            Assert.Contains("Section missing from document", s.TextContent);
        });
        Assert.Equal("48765-2", added[1].GetAttribute("data-code"));
    }

    [Fact]
    public void Contents_follow_the_list_then_the_missing_required_sections_and_only_with_a_label()
    {
        Assert.Empty(Render([]).FindAll("nav"));
        var cut = Render([new("allergies", "Allergies and intolerances"), new("results", "Results", "not-recorded")], "Contents");
        var nav = cut.Find("nav.international-patient-summary-contents");
        Assert.Equal("Contents", nav.GetAttribute("aria-label"));
        var links = nav.QuerySelectorAll("a").ToList();
        Assert.Equal(new[] { "Allergies and intolerances", "Results", "Medication summary", "Problem list" }, links.Select(a => a.TextContent));
        Assert.Equal("#international-patient-summary-results", links[1].GetAttribute("href"));
        Assert.Equal("omitted", links[2].ParentElement!.GetAttribute("data-status"));
    }

    [Fact]
    public void Registry_has_sixteen_sections_three_required()
    {
        Assert.Equal(16, IpsSections.All.Count);
        Assert.Equal(new[] { "medications", "allergies", "problems" }, IpsSections.Required);
        Assert.Equal("104605-1", IpsSections.Code("alerts"));
        Assert.Null(IpsSections.Code("not-a-section"));
    }
}
