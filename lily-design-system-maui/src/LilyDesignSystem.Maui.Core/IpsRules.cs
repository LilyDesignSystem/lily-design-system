namespace LilyDesignSystem.Maui.Core;

/// <summary>Where a section says its status: under its heading, or only in the record list it holds.</summary>
public enum IpsStatusPlacement
{
    /// <summary>A status line under the heading.</summary>
    Heading,

    /// <summary>The section's record list says it; no line under the heading.</summary>
    List,
}

/// <summary>The rules of international-patient-summary and its sections, the twins of Kotlin's IpsRules. Lily parses no FHIR.</summary>
public static class IpsRules
{
    /// <summary>Whether a section shows its status line under its heading.</summary>
    /// <param name="status">The section's status (<see cref="IpsSections.Statuses"/>).</param>
    /// <param name="placement">Where the status is said.</param>
    /// <param name="listHoldsAnEntry">
    /// Whether the section's record list holds an entry that counts. "None known" above such a list would contradict it
    /// (HC-C17, tasks.md P50-T29), so the line goes and the list's own conflict words speak.
    /// </param>
    public static bool ShowsStatusLine(string status, IpsStatusPlacement placement, bool listHoldsAnEntry = false) =>
        status != "known" && placement == IpsStatusPlacement.Heading && !(status == "none-known" && listHoldsAnEntry);

    /// <summary>A section's development warnings.</summary>
    public static IReadOnlyList<string> SectionWarnings(
        string heading, string status, string? statusLabel, IpsStatusPlacement placement, bool hasNarrative, string? narrativeLabel)
    {
        var warnings = new List<string>();
        if (string.IsNullOrEmpty(heading)) warnings.Add("InternationalPatientSummarySection: a Heading is required");
        if (!IpsSections.Statuses.Contains(status)) warnings.Add($"InternationalPatientSummarySection: there is no status {status}");
        if (ShowsStatusLine(status, placement) && string.IsNullOrEmpty(statusLabel))
            warnings.Add($"InternationalPatientSummarySection: status {status} needs a StatusLabel");
        if (hasNarrative && string.IsNullOrEmpty(narrativeLabel))
            warnings.Add("InternationalPatientSummarySection: a Narrative needs a NarrativeLabel");
        return warnings;
    }

    /// <summary>The summary's development warnings.</summary>
    public static IReadOnlyList<string> SummaryWarnings(string label, string omittedLabel, IReadOnlyDictionary<string, string> requiredHeadings)
    {
        var warnings = new List<string>();
        if (string.IsNullOrEmpty(label)) warnings.Add("InternationalPatientSummary: a Label is required");
        if (string.IsNullOrEmpty(omittedLabel)) warnings.Add("InternationalPatientSummary: an OmittedLabel is required");
        foreach (var key in IpsSections.Required.Where(k => !requiredHeadings.TryGetValue(k, out var h) || string.IsNullOrEmpty(h)))
            warnings.Add($"InternationalPatientSummary: RequiredHeadings needs {key}");
        return warnings;
    }
}
