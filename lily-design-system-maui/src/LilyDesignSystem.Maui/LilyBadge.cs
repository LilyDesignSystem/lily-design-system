using LilyDesignSystem.Maui.Core;
using Microsoft.Maui.Controls;

namespace LilyDesignSystem.Maui;

/// <summary>The badge's variant, for the consumer's styling; never spoken.</summary>
public enum BadgeKind
{
    /// <summary>Default.</summary>
    Default,

    /// <summary>Information.</summary>
    Info,

    /// <summary>Success.</summary>
    Success,

    /// <summary>Warning.</summary>
    Warning,

    /// <summary>Error.</summary>
    Error,
}

/// <summary>
/// LilyBadge (components/badge): a short status, the web's <c>role="status"</c>: a change of its text is announced politely.
/// <see cref="Label"/> replaces the spoken text when the text alone lacks context ("3" becomes "3 unread messages").
/// Style hook: <c>badge</c>.
/// </summary>
public class LilyBadge : Label
{
    /// <summary>Spoken instead of the text when the text alone lacks context, in the app's language.</summary>
    public static readonly BindableProperty LabelProperty = BindableProperty.Create(
        nameof(Label), typeof(string), typeof(LilyBadge), null, propertyChanged: (b, _, _) => ((LilyBadge)b).Describe());

    /// <summary>The variant, for styling.</summary>
    public static readonly BindableProperty KindProperty = BindableProperty.Create(
        nameof(Kind), typeof(BadgeKind), typeof(LilyBadge), BadgeKind.Default);

    /// <summary>Creates a badge; set <see cref="Microsoft.Maui.Controls.Label.Text"/>.</summary>
    public LilyBadge()
    {
        StyleClass = ["badge"];
        PropertyChanged += (_, e) =>
        {
            if (e.PropertyName != TextProperty.PropertyName) return;
            Describe();
            if (IsLoaded && !string.IsNullOrEmpty(Text)) LilyAnnouncer.Current.Announce(LilySemantics.BadgeLabel(Text, Label));
        };
        Describe();
    }

    /// <inheritdoc cref="LabelProperty"/>
    public string? Label { get => (string?)GetValue(LabelProperty); set => SetValue(LabelProperty, value); }

    /// <inheritdoc cref="KindProperty"/>
    public BadgeKind Kind { get => (BadgeKind)GetValue(KindProperty); set => SetValue(KindProperty, value); }

    private void Describe() => SemanticProperties.SetDescription(this, LilySemantics.BadgeLabel(Text ?? string.Empty, Label));
}
