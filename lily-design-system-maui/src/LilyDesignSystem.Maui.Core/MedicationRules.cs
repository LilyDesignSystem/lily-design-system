namespace LilyDesignSystem.Maui.Core;

/// <summary>
/// The rules of medication-view, the twin of Kotlin's and Swift's MedicationRules. The spoken name is the segments joined,
/// one word; no part is ever truncated.
/// </summary>
public static class MedicationRules
{
    /// <summary>The name as plain text: the segments joined when there are any, else the name (an empty list never hides it).</summary>
    public static string? Name(string? name, IReadOnlyList<MedicationNameSegment>? segments) =>
        segments is { Count: > 0 } ? string.Concat(segments.Select(s => s.Text)) : name;

    /// <summary>Everything spoken, in order: label, name, strength, form, route, frequency, then free-text dosage.</summary>
    public static string Spoken(
        string? label,
        string? name,
        IReadOnlyList<MedicationNameSegment>? segments,
        string? strength,
        string? form,
        string? route,
        string? frequency,
        string? dosageText) =>
        LilySemantics.Spoken(label, Name(name, segments), strength, form, route, frequency, dosageText) ?? string.Empty;
}
