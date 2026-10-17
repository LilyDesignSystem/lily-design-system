# Lily Design System™ — Angular KanbanBoard

A headless, interactive kanban board: cards move between columns by
pointer drag-and-drop or, independently, by a keyboard-accessible
per-card "Move to…" menu — never drag-only. Ports
[`@lilydesignsystem/svelte-kanban-board`](../lily-design-system-svelte-kanban-board/index.md)
to Angular 20.

## Install

```sh
npm install @lilydesignsystem/angular-kanban-board
```

`@lilydesignsystem/angular-headless` installs automatically as a
regular dependency — `KanbanBoard` composes its `KanbanTable` family
and `IconButton`/`Listbox`, not a reimplementation.

## Usage

```ts
import { Component } from "@angular/core";
import { KanbanBoard, type KanbanMoveEvent } from "@lilydesignsystem/angular-kanban-board";

@Component({
  selector: "app-board",
  standalone: true,
  imports: [KanbanBoard],
  template: `
    <lily-kanban-board
      label="Sprint board"
      [columns]="columns"
      [cards]="cards"
      [labels]="labels"
      (move)="onMove($event)"
    />
  `,
})
export class BoardComponent {
  columns = [
    { id: "todo", title: "To Do" },
    { id: "doing", title: "In Progress", wipLimit: 3 },
    { id: "done", title: "Done" },
  ];

  cards = [
    { id: "c1", columnId: "todo", title: "Write the spec" },
    { id: "c2", columnId: "doing", title: "Build the component" },
  ];

  labels = {
    cardCount: (count: number) => `${count} cards`,
    overLimit: (count: number, limit: number) => `${count} of ${limit} — over limit`,
    moveButton: (card: { title: string }) => `Move ${card.title}`,
    moveMenuLabel: "Move to column",
    moveAnnouncement: (title: string, column: string) => `${title} moved to ${column}`,
  };

  onMove({ cardId, toColumnId }: KanbanMoveEvent): void {
    const card = this.cards.find((c) => c.id === cardId);
    if (card) card.columnId = toColumnId;
  }
}
```

## Behaviour

- **Rendering.** Cards render as a rectangular grid: rows are a card's
  position within its column, columns are `KanbanColumn`s. Shorter
  columns pad with empty cells.
- **Moving a card — keyboard (the primary path).** Focus a card cell
  (roving `tabindex`, WAI-ARIA APG Grid pattern) and press Enter or
  Space to open its "Move to…" menu; choose a destination column to
  move it. Escape closes without moving.
- **Moving a card — pointer.** Drag a card's title onto another
  column's cell. Supplementary to the keyboard path, never the only
  way to move a card — WCAG 2.5.7 requires a non-dragging alternative
  for any drag-based interaction.
- **WIP limits.** `column.wipLimit`, once exceeded, marks that
  column's header `data-over-limit` — style the warning state
  yourself; nothing is blocked.
- **Announcements.** Every move is announced through one
  `aria-live="polite"` status region, built from
  `labels.moveAnnouncement`.

## Labels

Every user-facing string is optional on `KanbanLabels`, and its
presence gates the control it names — omit `labels.overLimit` and no
WIP warning text renders (the `data-over-limit` attribute still does,
as a pure styling hook); omit `labels.moveAnnouncement` and nothing is
announced. There is no built-in English text anywhere in this package.

## Accessibility

