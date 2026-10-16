// KanbanBoard — code-behind. See spec/index.md for the contract.
//
// Ported from the canonical Svelte package
// (lily-design-system-svelte-helpers/lily-design-system-svelte-kanban-board),
// translated to this catalog's own idioms: partial-class code-behind,
// AdditionalAttributes splatting instead of a headless `active` prop (the
// Blazor KanbanTable family has none — see the "role override" note below),
// and JS-eval-by-id focus calls where no component exposes an
// ElementReference (mirrors DateTimePicker's own established pattern for
// exactly this situation).

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

/// <summary>A kanban column. See <c>spec/index.md §5</c>.</summary>
public sealed class KanbanColumn
{
    /// <summary>Stable column identifier.</summary>
    public required string Id { get; init; }

    /// <summary>Visible column title.</summary>
    public required string Title { get; init; }

    /// <summary>Work-in-progress limit; the column warns when its card count exceeds this.</summary>
    public int? WipLimit { get; init; }

    /// <summary>A hard limit: a move into this column is refused once it holds <c>WipLimit</c> cards.</summary>
    public bool StrictLimit { get; init; }

    /// <summary>A non-colour status for the column (for example "Over capacity"): visible text in its header and <c>data-flag</c>.</summary>
    public string? Flag { get; init; }

    /// <summary>A hook for per-column colour: becomes <c>data-accent</c> on the header and every cell. Lily sets no colour.</summary>
    public string? Accent { get; init; }
}

/// <summary>A swimlane: a horizontal band of rows (an owner, an account) that cards are grouped into.</summary>
public sealed class KanbanLane
{
    /// <summary>Stable lane identifier.</summary>
    public required string Id { get; init; }

    /// <summary>Visible lane title.</summary>
    public required string Title { get; init; }
}

/// <summary>Windowing for a long board: only the rows in view are rendered. See <c>spec/index.md §15</c>.</summary>
public sealed record KanbanVirtualize(int RowHeight, int Height, int Overscan = 3);

/// <summary>A kanban card. See <c>spec/index.md §5</c>.</summary>
public sealed class KanbanCard
{
    /// <summary>Stable card identifier.</summary>
    public required string Id { get; init; }

    /// <summary>The column this card currently belongs to.</summary>
    public required string ColumnId { get; init; }

    /// <summary>Visible card title.</summary>
    public required string Title { get; init; }

    /// <summary>A locked card cannot be moved, dragged or reordered (<c>data-locked</c> on its cell); it still counts toward WIP limits.</summary>
    public bool Locked { get; init; }

    /// <summary>A second line under the title (a priority, "source · score", an amount).</summary>
    public string? Subtitle { get; init; }

    /// <summary>Short labels shown under the subtitle (each a <c>.kanban-board-card-badge</c>).</summary>
    public IReadOnlyList<string>? Badges { get; init; }

    /// <summary>A non-colour status (for example "SLA breached"): visible text, <c>data-flag</c>, and linked to the cell with <c>aria-describedby</c>.</summary>
    public string? Flag { get; init; }

    /// <summary>Makes the title a link to the record (<c>&lt;a href&gt;</c>).</summary>
    public string? Href { get; init; }

    /// <summary><c>false</c> stops pointer dragging this card while keeping the move menu and keyboard moves.</summary>
    public bool? Draggable { get; init; }

    /// <summary>The swimlane this card sits in (an id from <c>Lanes</c>); the first lane when absent.</summary>
    public string? LaneId { get; init; }
}

/// <summary>What the <c>CardTemplate</c> receives.</summary>
public sealed class KanbanCardContext
{
    public required KanbanCard Card { get; init; }
    public required string Label { get; init; }
    public required KanbanColumn Column { get; init; }
    public bool Pending { get; init; }
}

/// <summary>What <c>ColumnHeader</c> / <c>ColumnFooter</c> receive: the column and every card in it (unfiltered).</summary>
public sealed class KanbanColumnContext
{
    public required KanbanColumn Column { get; init; }
    public required IReadOnlyList<KanbanCard> Cards { get; init; }
    public int Count { get; init; }
}

/// <summary>
/// Every field is optional, but its presence gates the control it names —
/// no baked-in English fallback, matching every other helper's
/// label-presence-gates-control convention. See <c>spec/index.md §5</c>.
/// </summary>
public sealed record KanbanLabels
{
    /// <summary>Derived card count for a column header, e.g. "3 cards".</summary>
    public Func<int, string>? CardCount { get; init; }

    /// <summary>WIP-limit warning text, e.g. "Over limit: 4/3".</summary>
    public Func<int, int, string>? OverLimit { get; init; }

    /// <summary>Accessible name for a card's move-menu trigger button.</summary>
    public Func<KanbanCard, string>? MoveButton { get; init; }

    /// <summary>Accessible name for the move listbox.</summary>
    public string? MoveMenuLabel { get; init; }

    /// <summary>Announcement text after a successful move.</summary>
    public Func<string, string, string>? MoveAnnouncement { get; init; }

    /// <summary>Announced when <c>CanMove</c> refuses a move: (card title, column title).</summary>
    public Func<string, string, string>? MoveBlocked { get; init; }

    /// <summary>Announced after Alt+ArrowUp/Down reorders a card: (card title, 1-based position, total).</summary>
    public Func<string, int, int, string>? ReorderAnnouncement { get; init; }

    /// <summary>Accessible name for a column's collapse toggle: (column, collapsed). Gates the toggle.</summary>
    public Func<KanbanColumn, bool, string>? CollapseColumn { get; init; }

    /// <summary>Accessible name for a column's add-card button. Gates the button.</summary>
    public Func<KanbanColumn, string>? AddCard { get; init; }

    /// <summary>Message shown in an empty column (a column with no cards to show). Gates the message.</summary>
    public Func<KanbanColumn, string>? EmptyColumn { get; init; }

    /// <summary>Announced while an async <c>MoveHandler</c> is pending: (card title, column title).</summary>
    public Func<string, string, string>? MovePending { get; init; }

    /// <summary>Announced when an async <c>MoveHandler</c> fails and the card goes back: (card title, column title, the exception).</summary>
    public Func<string, string, Exception, string>? MoveFailed { get; init; }

    /// <summary>Accessible name for a lane's collapse toggle: (lane, collapsed). Gates the toggle.</summary>
    public Func<KanbanLane, bool, string>? CollapseLane { get; init; }

