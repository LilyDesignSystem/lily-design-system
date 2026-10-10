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
    private string? _focusButtonPendingForCardId;
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

    private IReadOnlyDictionary<string, List<KanbanCard>> CardsByColumn
    {
        get
        {
            var map = new Dictionary<string, List<KanbanCard>>();
            foreach (var column in Columns) map[column.Id] = new List<KanbanCard>();
            foreach (var card in Cards)
            {
                if (map.TryGetValue(card.ColumnId, out var list)) list.Add(card);
            }
            return map;
        }
    }

    private int MaxRows(IReadOnlyDictionary<string, List<KanbanCard>> byColumn)
    {
        var max = 0;
        foreach (var column in Columns)
        {
            var count = byColumn.TryGetValue(column.Id, out var list) ? list.Count : 0;
            if (count > max) max = count;
        }
        return max;
    }

    private static KanbanCard? CardAt(
        IReadOnlyList<KanbanColumn> columns,
        IReadOnlyDictionary<string, List<KanbanCard>> byColumn,
        int colIndex,
        int rowIndex)
    {
        if (colIndex < 0 || colIndex >= columns.Count) return null;
        var column = columns[colIndex];
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

    private async Task MoveCardAsync(KanbanCard card, KanbanColumn toColumn)
    {
        await OnMove.InvokeAsync((card.Id, toColumn.Id));
        Announce(Labels.MoveAnnouncement?.Invoke(ResolveCardLabel(card), toColumn.Title));
        await CloseMoveMenuAsync();
    }

    private void OpenMoveMenu(KanbanCard card)
    {
        _openCardId = card.Id;
        var currentIndex = -1;
        for (var i = 0; i < Columns.Count; i++)
        {
            if (Columns[i].Id == card.ColumnId) { currentIndex = i; break; }
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
        if (refocus) _focusButtonPendingForCardId = cardId;
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

    private async Task OnColumnDropAsync(KanbanColumn column, DragEventArgs _)
    {
        var cardId = _draggingCardId;
        _draggingCardId = null;
        var card = Cards.FirstOrDefault(c => c.Id == cardId);
        if (card is not null) await MoveCardAsync(card, column);
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

    private void OnGridKeyDown(KeyboardEventArgs args)
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
        if (_focusButtonPendingForCardId is { } cardId)
        {
            _focusButtonPendingForCardId = null;
            if (_moveButtonComponents.TryGetValue(cardId, out var button)) await TryFocusAsync(button.Element);
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
