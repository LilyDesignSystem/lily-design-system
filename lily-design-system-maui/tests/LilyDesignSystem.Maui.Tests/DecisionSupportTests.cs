using LilyDesignSystem.Maui.Core;
using Microsoft.Maui.Controls;

namespace LilyDesignSystem.Maui.Tests;

public class DecisionSupportTests
{
    private static IEnumerable<View> All(Layout layout) =>
        layout.Children.OfType<View>().SelectMany(v => v is Layout l ? new[] { v }.Concat(All(l)) : [v]);

    private static T Part<T>(Layout layout, string styleClass)
        where T : View => All(layout).OfType<T>().Single(v => v.StyleClass?.Contains(styleClass) == true);

    [Fact]
    public void AScoreIsOneStop_AndABandWithoutWordsWarns()
    {
        var view = new EarlyWarningScoreView { Label = "Early warning score", System = "NEWS2", Score = "5", Band = "medium", BandLabel = "Medium", Escalation = "Call the nurse in charge" };
        Assert.Equal("Early warning score\nNEWS2\n5\nMedium\nCall the nurse in charge", SemanticProperties.GetDescription(view));
        Assert.Empty(DecisionSupportRules.ScoreWarnings(view.Band, view.BandLabel));
        Assert.Single(DecisionSupportRules.ScoreWarnings("high", null));
    }

    private static DecisionSupportCard Card() => new()
    {
        Summary = "Penicillin allergy recorded",
        Indicator = DecisionSupportIndicator.Critical,
        IndicatorLabel = "Critical",
        SourceLabel = "Allergy checker",
        CardId = "card-1",
        Suggestions = [new DecisionSupportSuggestion("swap", "Prescribe an alternative")],
        DismissLabel = "Dismiss",
        OverrideReasons = [new DecisionSupportOverrideReason("aware", "Patient aware"), new DecisionSupportOverrideReason("na", "Not applicable")],
        OverrideReasonLabel = "Reason for dismissing",
        OverrideReasonError = "Choose a reason",
    };

    [Fact]
    public void TheCardIsNamedBySummary_UrgencyIsWords_SummaryIsAHeading()
    {
        var card = Card();
        Assert.Equal("Penicillin allergy recorded", SemanticProperties.GetDescription(card));
        Assert.Equal("Critical", ((Label)card.Children[0]).Text);
        Assert.Equal(SemanticHeadingLevel.Level2, SemanticProperties.GetHeadingLevel((Label)card.Children[1]));
        Assert.Empty(card.Warnings);
    }

    [Fact]
    public void ASuggestionRaisesItsId()
    {
        var card = Card();
        string? chosen = null;
        card.SuggestionSelected += (_, id) => chosen = id;
        ((IButtonController)Part<Button>(card, "decision-support-card-suggestion")).SendClicked();
        Assert.Equal("swap", chosen);
    }

    [Fact]
    public void DismissingWithoutAReasonIsRefusedAndShowsTheError_ThenSucceedsWithOne()
    {
        var card = Card();
        string? dismissedWith = "unset";
        card.Dismissed += (_, reason) => dismissedWith = reason;
        Assert.False(card.Dismiss().Dismissed);
        Assert.Equal("unset", dismissedWith);
        Assert.True(Part<Label>(card, "decision-support-card-reason-error").IsVisible);
        card.Choose("aware");
        Assert.False(Part<Label>(card, "decision-support-card-reason-error").IsVisible);
        Assert.Equal(new DismissOutcome(true, "aware"), card.Dismiss());
        Assert.Equal("aware", dismissedWith);
    }

    [Fact]
    public void ANewCardClearsTheChosenReason()
    {
        var card = Card();
        card.Choose("aware");
        card.CardId = "card-2";
        Assert.Null(card.ChosenReason);
        card.Choose("na");
        card.OverrideReasons = [new DecisionSupportOverrideReason("aware", "Patient aware")];
        Assert.Null(card.ChosenReason); // a reason the card no longer offers is not kept
    }

    [Fact]
    public void WithoutReasonsADismissalGoesAhead_AndWithoutWordsThereIsNoButton()
    {
        Assert.Equal(new DismissOutcome(true, null), DecisionSupportRules.Dismiss([], null));
        var card = Card();
        card.DismissLabel = null;
        Assert.Empty(All(card).OfType<Button>().Where(b => b.StyleClass!.Contains("decision-support-card-dismiss")));
        Assert.Contains(DecisionSupportRules.Warnings(new string('x', 141), "", "", true, null), w => w.Contains("140"));
    }
}