    /// <summary>Visible card count in a lane header: (lane, how many cards). Gates the count.</summary>
    public Func<KanbanLane, int, string>? LaneCount { get; init; }

    /// <summary>Accessible name of the board's search field. Gates the field.</summary>
    public string? Search { get; init; }

    /// <summary>Announced after several selected cards move together: (how many moved, destination column title).</summary>
    public Func<int, string, string>? MoveManyAnnouncement { get; init; }

    /// <summary>Visible text of the undo button. Gates the button (with <c>Undoable</c>).</summary>
    public string? Undo { get; init; }

    /// <summary>Announced after an undo: (card title, column it went back to).</summary>
    public Func<string, string, string>? UndoAnnouncement { get; init; }

    /// <summary>Announced after undoing a group of moves: (how many).</summary>
    public Func<int, string>? UndoManyAnnouncement { get; init; }

    /// <summary>Announced after a column moves: (column title, 1-based position, how many columns).</summary>
    public Func<string, int, int, string>? ColumnMoveAnnouncement { get; init; }
}

public partial class KanbanBoard : ComponentBase
{
    /// <summary>Monotonic instance counter; SSR-safe (no randomness, no clock).</summary>
    private static int _uid;

    // -------------------------------------------------------------------
    // Parameters — see spec/index.md §5.
    // -------------------------------------------------------------------

    /// <summary>Accessible name for the board, passed through to KanbanTable.</summary>
    [Parameter, EditorRequired] public string Label { get; set; } = "";

    /// <summary>Optional visible caption. KanbanTable has no built-in caption slot
    /// (unlike the canonical Svelte headless component), so this renders a
    /// literal &lt;caption&gt; as the table's first child — valid HTML, no
    /// modification to the headless component required.</summary>
    [Parameter] public string? Caption { get; set; }

    /// <summary>Column definitions.</summary>
    [Parameter, EditorRequired] public IReadOnlyList<KanbanColumn> Columns { get; set; } = Array.Empty<KanbanColumn>();

    /// <summary>Card data. Order within a column follows the order cards appear here.</summary>
    [Parameter, EditorRequired] public IReadOnlyList<KanbanCard> Cards { get; set; } = Array.Empty<KanbanCard>();

    /// <summary>Resolves a card to its display label. Defaults to <c>card.Title</c>.</summary>
    [Parameter] public Func<KanbanCard, string>? CardLabel { get; set; }

    /// <summary>Called after a card moves to a new column, by pointer or by the move menu.</summary>
    [Parameter] public EventCallback<(string CardId, string ToColumnId)> OnMove { get; set; }

    /// <summary>Raised additionally when a pointer drop landed on a card: (card, column, 0-based position in the visible column).</summary>
    [Parameter] public EventCallback<(string CardId, string ToColumnId, int ToIndex)> OnMoveAt { get; set; }

    /// <summary>
    /// An async move: awaited when a card moves. The card shows in its new column at once with <c>data-pending</c> and
    /// <c>aria-busy</c> and goes back if it throws (<c>Labels.MoveFailed</c>, <c>OnMoveError</c>). <c>OnMove</c> is raised either way.
    /// </summary>
    [Parameter] public Func<string, string, int?, Task>? MoveHandler { get; set; }

    /// <summary>Raised when an async <c>MoveHandler</c> throws, after the card has gone back.</summary>
    [Parameter] public EventCallback<(string CardId, string ToColumnId, Exception Error)> OnMoveError { get; set; }

    /// <summary>The columns a card may move to (its own column is always shown). The move menu offers only these; drops and keyboard moves elsewhere are refused.</summary>
    [Parameter] public Func<KanbanCard, IReadOnlyList<string>>? AllowedColumns { get; set; }

    /// <summary>Hides cards for which it returns false. Counts, WIP limits and over-limit warnings still use every card; a filtered column carries <c>data-hidden-count</c>.</summary>
    [Parameter] public Func<KanbanCard, bool>? Filter { get; set; }

    /// <summary>Orders the cards shown within each column (a stable sort).</summary>
    [Parameter] public Comparison<KanbanCard>? Compare { get; set; }

    /// <summary>Extra attributes on each card's cell (for example <c>data-priority</c>).</summary>
    [Parameter] public Func<KanbanCard, IReadOnlyDictionary<string, object>>? CardAttributes { get; set; }

    /// <summary>Raised additionally when a drop landed in a swimlane's cell: (card, column, lane).</summary>
    [Parameter] public EventCallback<(string CardId, string ToColumnId, string ToLaneId)> OnMoveToLane { get; set; }

    /// <summary>Swimlanes: horizontal bands of rows. Each card sits in the lane named by <c>LaneId</c> (the first lane when absent).</summary>
    [Parameter] public IReadOnlyList<KanbanLane>? Lanes { get; set; }

    /// <summary>Ids of collapsed swimlanes. Bindable: <c>@bind-CollapsedLanes</c>. A collapsed lane keeps its header row (and count) but renders no card rows.</summary>
    [Parameter] public IReadOnlyList<string> CollapsedLanes { get; set; } = Array.Empty<string>();
    [Parameter] public EventCallback<IReadOnlyList<string>> CollapsedLanesChanged { get; set; }

    /// <summary>Several cards can be selected and moved together: Ctrl/Cmd+click or the <c>x</c> key toggles the card under the cursor.</summary>
    [Parameter] public bool Selectable { get; set; }

    /// <summary>The selected card ids. Bindable: <c>@bind-Selected</c>.</summary>
    [Parameter] public IReadOnlyList<string> Selected { get; set; } = Array.Empty<string>();
    [Parameter] public EventCallback<IReadOnlyList<string>> SelectedChanged { get; set; }

    /// <summary>Text for the drag preview (one card, or the whole selection). Rendered as <c>data-kanban-drag-preview</c> on the card's title; a one-time document listener (installed through JS eval, as the focus calls are) hands it to <c>setDragImage</c> — Blazor's own drag event cannot.</summary>
    [Parameter] public Func<IReadOnlyList<KanbanCard>, string>? DragPreviewText { get; set; }

    /// <summary>Remember successful moves so Ctrl/Cmd+Z (and <c>Labels.Undo</c>'s button) can take them back. A selection move is one undo step.</summary>
    [Parameter] public bool Undoable { get; set; }

    /// <summary>Columns can be reordered: drag a header onto another, or Alt+Shift+ArrowLeft/Right on any cell of the column.</summary>
    [Parameter] public bool MovableColumns { get; set; }

