# Changelog — KanbanBoard (Angular)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## 0.8.1 — 2026-10-18

- No code change; the version follows the other catalogs, whose card cell no longer carries a title-only `aria-label`. This catalog already named the cell by its content.

## 0.8.0 — 2026-10-18

- Added `allowLaneChange`, `showSearchLabel` and `fieldLayout` inputs; `canMove` also receives the swimlane the card would land in; `allowLaneChange` (default true) refuses every cross-lane drop when false; `showSearchLabel` shows `labels.search` as visible text tied to the search field (WCAG 2.5.3); `fieldLayout="compact"` sets `data-field-layout="compact"` on the board. Ported from the Svelte package.
- In-place card title editing, ported from the Svelte package: `editableTitles` and the `titleEdit` output (double-click a title, or F2 on the card; Enter or leaving the field commits, Escape cancels, an empty title is refused; not for linked cards or a custom card renderer). Optional labels `titleEditor` and `titleEditAnnouncement`.

## 0.7.0 — 2026-10-17

- Now composed from the headless layer: the search field is the headless `SearchInput` and a match is the headless `Mark` (the `search-input` / `mark` base classes join the existing `*-search` / `*-match` hooks, so the 57 themes style them too). Keyboard movement (arrows, Home/End, page keys, right-to-left) comes from the shared `grid-navigation` module.
- Added a live drop cue (`data-drop-target` / `data-drop-blocked`, a not-allowed cursor for a refused drop) and right-to-left arrow keys (`isRtl`, `logicalKey`); every label confirmed overridable.
- Added field `validate` (with `aria-invalid` and `labels.editRefused`) and undo / redo of field edits (Ctrl/Cmd+Z, Ctrl/Cmd+Shift+Z / Ctrl+Y) through the `fieldEdit` output.
- Added PageUp / PageDown and type-ahead to the grid keyboard.
- Added copy to the clipboard (`labels.copy`, `copyAnnouncement`, `copyFailed`, `copyHandler`; `toClipboardText`, `copyToClipboard`).
- Search: every word must appear (any order), ignoring case and diacritics; typed field text is searched; matches are highlighted with `<mark>` (not in the data grid's cells); `labels.searchAnnouncement(matches, total)`; Escape clears. 
- Ported from the Svelte 0.7.0; the pure modules come from `shared/` (`bin/sync-shared-modules`).

## 0.6.0 — 2026-10-16

- Added typed card fields (`fields`, `card.values`, `locale`) using the data grid's cell types, shown under the title.
- Added inline field editing (`fieldEdit` output, with `[editableFields]="true"`): click a value or press F2; typed editors, Enter/Escape, IME-safe, refused when invalid for the type, announced.
- Added export to CSV, TSV and Excel (`labels.exportCsv` etc., `labels.exportHeaders`, `exportScope`, `exportFilename`, `exportHandler` / `exportFile`); the export is dependency-free and defuses formula text.
- Selection and row lookup are O(1) per cell.

## 0.5.0 — 2026-10-16

- Added collapsible swimlanes, ported from the Svelte 0.5.0: a collapsed lane keeps its header row but renders no card rows. `[(collapsedLanes)]` holds the collapsed lane ids; `labels.collapseLane(lane, collapsed)` gates a toggle button in the lane header (`aria-expanded`); `labels.laneCount(lane, n)` gates a visible card count. The lane title is now wrapped in `.kanban-board-lane-title`.

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

**Fix: dependency range on `@lilydesignsystem/angular-headless` widened
from `^0.1.0` to `^0.2.0`.** This package composes the headless `IconButton` (plus, for the listbox pickers and
kanban-board, `Listbox`) with props (`baseClass`, the active-descendant
`navigation` mode, …) that only exist in
angular-headless 0.2.0, but `^0.1.0` never resolves to a 0.2.x release,
so a fresh install got 0.1.0 and those props were dropped: Escape left
`aria-expanded="true"` and option selection never applied. Found when
the angular example app's picker e2e tests failed against the published
packages, and confirmed by forcing angular-headless 0.2.0, which made every
one pass. The same defect and fix as the Svelte catalog's 0.1.2. No
source change.

## 0.1.0 — 2026-09-22

Initial release. Ports `@lilydesignsystem/svelte-kanban-board`
(2026-09-22) to Angular 20: composes
`@lilydesignsystem/angular-headless`'s `KanbanTable` family
(structural, unmodified) and `IconButton`/`Listbox` (the same headless
pair every `*-picker` in this catalog already depends on) for a
per-card "Move to…" action menu. Per WCAG 2.5.7 and the Atlassian
Pragmatic Drag and Drop accessibility research cited in the spec, card
movement is never arrow-key-drag-only: pointer drag-and-drop is
supplementary to the move-menu keyboard path. Also ships WIP-limit
warnings as a `data-over-limit` styling hook (not enforced), derived
card counts, and one `aria-live="polite"` status region. Column
reordering, swimlanes, card selection/bulk-move, search/filter,
collapsible columns, drag-preview rendering, virtualization, and
undo/redo are documented v1 non-goals, not gaps — see spec/index.md
§9.

Three real deviations from the Svelte reference were found while
reading Angular's headless `KanbanTable`/`KanbanTableTD` source (as
this port's own instructions required, rather than guessing the
markup):

