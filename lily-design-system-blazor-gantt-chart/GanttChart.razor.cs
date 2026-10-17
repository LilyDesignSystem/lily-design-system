// GanttChart — code-behind. See spec/index.md for the contract.
//
// Ported from the canonical Svelte package
// (lily-design-system-svelte-helpers/lily-design-system-svelte-gantt-chart),
// translated to this catalog's own idioms. Civil-date arithmetic reuses
// the sibling DateTimePicker package's own public static helpers
// (ParseIsoDate/FormatIsoDate/AddDays/DaysInMonth/CivilDate) rather than
// re-deriving UTC/epoch-day math from scratch — see spec/index.md §6.

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using LilyBlazorHeadless.Components;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.JSInterop;

namespace LilyDesignSystem.Blazor.Helpers;

/// <summary>What an export holds: every task, or only the visible ones (those not under a collapsed parent).</summary>
public enum GanttExportScope
{
    /// <summary>Every task.</summary>
    All,
    /// <summary>Leaves out the tasks under a collapsed parent.</summary>
    Visible,
}

/// <summary>Headers of an export's own columns. An export needs <c>Task</c>, <c>Start</c> and <c>End</c>; there is no English default. The others are included only when named.</summary>
public sealed record GanttExportHeaders(string Task, string Start, string End, string? PercentComplete = null, string? Parent = null, string? DependsOn = null, string? BaselineStart = null, string? BaselineEnd = null);

/// <summary>What <c>OnFieldEdit</c> receives after a field edit is committed.</summary>
public sealed record GanttFieldEdit(string TaskId, string FieldId, object? Value, object? Previous);

/// <summary>Windowing for a long chart: only the task rows in view are rendered. See <c>spec/index.md</c>.</summary>
public sealed record GanttVirtualize(int RowHeight, int Height, int Overscan = 3);

/// <summary>A dependency with its type (<c>e2s</c> finish-to-start, <c>s2s</c>, <c>s2e</c>, <c>e2e</c>) and lag in days; data and text only.</summary>
public sealed record GanttDependency(string Id, string? Type = null, int Lag = 0);

/// <summary>The planned span, shown as a second marked span (<c>data-baseline</c>) so slippage is visible.</summary>
public sealed record GanttBaseline(string Start, string End);

/// <summary>A Gantt task. See <c>spec/index.md §5</c>.</summary>
public sealed class GanttTask
{
    /// <summary>Stable task identifier.</summary>
    public required string Id { get; init; }

    /// <summary>Visible task label.</summary>
    public required string Label { get; init; }

    /// <summary>ISO date (<c>YYYY-MM-DD</c>), inclusive. Absent (with <see cref="End"/>) means the task is unscheduled: its row shows no bar (<c>data-unscheduled</c>) and its edit region sets the dates.</summary>
    public string? Start { get; init; }

    /// <summary>ISO date (<c>YYYY-MM-DD</c>), inclusive. Equal to <see cref="Start"/> means a milestone.</summary>
    public string? End { get; init; }

    /// <summary>0-100. Rendering the fill is the consumer's own CSS.</summary>
    public int? PercentComplete { get; init; }

    /// <summary>Another task's id; builds the row hierarchy.</summary>
    public string? ParentId { get; init; }

    /// <summary>Other tasks' ids this task depends on (finish-to-start).</summary>
    public IReadOnlyList<string>? DependsOn { get; init; }

    /// <summary>Typed dependencies (type and lag), listed after <see cref="DependsOn"/>. Type defaults to <c>e2s</c>.</summary>
    public IReadOnlyList<GanttDependency>? Dependencies { get; init; }

    /// <summary>The planned span, shown as a second marked span (<c>data-baseline</c>).</summary>
    public GanttBaseline? Baseline { get; init; }

    /// <summary>Class hook only: becomes <c>data-task-type</c> on the row (e.g. "design", "review").</summary>
    public string? Type { get; init; }

    /// <summary>On the critical path; becomes <c>data-critical</c>. Lily computes nothing.</summary>
    public bool Critical { get; init; }

    /// <summary>Slack in days, from the consumer's own scheduling; becomes <c>data-slack</c>.</summary>
    public int? Slack { get; init; }

    /// <summary>Values of the chart's <c>Fields</c>, by field id.</summary>
    public DataGridRow? Values { get; init; }
}

/// <summary>A dated column marker (holiday, release, deadline). <c>Label</c> is rendered as text so a marker is never colour-only.</summary>
public sealed record GanttMarker
{
    public required string Date { get; init; }
    public string? Kind { get; init; }
    public string? Label { get; init; }
}

/// <summary>Column granularity. A static rendering choice, not an interactive zoom control.</summary>
public enum GanttTimeUnit
{
    Day,
    Week,
    Month,
}

/// <summary>The chart's own overall time range, ISO dates.</summary>
public sealed record GanttRange
{
    public required string Start { get; init; }
    public required string End { get; init; }
}

/// <summary>One generated time-axis column. See <see cref="GanttChart.GenerateColumns"/>.</summary>
public sealed record GanttColumn
{
    public required string Start { get; init; }
    public required string End { get; init; }
}

/// <summary>
/// Every field is optional, but its presence gates the control it names —
/// no baked-in English fallback, matching every other helper's
/// label-presence-gates-control convention. See <c>spec/index.md §5</c>.
/// </summary>
public sealed record GanttLabels
{
    /// <summary>Header for the leading task-label column; an empty header cell otherwise.</summary>
    public string? TaskColumnHeader { get; init; }
    public Func<string, string, GanttTimeUnit, string>? ColumnLabel { get; init; }

    /// <summary>Accessible name for the zoom-in button (finer columns). Gates the button.</summary>
    public string? ZoomIn { get; init; }

    /// <summary>Accessible name for the zoom-out button (coarser columns). Gates the button.</summary>
    public string? ZoomOut { get; init; }

    /// <summary>Announced after a zoom step with the new unit.</summary>
    public Func<GanttTimeUnit, string>? ZoomAnnouncement { get; init; }
    public Func<GanttTask, string>? EditButton { get; init; }
    public string? StartLabel { get; init; }
    public string? EndLabel { get; init; }

    /// <summary>Reused for both composed DateTimePicker instances. Editing is gated on this.</summary>
    public DateTimePickerLabels? DateTimePickerLabels { get; init; }

    public string? SaveLabel { get; init; }
    public string? CancelLabel { get; init; }
    public Func<IReadOnlyList<string>, string>? DependencySummary { get; init; }
    public Func<string, string, string, string>? DateAnnouncement { get; init; }

    /// <summary>Label of the progress field in the edit region (0–100). Gates the field.</summary>
    public string? PercentLabel { get; init; }

    /// <summary>Text for one typed dependency: (predecessor label, type, lag in days). Id-only dependencies use the label.</summary>
    public Func<string, string, int, string>? DependencyDetail { get; init; }

    /// <summary>Text for a task with a baseline: (task label, baseline, days the end has slipped; negative = early).</summary>
    public Func<string, GanttBaseline, int, string>? BaselineSummary { get; init; }
    public Func<GanttTask, bool, string>? CollapseButton { get; init; }

    /// <summary>Accessible name for the button that expands every parent task. Gates the button.</summary>
    public string? ExpandAll { get; init; }

    /// <summary>Accessible name for the button that collapses every parent task. Gates the button.</summary>
    public string? CollapseAll { get; init; }

    /// <summary>Accessible name of the export button group. Gates the group (with at least one of the three buttons).</summary>
    public string? Export { get; init; }

    /// <summary>Visible text of the CSV, TSV and Excel export buttons. Each gates its button.</summary>
    public string? ExportCsv { get; init; }
    public string? ExportTsv { get; init; }
    public string? ExportExcel { get; init; }

