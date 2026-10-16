// Cell types for DataGrid: a `column.Type` is a named bundle of defaults for the
// hooks a column already has (Format, Compare, FilterText, ExportValue, Align,
// editor). Nothing here is new machinery: Resolve fills in what the column left
// out, and a column's own hooks always win.
//
// Values are plain data. Display is derived: no English, no default locale
// (with no Locale a value shows as stored), no HTML, no icons.
//
// Ported from the canonical Svelte package's cell-types.ts. .NET has no
// Intl.DateTimeFormat dateStyle: dates and times take .NET format strings
// (DateFormat, TimeFormat), and a zone shows as its id (.NET has no short zone names).

using System.Collections.Concurrent;
using System.Globalization;
using System.Runtime.CompilerServices;
using System.Text.RegularExpressions;

namespace LilyDesignSystem.Blazor.Helpers;

/// <summary>Cell-type defaults and the pure helpers behind them.</summary>
public static class CellTypes
{
    private static readonly Regex SafeScheme = new(@"^(https?:|mailto:|tel:)", RegexOptions.IgnoreCase | RegexOptions.Compiled);
    private static readonly Regex Relative = new(@"^(/(?!/)|\.\.?/|#|\?)", RegexOptions.Compiled);
    private static readonly Regex Offset = new(@"^([+-])(\d{2}):?(\d{2})$", RegexOptions.Compiled);

    /// <summary>An address safe to put in an <c>href</c>: http(s), mailto, tel, or a relative one. Anything else (<c>javascript:</c>, <c>data:</c>) is null.</summary>
    public static string? SafeHref(string? href)
    {
        if (href is null) return null;
        var text = href.Trim();
        if (text.Length == 0) return null;
        // Control characters are stripped by browsers when reading a scheme, so they cannot be allowed to hide one.
        foreach (var c in text) if (c < 0x20 || c == 0x7F) return null;
        return SafeScheme.IsMatch(text) || Relative.IsMatch(text) ? text : null;
    }

    /// <summary>A link value as a <see cref="DataGridLink"/>; a plain string is the address.</summary>
    public static DataGridLink? LinkParts(object? value) => value switch
    {
        null => null,
        string { Length: 0 } => null,
        string s => new DataGridLink(s),
        DataGridLink l => l,
        _ => null,
    };

    /// <summary>A link's visible text: its label, else its address.</summary>
    public static string LinkLabel(object? value) => LinkParts(value) is { } link ? link.Label ?? link.Href : "";

