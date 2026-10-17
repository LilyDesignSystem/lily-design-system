// DataGrid — the types a consumer writes against: columns, labels, rows, values.
//
// Ported from the canonical Svelte package (its spec/index.md is the contract),
// translated to this catalog's idioms: records with init properties, enums for
// the closed string unions, RenderFragment for the snippets, and Func for the
// callbacks. See CellTypes.cs for what a column `Type` fills in.

using Microsoft.AspNetCore.Components;

namespace LilyDesignSystem.Blazor.Helpers;

/// <summary>One row of data: a dictionary of column id (or key) to value. Values are plain data: strings, numbers, booleans, civil dates as <c>"YYYY-MM-DD"</c> (or <see cref="DateOnly"/>), and the records below.</summary>
public sealed class DataGridRow : Dictionary<string, object?>
{
    /// <summary>An empty row.</summary>
    public DataGridRow() { }

    /// <summary>A row holding <paramref name="values"/>.</summary>
    public DataGridRow(IEnumerable<KeyValuePair<string, object?>> values) : base(values) { }
}

/// <summary>The kind of value in a column: a bundle of defaults for formatting, ordering, filtering, export, alignment and editor.</summary>
public enum DataGridCellType
{
    /// <summary>No type: the column is described by its own hooks alone.</summary>
    None,
    Text,
    Number,
    Link,
    Date,
    Time,
    /// <summary>A time of day and the zone it is stated in.</summary>
    TimeZone,
    Select,
    Radio,
    Person,
    File,
    Rollup,
    Formula,
}

/// <summary>The control a cell is edited with.</summary>
public enum DataGridEditor
{
    /// <summary>The column's type picks (a text field by default).</summary>
    Default,
    Text,
    Number,
    Link,
    Date,
    Time,
    TimeZone,
    Select,
    Radio,
    Person,
    Formula,
}

/// <summary>Which side a pinned column's header and cells are marked for.</summary>
public enum DataGridPinned
{
    None,
    Start,
    End,
}

/// <summary>Horizontal alignment of a column's cells.</summary>
public enum DataGridAlign
{
    Default,
    Start,
    Center,
    End,
}

/// <summary>How a rollup reduces its related values.</summary>
public enum DataGridAggregate
{
    Count,
    CountUnique,
    Sum,
    Avg,
    Median,
    Min,
    Max,
    Range,
    PercentTrue,
    PercentEmpty,
}

/// <summary>The type of a rollup's or formula's result, so it formats and sorts like one.</summary>
public enum DataGridResultType
{
    Text,
    Number,
    Date,
}

/// <summary>What a `Select` column sorts by.</summary>
public enum DataGridSortBy
{
    Label,
    Order,
}

/// <summary>What a `Select` or `Radio` column exports; for a `Person` column, `Email` exports the emails.</summary>
public enum DataGridExportAs
{
    Label,
    Id,
    Email,
}

/// <summary>Sort direction.</summary>
public enum DataGridSortDirection
{
    None,
    Ascending,
    Descending,
}

/// <summary>The current sort.</summary>
public sealed record DataGridSort(string ColumnId, DataGridSortDirection Direction)
{
    /// <summary>No sort.</summary>
    public static DataGridSort None { get; } = new("", DataGridSortDirection.None);
}

/// <summary>Row selection mode.</summary>
public enum DataGridSelectionMode
{
    None,
    Single,
    Multiple,
}

/// <summary><c>Grid</c> is a roving-tabindex grid; <c>Table</c> a plain table with ordinary tab stops.</summary>
public enum DataGridMode
{
    Grid,
    Table,
}

/// <summary>An option of a `Select` or `Radio` column. The label is displayed; the id is stored.</summary>
public sealed record DataGridOption(string Id, string Label, bool Disabled = false, string? Group = null);

/// <summary>A link value: an address, or an address with a label. A plain string is also accepted as a value.</summary>
public sealed record DataGridLink(string Href, string? Label = null, bool External = false);

/// <summary>A time of day and the zone it is stated in (an IANA zone id, or a bare offset such as <c>+01:00</c>).</summary>
public sealed record DataGridZonedTime(string Time, string TimeZone);

/// <summary>One person: the name is always shown as text; the avatar is the consumer's.</summary>
public sealed record DataGridPerson(string Id, string? Name = null, string? Email = null, string? AvatarUrl = null);

/// <summary>One file's metadata. The bytes live elsewhere; the grid never uploads.</summary>
public sealed record DataGridFile(string Id, string Name, long? Size = null, string? Type = null, string? Href = null);

/// <summary>What a formula engine hands back.</summary>
public abstract record DataGridFormulaResult
{
    /// <summary>A computed value.</summary>
    public static DataGridFormulaResult Of(object? value) => new DataGridFormulaValue(value);

