# DataGrid (React helper)

A reusable React 19 headless **interactive data grid**. It composes
`@lilydesignsystem/react-headless`'s `DataTable` family — the same
`role="grid"` container the headless catalog ships, with zero
behaviour built in — and adds sort, client-side filter, row selection,
column resize/visibility, pagination, and full WAI-ARIA APG Grid
keyboard navigation on top of it. Ships no CSS: every visual detail is
the consumer's, via kebab-case class hooks. Ported from the canonical
[`@lilydesignsystem/svelte-data-grid`](../lily-design-system-svelte-data-grid/).

## Usage

```tsx
import * as React from "react";
import DataGrid from "@lilydesignsystem/react-data-grid";
import type { DataGridColumn } from "@lilydesignsystem/react-data-grid";

const columns: DataGridColumn[] = [
  { id: "name", header: "Name", sortable: true, resizable: true },
  {
    id: "email",
    header: "Email",
    sortable: true,
    cell: ({ value, formatted }) => <a href={`mailto:${value}`}>{formatted}</a>,
  },
  { id: "role", header: "Role", sortable: true, hidable: true },
];

const rows = [
  { id: "u1", name: "Alice", email: "alice@example.com", role: "Admin" },
  { id: "u2", name: "Bob", email: "bob@example.com", role: "Editor" },
];

export function Accounts() {
  const [selected, setSelected] = React.useState<string[]>([]);
  return (
    <DataGrid
      label="User accounts"
      columns={columns}
      rows={rows}
      rowId={(row) => String(row.id)}
      selectionMode="multiple"
      selected={selected}
      onSelectionChange={setSelected}
      pageSize={25}
      storageKey="lily-user-grid"
      labels={{
        search: "Search accounts",
        columnVisibility: "Columns",
        columnVisibilityOption: (header) => `Show ${header}`,
        resizeHandle: (header) => `Resize ${header} column`,
        selectAll: "Select all rows",
        selectionColumn: "Select",
        selectRow: (label) => `Select ${label}`,
        previousPage: "Previous page",
        nextPage: "Next page",
        pageStatus: (page, pageCount, rowCount) =>
          `Page ${page} of ${pageCount} (${rowCount} rows)`,
        pageAnnouncement: (page, pageCount) => `Page ${page} of ${pageCount}`,
        sortAnnouncement: (header, direction) => `${header} sorted ${direction}`,
        filterAnnouncement: (matches, total) => `${matches} of ${total} rows match`,
        selectionAnnouncement: (count) => `${count} rows selected`,
      }}
    />
  );
}
```

Keep `columns` (and `rows`) stable between renders — define them outside the component or
memoise them: the grid caches each cell's value and formatted text per row and column, and a
new `columns` array rebuilds that cache.

## Props

See [spec/index.md §5](./spec/index.md#5-props) for the full table.
Required: `label`, `columns`, `rows`. Every optional `labels.*` field
gates the control it names — omit a label and that control simply
doesn't render (no baked-in English fallback).

## Behaviour

- **Sort**: single-column, tri-state (`ascending → descending → none`).
- **Filter**: client-side, case-insensitive substring match.
- **Selection**: `"none" | "single" | "multiple"`, controlled (`selected` / `onSelectionChange`) or uncontrolled (`defaultSelected`); `filter`, `sort` and `page` work the same way.
- **Resize**: pointer drag or arrow keys on the column's resize handle.
- **Visibility**: hiding a column removes its cells from the DOM.
- **Pagination**: client-side, via `pageSize`.
- **Keyboard**: WAI-ARIA APG Grid roving-tabindex — arrows move
  cell-to-cell and clamp, Home/End jump within the row,
  Ctrl+Home/Ctrl+End jump to the grid's ends, PageUp/PageDown page.
- **Row ids**: `rowId(row, index)` with `index` the row's position in
  `rows`, so ids survive sorting, filtering and paging. Pass a `rowId`
  that reads a real key if you replace `rows` with reordered data.
- **Cells**: a column's `cell` render prop receives `{ value, formatted,
  row, column }`; `format` still drives the filter.
- **Interactive cells**: a `cell` may hold links, buttons,
  inputs and selects. Keys pressed on such a widget are left alone
  (`Escape` returns focus to the cell); widgets are not tab stops until
  you `Enter` the cell, so Tab still leaves the grid in one step. `Enter`
  on a cell with no widget, or a click outside any widget, calls
  `onRowActivate(row, id)`.
- **Table mode**: `mode="table"` gives a plain `role="table"` with
  ordinary tab stops and no grid keyboard model — for data that is read,
  not navigated. Sort, filter, selection and paging work the same.
- **Column options**: `headerCell` (header content), `rowHeader`
  (`<th scope="row">`), `align`, `cellClass`, `cellAttrs`; grid props
  `rowClass`, `rowAttrs`, `empty`, `footer` (inside a `<tfoot>`), `busy`
  (`aria-busy`), and `scroll` (the named `data-grid-scroll` region, on by
  default).
- **Sort order**: pass a column `compare`, e.g.
  `new Intl.Collator(locale).compare`, for locale-aware text; the grid
  picks no locale.
- **Large data**: keep `rows` and `columns` referentially stable (see
  [spec/index.md §6](./spec/index.md#6-behaviour)). Sorting reads each
  key once and filtering reuses one search index across keystrokes.
- **Persistence**: `storageKey` persists column widths, hidden
  columns, and sort — never row data or selection.

## Non-goals (v1)

Virtualization/windowing, inline cell editing, column reorder, column
pinning, row grouping/aggregation, server-side sort/filter/pagination,
CSV export, drag-to-reorder rows. See
[spec/index.md §9](./spec/index.md#9-non-goals) for why each is out —
mostly because it requires real layout/scroll ownership that conflicts
with this package staying headless.

---

Lily™ and Lily Design System™ are trademarks.
