# Changelog — KanbanBoard (Svelte)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## 0.8.0 — 2026-10-18

- `canMove(card, toColumn, toLane?)` receives the swimlane the card would land in, so a rule can depend on the owner as well as the column. New `allowLaneChange` (default true): false refuses every cross-lane drop.
- `onTitleEdit` makes card titles editable in place (double-click, or F2 on a card): Enter or leaving the field commits, Escape cancels, an empty title is refused. Optional labels `titleEditor` and `titleEditAnnouncement`. Not for linked cards or the `card` snippet.
- `showSearchLabel` shows `labels.search` as visible text beside the search field (`.kanban-board-search-label`).
- `fieldLayout="compact"` sets `data-field-layout="compact"` on the board for CSS.
- `svelte-headless` is now a peer dependency (`>=0.4.0 <1.0.0`), tested on 0.5.0.

## 0.7.0 — 2026-10-17

- Now composed from the headless layer: the search field is the headless `SearchInput` and a match is the headless `Mark` (the `search-input` / `mark` base classes join the existing `*-search` / `*-match` hooks, so the 57 themes style them too). Keyboard movement (arrows, Home/End, page keys, right-to-left) comes from the shared `grid-navigation` module.
- Added a live drop cue (`data-drop-target` / `data-drop-blocked`, a not-allowed cursor for a refused drop) and right-to-left arrow keys (`isRtl`, `logicalKey`); every label confirmed overridable.
- Added field `validate` (with `aria-invalid` and `labels.editRefused`) and undo / redo of field edits (Ctrl/Cmd+Z, Ctrl/Cmd+Shift+Z / Ctrl+Y) through `onFieldEdit`.
- Added PageUp / PageDown and type-ahead to the grid keyboard.
- Added copy to the clipboard (`labels.copy`, `copyAnnouncement`, `copyFailed`, `onCopy`; `toClipboardText`, `copyToClipboard`).
- Search: every word must appear (any order), ignoring case and diacritics; typed field text is searched; matches are highlighted with `<mark>` (not in the data grid's cells); `labels.searchAnnouncement(matches, total)`; Escape clears. 

## 0.6.0 — 2026-10-16

- Added typed card fields (`fields`, `card.values`, `locale`) using the data grid's cell types, shown under the title.
- Added inline field editing (`onFieldEdit`): click a value or press F2; typed editors, Enter/Escape, IME-safe, refused when invalid for the type, announced.
- Added export to CSV, TSV and Excel (`labels.exportCsv` etc., `labels.exportHeaders`, `exportScope`, `exportFilename`, `onExport`); the export is dependency-free and defuses formula text.
- Selection and row lookup are O(1) per cell.

## 0.5.0 — 2026-10-16

- Added collapsible swimlanes: `collapsedLanes` (bindable); `labels.collapseLane(lane, collapsed)` gates a toggle with `aria-expanded` in the lane header; a collapsed lane keeps its header and renders no card rows; `labels.laneCount(lane, count)` shows the lane's card count. The lane title is now wrapped in `.kanban-board-lane-title`.

## 0.4.0 — 2026-10-14

- Added the boards' remaining gaps: multi-select (`selectable`, bindable `selected`, `onSelectionChange`: Ctrl/Cmd+click or the `x` key; moving one
  selected card moves them all together, honouring locks, vetoes and hard WIP limits; `labels.moveManyAnnouncement`), undo (`undoable`;
  Ctrl/Cmd+Z and a `labels.undo` button take back the last move or group, through `onMove`), column reordering (`movableColumns`, bindable
  `columnOrder`, `onColumnOrderChange`: drag a header or Alt+Shift+ArrowLeft/Right; `labels.columnMoveAnnouncement`), swimlanes (`lanes`,
  `card.laneId`; a drop into another lane's cell passes the lane id to `onMove` as its fourth argument), a drag preview
  (`dragPreviewText`, `data-dragging`) and virtualization (`virtualize: { rowHeight, height, overscan? }` renders only the rows in view).
  Not built: a card editor (Lily ships no form) and card-order persistence (the consumer's data).

## 0.3.0 — 2026-10-14

- Added collapsible columns (`collapsedColumns`, bindable; `labels.collapseColumn` gates a toggle with `aria-expanded`; a
  collapsed column keeps its header and count but shows no cards), per-column add-card buttons (`labels.addCard`, `onAddCard`;
  none when read-only) and hard WIP limits (`column.strictLimit` refuses moves into a full column, announced via `moveBlocked`).
- Added `filter` and `compare` (hide and order cards; counts and WIP limits still use every card; `data-hidden-count`), drag-and-drop
  drop position (`onMove`'s optional third argument; dropping on a card of the same column calls `onReorder`; `data-drop-target`),
  locked cards (`card.locked`, `data-locked`), Alt+ArrowLeft/Right to move a card to the neighbouring column, and `cardAttrs`.
- Added a `card` snippet and `subtitle`, `badges` and `href` card fields; `card.flag` / `column.flag` (visible text, `data-flag`, linked
  to the cell with `aria-describedby`); `column.accent` (`data-accent`); `allowedColumns(card)` (the move menu and drops offer only
  valid columns); `card.draggable`; an async `onMove` (the card moves at once with `data-pending` / `aria-busy` and goes back on
  rejection: `labels.movePending`, `labels.moveFailed`, `onMoveError`); `columnHeader` / `columnFooter` snippets; `labels.emptyColumn`;
  and a board-level `search` (`labels.search` gates the field; `searchText`).

## 0.2.0 — 2026-10-14

- Added `readonly`, `canMove` (with `labels.moveBlocked`) and
  within-column reorder: Alt+ArrowUp/Down fires the new `onReorder`
  (with `labels.reorderAnnouncement`).
- SVAR Svelte Kanban survey and ranked next ideas: spec §11.

## Unreleased — 2026-10-11

Fixed: keys in an open move menu no longer reach the grid; focus and the roving cursor follow a moved card to its new
column; clicking a cell moves the cursor; the tab stop survives the board shrinking; choosing or dropping on a card's own
column is not a move; without `labels.moveButton` no unnamed button renders and the menu is named by the card. See the
repository CHANGELOG (2026-10-11) and `spec/index.md` §8.

## 0.1.0 — 2026-09-22

Initial release. Proposed and specced in
[spec/helpers/index.md § kanban-board contract](../spec/helpers/index.md),
then implemented here as the canonical (and, for now, only) catalog.
Composes `@lilydesignsystem/svelte-headless`'s `KanbanTable` family
(structural) and `IconButton`/`Listbox` (the per-card "Move to…"
action-menu trigger and popup) rather than duplicating either. Ships
pointer drag-and-drop between columns and, independently, a
keyboard-accessible move menu — per WCAG 2.5.7 and the Atlassian
Pragmatic Drag and Drop accessibility research cited in the spec, the
keyboard path is the action-menu, not arrow-key dragging. Also ships
WIP limits with a warning state, derived card counts, and `aria-live`
move announcements. Drag-preview rendering, virtualization, undo/redo,
column reordering, swimlanes, card selection/bulk-move, search/filter,
and collapsible columns are documented v1 non-goals, not gaps — see
spec/index.md §9.

---

Lily™ and Lily Design System™ are trademarks.
