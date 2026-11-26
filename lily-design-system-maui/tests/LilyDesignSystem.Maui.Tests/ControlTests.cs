using LilyDesignSystem.Maui.Core;
using Microsoft.Maui.Controls;

namespace LilyDesignSystem.Maui.Tests;

// Each control's accessibility contract, read from the properties MAUI hands the platform: SemanticProperties (the spoken
// name and heading level) and AutomationProperties (whether a view is a screen-reader stop). Announcements go to a
// RecordingAnnouncer. Tests that replace LilyAnnouncer.Current run one at a time.
[Collection("announcer")]
public class ControlTests
{
    private static bool InTree(BindableObject view) => AutomationProperties.GetIsInAccessibleTree(view) != false;

    [Fact]
    public void AnAlertIsOneStop_HeadingThenMessage_AndCarriesItsHook()
    {
        var alert = new LilyAlert { Heading = "Saved", Message = "Your changes are saved.", Kind = AlertKind.Success };
        Assert.Equal("Saved\nYour changes are saved.", SemanticProperties.GetDescription(alert));
        Assert.Contains("alert", alert.StyleClass!);
        Assert.All(alert.Children.Cast<BindableObject>(), child => Assert.False(InTree(child)));
    }

    [Fact]
    public void AnAlertAnnouncesOnLoadAndOnChange_ButNotWhenOff()
    {
        var spoken = new RecordingAnnouncer();
        LilyAnnouncer.Current = spoken;
        var alert = new LilyAlert { Message = "Upload failed." };
        Assert.Empty(spoken.Spoken); // not on screen yet
        alert.SimulateLoaded();
        alert.Message = "Upload failed again.";
        Assert.Equal(["Upload failed.", "Upload failed again."], spoken.Spoken);

        var quiet = new LilyAlert { Message = "Draft", Politeness = Politeness.Off };
        quiet.SimulateLoaded();
        Assert.Equal(2, spoken.Spoken.Count);
    }

    [Fact]
    public void AnAlertWithNoHeadingHidesTheHeadingLabel()
    {
        var alert = new LilyAlert { Message = "Hello" };
        Assert.False(((Label)alert.Children[0]).IsVisible);
        Assert.Equal("Hello", SemanticProperties.GetDescription(alert));
    }

    [Fact]
    public void ABadgeSpeaksItsLabelInsteadOfItsText()
    {
        var badge = new LilyBadge { Text = "3", Label = "3 unread messages" };
        Assert.Equal("3 unread messages", SemanticProperties.GetDescription(badge));
        badge.Label = null;
        Assert.Equal("3", SemanticProperties.GetDescription(badge));
        Assert.Contains("badge", badge.StyleClass!);
    }

    [Fact]
    public void ATagFollowsItsTextAndLiveSetting()
    {
        var tag = new Tag { Text = "High", Label = "Priority" };
        Assert.Equal("High\nPriority", SemanticProperties.GetDescription(tag));
        tag.Live = true;
        tag.Text = "Low";
        Assert.Equal("Priority\nLow", SemanticProperties.GetDescription(tag));
    }

    [Fact]
    public void InsetTextIsOneStop()
    {
        var inset = new InsetText { Text = "You can change this later." };
        Assert.Equal("You can change this later.", SemanticProperties.GetDescription(inset));
        Assert.False(InTree(inset.Content!));
    }

    [Fact]
    public void WarningTextSpeaksThePrefixFirst_AndHidesItsIcon()
    {
        var icon = new Label { Text = "!" };
        var warning = new WarningText { Prefix = "Warning", Text = "You can be fined.", Icon = icon };
        Assert.Equal("Warning\nYou can be fined.", SemanticProperties.GetDescription(warning));
        Assert.Same(icon, warning.Children[0]);
        Assert.False(InTree(icon));
        Assert.Contains("warning-text-icon", icon.StyleClass!);
    }

    [Fact]
    public void AnErrorSummaryHasALevelOneTitleAndOneButtonPerProblem()
    {
        var chosen = new List<string>();
        var summary = new ErrorSummary { Title = "There is a problem" };
        summary.Problems.Add(new Problem("Enter your name", () => chosen.Add("name")));
        summary.Problems.Add(new Problem("Enter your date of birth", () => chosen.Add("dob")));
        var title = (Label)summary.Children[0];
        Assert.Equal(SemanticHeadingLevel.Level1, SemanticProperties.GetHeadingLevel(title));
        var buttons = summary.Children.OfType<Button>().ToList();
        Assert.Equal(["Enter your name", "Enter your date of birth"], buttons.Select(b => b.Text));
        ((IButtonController)buttons[1]).SendClicked();
        Assert.Equal(["dob"], chosen);
        summary.Problems.RemoveAt(0);
        Assert.Single(summary.Children.OfType<Button>());
    }

    [Fact]
    public void AFieldNamesItsControl_HidesTheVisibleCopies_AndAnnouncesANewError()
    {
        var spoken = new RecordingAnnouncer();
        LilyAnnouncer.Current = spoken;
        var entry = new Entry();
        var field = new Field { Label = "Email", Description = "We reply here", Required = true, RequiredLabel = "required", Control = entry };
        Assert.Equal("Email\nWe reply here\nrequired", SemanticProperties.GetDescription(entry));
        field.Error = "Enter an email address";
        Assert.Equal("Email\nWe reply here\nrequired\nEnter an email address", SemanticProperties.GetDescription(entry));
        Assert.Empty(spoken.Spoken); // not loaded: nothing is said
        Assert.All(field.Children.Take(3).Cast<BindableObject>(), child => Assert.False(InTree(child)));
    }

    [Fact]
    public void AFieldShowsTheRequiredMarkOnlyWhenRequired()
    {
        var field = new Field { Label = "Name" };
        var row = (HorizontalStackLayout)field.Children[0];
        Assert.False(((Label)row.Children[1]).IsVisible);
        field.Required = true;
        Assert.True(((Label)row.Children[1]).IsVisible);
        Assert.Equal("*", ((Label)row.Children[1]).Text);
    }

    [Fact]
    public void ASummaryListItemIsOneStop_TermThenValue()
    {
        var list = new SummaryList { Label = "Personal details" };
        var item = new SummaryListItem { Term = "Name", Value = "Sam Okoro" };
        list.Children.Add(item);
        Assert.Equal("Personal details", SemanticProperties.GetDescription(list));
        Assert.Equal("Name\nSam Okoro", SemanticProperties.GetDescription(item));
    }

    [Fact]
    public void ACardHeadingIsAHeading_AndTheLabelNamesTheGroup()
    {
        var body = new Label { Text = "Body" };
        var card = new LilyCard { Heading = "Appointments", Label = "Next appointment", Body = body };
        var heading = (Label)card.Children[0];
        Assert.Equal(SemanticHeadingLevel.Level2, SemanticProperties.GetHeadingLevel(heading));
        card.HeadingLevel = SemanticHeadingLevel.Level3;
        Assert.Equal(SemanticHeadingLevel.Level3, SemanticProperties.GetHeadingLevel(heading));
        Assert.Equal("Next appointment", SemanticProperties.GetDescription(card));
        Assert.Same(body, card.Children[1]);
    }
}

[CollectionDefinition("announcer", DisableParallelization = true)]
public class AnnouncerCollection;
