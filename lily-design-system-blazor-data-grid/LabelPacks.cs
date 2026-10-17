// Label packs for the grid-like Blazor helpers: the C# port of the canonical shared/label-pack.ts.
//
// A pack is the strings a helper's Labels record needs, in one JSON file per locale (shared/label-packs/<locale>.json in the
// monorepo). Lily ships no English defaults, so an app used to write and translate these itself; load a pack and build the record:
//
//     var pack = LabelPack.FromJson(File.ReadAllText("ta-001.json"));
//     <DataGrid Labels="pack.ToDataGridLabels()" ... />
//
// Function labels are built from "{placeholder}" templates; where the wording depends on a value (ascending / descending, collapsed /
// expanded, the calendar view, the dependency type) the pack holds an object keyed by that value and Select picks one. The builders
// (ToDataGridLabels here, ToKanbanLabels, ToCalendarLabels, ToGanttLabels and ToFilterLabels in their own packages) leave a label null
// when the pack lacks its key, so the control stays unnamed instead of showing text from another language. Anything that depends on how a
// locale writes dates (weekday names, period titles, day names, the Gantt column label) is not in a pack: build it with the culture.
//
// Blazor has no JS-free way to read a file in the browser, so loading the JSON is the app's job (HttpClient, a static asset, an embedded
// resource); this class only parses it. A pack with Reviewed == false is a machine draft awaiting a native speaker.

using System.Globalization;
using System.Text.Json.Nodes;
using System.Text.RegularExpressions;

namespace LilyDesignSystem.Blazor.Helpers;

/// <summary>One locale's label strings. See the file header.</summary>
public sealed class LabelPack
{
    // The labels several helpers share live in the pack's "common" section; the filter takes none of them.
    private static readonly string[] CommonWithoutAnnouncement = { "search", "export", "exportCsv", "exportTsv", "exportExcel", "exportAnnouncement", "copy", "copyAnnouncement", "copyFailed" };
    private static readonly string[] CommonAll = { "search", "searchAnnouncement", "export", "exportCsv", "exportTsv", "exportExcel", "exportAnnouncement", "copy", "copyAnnouncement", "copyFailed" };

    private readonly JsonObject _root;

    private LabelPack(JsonObject root)
    {
        _root = root;
        Locale = (string?)root["locale"] ?? "";
        Reviewed = (bool?)root["reviewed"] ?? false;
    }

    /// <summary>The locale tag, for example <c>ta-001</c>.</summary>
    public string Locale { get; }

    /// <summary>Has a native speaker checked the pack? False for machine drafts.</summary>
    public bool Reviewed { get; }

    /// <summary>Parses one pack file.</summary>
    public static LabelPack FromJson(string json)
    {
        if (JsonNode.Parse(json) is not JsonObject root) throw new FormatException("A label pack is a JSON object.");
        return new LabelPack(root);
    }

    private static string[] CommonFor(string helper) => helper switch
    {
        "filter" => Array.Empty<string>(),
        "data-grid" => CommonWithoutAnnouncement,
        _ => CommonAll,
    };

    private JsonNode? Find(string helper, string key)
    {
        if (_root[helper] is JsonObject own && own[key] is { } found) return found;
        if (Array.IndexOf(CommonFor(helper), key) >= 0 && _root["common"] is JsonObject common && common[key] is { } shared) return shared;
        return null;
    }

    /// <summary>A plain string label, or null when the pack has none.</summary>
    public string? Text(string helper, string key) => Find(helper, key) is JsonValue v && v.TryGetValue<string>(out var s) ? s : null;

    /// <summary>The wording for one value of a select label (<c>"true"</c>/<c>"false"</c>, <c>"ascending"</c>, <c>"e2s"</c>, …), or null.</summary>
    public string? Select(string helper, string key, string selector)
    {
        if (Find(helper, key) is not JsonObject branches) return null;
        return branches[selector] is JsonValue v && v.TryGetValue<string>(out var s) ? s
            : branches["other"] is JsonValue o && o.TryGetValue<string>(out var other) ? other
            : null;
    }

    /// <summary>An object of plain strings (the export headers, the filter's operator names), or null.</summary>
    public IReadOnlyDictionary<string, string>? Group(string helper, string key)
    {
        if (Find(helper, key) is not JsonObject o) return null;
        var result = new Dictionary<string, string>();
        foreach (var (name, value) in o) if (value is JsonValue v && v.TryGetValue<string>(out var s)) result[name] = s;
        return result;
    }

    private static readonly Regex Placeholder = new(@"\{(\w+)\}", RegexOptions.Compiled);