WAI-ARIA APG Grid pattern throughout — see
[spec/index.md §7](./spec/index.md#7-accessibility) for the full
contract, and §3 for the small number of places this port fills a gap
in Angular's own headless `KanbanTable` (no `role="grid"`, no
`caption` input) rather than modifying that package.
- **Typed fields and editing** (0.6.0): `fields` + `card.values` show typed values under the title; `fieldEdit` output with `[editableFields]="true"` makes editable types edit in place (click, or F2). See [spec §11](./spec/index.md#11-typed-fields-inline-editing-export-hot-path-caching-060-2026-10-16).
- **Export** (0.6.0): `labels.exportCsv` / `exportTsv` / `exportExcel` plus `labels.exportHeaders` add CSV, TSV and Excel buttons for the shown (or selected) cards.

## Export: copy to clipboard (0.7.0)

- **Copy to clipboard**: `labels.copy` names a button (`data-…-export-format="copy"`; for the kanban board, Gantt chart and calendar it also needs `labels.exportHeaders`, like the downloads) that puts exactly what a download would hold — the same cards, scope and order, header row first — on the clipboard as tab-separated text (`toClipboardText`: no byte-order mark, formula text defused), ready to paste into a spreadsheet. `copyToClipboard` uses the async Clipboard API and falls back to a hidden, selected `<textarea>` with `execCommand("copy")`; it never throws. `labels.copyAnnouncement(rowCount)` is announced, `labels.copyFailed` when neither path worked, and the `copy` output and `copyHandler({ text, rowCount })` may return `false` to take over (nothing is copied).

## Keyboard: page keys and type-ahead (0.7.0)

- **PageUp / PageDown** move the cursor ten rows (a `virtualize` page when virtualized), clamping at the ends.
- **Type-ahead**: letters typed in quick succession move to the next card in the focused column whose label starts with them. A lone `x` stays the select shortcut when `selectable`; it joins a prefix already in progress. A Ctrl, Alt or Meta key, and an unmatched prefix, do nothing.

## In-place edit: validation, undo and redo (0.7.0)

- **Field `validate(value, values)`** refuses a value of the right type that is not acceptable (a negative estimate): return the reason. The editor stays open with `aria-invalid="true"` (cleared as soon as the user types again) and `labels.editRefused(card, header, reason)` is announced, falling back to `labels.editInvalid`.
- With `undoable`, Ctrl/Cmd+Z takes back a **move** first while there is one, then field edits.
- **Undo and redo**: every accepted edit is remembered (the latest 100). Ctrl/Cmd+Z puts the earlier value back and Ctrl/Cmd+Shift+Z (or Ctrl+Y) re-applies one, both **through the `fieldEdit` output** with the restored value and the one it replaced — the consumer owns the data, so an undo is reported like an edit, and an undo is not itself recorded. A new edit ends the redo chain. Inside a field editor the browser's own undo is left alone; nothing happens in a `readonly` component or without the `fieldEdit` output. `labels.fieldUndoAnnouncement(card, header, text)` / `labels.fieldRedoAnnouncement(card, header, text)` are announced. The stacks are the pure `edit-history.ts` (`recordEdit`, `undoEdit`, `redoEdit`, `historyKey`).

## Drop cue, labels and direction (0.7.0)

- **A live "can't drop here" cue.** While a card is dragged, the cell under the pointer carries `data-drop-target` if it would accept the card, and `data-drop-blocked` (not `data-drop-target`) if `canMove`, `allowedColumns` or a full strict WIP limit would refuse it. A refused `dragover` is not cancelled and sets `dropEffect` to `none`, so the browser shows its own not-allowed cursor; an accepted one is cancelled and sets `move`. The cues clear on leave, drop and drag end. The reference themes outline an accepted cell with a dashed ring and stripe a refused one. This is the live twin of the announcement `labels.moveBlocked` makes after a refused keyboard move; a server-side refusal (a 422) still snaps the card back through `onMove` rejecting.
- **Every label is overridable.** All visible and spoken text is in `labels` (`emptyColumn`, `addCard`, `collapseColumn`, `laneCount`, the announcements and the rest); the only literal in the markup is the decorative `+` glyph of the add-card button, which has its accessible name from `labels.addCard`. A complete Chinese bundle is tested to leave no English in the DOM.
- **Right-to-left.** The horizontal arrows are visual: in a right-to-left layout ArrowLeft goes to the next column, and Alt+ArrowLeft/Right (move the card) and Alt+Shift+ArrowLeft/Right (move the column) follow the arrow. Vertical keys, Home, End and the page keys are unchanged. `isRtl` / `logicalKey` are exported.
- Tests §8.137–§8.148.

## Search (0.7.0)

`search` (a `model()`; the field renders when `labels.search` names it) narrows the cards: every word must appear, in any order, ignoring case and diacritics. The default text is the card's label, subtitle, badges and every typed field's text. Matches in the title are wrapped in `<mark class="kanban-board-match">` (link titles too); `labels.searchAnnouncement(matches, total)` is announced; Escape in the field clears it. See spec §18.

## Non-goals

Drag-preview/ghost-element rendering, virtualization, undo/redo,
column reordering, swimlanes, card selection/bulk-move, search/filter,
collapsible columns — see
[spec/index.md §9](./spec/index.md#9-non-goals).
