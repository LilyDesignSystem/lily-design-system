# DataGrid (Angular helper)

A reusable Angular (standalone, signals) headless **interactive data grid**. It composes
`@lilydesignsystem/angular-headless`'s `DataTable` family — the same `role="grid"` container the headless catalog
ships, with zero behaviour built in — and adds sort, client-side filter, row selection, column
resize / visibility / reorder / pinning, pagination, WAI-ARIA APG Grid keyboard navigation,
inline cell editing, row virtualization, export to CSV / TSV / Excel and twelve cell types
(text, number, link, date, time, time with time zone, select, radio, person, file, rollup,
formula). Ships no CSS: every visual detail is the consumer's, via kebab-case class hooks.
Ported from the canonical [`@lilydesignsystem/svelte-data-grid`](../lily-design-system-svelte-data-grid/),
whose [spec](../lily-design-system-svelte-data-grid/spec/index.md) is the contract.

## Usage

```ts
import { Component } from "@angular/core";
import { DataGrid, type DataGridColumn } from "@lilydesignsystem/angular-data-grid";

@Component({
  selector: "app-users",
  standalone: true,
  imports: [DataGrid],
  template: `<lily-data-grid label="Users" [columns]="columns" [rows]="rows" selectionMode="multiple" [(selected)]="selected" [labels]="labels" />`,
})
export class UsersComponent {
  columns: DataGridColumn[] = [
    { id: "name", header: "Name", sortable: true, resizable: true },
    { id: "email", header: "Email", sortable: true },
    { id: "role", header: "Role", sortable: true, hidable: true },
  ];
  rows = [
    { name: "Alice", email: "alice@example.com", role: "Admin" },
    { name: "Bob", email: "bob@example.com", role: "Editor" },
  ];
  selected: string[] = [];
  labels = { search: "Search users", selectAll: "Select all rows", selectRow: (name: string) => `Select ${name}` };
}
```

## What is Angular-specific

| Svelte | Angular |
| --- | --- |
| `selected`, `filter`, `sort`, `columnOrder`, `page` (bindable) | `model()`s: `[(selected)]`, `[(filter)]`, `[(sort)]`, `[(columnOrder)]`, `[(page)]` |
| `onCellEdit`, `onFilesSelected`, `onFileRemove`, `onRowActivate`, `onExport` | the outputs `cellEdit`, `filesSelected`, `fileRemove`, `rowActivate`, `exportFile`, and the `exportHandler` input (return `false` to stop the save). An output cannot be tested for a listener, so Enter / a click activates a row only when `[activateRows]="true"` |
| `empty`, `footer`, column `cell`, `headerCell`, `avatar`, `personEditor` snippets | `TemplateRef`s: the `empty` and `footer` inputs, and the column's `cell`, `headerCell`, `avatar`, `personEditor` (the context is `$implicit`) |
| rest props on the root | the root `<div class="data-grid">` is inside the `<lily-data-grid>` host; put extra attributes on the host, and `className` on the root |
| `rowAttrs`, column `cellAttrs` | the same inputs, applied through the `lilyDataGridAttrs` directive |
| `class` | `className` |

Everything else — columns, labels, `rowId`, `selectionMode`, `pageSize`, `storageKey`, `mode`,
the keyboard model, the cell types, editing, export and virtualization — is as in the Svelte
reference. Every user-facing string is a `labels.*` prop (a label's presence gates the control it
names); nothing is hardcoded.

## Install

```sh
npm install @lilydesignsystem/angular-data-grid
```

Requires `@lilydesignsystem/angular-headless`.

## Filtering and sorting (0.10.0)

- **`rowFilter(row)`** hides rows it rejects, combining with the text `filter` (both must pass).
- **Multi-column sort**: `thenBy` (a `model()`, with `onThenByChange`) holds further sort keys after `sort`. Shift+click on another sortable header adds it (ascending → descending → off); a plain click sets `sort` alone and clears `thenBy`. Each sort is read once per row per key and ties fall to the next key; missing values still sort last. Headers carry `aria-sort` for every key and `data-sort-order` (1 = primary) while more than one key is set; `labels.sortAnnouncement` announces the change.

## Export: copy to clipboard (0.10.0)

- **Copy to clipboard**: `labels.copy` names a button (`data-…-export-format="copy"`; for the kanban board, Gantt chart and calendar it also needs `labels.exportHeaders`, like the downloads) that puts exactly what a download would hold — the same rows, scope and order, header row first — on the clipboard as tab-separated text (`toClipboardText`: no byte-order mark, formula text defused), ready to paste into a spreadsheet. `copyToClipboard` uses the async Clipboard API and falls back to a hidden, selected `<textarea>` with `execCommand("copy")`; it never throws. `labels.copyAnnouncement(rowCount)` is announced, `labels.copyFailed` when neither path worked, and the `copy` output and `copyHandler({ text, rowCount })` may return `false` to take over (nothing is copied).