    /// <summary>Fills <c>{name}</c> placeholders; an unknown placeholder is left as written. An exception shows its message, a list its items joined with ", ", and <c>format</c> is upper-cased.</summary>
    public static string Fill(string template, params (string Name, object? Value)[] values)
    {
        var map = new Dictionary<string, string>();
        foreach (var (name, value) in values) map[name] = name == "format" ? Format(value).ToUpperInvariant() : Format(value);
        return Placeholder.Replace(template, m => map.TryGetValue(m.Groups[1].Value, out var s) ? s : m.Value);
    }

    private static string Format(object? value) => value switch
    {
        null => "",
        string s => s,
        Exception e => e.Message,
        System.Collections.IEnumerable list => string.Join(", ", list.Cast<object?>().Select(Format)),
        IFormattable f => f.ToString(null, CultureInfo.InvariantCulture),
        _ => value.ToString() ?? "",
    };

    /// <summary>An object without the named text (a card with no title) is shown by its id, as the helpers do.</summary>
    public static string OrId(string? text, string id) => string.IsNullOrEmpty(text) ? id : text;

    // ---- the ids the packs use for the C# enums ----

    /// <summary>The pack's id for a sort direction.</summary>
    public static string Id(DataGridSortDirection d) => d switch { DataGridSortDirection.Ascending => "ascending", DataGridSortDirection.Descending => "descending", _ => "none" };

    // ---- building function labels ----

    /// <summary>A one-argument function label from a template.</summary>
    public Func<T1, string>? Fn<T1>(string helper, string key, Func<T1, (string, object?)[]> tokens)
        => Text(helper, key) is { } t ? a => Fill(t, tokens(a)) : null;

    /// <summary>A two-argument function label from a template.</summary>
    public Func<T1, T2, string>? Fn<T1, T2>(string helper, string key, Func<T1, T2, (string, object?)[]> tokens)
        => Text(helper, key) is { } t ? (a, b) => Fill(t, tokens(a, b)) : null;

    /// <summary>A three-argument function label from a template.</summary>
    public Func<T1, T2, T3, string>? Fn<T1, T2, T3>(string helper, string key, Func<T1, T2, T3, (string, object?)[]> tokens)
        => Text(helper, key) is { } t ? (a, b, c) => Fill(t, tokens(a, b, c)) : null;

    /// <summary>A one-argument function label whose wording is picked by <paramref name="selector"/>.</summary>
    public Func<T1, string>? Pick<T1>(string helper, string key, Func<T1, string> selector, Func<T1, (string, object?)[]> tokens)
        => Find(helper, key) is JsonObject ? a => Fill(Select(helper, key, selector(a)) ?? "", tokens(a)) : null;

    /// <summary>A two-argument function label whose wording is picked by <paramref name="selector"/>.</summary>
    public Func<T1, T2, string>? Pick<T1, T2>(string helper, string key, Func<T1, T2, string> selector, Func<T1, T2, (string, object?)[]> tokens)
        => Find(helper, key) is JsonObject ? (a, b) => Fill(Select(helper, key, selector(a, b)) ?? "", tokens(a, b)) : null;

    /// <summary>A three-argument function label whose wording is picked by <paramref name="selector"/>.</summary>
    public Func<T1, T2, T3, string>? Pick<T1, T2, T3>(string helper, string key, Func<T1, T2, T3, string> selector, Func<T1, T2, T3, (string, object?)[]> tokens)
        => Find(helper, key) is JsonObject ? (a, b, c) => Fill(Select(helper, key, selector(a, b, c)) ?? "", tokens(a, b, c)) : null;

    /// <summary>The pack's id for an export format (<c>csv</c>, <c>tsv</c>, <c>xlsx</c>), upper-cased by <see cref="Fill"/>.</summary>
    public static string Id(DataGridExportFormat f) => f switch { DataGridExportFormat.Csv => "csv", DataGridExportFormat.Tsv => "tsv", _ => "xlsx" };
}

/// <summary>The data grid's labels from a pack.</summary>
public static class DataGridLabelPack
{
    private const string H = "data-grid";

