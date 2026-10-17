// DataGrid — code-behind. See spec/index.md for the contract.
//
// Ported from the canonical Svelte package (lily-design-system-svelte-data-grid),
// translated to this catalog's idioms: partial-class code-behind, bindable
// parameters as a value plus a <Name>Changed EventCallback, AdditionalAttributes
// splatting instead of a headless `active` prop (the Blazor DataTable family has
// none), and JS-eval-by-id focus calls where no component exposes an
// ElementReference (the same pattern KanbanBoard and DateTimePicker use).
//
// Deviations from the Svelte reference, all forced by Blazor (see spec/index.md § Blazor idioms):
//   * a key event carries no target element, so the grid cannot tell "a key pressed on the cell"
//     from "a key pressed on a widget inside it"; the grid's own editors stop their keys, and a
//     consumer's widgets in a cell are ordinary tab stops (no cell-entering model);
//   * a handler cannot conditionally preventDefault, so an arrow key may also scroll the page;
//   * the resize handle is keyboard-only (ArrowLeft/ArrowRight), with no pointer drag;
//   * an input method's Enter reports key "Process", which is how composition is ignored;
//   * a time-zone editor commits on Enter (focus leaving the pair is not observable);
//   * the file input is Blazor's InputFile (IBrowserFile, no File objects), and dropping onto it is the browser's own.

using System.Globalization;
using System.Text;
using System.Text.Json;
using LilyBlazorHeadless.Components;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Forms;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.JSInterop;

namespace LilyDesignSystem.Blazor.Helpers;

/// <summary>What a footer fragment receives.</summary>
public sealed record DataGridFooterContext(IReadOnlyList<DataGridColumn> Columns, IReadOnlyList<DataGridRow> Rows);

/// <summary>An interactive data grid over the headless DataTable family. See <c>spec/index.md</c>.</summary>
public partial class DataGrid : ComponentBase
{
    private static int _uid;

    // -------------------------------------------------------------------
    // Parameters
    // -------------------------------------------------------------------

    /// <summary>What a cell shows when its value is missing (null or ""), for example "—". A column's own <c>EmptyValue</c> wins. No default. The cell always carries <c>data-empty</c>.</summary>
    [Parameter] public string? EmptyValue { get; set; }

    /// <summary>Where missing values sort: <c>Last</c> (default) or <c>First</c>, in both directions.</summary>
    [Parameter] public DataGridNulls Nulls { get; set; } = DataGridNulls.Last;

    /// <summary>Limits the text filter to one column id, or "" (default) for every filterable column.</summary>
    [Parameter] public string FilterField { get; set; } = "";

    /// <summary>Called with the new <c>FilterField</c> after every change.</summary>
    [Parameter] public EventCallback<string> FilterFieldChanged { get; set; }

    /// <summary>A predicate over the rows, applied before the text filter; rows it rejects are not shown.</summary>
    [Parameter] public Func<DataGridRow, bool>? RowFilter { get; set; }

    /// <summary>The reading direction, "ltr" (default) or "rtl": in right-to-left the horizontal arrow keys swap. Blazor cannot read the DOM's <c>dir</c> without JS interop, so the consumer says.</summary>
    [Parameter] public string? Direction { get; set; }

    /// <summary>Called with the text before it goes on the clipboard; return false to take the copy over.</summary>
    [Parameter] public Func<DataGridCopy, bool>? CopyHandler { get; set; }

    /// <summary>Called after a copy was prepared (the text, the row count).</summary>
    [Parameter] public EventCallback<DataGridCopy> OnCopy { get; set; }

    /// <summary>Accessible name for the grid, passed through to DataTable.</summary>
    [Parameter, EditorRequired] public string Label { get; set; } = "";

    /// <summary>Optional visible caption, rendered as a literal <c>&lt;caption&gt;</c> (DataTable has no caption slot).</summary>
    [Parameter] public string? Caption { get; set; }

    /// <summary>Column definitions.</summary>
    [Parameter, EditorRequired] public IReadOnlyList<DataGridColumn> Columns { get; set; } = Array.Empty<DataGridColumn>();

    /// <summary>Row data.</summary>
    [Parameter, EditorRequired] public IReadOnlyList<DataGridRow> Rows { get; set; } = Array.Empty<DataGridRow>();

    /// <summary>BCP 47 culture name for the typed columns' formatting and collation. Never defaulted: with none, values show as stored.</summary>
    [Parameter] public string? Locale { get; set; }

    /// <summary>Derives a stable id per row. Defaults to the row's index in <c>Rows</c>.</summary>
    [Parameter] public Func<DataGridRow, int, string>? RowId { get; set; }

    /// <summary>Row selection mode.</summary>
    [Parameter] public DataGridSelectionMode SelectionMode { get; set; } = DataGridSelectionMode.None;

    /// <summary>Selected row ids. Bindable: <c>@bind-Selected</c>.</summary>
    [Parameter] public IReadOnlyList<string> Selected { get; set; } = Array.Empty<string>();
    [Parameter] public EventCallback<IReadOnlyList<string>> SelectedChanged { get; set; }

    /// <summary>Text filter. Bindable: <c>@bind-Filter</c>.</summary>
    [Parameter] public string Filter { get; set; } = "";
    [Parameter] public EventCallback<string> FilterChanged { get; set; }

    /// <summary>Current sort. Bindable: <c>@bind-Sort</c>.</summary>
    [Parameter] public DataGridSort Sort { get; set; } = DataGridSort.None;
    [Parameter] public EventCallback<DataGridSort> SortChanged { get; set; }

    /// <summary>Column ids in display order. Bindable: <c>@bind-ColumnOrder</c>; columns it does not name follow in their <c>Columns</c> order.</summary>
    [Parameter] public IReadOnlyList<string> ColumnOrder { get; set; } = Array.Empty<string>();
    [Parameter] public EventCallback<IReadOnlyList<string>> ColumnOrderChanged { get; set; }

    /// <summary>Rows per page. Unset disables pagination.</summary>
    [Parameter] public int? PageSize { get; set; }

    /// <summary>Current 1-indexed page. Bindable: <c>@bind-Page</c>.</summary>
    [Parameter] public int Page { get; set; } = 1;
    [Parameter] public EventCallback<int> PageChanged { get; set; }

    /// <summary>If set, persist column widths / hidden columns / sort to <c>localStorage</c> (restored after the first render, so server rendering is unaffected).</summary>
    [Parameter] public string? StorageKey { get; set; }

    /// <summary>User-facing strings. See <see cref="DataGridLabels"/> — presence gates each control.</summary>
    [Parameter] public DataGridLabels Labels { get; set; } = new();

