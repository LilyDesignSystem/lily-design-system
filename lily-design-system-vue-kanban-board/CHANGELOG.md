# Changelog — KanbanBoard (Vue)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## 0.6.0 — 2026-10-16

- Added typed card fields (`fields`, `card.values`, `locale`) using the data grid's cell types, shown under the title.
- Added inline field editing (`field-edit`): click a value or press F2; typed editors, Enter/Escape, IME-safe, refused when invalid for the type, announced.
- Added export to CSV, TSV and Excel (`labels.exportCsv` etc., `labels.exportHeaders`, `exportScope`, `exportFilename`, `exportHandler` / `export-file`); the export is dependency-free and defuses formula text.
- Selection and row lookup are O(1) per cell.

## 0.5.0 — 2026-10-16

- Added collapsible swimlanes, ported from the Svelte 0.5.0: a collapsed lane keeps its header row but renders no card rows. `v-model:collapsedLanes` holds the collapsed lane ids; `labels.collapseLane(lane, collapsed)` gates a toggle button in the lane header (`aria-expanded`); `labels.laneCount(lane, n)` gates a visible card count. The lane title is now wrapped in `.kanban-board-lane-title`.

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

## 0.1.0 — 2026-09-22

Initial release. Ported from the canonical
[`@lilydesignsystem/svelte-kanban-board`](../lily-design-system-svelte-kanban-board/CHANGELOG.md)
(2026-09-22). Composes `@lilydesignsystem/vue-headless`'s `KanbanTable`
family (structural, unmodified) and its `IconButton`/`Listbox` pair
(the same composition every Vue preference picker already uses) for a
per-card "Move to…" action menu. Per WCAG 2.5.7 and the Atlassian
Pragmatic Drag and Drop accessibility research cited in the spec, card
movement is never arrow-key-drag-only: pointer drag-and-drop is
supplementary to the keyboard-accessible move menu. WIP limits render
as a `data-over-limit` styling hook, not an enforced block. Keyboard
follows the same WAI-ARIA APG Grid roving-tabindex model as
`data-grid`. Drag-preview rendering, virtualization, undo/redo, column
reordering, swimlanes, card selection/bulk-move, search/filter, and
collapsible columns are documented v1 non-goals, not gaps — see
spec/index.md §9.

The Svelte canonical's `onMove` callback prop is this port's `move`
emitted event, matching how `picker-bar` and `date-time-picker`
already translate a callback prop into a Vue event. Per-card
`IconButton`/`Listbox` instances inside the `v-for` are captured via
function `ref`s rather than a static `ref="…"` name, since Vue
collects a static ref name lexically inside a `v-for` into an array —
this also fixes a latent focus-management inaccuracy the Svelte
canonical has (its single `bind:ref` inside an `#each` ends up bound
to whichever card's button rendered last, not necessarily the card
whose own move menu just closed; invisible to its own test suite
because the assertion only checks the focused element's class, not
its identity). This port refocuses the specific card's own button.

Needs its own `shims.d.ts` ambient module declaration for
`@lilydesignsystem/vue-headless`, for `vue-tsc`'s separate declaration
pass — the same convention every other Vue helper composing that
package already follows.

---

Lily™ and Lily Design System™ are trademarks.
