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
