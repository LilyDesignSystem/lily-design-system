# `<kanban-board>` (HTML helper)

A reusable, headless vanilla HTML/JS interactive kanban board, packaged
as a **web component (custom element)**. Cards move between columns by
pointer drag-and-drop or, independently, by a keyboard-accessible
per-card "Move to…" menu — never drag-only.

The single source of truth is [spec/index.md](./spec/index.md). This
file is the user guide.

## Table of contents

- [Install](#install)
- [Quick start](#quick-start)
- [Rendered markup](#rendered-markup)
- [Styling is required](#styling-is-required)
- [Attributes](#attributes)
- [JS properties](#js-properties)
- [Events](#events)
- [Keyboard](#keyboard)
- [Accessibility](#accessibility)
- [Testing](#testing)

## Install

```sh
npm install @lilydesignsystem/html-kanban-board
```

## Quick start

```html
<script type="module">
  import "@lilydesignsystem/html-kanban-board";

  const board = document.querySelector("kanban-board");
  board.columns = [
    { id: "todo", title: "To Do" },
    { id: "doing", title: "In Progress", wipLimit: 2 },
    { id: "done", title: "Done" },
  ];
  board.cards = [
    { id: "c1", columnId: "todo", title: "Write the spec" },
    { id: "c2", columnId: "doing", title: "Build the component" },
  ];
  board.labels = {
    cardCount: (n) => `${n} cards`,
    overLimit: (n, limit) => `Over limit: ${n}/${limit}`,
    moveButton: (card) => `Move ${card.title}`,
    moveMenuLabel: "Move to column",
    moveAnnouncement: (title, column) => `${title} moved to ${column}`,
  };
  board.addEventListener("movecard", (event) => {
    const { cardId, toColumnId } = event.detail;
    // Persist the move…
  });
</script>

<kanban-board label="Sprint board"></kanban-board>
```

`columns`, `cards`, `cardLabel`, `onMove`, and `labels` are **property-
only** — they cannot be set as HTML attributes (arrays of objects and
functions don't round-trip through a string attribute). Set them from
JavaScript, as above, or listen for the `movecard` event instead of
setting `onMove`.

## Rendered markup

See [spec/index.md §5](./spec/index.md#5-html) for the full shape. In
short: a `<table class="kanban-table" role="grid">` with one
`.kanban-table-th` per column and a rectangular grid of
`.kanban-table-td` cells, each card's move menu rendered inline inside
its own cell while open.

## Styling is required

This package ships **zero CSS**. Every visual aspect — column widths,
card appearance, the move menu's popup positioning, the WIP-limit
warning's colour — is yours via the `kanban-board`/`kanban-table-*`/
`kanban-board-*` class hooks and `data-over-limit`/`data-in-range`-style
data attributes.

## Attributes

| Attribute | Type   | Required | Purpose |
| --------- | ------ | -------- | ------- |
| `label`   | string | yes      | Accessible name for the grid. |
| `caption` | string | no       | Visible `<caption>` for the table. |
| `class`   | string | no       | Extra class on the rendered root `<div>`. |

## JS properties

| Property    | Type                                            | Required | Default |
| ----------- | ------------------------------------------------ | -------- | ------- |
| `columns`   | `KanbanColumn[]`                                  | yes      | `[]`    |
| `cards`     | `KanbanCard[]`                                    | yes      | `[]`    |
| `cardLabel` | `(card: KanbanCard) => string`                     | no       | `card.title` |
| `onMove`    | `(cardId: string, toColumnId: string) => void`     | no       | —       |
| `labels`    | `KanbanLabels`                                     | no       | `{}`    |

`KanbanColumn`: `{ id, title, wipLimit? }`. `KanbanCard`: `{ id,
columnId, title }`.

`KanbanLabels` — every field optional; a label's absence disables the
control it names: `cardCount(count)`, `overLimit(count, limit)`,
`moveButton(card)`, `moveMenuLabel`, `moveAnnouncement(cardTitle,
columnTitle)`.

## Events

| Event      | Detail                                    | Fires when |
| ---------- | ------------------------------------------ | ---------- |
| `movecard` | `{ cardId: string; toColumnId: string }`   | A card moves, by pointer drag or the move menu. |

## Keyboard

WAI-ARIA APG Grid pattern. `ArrowUp`/`ArrowDown` move within a column;
`ArrowLeft`/`ArrowRight` move across columns; both clamp at the grid's
edges. `Home`/`End` jump to the first/last row of the current column;
`Ctrl+Home`/`Ctrl+End` jump to the grid's first/last cell. `Enter`/
`Space` on a focused card opens its move menu; inside the open menu,
arrow keys/`Home`/`End`/typeahead move the cursor, `Enter`/`Space`
chooses a destination, `Escape` closes without moving, `Tab` closes and
moves on.

## Accessibility

`role="grid"` on the table; roving `tabindex` for body cells (exactly
one `tabindex="0"` at a time). The move menu is
`aria-haspopup="listbox"`/`aria-expanded`/`aria-activedescendant`, the
same contract every picker in this catalog uses for its own dropdown.
All move announcements go through one `aria-live="polite"` region. Card
movement is never keyboard-drag-only, per WCAG 2.5.7.

## Testing

```sh
npx vitest run lily-design-system-html-kanban-board/kanban-board.test.ts
```