    /// <summary><c>Grid</c> (default): roving-tabindex grid. <c>Table</c>: a plain table with ordinary tab stops.</summary>
    [Parameter] public DataGridMode Mode { get; set; } = DataGridMode.Grid;

    /// <summary>Extra class on each body row.</summary>
    [Parameter] public Func<DataGridRow, string?>? RowClass { get; set; }

    /// <summary>Extra attributes on each body row.</summary>
    [Parameter] public Func<DataGridRow, IReadOnlyDictionary<string, object>?>? RowAttrs { get; set; }

    /// <summary>Enter on a body cell with no widget, or a click outside any widget.</summary>
    [Parameter] public EventCallback<(DataGridRow Row, string Id)> OnRowActivate { get; set; }

    /// <summary>Shown in one row spanning every column when no row is to be shown.</summary>
    [Parameter] public RenderFragment? Empty { get; set; }

    /// <summary>Rendered inside a <c>&lt;tfoot&gt;</c>.</summary>
    [Parameter] public RenderFragment<DataGridFooterContext>? Footer { get; set; }

    /// <summary>Sets <c>aria-busy</c> on the table.</summary>
    [Parameter] public bool Busy { get; set; }

    /// <summary>Wrap the table in a scrollable <c>data-grid-scroll</c> region. Default true.</summary>
    [Parameter] public bool Scroll { get; set; } = true;

    /// <summary>The file name without its extension. Default <c>"data-grid"</c>.</summary>
    [Parameter] public string ExportFilename { get; set; } = "data-grid";

    /// <summary>What an export holds: <c>View</c> (default) is every row the filter leaves, in the current sort and not just the shown page; <c>Selected</c> is only the selected rows.</summary>
    [Parameter] public DataGridExportScope ExportScope { get; set; } = DataGridExportScope.View;

    /// <summary><c>.xlsx</c> only: a <c>Formula</c> column keeps the live expression with the result cached. CSV and TSV always carry the result.</summary>
    [Parameter] public bool ExportFormulas { get; set; }

    /// <summary>Called with the file before it is saved. Return false to keep the grid from saving it (to upload it, say).</summary>
    [Parameter] public Func<DataGridExport, bool>? ExportHandler { get; set; }

    /// <summary>Raised with the file before it is saved (a notification; <see cref="ExportHandler"/> can veto).</summary>
    [Parameter] public EventCallback<DataGridExport> OnExport { get; set; }

    /// <summary>Raised after a cell edit is committed. The consumer updates <c>Rows</c>; the grid never mutates them.</summary>
    [Parameter] public EventCallback<DataGridCellEdit> OnCellEdit { get; set; }

    /// <summary>`File` columns: raised with the files the person chose. Lily does not upload: the consumer does, then updates <c>Rows</c>.</summary>
    [Parameter] public EventCallback<DataGridFilesSelected> OnFilesSelected { get; set; }

    /// <summary>`File` columns: raised when a file's remove button is pressed.</summary>
    [Parameter] public EventCallback<DataGridFileRemove> OnFileRemove { get; set; }

    /// <summary>Renders only the rows in view, in a scroll region (needs <c>Scroll</c>).</summary>
    [Parameter] public DataGridVirtualize? Virtualize { get; set; }

    /// <summary>Extra CSS class on the root.</summary>
    [Parameter] public string CssClass { get; set; } = "";

    /// <summary>Additional HTML attributes spread onto the root.</summary>
    [Parameter(CaptureUnmatchedValues = true)] public Dictionary<string, object>? AdditionalAttributes { get; set; }

    [Inject] private IJSRuntime JS { get; set; } = default!;

    // -------------------------------------------------------------------
    // State
    // -------------------------------------------------------------------

    private readonly string _gridId = $"data-grid-{Interlocked.Increment(ref _uid)}";
    private string _statusMessage = "";
    private readonly HashSet<string> _hiddenColumnIds = new();
    private readonly Dictionary<string, int> _columnWidths = new();
    private int _focusedRow = -1; // -1 = header row
    private int _focusedCol;
    private int _lastSelectedIndex = -1;
    private bool _focusPending;
    private bool _focusEditorPending;
    private bool _restored;
    private bool _indeterminateDirty = true;
    private double _scrollTop;
    private string? _draggingColumnId;

    /// <summary>The cell the person is editing.</summary>
    private sealed record Editing(string RowId, string ColumnId, string Draft, string? Zone = null, string? Error = null, bool Invalid = false);
    private Editing? _editing;

    private sealed record Entry(DataGridRow Row, string Id);

    // Derived data, rebuilt by Recompute().
    private IReadOnlyList<DataGridColumn> _resolved = Array.Empty<DataGridColumn>();
    private IReadOnlyList<Entry> _entries = Array.Empty<Entry>();
    private IReadOnlyList<Entry> _filtered = Array.Empty<Entry>();
    private IReadOnlyList<Entry> _sorted = Array.Empty<Entry>();
    private IReadOnlyList<Entry> _pageEntries = Array.Empty<Entry>();
    private IReadOnlyList<DataGridColumn> _ordered = Array.Empty<DataGridColumn>();
    private IReadOnlyList<DataGridColumn> _visible = Array.Empty<DataGridColumn>();
    private IReadOnlyList<DataGridRow>? _resolvedFromRows;
    private IReadOnlyList<DataGridColumn>? _resolvedFromColumns;
    private string? _resolvedFromLocale;
    private List<string[]> _searchIndex = new();
    private IReadOnlyList<DataGridColumn> _filterable = Array.Empty<DataGridColumn>();
    private EditHistory _history = EditHistory.Empty;
    private Typeahead.State _typeahead = new("", 0);
    private bool Rtl => string.Equals(Direction, "rtl", StringComparison.OrdinalIgnoreCase);
    private System.Runtime.CompilerServices.ConditionalWeakTable<DataGridRow, Dictionary<string, DataGridCellContext>> _cellCache = new();

    private bool IsGrid => Mode == DataGridMode.Grid;
    private bool HasSelection => SelectionMode != DataGridSelectionMode.None;
    private int ColOffset => HasSelection ? 1 : 0;
    private int LastCol => ColOffset + _visible.Count - 1;
    private string RootClass => $"data-grid {CssClass}".Trim();
    private string RootId => $"{_gridId}-root";
    private string ScrollId => $"{_gridId}-scroll";
    private string CellId(int row, int col) => $"{_gridId}-cell-{row}-{col}";
    private int PageCount => PageSize is { } size && size > 0 ? Math.Max(1, (int)Math.Ceiling(_sorted.Count / (double)size)) : 1;
    private int ClampedPage => Math.Min(Math.Max(Page, 1), PageCount);
    private int PageStart => PageSize is { } size && size > 0 ? (ClampedPage - 1) * size : 0;
    private int ActiveRow => Math.Max(-1, Math.Min(_focusedRow, _pageEntries.Count - 1));
    private int ActiveCol => Math.Max(0, Math.Min(_focusedCol, LastCol));
    private bool Indexed => PageSize is not null || Virtualize is not null;
    private int? RowCount => PageSize is not null ? _sorted.Count + 1 : Virtualize is not null ? _pageEntries.Count + 1 : null;
    private HashSet<string> SelectedSet => new(Selected);
    private bool HasExportButtons => Labels.Copy is not null || Labels.ExportCsv is not null || Labels.ExportTsv is not null || Labels.ExportExcel is not null;
    private IReadOnlyList<DataGridColumn> HidableColumns => _resolved.Where(c => c.Hidable).ToList();

