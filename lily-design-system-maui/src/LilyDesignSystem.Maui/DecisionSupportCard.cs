using LilyDesignSystem.Maui.Core;
using Microsoft.Maui.Controls;

namespace LilyDesignSystem.Maui;

/// <summary>
/// DecisionSupportCard (components/decision-support-card): a CDS Hooks card. Named by its summary (a level-2 heading), its
/// urgency always in words, its source, the app's detail, suggestions as native buttons, links (raised as
/// <see cref="LinkSelected"/>; the app opens them, with <c>Launcher</c> or its own navigation), and a dismiss button that asks
/// for a reason when reasons are offered (native radio buttons). A dismissal without a reason is refused: the app's error words
/// are shown and announced, and focus moves to the first reason. A new card (a new <see cref="CardId"/>, or without one a new
/// summary, urgency or source) clears the chosen reason. Not a live region. Style hooks: <c>decision-support-card</c>,
/// <c>-indicator</c>, <c>-summary</c>, <c>-source</c>, <c>-detail</c>, <c>-suggestion</c>, <c>-link</c>, <c>-reasons</c>,
/// <c>-reason</c>, <c>-reason-error</c>, <c>-dismiss</c>.
/// </summary>
public class DecisionSupportCard : VerticalStackLayout
{
    /// <summary>The one-sentence summary (under 140 characters); names the card. Required.</summary>
    public static readonly BindableProperty SummaryProperty = Create(nameof(Summary), typeof(string), string.Empty);

    /// <summary>The urgency, for styling.</summary>
    public static readonly BindableProperty IndicatorProperty = Create(nameof(Indicator), typeof(DecisionSupportIndicator), DecisionSupportIndicator.Info);

    /// <summary>The urgency in words. Required: urgency is never colour alone.</summary>
    public static readonly BindableProperty IndicatorLabelProperty = Create(nameof(IndicatorLabel), typeof(string), string.Empty);

    /// <summary>Where the guidance comes from. Required.</summary>
    public static readonly BindableProperty SourceLabelProperty = Create(nameof(SourceLabel), typeof(string), string.Empty);

    /// <summary>The source's address; the source becomes a link.</summary>
    public static readonly BindableProperty SourceUrlProperty = Create(nameof(SourceUrl), typeof(string), null);

    /// <summary>Which card this is (the CDS Hooks uuid with the patient's id).</summary>
    public static readonly BindableProperty CardIdProperty = Create(nameof(CardId), typeof(string), null);

    /// <summary>The suggestions; each a button raising <see cref="SuggestionSelected"/>.</summary>
    public static readonly BindableProperty SuggestionsProperty = Create(nameof(Suggestions), typeof(IReadOnlyList<DecisionSupportSuggestion>), null);

    /// <summary>Links to more information.</summary>
    public static readonly BindableProperty LinksProperty = Create(nameof(Links), typeof(IReadOnlyList<DecisionSupportLink>), null);

    /// <summary>The dismiss button's words; no button without them.</summary>
    public static readonly BindableProperty DismissLabelProperty = Create(nameof(DismissLabel), typeof(string), null);

    /// <summary>When given, dismissing needs one of these reasons.</summary>
    public static readonly BindableProperty OverrideReasonsProperty = Create(nameof(OverrideReasons), typeof(IReadOnlyList<DecisionSupportOverrideReason>), null);

    /// <summary>Names the reasons.</summary>
    public static readonly BindableProperty OverrideReasonLabelProperty = Create(nameof(OverrideReasonLabel), typeof(string), null);

    /// <summary>The app's words when a dismissal is refused for want of a reason.</summary>
    public static readonly BindableProperty OverrideReasonErrorProperty = Create(nameof(OverrideReasonError), typeof(string), null);

    /// <summary>Names the card, instead of the summary.</summary>
    public static readonly BindableProperty LabelProperty = Create(nameof(Label), typeof(string), null);

    /// <summary>The app's detail (markdown rendered by the app, a table), after the source.</summary>
    public static readonly BindableProperty DetailProperty = Create(nameof(Detail), typeof(View), null);

    private static int groups;
    private readonly string group = $"decision-support-card-{Interlocked.Increment(ref groups)}";
    private readonly Label indicator = Lily.Text("decision-support-card-indicator");
    private readonly Label summary = Lily.Text("decision-support-card-summary");
    private readonly VerticalStackLayout body = new();
    private string? identity;
    private bool refused;