    /// <summary>A civil date <c>YYYY-MM-DD</c> that exists on the calendar.</summary>
    public static bool IsCivilDate(string? text)
        => text is { Length: 10 } && Regex.IsMatch(text, @"^\d{4}-\d{2}-\d{2}$") && DateOnly.TryParseExact(text, "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out _);

    /// <summary>A civil time <c>HH:mm</c> or <c>HH:mm:ss</c>, 24-hour.</summary>
    public static bool IsCivilTime(string? text)
    {
        if (text is null) return false;
        var m = Regex.Match(text, @"^(\d{2}):(\d{2})(?::(\d{2}))?$");
        return m.Success && int.Parse(m.Groups[1].Value) < 24 && int.Parse(m.Groups[2].Value) < 60 && (!m.Groups[3].Success || int.Parse(m.Groups[3].Value) < 60);
    }

    /// <summary>A civil date from a string, <see cref="DateOnly"/> or <see cref="DateTime"/>; null when it is none of those.</summary>
    public static DateOnly? CivilDateOf(object? value) => value switch
    {
        DateOnly d => d,
        DateTime dt => DateOnly.FromDateTime(dt),
        string s when IsCivilDate(s) => DateOnly.ParseExact(s, "yyyy-MM-dd", CultureInfo.InvariantCulture),
        _ => null,
    };

    private static bool IsEmpty(object? value) => value is null || value is string { Length: 0 };

    private static CultureInfo CultureOf(string? locale)
    {
        if (string.IsNullOrEmpty(locale)) return CultureInfo.InvariantCulture;
        try { return CultureInfo.GetCultureInfo(locale); } catch (CultureNotFoundException) { return CultureInfo.InvariantCulture; }
    }

    // -------------------------------------------------------------------
    // Time zones
    // -------------------------------------------------------------------

    private static double? ZoneOffsetMinutes(string timeZone, DateTime utcInstant)
    {
        var bare = Offset.Match(timeZone);
        if (bare.Success) return (bare.Groups[1].Value == "-" ? -1 : 1) * (int.Parse(bare.Groups[2].Value) * 60 + int.Parse(bare.Groups[3].Value));
        try
        {
            return TimeZoneInfo.FindSystemTimeZoneById(timeZone).GetUtcOffset(DateTime.SpecifyKind(utcInstant, DateTimeKind.Utc)).TotalMinutes;
        }
        catch (Exception e) when (e is TimeZoneNotFoundException or InvalidTimeZoneException)
        {
            return null;
        }
    }

    /// <summary>An IANA zone id the platform knows, or a bare offset such as <c>+01:00</c>.</summary>
    public static bool IsValidTimeZone(string? timeZone)
        => !string.IsNullOrEmpty(timeZone) && ZoneOffsetMinutes(timeZone, DateTime.UnixEpoch) is not null;

    /// <summary>A zoned time: a real time of day and a known zone.</summary>
    public static bool IsZonedTime(object? value)
        => value is DataGridZonedTime z && IsCivilTime(z.Time) && IsValidTimeZone(z.TimeZone);

    /// <summary>
    /// A zoned time as a number for ordering. With a <paramref name="referenceDate"/> (ISO, supplied by the consumer: never computed
    /// here) it is the UTC minute of that instant, so equal instants compare equal; without one it is the stated local time and the zone is ignored.
    /// </summary>
    public static double? ZonedMinutes(object? value, string? referenceDate = null)
    {
        if (value is not DataGridZonedTime z || !IsZonedTime(z)) return null;
        var parts = z.Time.Split(':').Select(int.Parse).ToArray();
        var seconds = parts.Length > 2 ? parts[2] : 0;
        var local = parts[0] * 60 + parts[1] + seconds / 60d;
        if (CivilDateOf(referenceDate) is not { } date) return local;
        var guess = new DateTime(date.Year, date.Month, date.Day, parts[0], parts[1], seconds, DateTimeKind.Utc);
        var offset = ZoneOffsetMinutes(z.TimeZone, guess);
        if (offset is null) return local;
        return (guess - DateTime.UnixEpoch).TotalMinutes - offset.Value;
    }

    /// <summary>A zoned time as the UTC time of day (<c>HH:mm</c>) at a reference date. Null without a valid reference date or value.</summary>
    public static string? ZonedUtcTime(object? value, string? referenceDate)
    {
        if (CivilDateOf(referenceDate) is null) return null;
        if (ZonedMinutes(value, referenceDate) is not { } minutes) return null;
        var day = (((int)Math.Round(minutes) % 1440) + 1440) % 1440;
        return $"{day / 60:D2}:{day % 60:D2}";
    }

    // -------------------------------------------------------------------
    // People, files
    // -------------------------------------------------------------------

    /// <summary>The people in a value: one person or a list of them.</summary>
    public static IReadOnlyList<DataGridPerson> PeopleOf(object? value) => value switch
    {
        DataGridPerson p => new[] { p },
        IEnumerable<DataGridPerson> list => list.ToList(),
        _ => Array.Empty<DataGridPerson>(),
    };

    /// <summary>A person's text: the name, or the id when there is none (never blank).</summary>
    public static string PersonName(DataGridPerson person) => string.IsNullOrEmpty(person.Name) ? person.Id : person.Name;

    /// <summary>The files in a value.</summary>
    public static IReadOnlyList<DataGridFile> FilesOf(object? value)
        => value is IEnumerable<DataGridFile> list ? list.ToList() : Array.Empty<DataGridFile>();

    // -------------------------------------------------------------------
    // Aggregates
    // -------------------------------------------------------------------

    internal static double? AsNumber(object? v) => v switch
    {
        double d when double.IsFinite(d) => d,
        float f when float.IsFinite(f) => f,
        int i => i,
        long l => l,
        short s => s,
        byte b => b,
        decimal m => (double)m,
        uint u => u,
        ulong ul => ul,
        _ => null,
    };

    /// <summary>Reduces related values to one result. An empty set is empty (null), not 0, except <c>Count</c>.</summary>
    public static object? AggregateValues(DataGridAggregate kind, IReadOnlyList<object?> values)
    {
        var present = values.Where(v => !IsEmpty(v)).ToList();
        var numbers = present.Select(AsNumber).Where(n => n is not null).Select(n => n!.Value).ToList();
        switch (kind)
        {
            case DataGridAggregate.Count:
                return values.Count;
            case DataGridAggregate.CountUnique:
                return present.Count == 0 ? null : present.Select(v => v is string s ? s : v!.ToString()).Distinct().Count();
            case DataGridAggregate.Sum:
                return numbers.Count == 0 ? null : numbers.Sum();
            case DataGridAggregate.Avg:
                return numbers.Count == 0 ? null : numbers.Average();
            case DataGridAggregate.Median:
            {
                if (numbers.Count == 0) return null;
                var sorted = numbers.OrderBy(n => n).ToList();
                var mid = sorted.Count / 2;
                return sorted.Count % 2 == 1 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
            }
            case DataGridAggregate.Min:
            case DataGridAggregate.Max:
            {
                if (numbers.Count > 0 && numbers.Count == present.Count) return kind == DataGridAggregate.Min ? numbers.Min() : numbers.Max();
                var texts = present.OfType<string>().ToList();
                if (texts.Count == 0) return null;
                return kind == DataGridAggregate.Min ? texts.Min(StringComparer.Ordinal) : texts.Max(StringComparer.Ordinal);
            }
            case DataGridAggregate.Range:
                return numbers.Count == 0 ? null : numbers.Max() - numbers.Min();
            case DataGridAggregate.PercentTrue:
            {
                var booleans = values.OfType<bool>().ToList();
                return booleans.Count == 0 ? null : booleans.Count(b => b) / (double)booleans.Count * 100;
            }
            case DataGridAggregate.PercentEmpty:
                return values.Count == 0 ? null : (values.Count - present.Count) / (double)values.Count * 100;
        }
        return null;
    }

    // -------------------------------------------------------------------
    // Validation by type
    // -------------------------------------------------------------------

    /// <summary>Whether a (parsed) value is unacceptable for the column's type; the grid refuses the edit. Empty is always acceptable.</summary>
    public static bool IsInvalidForType(DataGridColumn column, object? value)
    {
        if (IsEmpty(value)) return false;
        switch (column.Type)
        {
            case DataGridCellType.Number:
                return AsNumber(value) is null;
            case DataGridCellType.Link:
                return SafeHref(LinkParts(value)?.Href) is null;
            case DataGridCellType.Date:
                return CivilDateOf(value) is null;
            case DataGridCellType.Time:
                return value is not string t || !IsCivilTime(t);
            case DataGridCellType.TimeZone:
                return !IsZonedTime(value);
            case DataGridCellType.Select:
            case DataGridCellType.Radio:
                return !(column.Options ?? Array.Empty<DataGridOption>()).Any(o => o.Id == value as string);
            case DataGridCellType.Person:
                return PeopleOf(value).Count == 0;
            default:
                return false;
        }
    }

    // -------------------------------------------------------------------
    // Defaults a type gives its column
    // -------------------------------------------------------------------

    private static string OptionLabel(DataGridColumn column, object? id)
    {
        var found = (column.Options ?? Array.Empty<DataGridOption>()).FirstOrDefault(o => o.Id == id as string);
        return found is not null ? found.Label : IsEmpty(id) ? "" : id!.ToString() ?? "";
    }

    private static string Invariant(object value) => value switch
    {
        double d => d.ToString("R", CultureInfo.InvariantCulture),
        float f => f.ToString("R", CultureInfo.InvariantCulture),
        IFormattable fmt => fmt.ToString(null, CultureInfo.InvariantCulture),
        _ => value.ToString() ?? "",
    };

    private static string NumberText(DataGridColumn column, string? locale, object? v)
    {
        if (AsNumber(v) is not { } n) return IsEmpty(v) ? "" : v!.ToString() ?? "";
        return !string.IsNullOrEmpty(locale) || column.NumberFormat is not null
            ? n.ToString(column.NumberFormat ?? "#,##0.###", CultureOf(locale))
            : Invariant(v!);
    }

    private static string DateText(DataGridColumn column, string? locale, object? v)
    {
        if (IsEmpty(v)) return "";
        if (CivilDateOf(v) is not { } date) return v!.ToString() ?? "";
        return !string.IsNullOrEmpty(locale) || column.DateFormat is not null
            ? date.ToString(column.DateFormat ?? "D", CultureOf(locale))
            : date.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture);
    }