    /// <summary>Announced after an export: (format, how many tasks, file name).</summary>
    public Func<DataGridExportFormat, int, string, string>? ExportAnnouncement { get; init; }

    /// <summary>Headers of the export's own columns. An export needs these; there is no English default.</summary>
    public GanttExportHeaders? ExportHeaders { get; init; }

    /// <summary>Announced after a field edit: (task label, field header, the new text).</summary>
    public Func<string, string, string, string>? EditAnnouncement { get; init; }

    /// <summary>Announced when an edit is refused as invalid for the field's type: (task label, field header).</summary>
    public Func<string, string, string>? EditInvalid { get; init; }

    /// <summary>Names the search field; it renders only when set.</summary>
    public string? Search { get; init; }

    /// <summary>Announced after a search: (matching tasks, all tasks).</summary>
    public Func<int, int, string>? SearchAnnouncement { get; init; }

    /// <summary>Announced when a field's <c>Validate</c> refused the value: (task label, field header, the reason).</summary>
    public Func<string, string, string, string>? EditRefused { get; init; }

    /// <summary>Announced after a field-edit undo: (task label, field header, the restored text).</summary>
    public Func<string, string, string, string>? FieldUndoAnnouncement { get; init; }

    /// <summary>Announced after a field-edit redo: (task label, field header, the re-applied text).</summary>
    public Func<string, string, string, string>? FieldRedoAnnouncement { get; init; }

    /// <summary>A button that puts the export (header row first, tab-separated) on the clipboard; needs <c>ExportHeaders</c>.</summary>
    public string? Copy { get; init; }

    /// <summary>Announced after a copy: (how many tasks).</summary>
    public Func<int, string>? CopyAnnouncement { get; init; }

    /// <summary>Announced when the clipboard refused the copy.</summary>
    public string? CopyFailed { get; init; }
}

/// <summary>A flattened row: a task plus its tree depth and whether it has children.
/// See <see cref="GanttChart.FlattenTasks"/>.</summary>
public sealed record GanttFlatRow
{
    public required GanttTask Task { get; init; }
    public required int Depth { get; init; }
    public required bool HasChildren { get; init; }
}

/// <summary>An ISO date span. See <see cref="GanttChart.EffectiveRange"/>.</summary>
public readonly record struct GanttDateRange(string Start, string End);

public partial class GanttChart : ComponentBase
{
    /// <summary>Monotonic instance counter; SSR-safe (no randomness, no clock).</summary>
    private static int _uid;

    // -------------------------------------------------------------------
    // Parameters — see spec/index.md §5.
    // -------------------------------------------------------------------

    /// <summary>Accessible name for the chart, passed through to GanttTable.</summary>
    [Parameter, EditorRequired] public string Label { get; set; } = "";

    /// <summary>Optional visible caption. GanttTable has no built-in caption slot,
    /// so this renders a literal &lt;caption&gt; as the table's first child.</summary>
    [Parameter] public string? Caption { get; set; }

    /// <summary>The chart's own overall time range.</summary>
    [Parameter, EditorRequired] public GanttRange Range { get; set; } = new() { Start = "", End = "" };

    /// <summary>Task data.</summary>
    [Parameter, EditorRequired] public IReadOnlyList<GanttTask> Tasks { get; set; } = Array.Empty<GanttTask>();

    /// <summary>Ids of collapsed parent tasks. Bindable: <c>@bind-CollapsedTaskIds</c>; the collapse buttons, <c>Labels.ExpandAll</c> and <c>Labels.CollapseAll</c> change it.</summary>
    [Parameter] public IReadOnlyList<string> CollapsedTaskIds { get; set; } = Array.Empty<string>();
    [Parameter] public EventCallback<IReadOnlyList<string>> CollapsedTaskIdsChanged { get; set; }

    /// <summary>Column granularity. Bindable: <c>@bind-TimeUnit</c>. The zoom buttons (shown when <c>Labels.ZoomIn</c> / <c>Labels.ZoomOut</c> name them) step it month ↔ week ↔ day.</summary>
    [Parameter] public GanttTimeUnit TimeUnit { get; set; } = GanttTimeUnit.Day;
    [Parameter] public EventCallback<GanttTimeUnit> TimeUnitChanged { get; set; }

    /// <summary>The selected task's id. Bindable: <c>@bind-SelectedTaskId</c>. A click on a task's cell or the <c>s</c> key on it selects (again deselects); <c>aria-selected</c>, <c>data-selected</c>.</summary>
    [Parameter] public string? SelectedTaskId { get; set; }
    [Parameter] public EventCallback<string?> SelectedTaskIdChanged { get; set; }

    /// <summary>Extra attributes on each task's row (for example <c>data-team</c>).</summary>
    [Parameter] public Func<GanttTask, IReadOnlyDictionary<string, object>>? TaskAttributes { get; set; }

    /// <summary>ISO date marking "today"; never computed internally (stays SSR-safe).</summary>
    [Parameter] public string? Today { get; set; }

    /// <summary>Dated markers; each marks the column that contains its date with <c>data-marker</c>.</summary>
    [Parameter] public IReadOnlyList<GanttMarker> Markers { get; set; } = Array.Empty<GanttMarker>();

    /// <summary>Consumer's own working calendar; a column is <c>data-non-working</c> when every day in it is non-working.</summary>
    [Parameter] public Func<string, bool>? IsNonWorking { get; set; }

    /// <summary>Weekdays to shade (0 = Sunday … 6 = Saturday), for example <c>[0, 6]</c> or <c>[5, 6]</c>. Never defaulted: the weekend is the consumer's locale. Marks day columns <c>data-weekend</c> on the header and every cell; week and month columns are not marked. Shading itself is CSS.</summary>
    [Parameter] public IReadOnlyList<int>? Weekends { get; set; }

    /// <summary>Draw an arrow from each predecessor's bar to its dependent task's, by the dependency's type. An <c>aria-hidden</c> SVG overlay measured from the rendered cells (one JS call per change); the dependencies stay available as text through <c>Labels.DependencySummary</c>. Drawn only between rendered rows.</summary>
    [Parameter] public bool DependencyArrows { get; set; }

    /// <summary>Suppress editing, drag and the edit region; navigation and collapse still work.</summary>
    [Parameter] public bool Readonly { get; set; }

    /// <summary>Resolves a task to its display label. Defaults to <c>task.Label</c>.</summary>
    [Parameter] public Func<GanttTask, string>? TaskLabel { get; set; }

    /// <summary>Called after a task's start/end changes, by pointer or by the edit region.</summary>
    [Parameter] public EventCallback<(string TaskId, string Start, string End)> OnTaskChange { get; set; }

    /// <summary>Raised with the new 0–100 progress (clamped, rounded) when the edit region's progress field is shown, just before <c>OnTaskChange</c>.</summary>
    [Parameter] public EventCallback<(string TaskId, int PercentComplete)> OnTaskPercentChange { get; set; }

    /// <summary>
    /// Typed fields: a column per field between the task name and the timeline, read from <c>task.Values</c>. A field is a
    /// <see cref="DataGridColumn"/>: its <c>Type</c> fills in the display, edit and export defaults as in the data grid. A field edits in
    /// place (click the value, or F2 on the task's row for the first editable field) when its <c>Editable</c> is set and <c>OnFieldEdit</c> has a handler.
    /// </summary>
    [Parameter] public IReadOnlyList<DataGridColumn>? Fields { get; set; }

    /// <summary>Culture name (BCP 47) for number and date fields. Never defaulted.</summary>
    [Parameter] public string? Locale { get; set; }

