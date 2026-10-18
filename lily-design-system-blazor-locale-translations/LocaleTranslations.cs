// The 46 locale label packs, embedded. See index.md.
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

    private static JsonObject Parse(string locale) => JsonNode.Parse(Json(locale)) as JsonObject ?? throw new FormatException($"The label pack {locale} is not a JSON object.");
}