    private static string TimeText(DataGridColumn column, string? locale, string time)
    {
        if (string.IsNullOrEmpty(locale) && column.TimeFormat is null) return time;
        var parts = time.Split(':').Select(int.Parse).ToArray();
        var at = new DateTime(2000, 1, 1, parts[0], parts[1], parts.Length > 2 ? parts[2] : 0);
        return at.ToString(column.TimeFormat ?? "t", CultureOf(locale));
    }

    private static int Compare(string a, string b, string? locale)
        => string.IsNullOrEmpty(locale) ? string.CompareOrdinal(a, b) : CultureOf(locale).CompareInfo.Compare(a, b, CompareOptions.None);

    /// <summary>Formats a result by its declared type, so a rollup or formula of dates reads like a date.</summary>
    private static Func<object?, string> ResultFormatter(DataGridColumn column, string? locale) => column.ResultType switch
    {
        DataGridResultType.Number => v => NumberText(column, locale, v),
        DataGridResultType.Date => v => DateText(column, locale, v),
        _ => v => IsEmpty(v) ? "" : v!.ToString() ?? "",
    };

    private static object? Raw(DataGridColumn column, DataGridRow row)
        => column.Accessor is not null ? column.Accessor(row) : row.TryGetValue(column.Id, out var v) ? v : null;

