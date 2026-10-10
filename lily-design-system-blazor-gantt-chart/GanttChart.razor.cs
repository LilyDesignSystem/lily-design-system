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

/// <summary>A Gantt task. See <c>spec/index.md §5</c>.</summary>
public sealed class GanttTask
{
    /// <summary>Stable task identifier.</summary>
    public required string Id { get; init; }

    /// <summary>Visible task label.</summary>
    public required string Label { get; init; }

    /// <summary>ISO date (<c>YYYY-MM-DD</c>), inclusive.</summary>
    public required string Start { get; init; }

    /// <summary>ISO date (<c>YYYY-MM-DD</c>), inclusive. Equal to <see cref="Start"/> means a milestone.</summary>
    public required string End { get; init; }

    /// <summary>0-100. Rendering the fill is the consumer's own CSS.</summary>
    public int? PercentComplete { get; init; }

    /// <summary>Another task's id; builds the row hierarchy.</summary>
    public string? ParentId { get; init; }

    /// <summary>Other tasks' ids this task depends on (finish-to-start).</summary>
    public IReadOnlyList<string>? DependsOn { get; init; }
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
    public Func<string, string, GanttTimeUnit, string>? ColumnLabel { get; init; }
    public Func<GanttTask, string>? EditButton { get; init; }
    public string? StartLabel { get; init; }
    public string? EndLabel { get; init; }

    /// <summary>Reused for both composed DateTimePicker instances. Editing is gated on this.</summary>
    public DateTimePickerLabels? DateTimePickerLabels { get; init; }

    public string? SaveLabel { get; init; }
    public string? CancelLabel { get; init; }
    public Func<IReadOnlyList<string>, string>? DependencySummary { get; init; }
    public Func<string, string, string, string>? DateAnnouncement { get; init; }
    public Func<GanttTask, bool, string>? CollapseButton { get; init; }
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

    /// <summary>Column granularity. A static rendering choice, not an interactive zoom control.</summary>
    [Parameter] public GanttTimeUnit TimeUnit { get; set; } = GanttTimeUnit.Day;

    /// <summary>ISO date marking "today"; never computed internally (stays SSR-safe).</summary>
    [Parameter] public string? Today { get; set; }

    /// <summary>Resolves a task to its display label. Defaults to <c>task.Label</c>.</summary>
    [Parameter] public Func<GanttTask, string>? TaskLabel { get; set; }

    /// <summary>Called after a task's start/end changes, by pointer or by the edit region.</summary>
    [Parameter] public EventCallback<(string TaskId, string Start, string End)> OnTaskChange { get; set; }

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
    private readonly HashSet<string> _collapsed = new();
    private int _focusedRow;
    private int _focusedCol;

    private string? _editingTaskId;
    private string _editStart = "";
    private string _editEnd = "";

    private string? _draggingTaskId;

    private bool _focusCellPending;

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
        foreach (var task in tasks)
        {
            if (task.ParentId is null)
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
    {
        var children = allTasks.Where(t => t.ParentId == task.Id).ToList();
        if (children.Count == 0) return new GanttDateRange(task.Start, task.End);

        var start = "";
        var end = "";
        foreach (var child in children)
        {
            var r = EffectiveRange(child, allTasks);
            if (start == "" || CompareIso(r.Start, start) < 0) start = r.Start;
            if (end == "" || CompareIso(r.End, end) > 0) end = r.End;
        }
        return new GanttDateRange(start, end);
    }

    // -------------------------------------------------------------------
    // Derived data.
    // -------------------------------------------------------------------

    private IReadOnlyList<GanttColumn> Columns => GenerateColumns(Range, TimeUnit);

    private IReadOnlyList<GanttFlatRow> Rows => FlattenTasks(Tasks, _collapsed);

    private GanttDateRange RangeFor(GanttTask task, bool hasChildren)
        => hasChildren ? EffectiveRange(task, Tasks) : new GanttDateRange(task.Start, task.End);

    private string ResolveTaskLabel(GanttTask task) => (TaskLabel ?? (t => t.Label))(task);

    private IReadOnlyList<string> PredecessorLabels(GanttTask task)
    {
        if (task.DependsOn is not { Count: > 0 } dependsOn) return Array.Empty<string>();
        return dependsOn
            .Select(id => Tasks.FirstOrDefault(t => t.Id == id) is { } predecessor ? ResolveTaskLabel(predecessor) : id)
            .ToList();
    }

    private string RootClass => $"gantt-chart {CssClass}".Trim();

    private string CellId(int row, int col) => $"{_baseId}-cell-{row}-{col}";

    private void Announce(string? message)
    {
        if (!string.IsNullOrEmpty(message)) _statusMessage = message;
    }

    // -------------------------------------------------------------------
    // Hierarchy.
    // -------------------------------------------------------------------

    private void ToggleCollapse(string taskId)
    {
        if (!_collapsed.Remove(taskId)) _collapsed.Add(taskId);
        // Unlike grid-cell/move-menu focus, no explicit refocus is needed:
        // the collapse button is a plain <button> click target, so the
        // browser already keeps focus on it through the re-render.
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
        if (Labels.DateTimePickerLabels is null) return;
        _editingTaskId = task.Id;
        _editStart = task.Start;
        _editEnd = task.End;
    }

    private async Task SaveEditAsync(GanttTask task)
    {
        await ApplyChangeAsync(task, _editStart, _editEnd);
        _editingTaskId = null;
    }

    private void CancelEdit() => _editingTaskId = null;

    private void OnBarDragStart(GanttTask task, DragEventArgs _) => _draggingTaskId = task.Id;

    // Same simplification as KanbanBoard's OnColumnDragOver: Blazor cannot
    // combine a plain @ondragover handler with an @ondragover:preventDefault
    // modifier on the same component tag (RZ10010), so default is prevented
    // unconditionally via the modifier alone — harmless, since OnCellDropAsync
    // only acts when it can resolve a real dragged GanttTask.

    private async Task OnCellDropAsync(GanttColumn column, DragEventArgs _)
    {
        var taskId = _draggingTaskId;
        _draggingTaskId = null;
        var task = Tasks.FirstOrDefault(t => t.Id == taskId);
        if (task is null) return;
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
        var script = $"document.getElementById({JsonString(CellId(_focusedRow, _focusedCol))})?.focus({{preventScroll:true}})";
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
        _focusCellPending = true;
    }

    private void OnGridKeyDown(KeyboardEventArgs args)
    {
        // See KanbanBoard's own note on the same guard: Blazor's
        // KeyboardEventArgs carries no event-target info, so while the
        // edit region is open, keyboard ownership belongs to its two
        // composed DateTimePicker instances and the Save/Cancel buttons.
        if (_editingTaskId is not null) return;

        var rows = Rows;
        var columns = Columns;
        var rowCount = rows.Count;
        var columnCount = columns.Count;
        var ctrlOrMeta = args.CtrlKey || args.MetaKey;

        switch (args.Key)
        {
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

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (_focusCellPending)
        {
            _focusCellPending = false;
            await FocusActiveCellAsync();
        }
    }

    private static string JsonString(string s) => System.Text.Json.JsonSerializer.Serialize(s);
}
