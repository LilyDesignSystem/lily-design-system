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

## Filtering and sorting (0.10.0)

- **`rowFilter(row)`** hides rows it rejects, combining with the text `filter` (both must pass).
- **Multi-column sort**: `thenBy` (controlled when given, `defaultThenBy` otherwise, with `onThenByChange`) holds further sort keys after `sort`. Shift+click on another sortable header adds it (ascending → descending → off); a plain click sets `sort` alone and clears `thenBy`. Each sort is read once per row per key and ties fall to the next key; missing values still sort last. Headers carry `aria-sort` for every key and `data-sort-order` (1 = primary) while more than one key is set; `labels.sortAnnouncement` announces the change.

## Export: copy to clipboard (0.10.0)

- **Copy to clipboard**: `labels.copy` names a button (`data-…-export-format="copy"`; for the kanban board, Gantt chart and calendar it also needs `labels.exportHeaders`, like the downloads) that puts exactly what a download would hold — the same rows, scope and order, header row first — on the clipboard as tab-separated text (`toClipboardText`: no byte-order mark, formula text defused), ready to paste into a spreadsheet. `copyToClipboard` uses the async Clipboard API and falls back to a hidden, selected `<textarea>` with `execCommand("copy")`; it never throws. `labels.copyAnnouncement(rowCount)` is announced, `labels.copyFailed` when neither path worked, and `onCopy({ text, rowCount })` may return `false` to take over (nothing is copied).

## Keyboard: page keys and type-ahead (0.10.0)

- **Type-ahead**: letters typed in quick succession (within 700 ms) move the cursor to the next row whose cell text, in the column the cursor is in, starts with them (`findTypeaheadMatch`; the text is what the cell shows, ignoring case and diacritics). The same letter pressed again steps through the rows that start with it; a Ctrl, Alt or Meta key, and a prefix that matches nothing, do nothing. PageUp / PageDown already moved a page.

## In-place edit: validation, undo and redo (0.10.0)

- `validate` and `aria-invalid` on a refused cell were already there; undo and redo are new.
- **Undo and redo**: every accepted edit is remembered (the latest 100). Ctrl/Cmd+Z puts the earlier value back and Ctrl/Cmd+Shift+Z (or Ctrl+Y) re-applies one, both **through `onCellEdit`** with the restored value and the one it replaced — the consumer owns the data, so an undo is reported like an edit, and an undo is not itself recorded. A new edit ends the redo chain. Inside a field editor the browser's own undo is left alone; nothing happens in a read-only component or without `onCellEdit`. `labels.undoAnnouncement(header, text)` / `labels.redoAnnouncement(header, text)` are announced. The stacks are the pure `edit-history.ts` (`recordEdit`, `undoEdit`, `redoEdit`, `historyKey`).

## Defaults, locale, fields, labels and direction (0.10.0)

- **Empty values.** `emptyValue` (grid) and a column's own `emptyValue` give a missing value (`null`, `undefined` or `""`) visible text such as `"—"`; Lily ships none. The cell always carries `data-empty` for CSS, and an export is unaffected. `nulls` (`"last"` default, or `"first"`) says where missing values sort, in both directions.
- **Locale-aware sorting.** With a `locale` (or a column's own), plain text sorts with `Intl.Collator(locale, { numeric: true })` — "Item 2" before "Item 10", an accented letter with its base letter. Without a locale text sorts by code point, as before. A column's own `compare` always wins; typed columns keep their type's comparison.
- **Field-specific search.** `filterField` (controlled when given, `defaultFilterField` otherwise, `onFilterFieldChange`) limits the text filter to one column; `labels.searchField` (the select's name) with `labels.searchAllFields` (its first option) shows the select, listing the filterable columns. Without a field the whole row is searched.
- **`movableColumns`** makes every column movable (Alt+Arrow on the header, or drag), unless a column's `movable` is `false`.
- **Right-to-left.** The horizontal arrows are visual, so in a right-to-left layout (the nearest `dir`, else the computed direction) ArrowLeft goes to the next cell and ArrowRight to the previous, and Alt+Arrow moves a column the way the arrow points. Vertical keys, Home, End and the page keys do not change. The pure `isRtl` / `logicalKey` are exported.
- **Labels.** `DataGridLabels` is the one bundle of every string. What each feature needs is listed in `CONTROL_LABELS` (labels that *name a control*) and `ANNOUNCEMENT_LABELS` (live-region messages), and `requiredLabels(features)` / `missingLabels(features, labels)` compute it, so an app can assert in a test that its bundle for a locale is complete. In development the grid logs once, naming the labels its features call for that `labels` leaves out (`warnMissingLabels={false}` silences it; it never logs in production). Lily has no English fallback: a missing label is a control with no name or an announcement never made. `sortAnnouncement` receives the ARIA token (`ascending`, `descending`, `none`), which the bundle turns into its own words.
- **Row attributes.** `rowAttrs(row)` returns attributes spread onto each body row — the way to put test ids (`data-testid`), data attributes and other hooks on rows (`rowAttrs={(row) => ({ "data-testid": `row-${row.id}` })}`); `rowClass` does the same for classes, and a column's `cellAttrs` / `cellClass` for cells.

## Search (0.10.0)

`filter` (controlled when given; the field renders when `labels.search` names it) narrows the rows: every word must appear, in any order, ignoring case and diacritics. Every word must appear somewhere in the row (any order, any filterable cells), ignoring case and diacritics; `filterText` still sets a column's text. No match highlighting: cells are rendered by their cell type, so the grid marks nothing inside them. See spec §18.

## Non-goals (v1)

Virtualization/windowing, inline cell editing, column reorder, column
pinning, row grouping/aggregation, server-side sort/filter/pagination,
CSV export, drag-to-reorder rows. See
[spec/index.md §9](./spec/index.md#9-non-goals) for why each is out —
mostly because it requires real layout/scroll ownership that conflicts
with this package staying headless.

---

Lily™ and Lily Design System™ are trademarks.