    private static DataGridColumn WithTypeDefaults(DataGridColumn column, string? gridLocale)
    {
        var locale = column.Locale ?? gridLocale;
        var c = column;
        switch (column.Type)
        {
            case DataGridCellType.Text:
                return c with
                {
                    Align = c.Align == DataGridAlign.Default ? DataGridAlign.Start : c.Align,
                    Editor = c.Editor == DataGridEditor.Default ? DataGridEditor.Text : c.Editor,
                    Compare = c.Compare ?? (!string.IsNullOrEmpty(locale) ? (a, b) => Compare(a?.ToString() ?? "", b?.ToString() ?? "", locale) : null),
                };
            case DataGridCellType.Number:
                return c with
                {
                    Align = c.Align == DataGridAlign.Default ? DataGridAlign.End : c.Align,
                    Editor = c.Editor == DataGridEditor.Default ? DataGridEditor.Number : c.Editor,
                    Format = c.Format ?? ((v, _) => NumberText(column, locale, v)),
                };
            case DataGridCellType.Link:
                return c with
                {
                    Align = c.Align == DataGridAlign.Default ? DataGridAlign.Start : c.Align,
                    Editor = c.Editor == DataGridEditor.Default ? DataGridEditor.Link : c.Editor,
                    Format = c.Format ?? ((v, _) => LinkLabel(v)),
                    FilterText = c.FilterText ?? ((v, _) => LinkParts(v) is { } l ? $"{l.Label ?? ""} {l.Href}".Trim() : ""),
                    Compare = c.Compare ?? ((a, b) => Compare(LinkLabel(a), LinkLabel(b), locale)),
                    ExportValue = c.ExportValue ?? (row => LinkLabel(Raw(column, row))),
                    Parse = c.Parse ?? ((draft, row) =>
                    {
                        var previous = LinkParts(Raw(column, row));
                        var href = draft.Trim();
                        if (href.Length == 0) return null;
                        return previous is not null && (previous.Label is not null || previous.External) ? previous with { Href = href } : href;
                    }),
                };
            case DataGridCellType.Date:
                return c with
                {
                    Align = c.Align == DataGridAlign.Default ? DataGridAlign.Start : c.Align,
                    Editor = c.Editor == DataGridEditor.Default ? DataGridEditor.Date : c.Editor,
                    Format = c.Format ?? ((v, _) => DateText(column, locale, v)),
                    ExportValue = c.ExportValue ?? (row => CivilDateOf(Raw(column, row))),
                };
            case DataGridCellType.Time:
                return c with
                {
                    Align = c.Align == DataGridAlign.Default ? DataGridAlign.Start : c.Align,
                    Editor = c.Editor == DataGridEditor.Default ? DataGridEditor.Time : c.Editor,
                    Format = c.Format ?? ((v, _) => IsEmpty(v) ? "" : v is string t && IsCivilTime(t) ? TimeText(column, locale, t) : v!.ToString() ?? ""),
                };
            case DataGridCellType.TimeZone:
                return c with
                {
                    Align = c.Align == DataGridAlign.Default ? DataGridAlign.Start : c.Align,
                    Editor = c.Editor == DataGridEditor.Default ? DataGridEditor.TimeZone : c.Editor,
                    Format = c.Format ?? ((v, _) => v is DataGridZonedTime z && IsZonedTime(z) ? $"{TimeText(column, locale, z.Time)} {z.TimeZone}" : IsEmpty(v) ? "" : v!.ToString() ?? ""),
                    Compare = c.Compare ?? ((a, b) => (ZonedMinutes(a, column.ReferenceDate) ?? 0).CompareTo(ZonedMinutes(b, column.ReferenceDate) ?? 0)),
                    ExportValue = c.ExportValue ?? (row => Raw(column, row) is DataGridZonedTime z && IsZonedTime(z) ? $"{z.Time} {z.TimeZone}" : null),
                };
            case DataGridCellType.Person:
            {
                static IEnumerable<string> Names(object? v) => PeopleOf(v).Select(PersonName);
                return c with
                {
                    Align = c.Align == DataGridAlign.Default ? DataGridAlign.Start : c.Align,
                    Editor = c.Editor == DataGridEditor.Default ? DataGridEditor.Person : c.Editor,
                    Format = c.Format ?? ((v, _) => string.Join("; ", Names(v))),
                    FilterText = c.FilterText ?? ((v, _) => string.Join(" ", PeopleOf(v).Select(p => $"{PersonName(p)} {p.Email ?? ""}".Trim()))),
                    Compare = c.Compare ?? ((a, b) =>
                    {
                        var x = Names(a).ToList();
                        var y = Names(b).ToList();
                        var byName = Compare(x.FirstOrDefault() ?? "", y.FirstOrDefault() ?? "", locale);
                        return byName != 0 ? byName : x.Count - y.Count;
                    }),
                    ExportValue = c.ExportValue ?? (row =>
                    {
                        var value = Raw(column, row);
                        var parts = column.ExportAs == DataGridExportAs.Email ? PeopleOf(value).Select(p => p.Email ?? "") : Names(value);
                        var joined = string.Join("; ", parts);
                        return joined.Replace(";", "").Trim().Length == 0 ? null : joined;
                    }),
                };
            }
            case DataGridCellType.File:
            {
                static IEnumerable<string> Names(object? v) => FilesOf(v).Select(f => f.Name);
                return c with
                {
                    Align = c.Align == DataGridAlign.Default ? DataGridAlign.Start : c.Align,
                    Format = c.Format ?? ((v, _) => string.Join("; ", Names(v))),
                    FilterText = c.FilterText ?? ((v, _) => string.Join(" ", Names(v))),
                    Compare = c.Compare ?? ((a, b) =>
                    {
                        var x = Names(a).ToList();
                        var y = Names(b).ToList();
                        var byName = Compare(x.FirstOrDefault() ?? "", y.FirstOrDefault() ?? "", locale);
                        return byName != 0 ? byName : x.Count - y.Count;
                    }),
                    ExportValue = c.ExportValue ?? (row =>
                    {
                        var joined = string.Join("; ", Names(Raw(column, row)));
                        return joined.Length == 0 ? null : joined;
                    }),
                };
            }
            case DataGridCellType.Select:
            case DataGridCellType.Radio:
            {
                var order = (column.Options ?? Array.Empty<DataGridOption>()).Select((o, i) => (o.Id, i)).ToDictionary(x => x.Id, x => x.i);
                int Rank(object? v) => v is string id && order.TryGetValue(id, out var i) ? i : int.MaxValue;
                return c with
                {
                    Align = c.Align == DataGridAlign.Default ? DataGridAlign.Start : c.Align,
                    Editor = c.Editor == DataGridEditor.Default ? (column.Type == DataGridCellType.Select ? DataGridEditor.Select : DataGridEditor.Radio) : c.Editor,
                    Format = c.Format ?? ((v, _) => OptionLabel(column, v)),
                    FilterText = c.FilterText ?? ((v, _) => OptionLabel(column, v)),
                    Compare = c.Compare ?? (column.Type == DataGridCellType.Radio || column.SortBy == DataGridSortBy.Order
                        ? (a, b) => Rank(a).CompareTo(Rank(b))
                        : (a, b) => Compare(OptionLabel(column, a), OptionLabel(column, b), locale)),
                    ExportValue = c.ExportValue ?? (row =>
                    {
                        var id = Raw(column, row);
                        if (IsEmpty(id)) return null;
                        return column.ExportAs == DataGridExportAs.Id ? id : OptionLabel(column, id);
                    }),
                };
            }
            default:
                return c;
        }
    }