    /// <summary>Builds <see cref="DataGridLabels"/> from <paramref name="pack"/>. A key the pack lacks leaves its label null.</summary>
    public static DataGridLabels ToDataGridLabels(this LabelPack pack) => new()
    {
        Search = pack.Text(H, "search"),
        SearchField = pack.Text(H, "searchField"),
        SearchAllFields = pack.Text(H, "searchAllFields"),
        Pagination = pack.Text(H, "pagination"),
        Copy = pack.Text(H, "copy"),
        CopyAnnouncement = pack.Fn<int>(H, "copyAnnouncement", n => new[] { ("count", (object?)n) }),
        CopyFailed = pack.Text(H, "copyFailed"),
        UndoAnnouncement = pack.Fn<string, string>(H, "undoAnnouncement", (h, t) => new[] { ("header", (object?)h), ("text", t) }),
        RedoAnnouncement = pack.Fn<string, string>(H, "redoAnnouncement", (h, t) => new[] { ("header", (object?)h), ("text", t) }),
        ColumnVisibility = pack.Text(H, "columnVisibility"),
        ColumnVisibilityOption = pack.Fn<string>(H, "columnVisibilityOption", h => new[] { ("header", (object?)h) }),
        ResizeHandle = pack.Fn<string>(H, "resizeHandle", h => new[] { ("header", (object?)h) }),
        SelectAll = pack.Text(H, "selectAll"),
        SelectionColumn = pack.Text(H, "selectionColumn"),
        SelectRow = pack.Fn<string>(H, "selectRow", r => new[] { ("rowLabel", (object?)r) }),
        PreviousPage = pack.Text(H, "previousPage"),
        NextPage = pack.Text(H, "nextPage"),
        PageStatus = pack.Fn<int, int, int>(H, "pageStatus", (p, c, r) => new[] { ("page", (object?)p), ("pageCount", c), ("rowCount", r) }),
        PageAnnouncement = pack.Fn<int, int>(H, "pageAnnouncement", (p, c) => new[] { ("page", (object?)p), ("pageCount", c) }),
        SortAnnouncement = pack.Pick<string, DataGridSortDirection>(H, "sortAnnouncement", (_, d) => LabelPack.Id(d), (h, _) => new[] { ("header", (object?)h) }),
        FilterAnnouncement = pack.Fn<int, int>(H, "filterAnnouncement", (m, t) => new[] { ("matches", (object?)m), ("total", t) }),
        SelectionAnnouncement = pack.Fn<int>(H, "selectionAnnouncement", n => new[] { ("count", (object?)n) }),
        ColumnMoveAnnouncement = pack.Fn<string, int, int>(H, "columnMoveAnnouncement", (h, p, c) => new[] { ("header", (object?)h), ("position", p), ("count", c) }),
        EditCell = pack.Fn<string, string>(H, "editCell", (h, r) => new[] { ("header", (object?)h), ("rowLabel", r) }),
        CellEditor = pack.Fn<string>(H, "cellEditor", h => new[] { ("header", (object?)h) }),
        EditAnnouncement = pack.Fn<string, string>(H, "editAnnouncement", (h, v) => new[] { ("header", (object?)h), ("value", v) }),
        Export = pack.Text(H, "export"),
        ExportCsv = pack.Text(H, "exportCsv"),
        ExportTsv = pack.Text(H, "exportTsv"),
        ExportExcel = pack.Text(H, "exportExcel"),
        ExportAnnouncement = pack.Fn<DataGridExportFormat, int, string>(H, "exportAnnouncement", (f, n, name) => new[] { ("format", (object?)LabelPack.Id(f)), ("count", n), ("filename", name) }),
        InvalidValue = pack.Fn<string, string>(H, "invalidValue", (h, t) => new[] { ("header", (object?)h), ("type", t) }),
        OpensInNewTab = pack.Fn<string>(H, "opensInNewTab", t => new[] { ("text", (object?)t) }),
        RadioGroup = pack.Fn<string, string>(H, "radioGroup", (h, r) => new[] { ("header", (object?)h), ("rowLabel", r) }),
        TimeZone = pack.Fn<string>(H, "timeZone", h => new[] { ("header", (object?)h) }),
        ExportUtcHeader = pack.Fn<string>(H, "exportUtcHeader", h => new[] { ("header", (object?)h) }),
        MorePeople = pack.Fn<int>(H, "morePeople", n => new[] { ("count", (object?)n) }),
        RemoveFile = pack.Fn<string>(H, "removeFile", n => new[] { ("name", (object?)n) }),
        FileInput = pack.Fn<string, string>(H, "fileInput", (h, r) => new[] { ("header", (object?)h), ("rowLabel", r) }),
        FormulaEditor = pack.Fn<string>(H, "formulaEditor", h => new[] { ("header", (object?)h) }),
        RollupDescription = pack.Fn<string>(H, "rollupDescription", h => new[] { ("header", (object?)h) }),
        EditCancelAnnouncement = pack.Fn<string>(H, "editCancelAnnouncement", h => new[] { ("header", (object?)h) }),
        EditError = pack.Fn<string, string>(H, "editError", (h, m) => new[] { ("header", (object?)h), ("message", m) }),
    };
}
