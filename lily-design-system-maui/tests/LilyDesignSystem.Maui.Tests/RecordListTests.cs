using LilyDesignSystem.Maui.Core;
using Microsoft.Maui.Controls;

namespace LilyDesignSystem.Maui.Tests;

// HC-C17 and the record-list contract: a list is never blank, never says none are known beside an entry, and withheld or
// erroneous records are marked, never removed.
public class RecordListTests
{
    private static string? Spoken(BindableObject view) => SemanticProperties.GetDescription(view);

    private static Label Status(RecordList list) => (Label)list.Children[1];

    private static AllergyRecordListItem Allergy(string substance, string? verification = null) => new()
    {
        Words = new AllergyWords(substance, Reaction: "Hives", VerificationStatus: verification is null ? null : "Refuted"),
        Codes = verification is null ? null : new AllergyCodes(VerificationStatus: verification),
    };

    [Fact]
    public void AnEmptyListShowsItsStatusWordsAsItsItemAndName()
    {
        var list = new AllergyRecordList { Status = RecordListStatus.NoneKnown, StatusLabel = "No known allergies" };
        Assert.Equal("No known allergies", Status(list).Text);
        Assert.True(Status(list).IsVisible);
        Assert.Equal("No known allergies", Spoken(list));
        Assert.Contains("allergy-record-list", list.StyleClass!);
    }

    [Fact]
    public void AKnownListShowsNoStatusItem_AndIsNamedByItsLabel()
    {
        var list = new AllergyRecordList { Status = RecordListStatus.Known, StatusLabel = "Known allergies", Label = "Allergies" };
        list.Items.Add(Allergy("Penicillin"));
        Assert.False(Status(list).IsVisible);
        Assert.Equal("Allergies", Spoken(list));
    }

    [Fact]
    public void NoneKnownBesideAnEntryShowsTheAppsConflictWords_NeverNoneKnown()
    {
        var list = new AllergyRecordList
        {
            Status = RecordListStatus.NoneKnown,
            StatusLabel = "No known allergies",
            ConflictLabel = "Allergies conflict: check the record",
        };
        list.Items.Add(Allergy("Penicillin"));
        Assert.True(list.IsConflict);
        Assert.Equal("Allergies conflict: check the record", Status(list).Text);
        Assert.Equal("Allergies conflict: check the record", Spoken(list));
        Assert.True(((Layout)list.Children[2]).IsVisible); // the entry stays
        Assert.Empty(list.Warnings);
    }

    [Fact]
    public void WithoutConflictWordsTheStatusWordsGo_AndItWarns()
    {
        var list = new AllergyRecordList { Status = RecordListStatus.NoneKnown, StatusLabel = "No known allergies" };
        list.Items.Add(Allergy("Penicillin"));
        Assert.False(Status(list).IsVisible);
        Assert.Null(Spoken(list));
        Assert.Contains(list.Warnings, w => w.Contains("ConflictLabel"));
    }

    [Fact]
    public void ARefutedEntryDoesNotContradictNoneKnown_AndRefutingLaterResolvesIt()
    {
        var list = new AllergyRecordList
        {
            Status = RecordListStatus.NoneKnown,
            StatusLabel = "No known allergies",
            ConflictLabel = "Conflict",
        };
        var item = Allergy("Penicillin");
        list.Items.Add(item);
        Assert.True(list.IsConflict);
        item.Codes = new AllergyCodes(VerificationStatus: "refuted");
        Assert.False(list.IsConflict);
        Assert.Equal("No known allergies", Status(list).Text);
        list.Items.Add(Allergy("Latex", "entered-in-error"));
        Assert.False(list.IsConflict);
    }

    [Fact]
    public void AnUnavailableListHidesItsEntries_AndAViewThatIsNotAnItemDoesNotCount()
    {
        var list = new RecordList { Status = RecordListStatus.Unavailable, StatusLabel = "Problems could not be loaded" };
        list.Items.Add(new Label { Text = "A note" });
        Assert.False(list.HasEntries);
        Assert.False(((Layout)list.Children[2]).IsVisible);
        Assert.Equal("Problems could not be loaded", Status(list).Text);
    }

    [Fact]
    public void AnAllergyItemIsOneStop_WhoseRecordFirst()
    {
        var item = new AllergyRecordListItem { Words = new AllergyWords("Peanut", Subject: "Mother", Reaction: "Anaphylaxis", Severity: "Severe") };
        var record = (Layout)item.Children[0];
        Assert.Equal("Mother\nPeanut\nAnaphylaxis\nSevere", Spoken(record));
    }

    [Fact]
    public void ACodeWithoutWordsIsAWarning()
    {
        var warnings = RecordRules.AllergyWarnings(new AllergyCodes(Severity: "severe"), new AllergyWords("Peanut"));
        Assert.Single(warnings);
    }

    [Fact]
    public void AWithheldRecordShowsOnlyItsWords_AndAnErroneousOneIsStruckThrough()
    {
        var body = new Label { Text = "Asthma" };
        var item = new RecordListItem { Content = body, EntryState = RecordEntryState.Withheld, EntryStateLabel = "Withheld" };
        Assert.False(((ContentView)item.Children[2]).IsVisible);
        Assert.Equal("Withheld", ((Label)item.Children[1]).Text);
        item.EntryState = RecordEntryState.EnteredInError;
        item.EntryStateLabel = "Entered in error";
        Assert.True(((ContentView)item.Children[2]).IsVisible);
        Assert.Equal(TextDecorations.Strikethrough, body.TextDecorations);
        Assert.False(item.Counts);
    }

    [Fact]
    public void ItemWarningsNameAStatusOrStateWithoutWords()
    {
        Assert.Equal(2, RecordRules.ItemWarnings("active", null, RecordEntryState.Withheld, null).Count);
        Assert.Empty(RecordRules.ItemWarnings("active", "Active", null, null));
    }
}
