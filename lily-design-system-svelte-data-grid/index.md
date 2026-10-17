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
    { id: "email", header: "Email", sortable: true, cell: emailCell },
    { id: "role", header: "Role", sortable: true, hidable: true },
  ];

  // $state.raw: the grid never mutates rows, so skip the deep proxy.
  // Update by assigning a new array, e.g. rows = [...rows, newRow].
  let rows = $state.raw([
    { id: "u1", name: "Alice", email: "alice@example.com", role: "Admin" },
    { id: "u2", name: "Bob", email: "bob@example.com", role: "Editor" },
  ]);

  let selected = $state<string[]>([]);
</script>

{#snippet emailCell({ value, formatted })}
  <a href={`mailto:${value}`}>{formatted}</a>
{/snippet}

<DataGrid
  label="User accounts"
  {columns}
  {rows}
  rowId={(row) => String(row.id)}
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
    pageAnnouncement: (page, pageCount) => `Page ${page} of ${pageCount}`,
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
- **Row ids**: `rowId(row, index)` with `index` the row's position in
  `rows`, so ids survive sorting, filtering and paging. Pass a `rowId`
  that reads a real key if you replace `rows` with reordered data.
- **Cells**: a column's `cell` snippet receives `{ value, formatted,
  row, column }`; `format` still drives the filter.
- **Interactive cells**: a `cell` snippet may hold links, buttons,
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
- **Large data**: hold `rows` in `$state.raw` (see
  [spec/index.md §6](./spec/index.md#6-behaviour)). Sorting reads each
  key once and filtering reuses one search index across keystrokes.
- **Persistence**: `storageKey` persists column widths, hidden
  columns, and sort — never row data or selection.

## Filtering and sorting (0.10.0)

- **`rowFilter(row)`** hides rows it rejects, combining with the text `filter` (both must pass).
- **Multi-column sort**: `thenBy` (bindable, with `onThenByChange`) holds further sort keys after `sort`. Shift+click on another sortable header adds it (ascending → descending → off); a plain click sets `sort` alone and clears `thenBy`. Each sort is read once per row per key and ties fall to the next key; missing values still sort last. Headers carry `aria-sort` for every key and `data-sort-order` (1 = primary) while more than one key is set; `labels.sortAnnouncement` announces the change.

## Search (0.10.0)

`search` (bindable; the field renders when `labels.search` names it) narrows the rows: every word must appear, in any order, ignoring case and diacritics. Every word must appear somewhere in the row (any order, any filterable cells), ignoring case and diacritics; `filterText` still sets a column's text. No match highlighting: cells are rendered by their cell type, so the grid marks nothing inside them. See spec §18.

## Non-goals (v1)

Virtualization/windowing, inline cell editing, column reorder, column
pinning, row grouping/aggregation, server-side sort/filter/pagination,
CSV export, drag-to-reorder rows. See
[spec/index.md §9](./spec/index.md#9-non-goals) for why each is out —
mostly because it requires real layout/scroll ownership that conflicts
with this package staying headless.

---

Lily™ and Lily Design System™ are trademarks.
