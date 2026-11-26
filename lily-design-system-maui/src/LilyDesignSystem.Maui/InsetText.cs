using Microsoft.Maui.Controls;

namespace LilyDesignSystem.Maui;

/// <summary>
/// InsetText (components/inset-text): supplementary text set apart (the web's <c>role="note"</c>), read as one stop.
/// Style hooks: <c>inset-text</c>, <c>inset-text-text</c>.
/// </summary>
public class InsetText : ContentView
{
    /// <summary>The text, in the app's language.</summary>
    public static readonly BindableProperty TextProperty = BindableProperty.Create(
        nameof(Text), typeof(string), typeof(InsetText), string.Empty, propertyChanged: (b, _, n) => ((InsetText)b).Update((string)n));

    private readonly Label label = Lily.Hidden(Lily.Text("inset-text-text"));

    /// <summary>Creates inset text; set <see cref="Text"/>.</summary>
    public InsetText()
    {
        StyleClass = ["inset-text"];
        Content = label;
        Update(Text);
    }

    /// <inheritdoc cref="TextProperty"/>
    public string Text { get => (string)GetValue(TextProperty); set => SetValue(TextProperty, value); }

    private void Update(string text)
    {
        label.Text = text;
        Lily.OneStop(this, text);
    }
}
