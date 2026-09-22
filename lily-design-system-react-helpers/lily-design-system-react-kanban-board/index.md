# @lilydesignsystem/react-kanban-board

A headless, accessible kanban board for React 19. Composes
`@lilydesignsystem/react-headless`'s `KanbanTable` family plus its
`IconButton`/`Listbox` pair. Ships no CSS — every visual aspect is
driven by the class hooks below.

See [spec/index.md](./spec/index.md) for the canonical contract and
[AGENTS.md](./AGENTS.md) for a fast index aimed at AI coding agents.

## Install

```sh
npm install @lilydesignsystem/react-kanban-board @lilydesignsystem/react-headless
```

## Quick start

```tsx
import KanbanBoard from "@lilydesignsystem/react-kanban-board";
import type { KanbanColumn, KanbanCard } from "@lilydesignsystem/react-kanban-board";
import { useState } from "react";

const COLUMNS: KanbanColumn[] = [
  { id: "todo", title: "To Do" },
  { id: "doing", title: "In Progress", wipLimit: 3 },
  { id: "done", title: "Done" },
];

function Board() {
  const [cards, setCards] = useState<KanbanCard[]>([
    { id: "c1", columnId: "todo", title: "Write the spec" },
    { id: "c2", columnId: "doing", title: "Build the component" },
  ]);

  return (
    <KanbanBoard
      label="Sprint board"
      columns={COLUMNS}
      cards={cards}
      onMove={(cardId, toColumnId) =>
        setCards((prev) =>
          prev.map((c) => (c.id === cardId ? { ...c, columnId: toColumnId } : c)),
        )
      }
      labels={{
        cardCount: (n) => `${n} card${n === 1 ? "" : "s"}`,
        overLimit: (count, limit) => `Over limit: ${count}/${limit}`,
        moveButton: (card) => `Move ${card.title}`,
        moveMenuLabel: "Move to column",
        moveAnnouncement: (title, column) => `${title} moved to ${column}`,
      }}
    />
  );
}
```

## Keyboard

- Arrow keys move the roving-tabindex cursor between cards; they clamp
  at the grid's edges (they never wrap).
- `Home`/`End` jump to the first/last card in the current column;
  `Ctrl+Home`/`Ctrl+End` jump to the grid's first/last cell.
- `Enter`/`Space` on a focused card opens its "Move to…" menu; choose a
  destination with arrow keys + `Enter`/`Space`, or dismiss with
  `Escape`.

Card movement is never drag-only: the move menu is always available,
independent of pointer drag-and-drop. See spec/index.md §6 for the
accessibility research this design choice is based on.

## Styling hooks

`kanban-board`, `kanban-board-count`, `kanban-board-wip-warning`,
`kanban-board-card-title`, `kanban-board-move-button`,
`kanban-board-move-list`, `kanban-board-move-option`,
`kanban-board-status`, plus `[data-over-limit]` on a column header at
or over its `wipLimit`.

## Non-goals

Drag-preview/ghost-element rendering, virtualization, undo/redo,
column reordering, swimlanes, card selection/bulk-move, search/filter,
collapsible columns — see spec/index.md §9.
