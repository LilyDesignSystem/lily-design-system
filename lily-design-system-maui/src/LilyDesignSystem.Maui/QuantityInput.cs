using LilyDesignSystem.Maui.Core;
using Microsoft.Maui.Controls;

namespace LilyDesignSystem.Maui;

/// <summary>One unit a quantity may be given in, with the limits a number in it must keep to.</summary>
public sealed record QuantityUnit(string Value, string Label, double? Min = null, double? Max = null);

/// <summary>
/// QuantityInput (components/quantity-input-div): a number and its unit, such as a weight in kilograms or pounds. The number is
/// an Entry with the decimal keyboard, spoken with the quantity's name; the units are a Picker when there is more than one.
/// <see cref="Problem"/> says what is wrong with the number as typed (tasks.md P62-T3). Style hooks: <c>quantity-input-div</c>,
/// <c>quantity-input-div-label</c>, <c>quantity-input-div-magnitude</c>, <c>quantity-input-div-unit</c>.
/// </summary>
public class QuantityInput : VerticalStackLayout
{
    private readonly Label label = Lily.Hidden(Lily.Text("quantity-input-div-label"));
    private readonly Label error = Lily.Hidden(Lily.Text("quantity-input-div-error"));
    private readonly Label single = Lily.Hidden(Lily.Text("quantity-input-div-unit"));
    private readonly Picker picker = new() { StyleClass = ["quantity-input-div-unit"] };
    private IReadOnlyList<QuantityUnit> units = [];
    private string labelText = "", magnitudeLabel = "";
    private string? unitLabel, errorText;

    /// <summary>Creates a quantity input; set <see cref="Label"/>, <see cref="MagnitudeLabel"/> and <see cref="Units"/>.</summary>
    public QuantityInput()
    {
        StyleClass = ["quantity-input-div"];
        Magnitude.Keyboard = Keyboard.Numeric;
        Magnitude.StyleClass = ["quantity-input-div-magnitude"];
        Magnitude.WidthRequest = 120;
        picker.SelectedIndexChanged += (_, _) =>
        {
            if (picker.SelectedIndex >= 0) Unit = units[picker.SelectedIndex].Value;
        };
        Children.Add(label);
        Children.Add(error);
        Children.Add(new HorizontalStackLayout { Spacing = 12, Children = { Magnitude, single, picker } });
        Update();
    }

    /// <summary>The number field: its Text is the magnitude as typed, with a full stop for its decimal mark.</summary>
    public Entry Magnitude { get; } = new();

    /// <summary>Names the quantity ("Your weight").</summary>
    public string Label { get => labelText; set { labelText = value; Update(); } }

    /// <summary>The number's label ("Weight"); its spoken name follows the quantity's.</summary>
    public string MagnitudeLabel { get => magnitudeLabel; set { magnitudeLabel = value; Update(); } }

    /// <summary>The unit choice's label ("Weight unit"); needed when there is more than one unit.</summary>
    public string? UnitLabel { get => unitLabel; set { unitLabel = value; Update(); } }

    /// <summary>The units offered, each with its limits.</summary>
    public IReadOnlyList<QuantityUnit> Units { get => units; set { units = value; Update(); } }

    /// <summary>The chosen unit's <see cref="QuantityUnit.Value"/>; the first unit's until one is chosen.</summary>
    public string Unit { get; set { field = value; Update(); } } = "";

    /// <summary>The error, in the app's language; shown and spoken after the number's name, and announced when it is set.</summary>
    public string? Error { get => errorText; set { errorText = value; Update(); if (IsLoaded && !string.IsNullOrEmpty(value)) LilyAnnouncer.Current.Announce(value); } }

    /// <summary>What is wrong with the number as typed, in the chosen unit ("empty", "not-a-number", …), or null.</summary>
    public string? Problem
    {
        get
        {
            var chosen = Units.FirstOrDefault(u => u.Value == Unit);
            return FormParts.QuantityProblem(Magnitude.Text ?? "", chosen?.Min, chosen?.Max);
        }
    }

    private void Update()
    {
        if (Unit.Length == 0 && Units.Count > 0) Unit = Units[0].Value;
        label.Text = Label;
        error.Text = Error;
        error.IsVisible = !string.IsNullOrEmpty(Error);
        var chosen = Units.FirstOrDefault(u => u.Value == Unit);
        single.Text = Units.Count == 1 ? Units[0].Label : null;
        single.IsVisible = Units.Count == 1;
        picker.IsVisible = Units.Count > 1;
        picker.Title = UnitLabel;
        if (!ReferenceEquals(picker.ItemsSource, units)) picker.ItemsSource = units.Select(u => u.Label).ToList();
        var index = units.ToList().FindIndex(u => u.Value == Unit);
        if (picker.SelectedIndex != index) picker.SelectedIndex = index;
        SemanticProperties.SetDescription(picker, UnitLabel);
        SemanticProperties.SetDescription(
            Magnitude, LilySemantics.Spoken(Label, MagnitudeLabel, Units.Count == 1 ? chosen?.Label : null, Error));
    }
}
