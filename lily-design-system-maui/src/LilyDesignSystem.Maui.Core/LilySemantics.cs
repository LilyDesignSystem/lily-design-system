namespace LilyDesignSystem.Maui.Core;

/// <summary>How urgently a message is announced: the mobile form of <c>aria-live</c> (mobile/semantics.tsv).</summary>
public enum Politeness
{
    /// <summary>Interrupts: <c>role="alert"</c>. Use only where the web uses it.</summary>
    Assertive,

    /// <summary>Waits for current speech: <c>role="status"</c>.</summary>
    Polite,

    /// <summary>Not announced.</summary>
    Off,
}

/// <summary>
/// The accessibility decisions of the LilyDesignSystem.Maui controls, as pure functions, so they are tested without a
/// device. The controls apply them with <c>SemanticProperties</c> and <c>AutomationProperties</c>. The same decisions
/// as Kotlin's <c>LilySemantics</c> and Swift's <c>Semantics</c> (spec/dotnet-maui).
/// </summary>
public static class LilySemantics
{
    /// <summary>
    /// Joins consumer-supplied pieces of spoken text with a line break, which TalkBack, VoiceOver and Narrator read as a
    /// pause in every language. Lily adds no words or punctuation of its own. Empty pieces are dropped; nothing left is null.
    /// </summary>
    public static string? Spoken(params string?[] pieces)
    {
        var kept = pieces.Where(p => !string.IsNullOrEmpty(p)).ToArray();
        return kept.Length == 0 ? null : string.Join("\n", kept);
    }

    /// <summary>
    /// A field's spoken name: its label, then its description, then the consumer's word for "required" when it is
    /// required, then the error. MAUI has no error semantics, so the error is part of the name and is announced when set.
    /// </summary>
    public static string FieldDescription(string label, string? description, bool required, string? requiredLabel, string? error) =>
        Spoken(label, description, required ? requiredLabel : null, error) ?? label;

    /// <summary>A badge's spoken name: the label when given, else the visible text.</summary>
    public static string BadgeLabel(string text, string? label) => string.IsNullOrEmpty(label) ? text : label;

    /// <summary>A tag's spoken name: the text then the label, or, when live, the label then the text (its state).</summary>
    public static string TagLabel(string text, string label, bool live) =>
        (live ? Spoken(label, text) : Spoken(text, label)) ?? text;
}
