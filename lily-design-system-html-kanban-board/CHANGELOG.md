# Changelog — `<kanban-board>` (HTML helper)

The format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## 0.8.0 — 2026-10-18

- Added the `allowLaneChange`, `showSearchLabel` and `fieldLayout` properties; `canMove` also receives the swimlane the card would land in; `allowLaneChange` (default true) refuses every cross-lane drop when false; `showSearchLabel` shows `labels.search` as visible text tied to the search field (WCAG 2.5.3); `fieldLayout="compact"` sets `data-field-layout="compact"` on the board. Ported from the Svelte package.
- In-place card title editing, ported from the Svelte package: `onTitleEdit` or `editableTitles`, and the `titleedit` event (double-click a title, or F2 on the card; Enter or leaving the field commits, Escape cancels, an empty title is refused; not for linked cards or a custom card renderer). Optional labels `titleEditor` and `titleEditAnnouncement`.

## 0.7.0 — 2026-10-17

- Markup follows the headless layer (built by hand here, not imported): the search field matches `SearchInput` and a match matches `Mark` (the `search-input` / `mark` base classes join the existing `*-search` / `*-match` hooks, so the 57 themes style them too). Keyboard movement (arrows, Home/End, page keys, right-to-left) comes from the shared `grid-navigation` module.
- Added a live drop cue (`data-drop-target` / `data-drop-blocked`, a not-allowed cursor for a refused drop) and right-to-left arrow keys (`isRtl`, `logicalKey`); every label confirmed overridable.
- Added field `validate` (with `aria-invalid` and `labels.editRefused`) and undo / redo of field edits (Ctrl/Cmd+Z, Ctrl/Cmd+Shift+Z / Ctrl+Y) through `onFieldEdit` and the `fieldedit` event.
- Added PageUp / PageDown and type-ahead to the grid keyboard.
- Added copy to the clipboard (`labels.copy`, `copyAnnouncement`, `copyFailed`, `onCopy`; `toClipboardText`, `copyToClipboard`).
- Search: every word must appear (any order), ignoring case and diacritics; typed field text is searched; matches are highlighted with `<mark>` (not in the data grid's cells); `labels.searchAnnouncement(matches, total)`; Escape clears. 
- Ported from the Svelte 0.7.0; the pure modules come from `shared/` (`bin/sync-shared-modules`).

## 0.6.0 — 2026-10-16

- Added typed card fields (`fields`, `card.values`, `locale`) using the data grid's cell types, shown under the title.
- Added inline field editing (`onFieldEdit`): click a value or press F2; typed editors, Enter/Escape, IME-safe, refused when invalid for the type, announced.
- Added export to CSV, TSV and Excel (`labels.exportCsv` etc., `labels.exportHeaders`, `exportScope`, `exportFilename`, `onExport`); the export is dependency-free and defuses formula text.
- Selection and row lookup are O(1) per cell.

## 0.5.0 — 2026-10-16

- Added collapsible swimlanes, ported from the Svelte 0.5.0: a collapsed lane keeps its header row but renders no card rows. `collapsedLanes` (property; `onCollapsedLanesChange` and a `lanecollapsechange` event report changes) holds the collapsed lane ids; `labels.collapseLane(lane, collapsed)` gates a toggle button in the lane header (`aria-expanded`); `labels.laneCount(lane, n)` gates a visible card count. The lane title is now wrapped in `.kanban-board-lane-title`.

## 0.4.0 — 2026-10-15

- Added multi-select (`selectable`, `selected`, selection-change callback; Ctrl/Cmd+click or `x`; moving one selected card moves the group), undo (`undoable`, Ctrl/Cmd+Z, `labels.undo`), column reordering (`movableColumns`, `columnOrder`; drag a header or Alt+Shift+ArrowLeft/Right), swimlanes (`lanes`, `card.laneId`; lane id as the fourth `onMove` argument), a drag preview (`dragPreviewText`, `data-dragging`) and virtualization (`virtualize`), ported from the Svelte 0.4.0.

## 0.3.0 — 2026-10-14

- Added collapsible columns, per-column add-card buttons and hard WIP limits (`strictLimit`), ported from the Svelte 0.3.0.
- Added `filter` and `compare`, drop position and in-column drag reorder, locked cards, Alt+ArrowLeft/Right column move and `cardAttrs`, plus the consumer-requested capabilities (card `subtitle` / `badges` / `href` and a card slot, `card.flag` / `column.flag` / `column.accent`, `allowedColumns`, async move with a pending state and rollback, column header and footer slots, `labels.emptyColumn`, board `search`), ported from the Svelte 0.3.0.

## 0.2.0 — 2026-10-14

- Added `readonly`, `canMove` (with `labels.moveBlocked`) and within-column reorder (Alt+ArrowUp/Down fires `onReorder`, with `labels.reorderAnnouncement`), ported from the Svelte 0.2.0.

## Unreleased — 2026-10-11

Fixed: keys in an open move menu no longer reach the grid; focus and the roving cursor follow a moved card to its new
column; clicking a cell moves the cursor; the tab stop survives the board shrinking; choosing or dropping on a card's own
column is not a move; without `labels.moveButton` no unnamed button renders and the menu is named by the card. See the
repository CHANGELOG (2026-10-11) and `spec/index.md` §8.

## 0.1.1 — 2026-10-01

**Dependency: `@lilydesignsystem/html-headless` widened to `^0.3.0`.**
This package imports `@lilydesignsystem/html-headless/components/listbox-controller.js`,
which no html-headless release before 0.3.0 actually delivered (0.1.x
lacks the module; 0.2.0 omitted it from the tarball and blocked it in
`exports`), so every earlier version of this package failed to import
from a real npm install with `ERR_PACKAGE_PATH_NOT_EXPORTED`. No source
change.

## 0.1.0 — 2026-09-22

Initial implementation. Ported from the canonical
`@lilydesignsystem/svelte-kanban-board`, adapted to this catalog's
vanilla-custom-element idiom: no `KanbanTable`/`IconButton`/`Listbox`
component dependency (this catalog's headless `kanban-table` family is
markup-contract documentation, not a JS class), `columns`/`cards`/
`cardLabel`/`onMove`/`labels` are property-only, and a `movecard` event
pairs with the `onMove` property. Fixes the move-menu shared-button-
reference bug present in the Svelte canonical (and independently found
by every other framework catalog's own port) by keying move-button
references per card id instead of a single shared field. See
`spec/index.md` §10 for the full deviation list.
