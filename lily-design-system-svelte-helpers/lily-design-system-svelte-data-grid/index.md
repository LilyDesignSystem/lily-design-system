# DataGrid (Svelte helper)

A reusable Svelte 5 headless **interactive data grid**. It composes
`@lilydesignsystem/svelte-headless`'s `DataTable` family — the same
`role="grid"` container the headless catalog ships, with zero
behaviour built in — and adds sort, client-side filter, row selection,
column resize/visibility, pagination, and full WAI-ARIA APG Grid
keyboard navigation on top of it. Ships no CSS: every visual detail is
the consumer's, via kebab-case class hooks.

Unlike `theme-picker`/`locale-picker`/`text-size-picker`/`motion-picker`,
this is not a page-header preference control — it is the first Lily
helper that depends on the headless layer rather than being
self-contained, composing `DataTable` the way `picker-bar` composes
its four wrapped pickers.

## Usage

```svelte
<script lang="ts">
  import DataGrid from "@lilydesignsystem/svelte-data-grid";
  import type { DataGridColumn } from "@lilydesignsystem/svelte-data-grid";

  const columns: DataGridColumn[] = [
    { id: "name", header: "Name", sortable: true, resizable: true },
    { id: "email", header: "Email", sortable: true },
    { id: "role", header: "Role", sortable: true, hidable: true },
  ];

  const rows = [
    { name: "Alice", email: "alice@example.com", role: "Admin" },
    { name: "Bob", email: "bob@example.com", role: "Editor" },
  ];

  let selected = $state<string[]>([]);
</script>

<DataGrid
  label="User accounts"
  {columns}
  {rows}
  selectionMode="multiple"
  bind:selected
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
    sortAnnouncement: (header, direction) => `${header} sorted ${direction}`,
    filterAnnouncement: (matches, total) => `${matches} of ${total} rows match`,
    selectionAnnouncement: (count) => `${count} rows selected`,
  }}
/>
```

## Props

See [spec/index.md §5](./spec/index.md#5-props) for the full table.
Required: `label`, `columns`, `rows`. Every optional `labels.*` field
gates the control it names — omit a label and that control simply
doesn't render (no baked-in English fallback).

## Behaviour

- **Sort**: single-column, tri-state (`ascending → descending → none`).
- **Filter**: client-side, case-insensitive substring match.
- **Selection**: `"none" | "single" | "multiple"`, two-way bindable.
- **Resize**: pointer drag or arrow keys on the column's resize handle.
- **Visibility**: hiding a column removes its cells from the DOM.
- **Pagination**: client-side, via `pageSize`.
- **Keyboard**: WAI-ARIA APG Grid roving-tabindex — arrows move
  cell-to-cell and clamp, Home/End jump within the row,
  Ctrl+Home/Ctrl+End jump to the grid's ends, PageUp/PageDown page.
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
