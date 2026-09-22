# AGENTS — KanbanBoard (Svelte helper)

Single source of truth: [spec/index.md](./spec/index.md). Read it first; everything
below is a fast index.

## What this package is

A reusable Svelte 5 headless interactive kanban board. It composes
`@lilydesignsystem/svelte-headless`'s `KanbanTable` family (a real npm
dependency, unmodified) the same way `data-grid` composes `DataTable`,
and reuses `data-grid`'s own WAI-ARIA APG Grid-pattern roving-tabindex
keyboard model across the resulting rectangular grid (columns ×
largest column's card count). Ships no CSS.

Proposed and documented first in
[spec/helpers/index.md § kanban-board contract](../../spec/helpers/index.md)
(2026-09-21), implemented here (2026-09-22). No other framework catalog
ports it yet.

## Files

| File                  | Purpose                                                |
| --------------------- | ------------------------------------------------------- |
| `spec/index.md`       | Specification-driven contract (canonical).             |
| `KanbanBoard.svelte`  | Implementation. TypeScript + Svelte 5 runes.            |
| `KanbanBoard.test.ts` | Vitest spec, one or more assertions per §8 acceptance. |
| `index.ts`            | Barrel re-export.                                       |
| `index.md`            | User guide.                                             |

## Public surface

- Default export: `KanbanBoard` component.
- Named export: `KanbanBoard`.
- Type exports: `Props`, `KanbanColumn`, `KanbanCard`, `KanbanLabels`.

Required props: `label`, `columns`, `cards`.

## Behaviour contract (one paragraph)

Cards render in a rectangular grid: rows correspond to a card's
position within its column, columns to `KanbanColumn`. Shorter columns
pad with empty, non-tabbable cells so every column has the same row
count as the tallest one. Keyboard follows data-grid's WAI-ARIA APG
Grid roving-tabindex model — one cell `tabindex="0"` at a time. Moving
a card is never arrow-key-drag-only, per WCAG 2.5.7 and Atlassian's
Pragmatic Drag and Drop accessibility research: Enter/Space on a
focused card opens a "Move to…" `Listbox` (active-descendant mode)
listing destination columns, composed from
`@lilydesignsystem/svelte-headless`'s `IconButton`/`Listbox`. Pointer
drag-and-drop (native HTML5) is supplementary, not the only path. A
column's `wipLimit`, once exceeded, marks the column
`data-over-limit` — a styling hook, not an enforced block. Every
successful move announces through one `.kanban-board-status
aria-live="polite"` region built from a caller-supplied
`labels.moveAnnouncement`.

## HTML

See [spec/index.md §4](./spec/index.md#4-html) for the full markup
shape. Root: `<div class="kanban-board {class}">` wrapping the
unmodified `KanbanTable` family and the move-menu `Listbox`, which
renders inline near the focused card.

## Accessibility

- WAI-ARIA APG Grid pattern (`role="grid"`, inherited from
  `KanbanTable`).
- Roving tabindex, not `aria-activedescendant`, for the board itself —
  matches `data-grid`. The "Move to…" menu uses active-descendant mode
  internally (a `Listbox` popup, not the grid).
- The move menu is the accessible path for card movement; drag is
  supplementary, never required — see spec/index.md §6 for the WCAG
  2.5.7 rationale and the Atlassian research cited there.
- One `aria-live="polite"` region for all move announcements.

## Conventions this package follows

- Svelte 5 runes (`$props`, `$bindable`, `$derived`, `$effect`).
- Strict TypeScript on the public surface.
- Depends on `@lilydesignsystem/svelte-headless` as a real dependency —
  never vendors `KanbanTable`'s or `Listbox`'s markup.
- No bundled CSS, fonts, or images.
- Every user-facing string is a `labels.*` prop; a label's presence
  gates the control it names (mirrors `share-picker`'s `copyLabel` and
  `date-time-picker`'s `labels`) — no baked-in English fallback.
- Non-goals (multi-select/bulk move, swimlanes, card detail editing,
  virtualization, column reorder, card sub-tasks) are documented, not
  silently missing — see spec/index.md §9.
