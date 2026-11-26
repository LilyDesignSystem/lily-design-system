using Microsoft.Maui.Controls;

namespace LilyDesignSystem.Maui;

/// <summary>
/// SummaryList (components/summary-list): labelled term-and-value pairs. Add <see cref="SummaryListItem"/>s as children.
/// The value is stacked under the term, so nothing is cut off at a large font size or a narrow window.
/// Style hook: <c>summary-list</c>.
/// </summary>
public class SummaryList : VerticalStackLayout
{
    /// <summary>The list's spoken name, in the app's language.</summary>
    public static readonly BindableProperty LabelProperty = BindableProperty.Create(
        nameof(Label), typeof(string), typeof(SummaryList), string.Empty, propertyChanged: (b, _, n) => SemanticProperties.SetDescription(b, (string)n));

    /// <summary>Creates an empty list.</summary>
    public SummaryList() => StyleClass = ["summary-list"];

    /// <inheritdoc cref="LabelProperty"/>
    public string Label { get => (string)GetValue(LabelProperty); set => SetValue(LabelProperty, value); }
}

/// <summary>
/// One term and its value, read as one stop: term, then value. A missing value should be the app's words, never a dash.
/// Style hooks: <c>summary-list-item</c>, <c>summary-list-term</c>, <c>summary-list-value</c>.
/// </summary>
public class SummaryListItem : VerticalStackLayout
{
    /// <summary>The key, in the app's language.</summary>
    public static readonly BindableProperty TermProperty = BindableProperty.Create(
        nameof(Term), typeof(string), typeof(SummaryListItem), string.Empty, propertyChanged: (b, _, _) => ((SummaryListItem)b).Update());

    /// <summary>The value, in the app's language.</summary>
    public static readonly BindableProperty ValueProperty = BindableProperty.Create(
        nameof(Value), typeof(string), typeof(SummaryListItem), string.Empty, propertyChanged: (b, _, _) => ((SummaryListItem)b).Update());

    private readonly Label term = Lily.Hidden(Lily.Text("summary-list-term"));
    private readonly Label value = Lily.Hidden(Lily.Text("summary-list-value"));

    /// <summary>Creates an item; set <see cref="Term"/> and <see cref="Value"/>.</summary>
    public SummaryListItem()
    {
        StyleClass = ["summary-list-item"];
        Children.Add(term);
        Children.Add(value);
        Update();
    }

    /// <inheritdoc cref="TermProperty"/>
    public string Term { get => (string)GetValue(TermProperty); set => SetValue(TermProperty, value); }

    /// <inheritdoc cref="ValueProperty"/>
    public string Value { get => (string)GetValue(ValueProperty); set => SetValue(ValueProperty, value); }

    private void Update()
    {
        term.Text = Term;
        value.Text = Value;
        Lily.OneStop(this, Core.LilySemantics.Spoken(Term, Value) ?? Term);
    }
}
