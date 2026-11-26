using Microsoft.Maui.Controls;

namespace LilyDesignSystem.Maui;

/// <summary>
/// Disclosure (components/details, where MAUI has no disclosure): a native button named by its label that shows or hides its
/// content. MAUI has no expanded-state semantics, so the state is not spoken by Lily; if it matters, put it in the label
/// (the app's words, "Show details" / "Hide details") through <see cref="OpenLabel"/>. Style hooks: <c>details</c>,
/// <c>details-summary</c>, <c>details-content</c>.
/// </summary>
public class Disclosure : VerticalStackLayout
{
    /// <summary>The toggle's words, in the app's language.</summary>
    public static readonly BindableProperty LabelProperty = BindableProperty.Create(
        nameof(Label), typeof(string), typeof(Disclosure), string.Empty, propertyChanged: (b, _, _) => ((Disclosure)b).Update());

    /// <summary>The toggle's words while open, when they differ ("Hide details"); the label when not set.</summary>
    public static readonly BindableProperty OpenLabelProperty = BindableProperty.Create(
        nameof(OpenLabel), typeof(string), typeof(Disclosure), null, propertyChanged: (b, _, _) => ((Disclosure)b).Update());

    /// <summary>Whether the content is shown.</summary>
    public static readonly BindableProperty IsOpenProperty = BindableProperty.Create(
        nameof(IsOpen), typeof(bool), typeof(Disclosure), false, BindingMode.TwoWay, propertyChanged: (b, _, _) => ((Disclosure)b).Update());

    /// <summary>The content, shown while open.</summary>
    public static readonly BindableProperty BodyProperty = BindableProperty.Create(
        nameof(Body), typeof(View), typeof(Disclosure), null, propertyChanged: (b, o, n) => ((Disclosure)b).SetBody(o as View, n as View));

    private readonly Button toggle = new() { StyleClass = ["details-summary"], LineBreakMode = LineBreakMode.WordWrap };

    /// <summary>Creates a closed disclosure.</summary>
    public Disclosure()
    {
        StyleClass = ["details"];
        toggle.Clicked += (_, _) => IsOpen = !IsOpen;
        Children.Add(toggle);
        Update();
    }

    /// <inheritdoc cref="LabelProperty"/>
    public string Label { get => (string)GetValue(LabelProperty); set => SetValue(LabelProperty, value); }

    /// <inheritdoc cref="OpenLabelProperty"/>
    public string? OpenLabel { get => (string?)GetValue(OpenLabelProperty); set => SetValue(OpenLabelProperty, value); }

    /// <inheritdoc cref="IsOpenProperty"/>
    public bool IsOpen { get => (bool)GetValue(IsOpenProperty); set => SetValue(IsOpenProperty, value); }

    /// <inheritdoc cref="BodyProperty"/>
    public View? Body { get => (View?)GetValue(BodyProperty); set => SetValue(BodyProperty, value); }

    /// <summary>The toggle button, for tests and for the app's focus handling.</summary>
    public Button Toggle => toggle;

    private void SetBody(View? old, View? body)
    {
        if (old is not null) Children.Remove(old);
        if (body is null) return;
        body.StyleClass = [.. body.StyleClass ?? [], "details-content"];
        Children.Add(body);
        Update();
    }

    private void Update()
    {
        toggle.Text = IsOpen && !string.IsNullOrEmpty(OpenLabel) ? OpenLabel : Label;
        if (Body is not null) Body.IsVisible = IsOpen;
    }
}
