using System.Diagnostics;

namespace LilyDesignSystem.Maui;

/// <summary>Development warnings, for the developer, never shown to the user (the web's dev-warning).</summary>
public static class LilyWarnings
{
    /// <summary>Set false to silence them, as <c>globalThis.lilyWarnings = false</c> does on the web.</summary>
    public static bool Enabled { get; set; } = true;

    /// <summary>Where warnings go; <see cref="Trace"/> by default. Replace it in tests.</summary>
    public static Action<string> Sink { get; set; } = message => Trace.TraceWarning("Lily: " + message);

    internal static void Warn(IEnumerable<string> messages)
    {
        if (!Enabled) return;
        foreach (var message in messages) Sink(message);
    }
}