    /// <summary>Column ids in display order. Bindable: <c>@bind-ColumnOrder</c>; columns it does not name follow in their own order.</summary>
    [Parameter] public IReadOnlyList<string> ColumnOrder { get; set; } = Array.Empty<string>();
    [Parameter] public EventCallback<IReadOnlyList<string>> ColumnOrderChanged { get; set; }

    /// <summary>Renders only the rows in view, in a scroll area of <c>Height</c> px; every row is assumed <c>RowHeight</c> px tall (lane headers count as a row).</summary>
    [Parameter] public KanbanVirtualize? Virtualize { get; set; }

    /// <summary>Board-level search: shows only cards whose text contains it (case-insensitive). Bindable: <c>@bind-Search</c>; combines with <c>Filter</c>.</summary>
    [Parameter] public string SearchValue { get; set; } = "";
    [Parameter] public EventCallback<string> SearchValueChanged { get; set; }

    /// <summary>The text <c>SearchValue</c> looks in. Defaults to the label, subtitle and badges.</summary>
    [Parameter] public Func<KanbanCard, string>? SearchText { get; set; }

    /// <summary>Replaces a card's title content (the subtitle and badges are then the template's own).</summary>
    [Parameter] public RenderFragment<KanbanCardContext>? CardTemplate { get; set; }

    /// <summary>Rendered in each column's header after its title and flag.</summary>
    [Parameter] public RenderFragment<KanbanColumnContext>? ColumnHeader { get; set; }

    /// <summary>Rendered in a <c>&lt;tfoot&gt;</c> cell per column: sums per stage.</summary>
    [Parameter] public RenderFragment<KanbanColumnContext>? ColumnFooter { get; set; }

    /// <summary>Called when Alt+ArrowUp/Down moves a card within its column; <c>ToIndex</c> is 0-based. The consumer reorders <c>Cards</c>.</summary>
    [Parameter] public EventCallback<(string CardId, int ToIndex)> OnReorder { get; set; }

    /// <summary>Veto a move (a hard WIP limit, a workflow rule). Refused columns show <c>aria-disabled</c> in the move menu.</summary>
    [Parameter] public Func<KanbanCard, KanbanColumn, bool>? CanMove { get; set; }

    /// <summary>Ids of collapsed columns. Bindable: <c>@bind-CollapsedColumns</c>. A collapsed column keeps its header and count but shows no cards.</summary>
    [Parameter] public IReadOnlyList<string> CollapsedColumns { get; set; } = Array.Empty<string>();
    [Parameter] public EventCallback<IReadOnlyList<string>> CollapsedColumnsChanged { get; set; }

    /// <summary>Raised with the column id when its add-card button is pressed. The consumer adds the card.</summary>
    [Parameter] public EventCallback<string> OnAddCard { get; set; }

    /// <summary>Disable every mutating interaction: move menu, drag and reorder. Navigation still works.</summary>
    [Parameter] public bool Readonly { get; set; }

    /// <summary>User-facing strings. See <see cref="KanbanLabels"/> — presence gates each control.</summary>
    [Parameter] public KanbanLabels Labels { get; set; } = new();

    /// <summary>Extra CSS class merged into the root &lt;div&gt;.</summary>
    [Parameter] public string CssClass { get; set; } = "";

    /// <summary>Captures all unmatched attributes; spread onto the root.</summary>
    [Parameter(CaptureUnmatchedValues = true)]
    public Dictionary<string, object>? AdditionalAttributes { get; set; }

    [Inject] private IJSRuntime JS { get; set; } = default!;

    // -------------------------------------------------------------------
    // Instance state — mirrors the Svelte $state fields one for one.
    // -------------------------------------------------------------------

    private readonly string _baseId = $"kanban-board-{Interlocked.Increment(ref _uid)}";

    private string _statusMessage = "";
    private int _focusedRow;
    private int _focusedCol;

    /// <summary>The card whose move menu is open, if any.</summary>
    private string? _openCardId;
    private int _moveActiveIndex = -1;

    /// <summary>
    /// Move-button component references, keyed by card id — mirrors
    /// DateTimePicker's own position-keyed <c>_dayElements</c> dictionary
    /// (see that file's doc comment): the same IconButton is reused across
    /// re-renders, so a stable key is required for FocusAsync to keep
    /// targeting the right element.
    /// </summary>
    private readonly Dictionary<string, IconButton> _moveButtonComponents = new();

    private Listbox? _listComponent;

    private bool _focusListPending;
    private string? _focusCardPendingId;
    private bool _focusCellPending;

    // -------------------------------------------------------------------
    // Test seams (InternalsVisibleTo). bUnit has no live focus model, so
    // the suite asserts which element a FocusAsync interop call targeted
    // by comparing ElementReference ids — the same technique the
    // ThemePicker/DateTimePicker suites use. This is the "invisible to
    // jsdom/bUnit" limitation for real DOM focus movement: these seams
    // verify the component's INTENT (which id it asked to focus), not
    // that the browser actually moved focus there.
    // -------------------------------------------------------------------

    internal string? ListReferenceId => _listComponent?.Element.Id;

    internal string? MoveButtonReferenceId(string cardId)
        => _moveButtonComponents.TryGetValue(cardId, out var button) ? button.Element.Id : null;

    /// <summary>The root id used to scope the JS-eval cell-focus query.</summary>
    internal string RootId => $"{_baseId}-root";

    // -------------------------------------------------------------------
    // Derived data.
    // -------------------------------------------------------------------

    /// <summary>Cards moved optimistically by an async <c>MoveHandler</c> that has not settled: id → destination column.</summary>
    private readonly Dictionary<string, string> _optimistic = new();

    private bool IsPending(string cardId) => _optimistic.ContainsKey(cardId);

    /// <summary>Columns in display order: those named in <c>ColumnOrder</c> first, the rest after in their own order.</summary>
    private IReadOnlyList<KanbanColumn> Cols
    {
        get
        {
            if (ColumnOrder.Count == 0) return Columns;
            var order = ColumnOrder.ToList();
            int Rank(string id) { var i = order.IndexOf(id); return i < 0 ? order.Count : i; }
            return Columns.Select((c, i) => (c, i)).OrderBy(x => Rank(x.c.Id)).ThenBy(x => x.i).Select(x => x.c).ToList();
        }
    }

    private string ColumnOf(KanbanCard card) => _optimistic.TryGetValue(card.Id, out var moved) ? moved : card.ColumnId;

