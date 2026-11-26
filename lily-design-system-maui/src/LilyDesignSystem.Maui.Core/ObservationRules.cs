namespace LilyDesignSystem.Maui.Core;

/// <summary>A FHIR Observation status, or one of Lily's absences.</summary>
public enum ObservationStatus
{
    /// <summary>final</summary>
    Final,
    /// <summary>registered</summary>
    Registered,
    /// <summary>unknown</summary>
    Unknown,
    /// <summary>preliminary</summary>
    Preliminary,
    /// <summary>amended</summary>
    Amended,
    /// <summary>corrected</summary>
    Corrected,
    /// <summary>entered-in-error</summary>
    EnteredInError,
    /// <summary>cancelled</summary>
    Cancelled,
    /// <summary>masked</summary>
    Masked,
    /// <summary>not-recorded</summary>
    NotRecorded,
    /// <summary>unavailable</summary>
    Unavailable,
    /// <summary>not-applicable</summary>
    NotApplicable,
}

/// <summary>A further named reference range ("Critical", "below 2.5").</summary>
/// <param name="Label">The range's name, in the app's language.</param>
/// <param name="Text">The range as text.</param>
public sealed record NamedRange(string Label, string Text);

/// <summary>
/// The rules of observation-view, the twin of Kotlin's and Swift's ObservationRules. They decide what is shown and spoken,
/// never what a result means: no interpretation is inferred from a range, and the flag is the app's words, never colour alone.
/// </summary>
public static class ObservationRules
{
    /// <summary>The no-break space that joins a value to its unit.</summary>
    public const string NoBreakSpace = "\u00A0";

    /// <summary>The status as FHIR writes it (<c>entered-in-error</c>).</summary>
    public static string Key(ObservationStatus status) => status switch
    {
        ObservationStatus.EnteredInError => "entered-in-error",
        ObservationStatus.NotRecorded => "not-recorded",
        ObservationStatus.NotApplicable => "not-applicable",
        _ => status.ToString().ToLowerInvariant(),
    };

    /// <summary>A missing result shows its status words instead of a value, so it is never blank or a dash.</summary>
    public static bool StatusReplacesValue(ObservationStatus status) => status is ObservationStatus.Registered
        or ObservationStatus.Cancelled or ObservationStatus.Masked or ObservationStatus.NotRecorded
        or ObservationStatus.Unavailable or ObservationStatus.NotApplicable;

    /// <summary>An entered-in-error result: its value, when shown at all, is a former one, with no flag, range or meter.</summary>
    public static bool IsWithdrawn(ObservationStatus status) => status == ObservationStatus.EnteredInError;

    /// <summary>Any status but final is shown, beside the value or instead of it.</summary>
    public static bool ShowsStatus(ObservationStatus status) => status != ObservationStatus.Final;

    /// <summary>
    /// Whether nothing of the result but its status words is shown or spoken: a missing result, one with no words for a status
    /// that is not final, and an entered-in-error one, whose former value an authorised history view shows with showWithdrawn.
    /// </summary>
    public static bool Withholds(ObservationStatus status, string? statusLabel, bool showWithdrawn = false) =>
        StatusReplacesValue(status) || (ShowsStatus(status) && !ClinicalFormat.HasWords(statusLabel)) ||
        (IsWithdrawn(status) && !showWithdrawn);

    /// <summary>Whether a FHIR v3 ObservationInterpretation code is a flag (anything but normal). No code is never a flag.</summary>
    public static bool IsFlagged(string? interpretation) => !string.IsNullOrEmpty(interpretation) && interpretation != "N";

    /// <summary>The development warnings for a set of properties, in English for the developer (never shown to the user).</summary>
    public static IReadOnlyList<string> Warnings(
        string? interpretation, string? flagLabel, ObservationStatus status, string? statusLabel, string? previousValue, string? previousLabel)
    {
        var warnings = new List<string>();
        if (IsFlagged(interpretation) && string.IsNullOrEmpty(flagLabel))
            warnings.Add($"ObservationView: interpretation {interpretation} needs a FlagLabel, or the flag is colour alone");
        if (ShowsStatus(status) && !ClinicalFormat.HasWords(statusLabel))
            warnings.Add($"ObservationView: status {Key(status)} needs a StatusLabel");
        if (previousValue is not null && string.IsNullOrEmpty(previousLabel))
            warnings.Add("ObservationView: PreviousValue needs a PreviousLabel, since the change may not be announced");
        return warnings;
    }

    /// <summary>The value and unit joined by a no-break space; null when the status replaces it.</summary>
    public static string? ShownValue(string? value, string? unit, ObservationStatus status) =>
        StatusReplacesValue(status) || string.IsNullOrEmpty(value) ? null
        : string.IsNullOrEmpty(unit) ? value
        : value + NoBreakSpace + unit;

    /// <summary>Everything spoken, in reading order, joined by line breaks; Lily adds no words.</summary>
    public static string Spoken(
        string? label,
        string? value,
        string? unit,
        string? flagLabel,
        string? interpretation,
        string? range,
        IReadOnlyList<NamedRange>? ranges,
        ObservationStatus status,
        string? statusLabel,
        string? previousLabel,
        bool showWithdrawn = false)
    {
        var pieces = new List<string?> { label };
        if (Withholds(status, statusLabel, showWithdrawn) || IsWithdrawn(status))
        {
            pieces.Add(statusLabel);
            // The words first, so a former value is never heard as a current one.
            if (!Withholds(status, statusLabel, showWithdrawn)) pieces.Add(ShownValue(value, unit, status));
            return LilySemantics.Spoken([.. pieces]) ?? string.Empty;
        }
        pieces.Add(ShownValue(value, unit, status));
        if (IsFlagged(interpretation)) pieces.Add(flagLabel);
        pieces.Add(range);
        foreach (var r in ranges ?? []) pieces.Add(r.Label + NoBreakSpace + r.Text);
        if (ShowsStatus(status)) pieces.Add(statusLabel);
        pieces.Add(previousLabel);
        return LilySemantics.Spoken([.. pieces]) ?? string.Empty;
    }
}