    /// <summary>Raised with each accepted field edit. The consumer updates <c>Tasks</c>. Fields are editable only with a handler (and not <c>Readonly</c>).</summary>
    [Parameter] public EventCallback<GanttFieldEdit> OnFieldEdit { get; set; }

    /// <summary>The search text: shows only the tasks whose label and field text contain every word (any order, ignoring case and diacritics). Bindable: <c>@bind-SearchValue</c>.</summary>
    [Parameter] public string SearchValue { get; set; } = "";
    [Parameter] public EventCallback<string> SearchValueChanged { get; set; }

    /// <summary>The reading direction, "ltr" (default) or "rtl": in right-to-left the horizontal arrow keys swap. Blazor cannot read the DOM's <c>dir</c> without JS interop, so the consumer says.</summary>
    [Parameter] public string? Direction { get; set; }

    /// <summary>Called with the text before it goes on the clipboard; return false to take the copy over.</summary>
    [Parameter] public Func<DataGridCopy, bool>? CopyHandler { get; set; }

    /// <summary>Called after a copy was prepared (the text, the task count).</summary>
    [Parameter] public EventCallback<DataGridCopy> OnCopy { get; set; }

    /// <summary>Base of an export's file name (<c>.csv</c>, <c>.tsv</c> or <c>.xlsx</c> is added). Default <c>"gantt-chart"</c>.</summary>
    [Parameter] public string ExportFilename { get; set; } = "gantt-chart";

    /// <summary>What an export holds: every task (default), or only the visible ones.</summary>
    [Parameter] public GanttExportScope ExportScope { get; set; } = GanttExportScope.All;

    /// <summary>Called before the download with the finished file. Return <c>false</c> to skip the built-in download.</summary>
    [Parameter] public Func<DataGridExport, bool>? ExportHandler { get; set; }

    /// <summary>Raised with the file before it is saved (a notification; <see cref="ExportHandler"/> can veto).</summary>
    [Parameter] public EventCallback<DataGridExport> OnExport { get; set; }

    /// <summary>Renders only the task rows in view, in a scroll area of <c>Height</c> px; every row is assumed <c>RowHeight</c> px tall.</summary>
    [Parameter] public GanttVirtualize? Virtualize { get; set; }

    /// <summary>User-facing strings. See <see cref="GanttLabels"/> — presence gates each control.</summary>
    [Parameter] public GanttLabels Labels { get; set; } = new();

    /// <summary>Extra CSS class merged into the root &lt;div&gt;.</summary>
    [Parameter] public string CssClass { get; set; } = "";

    /// <summary>Captures all unmatched attributes; spread onto the root.</summary>
    [Parameter(CaptureUnmatchedValues = true)]
    public Dictionary<string, object>? AdditionalAttributes { get; set; }

    [Inject] private IJSRuntime JS { get; set; } = default!;

    // -------------------------------------------------------------------
    // Instance state — mirrors the Svelte $state fields one for one.
    // -------------------------------------------------------------------

    private readonly string _baseId = $"gantt-chart-{Interlocked.Increment(ref _uid)}";

    private string _statusMessage = "";
    private HashSet<string> _collapsed => new(CollapsedTaskIds);
    private int _focusedRow;
    private int _focusedCol;

    private string? _editingTaskId;
    private string _editStart = "";
    private string _editEnd = "";
    private string _editPercent = "";

    private string? _draggingTaskId;

    // Dependency arrows: an aria-hidden overlay measured from the rendered cells.
    private sealed record Arrow(string Key, string From, string To, string Kind, string D);
    private List<Arrow> _arrows = new();
    private double _overlayWidth;
    private double _overlayHeight;
    private string _arrowSignature = "";
    private string ArrowHeadId => $"{_baseId}-arrowhead";

    private bool _focusCellPending;
    private bool _focusEditPending;

    // -------------------------------------------------------------------
    // Test seams (InternalsVisibleTo). bUnit has no live focus model — see
    // KanbanBoard's own note on the same limitation. These verify the
    // component's INTENT (which id it asked to focus), not that the
    // browser actually moved focus there.
    // -------------------------------------------------------------------

    internal string RootId => $"{_baseId}-root";

    internal string DependencyId(string taskId) => $"{_baseId}-deps-{taskId}";

    // -------------------------------------------------------------------
    // Civil-date arithmetic: delegates to the sibling DateTimePicker
    // package's own public static helpers (DateOnly-backed, UTC-safe by
    // construction) rather than re-deriving epoch-day math — see
    // spec/index.md §6.
    // -------------------------------------------------------------------

    /// <summary>-1 / 0 / 1; ordinary ordinal string comparison works for zero-padded ISO dates.</summary>
    public static int CompareIso(string a, string b) => string.CompareOrdinal(a, b);

    /// <summary>Add whole days to an ISO date, UTC-safe (delegates to DateTimePicker.AddDays).</summary>
    public static string AddDays(string iso, int days) => DateTimePicker.AddDays(iso, days);

    /// <summary>The last day of the calendar month <paramref name="iso"/> falls in, UTC-safe.</summary>
    public static string EndOfMonth(string iso)
    {
        var parsed = DateTimePicker.ParseIsoDate(iso);
        if (parsed is not { } date) return iso;
        var lastDay = DateTimePicker.DaysInMonth(date.Year, date.Month);
        return DateTimePicker.FormatIsoDate(new CivilDate(date.Year, date.Month, lastDay));
    }

    /// <summary>Generate the fixed set of columns a range/timeUnit pair produces.</summary>
    public static IReadOnlyList<GanttColumn> GenerateColumns(GanttRange range, GanttTimeUnit timeUnit)
    {
        var columns = new List<GanttColumn>();
        var cursor = range.Start;
        var guard = 0;
        while (CompareIso(cursor, range.End) <= 0 && guard < 10000)
        {
            guard += 1;
            string periodEnd = timeUnit switch
            {
                GanttTimeUnit.Day => cursor,
                GanttTimeUnit.Week => AddDays(cursor, 6),
                _ => EndOfMonth(cursor),
            };
            if (CompareIso(periodEnd, range.End) > 0) periodEnd = range.End;
            columns.Add(new GanttColumn { Start = cursor, End = periodEnd });
            cursor = AddDays(periodEnd, 1);
        }
        return columns;
    }

    private static bool RangesOverlap(string aStart, string aEnd, string bStart, string bEnd)
        => CompareIso(aStart, bEnd) <= 0 && CompareIso(bStart, aEnd) <= 0;

    /// <summary>Depth-first flatten of the parentId tree, skipping collapsed subtrees.</summary>
    public static IReadOnlyList<GanttFlatRow> FlattenTasks(IReadOnlyList<GanttTask> tasks, IReadOnlySet<string> collapsed)
    {
        var childrenOf = new Dictionary<string, List<GanttTask>>();
        var roots = new List<GanttTask>();
        var ids = tasks.Select(t => t.Id).ToHashSet();
        foreach (var task in tasks)
        {
            // A task whose ParentId names no task is a top-level row, not dropped.
            if (task.ParentId is null || !ids.Contains(task.ParentId))
            {
                roots.Add(task);
            }
            else
            {
                if (!childrenOf.TryGetValue(task.ParentId, out var list))
                {
                    list = new List<GanttTask>();
                    childrenOf[task.ParentId] = list;
                }
                list.Add(task);
            }
        }

        var rows = new List<GanttFlatRow>();

        void Walk(IReadOnlyList<GanttTask> siblings, int depth)
        {
            foreach (var task in siblings)
            {
                var kids = childrenOf.TryGetValue(task.Id, out var list) ? list : new List<GanttTask>();
                rows.Add(new GanttFlatRow { Task = task, Depth = depth, HasChildren = kids.Count > 0 });
                if (kids.Count > 0 && !collapsed.Contains(task.Id)) Walk(kids, depth + 1);
            }
        }

        Walk(roots, 0);
        return rows;
    }