    /// <summary>Every card per column, optimistic moves applied (counts and WIP limits use this).</summary>
    private IReadOnlyDictionary<string, List<KanbanCard>> AllByColumn
    {
        get
        {
            var map = new Dictionary<string, List<KanbanCard>>();
            foreach (var column in Cols) map[column.Id] = new List<KanbanCard>();
            foreach (var card in Cards)
            {
                var columnId = _optimistic.TryGetValue(card.Id, out var moved) ? moved : card.ColumnId;
                if (map.TryGetValue(columnId, out var list)) list.Add(card);
            }
            return map;
        }
    }

    /// <summary>What the grid shows: the filtered, searched, sorted view.</summary>
    private IReadOnlyDictionary<string, List<KanbanCard>> CardsByColumn
    {
        get
        {
            var needle = (SearchValue ?? "").Trim().ToLowerInvariant();
            var map = new Dictionary<string, List<KanbanCard>>();
            foreach (var (id, list) in AllByColumn)
            {
                IEnumerable<KanbanCard> shown = Filter is null ? list : list.Where(Filter);
                if (needle.Length > 0)
                {
                    shown = shown.Where(c => (SearchText?.Invoke(c)
                        ?? string.Join(" ", new[] { ResolveCardLabel(c), c.Subtitle ?? "" }.Concat(c.Badges ?? Array.Empty<string>())))
                        .ToLowerInvariant().Contains(needle));
                }
                var result = shown.ToList();
                if (Compare is not null) result = result.OrderBy(c => c, Comparer<KanbanCard>.Create(Compare)).ToList();
                map[id] = result;
            }
            return map;
        }
    }

    private bool IsEmptyColumn(KanbanColumn column, IReadOnlyDictionary<string, List<KanbanCard>> shown)
        => !IsCollapsed(column.Id) && (shown.TryGetValue(column.Id, out var list) ? list.Count : 0) == 0;

    /// <summary>One slot of the body: a lane header, or a row (its place across the board and within its lane).</summary>
    private sealed record Slot(KanbanLane? Lane, int RowIndex, string LaneId, int LaneRow, int SlotIndex);

    private sealed class Layout
    {
        public required IReadOnlyDictionary<string, List<KanbanCard>> ByColumn { get; init; }
        public required Dictionary<(string Column, string Lane), List<KanbanCard>> Cell { get; init; }
        public required List<Slot> Slots { get; init; }
        public required List<Slot> Rows { get; init; }
        public int MaxRows => Rows.Count;
    }

    private bool HasLanes => Lanes is { Count: > 0 };

    private string LaneOf(KanbanCard card) => HasLanes ? (card.LaneId ?? Lanes![0].Id) : "";

    /// <summary>Rows: one band per lane (a single anonymous band without <c>Lanes</c>).</summary>
    private Layout BuildLayout()
    {
        var byColumn = CardsByColumn;
        var cell = new Dictionary<(string, string), List<KanbanCard>>();
        foreach (var (colId, list) in byColumn)
        {
            foreach (var card in list)
            {
                var key = (colId, LaneOf(card));
                if (!cell.TryGetValue(key, out var group)) cell[key] = group = new List<KanbanCard>();
                group.Add(card);
            }
        }
        var slots = new List<Slot>();
        var rows = new List<Slot>();
        var bands = HasLanes ? Lanes! : new[] { new KanbanLane { Id = "", Title = "" } };
        var rowIndex = 0;
        foreach (var lane in bands)
        {
            if (HasLanes) slots.Add(new Slot(lane, -1, lane.Id, -1, slots.Count));
            // A collapsed lane keeps its header and shows no card rows.
            if (HasLanes && IsLaneCollapsed(lane.Id)) continue;
            var n = 0;
            foreach (var column in Cols)
            {
                if (IsCollapsed(column.Id)) continue;
                n = Math.Max(n, cell.TryGetValue((column.Id, lane.Id), out var list) ? list.Count : 0);
            }
            // A lane keeps at least one row so a card can be dropped into it; without lanes a row exists for an
            // empty column's message even when no column has a card to show.
            if (HasLanes) n = Math.Max(n, 1);
            else if (n == 0 && Labels.EmptyColumn is not null && Cols.Any(c => IsEmptyColumn(c, byColumn))) n = 1;
            for (var laneRow = 0; laneRow < n; laneRow++)
            {
                var slot = new Slot(null, rowIndex++, lane.Id, laneRow, slots.Count);
                slots.Add(slot);
                rows.Add(slot);
            }
        }
        return new Layout { ByColumn = byColumn, Cell = cell, Slots = slots, Rows = rows };
    }

    private KanbanCard? CardAt(Layout layout, int colIndex, int rowIndex)
    {
        var cols = Cols;
        if (colIndex < 0 || colIndex >= cols.Count) return null;
        if (rowIndex < 0 || rowIndex >= layout.Rows.Count) return null;
        var column = cols[colIndex];
        if (IsCollapsed(column.Id)) return null;
        var slot = layout.Rows[rowIndex];
        return layout.Cell.TryGetValue((column.Id, slot.LaneId), out var list) && slot.LaneRow < list.Count ? list[slot.LaneRow] : null;
    }

    // ---- Windowing (Virtualize) ----

    private double _scrollTop;
    private double? _scrollToPending;
    private string ScrollId => $"{_baseId}-scroll";

    /// <summary>The slots to render, with spacer heights for the rows left out (everything without <c>Virtualize</c>).</summary>
    private List<(Slot? Slot, int SpacerRows)> RenderItems(Layout layout)
    {
        var items = new List<(Slot?, int)>();
        if (Virtualize is not { } v)
        {
            foreach (var slot in layout.Slots) items.Add((slot, 0));
            return items;
        }
        var start = Math.Max(0, (int)Math.Floor(_scrollTop / v.RowHeight) - v.Overscan);
        var end = Math.Min(layout.Slots.Count, (int)Math.Ceiling((_scrollTop + v.Height) / v.RowHeight) + v.Overscan);
        var indices = new SortedSet<int>();
        for (var i = start; i < end; i++) indices.Add(i);
        // The roving tab stop's row always renders, so the grid never leaves the tab order.
        var active = layout.Slots.FindIndex(x => x.Lane is null && x.RowIndex == Math.Min(_focusedRow, layout.MaxRows - 1));
        if (active >= 0) indices.Add(active);
        var previous = -1;
        foreach (var index in indices)
        {
            if (index - previous > 1) items.Add((null, index - previous - 1));
            items.Add((layout.Slots[index], 0));
            previous = index;
        }
        if (layout.Slots.Count - 1 - previous > 0) items.Add((null, layout.Slots.Count - 1 - previous));
        return items;
    }

