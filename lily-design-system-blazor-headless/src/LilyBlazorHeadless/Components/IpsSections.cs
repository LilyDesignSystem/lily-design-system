namespace LilyBlazorHeadless.Components;

/// <summary>One section the consumer renders, as plain data: InternationalPatientSummary builds its contents from these.</summary>
public record IpsSectionEntry(string Key, string Heading, string Status = "known", string? Id = null);

/// <summary>An entry in an International Patient Summary's contents; Added marks a missing required section the root added.</summary>
public record IpsContentsEntry(string Key, string Heading, string Status, string Id, string? Code, bool Required, bool Added);

/// <summary>
/// The International Patient Summary section registry (spec/healthcare-ui), a port of shared/ips-sections.ts: the sixteen IPS
/// 2.0.1 Composition sections with their LOINC codes and levels, and the rule that adds an omitted entry for each missing
/// required section, in registry order. No FHIR parsing and no words.
/// </summary>
public static class IpsSections
{
    /// <summary>Key, LOINC code and level ("required", "recommended", "optional"), in the IG's order.</summary>
    public static readonly IReadOnlyList<(string Key, string Code, string Level)> All =
    [
        ("medications", "10160-0", "required"),
        ("allergies", "48765-2", "required"),
        ("problems", "11450-4", "required"),
        ("immunizations", "11369-6", "recommended"),
        ("results", "30954-2", "recommended"),
        ("procedures", "47519-4", "recommended"),
        ("devices", "46264-8", "recommended"),
        ("vital-signs", "8716-3", "optional"),
        ("past-illness", "11348-0", "optional"),
        ("functional-status", "47420-5", "optional"),
        ("plan-of-care", "18776-5", "optional"),
        ("social-history", "29762-2", "optional"),
        ("pregnancy", "10162-6", "optional"),
        ("advance-directives", "42348-3", "optional"),
        ("alerts", "104605-1", "optional"),
        ("patient-story", "81338-6", "optional"),
    ];

    public static readonly IReadOnlyList<string> Required = All.Where(s => s.Level == "required").Select(s => s.Key).ToList();

    public static string? Code(string key) => All.Where(s => s.Key == key).Select(s => s.Code).FirstOrDefault();

    public static bool IsRequired(string key) => Required.Contains(key);

    public static string Id(string key, string? id = null) => string.IsNullOrEmpty(id) ? $"international-patient-summary-{key}" : id;

    public static IReadOnlyList<string> MissingRequired(IEnumerable<IpsSectionEntry> sections)
    {
        var present = sections.Select(s => s.Key).ToHashSet();
        return Required.Where(k => !present.Contains(k)).ToList();
    }

    public static IReadOnlyList<IpsContentsEntry> Contents(
        IEnumerable<IpsSectionEntry> sections, IReadOnlyDictionary<string, string> requiredHeadings)
    {
        var list = sections.ToList();
        var given = list.Select(s => new IpsContentsEntry(
            s.Key, s.Heading, string.IsNullOrEmpty(s.Status) ? "known" : s.Status, Id(s.Key, s.Id), Code(s.Key), IsRequired(s.Key), false));
        var added = MissingRequired(list).Select(k => new IpsContentsEntry(
            k, requiredHeadings.TryGetValue(k, out var h) ? h : "", "omitted", Id(k), Code(k), true, true));
        return given.Concat(added).ToList();
    }
}