    /// <summary>Creates a card; set the summary, urgency and source.</summary>
    public DecisionSupportCard()
    {
        StyleClass = ["decision-support-card"];
        SemanticProperties.SetHeadingLevel(summary, SemanticHeadingLevel.Level2);
        Children.Add(indicator);
        Children.Add(summary);
        Children.Add(body);
        Update();
        Loaded += (_, _) => LilyWarnings.Warn(Warnings);
    }

    /// <summary>A suggestion was chosen; its id. The app applies it and enforces <c>selectionBehavior</c>.</summary>
    public event EventHandler<string>? SuggestionSelected;

    /// <summary>A link was chosen; its address. The app opens it.</summary>
    public event EventHandler<string>? LinkSelected;

    /// <summary>The card was dismissed, with the chosen reason's code, or null when no reasons are offered.</summary>
    public event EventHandler<string?>? Dismissed;

    /// <inheritdoc cref="SummaryProperty"/>
    public string Summary { get => (string)GetValue(SummaryProperty); set => SetValue(SummaryProperty, value); }

    /// <inheritdoc cref="IndicatorProperty"/>
    public DecisionSupportIndicator Indicator { get => (DecisionSupportIndicator)GetValue(IndicatorProperty); set => SetValue(IndicatorProperty, value); }

    /// <inheritdoc cref="IndicatorLabelProperty"/>
    public string IndicatorLabel { get => (string)GetValue(IndicatorLabelProperty); set => SetValue(IndicatorLabelProperty, value); }

    /// <inheritdoc cref="SourceLabelProperty"/>
    public string SourceLabel { get => (string)GetValue(SourceLabelProperty); set => SetValue(SourceLabelProperty, value); }

    /// <inheritdoc cref="SourceUrlProperty"/>
    public string? SourceUrl { get => (string?)GetValue(SourceUrlProperty); set => SetValue(SourceUrlProperty, value); }

    /// <inheritdoc cref="CardIdProperty"/>
    public string? CardId { get => (string?)GetValue(CardIdProperty); set => SetValue(CardIdProperty, value); }

    /// <inheritdoc cref="SuggestionsProperty"/>
    public IReadOnlyList<DecisionSupportSuggestion>? Suggestions { get => (IReadOnlyList<DecisionSupportSuggestion>?)GetValue(SuggestionsProperty); set => SetValue(SuggestionsProperty, value); }

    /// <inheritdoc cref="LinksProperty"/>
    public IReadOnlyList<DecisionSupportLink>? Links { get => (IReadOnlyList<DecisionSupportLink>?)GetValue(LinksProperty); set => SetValue(LinksProperty, value); }

    /// <inheritdoc cref="DismissLabelProperty"/>
    public string? DismissLabel { get => (string?)GetValue(DismissLabelProperty); set => SetValue(DismissLabelProperty, value); }

    /// <inheritdoc cref="OverrideReasonsProperty"/>
    public IReadOnlyList<DecisionSupportOverrideReason>? OverrideReasons { get => (IReadOnlyList<DecisionSupportOverrideReason>?)GetValue(OverrideReasonsProperty); set => SetValue(OverrideReasonsProperty, value); }

    /// <inheritdoc cref="OverrideReasonLabelProperty"/>
    public string? OverrideReasonLabel { get => (string?)GetValue(OverrideReasonLabelProperty); set => SetValue(OverrideReasonLabelProperty, value); }

    /// <inheritdoc cref="OverrideReasonErrorProperty"/>
    public string? OverrideReasonError { get => (string?)GetValue(OverrideReasonErrorProperty); set => SetValue(OverrideReasonErrorProperty, value); }

    /// <inheritdoc cref="LabelProperty"/>
    public string? Label { get => (string?)GetValue(LabelProperty); set => SetValue(LabelProperty, value); }

    /// <inheritdoc cref="DetailProperty"/>
    public View? Detail { get => (View?)GetValue(DetailProperty); set => SetValue(DetailProperty, value); }

    /// <summary>The reason chosen, or null.</summary>
    public string? ChosenReason { get; private set; }

