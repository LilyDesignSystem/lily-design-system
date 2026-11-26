using LilyDesignSystem.Maui.Core;
using Microsoft.Maui.Controls;

namespace LilyDesignSystem.Maui;

/// <summary>The alert's severity, for the consumer's styling (the web's <c>data-type</c>); never spoken by Lily.</summary>
public enum AlertKind
{
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
/// LilyAlert (components/alert): a message with a severity, the mobile form of <c>role="alert"</c> / <c>role="status"</c>.
/// One screen-reader stop, heading then message. It announces its message when it appears and when the message changes,
/// assertively by default. The severity is never spoken: say it in the heading or the message if it matters.
/// Style hooks: <c>alert</c>, <c>alert-heading</c>, <c>alert-message</c>; style by <see cref="Kind"/> with a DataTrigger.
/// </summary>
public class LilyAlert : VerticalStackLayout
{
    /// <summary>The message, in the app's language.</summary>
    public static readonly BindableProperty MessageProperty = BindableProperty.Create(
        nameof(Message), typeof(string), typeof(LilyAlert), string.Empty, propertyChanged: (b, _, _) => ((LilyAlert)b).Update(announce: true));

    /// <summary>An optional heading, in the app's language.</summary>
    public static readonly BindableProperty HeadingProperty = BindableProperty.Create(
        nameof(Heading), typeof(string), typeof(LilyAlert), null, propertyChanged: (b, _, _) => ((LilyAlert)b).Update(announce: false));

    /// <summary>The severity, for styling.</summary>
    public static readonly BindableProperty KindProperty = BindableProperty.Create(
        nameof(Kind), typeof(AlertKind), typeof(LilyAlert), AlertKind.Info);

    /// <summary>How the message is announced; <see cref="Politeness.Assertive"/> by default, as <c>role="alert"</c>.</summary>
    public static readonly BindableProperty PolitenessProperty = BindableProperty.Create(
        nameof(Politeness), typeof(Politeness), typeof(LilyAlert), Politeness.Assertive);

    private readonly Label heading = Lily.Hidden(Lily.Text("alert-heading"));
    private readonly Label message = Lily.Hidden(Lily.Text("alert-message"));
    private bool loaded;

    /// <summary>Creates an empty alert; set <see cref="Message"/>.</summary>
    public LilyAlert()
    {
        StyleClass = ["alert"];
        Children.Add(heading);
        Children.Add(message);
        Update(announce: false);
        Loaded += (_, _) =>
        {
            loaded = true;
            Announce();
        };
        Unloaded += (_, _) => loaded = false;
    }

    /// <inheritdoc cref="MessageProperty"/>
    public string Message { get => (string)GetValue(MessageProperty); set => SetValue(MessageProperty, value); }

    /// <inheritdoc cref="HeadingProperty"/>
    public string? Heading { get => (string?)GetValue(HeadingProperty); set => SetValue(HeadingProperty, value); }

    /// <inheritdoc cref="KindProperty"/>
    public AlertKind Kind { get => (AlertKind)GetValue(KindProperty); set => SetValue(KindProperty, value); }

    /// <inheritdoc cref="PolitenessProperty"/>
    public Politeness Politeness { get => (Politeness)GetValue(PolitenessProperty); set => SetValue(PolitenessProperty, value); }

    private void Update(bool announce)
    {
        heading.Text = Heading;
        heading.IsVisible = !string.IsNullOrEmpty(Heading);
        message.Text = Message;
        Lily.OneStop(this, LilySemantics.Spoken(Heading, Message));
        if (announce && loaded) Announce();
    }

    private void Announce()
    {
        if (Politeness == Politeness.Off) return;
        var spoken = LilySemantics.Spoken(Heading, Message);
        if (spoken is not null) LilyAnnouncer.Current.Announce(spoken);
    }

    /// <summary>For tests: behave as if the alert had been added to a loaded page.</summary>
    internal void SimulateLoaded()
    {
        loaded = true;
        Announce();
    }
}
