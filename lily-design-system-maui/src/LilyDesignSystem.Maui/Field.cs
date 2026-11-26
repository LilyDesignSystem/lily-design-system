using LilyDesignSystem.Maui.Core;
using Microsoft.Maui.Controls;

namespace LilyDesignSystem.Maui;

/// <summary>
/// Field (components/field): a label, a description, the app's control and an error. On the web the label is linked with
/// <c>for</c>/<c>id</c>; MAUI has no ids for this, so Field gives the control its spoken name (label, description, the
/// consumer's word for "required", then the error) and hides the visible copies, so the screen reader stops once, on the
/// control. A new error is announced. Style hooks: <c>field</c>, <c>field-label</c>, <c>field-required</c>,
/// <c>field-description</c>, <c>field-error</c>.
/// </summary>
public class Field : VerticalStackLayout
{
    /// <summary>The visible label, in the app's language; also the control's spoken name.</summary>
    public static readonly BindableProperty LabelProperty = Create(nameof(Label), typeof(string), string.Empty);

    /// <summary>Help text, spoken after the label.</summary>
    public static readonly BindableProperty DescriptionProperty = Create(nameof(Description), typeof(string), null);

    /// <summary>The error, in the app's language; shown, spoken last, and announced when it is set.</summary>
    public static readonly BindableProperty ErrorProperty = Create(nameof(Error), typeof(string), null, announce: true);

    /// <summary>Shows the required mark (hidden from the screen reader).</summary>
    public static readonly BindableProperty RequiredProperty = Create(nameof(Required), typeof(bool), false);

    /// <summary>The word spoken for a required field ("required"); without it the screen reader does not say so.</summary>
    public static readonly BindableProperty RequiredLabelProperty = Create(nameof(RequiredLabel), typeof(string), null);

    /// <summary>The visible required mark; "*" unless the app gives another.</summary>
    public static readonly BindableProperty RequiredMarkProperty = Create(nameof(RequiredMark), typeof(string), "*");

    /// <summary>The app's control (an Entry, an Editor, a Picker).</summary>
    public static readonly BindableProperty ControlProperty = BindableProperty.Create(
        nameof(Control), typeof(View), typeof(Field), null, propertyChanged: (b, o, n) => ((Field)b).SetControl(o as View, n as View));

    private readonly Label label = Lily.Hidden(Lily.Text("field-label"));
    private readonly Label requiredMark = Lily.Hidden(Lily.Text("field-required"));
    private readonly Label description = Lily.Hidden(Lily.Text("field-description"));
    private readonly Label error = Lily.Hidden(Lily.Text("field-error"));

    /// <summary>Creates a field; set <see cref="Label"/> and <see cref="Control"/>.</summary>
    public Field()
    {
        StyleClass = ["field"];
        Children.Add(Lily.Hidden(new HorizontalStackLayout { Children = { label, requiredMark } }));
        Children.Add(description);
        Children.Add(error);
        Update(announce: false);
    }

    /// <inheritdoc cref="LabelProperty"/>
    public string Label { get => (string)GetValue(LabelProperty); set => SetValue(LabelProperty, value); }

    /// <inheritdoc cref="DescriptionProperty"/>
    public string? Description { get => (string?)GetValue(DescriptionProperty); set => SetValue(DescriptionProperty, value); }

    /// <inheritdoc cref="ErrorProperty"/>
    public string? Error { get => (string?)GetValue(ErrorProperty); set => SetValue(ErrorProperty, value); }

    /// <inheritdoc cref="RequiredProperty"/>
    public bool Required { get => (bool)GetValue(RequiredProperty); set => SetValue(RequiredProperty, value); }

    /// <inheritdoc cref="RequiredLabelProperty"/>
    public string? RequiredLabel { get => (string?)GetValue(RequiredLabelProperty); set => SetValue(RequiredLabelProperty, value); }

    /// <inheritdoc cref="RequiredMarkProperty"/>
    public string RequiredMark { get => (string)GetValue(RequiredMarkProperty); set => SetValue(RequiredMarkProperty, value); }

    /// <inheritdoc cref="ControlProperty"/>
    public View? Control { get => (View?)GetValue(ControlProperty); set => SetValue(ControlProperty, value); }

    /// <summary>The control's spoken name.</summary>
    public string SpokenName => LilySemantics.FieldDescription(Label, Description, Required, RequiredLabel, Error);

    private static BindableProperty Create(string name, Type type, object? initial, bool announce = false) =>
        BindableProperty.Create(name, type, typeof(Field), initial, propertyChanged: (b, _, _) => ((Field)b).Update(announce));

    private void SetControl(View? old, View? control)
    {
        if (old is not null) Children.Remove(old);
        if (control is not null) Children.Add(control);
        Update(announce: false);
    }

    private void Update(bool announce)
    {
        label.Text = Label;
        requiredMark.Text = RequiredMark;
        requiredMark.IsVisible = Required;
        description.Text = Description;
        description.IsVisible = !string.IsNullOrEmpty(Description);
        error.Text = Error;
        error.IsVisible = !string.IsNullOrEmpty(Error);
        if (Control is not null) SemanticProperties.SetDescription(Control, SpokenName);
        if (announce && IsLoaded && !string.IsNullOrEmpty(Error)) LilyAnnouncer.Current.Announce(Error);
    }
}
