using LilyDesignSystem.Maui.Core;
using Microsoft.Maui.Controls;

namespace LilyDesignSystem.Maui;

/// <summary>
/// ObservationView (components/observation-view): a clinical result with its unit, flag, reference range and status, as one
/// screen-reader stop that speaks <see cref="ObservationRules"/> in order. The flag's meaning is its words, never its colour:
/// <see cref="Interpretation"/> is for styling only. A status that is not final needs words, or nothing of the result is shown.
/// A missing flag label, status label or previous label is a development warning (<see cref="LilyWarnings"/>).
/// Style hooks: <c>observation-view</c>, <c>-value</c>, <c>-flag</c>, <c>-status</c>, <c>-previous</c>, <c>-previous-label</c>,
/// <c>-range</c>, <c>-withdrawn</c>.
/// </summary>
public class ObservationView : VerticalStackLayout
{
    /// <summary>The value, formatted by the app ("5.2").</summary>
    public static readonly BindableProperty ValueProperty = Create(nameof(Value), typeof(string), null);

    /// <summary>The unit ("mmol/L"); joined to the value by a no-break space.</summary>
    public static readonly BindableProperty UnitProperty = Create(nameof(Unit), typeof(string), null);

    /// <summary>A FHIR v3 ObservationInterpretation code ("N", "H", "LL"); for styling only, never shown.</summary>
    public static readonly BindableProperty InterpretationProperty = Create(nameof(Interpretation), typeof(string), null);

    /// <summary>The flag in the app's words ("High"); required when the interpretation is not "N".</summary>
    public static readonly BindableProperty FlagLabelProperty = Create(nameof(FlagLabel), typeof(string), null);

    /// <summary>The reference range as text.</summary>
    public static readonly BindableProperty RangeProperty = Create(nameof(Range), typeof(string), null);

    /// <summary>Further named ranges.</summary>
    public static readonly BindableProperty RangesProperty = Create(nameof(Ranges), typeof(IReadOnlyList<NamedRange>), null);

    /// <summary>A FHIR status or a Lily absence; final by default.</summary>
    public static readonly BindableProperty StatusProperty = Create(nameof(Status), typeof(ObservationStatus), ObservationStatus.Final);

    /// <summary>The status in words; required for any status but final.</summary>
    public static readonly BindableProperty StatusLabelProperty = Create(nameof(StatusLabel), typeof(string), null);

    /// <summary>A superseded value, struck through.</summary>
    public static readonly BindableProperty PreviousValueProperty = Create(nameof(PreviousValue), typeof(string), null);

    /// <summary>The words for the superseded value ("was 5.1 until 3 Nov"); required with <see cref="PreviousValue"/>.</summary>
    public static readonly BindableProperty PreviousLabelProperty = Create(nameof(PreviousLabel), typeof(string), null);

    /// <summary>Spoken first, when no visible caption names the observation.</summary>
    public static readonly BindableProperty LabelProperty = Create(nameof(Label), typeof(string), null);

    /// <summary>For an authorised history view: an entered-in-error result's former value, struck through after its words.</summary>
    public static readonly BindableProperty ShowWithdrawnProperty = Create(nameof(ShowWithdrawn), typeof(bool), false);

    private readonly Label shown = Lily.Hidden(Lily.Text("observation-view-value"));
    private readonly Label withdrawnValue = Lily.Hidden(Lily.Text("observation-view-withdrawn"));
    private readonly Label flag = Lily.Hidden(Lily.Text("observation-view-flag"));
    private readonly Label status = Lily.Hidden(Lily.Text("observation-view-status"));
    private readonly Label previous = Lily.Hidden(Lily.Text("observation-view-previous"));
    private readonly Label previousLabel = Lily.Hidden(Lily.Text("observation-view-previous-label"));
    private readonly Label range = Lily.Hidden(Lily.Text("observation-view-range"));
    private readonly VerticalStackLayout ranges = Lily.Hidden(new VerticalStackLayout());

    /// <summary>Creates an empty view.</summary>
    public ObservationView()
    {
        StyleClass = ["observation-view"];
        withdrawnValue.TextDecorations = TextDecorations.Strikethrough;
        previous.TextDecorations = TextDecorations.Strikethrough;
        Children.Add(Lily.Hidden(new HorizontalStackLayout { Spacing = 8, Children = { shown, withdrawnValue, flag, status } }));
        Children.Add(Lily.Hidden(new HorizontalStackLayout { Spacing = 8, Children = { previous, previousLabel } }));
        Children.Add(range);
        Children.Add(ranges);
        Update();
        Loaded += (_, _) => LilyWarnings.Warn(Warnings);
    }

