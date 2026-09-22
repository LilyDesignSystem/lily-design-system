# Lily Design System™ — Blazor KanbanBoard

A headless, keyboard-accessible kanban board: cards move between
columns by pointer drag-and-drop or, independently, by a per-card
"Move to…" menu — never by arrow-key dragging alone. Composes this
catalog's own headless `KanbanTable` family plus `IconButton`/`Listbox`
(the same components every `*-picker` helper composes for its own
popup) for the move menu.

## Install

```sh
dotnet add package LilyDesignSystem.Blazor.KanbanBoard
```

`LilyBlazorHeadless` installs automatically as a regular NuGet
dependency — `KanbanBoard` composes its `KanbanTable` family and its
`IconButton`/`Listbox`, never vendoring their markup.

## Usage

```razor
@using LilyDesignSystem.Blazor.Helpers

<KanbanBoard
    Label="Sprint board"
    Columns="@Columns"
    Cards="@Cards"
    Labels="@(new KanbanLabels
    {
        CardCount = count => $"{count} cards",
        OverLimit = (count, limit) => $"Over limit: {count}/{limit}",
        MoveButton = card => $"Move {card.Title}",
        MoveMenuLabel = "Move to column",
        MoveAnnouncement = (title, column) => $"{title} moved to {column}",
    })"
    OnMove="@HandleMove" />

@code {
    private IReadOnlyList<KanbanColumn> Columns { get; } = new[]
    {
        new KanbanColumn { Id = "todo", Title = "To Do" },
        new KanbanColumn { Id = "doing", Title = "In Progress", WipLimit = 3 },
        new KanbanColumn { Id = "done", Title = "Done" },
    };

    private IReadOnlyList<KanbanCard> Cards { get; set; } = new[]
    {
        new KanbanCard { Id = "c1", ColumnId = "todo", Title = "Write the spec" },
    };

    private void HandleMove((string CardId, string ToColumnId) move)
    {
        Cards = Cards
            .Select(c => c.Id == move.CardId
                ? new KanbanCard { Id = c.Id, ColumnId = move.ToColumnId, Title = c.Title }
                : c)
            .ToList();
    }
}
```

## Keyboard

WAI-ARIA APG Grid roving-tabindex: exactly one card cell carries
`tabindex="0"`. Arrow keys move within/across columns and clamp at the
edges; `Home`/`End` move within the current column; `Ctrl+Home`/
`Ctrl+End` jump to the grid's first/last cell; `Enter`/`Space` opens
the focused card's move menu (a `Listbox` of destination columns);
`Escape` closes it without moving; choosing a destination calls
`OnMove` and returns focus to the move button.

Native HTML5 drag-and-drop is supplementary: dragging a card's title
onto another column's cell calls the same `OnMove` callback. It is
never the only way to move a card — per WCAG 2.5.7 and the Pragmatic
Drag and Drop accessibility research cited in `spec/index.md §6`.

## WIP limits

`KanbanColumn.WipLimit`, once a column's card count exceeds it, marks
that column's header `data-over-limit` and renders
`Labels.OverLimit`'s text. This is a **styling hook, not an enforced
block** — nothing stops a caller from moving a card into an
over-limit column; style `[data-over-limit]` however your design
system flags it.

## Styling

`KanbanBoard` renders no CSS of its own beyond kebab-case class hooks:
`kanban-board`, `kanban-board-count`, `kanban-board-wip-warning`,
`kanban-board-card-title`, `kanban-board-move-button`,
`kanban-board-move-list`, `kanban-board-move-option`,
`kanban-board-status` — plus the headless `KanbanTable` family's own
`kanban-table*` classes.

## Accessibility

- WAI-ARIA APG Grid pattern. Every user-facing string comes from
  `Labels` — a label's absence disables the control it names (no
  English fallback).
- One `aria-live="polite"` region announces every successful move.
- bUnit has no live browser focus model; this package's own test suite
  verifies focus *intent* (which `ElementReference`/element id the
  component asked to focus) rather than that the browser actually
  moved focus — see `AGENTS.md`.

## Full contract

See [`spec/index.md`](./spec/index.md).

---

Lily™ and Lily Design System™ are trademarks.