    /// <summary>Bring a row into the scroll area (a virtualized board renders only what is in view).</summary>
    private void RevealRow(int rowIndex, Layout layout)
    {
        if (Virtualize is not { } v) return;
        var slotIndex = layout.Slots.FindIndex(x => x.Lane is null && x.RowIndex == rowIndex);
        if (slotIndex < 0) return;
        double top = slotIndex * v.RowHeight;
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

    private bool IsCollapsed(string columnId) => CollapsedColumns.Contains(columnId);

    private bool IsLaneCollapsed(string laneId) => CollapsedLanes.Contains(laneId);

    private async Task ToggleLaneAsync(KanbanLane lane)
    {
        CollapsedLanes = IsLaneCollapsed(lane.Id)
            ? CollapsedLanes.Where(id => id != lane.Id).ToList()
            : CollapsedLanes.Append(lane.Id).ToList();
        await CollapsedLanesChanged.InvokeAsync(CollapsedLanes);
    }

    /// <summary>Every card in a lane (the search/filter view still applies).</summary>
    private int LaneCardCount(Layout layout, string laneId)
        => Cols.Sum(column => layout.Cell.TryGetValue((column.Id, laneId), out var list) ? list.Count : 0);

    private async Task ToggleCollapsedAsync(KanbanColumn column)
    {
        CollapsedColumns = IsCollapsed(column.Id)
            ? CollapsedColumns.Where(id => id != column.Id).ToList()
            : CollapsedColumns.Append(column.Id).ToList();
        await CollapsedColumnsChanged.InvokeAsync(CollapsedColumns);
    }

    private string ResolveCardLabel(KanbanCard card) => (CardLabel ?? (c => c.Title))(card);

    private string RootClass => $"kanban-board {CssClass}".Trim();

    private string MoveOptionId(int index) => $"{_baseId}-move-option-{index}";

    private string CellId(int row, int col) => $"{_baseId}-cell-{row}-{col}";

    private void Announce(string? message)
    {
        if (!string.IsNullOrEmpty(message)) _statusMessage = message;
    }

    // -------------------------------------------------------------------
    // Move menu (keyboard + pointer share this).
    // -------------------------------------------------------------------

    /// <summary>Choosing the card's own column is not a move: the menu just closes.</summary>
    private bool IsRefused(KanbanCard card, KanbanColumn toColumn, int extra = 0)
    {
        if (toColumn.Id == card.ColumnId) return false;
        if (AllowedColumns is not null && !AllowedColumns(card).Contains(toColumn.Id)) return true;
        if (CanMove is not null && !CanMove(card, toColumn)) return true;
        return toColumn.StrictLimit
            && toColumn.WipLimit is { } limit
            && (AllByColumn.TryGetValue(toColumn.Id, out var list) ? list.Count : 0) + extra >= limit;
    }

    /// <summary>The columns the move menu offers for <paramref name="card"/>: its own, and the ones it may move to.</summary>
    private IReadOnlyList<KanbanColumn> MoveTargets(KanbanCard card)
    {
        if (AllowedColumns is null) return Cols;
        var allowed = AllowedColumns(card);
        return Cols.Where(c => c.Id == card.ColumnId || allowed.Contains(c.Id)).ToList();
    }

    private sealed record UndoStep(string CardId, string FromColumnId, string ToColumnId);

    private readonly List<List<UndoStep>> _undoStack = new();

    private void RecordUndo(List<UndoStep> group)
    {
        if (!Undoable || group.Count == 0) return;
        _undoStack.Add(group);
        if (_undoStack.Count > 50) _undoStack.RemoveAt(0);
    }

    /// <summary>Returns true when the move went through (no handler, or a handler that did not throw).</summary>
    private async Task<bool> RunMoveAsync(KanbanCard card, KanbanColumn toColumn, int? toIndex, string? toLaneId = null, bool silent = false)
    {
        await OnMove.InvokeAsync((card.Id, toColumn.Id));
        if (toIndex is { } index) await OnMoveAt.InvokeAsync((card.Id, toColumn.Id, index));
        if (toLaneId is not null) await OnMoveToLane.InvokeAsync((card.Id, toColumn.Id, toLaneId));
        if (MoveHandler is null)
        {
            if (!silent) Announce(Labels.MoveAnnouncement?.Invoke(ResolveCardLabel(card), toColumn.Title));
            return true;
        }
        _optimistic[card.Id] = toColumn.Id;
        if (!silent) Announce(Labels.MovePending?.Invoke(ResolveCardLabel(card), toColumn.Title));
        StateHasChanged();
        var ok = true;
        try
        {
            await MoveHandler(card.Id, toColumn.Id, toIndex);
            if (!silent) Announce(Labels.MoveAnnouncement?.Invoke(ResolveCardLabel(card), toColumn.Title));
        }
        catch (Exception error)
        {
            ok = false;
            Announce(Labels.MoveFailed?.Invoke(ResolveCardLabel(card), toColumn.Title, error));
            await OnMoveError.InvokeAsync((card.Id, toColumn.Id, error));
        }
        finally
        {
            _optimistic.Remove(card.Id);
            StateHasChanged();
        }
        return ok;
    }

    // ---- Selection: several cards move together ----

    private bool IsSelected(string cardId) => Selected.Contains(cardId);

    private async Task SetSelectionAsync(IReadOnlyList<string> next)
    {
        Selected = next;
        await SelectedChanged.InvokeAsync(next);
    }

    private async Task ToggleSelectedAsync(string cardId)
    {
        await SetSelectionAsync(IsSelected(cardId) ? Selected.Where(id => id != cardId).ToList() : Selected.Append(cardId).ToList());
    }

    private async Task OnCellClickAsync(KanbanCard? card, MouseEventArgs e)
    {
        if (Selectable && (e.CtrlKey || e.MetaKey) && card is not null && !Readonly) await ToggleSelectedAsync(card.Id);
    }

    /// <summary>The cards that move when <paramref name="card"/> moves: the whole selection when it is in it, else just that card.</summary>
    private IReadOnlyList<KanbanCard> MovingGroup(KanbanCard card)
    {
        if (!Selectable || !IsSelected(card.Id) || Selected.Count < 2) return new[] { card };
        return Cards.Where(c => IsSelected(c.Id)).ToList();
    }

    private async Task MoveGroupAsync(IReadOnlyList<KanbanCard> group, KanbanColumn toColumn)
    {
        var moved = new List<UndoStep>();
        var admitted = 0;
        var runs = new List<Task<bool>>();
        foreach (var member in group)
        {
            if (member.Locked || IsPending(member.Id) || ColumnOf(member) == toColumn.Id) continue;
            if (IsRefused(member, toColumn, admitted))
            {
                Announce(Labels.MoveBlocked?.Invoke(ResolveCardLabel(member), toColumn.Title));
                continue;
            }
            admitted++;
            var from = member.ColumnId;
            runs.Add(RunGroupMemberAsync(member, toColumn, from, moved));
        }
        if (runs.Count == 0) return;
        Announce(Labels.MoveManyAnnouncement?.Invoke(runs.Count, toColumn.Title));
        await SetSelectionAsync(Array.Empty<string>());
        await Task.WhenAll(runs);
        RecordUndo(moved);
    }

    private async Task<bool> RunGroupMemberAsync(KanbanCard member, KanbanColumn toColumn, string from, List<UndoStep> moved)
    {
        var ok = await RunMoveAsync(member, toColumn, null, null, true);
        if (ok) moved.Add(new UndoStep(member.Id, from, toColumn.Id));
        return ok;
    }

    // ---- Undo ----

    private async Task UndoAsync()
    {
        if (!Undoable || Readonly) return;
        while (_undoStack.Count > 0)
        {
            var group = _undoStack[^1];
            _undoStack.RemoveAt(_undoStack.Count - 1);
            var live = group
                .Select(m => (Step: m, Card: Cards.FirstOrDefault(c => c.Id == m.CardId)))
                .Where(x => x.Card is not null && ColumnOf(x.Card) == x.Step.ToColumnId && !x.Card.Locked)
                .ToList();
            if (live.Count == 0) continue; // nothing of this step is where it was left: try the one before
            foreach (var (step, card) in live)
            {
                var back = Cols.FirstOrDefault(c => c.Id == step.FromColumnId);
                if (back is not null) await RunMoveAsync(card!, back, null, null, true);
            }
            if (live.Count == 1)
            {
                var back = Cols.FirstOrDefault(c => c.Id == live[0].Step.FromColumnId);
                Announce(Labels.UndoAnnouncement?.Invoke(ResolveCardLabel(live[0].Card!), back?.Title ?? ""));
            }
            else
            {
                Announce(Labels.UndoManyAnnouncement?.Invoke(live.Count));
            }
            return;
        }
    }

    private async Task MoveCardAsync(KanbanCard card, KanbanColumn toColumn, int? toIndex = null, string? toLaneId = null)
    {
        if (Readonly || card.Locked || IsPending(card.Id)) return;
        var group = MovingGroup(card);
        if (group.Count > 1)
        {
            await MoveGroupAsync(group, toColumn);
            await CloseMoveMenuAsync();
            return;
        }
        if (IsRefused(card, toColumn))
        {
            Announce(Labels.MoveBlocked?.Invoke(ResolveCardLabel(card), toColumn.Title));
            await CloseMoveMenuAsync();
            return;
        }
        if (toColumn.Id != card.ColumnId || (toLaneId is not null && toLaneId != LaneOf(card)))
        {
            var from = card.ColumnId;
            var ok = await RunMoveAsync(card, toColumn, toIndex, toLaneId);
            if (ok && toColumn.Id != from) RecordUndo(new List<UndoStep> { new(card.Id, from, toColumn.Id) });
        }
        await CloseMoveMenuAsync();
    }

    private void OpenMoveMenu(KanbanCard card)
    {
        if (Readonly || card.Locked) return;
        _openCardId = card.Id;
        var currentIndex = -1;
        var targets = MoveTargets(card);
        for (var i = 0; i < targets.Count; i++)
        {
            if (targets[i].Id == card.ColumnId) { currentIndex = i; break; }
        }
        _moveActiveIndex = currentIndex >= 0 ? currentIndex : 0;
        _focusListPending = true;
    }

    private Task CloseMoveMenuAsync(bool refocus = true)
    {
        if (_openCardId is null) return Task.CompletedTask;
        var cardId = _openCardId;
        _openCardId = null;
        _moveActiveIndex = -1;
        if (refocus) _focusCardPendingId = cardId;
        return Task.CompletedTask;
    }

    private async Task OnMoveButtonClickAsync(KanbanCard card)
    {
        if (_openCardId == card.Id) await CloseMoveMenuAsync();
        else OpenMoveMenu(card);
    }

    // -------------------------------------------------------------------
    // Pointer drag-and-drop (supplementary, never the only path).
    // -------------------------------------------------------------------

    private string? _draggingCardId;
    private string? _draggingColumnId;
    private IReadOnlyList<string> _draggingGroup = Array.Empty<string>();

    private void OnCardDragStart(KanbanCard card, DragEventArgs _)
    {
        if (card.Locked) return;
        _draggingCardId = card.Id;
        _draggingGroup = MovingGroup(card).Select(c => c.Id).ToList();
    }

    private void OnCardDragEnd()
    {
        _draggingCardId = null;
        _draggingColumnId = null;
        _draggingGroup = Array.Empty<string>();
        _dropTarget = null;
    }

    /// <summary>The preview text a card's drag shows: the whole selection when the card is in it.</summary>
    private string? DragPreviewFor(KanbanCard card)
        => DragPreviewText is null ? null : DragPreviewText(MovingGroup(card));

    // The Svelte reference only calls event.preventDefault() while a card
    // drag is actually in progress. Blazor cannot combine a plain
    // @ondragover handler with an @ondragover:preventDefault modifier on
    // the SAME component tag (RZ10010: both lower to a single "ondragover"
    // parameter on a component target, and collide) — so this port
    // prevents default unconditionally via the modifier alone, with no
    // handler method. Harmless: an unrelated foreign drag (e.g. a browser
    // file drop) would also be allowed to "hover" over a cell, but
    // OnColumnDropAsync below still only acts when it can resolve a real
    // dragged KanbanCard, so nothing unwanted happens on drop.

    private async Task OnColumnDropAsync(KanbanColumn column, int rowIndex, DragEventArgs _)
    {
        var cardId = _draggingCardId;
        _draggingCardId = null;
        _draggingGroup = Array.Empty<string>();
        _dropTarget = null;
        if (Readonly) return;
        var card = Cards.FirstOrDefault(c => c.Id == cardId);
        if (card is null) return;
        var layout = BuildLayout();
        var slot = rowIndex >= 0 && rowIndex < layout.Rows.Count ? layout.Rows[rowIndex] : null;
        var dropLane = HasLanes && slot is not null ? slot.LaneId : null;
        var shown = slot is not null && layout.Cell.TryGetValue((column.Id, slot.LaneId), out var cellList)
            ? cellList
            : new List<KanbanCard>();
        var dropIndex = slot?.LaneRow ?? rowIndex;
        var overCard = dropIndex < shown.Count ? shown[dropIndex] : null;
        if (card.ColumnId == column.Id && HasLanes && dropLane is not null && dropLane != LaneOf(card))
        {
            // Dropped into another lane of its own column: only the lane changes.
            await MoveCardAsync(card, column, null, dropLane);
            return;
        }
        if (card.ColumnId == column.Id)
        {
            // Dropped on another card of its own column: reorder to that position.
            var from = shown.FindIndex(c => c.Id == card.Id);
            if (overCard is not null && from >= 0 && from != dropIndex)
            {
                await OnReorder.InvokeAsync((card.Id, dropIndex));
                Announce(Labels.ReorderAnnouncement?.Invoke(ResolveCardLabel(card), dropIndex + 1, shown.Count));
            }
            return;
        }
        await MoveCardAsync(card, column, overCard is not null ? dropIndex : null, dropLane);
    }

    /// <summary>The cell a dragged card is over, for <c>data-drop-target</c> styling.</summary>
    private string? _dropTarget;

    private void OnColumnDragEnter(int rowIndex, int colIndex)
    {
        if (_draggingCardId is not null && !Readonly) _dropTarget = $"{rowIndex}-{colIndex}";
    }

    // ---- Column reordering ----

    private async Task<bool> MoveColumnToAsync(string columnId, int toIndex)
    {
        var ids = Cols.Select(c => c.Id).ToList();
        var from = ids.IndexOf(columnId);
        var to = Math.Min(Math.Max(toIndex, 0), ids.Count - 1);
        if (from == -1 || from == to) return false;
        ids.RemoveAt(from);
        ids.Insert(to, columnId);
        ColumnOrder = ids;
        await ColumnOrderChanged.InvokeAsync(ids);
        var column = Columns.FirstOrDefault(c => c.Id == columnId);
        if (column is not null) Announce(Labels.ColumnMoveAnnouncement?.Invoke(column.Title, to + 1, ids.Count));
        return true;
    }

    private void OnHeaderDragStart(KanbanColumn column)
    {
        if (MovableColumns) _draggingColumnId = column.Id;
    }

    private async Task OnHeaderDropAsync(KanbanColumn column)
    {
        var id = _draggingColumnId;
        _draggingColumnId = null;
        if (!MovableColumns || id is null || id == column.Id) return;
        var to = Cols.ToList().FindIndex(c => c.Id == column.Id);
        if (to >= 0) await MoveColumnToAsync(id, to);
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
            // ignore prerender / interop failure — see DateTimePicker's own
            // TryFocusAsync for the same pattern.
        }
    }

