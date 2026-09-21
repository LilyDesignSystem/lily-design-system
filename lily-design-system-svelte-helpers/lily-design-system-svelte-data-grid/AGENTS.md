# AGENTS — DataGrid (Svelte helper)

Single source of truth: [spec/index.md](./spec/index.md). Read it first; everything
below is a fast index.

## What this package is

A reusable Svelte 5 headless interactive data grid. Unlike the other
six helpers, it does not own a page-header preference — it composes
`@lilydesignsystem/svelte-headless`'s `DataTable` family (a real npm
dependency, unmodified) and adds sort, client-side filter, row
selection, column resize/visibility, pagination, and WAI-ARIA APG
Grid-pattern roving-tabindex keyboard navigation on top of it. Ships
no CSS.

Proposed and documented first in
[spec/helpers/index.md § data-grid contract](../../spec/helpers/index.md)
(2026-09-21); this package is that contract's first implementation.
No other framework catalog ports it yet.

## Files

| File               | Purpose                                                |
| ------------------ | ------------------------------------------------------- |
| `spec/index.md`    | Specification-driven contract (canonical).             |
| `DataGrid.svelte`  | Implementation. TypeScript + Svelte 5 runes.            |
| `DataGrid.test.ts` | Vitest spec, one or more assertions per §8 acceptance. |
| `index.ts`         | Barrel re-export.                                       |
| `index.md`         | User guide.                                             |

## Public surface

- Default export: `DataGrid` component.
- Named export: `DataGrid`.
- Type exports: `Props`, `DataGridColumn`, `DataGridRow`,
  `DataGridLabels`, `DataGridSelectionMode`, `DataGridSort`,
  `DataGridSortDirection`.

Required props: `label`, `columns`, `rows`.

## Behaviour contract (one paragraph)

Sort is single-column, tri-state (`ascending → descending → none`),
triggered by a column's `data-grid-sort-button`. Filter is a
client-side case-insensitive substring match across `filterable`
columns, rendered only when `labels.search` is set. Selection
(`"none" | "single" | "multiple"`) is two-way bindable via `selected`
and fires `onSelectionChange`. Column resize accepts pointer drag and,
independently, arrow keys on its own resize-handle tab stop. Hiding a
`hidable` column removes its cells from the DOM outright. Pagination
slices sorted-and-filtered rows client-side. Keyboard follows the
WAI-ARIA APG Grid pattern's roving-tabindex model — one cell
`tabindex="0"` at a time, everything else `-1"` — never
`aria-activedescendant`. Every state change announces through one
`data-grid-status` `aria-live="polite"` region built from a
caller-supplied `labels.*` function. `storageKey`, when set, persists
only column widths, hidden columns, and sort state — never row data or
selection.

## HTML

See [spec/index.md §4](./spec/index.md#4-html) for the full markup
shape. Root: `<div class="data-grid {class}">` wrapping an optional
toolbar, the unmodified `DataTable` family, and an optional pagination
footer.

## Accessibility

- WAI-ARIA APG Grid pattern (`role="grid"`, inherited from `DataTable`).
- Roving tabindex, not `aria-activedescendant` — see spec/index.md §6
  for why.
- `aria-sort` on every sortable header, reflecting live state.
- Hiding a column removes its cells rather than hiding them visually,
  so column count stays truthful to assistive technology.
- One `aria-live="polite"` region for all state-change announcements.

## Conventions this package follows

- Svelte 5 runes (`$props`, `$bindable`, `$derived`, `$effect`).
- Strict TypeScript on the public surface.
- Depends on `@lilydesignsystem/svelte-headless` as a real dependency —
  never vendors `DataTable`'s markup.
- No bundled CSS, fonts, or images.
- Every user-facing string is a `labels.*` prop; a label's presence
  gates the control it names (mirrors `share-picker`'s `copyLabel` and
  `date-time-picker`'s `labels`) — no baked-in English fallback.
- Non-goals (virtualization, inline editing, column reorder/pin, row
  grouping, server-side data, CSV export, row drag-reorder) are
  documented, not silently missing — see spec/index.md §9.
