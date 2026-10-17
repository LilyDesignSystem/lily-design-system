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
- **Typed fields and editing** (0.6.0): `fields` + `card.values` show typed values under the title; `onFieldEdit` makes editable types edit in place (click, or F2). See [spec §13](./spec/index.md#13-typed-fields-inline-editing-export-hot-path-caching-060-2026-10-16).
- **Export** (0.6.0): `labels.exportCsv` / `exportTsv` / `exportExcel` plus `labels.exportHeaders` add CSV, TSV and Excel buttons for the shown (or selected) cards.

## Export: copy to clipboard (0.7.0)

- **Copy to clipboard**: `labels.copy` names a button (`data-…-export-format="copy"`; for the kanban board, Gantt chart and calendar it also needs `labels.exportHeaders`, like the downloads) that puts exactly what a download would hold — the same cards, scope and order, header row first — on the clipboard as tab-separated text (`toClipboardText`: no byte-order mark, formula text defused), ready to paste into a spreadsheet. `copyToClipboard` uses the async Clipboard API and falls back to a hidden, selected `<textarea>` with `execCommand("copy")`; it never throws. `labels.copyAnnouncement(rowCount)` is announced, `labels.copyFailed` when neither path worked, and `onCopy({ text, rowCount })` may return `false` to take over (nothing is copied).

## Keyboard: page keys and type-ahead (0.7.0)

- **PageUp / PageDown** move the cursor ten rows (a `virtualize` page when virtualized), clamping at the ends.
- **Type-ahead**: letters typed in quick succession move to the next card in the focused column whose label starts with them. A lone `x` stays the select shortcut when `selectable`; it joins a prefix already in progress. A Ctrl, Alt or Meta key, and an unmatched prefix, do nothing.

## In-place edit: validation, undo and redo (0.7.0)

- **Field `validate(value, values)`** refuses a value of the right type that is not acceptable (a negative estimate): return the reason. The editor stays open with `aria-invalid="true"` (cleared as soon as the user types again) and `labels.editRefused(card, header, reason)` is announced, falling back to `labels.editInvalid`.
- With `undoable`, Ctrl/Cmd+Z takes back a **move** first while there is one, then field edits.
- **Undo and redo**: every accepted edit is remembered (the latest 100). Ctrl/Cmd+Z puts the earlier value back and Ctrl/Cmd+Shift+Z (or Ctrl+Y) re-applies one, both **through `onFieldEdit`** with the restored value and the one it replaced — the consumer owns the data, so an undo is reported like an edit, and an undo is not itself recorded. A new edit ends the redo chain. Inside a field editor the browser's own undo is left alone; nothing happens in a `readonly` component or without `onFieldEdit`. `labels.fieldUndoAnnouncement(card, header, text)` / `labels.fieldRedoAnnouncement(card, header, text)` are announced. The stacks are the pure `edit-history.ts` (`recordEdit`, `undoEdit`, `redoEdit`, `historyKey`).

## Drop cue, labels and direction (0.7.0)

- **A live "can't drop here" cue.** While a card is dragged, the cell under the pointer carries `data-drop-target` if it would accept the card, and `data-drop-blocked` (not `data-drop-target`) if `canMove`, `allowedColumns` or a full strict WIP limit would refuse it. A refused `dragover` is not cancelled and sets `dropEffect` to `none`, so the browser shows its own not-allowed cursor; an accepted one is cancelled and sets `move`. The cues clear on leave, drop and drag end. The reference themes outline an accepted cell with a dashed ring and stripe a refused one. This is the live twin of the announcement `labels.moveBlocked` makes after a refused keyboard move; a server-side refusal (a 422) still snaps the card back through `onMove` rejecting.
- **Every label is overridable.** All visible and spoken text is in `labels` (`emptyColumn`, `addCard`, `collapseColumn`, `laneCount`, the announcements and the rest); the only literal in the markup is the decorative `+` glyph of the add-card button, which has its accessible name from `labels.addCard`. A complete Chinese bundle is tested to leave no English in the DOM.
- **Right-to-left.** The horizontal arrows are visual: in a right-to-left layout ArrowLeft goes to the next column, and Alt+ArrowLeft/Right (move the card) and Alt+Shift+ArrowLeft/Right (move the column) follow the arrow. Vertical keys, Home, End and the page keys are unchanged. `isRtl` / `logicalKey` are exported.
- Tests §8.137–§8.148.

## Search (0.7.0)

`search` (controlled when given; the field renders when `labels.search` names it) narrows the cards: every word must appear, in any order, ignoring case and diacritics. The default text is the card's label, subtitle, badges and every typed field's text. Matches in the title are wrapped in `<mark class="kanban-board-match">` (link titles too); `labels.searchAnnouncement(matches, total)` is announced; Escape in the field clears it. See spec §18.

## Non-goals

Drag-preview/ghost-element rendering, virtualization, undo/redo,
column reordering, swimlanes, card selection/bulk-move, search/filter,
collapsible columns — see spec/index.md §9.