    /// <inheritdoc cref="ValueProperty"/>
    public string? Value { get => (string?)GetValue(ValueProperty); set => SetValue(ValueProperty, value); }

    /// <inheritdoc cref="UnitProperty"/>
    public string? Unit { get => (string?)GetValue(UnitProperty); set => SetValue(UnitProperty, value); }

    /// <inheritdoc cref="InterpretationProperty"/>
    public string? Interpretation { get => (string?)GetValue(InterpretationProperty); set => SetValue(InterpretationProperty, value); }

    /// <inheritdoc cref="FlagLabelProperty"/>
    public string? FlagLabel { get => (string?)GetValue(FlagLabelProperty); set => SetValue(FlagLabelProperty, value); }

    /// <inheritdoc cref="RangeProperty"/>
    public string? Range { get => (string?)GetValue(RangeProperty); set => SetValue(RangeProperty, value); }

    /// <inheritdoc cref="RangesProperty"/>
    public IReadOnlyList<NamedRange>? Ranges { get => (IReadOnlyList<NamedRange>?)GetValue(RangesProperty); set => SetValue(RangesProperty, value); }

    /// <inheritdoc cref="StatusProperty"/>
    public ObservationStatus Status { get => (ObservationStatus)GetValue(StatusProperty); set => SetValue(StatusProperty, value); }

    /// <inheritdoc cref="StatusLabelProperty"/>
    public string? StatusLabel { get => (string?)GetValue(StatusLabelProperty); set => SetValue(StatusLabelProperty, value); }

    /// <inheritdoc cref="PreviousValueProperty"/>
    public string? PreviousValue { get => (string?)GetValue(PreviousValueProperty); set => SetValue(PreviousValueProperty, value); }

    /// <inheritdoc cref="PreviousLabelProperty"/>
    public string? PreviousLabel { get => (string?)GetValue(PreviousLabelProperty); set => SetValue(PreviousLabelProperty, value); }

    /// <inheritdoc cref="LabelProperty"/>
    public string? Label { get => (string?)GetValue(LabelProperty); set => SetValue(LabelProperty, value); }

    /// <inheritdoc cref="ShowWithdrawnProperty"/>
    public bool ShowWithdrawn { get => (bool)GetValue(ShowWithdrawnProperty); set => SetValue(ShowWithdrawnProperty, value); }

    /// <summary>The development warnings for the current properties.</summary>
    public IReadOnlyList<string> Warnings =>
        ObservationRules.Warnings(Interpretation, FlagLabel, Status, StatusLabel, PreviousValue, PreviousLabel);

    private static BindableProperty Create(string property, Type type, object? initial) =>
        BindableProperty.Create(property, type, typeof(ObservationView), initial, propertyChanged: (b, _, _) => ((ObservationView)b).Update());

    private static void Show(Label label, string? text)
    {
        label.Text = text;
        label.IsVisible = !string.IsNullOrEmpty(text);
    }

    private void Update()
    {
        var replaced = ObservationRules.Withholds(Status, StatusLabel, ShowWithdrawn);
        var withdrawn = ObservationRules.IsWithdrawn(Status);
        var whole = !replaced && !withdrawn;
        Show(shown, replaced || withdrawn ? StatusLabel : ObservationRules.ShownValue(Value, Unit, Status));
        Show(withdrawnValue, withdrawn && !replaced ? ObservationRules.ShownValue(Value, Unit, Status) : null);
        Show(flag, whole && ObservationRules.IsFlagged(Interpretation) ? FlagLabel : null);
        Show(status, whole && ObservationRules.ShowsStatus(Status) ? StatusLabel : null);
        Show(previous, whole ? PreviousValue : null);
        Show(previousLabel, whole ? PreviousLabel : null);
        Show(range, whole ? Range : null);
        ranges.Children.Clear();
        if (whole)
            foreach (var r in Ranges ?? [])
                ranges.Children.Add(Lily.Text("observation-view-range", r.Label + ObservationRules.NoBreakSpace + r.Text));
        Lily.OneStop(this, ObservationRules.Spoken(
            Label, Value, Unit, FlagLabel, Interpretation, Range, Ranges, Status, StatusLabel, PreviousLabel, ShowWithdrawn));
    }
}
