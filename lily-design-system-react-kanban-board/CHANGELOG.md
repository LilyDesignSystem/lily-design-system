# Changelog — KanbanBoard (React)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## 0.5.0 — 2026-10-16

- Added collapsible swimlanes, ported from the Svelte 0.5.0: a collapsed lane keeps its header row but renders no card rows. `collapsedLanes` (controlled; `defaultCollapsedLanes`, `onCollapsedLanesChange`) holds the collapsed lane ids; `labels.collapseLane(lane, collapsed)` gates a toggle button in the lane header (`aria-expanded`); `labels.laneCount(lane, n)` gates a visible card count. The lane title is now wrapped in `.kanban-board-lane-title`.

## 0.4.0 — 2026-10-15

- Added multi-select (`selectable`, `selected`, selection-change callback; Ctrl/Cmd+click or `x`; moving one selected card moves the group), undo (`undoable`, Ctrl/Cmd+Z, `labels.undo`), column reordering (`movableColumns`, `columnOrder`; drag a header or Alt+Shift+ArrowLeft/Right), swimlanes (`lanes`, `card.laneId`; lane id as the fourth `onMove` argument), a drag preview (`dragPreviewText`, `data-dragging`) and virtualization (`virtualize`), ported from the Svelte 0.4.0.

## 0.3.0 — 2026-10-14

- Added collapsible columns, per-column add-card buttons and hard WIP limits (`strictLimit`), ported from the Svelte 0.3.0.
- Added `filter` and `compare`, drop position and in-column drag reorder, locked cards, Alt+ArrowLeft/Right column move and `cardAttrs`, ported from the Svelte 0.3.0.
- Added the consumer-requested capabilities, ported from the Svelte 0.3.0: card `subtitle` / `badges` / `href` and a `renderCard` prop, `card.flag` / `column.flag` / `column.accent`, `allowedColumns`, `card.draggable`, an async `onMove` with a pending state and rollback (`onMoveError`), `columnHeader` / `columnFooter`, `labels.emptyColumn` and a board `search`.

## 0.2.0 — 2026-10-14

- Added `readonly`, `canMove` (with `labels.moveBlocked`) and within-column reorder (Alt+ArrowUp/Down fires `onReorder`, with `labels.reorderAnnouncement`), ported from the Svelte 0.2.0.

## Unreleased — 2026-10-11

Fixed: keys in an open move menu no longer reach the grid; focus and the roving cursor follow a moved card to its new
column; clicking a cell moves the cursor; the tab stop survives the board shrinking; choosing or dropping on a card's own
column is not a move; without `labels.moveButton` no unnamed button renders and the menu is named by the card. See the
repository CHANGELOG (2026-10-11) and `spec/index.md` §8.

## 0.1.1 — 2026-10-01

**Fix: dependency range on `@lilydesignsystem/react-headless` widened
from `^0.1.0` to `^0.2.0`.** This package composes the headless `IconButton` (plus, for the listbox pickers and
kanban-board, `Listbox`) with props (`baseClass`, the active-descendant
`navigation` mode, …) that only exist in
react-headless 0.2.0, but `^0.1.0` never resolves to a 0.2.x release,
so a fresh install got 0.1.0 and those props were dropped: Escape left
`aria-expanded="true"` and option selection never applied. Found when
the react example app's picker e2e tests failed against the published
packages, and confirmed by forcing react-headless 0.2.0, which made every
one pass. The same defect and fix as the Svelte catalog's 0.1.2. No
source change.

## 0.1.0 — 2026-09-22

Initial release. Ported from the canonical
[`@lilydesignsystem/svelte-kanban-board`](../lily-design-system-svelte-kanban-board/)
(see [spec/helpers/index.md § kanban-board contract](../spec/helpers/index.md)),
translated to React 19 idioms (hooks instead of runes, controlled
callbacks instead of two-way binding). Composes
`@lilydesignsystem/react-headless`'s `KanbanTable` family (structural,
unmodified) and its `IconButton`/`Listbox` pair (the same components
every React preference picker already depends on) for the per-card
"Move to…" action menu. Per WCAG 2.5.7 and the Atlassian Pragmatic
Drag and Drop accessibility research cited in the Svelte spec, card
movement is never arrow-key-drag-only: Enter/Space opens the move
menu; native HTML5 drag-and-drop is supplementary. WIP limits render
as a `data-over-limit` styling hook, not an enforced block. One
`aria-live="polite"` status region announces every successful move.

Deliberate deviation from the reference: move-button focus-return uses
a per-card ref map instead of the Svelte version's single shared
`bind:ref` (which silently points at whichever card mounted last) —
see spec/index.md §12.

---

Lily™ and Lily Design System™ are trademarks.