## Keyboard: page keys and type-ahead (0.10.0)

- **Type-ahead**: letters typed in quick succession (within 700 ms) move the cursor to the next row whose cell text, in the column the cursor is in, starts with them (`findTypeaheadMatch`; the text is what the cell shows, ignoring case and diacritics). The same letter pressed again steps through the rows that start with it; a Ctrl, Alt or Meta key, and a prefix that matches nothing, do nothing. PageUp / PageDown already moved a page.

## In-place edit: validation, undo and redo (0.10.0)

- `validate` and `aria-invalid` on a refused cell were already there; undo and redo are new.
- **Undo and redo**: every accepted edit is remembered (the latest 100). Ctrl/Cmd+Z puts the earlier value back and Ctrl/Cmd+Shift+Z (or Ctrl+Y) re-applies one, both **through the `cellEdit` output** with the restored value and the one it replaced — the consumer owns the data, so an undo is reported like an edit, and an undo is not itself recorded. A new edit ends the redo chain. Inside a field editor the browser's own undo is left alone; nothing happens in a `readonly` component or without the `cellEdit` output. `labels.undoAnnouncement(header, text)` / `labels.redoAnnouncement(header, text)` are announced. The stacks are the pure `edit-history.ts` (`recordEdit`, `undoEdit`, `redoEdit`, `historyKey`).

## Defaults, locale, fields, labels and direction (0.10.0)

- **Empty values.** `emptyValue` (grid) and a column's own `emptyValue` give a missing value (`null`, `undefined` or `""`) visible text such as `"—"`; Lily ships none. The cell always carries `data-empty` for CSS, and an export is unaffected. `nulls` (`"last"` default, or `"first"`) says where missing values sort, in both directions.
- **Locale-aware sorting.** With a `locale` (or a column's own), plain text sorts with `Intl.Collator(locale, { numeric: true })` — "Item 2" before "Item 10", an accented letter with its base letter. Without a locale text sorts by code point, as before. A column's own `compare` always wins; typed columns keep their type's comparison.
- **Field-specific search.** `filterField` (a `model()`, `onFilterFieldChange`) limits the text filter to one column; `labels.searchField` (the select's name) with `labels.searchAllFields` (its first option) shows the select, listing the filterable columns. Without a field the whole row is searched.
- **`movableColumns`** makes every column movable (Alt+Arrow on the header, or drag), unless a column's `movable` is `false`.
- **Right-to-left.** The horizontal arrows are visual, so in a right-to-left layout (the nearest `dir`, else the computed direction) ArrowLeft goes to the next cell and ArrowRight to the previous, and Alt+Arrow moves a column the way the arrow points. Vertical keys, Home, End and the page keys do not change. The pure `isRtl` / `logicalKey` are exported.
- **Labels.** `DataGridLabels` is the one bundle of every string. What each feature needs is listed in `CONTROL_LABELS` (labels that *name a control*) and `ANNOUNCEMENT_LABELS` (live-region messages), and `requiredLabels(features)` / `missingLabels(features, labels)` compute it, so an app can assert in a test that its bundle for a locale is complete. In development the grid logs once, naming the labels its features call for that `labels` leaves out (`warnMissingLabels={false}` silences it; it never logs in production). Lily has no English fallback: a missing label is a control with no name or an announcement never made. `sortAnnouncement` receives the ARIA token (`ascending`, `descending`, `none`), which the bundle turns into its own words.
- **Row attributes.** `rowAttrs(row)` returns attributes spread onto each body row — the way to put test ids (`data-testid`), data attributes and other hooks on rows (`rowAttrs={(row) => ({ "data-testid": `row-${row.id}` })}`); `rowClass` does the same for classes, and a column's `cellAttrs` / `cellClass` for cells.

## Pager landmark (0.10.0)

`labels.pagination` names the pager: it then renders as a `<nav>` landmark (the headless `PaginationNav`, keeping the `data-grid-pagination` class) instead of a plain `<div>`, so a screen-reader user can jump to it. Optional — without it nothing changes.

## Search (0.10.0)

`search` (a `model()`; the field renders when `labels.search` names it) narrows the rows: every word must appear, in any order, ignoring case and diacritics. Every word must appear somewhere in the row (any order, any filterable cells), ignoring case and diacritics; `filterText` still sets a column's text. No match highlighting: cells are rendered by their cell type, so the grid marks nothing inside them. See spec §18.
