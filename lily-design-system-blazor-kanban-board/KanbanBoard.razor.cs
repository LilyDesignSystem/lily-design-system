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

    /// <summary>Accessible name of the board's search field. Gates the field.</summary>
    public string? Search { get; init; }
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

    /// <summary>Every card per column, optimistic moves applied (counts and WIP limits use this).</summary>
    private IReadOnlyDictionary<string, List<KanbanCard>> AllByColumn
    {
        get
        {
            var map = new Dictionary<string, List<KanbanCard>>();
            foreach (var column in Columns) map[column.Id] = new List<KanbanCard>();
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

    private int MaxRows(IReadOnlyDictionary<string, List<KanbanCard>> byColumn)
    {
        var max = 0;
        foreach (var column in Columns)
        {
            if (IsCollapsed(column.Id)) continue;
            var count = byColumn.TryGetValue(column.Id, out var list) ? list.Count : 0;
            if (count > max) max = count;
        }
        // A row exists for an empty column's message even when no column has a card to show.
        if (max == 0 && Labels.EmptyColumn is not null && Columns.Any(c => IsEmptyColumn(c, byColumn))) max = 1;
        return max;
    }

    private bool IsCollapsed(string columnId) => CollapsedColumns.Contains(columnId);

    private async Task ToggleCollapsedAsync(KanbanColumn column)
    {
        CollapsedColumns = IsCollapsed(column.Id)
            ? CollapsedColumns.Where(id => id != column.Id).ToList()
            : CollapsedColumns.Append(column.Id).ToList();
        await CollapsedColumnsChanged.InvokeAsync(CollapsedColumns);
    }

    private KanbanCard? CardAt(
        IReadOnlyList<KanbanColumn> columns,
        IReadOnlyDictionary<string, List<KanbanCard>> byColumn,
        int colIndex,
        int rowIndex)
    {
        if (colIndex < 0 || colIndex >= columns.Count) return null;
        var column = columns[colIndex];
        if (IsCollapsed(column.Id)) return null;
        if (!byColumn.TryGetValue(column.Id, out var list)) return null;
        return rowIndex >= 0 && rowIndex < list.Count ? list[rowIndex] : null;
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
    private bool IsRefused(KanbanCard card, KanbanColumn toColumn)
    {
        if (toColumn.Id == card.ColumnId) return false;
        if (AllowedColumns is not null && !AllowedColumns(card).Contains(toColumn.Id)) return true;
        if (CanMove is not null && !CanMove(card, toColumn)) return true;
        return toColumn.StrictLimit
            && toColumn.WipLimit is { } limit
            && (AllByColumn.TryGetValue(toColumn.Id, out var list) ? list.Count : 0) >= limit;
    }

    /// <summary>The columns the move menu offers for <paramref name="card"/>: its own, and the ones it may move to.</summary>
    private IReadOnlyList<KanbanColumn> MoveTargets(KanbanCard card)
    {
        if (AllowedColumns is null) return Columns;
        var allowed = AllowedColumns(card);
        return Columns.Where(c => c.Id == card.ColumnId || allowed.Contains(c.Id)).ToList();
    }

    private async Task RunMoveAsync(KanbanCard card, KanbanColumn toColumn, int? toIndex)
    {
        await OnMove.InvokeAsync((card.Id, toColumn.Id));
        if (toIndex is { } index) await OnMoveAt.InvokeAsync((card.Id, toColumn.Id, index));
        if (MoveHandler is null)
        {
            Announce(Labels.MoveAnnouncement?.Invoke(ResolveCardLabel(card), toColumn.Title));
            return;
        }
        _optimistic[card.Id] = toColumn.Id;
        Announce(Labels.MovePending?.Invoke(ResolveCardLabel(card), toColumn.Title));
        StateHasChanged();
        try
        {
            await MoveHandler(card.Id, toColumn.Id, toIndex);
            Announce(Labels.MoveAnnouncement?.Invoke(ResolveCardLabel(card), toColumn.Title));
        }
        catch (Exception error)
        {
            Announce(Labels.MoveFailed?.Invoke(ResolveCardLabel(card), toColumn.Title, error));
            await OnMoveError.InvokeAsync((card.Id, toColumn.Id, error));
        }
        finally
        {
            _optimistic.Remove(card.Id);
            StateHasChanged();
        }
    }

    private async Task MoveCardAsync(KanbanCard card, KanbanColumn toColumn, int? toIndex = null)
    {
        if (Readonly || card.Locked || IsPending(card.Id)) return;
        if (IsRefused(card, toColumn))
        {
            Announce(Labels.MoveBlocked?.Invoke(ResolveCardLabel(card), toColumn.Title));
            await CloseMoveMenuAsync();
            return;
        }
        if (toColumn.Id != card.ColumnId)
        {
            await RunMoveAsync(card, toColumn, toIndex);
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

    private void OnCardDragStart(KanbanCard card, DragEventArgs _)
    {
        if (card.Locked) return;
        _draggingCardId = card.Id;
    }

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
        _dropTarget = null;
        if (Readonly) return;
        var card = Cards.FirstOrDefault(c => c.Id == cardId);
        if (card is null) return;
        var shown = CardsByColumn.TryGetValue(column.Id, out var list) ? list : new List<KanbanCard>();
        var overCard = rowIndex < shown.Count ? shown[rowIndex] : null;
        if (card.ColumnId == column.Id)
        {
            // Dropped on another card of its own column: reorder to that position.
            var from = shown.FindIndex(c => c.Id == card.Id);
            if (overCard is not null && from >= 0 && from != rowIndex)
            {
                await OnReorder.InvokeAsync((card.Id, rowIndex));
                Announce(Labels.ReorderAnnouncement?.Invoke(ResolveCardLabel(card), rowIndex + 1, shown.Count));
            }
            return;
        }
        await MoveCardAsync(card, column, overCard is not null ? rowIndex : null);
    }

    /// <summary>The cell a dragged card is over, for <c>data-drop-target</c> styling.</summary>
    private string? _dropTarget;

    private void OnColumnDragEnter(int rowIndex, int colIndex)
    {
        if (_draggingCardId is not null && !Readonly) _dropTarget = $"{rowIndex}-{colIndex}";
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

    private void MoveFocus(int row, int col, int columnCount, int maxRows)
    {
        _focusedCol = Math.Min(Math.Max(col, 0), Math.Max(columnCount - 1, 0));
        _focusedRow = Math.Min(Math.Max(row, 0), Math.Max(maxRows - 1, 0));
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
        var maxRows = MaxRows(CardsByColumn);
        _focusedRow = Math.Min(Math.Max(_focusedRow, 0), Math.Max(maxRows - 1, 0));
        _focusedCol = Math.Min(Math.Max(_focusedCol, 0), Math.Max(Columns.Count - 1, 0));
    }

    /// <summary>A card's (row, column) in the grid as it renders now, or null.</summary>
    private (int Row, int Col)? PositionOf(string cardId)
    {
        var byColumn = CardsByColumn;
        for (var col = 0; col < Columns.Count; col++)
        {
            if (!byColumn.TryGetValue(Columns[col].Id, out var list)) continue;
            var row = list.FindIndex(c => c.Id == cardId);
            if (row >= 0) return (row, col);
        }
        return null;
    }

    private async Task ReorderCardAsync(int delta)
    {
        if (Readonly) return;
        var byColumn = CardsByColumn;
        var card = CardAt(Columns, byColumn, _focusedCol, _focusedRow);
        if (card is null || card.Locked) return;
        var total = byColumn.TryGetValue(card.ColumnId, out var list) ? list.Count : 0;
        var toIndex = _focusedRow + delta;
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

        var byColumn = CardsByColumn;
        var maxRows = MaxRows(byColumn);
        var columnCount = Columns.Count;
        var ctrlOrMeta = args.CtrlKey || args.MetaKey;

        if (args.AltKey && (args.Key == "ArrowLeft" || args.Key == "ArrowRight"))
        {
            // Alt+ArrowLeft/Right: move the card to the neighbouring column (the keyboard twin of dragging it there).
            var movingCard = CardAt(Columns, byColumn, _focusedCol, _focusedRow);
            var neighbour = _focusedCol + (args.Key == "ArrowLeft" ? -1 : 1);
            if (movingCard is not null && neighbour >= 0 && neighbour < Columns.Count)
            {
                await MoveCardAsync(movingCard, Columns[neighbour]);
            }
            return;
        }

        if (args.AltKey && (args.Key == "ArrowUp" || args.Key == "ArrowDown"))
        {
            await ReorderCardAsync(args.Key == "ArrowUp" ? -1 : 1);
            return;
        }

        switch (args.Key)
        {
            case "ArrowUp":
                MoveFocus(_focusedRow - 1, _focusedCol, columnCount, maxRows);
                break;
            case "ArrowDown":
                MoveFocus(_focusedRow + 1, _focusedCol, columnCount, maxRows);
                break;
            case "ArrowLeft":
                MoveFocus(_focusedRow, _focusedCol - 1, columnCount, maxRows);
                break;
            case "ArrowRight":
                MoveFocus(_focusedRow, _focusedCol + 1, columnCount, maxRows);
                break;
            case "Home":
                if (ctrlOrMeta) MoveFocus(0, 0, columnCount, maxRows);
                else MoveFocus(0, _focusedCol, columnCount, maxRows);
                break;
            case "End":
                if (ctrlOrMeta) MoveFocus(maxRows - 1, columnCount - 1, columnCount, maxRows);
                else MoveFocus(maxRows - 1, _focusedCol, columnCount, maxRows);
                break;
            case "Enter":
            case " ":
            {
                var card = CardAt(Columns, byColumn, _focusedCol, _focusedRow);
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