    /// <summary>An error, shown as plain text with <c>data-error</c> on the cell.</summary>
    public static DataGridFormulaResult Error(string message) => new DataGridFormulaError(message);
}

/// <summary>A formula's value.</summary>
public sealed record DataGridFormulaValue(object? Value) : DataGridFormulaResult;

/// <summary>A formula's error.</summary>
public sealed record DataGridFormulaError(string Message) : DataGridFormulaResult;

/// <summary>What a formula engine is given. <c>Rows</c> is every row, for references to other rows.</summary>
public sealed record DataGridFormulaContext(DataGridRow Row, IReadOnlyList<DataGridRow> Rows, string ColumnId);

/// <summary>What a column's <c>Cell</c> fragment receives.</summary>
public sealed record DataGridCellContext(object? Value, string Formatted, DataGridRow Row, DataGridColumn Column);

/// <summary>What a person editor receives: the current value, and the two ways out.</summary>
public sealed record DataGridPersonEditorContext(object? Value, Action<object?> Commit, Action Cancel);

/// <summary>What <c>OnCellEdit</c> receives after a cell edit is committed.</summary>
public sealed record DataGridCellEdit(string RowId, DataGridRow Row, string ColumnId, object? Value, object? Previous);

/// <summary>What <c>OnCopy</c> receives: the text put on the clipboard and how many rows it holds.</summary>
public sealed record DataGridCopy(string Text, int RowCount);

/// <summary>Where missing values (null or "") sort.</summary>
public enum DataGridNulls
{
    Last,
    First,
}

/// <summary>What <c>OnFilesSelected</c> receives: the files the person chose. The grid uploads nothing.</summary>
public sealed record DataGridFilesSelected(string RowId, DataGridRow Row, string ColumnId, IReadOnlyList<Microsoft.AspNetCore.Components.Forms.IBrowserFile> Files);

/// <summary>What <c>OnFileRemove</c> receives.</summary>
public sealed record DataGridFileRemove(string RowId, DataGridRow Row, string ColumnId, string FileId);

/// <summary>What <c>ExportHandler</c> receives, before the file is saved.</summary>
public sealed record DataGridExport(DataGridExportFormat Format, string Filename, int RowCount, byte[] Bytes)
{
    /// <summary>The MIME type of the file.</summary>
    public string MimeType => ExportData.MimeType(Format);
}

/// <summary>
/// A column. Its <c>Type</c> fills in defaults for <c>Format</c>, <c>Compare</c>, <c>FilterText</c>, <c>ExportValue</c>,
/// <c>Align</c> and the editor; anything the column sets itself wins. See <c>spec/index.md</c>.
/// </summary>
public sealed record DataGridColumn
{
    /// <summary>Stable column identifier; also the default key read from each row.</summary>
    public required string Id { get; init; }

    /// <summary>Accessible + visible column header text.</summary>
    public required string Header { get; init; }

    /// <summary>Reads this column's raw value from a row. Defaults to <c>row[Id]</c>.</summary>
    public Func<DataGridRow, object?>? Accessor { get; init; }

    /// <summary>Formats a raw value for display. Defaults to the value's text (empty for null).</summary>
    public Func<object?, DataGridRow, string>? Format { get; init; }

    /// <summary>Column participates in sorting.</summary>
    public bool Sortable { get; init; }

    /// <summary>Orders two raw values when sorting. Null always sorts last, before this is called.</summary>
    public Func<object?, object?, int>? Compare { get; init; }

    /// <summary>Column participates in the text filter. Default true.</summary>
    public bool Filterable { get; init; } = true;

    /// <summary>Column can be resized (keyboard; dragging needs a pointer handler the consumer's CSS and JS provide).</summary>
    public bool Resizable { get; init; }

    /// <summary>Column can be reordered: Alt+ArrowLeft/Right on its focused header, or dragging the header onto another.</summary>
    public bool Movable { get; init; }

    /// <summary>Shown instead of nothing when this column's value is missing (null or ""). Overrides the grid's <c>EmptyValue</c>. A missing value always carries <c>data-empty</c> on its cell. No default: Lily ships no text.</summary>
    public string? EmptyValue { get; init; }

    /// <summary>Pins the column: its header and cells get <c>data-pinned="start|end"</c> for the consumer's sticky CSS.</summary>
    public DataGridPinned Pinned { get; init; }

    /// <summary>Set false to leave the column out of an export. Default true.</summary>
    public bool Exportable { get; init; } = true;

    /// <summary>The value this column exports for a row.</summary>
    public Func<DataGridRow, object?>? ExportValue { get; init; }

    /// <summary>Column can be hidden via the column-visibility control.</summary>
    public bool Hidable { get; init; }