    /// <summary>A parent's start/end are derived (min start / max end of descendants), never its own data.</summary>
    public static GanttDateRange EffectiveRange(GanttTask task, IReadOnlyList<GanttTask> allTasks)
        => EffectiveRanges(allTasks).TryGetValue(task.Id, out var range) ? range : new GanttDateRange(task.Start ?? "", task.End ?? "");

    /// <summary>
    /// Every task's effective range in one pass over the tree — computed once
    /// per render rather than re-walking every parent's subtree for each row.
    /// A ParentId cycle cannot recurse forever: a task already on the walk is
    /// read as a leaf.
    /// </summary>
    public static IReadOnlyDictionary<string, GanttDateRange> EffectiveRanges(IReadOnlyList<GanttTask> tasks)
    {
        var childrenOf = new Dictionary<string, List<GanttTask>>();
        foreach (var task in tasks)
        {
            if (task.ParentId is null) continue;
            if (!childrenOf.TryGetValue(task.ParentId, out var list))
            {
                list = new List<GanttTask>();
                childrenOf[task.ParentId] = list;
            }
            list.Add(task);
        }
        var ranges = new Dictionary<string, GanttDateRange>();
        var onWalk = new HashSet<string>();
        GanttDateRange Visit(GanttTask task)
        {
            if (ranges.TryGetValue(task.Id, out var known)) return known;
            if (!childrenOf.TryGetValue(task.Id, out var children) || onWalk.Contains(task.Id))
                return new GanttDateRange(task.Start ?? "", task.End ?? "");
            onWalk.Add(task.Id);
            var start = "";
            var end = "";
            foreach (var child in children)
            {
                var r = Visit(child);
                if (r.Start == "") continue; // an unscheduled child does not shape its parent's span
                if (start == "" || CompareIso(r.Start, start) < 0) start = r.Start;
                if (end == "" || CompareIso(r.End, end) > 0) end = r.End;
            }
            onWalk.Remove(task.Id);
            var range = new GanttDateRange(start, end);
            ranges[task.Id] = range;
            return range;
        }
        foreach (var task in tasks) ranges[task.Id] = Visit(task);
        return ranges;
    }

    // -------------------------------------------------------------------
    // Derived data.
    // -------------------------------------------------------------------

    // Columns, rows and the task lookup are built once per change of their inputs, not once per access.
    private (string Start, string End, GanttTimeUnit Unit)? _columnsKey;
    private IReadOnlyList<GanttColumn> _columns = Array.Empty<GanttColumn>();

    private IReadOnlyList<GanttColumn> Columns
    {
        get
        {
            var key = (Range.Start, Range.End, TimeUnit);
            if (_columnsKey != key)
            {
                _columnsKey = key;
                _columns = GenerateColumns(Range, TimeUnit);
            }
            return _columns;
        }
    }

    private IReadOnlyList<GanttTask>? _rowsTasks;
    private IReadOnlyList<string>? _rowsCollapsed;
    private IReadOnlyList<GanttFlatRow> _rows = Array.Empty<GanttFlatRow>();
    private string? _rowsSearch;
    private EditHistory _fieldHistory = EditHistory.Empty;
    private Typeahead.State _typeahead = new("", 0);
    private bool Rtl => string.Equals(Direction, "rtl", StringComparison.OrdinalIgnoreCase);

    /// <summary>What a search looks in: the task's label and every field's text.</summary>
    private string TaskSearchText(GanttTask task)
        => string.Join(" ", new[] { ResolveTaskLabel(task) }.Concat(ResolvedFields.Select(f => TypedFields.Text(f, task.Values))));

    private bool MatchesSearch(GanttTask task) => SearchText.Matches(TaskSearchText(task), SearchValue);

    private async Task SetSearchAsync(string value)
    {
        SearchValue = value;
        await SearchValueChanged.InvokeAsync(SearchValue);
        var matched = Tasks.Count(MatchesSearch);
        Announce(Labels.SearchAnnouncement?.Invoke(matched, Tasks.Count));
    }

    private async Task OnSearchKeyDownAsync(KeyboardEventArgs args)
    {
        if (args.Key == "Escape" && SearchValue.Length > 0) await SetSearchAsync("");
    }

    private IReadOnlyList<GanttFlatRow> Rows
    {
        get
        {
            if (!ReferenceEquals(_rowsTasks, Tasks) || !ReferenceEquals(_rowsCollapsed, CollapsedTaskIds) || _rowsSearch != SearchValue)
            {
                _rowsTasks = Tasks;
                _rowsCollapsed = CollapsedTaskIds;
                _rowsSearch = SearchValue;
                var flat = FlattenTasks(Tasks, _collapsed);
                _rows = SearchValue.Trim().Length == 0 ? flat : flat.Where(r => MatchesSearch(r.Task)).ToList();
            }
            return _rows;
        }
    }

    private IReadOnlyList<GanttTask>? _taskByIdSource;
    private Dictionary<string, GanttTask> _taskById = new();

    private Dictionary<string, GanttTask> TaskById
    {
        get
        {
            if (!ReferenceEquals(_taskByIdSource, Tasks))
            {
                _taskByIdSource = Tasks;
                _taskById = new Dictionary<string, GanttTask>();
                foreach (var t in Tasks) _taskById.TryAdd(t.Id, t);
            }
            return _taskById;
        }
    }

    private static GanttDateRange RangeFor(GanttTask task, bool hasChildren, IReadOnlyDictionary<string, GanttDateRange> ranges)
        => hasChildren
            ? (ranges.TryGetValue(task.Id, out var range) ? range : new GanttDateRange("", ""))
            : new GanttDateRange(task.Start ?? "", task.End ?? "");

    // The roving cursor, clamped to the cells that exist now: collapsing a
    // parent can remove the row it named, and the grid must never leave the
    // tab order.
    private int ActiveRow => Math.Min(_focusedRow, Math.Max(Rows.Count - 1, 0));
    private int ActiveCol => Math.Min(_focusedCol, Math.Max(Columns.Count - 1, 0));

    /// <summary>Editing needs every label its controls show; an unnamed Save is worse than none.</summary>
    private bool CanEdit
        => !Readonly
           && Labels.DateTimePickerLabels is not null
           && !string.IsNullOrEmpty(Labels.StartLabel)
           && !string.IsNullOrEmpty(Labels.EndLabel)
           && !string.IsNullOrEmpty(Labels.SaveLabel)
           && !string.IsNullOrEmpty(Labels.CancelLabel);

    internal string EditStartInputId => $"{_baseId}-edit-start";

    private string ResolveTaskLabel(GanttTask task) => (TaskLabel ?? (t => t.Label))(task);

    private IReadOnlyList<string> PredecessorLabels(GanttTask task)
    {
        var labels = new List<string>();
        string NameOf(string id) => TaskById.TryGetValue(id, out var predecessor) ? ResolveTaskLabel(predecessor) : id;
        if (task.DependsOn is { Count: > 0 } dependsOn) labels.AddRange(dependsOn.Select(NameOf));
        if (task.Dependencies is { Count: > 0 } typed)
        {
            labels.AddRange(typed.Select(d => Labels.DependencyDetail is { } detail
                ? detail(NameOf(d.Id), d.Type ?? "e2s", d.Lag)
                : NameOf(d.Id)));
        }
        return labels;
    }

    internal string BaselineId(string taskId) => $"{_baseId}-baseline-{taskId}";