    // -------------------------------------------------------------------
    // Derived data
    // -------------------------------------------------------------------

    protected override void OnParametersSet() => Recompute();

    private static object? RawValue(DataGridColumn column, DataGridRow row)
        => column.Accessor is not null ? column.Accessor(row) : row.TryGetValue(column.Id, out var value) ? value : null;

    private static string FormatRaw(DataGridColumn column, DataGridRow row, object? value)
        => column.Format is not null ? column.Format(value, row) : value?.ToString() ?? "";

    /// <summary>Each cell's value and formatted text, read once per row object and column (reset when the columns are resolved again).</summary>
    private DataGridCellContext CellFor(DataGridColumn column, DataGridRow row)
    {
        var perRow = _cellCache.GetValue(row, _ => new Dictionary<string, DataGridCellContext>());
        if (!perRow.TryGetValue(column.Id, out var ctx))
        {
            var value = RawValue(column, row);
            ctx = new DataGridCellContext(value, FormatRaw(column, row, value), row, column);
            perRow[column.Id] = ctx;
        }
        return ctx;
    }

    private void Recompute()
    {
        // Resolve the columns (type defaults, rollup and formula results) only when their inputs changed.
        if (!ReferenceEquals(_resolvedFromColumns, Columns) || !ReferenceEquals(_resolvedFromRows, Rows) || _resolvedFromLocale != Locale)
        {
            _resolved = Columns.Select(c => CellTypes.Resolve(c, Locale, Rows)).ToList();
            _resolvedFromColumns = Columns;
            _resolvedFromRows = Rows;
            _resolvedFromLocale = Locale;
            _cellCache = new();
            var rowId = RowId ?? ((_, index) => index.ToString(CultureInfo.InvariantCulture));
            _entries = Rows.Select((row, index) => new Entry(row, rowId(row, index))).ToList();
            var filterable = _resolved.Where(c => c.Filterable).ToList();
            _filterable = filterable;
            _searchIndex = _entries.Select(entry => filterable.Select(column =>
            {
                var ctx = CellFor(column, entry.Row);
                return SearchText.Fold(column.FilterText is not null ? column.FilterText(ctx.Value, entry.Row) : ctx.Formatted);
            }).ToArray()).ToList();
        }

        // Columns in display order: those named in ColumnOrder first, the rest after in their own order.
        var order = ColumnOrder;
        if (order.Count == 0) _ordered = _resolved;
        else
        {
            int Rank(string id) { var i = order.ToList().IndexOf(id); return i == -1 ? order.Count : i; }
            _ordered = _resolved.Select((c, i) => (c, i)).OrderBy(x => Rank(x.c.Id)).ThenBy(x => x.i).Select(x => x.c).ToList();
        }
        _visible = _ordered.Where(c => !_hiddenColumnIds.Contains(c.Id)).ToList();

        var terms = SearchText.Terms(Filter);
        var only = FilterField.Length > 0 ? _filterable.ToList().FindIndex(c => c.Id == FilterField) : -1;
        _filtered = terms.Count == 0 && RowFilter is null
            ? _entries
            : _entries.Where((entry, i) =>
                (RowFilter is null || RowFilter(entry.Row)) &&
                (terms.Count == 0 || (only >= 0
                    ? SearchText.MatchesFolded(_searchIndex[i][only], terms)
                    : terms.All(term => _searchIndex[i].Any(value => value.Contains(term, StringComparison.Ordinal)))))).ToList();

        _sorted = _filtered;
        if (Sort.Direction != DataGridSortDirection.None && Sort.ColumnId.Length > 0 && _resolved.FirstOrDefault(c => c.Id == Sort.ColumnId) is { } column)
        {
            var dir = Sort.Direction == DataGridSortDirection.Ascending ? 1 : -1;
            // Read each sort key once, not twice per comparison; missing values sort last in both directions.
            var keyed = _filtered.Select((entry, i) => (entry, i, key: CellFor(column, entry.Row).Value)).ToList();
            keyed.Sort((a, b) =>
            {
                if (ReferenceEquals(a.key, b.key)) return a.i.CompareTo(b.i);
                var aMissing = IsMissing(a.key);
                var bMissing = IsMissing(b.key);
                if (aMissing || bMissing)
                {
                    if (aMissing && bMissing) return a.i.CompareTo(b.i);
                    return (aMissing ? 1 : -1) * (Nulls == DataGridNulls.First ? -1 : 1);
                }
                var result = column.Compare is not null ? column.Compare(a.key, b.key) * dir : CellTypes.DefaultCompare(a.key, b.key) * dir;
                return result != 0 ? result : a.i.CompareTo(b.i); // a stable sort
            });
            _sorted = keyed.Select(k => k.entry).ToList();
        }

        _pageEntries = PageSize is { } size && size > 0 ? _sorted.Skip(PageStart).Take(size).ToList() : _sorted;
    }

    // -------------------------------------------------------------------
    // Announcements, sorting, filtering
    // -------------------------------------------------------------------

    private void Announce(string? message)
    {
        if (!string.IsNullOrEmpty(message)) _statusMessage = message;
    }

    private string? AriaSortFor(DataGridColumn column)
    {
        if (!column.Sortable) return null;
        var direction = Sort.ColumnId == column.Id ? Sort.Direction : DataGridSortDirection.None;
        return direction switch { DataGridSortDirection.Ascending => "ascending", DataGridSortDirection.Descending => "descending", _ => "none" };
    }

    private async Task ToggleSortAsync(DataGridColumn column)
    {
        if (!column.Sortable) return;
        var next = Sort.ColumnId != column.Id
            ? new DataGridSort(column.Id, DataGridSortDirection.Ascending)
            : Sort.Direction == DataGridSortDirection.Ascending
                ? new DataGridSort(column.Id, DataGridSortDirection.Descending)
                : Sort.Direction == DataGridSortDirection.Descending
                    ? DataGridSort.None
                    : new DataGridSort(column.Id, DataGridSortDirection.Ascending);
        Sort = next;
        Recompute();
        await SortChanged.InvokeAsync(next);
        Announce(Labels.SortAnnouncement?.Invoke(column.Header, next.Direction));
        await PersistAsync();
    }

