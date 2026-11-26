namespace LilyDesignSystem.Maui.Tests;

/// <summary>Records what the controls announce, in place of the platform screen reader.</summary>
public sealed class RecordingAnnouncer : ILilyAnnouncer
{
    public List<string> Spoken { get; } = [];

    public void Announce(string text) => Spoken.Add(text);
}
