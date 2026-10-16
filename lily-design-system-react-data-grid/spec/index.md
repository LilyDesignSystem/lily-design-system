# DataGrid — Specification (React helper)

Canonical contract for `@lilydesignsystem/react-data-grid`, ported from the
canonical [`@lilydesignsystem/svelte-data-grid`](../../lily-design-system-svelte-data-grid/spec/index.md)
(the reference implementation; see
[spec/helpers/index.md § data-grid contract](../../spec/helpers/index.md) for the
cross-catalog contract). Same behaviour, React idioms. Where this file is silent the
Svelte spec decides: markup (its §4), behaviour (§6), accessibility (§7), non-goals (§9).

## 1. Purpose

A headless interactive data grid over `@lilydesignsystem/react-headless`'s unmodified
`DataTable` family: sort, client-side filter, row selection, column resize and visibility,
pagination, and WAI-ARIA APG Grid roving-tabindex keyboard navigation. It owns state and
behaviour; it ships no CSS and no English.

## 2. Scope and non-goals

As the Svelte reference §2 and §9: no row grouping, server-side sort/filter/pagination, or row
drag-reorder. (Virtualization, inline cell editing, column reorder, pinning, CSV/TSV/Excel export
and the twelve cell types shipped in 0.9.0.)

## 3. Composition

`DataGrid` renders `DataTable`, `DataTableHead`, `DataTableBody`, `DataTableFoot`,
`DataTableRow`, `DataTableTH` and `DataTableTD` from `@lilydesignsystem/react-headless`
(a real dependency, never vendored).

## 4. HTML

Identical to the Svelte reference §4: a `<div class="data-grid {className}">` holding an
optional toolbar, the table (in a `data-grid-scroll` region unless `scroll={false}`), an
optional pagination footer, and the `data-grid-status` live region. Rest props spread onto
the root `<div>`.

## 5. Props

Required: `label`, `columns`, `rows`. React differences from the Svelte props:

| Svelte                               | React                                                                  |
| ------------------------------------ | ---------------------------------------------------------------------- |
| `class`                              | `className`                                                            |
| `selected` / `filter` / `sort` / `page` (bindable) | the controlled prop **or** a `default…` twin (`defaultSelected`, `defaultFilter`, `defaultSort`, `defaultPage`); a prop that is `undefined` leaves the value to the component |
| (none)                               | `onPageChange(page)` — Svelte callers bind `page`; React callers need the callback |
| `onSelectionChange`, `onFilterChange`, `onSortChange` | unchanged; each fires on every change, controlled or not |
| `empty: Snippet`                     | `empty: ReactNode`                                                     |
| `footer: Snippet<[{ columns, rows }]>` | `footer: (ctx: { columns, rows }) => ReactNode`                      |
| column `cell: Snippet<[ctx]>`        | `cell: (ctx: DataGridCellContext) => ReactNode`                        |
| column `headerCell: Snippet<[{ column }]>` | `headerCell: ({ column }) => ReactNode`                          |

Everything else — `caption`, `rowId`, `selectionMode`, `pageSize`, `storageKey`, `labels`,
`mode`, `rowClass`, `rowAttrs`, `onRowActivate`, `busy`, `scroll`, and every column field
(`id`, `header`, `accessor`, `format`, `sortable`, `compare`, `filterable`, `resizable`,
`hidable`, `width`, `rowHeader`, `align`, `cellClass`, `cellAttrs`) — is as in the Svelte
reference §5. A cell's inline `style` is a React style object.

A controlled value changes only when the consumer passes a new one: with `selected` supplied,
a click calls `onSelectionChange` and the checkbox stays where it was until `selected`
changes.

## 6. Behaviour

As the Svelte reference §6, with these React specifics:

- **Focus after commit.** Arrow/Home/End/Page keys set the roving position, and the focus
  move happens in an effect after the commit that makes the target cell the tab stop;
  mounting the grid never takes focus.
- **Widgets in cells.** `tabindex` on a consumer's widgets is written to the DOM in an effect
  that re-runs when the visible rows or columns change, and is not part of React's rendered
  props; a widget a consumer mounts into a cell later (after the cell is on screen) keeps its
  own `tabindex` until the next such change.
- **Cell cache.** Each cell's `accessor` value and formatted text are read once per row object
  and column (reset when `columns` changes), because React re-renders every cell on every
  state change; the filter's search index, the sort keys and the rendered cells share it.
- **Persistence.** `storageKey` restores widths, hidden columns and sort in an effect after
  mount (so server rendering is unaffected) and writes only after that restore, so the first
  commit never overwrites a stored view with the defaults. A restored sort is applied through
  `onSortChange`; if `sort` is controlled, the consumer applies it.

## 8. Acceptance criteria

§8.1–§8.34 are the Svelte reference's clauses, each exercised in `DataGrid.test.tsx` with the
same section number. §8.7 reads "`onSelectionChange` fires with the new ids on every change"
(there is no two-way binding). React adds:

- §8.R1 With `selected` supplied the selection is controlled; with only `defaultSelected` it
  seeds the initial selection and the component owns it afterwards.
- §8.R2 `filter`/`defaultFilter`, `sort`/`defaultSort` and `page`/`defaultPage` behave the
  same way; `onFilterChange`, `onSortChange` and `onPageChange` fire on every change, and a
  filter change resets the page to 1 and reports it through `onPageChange`.
- §8.R3 Sorting reads each row's sort key once and a filter keystroke does not reformat
  cells (§8.18 holds across re-renders).

## 10. Relationship to the headless layer

Depends on `@lilydesignsystem/react-headless` ^0.4.0 as a regular dependency. In local
dev/test `vite.config.ts` aliases it to `../lily-design-system-react-headless/dist/`, so build
that first (`bin/list-helper-packages react`).

## Svelte 0.5.0 parity (2026-10-14)

Ported from the Svelte canonical spec (§12 there; clauses §8.40–§8.46): column reordering and pinned columns.

## Cell editing and virtualization (2026-10-16)

Ported from the Svelte canonical (its spec §13, tests §8.47–§8.56). React idioms: the editor is a controlled input whose draft lives in state, with a ref mirroring it synchronously so a blur that follows a commit in the same tick sees the edit already closed; the editor's focus is a stable callback ref that runs on mount only.

## Export to CSV, TSV and Excel (2026-10-16)

Ported from the Svelte canonical: see ../lily-design-system-svelte-data-grid/spec/excel-export/index.md (screen reader, IME, virtual scrolling) and its spec §14. `export-data.ts` is a byte-for-byte copy of the Svelte module and ships with its own 11 tests.

## Cell types (2026-10-16)

Ported from the Svelte canonical: the contract is ../lily-design-system-svelte-data-grid/spec/cell-types/index.md (tests §8.79–§8.97). Time with time zone, person, file, rollup and formulas are specified there but not implemented in either package.

## Remaining cell types (0.9.0) (2026-10-16)

Ported from the Svelte canonical: the contract is ../lily-design-system-svelte-data-grid/spec/cell-types/index.md (tests §8.98–§8.114). Every one of the twelve cell types is shipped in both packages.