    /// <summary>A value the cell treats as missing: null or an empty string.</summary>
    private static bool IsMissing(object? value) => value is null || value is string { Length: 0 };

    private string? EmptyTextFor(DataGridColumn column) => column.EmptyValue ?? EmptyValue;

    private async Task OnSearchFieldChangeAsync(ChangeEventArgs args)
    {
        FilterField = args.Value?.ToString() ?? "";
        Page = 1;
        Recompute();
        await FilterFieldChanged.InvokeAsync(FilterField);
        await PageChanged.InvokeAsync(Page);
        Announce(Labels.FilterAnnouncement?.Invoke(_filtered.Count, Rows.Count));
    }

    /// <summary>Escape in the search field clears it.</summary>
    private async Task OnSearchKeyDownAsync(KeyboardEventArgs args)
    {
        if (args.Key == "Escape" && Filter.Length > 0) await SetFilterAsync("");
    }

    private Task OnFilterInputAsync(ChangeEventArgs args) => SetFilterAsync(args.Value?.ToString() ?? "");

    private async Task SetFilterAsync(string value)
    {
        Filter = value;
        Page = 1;
        Recompute();
        await FilterChanged.InvokeAsync(Filter);
        await PageChanged.InvokeAsync(Page);
        Announce(Labels.FilterAnnouncement?.Invoke(_filtered.Count, Rows.Count));
    }

    // -------------------------------------------------------------------
    // Selection
    // -------------------------------------------------------------------

    private bool IsSelected(string id) => Selected.Contains(id);
    private bool AllSelected => _sorted.Count > 0 && _sorted.All(e => Selected.Contains(e.Id));
    private bool SomeSelected => !AllSelected && _sorted.Any(e => Selected.Contains(e.Id));

    private async Task SetSelectedAsync(IReadOnlyList<string> next)
    {
        Selected = next;
        _indeterminateDirty = true;
        await SelectedChanged.InvokeAsync(next);
        Announce(Labels.SelectionAnnouncement?.Invoke(next.Count));
    }

    /// <summary><paramref name="index"/> is the row's position in the sorted entries, not on the current page.</summary>
    private async Task ToggleRowAsync(int index, bool shift = false, bool ctrlOrMeta = false)
    {
        var id = _sorted[index].Id;
        if (SelectionMode == DataGridSelectionMode.Single)
        {
            await SetSelectedAsync(IsSelected(id) ? Array.Empty<string>() : new[] { id });
        }
        else if (SelectionMode == DataGridSelectionMode.Multiple)
        {
            if (shift && _lastSelectedIndex >= 0)
            {
                var (start, end) = _lastSelectedIndex < index ? (_lastSelectedIndex, index) : (index, _lastSelectedIndex);
                var range = _sorted.Skip(start).Take(end - start + 1).Select(e => e.Id);
                await SetSelectedAsync(Selected.Union(range).ToList());
            }
            else if (ctrlOrMeta)
            {
                await SetSelectedAsync(IsSelected(id) ? Selected.Where(x => x != id).ToList() : Selected.Append(id).ToList());
            }
            else
            {
                await SetSelectedAsync(IsSelected(id) && Selected.Count == 1 ? Array.Empty<string>() : new[] { id });
            }
        }
        _lastSelectedIndex = index;
    }

    private async Task ToggleSelectAllAsync()
        => await SetSelectedAsync(AllSelected ? Array.Empty<string>() : _sorted.Select(e => e.Id).ToList());

    // -------------------------------------------------------------------
    // Column resize (keyboard), visibility, pagination
    // -------------------------------------------------------------------

    private const int MinColumnWidth = 40;
    private const int ResizeStep = 16;

    private int? WidthFor(DataGridColumn column) => _columnWidths.TryGetValue(column.Id, out var w) ? w : column.Width;

    /// <summary>Inline style of a column's cells: its width, and its alignment where one is set.</summary>
    private string? CellStyle(DataGridColumn column)
    {
        var parts = new List<string>();
        if (WidthFor(column) is { } width && width > 0) parts.Add($"width:{width}px");
        var align = column.Align switch { DataGridAlign.Start => "start", DataGridAlign.Center => "center", DataGridAlign.End => "end", _ => null };
        if (align is not null) parts.Add($"text-align:{align}");
        return parts.Count > 0 ? string.Join(";", parts) : null;
    }

    private static string? AlignName(DataGridColumn column)
        => column.Align switch { DataGridAlign.Start => "start", DataGridAlign.Center => "center", DataGridAlign.End => "end", _ => null };

    private static string? PinnedName(DataGridColumn column)
        => column.Pinned switch { DataGridPinned.Start => "start", DataGridPinned.End => "end", _ => null };

    private static string? TypeName(DataGridColumn column) => column.Type switch
    {
        DataGridCellType.None => null,
        DataGridCellType.TimeZone => "time-zone",
        var t => t.ToString().ToLowerInvariant(),
    };

    private async Task OnResizeKeyDownAsync(DataGridColumn column, KeyboardEventArgs args)
    {
        var current = WidthFor(column) ?? 120;
        if (args.Key == "ArrowRight") _columnWidths[column.Id] = Math.Max(MinColumnWidth, current + ResizeStep);
        else if (args.Key == "ArrowLeft") _columnWidths[column.Id] = Math.Max(MinColumnWidth, current - ResizeStep);
        else return;
        await PersistAsync();
    }

    private async Task ToggleColumnVisibilityAsync(string columnId)
    {
        if (!_hiddenColumnIds.Remove(columnId)) _hiddenColumnIds.Add(columnId);
        Recompute();
        await PersistAsync();
    }

    private async Task GoToPageAsync(int next)
    {
        var target = Math.Min(Math.Max(next, 1), PageCount);
        if (target == ClampedPage) return;
        Page = target;
        Recompute();
        await PageChanged.InvokeAsync(target);
        Announce(Labels.PageAnnouncement?.Invoke(target, PageCount));
    }

    // -------------------------------------------------------------------
    // Column reorder
    // -------------------------------------------------------------------