    private static int VarianceDays(GanttBaseline baseline, string currentEnd)
    {
        if (string.IsNullOrEmpty(currentEnd)) return 0;
        var a = DateTimePicker.ParseIsoDate(baseline.End);
        var b = DateTimePicker.ParseIsoDate(currentEnd);
        return a is { } x && b is { } y ? (int)(DateTimePicker.ToEpochDay(y) - DateTimePicker.ToEpochDay(x)) : 0;
    }

    private static bool HasBaseline(GanttTask task, GanttColumn column)
        => task.Baseline is { } b && RangesOverlap(column.Start, column.End, b.Start, b.End);

    /// <summary>The ids a cell is described by: the dependency summary, then the baseline summary.</summary>
    private string? DescribedBy(GanttTask task, bool hasDeps)
    {
        var ids = new List<string>();
        if (hasDeps) ids.Add(DependencyId(task.Id));
        if (task.Baseline is not null && Labels.BaselineSummary is not null) ids.Add(BaselineId(task.Id));
        return ids.Count > 0 ? string.Join(" ", ids) : null;
    }

    private string RootClass => $"gantt-chart {CssClass}".Trim();

    private string CellId(int row, int col) => $"{_baseId}-cell-{row}-{col}";

    private void Announce(string? message)
    {
        if (!string.IsNullOrEmpty(message)) _statusMessage = message;
    }

    // -------------------------------------------------------------------
    // Typed fields, inline editing, export.
    // -------------------------------------------------------------------

    // Type defaults (format, compare, export value) resolved once per Fields / Locale change, never per task or keystroke.
    private IReadOnlyList<DataGridColumn>? _fieldsSource;
    private string? _localeSource;
    private IReadOnlyList<DataGridColumn> _resolvedFields = Array.Empty<DataGridColumn>();

    private IReadOnlyList<DataGridColumn> ResolvedFields
    {
        get
        {
            if (!ReferenceEquals(_fieldsSource, Fields) || _localeSource != Locale)
            {
                _fieldsSource = Fields;
                _localeSource = Locale;
                _resolvedFields = TypedFields.Resolve(Fields, Locale);
            }
            return _resolvedFields;
        }
    }

    private bool IsFieldEditable(DataGridColumn field) => OnFieldEdit.HasDelegate && !Readonly && TypedFields.IsEditable(field);

    /// <summary>The field being edited: the draft is the editor's text.</summary>
    private sealed record FieldEditing(string TaskId, string FieldId, string Draft, bool Invalid = false);

    private FieldEditing? _fieldEditing;
    private bool _focusEditorPending;

    private string EditorId => $"{_baseId}-field-editor";

    private bool IsEditingField(GanttTask task, DataGridColumn field)
        => _fieldEditing is { } e && e.TaskId == task.Id && e.FieldId == field.Id;

    private void StartFieldEdit(GanttTask task, DataGridColumn field)
    {
        if (!IsFieldEditable(field)) return;
        _editingTaskId = null;
        _fieldEditing = new FieldEditing(task.Id, field.Id, TypedFields.Draft(field, task.Values));
        _focusEditorPending = true;
    }

    private void SetFieldDraft(string draft)
    {
        if (_fieldEditing is not null) _fieldEditing = _fieldEditing with { Draft = draft, Invalid = false };
    }

    /// <summary>Accept the edit, or refuse it (keeping the editor open) when the value does not fit the field's type. Returns whether it was accepted or unchanged.</summary>
    private async Task<bool> CommitFieldEditAsync(bool refocus = false)
    {
        var current = _fieldEditing;
        if (current is null) return true;
        var task = TaskById.TryGetValue(current.TaskId, out var found) ? found : null;
        var field = ResolvedFields.FirstOrDefault(x => x.Id == current.FieldId);
        if (task is null || field is null)
        {
            _fieldEditing = null;
            return true;
        }
        var outcome = TypedFields.Evaluate(field, task.Values, current.Draft);
        if (outcome.Invalid)
        {
            _fieldEditing = current with { Invalid = true };
            Announce(outcome.Message is not null && Labels.EditRefused is not null
                ? Labels.EditRefused(ResolveTaskLabel(task), field.Header, outcome.Message)
                : Labels.EditInvalid?.Invoke(ResolveTaskLabel(task), field.Header));
            return false;
        }
        _fieldEditing = null;
        if (outcome.Changed)
        {
            _fieldHistory = _fieldHistory.Record(new EditRecord(task.Id, field.Id, outcome.Value, outcome.Previous));
            await OnFieldEdit.InvokeAsync(new GanttFieldEdit(task.Id, field.Id, outcome.Value, outcome.Previous));
            Announce(Labels.EditAnnouncement?.Invoke(ResolveTaskLabel(task), field.Header, outcome.Text));
        }
        if (refocus) _focusCellPending = true;
        return true;
    }

    private void CancelFieldEdit()
    {
        if (_fieldEditing is null) return;
        _fieldEditing = null;
        _focusCellPending = true;
    }

    private async Task OnFieldEditorKeyDownAsync(KeyboardEventArgs args)
    {
        // An input method reports its composing keys as "Process": Enter picks a candidate and Escape cancels
        // the composition, so neither commits nor cancels the edit.
        if (args.Key == "Process") return;
        if (args.Key == "Enter") await CommitFieldEditAsync(true);
        else if (args.Key == "Escape") CancelFieldEdit();
    }

    private async Task OnFieldSelectChangedAsync(ChangeEventArgs e)
    {
        SetFieldDraft(e.Value?.ToString() ?? "");
        await CommitFieldEditAsync(true);
    }

    private IReadOnlyList<GanttTask> ExportTasks()
        => (ExportScope == GanttExportScope.Visible ? Rows : FlattenTasks(Tasks, new HashSet<string>()).Where(r => MatchesSearch(r.Task)).ToList()).Select(r => r.Task).ToList();

    private bool HasExportButtons => Labels.ExportHeaders is not null && (Labels.Copy is not null || Labels.ExportCsv is not null || Labels.ExportTsv is not null || Labels.ExportExcel is not null);

    private static object? ExportDate(string? iso)
        => !string.IsNullOrEmpty(iso) && DateOnly.TryParseExact(iso, "yyyy-MM-dd", System.Globalization.CultureInfo.InvariantCulture, System.Globalization.DateTimeStyles.None, out var d) ? d : null;