    private void MoveFocus(int row, int col, Layout layout)
    {
        _focusedCol = Math.Min(Math.Max(col, 0), Math.Max(Cols.Count - 1, 0));
        _focusedRow = Math.Min(Math.Max(row, 0), Math.Max(layout.MaxRows - 1, 0));
        RevealRow(_focusedRow, layout);
        // Deferred to OnAfterRenderAsync (mirrors DateTimePicker's
        // _focusCursorAfterRender): the JS-eval focus call must run AFTER
        // the render that flips tabindex to "0" on the new cell has been
        // flushed to the client, not inline during this synchronous
        // handler — otherwise a Blazor Server round trip could dispatch
        // the focus call before the client's DOM reflects the new cursor.
        _focusCellPending = true;
    }

    /// <summary>The cursor follows focus however it arrives — a click, or a consumer's own focus().</summary>
    private void OnCellFocusIn(int row, int col)
    {
        _focusedRow = row;
        _focusedCol = col;
    }

    /// <summary>
    /// Clamp the roving cursor to the cells that exist now: a move can shrink
    /// the board, and a cursor left on a vanished row would take the grid out
    /// of the tab order altogether.
    /// </summary>
    protected override void OnParametersSet()
    {
        var maxRows = BuildLayout().MaxRows;
        _focusedRow = Math.Min(Math.Max(_focusedRow, 0), Math.Max(maxRows - 1, 0));
        _focusedCol = Math.Min(Math.Max(_focusedCol, 0), Math.Max(Cols.Count - 1, 0));
    }