    /// <summary>Initial pixel width, meaningful only when <c>Resizable</c>.</summary>
    public int? Width { get; init; }

    /// <summary>Custom cell content. Defaults to the formatted value as text.</summary>
    public RenderFragment<DataGridCellContext>? Cell { get; init; }

    /// <summary>The header's content in place of the <c>Header</c> text. <c>Header</c> stays the accessible name.</summary>
    public RenderFragment<DataGridColumn>? HeaderCell { get; init; }

    /// <summary>Cells can be edited in place: F2 or Enter on a focused cell, a double click, or the button <c>Labels.EditCell</c> gates.</summary>
    public bool Editable { get; init; }

    /// <summary>The editor's control. Default: the type picks.</summary>
    public DataGridEditor Editor { get; init; }

    /// <summary>The kind of value in this column.</summary>
    public DataGridCellType Type { get; init; }

    /// <summary>Culture name (BCP 47) for this column's formatting and collation. Falls back to the grid's <c>Locale</c>; with neither, values show as stored.</summary>
    public string? Locale { get; init; }

    /// <summary>`Select` and `Radio`: the choices.</summary>
    public IReadOnlyList<DataGridOption>? Options { get; init; }

    /// <summary>`Select`: sort by option label (default) or by option order. (`Radio` always sorts by order.)</summary>
    public DataGridSortBy SortBy { get; init; }

    /// <summary>`Select`/`Radio`: export the option's label (default) or its id. `Person`: <c>Email</c> exports the emails.</summary>
    public DataGridExportAs ExportAs { get; init; }

    /// <summary>`Number`: a .NET numeric format string (for example <c>"N2"</c>). Default <c>#,##0.###</c> under a locale.</summary>
    public string? NumberFormat { get; init; }

    /// <summary>`Date`: a .NET date format string. Default <c>"D"</c> under a locale.</summary>
    public string? DateFormat { get; init; }

    /// <summary>`Time` and `TimeZone`: a .NET time format string. Default <c>"t"</c> under a locale.</summary>
    public string? TimeFormat { get; init; }

    /// <summary>The text the grid's filter matches for a value. Default: the displayed text.</summary>
    public Func<object?, DataGridRow, string>? FilterText { get; init; }

    /// <summary>Turns the editor's text into the committed value.</summary>
    public Func<string, DataGridRow, object?>? Parse { get; init; }

    /// <summary>Refuses a value: return a message and the cell stays in edit mode with <c>aria-invalid</c>; return null to accept.</summary>
    public Func<object?, DataGridRow, string?>? Validate { get; init; }

    /// <summary>`TimeZone`: the zones the editor's select offers.</summary>
    public IReadOnlyList<DataGridOption>? TimeZones { get; init; }

    /// <summary>`TimeZone`: the date (ISO) that orders zoned times. Never computed by the grid.</summary>
    public string? ReferenceDate { get; init; }

    /// <summary>`TimeZone`: an export adds a second column holding the UTC time of day at <c>ReferenceDate</c>, headed by <c>Labels.ExportUtcHeader</c>.</summary>
    public bool ExportUtc { get; init; }

    /// <summary>`Rollup`: how the related values are reduced.</summary>
    public DataGridAggregate Aggregate { get; init; }

    /// <summary>`Rollup`: a reduction the named aggregates do not cover.</summary>
    public Func<IReadOnlyList<object?>, DataGridRow, object?>? Reduce { get; init; }

    /// <summary>`Rollup`: reads the related values. Defaults to the row's own list at <c>Id</c>.</summary>
    public Func<DataGridRow, IEnumerable<object?>>? Relation { get; init; }

    /// <summary>`Rollup` and `Formula`: the result's type.</summary>
    public DataGridResultType ResultType { get; init; }

    /// <summary>`Formula`: evaluates an expression. Lily ships no engine and never evaluates a string itself.</summary>
    public Func<string, DataGridFormulaContext, DataGridFormulaResult>? Evaluate { get; init; }

    /// <summary>`Person`: how many people show before "+N" (<c>Labels.MorePeople</c>).</summary>
    public int? MaxPeople { get; init; }

    /// <summary>`Person`: an avatar beside the name. Decorative: the name is always shown as text.</summary>
    public RenderFragment<DataGridPerson>? Avatar { get; init; }

    /// <summary>`Person`: the editor. Lily cannot look people up; without this a person cell is read-only.</summary>
    public RenderFragment<DataGridPersonEditorContext>? PersonEditor { get; init; }

    /// <summary>`File`: formats a size in bytes (no unit strings are bundled).</summary>
    public Func<long, string>? FormatSize { get; init; }

    /// <summary>`File`: the <c>accept</c> of the file input.</summary>
    public string? Accept { get; init; }

