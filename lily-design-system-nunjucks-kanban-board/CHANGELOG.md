# Changelog — KanbanBoard (Nunjucks)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## Unreleased

- Works with the label packs: `nunjucksLabelsFor()` gives the macro `labels` and the client option `labels`.
- In-place card title editing: the macro param `editableTitles`, the client option `onTitleEdit` and the `titleedit` event (double-click a title, or F2 on the card; Enter or leaving the field commits, Escape cancels, an empty title is refused; not for linked or locked cards). Labels `titleEditor` and `titleEditAnnouncement`.

## 0.7.0 — 2026-10-17

- Added search: `labels.search` renders a field that keeps the cards by title, subtitle, badges and field text; every typed word must appear (any order), ignoring case and diacritics; matches are marked with `<mark class="mark kanban-board-match">`; `labels.searchAnnouncement` announces the count; Escape clears.
- Added PageUp / PageDown, type-ahead on card titles in the focused column, and right-to-left arrow keys (`isRtl`, `logicalKey`; `gridMove` from `shared/`).
- Added copy to the clipboard: `labels.copy` renders a button that puts the export (header row first, tab-separated) on the clipboard; `labels.copyAnnouncement`, `labels.copyFailed`, the client option `onCopy({ text, rowCount })` (return `false` to take over) and the `copy` event.
- Added field `validate` (the editor stays open with `aria-invalid`; `labels.editRefused` announces the reason) and undo / redo of field edits (Ctrl/Cmd+Z, Ctrl/Cmd+Shift+Z / Ctrl+Y) reported through `onFieldEdit` and the `fieldedit` event; `labels.fieldUndoAnnouncement` / `fieldRedoAnnouncement`.
- Added a live drop cue: a card dragged over a cell its `canMove`, `allowedColumns` or strict WIP limit would refuse puts `data-drop-blocked` on the cell (not `data-drop-target`) and the browser shows its not-allowed cursor.
- Not yet ported from the Svelte package: the headless `SearchInput` / `Mark` composition (the client builds the same markup by hand), filter.
- The pure modules come from `shared/` (`bin/sync-shared-modules`).

## 0.6.0 — 2026-10-16

- Added typed card fields (`fields`, `card.values`, `locale`) using the data grid's cell types, shown under the title.
- Added inline field editing (the macro's `editableFields`; the client option `onFieldEdit` reports each edit): click a value or press F2; typed editors, Enter/Escape, IME-safe, refused when invalid for the type, announced.
- Added export to CSV, TSV and Excel (`labels.exportCsv` etc., `labels.exportHeaders`, `exportScope`, `exportFilename`, `onExport`); the export is dependency-free and defuses formula text.

## 0.5.0 — 2026-10-16

- Added collapsible swimlanes, ported from the Svelte 0.5.0: macro `collapsedLanes` (ids) renders those lanes' header rows with their card rows `hidden`; `labels.collapseLane` / `labels.expandLane` (templates with `{lane}`) gate a `.kanban-board-lane-toggle` button (`aria-expanded`) and `labels.laneCount` (`{lane}`, `{count}`) a visible `.kanban-board-lane-count` that follows the search. Client: `onLaneCollapseChange(ids)`, a `lanecollapsechange` event and `collapsedLanes()` on the controller. Arrow keys now step over hidden rows. The lane title is wrapped in `.kanban-board-lane-title`.

## 0.4.0 — 2026-10-15

- Added multi-select (`selectable`, `selected`, selection-change callback; Ctrl/Cmd+click or `x`; moving one selected card moves the group), undo (`undoable`, Ctrl/Cmd+Z, `labels.undo`), column reordering (`movableColumns`, `columnOrder`; drag a header or Alt+Shift+ArrowLeft/Right), swimlanes (`lanes`, `card.laneId`; lane id as the fourth `onMove` argument), a drag preview (`dragPreviewText`, `data-dragging`) and virtualization (`virtualize`), ported from the Svelte 0.4.0.

## 0.3.0 — 2026-10-14

- Added collapsible columns, per-column add-card buttons and hard WIP limits (`strictLimit`), ported from the Svelte 0.3.0.
- Added `filter` and `compare`, drop position and in-column drag reorder, locked cards, Alt+ArrowLeft/Right column move and `cardAttrs`, plus the consumer-requested capabilities (card `subtitle` / `badges` / `href` and a card slot, `card.flag` / `column.flag` / `column.accent`, `allowedColumns`, async move with a pending state and rollback, column header and footer slots, `labels.emptyColumn`, board `search`), ported from the Svelte 0.3.0.

## 0.2.0 — 2026-10-14

- Added `readonly`, `canMove` (with `labels.moveBlocked`) and within-column reorder (Alt+ArrowUp/Down fires `onReorder`, with `labels.reorderAnnouncement`), ported from the Svelte 0.2.0.

## Unreleased — 2026-10-11

Fixed: keys in an open move menu no longer reach the grid; clicking a cell moves the cursor; the tab stop survives the board shrinking; choosing or dropping on a card's own
column is not a move; without `labels.moveButton` no unnamed button renders and the menu is named by the card. See the
repository CHANGELOG (2026-10-11) and `spec/index.md` §8.

## 0.1.0 — 2026-09-22

Initial release. Ports `@lilydesignsystem/svelte-kanban-board`
(proposed 2026-09-21) to this catalog's macro + client.js
architecture: a keyboard-and-pointer-accessible kanban board with
WAI-ARIA APG Grid roving-tabindex keyboard navigation, a per-card
"Move to…" menu (composed from `@lilydesignsystem/nunjucks-listbox-
behavior`), WIP-limit warnings, derived card counts, and `aria-live`
move announcements. Composes `@lilydesignsystem/nunjucks-headless`'s
kanban-table macro family unmodified. No other framework catalog's
port is affected by this release.
