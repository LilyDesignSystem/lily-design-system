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

Set `wipLimit` on a `KanbanColumn`. A column over its limit (more cards than the limit) gets
`data-over-limit` on its header cell and, when `labels.overLimit` is
supplied, a warning message. This is a styling hook only — moves are
never blocked.

## Accessibility

See [spec/index.md §7](./spec/index.md#7-accessibility) and
[docs/accessibility.md](./docs/accessibility.md).

## Testing

`npm test` from the workspace root runs every helper's suite,
including this one's, under vitest + jsdom.
- **Typed fields and editing** (0.6.0): `fields` + `card.values` show typed values under the title; `onFieldEdit` makes editable types edit in place (click, or F2). See [spec §11](./spec/index.md#11-typed-fields-inline-editing-export-hot-path-caching-060-2026-10-16).
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
