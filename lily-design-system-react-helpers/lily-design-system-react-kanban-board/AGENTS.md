# AGENTS — KanbanBoard (React helper)

Single source of truth: [spec/index.md](./spec/index.md). Read it first; everything
below is a fast index.

## What this package is

A reusable React 19 headless interactive kanban board. It composes
`@lilydesignsystem/react-headless`'s `KanbanTable` family (a real npm
dependency, unmodified) and reuses the same WAI-ARIA APG Grid-pattern
roving-tabindex keyboard model this catalog's other grid-shaped
helpers use across the resulting rectangular grid (columns × largest
column's card count). Ships no CSS.

Ported from the canonical
[`@lilydesignsystem/svelte-kanban-board`](../../lily-design-system-svelte-helpers/lily-design-system-svelte-kanban-board/)
(2026-09-22), which is the reference implementation for this contract —
see [spec/helpers/index.md § kanban-board contract](../../spec/helpers/index.md).

## Files

| File                    | Purpose                                                |
| ------------------------ | ------------------------------------------------------- |
| `spec/index.md`          | Specification-driven contract (canonical).             |
| `KanbanBoard.tsx`        | Implementation. TypeScript + React 19 hooks.            |
| `KanbanBoard.test.tsx`   | Vitest spec, one or more assertions per §8 acceptance. |
| `index.ts`               | Barrel re-export.                                       |
| `index.md`               | User guide.                                             |

## Public surface

- Default export: `KanbanBoard` component.
- Named export: `KanbanBoard`.
- Type exports: `Props`, `KanbanColumn`, `KanbanCard`, `KanbanLabels`.

Required props: `label`, `columns`, `cards`.

## Behaviour contract (one paragraph)

Cards render in a rectangular grid: rows correspond to a card's
position within its column, columns to `KanbanColumn`. Shorter columns
pad with empty, non-tabbable cells so every column has the same row
count as the tallest one. Keyboard follows the WAI-ARIA APG Grid
roving-tabindex model — one cell `tabindex="0"` at a time. Moving a
card is never arrow-key-drag-only, per WCAG 2.5.7 and Atlassian's
Pragmatic Drag and Drop accessibility research (cited in full in the
Svelte reference's spec): Enter/Space on a focused card opens a "Move
to…" `Listbox` (active-descendant mode) listing destination columns,
composed from `@lilydesignsystem/react-headless`'s
`IconButton`/`Listbox`. Pointer drag-and-drop (native HTML5) is
supplementary, not the only path. A column's `wipLimit`, once
exceeded, marks the column `data-over-limit` — a styling hook, not an
enforced block. Every successful move announces through one
`.kanban-board-status aria-live="polite"` region built from a
caller-supplied `labels.moveAnnouncement`.

## HTML

See [spec/index.md §4](./spec/index.md#4-html) for the full markup
shape. Root: `<div class="kanban-board {className}">` wrapping the
unmodified `KanbanTable` family and the move-menu `Listbox`, which
renders inline near the focused card.

## Accessibility

- WAI-ARIA APG Grid pattern (`role="grid"`, inherited from
  `KanbanTable`).
- Roving tabindex, not `aria-activedescendant`, for the board itself.
  The "Move to…" menu uses active-descendant mode internally (a
  `Listbox` popup, not the grid).
- The move menu is the accessible path for card movement; drag is
  supplementary, never required — see spec/index.md §6.
- One `aria-live="polite"` region for all move announcements.

## Conventions this package follows

- React 19 function components with hooks (`useState`, `useRef`,
  `useEffect`, `useId`).
- Strict TypeScript on the public surface (`Omit<React.HTMLAttributes<HTMLDivElement>, ...>`
  rather than a `[key: string]: unknown` catch-all, needed for
  `forwardRef`'s `.d.ts` generation on the composed `IconButton`).
- Depends on `@lilydesignsystem/react-headless` as a real dependency —
  never vendors `KanbanTable`'s or `Listbox`'s markup.
- No bundled CSS, fonts, or images.
- Every user-facing string is a `labels.*` prop; a label's presence
  gates the control it names (mirrors `share-picker`'s `copyLabel` and
  `date-time-picker`'s `labels`) — no baked-in English fallback.
- Non-goals (multi-select/bulk move, swimlanes, card detail editing,
  virtualization, column reorder, card sub-tasks) are documented, not
  silently missing — see spec/index.md §9.

## Deviation from the Svelte reference worth knowing about

Move-button focus-return uses a per-card `Map<cardId, HTMLButtonElement>`
of refs, not one shared ref overwritten by whichever card mounts last —
see spec/index.md §12 for the full reasoning. Behaviourally invisible
(the ported test still passes unmodified) but a real correctness fix.