    /// <summary>Move <paramref name="columnId"/> to sit at <paramref name="toVisibleIndex"/> among the visible columns. Returns whether it moved.</summary>
    private async Task<bool> MoveColumnAsync(string columnId, int toVisibleIndex)
    {
        var ids = _visible.Select(c => c.Id).ToList();
        var from = ids.IndexOf(columnId);
        var to = Math.Min(Math.Max(toVisibleIndex, 0), ids.Count - 1);
        if (from == -1 || from == to) return false;
        ids.RemoveAt(from);
        ids.Insert(to, columnId);
        // Hidden columns keep their places in the full order; visible ones are re-sequenced around them.
        var visibleSet = ids.ToHashSet();
        var next = 0;
        var order = _ordered.Select(c => visibleSet.Contains(c.Id) ? ids[next++] : c.Id).ToList();
        ColumnOrder = order;
        Recompute();
        await ColumnOrderChanged.InvokeAsync(order);
        var column = _resolved.First(c => c.Id == columnId);
        Announce(Labels.ColumnMoveAnnouncement?.Invoke(column.Header, to + 1, ids.Count));
        return true;
    }

    private void OnHeaderDragStart(DataGridColumn column)
    {
        if (column.Movable) _draggingColumnId = column.Id;
    }

    private async Task OnHeaderDropAsync(DataGridColumn target)
    {
        var id = _draggingColumnId;
        _draggingColumnId = null;
        if (id is null || id == target.Id) return;
        var to = _visible.ToList().FindIndex(c => c.Id == target.Id);
        if (to >= 0) await MoveColumnAsync(id, to);
    }

    // -------------------------------------------------------------------
    // Windowing (virtualize)
    // -------------------------------------------------------------------

    private sealed record RenderItem(bool Spacer, int Index, int Rows);

    private IReadOnlyList<RenderItem> RenderItems()
    {
        var total = _pageEntries.Count;
        if (Virtualize is not { } v) return Enumerable.Range(0, total).Select(i => new RenderItem(false, i, 0)).ToList();
        var start = Math.Max(0, (int)Math.Floor(_scrollTop / v.RowHeight) - v.Overscan);
        var end = Math.Min(total, (int)Math.Ceiling((_scrollTop + v.Height) / v.RowHeight) + v.Overscan);
        var indices = new SortedSet<int>();
        for (var i = start; i < end; i++) indices.Add(i);
        if (ActiveRow >= 0 && ActiveRow < total) indices.Add(ActiveRow);
        var items = new List<RenderItem>();
        var previous = -1;
        foreach (var index in indices)
        {
            if (index - previous > 1) items.Add(new RenderItem(true, previous, index - previous - 1));
            items.Add(new RenderItem(false, index, 0));
            previous = index;
        }
        if (total - 1 - previous > 0) items.Add(new RenderItem(true, previous, total - 1 - previous));
        return items;
    }

    private async Task OnScrollAsync()
    {
        if (Virtualize is null) return;
        try
        {
            _scrollTop = await JS.InvokeAsync<double>("eval", $"document.getElementById({JsonString(ScrollId)})?.scrollTop ?? 0");
        }
        catch
        {
            // ignore prerender / interop failure
        }
    }

    private void RevealRow(int index)
    {
        if (Virtualize is not { } v || index < 0) return;
        var top = index * v.RowHeight;
        var next = _scrollTop;
        if (top < _scrollTop) next = top;
        else if (top + v.RowHeight > _scrollTop + v.Height) next = top + v.RowHeight - v.Height;
        if (next == _scrollTop) return;
        _scrollTop = next;
        _scrollToPending = next;
    }

    private double? _scrollToPending;

    // -------------------------------------------------------------------
    // Export
    // -------------------------------------------------------------------

    private IReadOnlyList<DataGridColumn> ExportColumns => _visible.Where(c => c.Exportable).ToList();

    private IReadOnlyList<Entry> ExportEntries
        => ExportScope == DataGridExportScope.Selected ? _sorted.Where(e => Selected.Contains(e.Id)).ToList() : _sorted;

    /// <summary>One cell for an export: typed values stay typed, everything else is the text the grid shows.</summary>
    private object? ExportCell(DataGridColumn column, DataGridRow row)
    {
        if (column.ExportValue is not null) return column.ExportValue(row);
        var ctx = CellFor(column, row);
        return ctx.Value switch
        {
            null => null,
            double or float or int or long or short or byte or decimal or bool or DateTime or DateOnly => ctx.Value,
            _ => ctx.Formatted,
        };
    }

    private bool HasUtcColumn(DataGridColumn c)
        => c.Type == DataGridCellType.TimeZone && c.ExportUtc && !string.IsNullOrEmpty(c.ReferenceDate) && Labels.ExportUtcHeader is not null;

    private ExportTable BuildExportTable(DataGridExportFormat format)
    {
        var live = (DataGridColumn c) => format == DataGridExportFormat.Xlsx && ExportFormulas && c.Type == DataGridCellType.Formula && c.Source is not null;
        var headers = new List<string>();
        foreach (var c in ExportColumns)
        {
            headers.Add(c.Header);
            if (HasUtcColumn(c)) headers.Add(Labels.ExportUtcHeader!(c.Header));
        }
        var rows = new List<IReadOnlyList<object?>>();
        foreach (var entry in ExportEntries)
        {
            var cells = new List<object?>();
            foreach (var c in ExportColumns)
            {
                var expression = live(c) ? c.Source!(entry.Row) : null;
                cells.Add(expression is string text && text.Length > 0 && c.ErrorOf?.Invoke(entry.Row) is null
                    ? new ExportFormula(text, ExportCell(c, entry.Row))
                    : ExportCell(c, entry.Row));
                if (HasUtcColumn(c)) cells.Add(CellTypes.ZonedUtcTime(CellFor(c, entry.Row).Value, c.ReferenceDate));
            }
            rows.Add(cells);
        }
        return new ExportTable(headers, rows);
    }

    private async Task RunCopyAsync()
    {
        var table = BuildExportTable(DataGridExportFormat.Tsv);
        var text = Encoding.UTF8.GetString(ExportData.ExportBytes(table, DataGridExportFormat.Tsv, ExportFilename)).TrimStart('\uFEFF');
        var copy = new DataGridCopy(text, table.Rows.Count);
        await OnCopy.InvokeAsync(copy);
        if (CopyHandler?.Invoke(copy) == false) return;
        bool ok;
        try
        {
            await JS.InvokeVoidAsync("navigator.clipboard.writeText", text);
            ok = true;
        }
        catch
        {
            ok = false;
        }
        Announce(ok ? Labels.CopyAnnouncement?.Invoke(copy.RowCount) : Labels.CopyFailed);
    }

    private async Task RunExportAsync(DataGridExportFormat format)
    {
        var table = BuildExportTable(format);
        var rows = table.Rows;
        var filename = ExportData.ExportFilename(ExportFilename, format);
        var bytes = ExportData.ExportBytes(table, format, ExportFilename);
        var file = new DataGridExport(format, filename, rows.Count, bytes);
        await OnExport.InvokeAsync(file);
        if (ExportHandler?.Invoke(file) == false) return;
        await DownloadAsync(file);
        Announce(Labels.ExportAnnouncement?.Invoke(format, rows.Count, filename));
    }

