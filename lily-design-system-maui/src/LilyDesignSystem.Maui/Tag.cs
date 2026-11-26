using LilyDesignSystem.Maui.Core;
using Microsoft.Maui.Controls;

namespace LilyDesignSystem.Maui;

/// <summary>
/// Tag (components/tag): a label on an item ("High", "Draft"). The required <see cref="Label"/> gives the context the
/// visible text lacks, spoken after it. With <see cref="Live"/>, the label is spoken first and a change of the text, its
/// state, is announced. Style hook: <c>tag</c>.
/// </summary>
public class Tag : Microsoft.Maui.Controls.Label
{
    /// <summary>The context, in the app's language; spoken after the text, or before it when <see cref="Live"/>. Required.</summary>
    public static readonly BindableProperty LabelProperty = BindableProperty.Create(
        nameof(Label), typeof(string), typeof(Tag), string.Empty, propertyChanged: (b, _, _) => ((Tag)b).Describe());

    /// <summary>Announce changes of the text, for a tag whose text changes in place.</summary>
    public static readonly BindableProperty LiveProperty = BindableProperty.Create(
        nameof(Live), typeof(bool), typeof(Tag), false, propertyChanged: (b, _, _) => ((Tag)b).Describe());

    /// <summary>Creates a tag; set the text and <see cref="Label"/>.</summary>
    public Tag()
    {
        StyleClass = ["tag"];
        PropertyChanged += (_, e) =>
        {
            if (e.PropertyName != TextProperty.PropertyName) return;
            Describe();
            if (Live && IsLoaded && !string.IsNullOrEmpty(Text)) LilyAnnouncer.Current.Announce(Spoken);
        };
        Describe();
    }

    /// <inheritdoc cref="LabelProperty"/>
    public string Label { get => (string)GetValue(LabelProperty); set => SetValue(LabelProperty, value); }

    /// <inheritdoc cref="LiveProperty"/>
    public bool Live { get => (bool)GetValue(LiveProperty); set => SetValue(LiveProperty, value); }

    private string Spoken => LilySemantics.TagLabel(Text ?? string.Empty, Label, Live);

    private void Describe() => SemanticProperties.SetDescription(this, Spoken);
}
