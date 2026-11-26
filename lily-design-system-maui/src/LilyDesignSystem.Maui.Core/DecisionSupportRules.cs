namespace LilyDesignSystem.Maui.Core;

/// <summary>A decision support card's urgency (CDS Hooks <c>indicator</c>); for styling, always shown in words.</summary>
public enum DecisionSupportIndicator
{
    /// <summary>info</summary>
    Info,
    /// <summary>warning</summary>
    Warning,
    /// <summary>critical</summary>
    Critical,
}

/// <summary>What pressing dismiss does: dismissed with the chosen reason (null when none are offered), or refused.</summary>
/// <param name="Dismissed">Whether the card is dismissed.</param>
/// <param name="Reason">The chosen reason's code, when dismissed with one.</param>
public readonly record struct DismissOutcome(bool Dismissed, string? Reason);

/// <summary>The rules of decision-support-card and early-warning-score-view, the twins of Kotlin's. Lily computes nothing.</summary>
public static class DecisionSupportRules
{
    /// <summary>The card's spoken name: the label, else the summary.</summary>
    public static string Name(string? label, string summary) => string.IsNullOrEmpty(label) ? summary : label;

    /// <summary>Which card this is: the app's id (the CDS Hooks uuid with the patient's id), else what it says.</summary>
    public static string Identity(string? cardId, string summary, DecisionSupportIndicator indicator, string sourceLabel) =>
        cardId ?? string.Join("|", summary, indicator, sourceLabel);

    /// <summary>Whether a dismissal goes ahead: the chosen reason must be one this card offers.</summary>
    public static DismissOutcome Dismiss(IReadOnlyCollection<string> offered, string? chosen) =>
        offered.Count == 0 ? new(true, null)
        : chosen is null || !offered.Contains(chosen) ? new(false, null)
        : new(true, chosen);

    /// <summary>The card's development warnings, in English for the developer.</summary>
    public static IReadOnlyList<string> Warnings(string summary, string indicatorLabel, string sourceLabel, bool reasonsOffered, string? overrideReasonLabel)
    {
        var warnings = new List<string>();
        if (reasonsOffered && string.IsNullOrEmpty(overrideReasonLabel))
            warnings.Add("DecisionSupportCard: OverrideReasons need an OverrideReasonLabel to name the group");
        if (summary.Length > 140) warnings.Add("DecisionSupportCard: CDS Hooks keeps a summary under 140 characters");
        if (string.IsNullOrEmpty(indicatorLabel)) warnings.Add("DecisionSupportCard: an IndicatorLabel is required, or urgency is colour alone");
        if (string.IsNullOrEmpty(sourceLabel)) warnings.Add("DecisionSupportCard: a SourceLabel is required");
        return warnings;
    }

    /// <summary>An early warning score's warning: a band key needs its words.</summary>
    public static IReadOnlyList<string> ScoreWarnings(string? band, string? bandLabel) =>
        !string.IsNullOrEmpty(band) && string.IsNullOrEmpty(bandLabel)
            ? [$"EarlyWarningScoreView: band {band} needs a BandLabel, or the band is colour alone"]
            : [];

    /// <summary>An early warning score, spoken in order: label, system, score, band, escalation.</summary>
    public static string ScoreSpoken(string? label, string? system, string score, string? bandLabel, string? escalation) =>
        LilySemantics.Spoken(label, system, score, bandLabel, escalation) ?? score;
}