    private async Task DownloadAsync(DataGridExport file)
    {
        var script =
            "(function(){var b=atob(" + JsonString(Convert.ToBase64String(file.Bytes)) + ");var a=new Uint8Array(b.length);" +
            "for(var i=0;i<b.length;i++)a[i]=b.charCodeAt(i);" +
            "var u=URL.createObjectURL(new Blob([a],{type:" + JsonString(file.MimeType) + "}));" +
            "var l=document.createElement('a');l.href=u;l.download=" + JsonString(file.Filename) + ";document.body.appendChild(l);l.click();l.remove();" +
            "setTimeout(function(){URL.revokeObjectURL(u)},0);})()";
        try
        {
            await JS.InvokeVoidAsync("eval", script);
        }
        catch
        {
            // ignore prerender / interop failure
        }
    }

    // -------------------------------------------------------------------
    // Cell editing
    // -------------------------------------------------------------------

    /// <summary>A cell the person can edit through the grid's edit model (not a rollup, a file cell with its own widgets, or a person cell with no editor).</summary>
    private static bool IsEditable(DataGridColumn column)
    {
        if (!column.Editable) return false;
        if (column.Type is DataGridCellType.Rollup or DataGridCellType.File) return false;
        if (column.Type == DataGridCellType.Person && column.PersonEditor is null) return false;
        return true;
    }

    private void StartEdit(Entry entry, DataGridColumn column)
    {
        if (!IsEditable(column)) return;
        // A formula's editor shows the expression the row holds, not the result.
        var raw = column.Type == DataGridCellType.Formula && column.Source is not null ? column.Source(entry.Row) : RawValue(column, entry.Row);
        if (column.Type == DataGridCellType.TimeZone)
        {
            var zoned = raw as DataGridZonedTime;
            _editing = new Editing(entry.Id, column.Id, zoned?.Time ?? "", zoned?.TimeZone ?? column.TimeZones?.FirstOrDefault()?.Id ?? "");
        }
        else
        {
            var text = column.Type == DataGridCellType.Link ? CellTypes.LinkParts(raw)?.Href ?? "" : raw is null ? "" : Convert.ToString(raw, CultureInfo.InvariantCulture) ?? "";
            _editing = new Editing(entry.Id, column.Id, text);
        }
        _focusEditorPending = true;
    }

    private static object? ParseDraft(DataGridColumn column, DataGridRow row, string draft, string? zone)
    {
        if (column.Parse is not null) return column.Parse(draft, row);
        if (column.Type == DataGridCellType.TimeZone) return draft.Length == 0 ? null : new DataGridZonedTime(draft, zone ?? "");
        var editor = column.Editor;
        if (editor == DataGridEditor.Number)
        {
            if (draft.Trim().Length == 0) return null;
            return double.TryParse(draft, NumberStyles.Float, CultureInfo.InvariantCulture, out var n) ? n : double.NaN;
        }
        if (editor is DataGridEditor.Date or DataGridEditor.Time or DataGridEditor.Select) return draft.Length == 0 ? null : draft;
        return draft;
    }

    /// <summary>Two link values with the same address and label are the same edit.</summary>
    private static bool SameValue(object? a, object? b)
    {
        if (a is null || b is null) return a is null && b is null;
        if (CellTypes.AsNumber(a) is { } x && CellTypes.AsNumber(b) is { } y) return x == y;
        if (a is string || b is string) return Equals(a, b);
        if (CellTypes.LinkParts(a) is { } la && CellTypes.LinkParts(b) is { } lb && a is DataGridLink && b is DataGridLink) return la == lb;
        if (a is IConvertible && b is IConvertible && a.GetType() == b.GetType()) return Equals(a, b);
        return Equals(a, b);
    }

    /// <summary>Validate and report one new value for a cell. Returns false (and keeps editing, if the editor is open) when it is refused.</summary>
    private async Task<bool> CommitValueAsync(Entry entry, DataGridColumn column, object? value)
    {
        var message = column.Validate?.Invoke(value, entry.Row);
        var invalidType = CellTypes.IsInvalidForType(column, value);
        if (message is not null || invalidType)
        {
            var text = message ?? Labels.InvalidValue?.Invoke(column.Header, TypeName(column) ?? "") ?? "";
            if (_editing is not null) _editing = _editing with { Error = text.Length > 0 ? text : null, Invalid = true };
            Announce(Labels.EditError?.Invoke(column.Header, text));
            return false;
        }
        var previous = column.Type == DataGridCellType.Formula && column.Source is not null ? column.Source(entry.Row) : RawValue(column, entry.Row);
        _editing = null;
        if (!SameValue(value, previous))
        {
            _history = _history.Record(new EditRecord(entry.Id, column.Id, value, previous));
            await OnCellEdit.InvokeAsync(new DataGridCellEdit(entry.Id, entry.Row, column.Id, value, previous));
            Announce(Labels.EditAnnouncement?.Invoke(column.Header, column.Format is not null ? column.Format(value, entry.Row) : Convert.ToString(value, CultureInfo.InvariantCulture) ?? ""));
        }
        return true;
    }

    private async Task CommitEditAsync()
    {
        var current = _editing;
        if (current is null) return;
        var entry = _entries.FirstOrDefault(e => e.Id == current.RowId);
        var column = _resolved.FirstOrDefault(c => c.Id == current.ColumnId);
        if (entry is null || column is null)
        {
            _editing = null;
            return;
        }
        if (await CommitValueAsync(entry, column, ParseDraft(column, entry.Row, current.Draft, current.Zone))) _focusPending = true;
    }

    private void CancelEdit()
    {
        var current = _editing;
        if (current is null) return;
        _editing = null;
        var column = _resolved.FirstOrDefault(c => c.Id == current.ColumnId);
        if (column is not null) Announce(Labels.EditCancelAnnouncement?.Invoke(column.Header));
        _focusPending = true;
    }

    private async Task OnEditorKeyDownAsync(KeyboardEventArgs args)
    {
        // An input method reports its composing keys as "Process": Enter picks a candidate and Escape cancels
        // the composition, so neither commits nor cancels the edit.
        if (args.Key == "Process") return;
        if (args.Key == "Enter") await CommitEditAsync();
        else if (args.Key == "Escape") CancelEdit();
    }

    private void SetDraft(string draft)
    {
        if (_editing is not null) _editing = _editing with { Draft = draft, Error = null, Invalid = false };
    }

    private void SetZone(string zone)
    {
        if (_editing is not null) _editing = _editing with { Zone = zone, Error = null, Invalid = false };
    }

