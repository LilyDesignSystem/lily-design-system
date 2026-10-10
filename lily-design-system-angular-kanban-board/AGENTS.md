# AGENTS — KanbanBoard (Angular helper)

Single source of truth: [spec/index.md](./spec/index.md). Read it first; everything
below is a fast index.

## What this package is

A reusable Angular 20 standalone, headless, interactive kanban board.
It composes `@lilydesignsystem/angular-headless`'s `KanbanTable` family
(a real npm dependency, unmodified) plus `IconButton`/`Listbox` (the
same headless pair every `*-picker` in this catalog composes) for a
per-card "Move to…" action menu, reusing the WAI-ARIA APG Grid-pattern
roving-tabindex keyboard model `data-grid`/`svelte-kanban-board`
established. Ships no CSS. Ports
`@lilydesignsystem/svelte-kanban-board` (2026-09-22); no other Angular
catalog package composes `KanbanTable` yet.

## Files

| File                          | Purpose                                                |
| ------------------------------ | ------------------------------------------------------- |
| `spec/index.md`                | Specification-driven contract (canonical).             |
| `kanban-board.component.ts`    | Implementation. Standalone component, signal inputs/outputs. |
| `kanban-board.component.spec.ts` | Vitest + TestBed spec, one or more assertions per §8 acceptance clause. |
| `index.ts`                     | Barrel re-export.                                       |
| `index.md`                     | User guide.                                             |

## Public surface

- Named export: `KanbanBoard` (selector `lily-kanban-board`).
- Named export: `nextKanbanBoardId`.
- Type exports: `KanbanColumn`, `KanbanCard`, `KanbanLabels`,
  `KanbanMoveEvent`.

Required inputs: `label`, `columns`, `cards`. One output: `move`.

## Behaviour contract (one paragraph)

Cards render in a rectangular grid: rows correspond to a card's
position within its column, columns to `KanbanColumn`. Shorter columns
pad with empty, non-tabbable cells so every column has the same row
count as the tallest one. Keyboard follows the WAI-ARIA APG Grid
roving-tabindex model — one cell `tabindex="0"` at a time, applied
directly via attribute bindings on the native `<td
lily-kanban-table-td>` cell (Angular's headless `KanbanTableTD` has no
`active` prop to reuse, unlike Svelte's — see spec/index.md §3). Moving
a card is never arrow-key-drag-only, per WCAG 2.5.7 and Atlassian's
Pragmatic Drag and Drop accessibility research: Enter/Space on a
focused card opens a "Move to…" `Listbox` (active-descendant mode)
listing destination columns. Pointer drag-and-drop (native HTML5) is
supplementary, not the only path. A column's `wipLimit`, once
exceeded, marks the column `data-over-limit` — a styling hook, not an
enforced block. Every successful move announces through one
`.kanban-board-status aria-live="polite"` region built from a
caller-supplied `labels.moveAnnouncement`.

## HTML

See [spec/index.md §4](./spec/index.md#4-html) for the full markup
shape. Root: `<div class="kanban-board {className}">` inside
`KanbanBoard`'s own `<lily-kanban-board>` host tag (Angular always
emits a host element for a component selector — extra attributes a
consumer writes on `<lily-kanban-board>` land there, one level outside
`.kanban-board`, not spread onto the div itself; see spec §8.12).

## Accessibility

- WAI-ARIA APG Grid pattern (`role="grid"`) — applied by `KanbanBoard`
  itself in `ngAfterViewInit()`, since Angular's headless `KanbanTable`
  sets no `role` at all (confirmed by reading `KanbanTable.ts`) and is
  on this port's "do not modify" list. A plain DOM write outside
  Angular's own change-detection tracking, so it is never removed on a
  later check.
- Roving tabindex, not `aria-activedescendant`, for the board itself.
  The "Move to…" menu uses active-descendant mode internally (a
  `Listbox` popup, not the grid).
- The move menu is the accessible path for card movement; drag is
  supplementary, never required.
- One `aria-live="polite"` region for all move announcements.
- Closing the move menu refocuses the **specific card's own** move
  button, queried by a `data-card-id` attribute rather than a single
  shared `ViewChild` — a move button renders once per card inside a
  `@for` loop, so a naive shared reference resolves to whichever
  card's button mounted *last*, not the one whose menu just closed.
  This was caught by strengthening the §8.8 test to assert the
  focused button's `aria-label` (not just its shared CSS class) — see
  the test's own comment and this catalog's rigor requirements.

## Conventions this package follows

- Angular 20 standalone component, signal-based inputs
  (`input()`/`input.required()`), signal outputs (`output()`),
  `OnPush` change detection.
- Depends on `@lilydesignsystem/angular-headless` as a real npm
  dependency (`ng-package.json`'s `allowedNonPeerDependencies`) — never
  vendors `KanbanTable`'s or `Listbox`'s markup.
- No bundled CSS, fonts, or images.
- Every user-facing string is a `labels.*` input; a label's presence
  gates the control it names — no baked-in English fallback.
- Non-goals (multi-select/bulk move, swimlanes, card detail editing,
  virtualization, column reorder, card sub-tasks) are documented, not
  silently missing — see spec/index.md §9.

## Deviations from the Svelte reference (read spec/index.md §3 and §10 for full reasoning)

1. Angular's headless `KanbanTableTD` has no `active` prop at all
   (Svelte's does) — roving-tabindex state is set via direct attribute
   bindings on the native cell instead; no headless change needed.
2. Angular's headless `KanbanTable` sets no `role="grid"` (Svelte's
   does) — patched by `KanbanBoard` itself, once, client-side.
3. Angular's headless `KanbanTable` has no `caption` input (Svelte's
   does) — a projected `<caption>` element covers it.
4. `IconButton` gained one small additive `tabIndex` input so the
   move-menu trigger is not an independent Tab stop inside the grid —
   mirrors the precedent already recorded for `IconButton`/`Listbox`
   in `spec/helpers/index.md`. `IconButton`'s own 7-test suite passes
   unmodified; the full headless suite (1029 tests) was re-run and
   stays green.
5. `onMove` (a Svelte callback prop) becomes the `move` output —
   Angular's established idiom for "fires after X" in this catalog.
