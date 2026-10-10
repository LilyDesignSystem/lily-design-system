# `<lily-kanban-board>` (HTML helper)

A reusable, headless vanilla HTML/JS kanban board packaged as a
**web component (custom element)**. Cards move between columns by
pointer drag-and-drop or — always, independently — by a
keyboard-accessible per-card "Move to…" menu. WAI-ARIA APG Grid
roving-tabindex keyboard navigation.

The single source of truth is [spec/index.md](./spec/index.md). This
file is the user guide.

## Install

```ts
// One side-effect import registers <lily-kanban-board> (and its
// dependencies, <lily-kanban-table> and <lily-icon-button>) globally:
import "@lilydesignsystem/web-components-kanban-board";

// Or grab the class + types:
import { KanbanBoard } from "@lilydesignsystem/web-components-kanban-board";
import type {
  KanbanBoardProps,
  KanbanColumn,
  KanbanCard,
  KanbanLabels,
} from "@lilydesignsystem/web-components-kanban-board";
```

## Quick start

```html
<lily-kanban-board id="board" label="Sprint board"></lily-kanban-board>
<script type="module">
  import "@lilydesignsystem/web-components-kanban-board";

  const board = document.getElementById("board");
  board.columns = [
    { id: "todo", title: "To Do" },
    { id: "doing", title: "In Progress", wipLimit: 3 },
    { id: "done", title: "Done" },
  ];
  board.cards = [
    { id: "c1", columnId: "todo", title: "Write the RFC" },
    { id: "c2", columnId: "doing", title: "Review the RFC" },
  ];
  board.labels = {
    cardCount: (n) => `${n} card${n === 1 ? "" : "s"}`,
    overLimit: (n, limit) => `Over limit: ${n}/${limit}`,
    moveButton: (card) => `Move "${card.title}"`,
    moveMenuLabel: "Move to column",
    moveAnnouncement: (title, column) => `${title} moved to ${column}`,
  };
  board.onMove = (cardId, toColumnId) => {
    // Update your own data and re-set `board.cards` — this component
    // never mutates `cards` itself, matching every other Lily helper's
    // controlled-component contract.
    board.cards = board.cards.map((c) => (c.id === cardId ? { ...c, columnId: toColumnId } : c));
  };
</script>
```

`columns`, `cards`, `cardLabel`, `onMove`, and `labels` are
**property-only** — set them as JS properties (`board.columns = […]`),
never as HTML attributes. `label`, `caption`, and `class` are ordinary
attributes.

## Rendered markup

See [spec/index.md §4](./spec/index.md#4-html) for the full shape.
Class hooks: `.kanban-board`, `.kanban-board-th`, `.kanban-board-td`,
`.kanban-board-count`, `.kanban-board-wip-warning`,
`.kanban-board-card-title`, `.kanban-board-move-button`,
`.kanban-board-move-list`, `.kanban-board-move-option`,
`.kanban-board-status`. No CSS ships — position/style these yourself.

## Keyboard

| Key | Effect |
| --- | --- |
| Arrow keys | Move the grid cursor; clamp at the edges |
| Home / End | Jump to the first/last row of the current column |
| Ctrl+Home / Ctrl+End | Jump to the grid's first/last cell |
| Enter / Space (on a card) | Open that card's move menu |
| Arrow keys (menu open) | Move the active destination option |
| Home / End (menu open) | Jump to the first/last destination |
| Enter / Space (menu open) | Choose the active destination |
| Escape (menu open) | Close without moving |
| Tab (menu open) | Close and proceed to the next tab stop |

## WIP limits

Set `wipLimit` on a `KanbanColumn`. A column at or over its limit gets
`data-over-limit` on its header cell and, when `labels.overLimit` is
supplied, a warning message. This is a styling hook only — moves are
never blocked.

## Accessibility

See [spec/index.md §7](./spec/index.md#7-accessibility) and
[docs/accessibility.md](./docs/accessibility.md).

## Testing

`npm test` from the workspace root runs every helper's suite,
including this one's, under vitest + jsdom.
