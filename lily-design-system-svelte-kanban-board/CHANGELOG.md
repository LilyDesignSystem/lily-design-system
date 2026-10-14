# Changelog — KanbanBoard (Svelte)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## 0.3.0 — 2026-10-14

- Added collapsible columns (`collapsedColumns`, bindable; `labels.collapseColumn` gates a toggle with `aria-expanded`; a
  collapsed column keeps its header and count but shows no cards), per-column add-card buttons (`labels.addCard`, `onAddCard`;
  none when read-only) and hard WIP limits (`column.strictLimit` refuses moves into a full column, announced via `moveBlocked`).
- Added `filter` and `compare` (hide and order cards; counts and WIP limits still use every card; `data-hidden-count`), drag-and-drop
  drop position (`onMove`'s optional third argument; dropping on a card of the same column calls `onReorder`; `data-drop-target`),
  locked cards (`card.locked`, `data-locked`), Alt+ArrowLeft/Right to move a card to the neighbouring column, and `cardAttrs`.

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