    /// <summary>The development warnings for the current properties.</summary>
    public IReadOnlyList<string> Warnings => DecisionSupportRules.Warnings(
        Summary, IndicatorLabel, SourceLabel, OverrideReasons is { Count: > 0 }, OverrideReasonLabel);

    /// <summary>What the dismiss button does now; the same as pressing it.</summary>
    public DismissOutcome Dismiss()
    {
        var outcome = DecisionSupportRules.Dismiss((OverrideReasons ?? []).Select(r => r.Code).ToList(), ChosenReason);
        if (outcome.Dismissed)
        {
            Dismissed?.Invoke(this, outcome.Reason);
            return outcome;
        }
        refused = true;
        Update();
        if (!string.IsNullOrEmpty(OverrideReasonError) && IsLoaded) LilyAnnouncer.Current.Announce(OverrideReasonError);
        // Focus moves to the first reason; only a rendered view can take it (SetSemanticFocus needs a handler).
        var first = body.Children.OfType<VerticalStackLayout>().SelectMany(v => v.Children.OfType<RadioButton>()).FirstOrDefault();
        if (first?.Handler is not null) first.SetSemanticFocus();
        return outcome;
    }

    /// <summary>Chooses a reason by its code, as tapping its radio button does.</summary>
    public void Choose(string code)
    {
        ChosenReason = code;
        refused = false;
        Update();
    }

    private static BindableProperty Create(string property, Type type, object? initial) =>
        BindableProperty.Create(property, type, typeof(DecisionSupportCard), initial, propertyChanged: (b, _, _) => ((DecisionSupportCard)b).Update());

    private Button Action(string text, string styleClass, Action onClick)
    {
        var button = new Button { Text = text, StyleClass = [styleClass], LineBreakMode = LineBreakMode.WordWrap };
        button.Clicked += (_, _) => onClick();
        return button;
    }

    private void Update()
    {
        // A chosen reason belongs to one card, and to the reasons it offers.
        var now = DecisionSupportRules.Identity(CardId, Summary, Indicator, SourceLabel);
        if (now != identity)
        {
            identity = now;
            ChosenReason = null;
            refused = false;
        }
        var reasons = OverrideReasons ?? [];
        if (ChosenReason is not null && reasons.All(r => r.Code != ChosenReason)) ChosenReason = null;

        indicator.Text = IndicatorLabel;
        summary.Text = Summary;
        SemanticProperties.SetDescription(this, DecisionSupportRules.Name(Label, Summary));

        body.Children.Clear();
        body.Children.Add(string.IsNullOrEmpty(SourceUrl)
            ? Lily.Text("decision-support-card-source", SourceLabel)
            : Action(SourceLabel, "decision-support-card-source", () => LinkSelected?.Invoke(this, SourceUrl!)));
        if (Detail is not null) body.Children.Add(new ContentView { Content = Detail, StyleClass = ["decision-support-card-detail"] });
        foreach (var s in Suggestions ?? [])
            body.Children.Add(Action(s.Label, "decision-support-card-suggestion", () => SuggestionSelected?.Invoke(this, s.Id)));
        foreach (var l in Links ?? [])
            body.Children.Add(Action(l.Label, "decision-support-card-link", () => LinkSelected?.Invoke(this, l.Href)));
        if (string.IsNullOrEmpty(DismissLabel)) return;
        if (reasons.Count > 0)
        {
            var group = new VerticalStackLayout { StyleClass = ["decision-support-card-reasons"] };
            SemanticProperties.SetDescription(group, OverrideReasonLabel);
            group.Children.Add(Lily.Text("decision-support-card-reasons-label", OverrideReasonLabel));
            foreach (var r in reasons)
            {
                var radio = new RadioButton { Content = r.Display, Value = r.Code, GroupName = this.group, IsChecked = r.Code == ChosenReason, StyleClass = ["decision-support-card-reason"] };
                radio.CheckedChanged += (_, e) => { if (e.Value) Choose(r.Code); };
                group.Children.Add(radio);
            }
            var error = Lily.Text("decision-support-card-reason-error", OverrideReasonError);
            error.IsVisible = refused && !string.IsNullOrEmpty(OverrideReasonError);
            group.Children.Add(error);
            body.Children.Add(group);
        }
        body.Children.Add(Action(DismissLabel, "decision-support-card-dismiss", () => Dismiss()));
    }
}