    private bool IsEditingCell(Entry entry, DataGridColumn column) => _editing is { } e && e.RowId == entry.Id && e.ColumnId == column.Id;

    private string EditorId => $"{_gridId}-editor";

    // -------------------------------------------------------------------
    // Files
    // -------------------------------------------------------------------

    private async Task OnFilesChosenAsync(Entry entry, DataGridColumn column, InputFileChangeEventArgs args)
    {
        var files = args.GetMultipleFiles(int.MaxValue).ToList();
        if (!column.Multiple && files.Count > 1) files = files.Take(1).ToList();
        if (files.Count > 0) await OnFilesSelected.InvokeAsync(new DataGridFilesSelected(entry.Id, entry.Row, column.Id, files));
    }

    // -------------------------------------------------------------------
    // Roving-tabindex grid keyboard navigation (WAI-ARIA APG Grid pattern)
    // -------------------------------------------------------------------

    private void MoveFocus(int row, int col)
    {
        _focusedRow = Math.Min(Math.Max(row, -1), _pageEntries.Count - 1);
        _focusedCol = Math.Min(Math.Max(col, 0), LastCol);
        RevealRow(_focusedRow);
        // Deferred to OnAfterRenderAsync: the JS-eval focus call must run AFTER the render that flips tabindex to "0" on
        // the new cell has been flushed to the client.
        _focusPending = true;
    }

    /// <summary>The cursor follows focus however it arrives — a click, or a consumer's own focus().</summary>
    private void OnCellFocusIn(int row, int col)
    {
        _focusedRow = row;
        _focusedCol = col;
    }

    private async Task ActivateFocusedCellAsync()
    {
        if (ActiveCol == 0 && HasSelection)
        {
            if (ActiveRow == -1)
            {
                if (SelectionMode == DataGridSelectionMode.Multiple) await ToggleSelectAllAsync();
            }
            else await ToggleRowAsync(PageStart + ActiveRow);
            return;
        }
        var column = _visible.ElementAtOrDefault(ActiveCol - ColOffset);
        if (column is null) return;
        if (ActiveRow == -1) await ToggleSortAsync(column);
    }

    private async Task OnGridKeyDownAsync(KeyboardEventArgs args)
    {
        // The grid's own editor owns its keys while it is open.
        if (_editing is not null) return;
        var ctrlOrMeta = args.CtrlKey || args.MetaKey;
        var logical = GridMotion.LogicalKey(args.Key, Rtl);
        if (EditHistory.KeyAction(args.Key, args.CtrlKey, args.MetaKey, args.ShiftKey, args.AltKey) is { } historyAction)
        {
            await StepHistoryAsync(historyAction);
            return;
        }
        if (args.AltKey && ActiveRow == -1 && (logical == "ArrowRight" || logical == "ArrowLeft"))
        {
            var column = _visible.ElementAtOrDefault(ActiveCol - ColOffset);
            if (column is { Movable: true })
            {
                var delta = logical == "ArrowRight" ? 1 : -1;
                if (await MoveColumnAsync(column.Id, ActiveCol - ColOffset + delta)) MoveFocus(-1, ActiveCol + delta);
                return;
            }
        }
        // Type-ahead: letters typed in quick succession move to the next row whose first cell starts with them.
        if (ActiveRow >= 0 && !args.AltKey && Typeahead.IsKey(args.Key, args.CtrlKey, args.AltKey, args.MetaKey))
        {
            var state = Typeahead.Next(_typeahead, args.Key, Environment.TickCount64);
            var hit = Typeahead.FindMatch(_pageEntries.Select(RowLabelOf).ToList(), ActiveRow, state.Prefix);
            if (hit != -1)
            {
                _typeahead = state;
                MoveFocus(hit, ActiveCol);
                return;
            }
        }
        var pageStep = Virtualize is { } vz ? Math.Max(1, vz.Height / Math.Max(1, vz.RowHeight)) : 10;
        if (GridMotion.Move(args.Key, ctrlOrMeta, new GridPosition(ActiveRow, ActiveCol), new GridNavigation(-1, _pageEntries.Count - 1, LastCol, pageStep, Rtl: Rtl)) is { } moved)
        {
            MoveFocus(moved.Row, moved.Col);
            return;
        }
        switch (args.Key)
        {
            case "F2":
            {
                var (entry, column) = CurrentCell();
                if (entry is not null && column is not null && IsEditable(column)) StartEdit(entry, column);
                break;
            }
            case "Enter":
            case " ":
            {
                var (entry, column) = CurrentCell();
                if (args.Key == "Enter" && entry is not null && column is not null && IsEditable(column))
                {
                    StartEdit(entry, column);
                    break;
                }
                if (args.Key == "Enter" && entry is not null && ActiveRow >= 0 && OnRowActivate.HasDelegate)
                {
                    await OnRowActivate.InvokeAsync((entry.Row, entry.Id));
                    break;
                }
                await ActivateFocusedCellAsync();
                break;
            }
        }
    }

    /// <summary>Put an earlier cell value back (or re-apply one), reported through <c>OnCellEdit</c> like any edit: the consumer owns the data.</summary>
    private async Task StepHistoryAsync(string action)
    {
        var step = action == "undo" ? _history.UndoStep() : _history.RedoStep();
        if (step.Record is not { } record) return;
        _history = step.History;
        var entry = _entries.FirstOrDefault(e => e.Id == record.OwnerId);
        var column = _resolved.FirstOrDefault(c => c.Id == record.FieldId);
        if (entry is null || column is null) return;
        var restored = action == "undo" ? record.Previous : record.Value;
        var replaced = action == "undo" ? record.Value : record.Previous;
        await OnCellEdit.InvokeAsync(new DataGridCellEdit(entry.Id, entry.Row, column.Id, restored, replaced));
        var text = column.Format is not null ? column.Format(restored, entry.Row) : Convert.ToString(restored, CultureInfo.InvariantCulture) ?? "";
        Announce((action == "undo" ? Labels.UndoAnnouncement : Labels.RedoAnnouncement)?.Invoke(column.Header, text));
        _focusPending = true;
    }

    private (Entry? Entry, DataGridColumn? Column) CurrentCell()
    {
        var entry = ActiveRow >= 0 ? _pageEntries.ElementAtOrDefault(ActiveRow) : null;
        var column = _visible.ElementAtOrDefault(ActiveCol - ColOffset);
        return (entry, column);
    }

    private async Task OnCellDoubleClickAsync(Entry entry, DataGridColumn column)
    {
        if (IsEditable(column)) StartEdit(entry, column);
        await Task.CompletedTask;
    }

