using LilyDesignSystem.Maui.Core;
using Microsoft.Maui.Controls;

namespace LilyDesignSystem.Maui;

/// <summary>
/// MedicationView (components/medication-view): a medicine's name, strength, form, route, frequency and free-text dosage, as
/// one screen-reader stop. Tall man segments the app marks are bold; the spoken name stays one word. No part is truncated.
/// Style hooks: <c>medication-view</c>, <c>medication-view-name</c>, <c>medication-view-tall-man</c> (a span style is not a
/// class in MAUI, so tall man letters are bold by default; set <see cref="TallManAttributes"/> to change it),
/// <c>medication-view-strength</c>, <c>-form</c>, <c>-route</c>, <c>-frequency</c>, <c>-dosage</c>.
/// </summary>
public class MedicationView : VerticalStackLayout
{
    /// <summary>The name as plain text; or <see cref="NameSegments"/>, which wins when it has any.</summary>
    public static readonly BindableProperty NameProperty = Create(nameof(Name), typeof(string));

    /// <summary>The name in parts, with tall man letters marked by the app.</summary>
    public static readonly BindableProperty NameSegmentsProperty = Create(nameof(NameSegments), typeof(IReadOnlyList<MedicationNameSegment>));

    /// <summary>The strength, formatted by the app ("5 mg").</summary>
    public static readonly BindableProperty StrengthProperty = Create(nameof(Strength), typeof(string));

    /// <summary>The form ("tablet").</summary>
    public static readonly BindableProperty FormProperty = Create(nameof(Form), typeof(string));

    /// <summary>The route ("oral").</summary>
    public static readonly BindableProperty RouteProperty = Create(nameof(Route), typeof(string));

    /// <summary>The frequency ("twice daily").</summary>
    public static readonly BindableProperty FrequencyProperty = Create(nameof(Frequency), typeof(string));

    /// <summary>The dose as free text, when the record has no structured parts.</summary>
    public static readonly BindableProperty DosageTextProperty = Create(nameof(DosageText), typeof(string));

    /// <summary>Spoken first, naming the value.</summary>
    public static readonly BindableProperty LabelProperty = Create(nameof(Label), typeof(string));

    /// <summary>How tall man letters are drawn; bold by default.</summary>
    public static readonly BindableProperty TallManAttributesProperty = BindableProperty.Create(
        nameof(TallManAttributes), typeof(FontAttributes), typeof(MedicationView), FontAttributes.Bold, propertyChanged: (b, _, _) => ((MedicationView)b).Update());

    private readonly Label name = Lily.Hidden(Lily.Text("medication-view-name"));
    private readonly Label strength = Lily.Hidden(Lily.Text("medication-view-strength"));
    private readonly Label form = Lily.Hidden(Lily.Text("medication-view-form"));
    private readonly Label route = Lily.Hidden(Lily.Text("medication-view-route"));
    private readonly Label frequency = Lily.Hidden(Lily.Text("medication-view-frequency"));
    private readonly Label dosage = Lily.Hidden(Lily.Text("medication-view-dosage"));

    /// <summary>Creates an empty view.</summary>
    public MedicationView()
    {
        StyleClass = ["medication-view"];
        foreach (var part in new[] { name, strength, form, route, frequency, dosage }) Children.Add(part);
        Update();
    }

    /// <inheritdoc cref="NameProperty"/>
    public string? Name { get => (string?)GetValue(NameProperty); set => SetValue(NameProperty, value); }

    /// <inheritdoc cref="NameSegmentsProperty"/>
    public IReadOnlyList<MedicationNameSegment>? NameSegments { get => (IReadOnlyList<MedicationNameSegment>?)GetValue(NameSegmentsProperty); set => SetValue(NameSegmentsProperty, value); }

    /// <inheritdoc cref="StrengthProperty"/>
    public string? Strength { get => (string?)GetValue(StrengthProperty); set => SetValue(StrengthProperty, value); }

    /// <inheritdoc cref="FormProperty"/>
    public string? Form { get => (string?)GetValue(FormProperty); set => SetValue(FormProperty, value); }

    /// <inheritdoc cref="RouteProperty"/>
    public string? Route { get => (string?)GetValue(RouteProperty); set => SetValue(RouteProperty, value); }

    /// <inheritdoc cref="FrequencyProperty"/>
    public string? Frequency { get => (string?)GetValue(FrequencyProperty); set => SetValue(FrequencyProperty, value); }

    /// <inheritdoc cref="DosageTextProperty"/>
    public string? DosageText { get => (string?)GetValue(DosageTextProperty); set => SetValue(DosageTextProperty, value); }

    /// <inheritdoc cref="LabelProperty"/>
    public string? Label { get => (string?)GetValue(LabelProperty); set => SetValue(LabelProperty, value); }

    /// <inheritdoc cref="TallManAttributesProperty"/>
    public FontAttributes TallManAttributes { get => (FontAttributes)GetValue(TallManAttributesProperty); set => SetValue(TallManAttributesProperty, value); }

    private static BindableProperty Create(string property, Type type) =>
        BindableProperty.Create(property, type, typeof(MedicationView), null, propertyChanged: (b, _, _) => ((MedicationView)b).Update());

    private static void Show(Label label, string? text)
    {
        label.Text = text;
        label.IsVisible = !string.IsNullOrEmpty(text);
    }

    private void Update()
    {
        if (NameSegments is { Count: > 0 } segments)
        {
            var formatted = new FormattedString();
            foreach (var s in segments)
                formatted.Spans.Add(new Span { Text = s.Text, FontAttributes = s.TallMan ? TallManAttributes : FontAttributes.None });
            name.Text = null;
            name.FormattedText = formatted;
            name.IsVisible = true;
        }
        else
        {
            name.FormattedText = null;
            Show(name, Name);
        }
        Show(strength, Strength);
        Show(form, Form);
        Show(route, Route);
        Show(frequency, Frequency);
        Show(dosage, DosageText);
        Lily.OneStop(this, MedicationRules.Spoken(Label, Name, NameSegments, Strength, Form, Route, Frequency, DosageText));
    }
}
