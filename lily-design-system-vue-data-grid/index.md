# DataGrid (Vue helper)

A reusable Vue 3 headless **interactive data grid**. It composes
`@lilydesignsystem/vue-headless`'s `DataTable` family — the same `role="grid"` container the headless catalog
ships, with zero behaviour built in — and adds sort, client-side filter, row selection, column
resize / visibility / reorder / pinning, pagination, WAI-ARIA APG Grid keyboard navigation,
inline cell editing, row virtualization, export to CSV / TSV / Excel and twelve cell types
(text, number, link, date, time, time with time zone, select, radio, person, file, rollup,
formula). Ships no CSS: every visual detail is the consumer's, via kebab-case class hooks.
Ported from the canonical [`@lilydesignsystem/svelte-data-grid`](../lily-design-system-svelte-data-grid/),
whose [spec](../lily-design-system-svelte-data-grid/spec/index.md) is the contract.

## Usage

```vue
<script setup lang="ts">
import { h, ref } from "vue";
import DataGrid from "@lilydesignsystem/vue-data-grid";
import type { DataGridColumn } from "@lilydesignsystem/vue-data-grid";

const columns: DataGridColumn[] = [
  { id: "name", header: "Name", sortable: true, resizable: true },
  { id: "email", header: "Email", sortable: true, cell: ({ value, formatted }) => h("a", { href: `mailto:${value}` }, formatted) },
  { id: "role", header: "Role", sortable: true, hidable: true },
];
const rows = [
  { name: "Alice", email: "alice@example.com", role: "Admin" },
  { name: "Bob", email: "bob@example.com", role: "Editor" },
];
const selected = ref<string[]>([]);
const labels = { search: "Search users", selectAll: "Select all rows", selectRow: (name: string) => `Select ${name}` };
</script>

<template>
  <DataGrid label="Users" :columns="columns" :rows="rows" selection-mode="multiple" v-model:selected="selected" :labels="labels" />
</template>
```

## What is Vue-specific

| Svelte | Vue |
| --- | --- |
| `selected`, `filter`, `sort`, `columnOrder`, `page` (bindable) | `v-model:selected`, `v-model:filter`, `v-model:sort`, `v-model:columnOrder`, `v-model:page` |
| `onSelectionChange`, `onFilterChange`, `onSortChange`, `onColumnOrderChange` | the matching `update:` events of those models |
| `onCellEdit`, `onFilesSelected`, `onFileRemove`, `onRowActivate` | the events `cell-edit`, `files-selected`, `file-remove`, `row-activate` (Enter on a cell activates its row only when a `row-activate` listener is attached) |
| `onExport` (return `false` to stop the save) | the `exportHandler` prop (return `false`) and the `export-file` event |
| `empty: Snippet`, `footer: Snippet<[{ columns, rows }]>` | the `empty` slot and the `footer` slot (props `columns`, `rows`) |
| column `cell`, `headerCell`, `avatar`, `personEditor` snippets | functions returning a vnode (`h()`) |
| `class` | `class` (falls through to the root `<div>`) |

Everything else — columns, labels, `rowId`, `selectionMode`, `pageSize`, `storageKey`, `mode`,
the keyboard model, the cell types, editing, export and virtualization — is as in the Svelte
reference. Every user-facing string is a `labels.*` prop (a label's presence gates the control it
names); nothing is hardcoded.

## Install

```sh
npm install @lilydesignsystem/vue-data-grid
```

Requires `@lilydesignsystem/vue-headless`.
