using LilyDesignSystem.Maui.Core;
using Microsoft.Maui.Controls;

namespace LilyDesignSystem.Maui;

/// <summary>
/// AgeView (components/age-view): an age in the app's words ("5 years 2 months"). Lily writes no unit words: build them from
/// <see cref="ClinicalFormat.AgeParts(string, string)"/>. One stop, the optional label spoken first. Style hook: <c>age-view</c>.
/// </summary>
public class AgeView : Label
{
    /// <summary>Spoken first, naming the value ("Age").</summary>
    public static readonly BindableProperty LabelProperty = BindableProperty.Create(
        nameof(Label), typeof(string), typeof(AgeView), null, propertyChanged: (b, _, _) => ((AgeView)b).Describe());

    /// <summary>The same age as an ISO 8601 duration (<c>ToIsoDuration(AgeParts(…))</c>), for the app's own use.</summary>
    public static readonly BindableProperty DurationProperty = BindableProperty.Create(nameof(Duration), typeof(string), typeof(AgeView));

    /// <summary>Creates an age view; set the text.</summary>
    public AgeView()
    {
        StyleClass = ["age-view"];
        PropertyChanged += (_, e) => { if (e.PropertyName == TextProperty.PropertyName) Describe(); };
    }

    /// <inheritdoc cref="LabelProperty"/>
    public string? Label { get => (string?)GetValue(LabelProperty); set => SetValue(LabelProperty, value); }

    /// <inheritdoc cref="DurationProperty"/>
    public string? Duration { get => (string?)GetValue(DurationProperty); set => SetValue(DurationProperty, value); }

    private void Describe() => SemanticProperties.SetDescription(this, LilySemantics.Spoken(Label, Text));
}

/// <summary>
/// DurationView (components/duration-view): a length of time in the app's words ("3 days early"); the direction is in those
/// words. <see cref="Duration"/> is the same length as an ISO 8601 duration of days, hours, minutes and seconds, optionally
/// negative; an invalid one is a development warning. One stop, the optional label first. Style hook: <c>duration-view</c>.
/// </summary>
public class DurationView : Label
{
    /// <summary>Spoken first, naming the value.</summary>
    public static readonly BindableProperty LabelProperty = BindableProperty.Create(
        nameof(Label), typeof(string), typeof(DurationView), null, propertyChanged: (b, _, _) => ((DurationView)b).Describe());

    /// <summary>The ISO 8601 duration ("P3D", "-PT90M").</summary>
    public static readonly BindableProperty DurationProperty = BindableProperty.Create(nameof(Duration), typeof(string), typeof(DurationView), string.Empty);

    /// <summary>Creates a duration view; set the text and <see cref="Duration"/>.</summary>
    public DurationView()
    {
        StyleClass = ["duration-view"];
        PropertyChanged += (_, e) => { if (e.PropertyName == TextProperty.PropertyName) Describe(); };
        Loaded += (_, _) => LilyWarnings.Warn(Warnings);
    }

    /// <inheritdoc cref="LabelProperty"/>
    public string? Label { get => (string?)GetValue(LabelProperty); set => SetValue(LabelProperty, value); }

    /// <inheritdoc cref="DurationProperty"/>
    public string Duration { get => (string)GetValue(DurationProperty); set => SetValue(DurationProperty, value); }

    /// <summary>The parsed duration, as the web renders <c>datetime</c> and <c>data-negative</c>; null when it is not valid.</summary>
    public HtmlDurationValue? Parsed => ClinicalFormat.HtmlDuration(Duration);

    /// <summary>The development warnings for the current duration.</summary>
    public IReadOnlyList<string> Warnings => Parsed is null
        ? [$"DurationView: {Duration} is not an ISO 8601 duration of days, hours, minutes and seconds"]
        : [];

    private void Describe() => SemanticProperties.SetDescription(this, LilySemantics.Spoken(Label, Text));
}
