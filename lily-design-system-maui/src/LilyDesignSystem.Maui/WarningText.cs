using LilyDesignSystem.Maui.Core;
using Microsoft.Maui.Controls;

namespace LilyDesignSystem.Maui;

/// <summary>
/// WarningText (components/warning-text). On the web the kind of message ("Warning") is visually hidden text; MAUI has none,
/// so it is a required <see cref="Prefix"/>, spoken before the warning as one stop. Lily supplies neither word. An icon put
/// in <see cref="Icon"/> is decorative and hidden from the screen reader. Style hooks: <c>warning-text</c>,
/// <c>warning-text-icon</c>, <c>warning-text-text</c>.
/// </summary>
public class WarningText : HorizontalStackLayout
{
    /// <summary>The kind of message, spoken first ("Warning"), in the app's language. Required.</summary>
    public static readonly BindableProperty PrefixProperty = BindableProperty.Create(
        nameof(Prefix), typeof(string), typeof(WarningText), string.Empty, propertyChanged: (b, _, _) => ((WarningText)b).Update());

    /// <summary>The warning, in the app's language.</summary>
    public static readonly BindableProperty TextProperty = BindableProperty.Create(
        nameof(Text), typeof(string), typeof(WarningText), string.Empty, propertyChanged: (b, _, _) => ((WarningText)b).Update());

    /// <summary>A decorative icon, shown first; hidden from the screen reader.</summary>
    public static readonly BindableProperty IconProperty = BindableProperty.Create(
        nameof(Icon), typeof(View), typeof(WarningText), null, propertyChanged: (b, o, n) => ((WarningText)b).SetIcon(o as View, n as View));

    private readonly Label text = Lily.Hidden(Lily.Text("warning-text-text"));

    /// <summary>Creates warning text; set <see cref="Prefix"/> and <see cref="Text"/>.</summary>
    public WarningText()
    {
        StyleClass = ["warning-text"];
        Children.Add(text);
        Update();
    }

    /// <inheritdoc cref="PrefixProperty"/>
    public string Prefix { get => (string)GetValue(PrefixProperty); set => SetValue(PrefixProperty, value); }

    /// <inheritdoc cref="TextProperty"/>
    public string Text { get => (string)GetValue(TextProperty); set => SetValue(TextProperty, value); }

    /// <inheritdoc cref="IconProperty"/>
    public View? Icon { get => (View?)GetValue(IconProperty); set => SetValue(IconProperty, value); }

    private void SetIcon(View? old, View? icon)
    {
        if (old is not null) Children.Remove(old);
        if (icon is null) return;
        icon.StyleClass = [.. icon.StyleClass ?? [], "warning-text-icon"];
        Children.Insert(0, Lily.Hidden(icon));
    }

    private void Update()
    {
        text.Text = Text;
        Lily.OneStop(this, LilySemantics.Spoken(Prefix, Text) ?? Text);
    }
}