    private sealed class Memo<T> where T : class
    {
        private readonly ConditionalWeakTable<object, T> _table = new();
        public T GetOrAdd(object key, Func<T> create) => _table.GetValue(key, _ => create());
    }

    private sealed record Boxed(object? Value);

    /// <summary>
    /// The column with its type's defaults filled in under its own hooks. A column with no <c>Type</c> is returned as is.
    /// <paramref name="rows"/> is every row: a <c>Formula</c> hands it to the consumer's engine for references to other rows.
    /// A rollup's and a formula's results are computed once per row each time the columns are resolved (the rows or columns changed),
    /// never per comparison or keystroke.
    /// </summary>
    public static DataGridColumn Resolve(DataGridColumn column, string? gridLocale, IReadOnlyList<DataGridRow> rows)
    {
        if (column.Type == DataGridCellType.None) return column;
        var resolved = WithTypeDefaults(column, gridLocale);
        var locale = column.Locale ?? gridLocale;

        if (column.Type == DataGridCellType.Rollup)
        {
            Func<DataGridRow, IEnumerable<object?>> relation = column.Relation
                ?? (column.Accessor is not null
                    ? row => AsList(column.Accessor(row))
                    : row => AsList(row.TryGetValue(column.Id, out var v) ? v : null));
            var cache = new Memo<Boxed>();
            var format = ResultFormatter(column, locale);
            Func<DataGridRow, object?> accessor = row => cache.GetOrAdd(row, () =>
            {
                var values = relation(row).ToList();
                return new Boxed(column.Reduce is not null ? column.Reduce(values, row) : AggregateValues(column.Aggregate, values));
            }).Value;
            return resolved with
            {
                Accessor = accessor,
                Editable = false,
                Align = column.Align != DataGridAlign.Default ? column.Align : column.ResultType == DataGridResultType.Number ? DataGridAlign.End : DataGridAlign.Start,
                Format = column.Format ?? ((v, _) => format(v)),
                ExportValue = column.ExportValue ?? (row =>
                {
                    var v = accessor(row);
                    return column.ResultType == DataGridResultType.Date ? CivilDateOf(v) : IsEmpty(v) ? null : v;
                }),
            };
        }

        if (column.Type == DataGridCellType.Formula)
        {
            Func<DataGridRow, object?> source = column.Accessor ?? (row => row.TryGetValue(column.Id, out var v) ? v : null);
            var cache = new Memo<DataGridFormulaResult>();
            var format = ResultFormatter(column, locale);
            DataGridFormulaResult Result(DataGridRow row) => cache.GetOrAdd(row, () =>
            {
                var expression = source(row);
                if (IsEmpty(expression)) return DataGridFormulaResult.Of(null);
                if (column.Evaluate is null) return DataGridFormulaResult.Of(expression);
                try
                {
                    return column.Evaluate(expression!.ToString() ?? "", new DataGridFormulaContext(row, rows, column.Id));
                }
                catch (Exception error)
                {
                    return DataGridFormulaResult.Error(error.Message);
                }
            });
            Func<DataGridRow, object?> valueOf = row => Result(row) is DataGridFormulaValue v ? v.Value : null;
            Func<DataGridRow, string?> errorOf = row => Result(row) is DataGridFormulaError e ? e.Message : null;
            Func<object?, DataGridRow, string> display = (v, row) => errorOf(row) ?? format(v);
            return resolved with
            {
                Source = source,
                ErrorOf = errorOf,
                Accessor = valueOf,
                Align = column.Align != DataGridAlign.Default ? column.Align : column.ResultType == DataGridResultType.Number ? DataGridAlign.End : DataGridAlign.Start,
                Format = column.Format ?? display,
                ExportValue = column.ExportValue ?? (row =>
                {
                    if (errorOf(row) is { } message) return message;
                    var v = valueOf(row);
                    return column.ResultType == DataGridResultType.Date ? CivilDateOf(v) : IsEmpty(v) ? null : v;
                }),
                FilterText = column.FilterText ?? ((v, row) => (column.Format ?? display)(v, row)),
            };
        }
        return resolved;
    }

    private static IEnumerable<object?> AsList(object? value) => value switch
    {
        null => Array.Empty<object?>(),
        string => Array.Empty<object?>(),
        IEnumerable<object?> list => list,
        System.Collections.IEnumerable list => list.Cast<object?>(),
        _ => Array.Empty<object?>(),
    };

    /// <summary>The default ordering of two raw values: numbers numerically, strings ordinally, dates and booleans naturally.</summary>
    public static int DefaultCompare(object? a, object? b)
    {
        if (AsNumber(a) is { } x && AsNumber(b) is { } y) return x.CompareTo(y);
        if (a is string s && b is string t) return string.CompareOrdinal(s, t);
        if (a is IComparable ca && b is not null && a.GetType() == b.GetType()) return ca.CompareTo(b);
        return string.CompareOrdinal(a?.ToString() ?? "", b?.ToString() ?? "");
    }
}