    private async Task RunCopyAsync()
    {
        if (BuildExportTable() is not { } table) return;
        var text = System.Text.Encoding.UTF8.GetString(ExportData.ExportBytes(table, DataGridExportFormat.Tsv, ExportFilename)).TrimStart('\uFEFF');
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

    private ExportTable? BuildExportTable()
    {
        if (Labels.ExportHeaders is not { } h) return null;
        var fields = TypedFields.Exportable(ResolvedFields);
        var ranges = EffectiveRanges(Tasks);
        var headers = new List<string> { h.Task, h.Start, h.End };
        if (h.PercentComplete is not null) headers.Add(h.PercentComplete);
        if (h.Parent is not null) headers.Add(h.Parent);
        if (h.DependsOn is not null) headers.Add(h.DependsOn);
        if (h.BaselineStart is not null) headers.Add(h.BaselineStart);
        if (h.BaselineEnd is not null) headers.Add(h.BaselineEnd);
        foreach (var f in fields) headers.Add(f.Header);
        var hasChildren = Tasks.Where(t => t.ParentId is not null && TaskById.ContainsKey(t.ParentId)).Select(t => t.ParentId!).ToHashSet();
        var rows = new List<IReadOnlyList<object?>>();
        foreach (var task in ExportTasks())
        {
            var span = hasChildren.Contains(task.Id) ? (ranges.TryGetValue(task.Id, out var r) ? r : new GanttDateRange("", "")) : new GanttDateRange(task.Start ?? "", task.End ?? "");
            var cells = new List<object?> { ResolveTaskLabel(task), ExportDate(span.Start), ExportDate(span.End) };
            if (h.PercentComplete is not null) cells.Add(task.PercentComplete);
            if (h.Parent is not null) cells.Add(task.ParentId is not null && TaskById.TryGetValue(task.ParentId, out var parent) ? ResolveTaskLabel(parent) : null);
            if (h.DependsOn is not null)
            {
                var ids = (task.DependsOn ?? Array.Empty<string>()).Concat((task.Dependencies ?? Array.Empty<GanttDependency>()).Select(d => d.Id));
                cells.Add(string.Join("; ", ids.Select(id => TaskById.TryGetValue(id, out var predecessor) ? ResolveTaskLabel(predecessor) : id)));
            }
            if (h.BaselineStart is not null) cells.Add(ExportDate(task.Baseline?.Start));
            if (h.BaselineEnd is not null) cells.Add(ExportDate(task.Baseline?.End));
            foreach (var f in fields) cells.Add(TypedFields.ExportCell(f, task.Values));
            rows.Add(cells);
        }
        return new ExportTable(headers, rows);
    }

    private async Task RunExportAsync(DataGridExportFormat format)
    {
        if (BuildExportTable() is not { } table) return;
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

    // ---- Windowing (Virtualize) ----

    private double _scrollTop;
    private double? _scrollToPending;
    private string ScrollId => $"{_baseId}-scroll";

    /// <summary>The row indices to render, with spacer heights for the rows left out (everything without <c>Virtualize</c>).</summary>
    private List<(int Row, int SpacerRows)> RenderItems(int rowCount)
    {
        var items = new List<(int, int)>();
        if (Virtualize is not { } v)
        {
            for (var i = 0; i < rowCount; i++) items.Add((i, 0));
            return items;
        }
        var start = Math.Max(0, (int)Math.Floor(_scrollTop / v.RowHeight) - v.Overscan);
        var end = Math.Min(rowCount, (int)Math.Ceiling((_scrollTop + v.Height) / v.RowHeight) + v.Overscan);
        var indices = new SortedSet<int>();
        for (var i = start; i < end; i++) indices.Add(i);
        // The roving tab stop's row always renders, so the grid never leaves the tab order.
        if (rowCount > 0) indices.Add(Math.Min(_focusedRow, rowCount - 1));
        var previous = -1;
        foreach (var index in indices)
        {
            if (index - previous > 1) items.Add((-1, index - previous - 1));
            items.Add((index, 0));
            previous = index;
        }
        if (rowCount - 1 - previous > 0) items.Add((-1, rowCount - 1 - previous));
        return items;
    }

    /// <summary>Bring a row into the scroll area (a virtualized chart renders only what is in view).</summary>
    private void RevealRow(int rowIndex)
    {
        if (Virtualize is not { } v) return;
        double top = rowIndex * v.RowHeight;
        var next = _scrollTop;
        if (top < _scrollTop) next = top;
        else if (top + v.RowHeight > _scrollTop + v.Height) next = top + v.RowHeight - v.Height;
        if (next == _scrollTop) return;
        _scrollTop = next;
        _scrollToPending = next;
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

    // -------------------------------------------------------------------
    // Hierarchy.
    // -------------------------------------------------------------------

    /// <summary>Every task that has children (the ones a collapse button applies to).</summary>
    private List<string> ParentIds
        => Tasks.Where(t => t.ParentId is not null).Select(t => t.ParentId!).Distinct().Where(id => TaskById.ContainsKey(id)).ToList();

    private async Task SetAllCollapsedAsync(bool value)
    {
        CollapsedTaskIds = value ? ParentIds : new List<string>();
        _focusedRow = ActiveRow;
        await CollapsedTaskIdsChanged.InvokeAsync(CollapsedTaskIds);
    }

    private async Task ToggleCollapseAsync(string taskId)
    {
        CollapsedTaskIds = CollapsedTaskIds.Contains(taskId)
            ? CollapsedTaskIds.Where(id => id != taskId).ToList()
            : CollapsedTaskIds.Append(taskId).ToList();
        await CollapsedTaskIdsChanged.InvokeAsync(CollapsedTaskIds);
        // Unlike grid-cell/move-menu focus, no explicit refocus is needed:
        // the collapse button is a plain <button> click target, so the
        // browser already keeps focus on it through the re-render. The
        // stored cursor is kept on a row that still exists.
        _focusedRow = ActiveRow;
    }

    /// <summary>The cursor follows focus however it arrives — a click, or a consumer's own focus().</summary>
    private void OnCellFocusIn(int row, int col)
    {
        _focusedRow = row;
        _focusedCol = col;
    }

    // -------------------------------------------------------------------
    // Edit — keyboard (composed DateTimePicker) and pointer (native DnD).
    // -------------------------------------------------------------------

    private async Task ApplyChangeAsync(GanttTask task, string start, string end)
    {
        await OnTaskChange.InvokeAsync((task.Id, start, end));
        Announce(Labels.DateAnnouncement?.Invoke(ResolveTaskLabel(task), start, end));
    }

    private void OpenEdit(GanttTask task)
    {
        if (!CanEdit) return;
        _editingTaskId = task.Id;
        _editStart = task.Start ?? "";
        _editEnd = task.End ?? "";
        _editPercent = task.PercentComplete?.ToString() ?? "";
        // Focus moves into the region it opened, onto the start date's field.
        _focusEditPending = true;
    }

    /// <summary>
    /// A range entered end-first is saved start-first; Save is disabled while
    /// either date is empty. Closing either way returns focus to the grid's
    /// tab stop, on the edited task's row.
    /// </summary>
    private async Task SaveEditAsync(GanttTask task)
    {
        if (string.IsNullOrEmpty(_editStart) || string.IsNullOrEmpty(_editEnd)) return;
        var (start, end) = CompareIso(_editStart, _editEnd) <= 0 ? (_editStart, _editEnd) : (_editEnd, _editStart);
        if (!string.IsNullOrEmpty(Labels.PercentLabel)
            && double.TryParse(_editPercent, System.Globalization.NumberStyles.Float, System.Globalization.CultureInfo.InvariantCulture, out var raw))
        {
            var percent = (int)Math.Min(100, Math.Max(0, Math.Round(raw, MidpointRounding.AwayFromZero)));
            await OnTaskPercentChange.InvokeAsync((task.Id, percent));
        }
        await ApplyChangeAsync(task, start, end);
        _editingTaskId = null;
        _focusCellPending = true;
    }

    private void CancelEdit()
    {
        _editingTaskId = null;
        _focusCellPending = true;
    }

    private void OnBarDragStart(GanttTask task, DragEventArgs _)
    {
        _draggingTaskId = task.Id;
        _resizingEdge = null;
    }

    /// <summary>Which edge of the dragged task's bar is being resized, or null for a whole-bar move.</summary>
    private string? _resizingEdge;

    private void OnHandleDragStart(GanttTask task, string edge)
    {
        _draggingTaskId = task.Id;
        _resizingEdge = edge;
    }

    // ---- Zoom ----

    private static readonly GanttTimeUnit[] ZoomOrder = { GanttTimeUnit.Month, GanttTimeUnit.Week, GanttTimeUnit.Day };

    private int ZoomIndex => Array.IndexOf(ZoomOrder, TimeUnit);

    private async Task ZoomAsync(int delta)
    {
        var next = ZoomIndex + delta;
        if (next < 0 || next >= ZoomOrder.Length) return;
        TimeUnit = ZoomOrder[next];
        await TimeUnitChanged.InvokeAsync(TimeUnit);
        Announce(Labels.ZoomAnnouncement?.Invoke(TimeUnit));
    }

    // ---- Selection ----

    private async Task SelectTaskAsync(string taskId)
    {
        SelectedTaskId = SelectedTaskId == taskId ? null : taskId;
        await SelectedTaskIdChanged.InvokeAsync(SelectedTaskId);
    }

    // ---- Keyboard shift / resize (Alt+Arrow) ----

    private int ColumnIndexOf(string isoDate)
    {
        var columns = Columns;
        for (var i = 0; i < columns.Count; i++)
        {
            if (RangesOverlap(columns[i].Start, columns[i].End, isoDate, isoDate)) return i;
        }
        return -1;
    }

    private async Task ShiftTaskAsync(GanttTask task, int delta, bool endOnly)
    {
        if (string.IsNullOrEmpty(task.Start) || string.IsNullOrEmpty(task.End)) return; // an unscheduled task has nothing to shift
        var columns = Columns;
        if (endOnly)
        {
            var i = ColumnIndexOf(task.End) + delta;
            if (i >= 0 && i < columns.Count && CompareIso(task.Start, columns[i].End) <= 0)
                await ApplyChangeAsync(task, task.Start, columns[i].End);
            return;
        }
        var j = ColumnIndexOf(task.Start) + delta;
        if (j < 0 || j >= columns.Count) return;
        var startEpoch = DateTimePicker.ToEpochDay(DateTimePicker.ParseIsoDate(task.Start) ?? default);
        var endEpoch = DateTimePicker.ToEpochDay(DateTimePicker.ParseIsoDate(task.End) ?? default);
        await ApplyChangeAsync(task, columns[j].Start, AddDays(columns[j].Start, (int)(endEpoch - startEpoch)));
    }

    // Same simplification as KanbanBoard's OnColumnDragOver: Blazor cannot
    // combine a plain @ondragover handler with an @ondragover:preventDefault
    // modifier on the same component tag (RZ10010), so default is prevented
    // unconditionally via the modifier alone — harmless, since OnCellDropAsync
    // only acts when it can resolve a real dragged GanttTask.

    private IReadOnlyList<GanttMarker> MarkersIn(GanttColumn column)
        => Markers.Where(m => RangesOverlap(column.Start, column.End, m.Date, m.Date)).ToList();

    private static string? MarkerKinds(IReadOnlyList<GanttMarker> markers)
        => markers.Count == 0 ? null : string.Join(" ", markers.Select(m => m.Kind ?? "marker"));

    private bool IsWeekendColumn(GanttColumn column)
    {
        if (Weekends is not { Count: > 0 } || column.Start != column.End) return false;
        var day = DateTimePicker.ParseIsoDate(column.Start);
        return day is { } d && Weekends.Contains(Helpers.DependencyArrowGeometry.WeekdayOfEpochDay((long)DateTimePicker.ToEpochDay(d)));
    }

    private bool IsNonWorkingColumn(GanttColumn column)
    {
        if (IsNonWorking is null) return false;
        for (var d = column.Start; CompareIso(d, column.End) <= 0; d = AddDays(d, 1))
        {
            if (!IsNonWorking(d)) return false;
        }
        return true;
    }

    private async Task OnCellDropAsync(GanttColumn column, DragEventArgs _)
    {
        if (Readonly) return;
        var taskId = _draggingTaskId;
        _draggingTaskId = null;
        var task = taskId is not null && TaskById.TryGetValue(taskId, out var dropped) ? dropped : null;
        var edge = _resizingEdge;
        _resizingEdge = null;
        if (task is null || string.IsNullOrEmpty(task.Start) || string.IsNullOrEmpty(task.End)) return;
        if (edge is not null)
        {
            // Resizing moves one edge to the dropped column; the other stays, and the range cannot invert.
            var newStart = edge == "start" ? column.Start : task.Start;
            var newEnd = edge == "end" ? column.End : task.End;
            if (CompareIso(newStart, newEnd) <= 0 && (newStart != task.Start || newEnd != task.End))
                await ApplyChangeAsync(task, newStart, newEnd);
            return;
        }
        var startEpoch = DateTimePicker.ToEpochDay(DateTimePicker.ParseIsoDate(task.Start) ?? default);
        var endEpoch = DateTimePicker.ToEpochDay(DateTimePicker.ParseIsoDate(task.End) ?? default);
        var duration = (int)(endEpoch - startEpoch);
        await ApplyChangeAsync(task, column.Start, AddDays(column.Start, duration));
    }

    // -------------------------------------------------------------------
    // Roving-tabindex grid keyboard navigation (WAI-ARIA APG Grid pattern).
    // -------------------------------------------------------------------

    private async Task FocusActiveCellAsync()
    {
        await FocusByIdAsync(CellId(ActiveRow, ActiveCol));
    }

    private async Task FocusByIdAsync(string id)
    {
        var script = $"document.getElementById({JsonString(id)})?.focus({{preventScroll:true}})";
        try
        {
            await JS.InvokeVoidAsync("eval", script);
        }
        catch
        {
            // ignore prerender / interop failure
        }
    }

    private void MoveFocus(int row, int col, int columnCount, int rowCount)
    {
        _focusedRow = Math.Min(Math.Max(row, 0), Math.Max(rowCount - 1, 0));
        _focusedCol = Math.Min(Math.Max(col, 0), Math.Max(columnCount - 1, 0));
        RevealRow(_focusedRow);
        _focusCellPending = true;
    }

    /// <summary>Put an earlier field value back (or re-apply one), reported through <c>OnFieldEdit</c> like any edit: the consumer owns the data.</summary>
    private async Task StepFieldHistoryAsync(string action)
    {
        var step = action == "undo" ? _fieldHistory.UndoStep() : _fieldHistory.RedoStep();
        if (step.Record is not { } record) return;
        _fieldHistory = step.History;
        if (!TaskById.TryGetValue(record.OwnerId, out var task)) return;
        var field = ResolvedFields.FirstOrDefault(f => f.Id == record.FieldId);
        if (field is null) return;
        var restored = action == "undo" ? record.Previous : record.Value;
        var replaced = action == "undo" ? record.Value : record.Previous;
        await OnFieldEdit.InvokeAsync(new GanttFieldEdit(task.Id, field.Id, restored, replaced));
        var text = restored is null ? "" : Convert.ToString(restored, System.Globalization.CultureInfo.InvariantCulture) ?? "";
        Announce((action == "undo" ? Labels.FieldUndoAnnouncement : Labels.FieldRedoAnnouncement)?.Invoke(ResolveTaskLabel(task), field.Header, text));
        _focusCellPending = true;
    }

    private async Task OnGridKeyDown(KeyboardEventArgs args)
    {
        // See KanbanBoard's own note on the same guard: Blazor's
        // KeyboardEventArgs carries no event-target info, so while the
        // edit region is open, keyboard ownership belongs to its two
        // composed DateTimePicker instances and the Save/Cancel buttons.
        if (_editingTaskId is not null || _fieldEditing is not null) return;

        var rows = Rows;
        var columns = Columns;
        var rowCount = rows.Count;
        var columnCount = columns.Count;
        var ctrlOrMeta = args.CtrlKey || args.MetaKey;

        var logical = GridMotion.LogicalKey(args.Key, Rtl);
        if (OnFieldEdit.HasDelegate && !Readonly && EditHistory.KeyAction(args.Key, args.CtrlKey, args.MetaKey, args.ShiftKey, args.AltKey) is { } historyAction)
        {
            await StepFieldHistoryAsync(historyAction);
            return;
        }

        if (args.AltKey && (logical == "ArrowLeft" || logical == "ArrowRight"))
        {
            // Alt+Arrow shifts the task one column; Alt+Shift+Arrow moves only its end.
            if (_focusedRow >= 0 && _focusedRow < rows.Count && !Readonly && !rows[_focusedRow].HasChildren)
            {
                await ShiftTaskAsync(rows[_focusedRow].Task, logical == "ArrowLeft" ? -1 : 1, args.ShiftKey);
                return;
            }
        }

        if (args.Key == "F2" && OnFieldEdit.HasDelegate)
        {
            // F2: edit the task's first editable field (the keyboard twin of clicking its value).
            var first = ResolvedFields.FirstOrDefault(IsFieldEditable);
            if (_focusedRow >= 0 && _focusedRow < rows.Count && first is not null) StartFieldEdit(rows[_focusedRow].Task, first);
            return;
        }

        // Type-ahead on the task labels; "s" stays the select shortcut unless a prefix is in progress.
        if (Typeahead.IsKey(args.Key, args.CtrlKey, args.AltKey, args.MetaKey))
        {
            var now = Environment.TickCount64;
            var continuing = _typeahead.Prefix != "" && now - _typeahead.At <= Typeahead.ResetMs;
            if (continuing || !(args.Key == "s" || args.Key == "S"))
            {
                var state = Typeahead.Next(_typeahead, args.Key, now);
                var hit = Typeahead.FindMatch(rows.Select(r => ResolveTaskLabel(r.Task)).ToList(), _focusedRow, state.Prefix);
                if (hit != -1)
                {
                    _typeahead = state;
                    MoveFocus(hit, _focusedCol, columnCount, rowCount);
                    return;
                }
            }
        }

        var pageStep = Virtualize is { } vz ? Math.Max(1, vz.Height / Math.Max(1, vz.RowHeight)) : 10;
        if (GridMotion.Move(args.Key, ctrlOrMeta, new GridPosition(_focusedRow, _focusedCol), new GridNavigation(0, rowCount - 1, columnCount - 1, pageStep, Rtl: Rtl)) is { } moved)
        {
            MoveFocus(moved.Row, moved.Col, columnCount, rowCount);
            return;
        }

        switch (args.Key)
        {
            case "s":
            case "S":
                if (!args.CtrlKey && !args.MetaKey && !args.AltKey && _focusedRow >= 0 && _focusedRow < rows.Count)
                    await SelectTaskAsync(rows[_focusedRow].Task.Id);
                break;
            case "ArrowUp":
                MoveFocus(_focusedRow - 1, _focusedCol, columnCount, rowCount);
                break;
            case "ArrowDown":
                MoveFocus(_focusedRow + 1, _focusedCol, columnCount, rowCount);
                break;
            case "ArrowLeft":
                MoveFocus(_focusedRow, _focusedCol - 1, columnCount, rowCount);
                break;
            case "ArrowRight":
                MoveFocus(_focusedRow, _focusedCol + 1, columnCount, rowCount);
                break;
            case "Home":
                if (ctrlOrMeta) MoveFocus(0, 0, columnCount, rowCount);
                else MoveFocus(_focusedRow, 0, columnCount, rowCount);
                break;
            case "End":
                if (ctrlOrMeta) MoveFocus(rowCount - 1, columnCount - 1, columnCount, rowCount);
                else MoveFocus(_focusedRow, columnCount - 1, columnCount, rowCount);
                break;
            case "Enter":
            case " ":
            {
                if (_focusedRow >= 0 && _focusedRow < rows.Count)
                {
                    var row = rows[_focusedRow];
                    if (!row.HasChildren) OpenEdit(row.Task);
                }
                break;
            }
        }
    }

    // -------------------------------------------------------------------
    // Lifecycle.
    // -------------------------------------------------------------------

    protected override void OnParametersSet()
    {
        // A new Tasks can remove the row the cursor named.
        _focusedRow = ActiveRow;
        _focusedCol = ActiveCol;
    }

    /// <summary>Measure each rendered row's bar (first and last in-range cell) in one call and rebuild the arrows when they changed.</summary>
    private async Task MeasureArrowsAsync()
    {
        if (!DependencyArrows)
        {
            if (_arrows.Count > 0 || _arrowSignature != "")
            {
                _arrows = new();
                _arrowSignature = "";
                StateHasChanged();
            }
            return;
        }
        string? json;
        try
        {
            json = await JS.InvokeAsync<string?>("eval", $"(function(){{var h=document.getElementById({JsonString(ScrollId)});if(!h)return null;var r=h.getBoundingClientRect(),dx=h.scrollLeft-r.left,dy=h.scrollTop-r.top,b={{}};h.querySelectorAll('tr[data-task-id]').forEach(function(tr){{var c=tr.querySelectorAll('td[data-in-range]');if(!c.length)return;var f=c[0].getBoundingClientRect(),l=c[c.length-1].getBoundingClientRect();b[tr.getAttribute('data-task-id')]=[f.left+dx,l.right+dx,f.top+dy,f.bottom+dy];}});return JSON.stringify({{w:h.scrollWidth,h:h.scrollHeight,b:b}});}})()");
        }
        catch
        {
            return; // prerender / interop failure
        }
        if (string.IsNullOrEmpty(json) || json == _arrowSignature) return;
        _arrowSignature = json;
        using var doc = System.Text.Json.JsonDocument.Parse(json);
        var boxes = new Dictionary<string, ArrowBox>();
        foreach (var entry in doc.RootElement.GetProperty("b").EnumerateObject())
        {
            var v = entry.Value;
            boxes[entry.Name] = new ArrowBox(v[0].GetDouble(), v[1].GetDouble(), v[2].GetDouble(), v[3].GetDouble());
        }
        var next = new List<Arrow>();
        foreach (var (id, to) in boxes)
        {
            if (!TaskById.TryGetValue(id, out var task)) continue;
            var deps = (task.DependsOn ?? Array.Empty<string>()).Select(d => (Id: d, Type: "e2s"))
                .Concat((task.Dependencies ?? Array.Empty<GanttDependency>()).Select(d => (d.Id, d.Type ?? "e2s")));
            foreach (var (predecessorId, kind) in deps)
            {
                if (!boxes.TryGetValue(predecessorId, out var from)) continue;
                next.Add(new Arrow($"{predecessorId}>{id}", predecessorId, id, kind, Helpers.DependencyArrowGeometry.Path(kind, from, to)));
            }
        }
        _arrows = next;
        _overlayWidth = doc.RootElement.GetProperty("w").GetDouble();
        _overlayHeight = doc.RootElement.GetProperty("h").GetDouble();
        StateHasChanged();
    }

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        await MeasureArrowsAsync();
        if (_scrollToPending is { } scrollTo)
        {
            _scrollToPending = null;
            try
            {
                await JS.InvokeVoidAsync("eval", $"(function(){{var e=document.getElementById({JsonString(ScrollId)});if(e)e.scrollTop={scrollTo.ToString(System.Globalization.CultureInfo.InvariantCulture)};}})()");
            }
            catch
            {
                // ignore prerender / interop failure
            }
        }
        if (_focusEditorPending)
        {
            _focusEditorPending = false;
            try
            {
                await JS.InvokeVoidAsync("eval", $"(function(){{var e=document.getElementById({JsonString(EditorId)});if(e){{e.focus();if(e.tagName==='INPUT'&&e.type==='text')e.select();}}}})()");
            }
            catch
            {
                // ignore prerender / interop failure
            }
        }
        if (_focusEditPending)
        {
            _focusEditPending = false;
            await FocusByIdAsync(EditStartInputId);
        }
        if (_focusCellPending)
        {
            _focusCellPending = false;
            await FocusActiveCellAsync();
        }
    }

    private static string JsonString(string s) => System.Text.Json.JsonSerializer.Serialize(s);
}
