namespace LilyBlazorHeadless.Components;

/// <summary>One section the consumer renders, as plain data: InternationalPatientSummary builds its contents from these.</summary>
public record IpsSectionEntry(string Key, string Heading, string Status = "known", string? Id = null);

/// <summary>An entry in an International Patient Summary's contents; Added marks a missing required section the root added.</summary>
public record IpsContentsEntry(string Key, string Heading, string Status, string Id, string? Code, bool Required, bool Added);

/// <summary>Thrown by <see cref="IpsSections"/> for an empty key, id or id prefix, an unknown status, or a missing required heading;
/// <see cref="Reason"/> is key, id, idPrefix, status or heading. Invalid data is an error, never a default.</summary>
public sealed class IpsSectionsException(string reason, string paramName, object? actualValue, string message)
    : ArgumentOutOfRangeException(paramName, actualValue, $"IpsSections: {message}")
{
    public string Reason { get; } = reason;
}

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

    /// <summary>A section's level in the IPS ("required", "recommended" or "optional"), or null for a key that is not an IPS section.</summary>
    public static string? Level(string key) => All.Where(s => s.Key == key).Select(s => s.Level).FirstOrDefault();

    /// <summary>The default id prefix; give each summary on a page its own.</summary>
    public const string IdPrefix = "international-patient-summary";

    /// <summary>The statuses a section may have.</summary>
    public static readonly IReadOnlyList<string> Statuses = ["known", "none-known", "not-recorded", "unavailable", "omitted"];

    /// <summary><paramref name="id"/> when given, else {idPrefix}-{key} (idPrefix <see cref="IdPrefix"/> when not given). An empty
    /// key, id or idPrefix throws an <see cref="IpsSectionsException"/>.</summary>
    public static string Id(string key, string? id = null, string? idPrefix = null)
    {
        if (key == "") throw new IpsSectionsException("key", nameof(key), key, "the section key is empty");
        if (id == "") throw new IpsSectionsException("id", nameof(id), id, $"the id of section {key} is empty");
        if (idPrefix == "") throw new IpsSectionsException("idPrefix", nameof(idPrefix), idPrefix, "the id prefix is empty");
        return id ?? $"{idPrefix ?? IdPrefix}-{key}";
    }

    public static IReadOnlyList<string> MissingRequired(IEnumerable<IpsSectionEntry> sections)
    {
        var present = sections.Select(s => s.Key).ToHashSet();
        return Required.Where(k => !present.Contains(k)).ToList();
    }

    public static IReadOnlyList<IpsContentsEntry> Contents(
        IEnumerable<IpsSectionEntry> sections, IReadOnlyDictionary<string, string> requiredHeadings, string? idPrefix = null)
    {
        var list = sections.ToList();
        var given = list.Select(s => new IpsContentsEntry(
            s.Key, s.Heading, CheckedStatus(s), Id(s.Key, s.Id, idPrefix), Code(s.Key), IsRequired(s.Key), false));
        var added = MissingRequired(list).Select(k => new IpsContentsEntry(
            k, RequiredHeading(requiredHeadings, k), "omitted", Id(k, null, idPrefix), Code(k), true, true));
        return given.Concat(added).ToList();
    }

    private static string CheckedStatus(IpsSectionEntry s) => Statuses.Contains(s.Status)
        ? s.Status
        : throw new IpsSectionsException("status", nameof(s.Status), s.Status, $"section {s.Key} has no such status: {s.Status}");

    private static string RequiredHeading(IReadOnlyDictionary<string, string> requiredHeadings, string key)
    {
        if (requiredHeadings.TryGetValue(key, out var heading) && heading != "") return heading;
        throw new IpsSectionsException("heading", nameof(requiredHeadings), key, $"the required section {key} is missing and has no heading");
    }
}