    /// <summary>`File`: whether the input takes several files. Default true.</summary>
    public bool Multiple { get; init; } = true;

    /// <summary>Body cells of this column are <c>&lt;th scope="row" role="rowheader"&gt;</c>.</summary>
    public bool RowHeader { get; init; }

    /// <summary>Horizontal alignment of the column's cells (<c>data-align</c> and <c>text-align</c>).</summary>
    public DataGridAlign Align { get; init; }

    /// <summary>Extra class on each body cell of this column.</summary>
    public Func<DataGridCellContext, string?>? CellClass { get; init; }

    /// <summary>Extra attributes on each body cell of this column.</summary>
    public Func<DataGridCellContext, IReadOnlyDictionary<string, object>?>? CellAttrs { get; init; }

    // Set by CellTypes.Resolve for a formula column.

    /// <summary>Set for a <c>Formula</c> column by the grid: reads the expression a row holds.</summary>
    public Func<DataGridRow, object?>? Source { get; init; }

    /// <summary>Set for a <c>Formula</c> column by the grid: the error message for a row, if any.</summary>
    public Func<DataGridRow, string?>? ErrorOf { get; init; }
}

/// <summary>
/// Every field is optional, but its presence gates the control it names — no baked-in English fallback.
/// See the Svelte canonical's <c>spec/index.md §5</c>.
/// </summary>
public sealed record DataGridLabels
{
    public string? Search { get; init; }
    /// <summary>Names the select that limits the search to one column; it shows when <c>Search</c>, this and <c>SearchAllFields</c> are all set.</summary>
    public string? SearchField { get; init; }
    /// <summary>The select's option for every filterable column.</summary>
    public string? SearchAllFields { get; init; }
    /// <summary>Names the pager as a <c>&lt;nav&gt;</c> landmark; without it the pager is a plain <c>&lt;div&gt;</c>.</summary>
    public string? Pagination { get; init; }
    /// <summary>A button that puts the export (header row first, tab-separated) on the clipboard.</summary>
    public string? Copy { get; init; }
    /// <summary>Announced after a copy: (how many rows).</summary>
    public Func<int, string>? CopyAnnouncement { get; init; }
    /// <summary>Announced when the clipboard refused the copy.</summary>
    public string? CopyFailed { get; init; }
    /// <summary>Announced after an undo: (header, the restored text).</summary>
    public Func<string, string, string>? UndoAnnouncement { get; init; }
    /// <summary>Announced after a redo: (header, the re-applied text).</summary>
    public Func<string, string, string>? RedoAnnouncement { get; init; }
    public string? ColumnVisibility { get; init; }
    public Func<string, string>? ColumnVisibilityOption { get; init; }
    public Func<string, string>? ResizeHandle { get; init; }
    public string? SelectAll { get; init; }
    public string? SelectionColumn { get; init; }
    public Func<string, string>? SelectRow { get; init; }
    public string? PreviousPage { get; init; }
    public string? NextPage { get; init; }
    public Func<int, int, int, string>? PageStatus { get; init; }
    public Func<int, int, string>? PageAnnouncement { get; init; }
    public Func<string, DataGridSortDirection, string>? SortAnnouncement { get; init; }
    public Func<int, int, string>? FilterAnnouncement { get; init; }
    public Func<int, string>? SelectionAnnouncement { get; init; }
    public Func<string, int, int, string>? ColumnMoveAnnouncement { get; init; }
    public Func<string, string, string>? EditCell { get; init; }
    public Func<string, string>? CellEditor { get; init; }
    public Func<string, string, string>? EditAnnouncement { get; init; }
    public string? Export { get; init; }
    public string? ExportCsv { get; init; }
    public string? ExportTsv { get; init; }
    public string? ExportExcel { get; init; }
    public Func<DataGridExportFormat, int, string, string>? ExportAnnouncement { get; init; }
    public Func<string, string, string>? InvalidValue { get; init; }
    public Func<string, string>? OpensInNewTab { get; init; }
    public Func<string, string, string>? RadioGroup { get; init; }
    public Func<string, string>? TimeZone { get; init; }
    public Func<string, string>? ExportUtcHeader { get; init; }
    public Func<int, string>? MorePeople { get; init; }
    public Func<string, string>? RemoveFile { get; init; }
    public Func<string, string, string>? FileInput { get; init; }
    public Func<string, string>? FormulaEditor { get; init; }
    public Func<string, string>? RollupDescription { get; init; }
    public Func<string, string>? EditCancelAnnouncement { get; init; }
    public Func<string, string, string>? EditError { get; init; }
}

/// <summary>Virtualization settings: the grid renders only the rows in view, in a scroll region of <c>Height</c> px.</summary>
public sealed record DataGridVirtualize(int RowHeight, int Height, int Overscan = 3);