    /// <summary>A card's (row, column) in the grid as it renders now, or null.</summary>
    private (int Row, int Col)? PositionOf(string cardId)
    {
        var layout = BuildLayout();
        for (var row = 0; row < layout.Rows.Count; row++)
        {
            for (var col = 0; col < Cols.Count; col++)
            {
                if (CardAt(layout, col, row)?.Id == cardId) return (row, col);
            }
        }
        return null;
    }

    private async Task ReorderCardAsync(int delta, Layout layout)
    {
        if (Readonly) return;
        var card = CardAt(layout, _focusedCol, _focusedRow);
        if (card is null || card.Locked) return;
        var slot = _focusedRow < layout.Rows.Count ? layout.Rows[_focusedRow] : null;
        var total = slot is not null && layout.Cell.TryGetValue((card.ColumnId, slot.LaneId), out var list) ? list.Count : 0;
        var laneRow = slot?.LaneRow ?? _focusedRow;
        var toIndex = laneRow + delta;
        if (toIndex < 0 || toIndex >= total) return;
        await OnReorder.InvokeAsync((card.Id, toIndex));
        Announce(Labels.ReorderAnnouncement?.Invoke(ResolveCardLabel(card), toIndex + 1, total));
        _focusCardPendingId = card.Id;
    }

