// TimeZones: the pure zone logic of the time zone picker (offsets, names, order, matching). No DOM, no JS interop.
// Ported from shared/zones.ts; where the two differ the TypeScript side wins.

using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;

namespace LilyDesignSystem.Blazor.Helpers;

/// <summary>One zone as the picker shows it.</summary>
public sealed record ZoneEntry
{
    /// <summary>The IANA id, which is the picker's value (<c>Europe/Paris</c>).</summary>
    public required string Id { get; init; }

    /// <summary>Minutes east of UTC on the picker's date (<c>60</c>, <c>-330</c>).</summary>
    public required int OffsetMinutes { get; init; }

    /// <summary>The offset as text (<c>UTC+01:00</c>, <c>UTC-03:30</c>, <c>UTC+00:00</c>).</summary>
    public required string Offset { get; init; }

    /// <summary>The zone's full name (<c>Central European Standard Time</c>).</summary>
    public required string Name { get; init; }

    /// <summary>What the option shows: <c>UTC+01:00 – Central European Standard Time</c>.</summary>
    public string Label { get; init; } = "";
}

/// <summary>Pure zone helpers. Public so consumers can build their own UI from the same rules.</summary>
public static class TimeZones
{
    /// <summary>A representative zone for each common UTC offset and name, as IANA ids. Same list as the TypeScript catalogs.</summary>
    public static readonly IReadOnlyList<string> DefaultZones = new[]
    {
        "Pacific/Pago_Pago",
        "Pacific/Honolulu",
        "Pacific/Marquesas",
        "America/Anchorage",
        "America/Los_Angeles",
        "America/Phoenix",
        "America/Denver",
        "America/Chicago",
        "America/Mexico_City",
        "America/New_York",
        "America/Bogota",
        "America/Halifax",
        "America/Caracas",
        "America/St_Johns",
        "America/Sao_Paulo",
        "America/Argentina/Buenos_Aires",
        "Atlantic/South_Georgia",
        "Atlantic/Azores",
        "UTC",
        "Europe/London",
        "Europe/Lisbon",
        "Africa/Lagos",
        "Europe/Paris",
        "Europe/Athens",
        "Africa/Cairo",
        "Africa/Johannesburg",
        "Europe/Moscow",
        "Africa/Nairobi",
        "Asia/Riyadh",
        "Asia/Tehran",
        "Asia/Dubai",
        "Asia/Kabul",
        "Asia/Karachi",
        "Asia/Kolkata",
        "Asia/Kathmandu",
        "Asia/Dhaka",
        "Asia/Yangon",
        "Asia/Bangkok",
        "Asia/Shanghai",
        "Asia/Singapore",
        "Australia/Perth",
        "Australia/Eucla",
        "Asia/Tokyo",
        "Asia/Seoul",
        "Australia/Darwin",
        "Australia/Adelaide",
        "Australia/Brisbane",
        "Australia/Sydney",
        "Australia/Lord_Howe",
        "Pacific/Guadalcanal",
        "Pacific/Auckland",
        "Pacific/Fiji",
        "Pacific/Chatham",
        "Pacific/Tongatapu",
        "Pacific/Kiritimati"
    };

    /// <summary><c>330</c> → <c>UTC+05:30</c>, <c>-210</c> → <c>UTC-03:30</c>, <c>0</c> → <c>UTC+00:00</c>. ASCII, so it sorts and parses everywhere.</summary>
    public static string FormatOffset(int minutes)
    {
        var sign = minutes < 0 ? "-" : "+";
        var abs = Math.Abs(minutes);
        return $"UTC{sign}{abs / 60:00}:{abs % 60:00}";
    }

    /// <summary>What an option shows by default.</summary>
    public static string DefaultLabel(ZoneEntry zone) => $"{zone.Offset} – {zone.Name}";

    private static TimeZoneInfo? Find(string id)
    {
        if (string.IsNullOrEmpty(id)) return null;
        try
        {
            return TimeZoneInfo.FindSystemTimeZoneById(id);
        }
        catch (Exception e) when (e is TimeZoneNotFoundException or InvalidTimeZoneException or ArgumentException)
        {
            return null;
        }
    }

