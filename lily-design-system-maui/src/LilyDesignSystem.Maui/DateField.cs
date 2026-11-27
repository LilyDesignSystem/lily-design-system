using LilyDesignSystem.Maui.Core;
using Microsoft.Maui.Controls;

namespace LilyDesignSystem.Maui;

/// <summary>
/// DateField (components/date-field): a date asked for as typed parts, day, month and year, in the reader's order. Each part is
/// an Entry spoken with the date's name and its own label, then the description and the error. <see cref="Value"/> is ISO 8601
/// once every part is a number, else ""; whether it is a real day is <see cref="FormParts.IsCalendarDate"/>'s, and the app's to
/// say (tasks.md P62-T3). Style hooks: <c>date-field</c>, <c>date-field-label</c>, <c>date-field-description</c>,
/// <c>date-field-error</c>, <c>date-field-part</c>, <c>date-field-part-label</c>, <c>date-field-{part}</c>.
/// </summary>
public class DateField : VerticalStackLayout
{
    /// <summary>The date as YYYY-MM-DD, YYYY-MM or YYYY (by <see cref="Precision"/>), or "" until its parts are numbers. Two-way.</summary>
    public static readonly BindableProperty ValueProperty = BindableProperty.Create(
        nameof(Value), typeof(string), typeof(DateField), string.Empty, BindingMode.TwoWay,
        propertyChanged: (b, _, n) => ((DateField)b).ValueChanged((string)n));

    /// <summary>The error, in the app's language; shown, spoken last, and announced when it is set.</summary>
    public static readonly BindableProperty ErrorProperty = BindableProperty.Create(
        nameof(Error), typeof(string), typeof(DateField), null, propertyChanged: (b, _, _) => ((DateField)b).Rebuild(announce: true));

    private readonly Label label = Lily.Hidden(Lily.Text("date-field-label"));
    private readonly Label description = Lily.Hidden(Lily.Text("date-field-description"));
    private readonly Label error = Lily.Hidden(Lily.Text("date-field-error"));
    private readonly HorizontalStackLayout row = new() { Spacing = 12 };
    private readonly Dictionary<string, Entry> entries = [];
    private DateParts parts = new();
    private string labelText = "", order = "ymd", precision = "day";
    private string? dayLabel, monthLabel, yearLabel, descriptionText;

    /// <summary>Creates a date field; set <see cref="Label"/>, the part labels and <see cref="Order"/>.</summary>
    public DateField()
    {
        StyleClass = ["date-field"];
        Children.Add(label);
        Children.Add(description);
        Children.Add(error);
        Children.Add(row);
        Rebuild(announce: false);
    }

    /// <summary>Names the whole date ("Date of birth"); spoken before each part's label.</summary>
    public string Label { get => labelText; set { labelText = value; Rebuild(false); } }

    /// <summary>The day part's label; needed when <see cref="Precision"/> is "day".</summary>
    public string? DayLabel { get => dayLabel; set { dayLabel = value; Rebuild(false); } }

    /// <summary>The month part's label; needed unless <see cref="Precision"/> is "year".</summary>
    public string? MonthLabel { get => monthLabel; set { monthLabel = value; Rebuild(false); } }

    /// <summary>The year part's label.</summary>
    public string? YearLabel { get => yearLabel; set { yearLabel = value; Rebuild(false); } }

    /// <summary>The order the reader writes a date in: "ymd", "dmy" or "mdy". The app's, never assumed.</summary>
    public string Order { get => order; set { order = value; Rebuild(false); } }

    /// <summary>"day" (all three parts), "month" or "year".</summary>
    public string Precision { get => precision; set { precision = value; parts = FormParts.SplitDateValue(Value, value); Rebuild(false); } }

    /// <summary>Help text, such as an example date, spoken after each part's label.</summary>
    public string? Description { get => descriptionText; set { descriptionText = value; Rebuild(false); } }

    /// <inheritdoc cref="ValueProperty"/>
    public string Value { get => (string)GetValue(ValueProperty); set => SetValue(ValueProperty, value); }

    /// <inheritdoc cref="ErrorProperty"/>
    public string? Error { get => (string?)GetValue(ErrorProperty); set => SetValue(ErrorProperty, value); }

    /// <summary>Each part's Entry, by "day", "month" and "year": for the app's own styling and for tests.</summary>
    public IReadOnlyDictionary<string, Entry> PartEntries => entries;

    /// <summary>Words a part needs but was not given, for a development warning.</summary>
    public IReadOnlyList<string> Warnings() =>
        [.. FormParts.DatePartsShown(Precision).Where(p => string.IsNullOrEmpty(PartLabel(p))).Select(p => $"DateField: the {p} part needs a label")];

    private string? PartLabel(string part) => part switch { "day" => DayLabel, "month" => MonthLabel, _ => YearLabel };

    private void ValueChanged(string value)
    {
        // A value set from outside fills the parts; one the parts produced leaves them as typed.
        if (value == FormParts.JoinDateParts(parts, Precision)) return;
        parts = FormParts.SplitDateValue(value, Precision);
        foreach (var (part, entry) in entries) entry.Text = parts[part];
    }

    private void Rebuild(bool announce)
    {
        label.Text = Label;
        description.Text = Description;
        description.IsVisible = !string.IsNullOrEmpty(Description);
        error.Text = Error;
        error.IsVisible = !string.IsNullOrEmpty(Error);
        row.Children.Clear();
        entries.Clear();
        foreach (var part in FormParts.DateSequence(Order, Precision))
        {
            var entry = new Entry
            {
                Text = parts[part],
                Keyboard = Keyboard.Numeric,
                MaxLength = part == "year" ? 4 : 2,
                WidthRequest = part == "year" ? 80 : 56,
                StyleClass = ["date-field-part", $"date-field-{part}"],
            };
            SemanticProperties.SetDescription(entry, LilySemantics.Spoken(Label, PartLabel(part), Description, Error));
            entry.TextChanged += (_, e) =>
            {
                parts = part switch
                {
                    "year" => parts with { Year = e.NewTextValue ?? "" },
                    "month" => parts with { Month = e.NewTextValue ?? "" },
                    _ => parts with { Day = e.NewTextValue ?? "" },
                };
                Value = FormParts.JoinDateParts(parts, Precision);
            };
            entries[part] = entry;
            row.Children.Add(new VerticalStackLayout { Children = { Lily.Hidden(Lily.Text("date-field-part-label", PartLabel(part))), entry } });
        }
        if (announce && IsLoaded && !string.IsNullOrEmpty(Error)) LilyAnnouncer.Current.Announce(Error);
    }
}