    private async Task OnGridKeyDown(KeyboardEventArgs args)
    {
        // Blazor's KeyboardEventArgs carries no event-target element info
        // (unlike the DOM event the Svelte reference inspects via
        // `event.target.closest('[data-row][data-col]')`), so this
        // handler cannot distinguish "key pressed on the grid cell itself"
        // from "key pressed on the move button/listbox nested inside it"
        // by target alone. While the move menu is open, keyboard
        // ownership belongs entirely to the composed IconButton/Listbox
        // (which stop at their own Escape/Tab/Enter handling) — bailing
        // out here avoids the grid's roving-tabindex logic double-handling
        // a keystroke that bubbled up from inside the open menu.
        if (_openCardId is not null) return;

        var layout = BuildLayout();
        var maxRows = layout.MaxRows;
        var columnCount = Cols.Count;
        var ctrlOrMeta = args.CtrlKey || args.MetaKey;

        if (Undoable && ctrlOrMeta && !args.AltKey && (args.Key == "z" || args.Key == "Z"))
        {
            await UndoAsync();
            return;
        }

        if (MovableColumns && args.AltKey && args.ShiftKey && (args.Key == "ArrowLeft" || args.Key == "ArrowRight"))
        {
            // Alt+Shift+ArrowLeft/Right: move this cell's column (the keyboard twin of dragging its header).
            var to = _focusedCol + (args.Key == "ArrowLeft" ? -1 : 1);
            if (_focusedCol >= 0 && _focusedCol < Cols.Count && await MoveColumnToAsync(Cols[_focusedCol].Id, to))
            {
                _focusedCol = to;
                _focusCellPending = true;
            }
            return;
        }

        if (Selectable && !ctrlOrMeta && !args.AltKey && (args.Key == "x" || args.Key == "X"))
        {
            var target = CardAt(layout, _focusedCol, _focusedRow);
            if (target is not null && !Readonly) await ToggleSelectedAsync(target.Id);
            return;
        }

        if (args.AltKey && (args.Key == "ArrowLeft" || args.Key == "ArrowRight"))
        {
            // Alt+ArrowLeft/Right: move the card to the neighbouring column (the keyboard twin of dragging it there).
            var movingCard = CardAt(layout, _focusedCol, _focusedRow);
            var neighbour = _focusedCol + (args.Key == "ArrowLeft" ? -1 : 1);
            if (movingCard is not null && neighbour >= 0 && neighbour < Cols.Count)
            {
                await MoveCardAsync(movingCard, Cols[neighbour]);
            }
            return;
        }

        if (args.AltKey && (args.Key == "ArrowUp" || args.Key == "ArrowDown"))
        {
            await ReorderCardAsync(args.Key == "ArrowUp" ? -1 : 1, layout);
            return;
        }

        switch (args.Key)
        {
            case "ArrowUp":
                MoveFocus(_focusedRow - 1, _focusedCol, layout);
                break;
            case "ArrowDown":
                MoveFocus(_focusedRow + 1, _focusedCol, layout);
                break;
            case "ArrowLeft":
                MoveFocus(_focusedRow, _focusedCol - 1, layout);
                break;
            case "ArrowRight":
                MoveFocus(_focusedRow, _focusedCol + 1, layout);
                break;
            case "Home":
                if (ctrlOrMeta) MoveFocus(0, 0, layout);
                else MoveFocus(0, _focusedCol, layout);
                break;
            case "End":
                if (ctrlOrMeta) MoveFocus(maxRows - 1, columnCount - 1, layout);
                else MoveFocus(maxRows - 1, _focusedCol, layout);
                break;
            case "Enter":
            case " ":
            {
                var card = CardAt(layout, _focusedCol, _focusedRow);
                if (card is not null) OpenMoveMenu(card);
                break;
            }
        }
    }

    // -------------------------------------------------------------------
    // Lifecycle — focus moves are deferred to after render, mirroring
    // ThemePicker: the listbox cannot take focus while `hidden`, and a
    // button/cell that was just re-rendered needs the DOM settled first.
    // -------------------------------------------------------------------

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (firstRender && DragPreviewText is not null) await InstallDragPreviewListenerAsync();
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
        if (_focusListPending)
        {
            _focusListPending = false;
            if (_listComponent is not null) await TryFocusAsync(_listComponent.Element);
        }
        // Focus a card wherever it is now — after a move the consumer's Cards
        // has put it in another column. The roving cursor follows it there
        // first (one more render, so the new cell carries tabindex="0"), then
        // focus lands on its move button, or on its cell when it has none.
        if (_focusCardPendingId is { } pendingCardId)
        {
            var position = PositionOf(pendingCardId);
            if (position is null)
            {
                _focusCardPendingId = null; // the card is gone; nothing to follow
            }
            else if (position.Value.Row != _focusedRow || position.Value.Col != _focusedCol)
            {
                _focusedRow = position.Value.Row;
                _focusedCol = position.Value.Col;
                StateHasChanged();
                return;
            }
            else
            {
                _focusCardPendingId = null;
                if (Labels.MoveButton is not null && _moveButtonComponents.TryGetValue(pendingCardId, out var button))
                    await TryFocusAsync(button.Element);
                else
                    await FocusActiveCellAsync();
            }
        }
        if (_focusCellPending)
        {
            _focusCellPending = false;
            await FocusActiveCellAsync();
        }
    }

    /// <summary>
    /// Blazor's drag event cannot call <c>setDragImage</c> (it is a serialized copy, and an interop call would land after
    /// the browser has already taken the drag image), so one document-level listener, installed once, reads the preview
    /// text off the card's <c>data-kanban-drag-preview</c> attribute synchronously.
    /// </summary>
    private async Task InstallDragPreviewListenerAsync()
    {
        const string script = "(function(){if(window.__lilyKanbanDragPreview)return;window.__lilyKanbanDragPreview=true;"
            + "document.addEventListener('dragstart',function(e){var t=e.target&&e.target.closest&&e.target.closest('[data-kanban-drag-preview]');"
            + "if(!t||!e.dataTransfer||!e.dataTransfer.setDragImage)return;var p=document.createElement('div');p.className='kanban-board-drag-preview';"
            + "p.textContent=t.getAttribute('data-kanban-drag-preview');p.style.position='absolute';p.style.top='-1000px';"
            + "(t.closest('.kanban-board')||document.body).appendChild(p);e.dataTransfer.setDragImage(p,0,0);setTimeout(function(){p.remove();},0);},true);})()";
        try
        {
            await JS.InvokeVoidAsync("eval", script);
        }
        catch
        {
            // ignore prerender / interop failure
        }
    }

    private static async Task TryFocusAsync(ElementReference element)
    {
        try
        {
            await element.FocusAsync(preventScroll: true);
        }
        catch
        {
            // ignore prerender / interop failure
        }
    }

    private static string JsonString(string s) => System.Text.Json.JsonSerializer.Serialize(s);
}
