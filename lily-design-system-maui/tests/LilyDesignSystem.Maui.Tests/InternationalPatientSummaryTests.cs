using LilyDesignSystem.Maui.Core;
using Microsoft.Maui.Controls;

namespace LilyDesignSystem.Maui.Tests;

public class InternationalPatientSummaryTests
{
    private static readonly Dictionary<string, string> Required = new()
    {
        ["medications"] = "Medication summary",
        ["allergies"] = "Allergies and intolerances",
        ["problems"] = "Problems",
    };

    private static Label StatusLine(InternationalPatientSummarySection s) => (Label)s.Children[1];

    [Fact]
    public void ASectionHasALevelTwoHeadingAndItsStatusInWords()
    {
        var section = new InternationalPatientSummarySection { Section = "problems", Heading = "Problems", Status = "not-recorded", StatusLabel = "Not recorded" };
        Assert.Equal(SemanticHeadingLevel.Level2, SemanticProperties.GetHeadingLevel((Label)section.Children[0]));
        Assert.True(StatusLine(section).IsVisible);
        Assert.Equal("Not recorded", StatusLine(section).Text);
        section.StatusPlacement = IpsStatusPlacement.List;
        Assert.False(StatusLine(section).IsVisible);
    }

    [Fact]
    public void ASectionNeverSaysNoneKnownAboveAListThatHoldsAnEntry()
    {
        var list = new AllergyRecordList { Status = RecordListStatus.NoneKnown, StatusLabel = "No known allergies", ConflictLabel = "Allergies conflict" };
        var section = new InternationalPatientSummarySection
        {
            Section = "allergies",
            Heading = "Allergies and intolerances",
            Status = "none-known",
            StatusLabel = "No known allergies",
            Body = list,
        };
        Assert.True(StatusLine(section).IsVisible);
        list.Items.Add(new AllergyRecordListItem { Words = new AllergyWords("Penicillin") });
        Assert.False(StatusLine(section).IsVisible);
        Assert.True(list.IsConflict);
    }

    [Fact]
    public void TheSummaryAddsAMissingRequiredSectionInWords_AndListsItInTheContents()
    {
        var summary = new InternationalPatientSummary
        {
            Label = "Patient summary",
            RequiredHeadings = Required,
            OmittedLabel = "Section missing from document",
            ContentsLabel = "Contents",
        };
        summary.Sections.Add(new InternationalPatientSummarySection { Section = "allergies", Heading = "Allergies and intolerances" });
        summary.Sections.Add(new InternationalPatientSummarySection { Section = "medications", Heading = "Medication summary" });
        Assert.Equal(["allergies", "medications", "problems"], summary.Contents.Select(c => c.Key));
        Assert.True(summary.Contents.Single(c => c.Key == "problems").Added);
        var added = ((VerticalStackLayout)summary.Children[3]).Children.OfType<InternationalPatientSummarySection>().Single();
        Assert.Equal("omitted", added.Status);
        Assert.Equal("Section missing from document", StatusLine(added).Text);
        Assert.Equal("Patient summary", SemanticProperties.GetDescription(summary));
    }

    [Fact]
    public void AContentsEntryRaisesItsKey_AndWithoutALabelThereAreNoContents()
    {
        var summary = new InternationalPatientSummary { Label = "Patient summary", RequiredHeadings = Required, OmittedLabel = "Missing", ContentsLabel = "Contents" };
        string? chosen = null;
        summary.SectionSelected += (_, key) => chosen = key;
        var contents = (VerticalStackLayout)summary.Children[1];
        ((IButtonController)contents.Children.OfType<Button>().First()).SendClicked();
        Assert.Equal("medications", chosen);
        summary.ContentsLabel = null;
        Assert.False(contents.IsVisible);
    }

    [Fact]
    public void SummaryAndSectionWarnings()
    {
        Assert.Contains(IpsRules.SummaryWarnings("", "", new Dictionary<string, string>()), w => w.Contains("RequiredHeadings needs allergies"));
        Assert.Contains(IpsRules.SectionWarnings("", "bogus", null, IpsStatusPlacement.Heading, true, null), w => w.Contains("no status bogus"));
    }
}