    private async Task OnRowClickAsync(Entry entry)
    {
        if (OnRowActivate.HasDelegate) await OnRowActivate.InvokeAsync((entry.Row, entry.Id));
    }

    // -------------------------------------------------------------------
    // Persistence (view state only: widths, hidden columns, sort — never rows/selection)
    // -------------------------------------------------------------------

    private sealed record SavedView(Dictionary<string, int>? ColumnWidths, List<string>? HiddenColumnIds, SavedSort? Sort);
    private sealed record SavedSort(string ColumnId, string Direction);

    private async Task RestoreAsync()
    {
        if (string.IsNullOrEmpty(StorageKey) || _restored) return;
        _restored = true;
        try
        {
            var raw = await JS.InvokeAsync<string?>("eval", $"localStorage.getItem({JsonString(StorageKey)})");
            if (!string.IsNullOrEmpty(raw))
            {
                var saved = JsonSerializer.Deserialize<SavedView>(raw, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
                if (saved?.ColumnWidths is not null) foreach (var (k, v) in saved.ColumnWidths) _columnWidths[k] = v;
                if (saved?.HiddenColumnIds is not null) { _hiddenColumnIds.Clear(); foreach (var id in saved.HiddenColumnIds) _hiddenColumnIds.Add(id); }
                if (saved?.Sort is { } s && Enum.TryParse<DataGridSortDirection>(s.Direction, true, out var direction))
                {
                    Sort = new DataGridSort(s.ColumnId, direction);
                    await SortChanged.InvokeAsync(Sort);
                }
                Recompute();
                StateHasChanged();
            }
        }
        catch
        {
            // ignore quota / privacy / parse errors / prerender
        }
        await PersistAsync();
    }

    private async Task PersistAsync()
    {
        if (string.IsNullOrEmpty(StorageKey) || !_restored) return;
        try
        {
            var snapshot = JsonSerializer.Serialize(new
            {
                columnWidths = _columnWidths,
                hiddenColumnIds = _hiddenColumnIds.ToList(),
                sort = new { columnId = Sort.ColumnId, direction = Sort.Direction.ToString().ToLowerInvariant() },
            });
            await JS.InvokeVoidAsync("eval", $"localStorage.setItem({JsonString(StorageKey)}, {JsonString(snapshot)})");
        }
        catch
        {
            // ignore quota / privacy errors
        }
    }

    // -------------------------------------------------------------------
    // Lifecycle — focus moves are deferred to after render.
    // -------------------------------------------------------------------

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (firstRender) await RestoreAsync();
        try
        {
            if (_scrollToPending is { } scrollTo)
            {
                _scrollToPending = null;
                await JS.InvokeVoidAsync("eval", $"(function(){{var e=document.getElementById({JsonString(ScrollId)});if(e)e.scrollTop={scrollTo.ToString(CultureInfo.InvariantCulture)};}})()");
            }
            if (_focusEditorPending)
            {
                _focusEditorPending = false;
                await JS.InvokeVoidAsync("eval", $"(function(){{var e=document.getElementById({JsonString(EditorId)});if(e){{e.focus();if(e.tagName==='INPUT'&&e.type==='text')e.select();}}}})()");
            }
            else if (_focusPending)
            {
                _focusPending = false;
                await JS.InvokeVoidAsync("eval", $"document.getElementById({JsonString(CellId(ActiveRow, ActiveCol))})?.focus({{preventScroll:true}})");
            }
            if (_indeterminateDirty && SelectionMode == DataGridSelectionMode.Multiple)
            {
                _indeterminateDirty = false;
                await JS.InvokeVoidAsync("eval", $"(function(){{var e=document.getElementById({JsonString(_gridId + "-select-all")});if(e)e.indeterminate={(SomeSelected ? "true" : "false")};}})()");
            }
        }
        catch
        {
            // ignore prerender / interop failure
        }
    }

    private static string JsonString(string text) => JsonSerializer.Serialize(text);

    // -------------------------------------------------------------------
    // Markup helpers
    // -------------------------------------------------------------------

    private string RowLabelOf(Entry entry) => _visible.Count > 0 ? CellFor(_visible[0], entry.Row).Formatted : entry.Id;

    private IReadOnlyList<DataGridPerson> ShownPeople(DataGridColumn column, object? value)
    {
        var people = CellTypes.PeopleOf(value);
        return column.MaxPeople is { } max ? people.Take(Math.Max(0, max)).ToList() : people;
    }

    private static IReadOnlyList<string> GroupsOf(DataGridColumn column)
        => (column.Options ?? Array.Empty<DataGridOption>()).Where(o => o.Group is not null).Select(o => o.Group!).Distinct().ToList();

    /// <summary>The attributes a body cell gets beyond the headless element's own.</summary>
    private Dictionary<string, object> CellAttributes(DataGridColumn column, DataGridCellContext ctx, int row, int colIndex, Entry entry)
    {
        var attrs = new Dictionary<string, object>
        {
            ["id"] = CellId(row, ColOffset + colIndex),
            ["data-row"] = row,
            ["data-col"] = ColOffset + colIndex,
        };
        if (AlignName(column) is { } align) attrs["data-align"] = align;
        if (TypeName(column) is { } type) attrs["data-cell-type"] = type;
        if (PinnedName(column) is { } pinned) attrs["data-pinned"] = pinned;
        if (column.ErrorOf?.Invoke(ctx.Row) is not null) attrs["data-error"] = "";
        if (IsMissing(ctx.Value) && column.Type is not (DataGridCellType.Rollup or DataGridCellType.Formula or DataGridCellType.File or DataGridCellType.Person)) attrs["data-empty"] = "";
        if (CellStyle(column) is { } style) attrs["style"] = style;
        if (IsGrid) attrs["tabindex"] = ActiveRow == row && ActiveCol == ColOffset + colIndex ? "0" : "-1";
        if (column.RowHeader)
        {
            attrs["scope"] = "row";
            attrs["role"] = "rowheader";
        }
        else
        {
            attrs["role"] = IsGrid ? "gridcell" : "cell";
            if (IsEditable(column)) attrs["data-editable"] = "";
            if (column.Type == DataGridCellType.Rollup)
            {
                attrs["data-readonly"] = "";
                attrs["aria-readonly"] = "true";
            }
            if (IsEditingCell(entry, column)) attrs["data-editing"] = "";
        }
        var extra = column.CellAttrs?.Invoke(ctx);
        if (extra is not null) foreach (var (k, v) in extra) attrs[k] = v;
        return attrs;
    }
}

/// <summary>What an export holds.</summary>
public enum DataGridExportScope
{
    /// <summary>Every row the filter leaves, in the current sort (not just the shown page).</summary>
    View,
    /// <summary>Only the selected rows.</summary>
    Selected,
}