- `KanbanTableTD` has **no `active` prop at all** in this catalog's
  Angular port (Svelte's does, and reuses it for the roving-tabindex
  cursor). There is no contract to collide with; `KanbanBoard` sets
  `data-row`/`data-col`/`tabindex`/`aria-selected` directly via
  attribute bindings on the native `<td lily-kanban-table-td>` cell in
  its own template instead. `KanbanTableTD` is not modified.
- `KanbanTable` sets **no `role="grid"`** on its rendered `<table>`
  (Svelte's does). Since `KanbanTable` is on this port's "do not
  modify" list, `KanbanBoard` applies `role="grid"` itself in
  `ngAfterViewInit()` — a plain DOM write outside Angular's own
  change-detection tracking (so it persists across later checks),
  the same category of fix as the roving-tabindex `querySelector` this
  component already performs. See spec/index.md §3.
- `KanbanTable` has **no `caption` input** (Svelte's does). A
  `<caption>` element is valid projected content as a `<table>`'s
  first child regardless, so `KanbanBoard` projects one conditionally;
  no headless change needed.

One additive extension to the shared headless `IconButton` component
(`lily-design-system-angular-headless/components/IconButton.ts`) was
needed and made: a `tabIndex` input (default `null`, unchanged
behaviour when unset) so the per-card move-menu trigger is not an
independent Tab stop inside the WAI-ARIA APG grid — the roving-tabindex
cursor must be the *only* stop. The Svelte reference achieves the same
thing with a plain `tabindex="-1"` rest-prop spread, which Angular's
`IconButton` (no generic spread-onto-inputs mechanism, per its own doc
comment) has no equivalent for. This mirrors the same additive-only
extension precedent already recorded for `IconButton`/`Listbox` in
[spec/helpers/index.md § Composition with the headless layer](../spec/helpers/index.md).
`IconButton`'s own 7-test suite, and the full headless catalog suite
(1029 tests across 491 components), were re-run after the change and
stay green.

A real correctness bug was caught and fixed during test-rigor
verification (mutation-testing each new test, per this catalog's own
calibration standard): the first draft of `focusMoveButton` used a
single shared reference to "the move button," matching a latent defect
already present in the Svelte reference this package ports (there,
every card's `IconButton` binds the same `bind:ref` variable, so
whichever card's button mounts *last* wins, not necessarily the one
whose menu just closed — invisible because the original test only
asserted the focused element's shared CSS class, which every card's
button carries regardless). Fixed here by querying the specific card's
own button via a `data-card-id` attribute rather than any shared
reference, and the test was strengthened to assert the focused
button's `aria-label` (unique per card), which fails against the
"last-rendered wins" behaviour and passes against the fix — see
`kanban-board.component.spec.ts`'s own comment on §8.8.

`onMove` (a Svelte callback prop) becomes the `move` output, this
catalog's established idiom.

---

Lily™ and Lily Design System™ are trademarks.
