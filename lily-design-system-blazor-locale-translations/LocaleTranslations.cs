// The locale label packs and the Unicode CLDR time zone name packs, embedded. See index.md.
//
//     var pack = LabelPack.FromJson(LocaleTranslations.Json("cy-001"));   // LabelPack is in the data-grid package
//
// Every pack is a flat entry; whether a native speaker has read it is the pack's own "reviewed" flag, not where it lives.

using System.Reflection;
using System.Text.Json.Nodes;

namespace LilyDesignSystem.Blazor.LocaleTranslations;

public static class LocaleTranslations
{
    private const string Prefix = "LocaleTranslations.";
    private const string Suffix = ".json";

    /// <summary>The locale tags of every embedded pack, sorted (<c>ar-001</c> … <c>zh-001</c>).</summary>
    public static IReadOnlyList<string> Locales { get; } =
        typeof(LocaleTranslations).Assembly.GetManifestResourceNames()
            .Where(n => n.StartsWith(Prefix, StringComparison.Ordinal) && n.EndsWith(Suffix, StringComparison.Ordinal))
            .Select(n => n[Prefix.Length..^Suffix.Length])
            .OrderBy(n => n, StringComparer.Ordinal)
            .ToArray();

    /// <summary>The pack's JSON text. Throws <see cref="ArgumentException"/> for a locale with no pack.</summary>
    public static string Json(string locale)
    {
        using var stream = typeof(LocaleTranslations).Assembly.GetManifestResourceStream(Prefix + locale + Suffix)
            ?? throw new ArgumentException($"There is no label pack for {locale}.", nameof(locale));
        using var reader = new StreamReader(stream);
        return reader.ReadToEnd();
    }

    /// <summary>The language's name in itself, for example <c>Cymraeg</c>.</summary>
    public static string Endonym(string locale) => (string?)Parse(locale)["endonym"] ?? "";

    /// <summary>The language's name in <paramref name="inLocale"/>'s language, or null when the pack has none (Bhojpuri).</summary>
    public static string? Exonym(string locale, string inLocale) => (string?)(Parse(locale)["exonyms"] as JsonObject)?[inLocale];

    /// <summary>Has a native speaker checked the pack?</summary>
    public static bool Reviewed(string locale) => (bool?)Parse(locale)["reviewed"] ?? false;

    // -----------------------------------------------------------------
    // Time zone names (Unicode CLDR). One pack per label-pack locale; see zone-names in index.md.
    // -----------------------------------------------------------------

    private const string ZonePrefix = "ZoneNames.";

    /// <summary>The locale tags of every embedded zone-name pack, sorted. The same tags as <see cref="Locales"/>.</summary>
    public static IReadOnlyList<string> ZoneNameLocales { get; } =
        typeof(LocaleTranslations).Assembly.GetManifestResourceNames()
            .Where(n => n.StartsWith(ZonePrefix, StringComparison.Ordinal) && n.EndsWith(Suffix, StringComparison.Ordinal))
            .Select(n => n[ZonePrefix.Length..^Suffix.Length])
            .OrderBy(n => n, StringComparer.Ordinal)
            .ToArray();

    /// <summary>The zone-name pack's JSON text. Throws <see cref="ArgumentException"/> for a locale with no pack.</summary>
    public static string ZoneNamesJson(string locale)
    {
        using var stream = typeof(LocaleTranslations).Assembly.GetManifestResourceStream(ZonePrefix + locale + Suffix)
            ?? throw new ArgumentException($"There is no zone-name pack for {locale}.", nameof(locale));
        using var reader = new StreamReader(stream);
        return reader.ReadToEnd();
    }

    /// <summary>
    /// The localized names of IANA time zones in <paramref name="locale"/>, from Unicode CLDR, as the time zone
    /// picker's <c>Names</c> parameter takes them: <c>(Standard, Daylight)</c>, with a null daylight name for a zone
    /// that has one name all year. A zone CLDR has no name for in that language is not in the dictionary (never
    /// another language's text). Cornish, Scots and Wu have no CLDR zone names, so their dictionaries are empty.
    /// </summary>
    public static IReadOnlyDictionary<string, (string Standard, string? Daylight)> ZoneNames(string locale)
    {
        var pack = JsonNode.Parse(ZoneNamesJson(locale)) as JsonObject ?? throw new FormatException($"The zone-name pack {locale} is not a JSON object.");
        var names = (pack["names"] as JsonArray)?.Select(n => (string?)n ?? "").ToArray() ?? Array.Empty<string>();
        var result = new Dictionary<string, (string Standard, string? Daylight)>(StringComparer.Ordinal);
        if (pack["zones"] is not JsonObject zones) return result;
        foreach (var (zone, at) in zones)
        {
            if (at is JsonArray pair && pair.Count == 2)
            {
                var standard = names[(int)pair[0]!];
                var daylight = names[(int)pair[1]!];
                result[zone] = (standard, daylight == standard ? null : daylight);
            }
            else if (at is not null)
            {
                result[zone] = (names[(int)at], null);
            }
        }
        return result;
    }

    /// <summary>The CLDR version the zone names come from, for example <c>48.0</c>.</summary>
    public static string ZoneNamesCldrVersion(string locale) => (string?)ParseJson(ZoneNamesJson(locale))["cldr"] ?? "";

    private static JsonObject Parse(string locale) => JsonNode.Parse(Json(locale)) as JsonObject ?? throw new FormatException($"The label pack {locale} is not a JSON object.");

    private static JsonObject ParseJson(string json) => JsonNode.Parse(json) as JsonObject ?? throw new FormatException("The pack is not a JSON object.");
}