    /// <summary>Minutes east of UTC for <paramref name="id"/> at <paramref name="date"/>; null when the runtime does not know the zone.</summary>
    public static int? OffsetMinutes(string id, DateTimeOffset date)
    {
        var tz = Find(id);
        return tz is null ? null : (int)Math.Round(tz.GetUtcOffset(date).TotalMinutes);
    }

    /// <summary>
    /// The zone's full name at <paramref name="date"/>: the consumer's <paramref name="names"/> entry when given,
    /// else the platform's own standard or daylight name. .NET has no API for a zone's name in an arbitrary
    /// locale, so a localized name comes from <paramref name="names"/> (the one deviation from the TypeScript
    /// catalogs, which read it from <c>Intl</c>).
    /// </summary>
    public static string? ZoneName(string id, DateTimeOffset date, IReadOnlyDictionary<string, string>? names = null)
    {
        if (names is not null && names.TryGetValue(id, out var given) && !string.IsNullOrEmpty(given)) return given;
        var tz = Find(id);
        if (tz is null) return null;
        var name = tz.IsDaylightSavingTime(date) ? tz.DaylightName : tz.StandardName;
        return string.IsNullOrEmpty(name) ? null : name;
    }

    /// <summary>One zone's entry, or null when the runtime does not know it.</summary>
    public static ZoneEntry? Info(string id, DateTimeOffset date, IReadOnlyDictionary<string, string>? names = null, Func<ZoneEntry, string>? labelFor = null)
    {
        var minutes = OffsetMinutes(id, date);
        if (minutes is null) return null;
        var entry = new ZoneEntry
        {
            Id = id,
            OffsetMinutes = minutes.Value,
            Offset = FormatOffset(minutes.Value),
            Name = ZoneName(id, date, names) ?? id,
        };
        return entry with { Label = (labelFor ?? DefaultLabel)(entry) };
    }

    /// <summary>
    /// The zones that exist, ordered by offset (west to east), then by name, then by id. A repeated id appears
    /// once; an id the runtime does not know is left out rather than shown unnamed.
    /// </summary>
    public static IReadOnlyList<ZoneEntry> Ordered(
        IEnumerable<string> zones,
        string locale,
        DateTimeOffset date,
        IReadOnlyDictionary<string, string>? names = null,
        Func<ZoneEntry, string>? labelFor = null)
    {
        var seen = new HashSet<string>();
        var list = new List<ZoneEntry>();
        foreach (var id in zones)
        {
            if (!seen.Add(id)) continue;
            var info = Info(id, date, names, labelFor);
            if (info is not null) list.Add(info);
        }
        var compare = CompareInfo(locale);
        return list
            .OrderBy(z => z.OffsetMinutes)
            .ThenBy(z => z.Name, Comparer<string>.Create((a, b) => compare.Compare(a, b, CompareOptions.None)))
            .ThenBy(z => z.Id, StringComparer.Ordinal)
            .ToList();
    }

    private static CompareInfo CompareInfo(string locale)
    {
        try
        {
            return CultureInfo.GetCultureInfo(locale).CompareInfo;
        }
        catch (CultureNotFoundException)
        {
            return CultureInfo.InvariantCulture.CompareInfo;
        }
    }

    /// <summary>
    /// Which of <paramref name="zones"/> stands for <paramref name="system"/>: the zone itself when listed, else
    /// the listed zone with the same offset and name (Europe/Berlin → Europe/Paris), else null.
    /// </summary>
    public static string? MatchZone(string? system, IReadOnlyList<ZoneEntry> zones, DateTimeOffset date, IReadOnlyDictionary<string, string>? names = null)
    {
        if (string.IsNullOrEmpty(system)) return null;
        if (zones.Any(z => z.Id == system)) return system;
        var info = Info(system, date, names);
        if (info is null) return null;
        return zones.FirstOrDefault(z => z.OffsetMinutes == info.OffsetMinutes && z.Name == info.Name)?.Id;
    }
}
