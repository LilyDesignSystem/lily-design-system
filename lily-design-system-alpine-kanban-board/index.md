# KanbanBoard (Alpine.js helper)

A headless **kanban board** for [Alpine.js](https://alpinejs.dev/): a plugin (`Alpine.data("lilyKanbanBoard", …)`) plus
`snippet.html`, the `role="grid"` table markup that uses it. Cards move between columns by pointer drag-and-drop **or**,
independently, by a keyboard "Move to…" menu and Alt+Arrow — never drag-only (WCAG 2.5.7). WIP limits warn (`data-over-limit`)
or, with `strictWip`, refuse. Ships no CSS and no text: every string is a `labels.*` value, and a label's absence removes the
control it names.

It is a subset of the canonical [`@lilydesignsystem/svelte-kanban-board`](../lily-design-system-svelte-kanban-board/), whose
[spec](../lily-design-system-svelte-kanban-board/spec/index.md) is the contract. The subset and the gaps are in
[spec/index.md](spec/index.md).

## Usage

```html
<script type="module">
  import Alpine from "alpinejs";
  import lilyKanbanBoard from "@lilydesignsystem/alpine-kanban-board";
  Alpine.plugin(lilyKanbanBoard);
  window.boardOptions = {
    columns: [{ id: "todo", title: "To do" }, { id: "doing", title: "Doing", wipLimit: 2 }, { id: "done", title: "Done" }],
    cards: [{ id: "c1", columnId: "todo", title: "Write the spec" }],
    labels: {
      grid: "Work board",
      moveButton: (title) => `Move ${title}`,
      moveMenu: "Move to",
      moveAnnouncement: (card, column) => `${card} moved to ${column}`,
    },
  };
  Alpine.start();
</script>
<!-- then paste snippet.html (importable as @lilydesignsystem/alpine-kanban-board/snippet.html) -->
```

Options: `columns`, `cards`, `labels`, `canMove(card, toColumn)`, `strictWip`, `cardLabel(card)`. `createKanbanBoard(options)` returns the
same state without Alpine.

## Events

`lily:move` (`{ cardId, toColumnId }`), bubbling from the board, after every accepted move.

## Keyboard

APG grid: arrows move (clamped), Home / End go to the first / last row of the column, Ctrl+Home / Ctrl+End to the corners,
PageUp / PageDown ten rows, letters type-ahead within the column. Enter or Space on a card opens its move menu (a listbox:
arrows, Home, End, Enter or Space to choose, Escape to close, Tab to close and move on). Alt+ArrowLeft / Alt+ArrowRight move the
card to the neighbouring column; in a right-to-left layout the arrows are visual.

## Install

```sh
npm install @lilydesignsystem/alpine-kanban-board alpinejs
```

Lily™ and Lily Design System™ are trademarks.
