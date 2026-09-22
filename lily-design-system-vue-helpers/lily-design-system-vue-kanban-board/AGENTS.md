# AGENTS — KanbanBoard (Vue helper)

Single source of truth: [spec/index.md](./spec/index.md). Read it first; everything
below is a fast index.

## What this package is

A reusable Vue 3 headless interactive kanban board. It composes
`@lilydesignsystem/vue-headless`'s `KanbanTable` family (a real npm
dependency, unmodified) plus `IconButton`/`Listbox` for a per-card
"Move to…" action menu, and ports `data-grid`'s own WAI-ARIA APG
Grid-pattern roving-tabindex keyboard model across the resulting
rectangular grid (columns × largest column's card count). Ships no
CSS.

A direct port of the canonical
[`@lilydesignsystem/svelte-kanban-board`](../../lily-design-system-svelte-helpers/lily-design-system-svelte-kanban-board/).
When the two disagree, the Svelte side wins.

## Files

| File                 | Purpose                                                |
| --------------------- | ------------------------------------------------------- |
| `spec/index.md`       | Specification-driven contract (canonical).             |
| `KanbanBoard.vue`     | Implementation. `<script setup lang="ts">`.             |
| `KanbanBoard.test.ts` | Vitest + `@vue/test-utils` spec, one or more assertions per §8 acceptance clause. |
| `shims.d.ts`          | Local-only ambient module declaration for `@lilydesignsystem/vue-headless` — works around a real `vue-tsc` limitation (see `spec/index.md` §10 and `lily-design-system-vue-picker-bar/shims.d.ts`). Not published. |
| `index.ts`            | Barrel re-export.                                       |
| `index.md`            | User guide.                                              |

## Public surface

- Default export: `KanbanBoard` component.
- Named exports: `KanbanBoard`, `nextKanbanBoardId`.
- Type exports: `Props`, `KanbanColumn`, `KanbanCard`, `KanbanLabels`.
- Event: `move(cardId: string, toColumnId: string)` — the Vue-idiomatic
  equivalent of the Svelte canonical's `onMove` callback prop.

Required props: `label`, `columns`, `cards`.

## Behaviour contract (one paragraph)

Cards render in a rectangular grid: rows correspond to a card's
position within its column, columns to `KanbanColumn`. Shorter columns
pad with empty, non-tabbable cells so every column has the same row
count as the tallest one. Keyboard follows `data-grid`'s WAI-ARIA APG
Grid roving-tabindex model — one cell `tabindex="0"` at a time. Moving
a card is never arrow-key-drag-only, per WCAG 2.5.7 and Atlassian's
Pragmatic Drag and Drop accessibility research: Enter/Space on a
focused card opens a "Move to…" `Listbox` (active-descendant mode)
listing destination columns, composed from
`@lilydesignsystem/vue-headless`'s `IconButton`/`Listbox`. Pointer
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
renders inline near the focused card (`v-if`-gated: only the currently
open card's menu is ever mounted).

## Accessibility

- WAI-ARIA APG Grid pattern (`role="grid"`, inherited from
  `KanbanTable`).
- Roving tabindex, not `aria-activedescendant`, for the board itself —
  matches `data-grid`. The "Move to…" menu uses active-descendant mode
  internally (a `Listbox` popup, not the grid).
- The move menu is the accessible path for card movement; drag is
  supplementary, never required — see spec/index.md §6 for the WCAG
  2.5.7 rationale.
- One `aria-live="polite"` region for all move announcements.

## Conventions this package follows

- Vue 3 Composition API, `<script setup lang="ts">`, `defineProps`,
  `defineEmits`, `withDefaults`.
- Strict TypeScript on the public surface.
- Depends on `@lilydesignsystem/vue-headless` as a real dependency —
  never vendors `KanbanTable`'s or `Listbox`'s markup.
- No bundled CSS, fonts, or images.
- Every user-facing string is a `labels.*` prop; a label's presence
  gates the control it names — no baked-in English fallback.
- A callback prop in the Svelte canonical (`onMove`) becomes an
  emitted event (`move`) here, matching `picker-bar`'s and
  `date-time-picker`'s own precedent for the same translation.
- Per-card `IconButton`/`Listbox` instances inside the `v-for` use
  function `ref`s (never a static `ref="…"` name), since Vue collects
  a static ref name lexically inside a `v-for` into an array — see
  `KanbanBoard.vue`'s own comment.
- Non-goals (multi-select/bulk move, swimlanes, card detail editing,
  virtualization, column reorder, card sub-tasks) are documented, not
  silently missing — see spec/index.md §9.

## Local development notes

This catalog has no pnpm workspace linking (`pnpm-workspace.yaml`
carries no `packages:` glob). `../vite.config.js` aliases
`@lilydesignsystem/vue-headless` to its already-built `dist/index.mjs`
so tests resolve locally. `../vite.lib.config.ts` externalizes the same
specifier for this package's own build, so the published
`dist/index.js` keeps the bare `import` statement rather than bundling
the whole headless catalog in.
