using LilyDesignSystem.Maui.Core;
using Microsoft.Maui.Controls;

namespace LilyDesignSystem.Maui;

/// <summary>
/// EarlyWarningScoreView (components/early-warning-score-view): a score the app's validated code computed, its system, band and
/// what to do, as one stop. Lily computes nothing. The band's words are always shown and spoken; <see cref="Band"/> is for
/// styling, and a band without words is a development warning. Style hooks: <c>early-warning-score-view</c>, <c>-system</c>,
/// <c>-score</c>, <c>-band</c>, <c>-escalation</c>.
/// </summary>
public class EarlyWarningScoreView : VerticalStackLayout
{
    /// <summary>The score the app computed. Required.</summary>
    public static readonly BindableProperty ScoreProperty = Create(nameof(Score), string.Empty);

    /// <summary>The scoring system's name ("NEWS2").</summary>
    public static readonly BindableProperty SystemProperty = Create(nameof(System), null);

    /// <summary>The app's band key, for styling; <see cref="BandLabel"/> is required with it.</summary>
    public static readonly BindableProperty BandProperty = Create(nameof(Band), null);

    /// <summary>The band in words ("Medium").</summary>
    public static readonly BindableProperty BandLabelProperty = Create(nameof(BandLabel), null);

    /// <summary>What to do, in the app's words.</summary>
    public static readonly BindableProperty EscalationProperty = Create(nameof(Escalation), null);

    /// <summary>Spoken first, naming the value.</summary>
    public static readonly BindableProperty LabelProperty = Create(nameof(Label), null);

    private readonly Label system = Lily.Hidden(Lily.Text("early-warning-score-view-system"));
    private readonly Label score = Lily.Hidden(Lily.Text("early-warning-score-view-score"));
    private readonly Label band = Lily.Hidden(Lily.Text("early-warning-score-view-band"));
    private readonly Label escalation = Lily.Hidden(Lily.Text("early-warning-score-view-escalation"));

    /// <summary>Creates an empty view; set <see cref="Score"/>.</summary>
    public EarlyWarningScoreView()
    {
        StyleClass = ["early-warning-score-view"];
        Children.Add(Lily.Hidden(new HorizontalStackLayout { Spacing = 8, Children = { system, score, band } }));
        Children.Add(escalation);
        Update();
        Loaded += (_, _) => LilyWarnings.Warn(DecisionSupportRules.ScoreWarnings(Band, BandLabel));
    }

    /// <inheritdoc cref="ScoreProperty"/>
    public string Score { get => (string)GetValue(ScoreProperty); set => SetValue(ScoreProperty, value); }

    /// <inheritdoc cref="SystemProperty"/>
    public string? System { get => (string?)GetValue(SystemProperty); set => SetValue(SystemProperty, value); }

    /// <inheritdoc cref="BandProperty"/>
    public string? Band { get => (string?)GetValue(BandProperty); set => SetValue(BandProperty, value); }

    /// <inheritdoc cref="BandLabelProperty"/>
    public string? BandLabel { get => (string?)GetValue(BandLabelProperty); set => SetValue(BandLabelProperty, value); }

    /// <inheritdoc cref="EscalationProperty"/>
    public string? Escalation { get => (string?)GetValue(EscalationProperty); set => SetValue(EscalationProperty, value); }

    /// <inheritdoc cref="LabelProperty"/>
    public string? Label { get => (string?)GetValue(LabelProperty); set => SetValue(LabelProperty, value); }

    private static BindableProperty Create(string property, string? initial) =>
        BindableProperty.Create(property, typeof(string), typeof(EarlyWarningScoreView), initial, propertyChanged: (b, _, _) => ((EarlyWarningScoreView)b).Update());

    private static void Show(Label label, string? text)
    {
        label.Text = text;
        label.IsVisible = !string.IsNullOrEmpty(text);
    }

    private void Update()
    {
        Show(system, System);
        Show(score, Score);
        Show(band, BandLabel);
        Show(escalation, Escalation);
        Lily.OneStop(this, DecisionSupportRules.ScoreSpoken(Label, System, Score, BandLabel, Escalation));
    }
}
