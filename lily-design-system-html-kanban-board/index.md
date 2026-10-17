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
- **Typed fields and editing** (0.6.0): `fields` + `card.values` show typed values under the title; `onFieldEdit` makes editable types edit in place (click, or F2). See [spec §12](./spec/index.md#12-typed-fields-inline-editing-export-hot-path-caching-060-2026-10-16).
- **Export** (0.6.0): `labels.exportCsv` / `exportTsv` / `exportExcel` plus `labels.exportHeaders` add CSV, TSV and Excel buttons for the shown (or selected) cards.

## Export: copy to clipboard (0.7.0)

- **Copy to clipboard**: `labels.copy` names a button (`data-…-export-format="copy"`; for the kanban board, Gantt chart and calendar it also needs `labels.exportHeaders`, like the downloads) that puts exactly what a download would hold — the same cards, scope and order, header row first — on the clipboard as tab-separated text (`toClipboardText`: no byte-order mark, formula text defused), ready to paste into a spreadsheet. `copyToClipboard` uses the async Clipboard API and falls back to a hidden, selected `<textarea>` with `execCommand("copy")`; it never throws. `labels.copyAnnouncement(rowCount)` is announced, `labels.copyFailed` when neither path worked, and `onCopy({ text, rowCount })` may return `false` to take over (nothing is copied).

## Keyboard: page keys and type-ahead (0.7.0)

- **PageUp / PageDown** move the cursor ten rows (a `virtualize` page when virtualized), clamping at the ends.
- **Type-ahead**: letters typed in quick succession move to the next card in the focused column whose label starts with them. A lone `x` stays the select shortcut when `selectable`; it joins a prefix already in progress. A Ctrl, Alt or Meta key, and an unmatched prefix, do nothing.

## In-place edit: validation, undo and redo (0.7.0)

- **Field `validate(value, values)`** refuses a value of the right type that is not acceptable (a negative estimate): return the reason. The editor stays open with `aria-invalid="true"` (cleared as soon as the user types again) and `labels.editRefused(card, header, reason)` is announced, falling back to `labels.editInvalid`.
- With `undoable`, Ctrl/Cmd+Z takes back a **move** first while there is one, then field edits.
- **Undo and redo**: every accepted edit is remembered (the latest 100). Ctrl/Cmd+Z puts the earlier value back and Ctrl/Cmd+Shift+Z (or Ctrl+Y) re-applies one, both **through `onFieldEdit` and the `fieldedit` event** with the restored value and the one it replaced — the consumer owns the data, so an undo is reported like an edit, and an undo is not itself recorded. A new edit ends the redo chain. Inside a field editor the browser's own undo is left alone; nothing happens in a `readonly` component or without `onFieldEdit` and the `fieldedit` event. `labels.fieldUndoAnnouncement(card, header, text)` / `labels.fieldRedoAnnouncement(card, header, text)` are announced. The stacks are the pure `edit-history.ts` (`recordEdit`, `undoEdit`, `redoEdit`, `historyKey`).

## Drop cue, labels and direction (0.7.0)

- **A live "can't drop here" cue.** While a card is dragged, the cell under the pointer carries `data-drop-target` if it would accept the card, and `data-drop-blocked` (not `data-drop-target`) if `canMove`, `allowedColumns` or a full strict WIP limit would refuse it. A refused `dragover` is not cancelled and sets `dropEffect` to `none`, so the browser shows its own not-allowed cursor; an accepted one is cancelled and sets `move`. The cues clear on leave, drop and drag end. The reference themes outline an accepted cell with a dashed ring and stripe a refused one. This is the live twin of the announcement `labels.moveBlocked` makes after a refused keyboard move; a server-side refusal (a 422) still snaps the card back through `onMove` rejecting.
- **Every label is overridable.** All visible and spoken text is in `labels` (`emptyColumn`, `addCard`, `collapseColumn`, `laneCount`, the announcements and the rest); the only literal in the markup is the decorative `+` glyph of the add-card button, which has its accessible name from `labels.addCard`. A complete Chinese bundle is tested to leave no English in the DOM.
- **Right-to-left.** The horizontal arrows are visual: in a right-to-left layout ArrowLeft goes to the next column, and Alt+ArrowLeft/Right (move the card) and Alt+Shift+ArrowLeft/Right (move the column) follow the arrow. Vertical keys, Home, End and the page keys are unchanged. `isRtl` / `logicalKey` are exported.
- Tests §8.137–§8.148.

## Search (0.7.0)

`search` (a property; the field renders when `labels.search` names it) narrows the cards: every word must appear, in any order, ignoring case and diacritics. The default text is the card's label, subtitle, badges and every typed field's text. Matches in the title are wrapped in `<mark class="kanban-board-match">` (link titles too); `labels.searchAnnouncement(matches, total)` is announced; Escape in the field clears it. See spec §18.
