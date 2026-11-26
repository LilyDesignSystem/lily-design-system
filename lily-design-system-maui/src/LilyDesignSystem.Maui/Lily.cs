using Microsoft.Maui.Accessibility;
using Microsoft.Maui.Controls;

namespace LilyDesignSystem.Maui;

/// <summary>Speaks a message through the platform screen reader. Replace <see cref="LilyAnnouncer.Current"/> in tests.</summary>
public interface ILilyAnnouncer
{
    /// <summary>Announces <paramref name="text"/> (consumer-supplied, in the app's language).</summary>
    void Announce(string text);
}

/// <summary>
/// The announcer the controls use. MAUI has no live-region property, so a control whose text changes in place (an alert, a
/// badge, a live tag) announces the new text itself, through <see cref="SemanticScreenReader"/>.
/// </summary>
public static class LilyAnnouncer
{
    /// <summary>The announcer in use; the platform screen reader by default.</summary>
    public static ILilyAnnouncer Current { get; set; } = new ScreenReaderAnnouncer();

    private sealed class ScreenReaderAnnouncer : ILilyAnnouncer
    {
        public void Announce(string text) => SemanticScreenReader.Default.Announce(text);
    }
}

/// <summary>Shared helpers for the controls' accessibility tree and style hooks.</summary>
internal static class Lily
{
    /// <summary>Keeps a visible copy out of the screen reader, when its text is already in the control's spoken name.</summary>
    public static T Hidden<T>(T view)
        where T : BindableObject
    {
        AutomationProperties.SetIsInAccessibleTree(view, false);
        return view;
    }

    /// <summary>A label carrying one kebab-case class hook (the web's sub-class, such as <c>alert-heading</c>).</summary>
    public static Label Text(string styleClass, string? text = null) =>
        new() { Text = text, StyleClass = [styleClass], LineBreakMode = LineBreakMode.WordWrap };

    /// <summary>Makes a container one screen-reader stop, named by <paramref name="description"/>.</summary>
    public static void OneStop(VisualElement container, string? description)
    {
        AutomationProperties.SetIsInAccessibleTree(container, true);
        SemanticProperties.SetDescription(container, description);
    }
}
