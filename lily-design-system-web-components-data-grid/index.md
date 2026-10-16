# DataGrid (Web Components helper)

A reusable Web Components (an independent copy of the HTML data grid; tag `<lily-data-grid>`) headless **interactive data grid**. It composes
`@lilydesignsystem/web-components-headless`'s `DataTable` family — the same `role="grid"` container the headless catalog
ships, with zero behaviour built in — and adds sort, client-side filter, row selection, column
resize / visibility / reorder / pinning, pagination, WAI-ARIA APG Grid keyboard navigation,
inline cell editing, row virtualization, export to CSV / TSV / Excel and twelve cell types
(text, number, link, date, time, time with time zone, select, radio, person, file, rollup,
formula). Ships no CSS: every visual detail is the consumer's, via kebab-case class hooks.
Ported from the canonical [`@lilydesignsystem/svelte-data-grid`](../lily-design-system-svelte-data-grid/),
whose [spec](../lily-design-system-svelte-data-grid/spec/index.md) is the contract.

## Usage

```html
<lily-data-grid id="users" label="Users" selection-mode="multiple" page-size="25"></lily-data-grid>
<script type="module">
  import "@lilydesignsystem/web-components-data-grid";
  const grid = document.getElementById("users");
  grid.columns = [{ id: "name", header: "Name", sortable: true }, { id: "email", header: "Email" }];
  grid.rows = [{ name: "Alice", email: "alice@example.com" }];
  grid.labels = { search: "Search users", selectAll: "Select all rows", selectRow: (name) => `Select ${name}` };
  grid.addEventListener("selectionchange", (e) => console.log(e.detail));
</script>
```

## What is Web Components-specific

This is a maintainer-directed independent copy of `@lilydesignsystem/html-data-grid`, differing only in the tag (`lily-data-grid`, matching the Web Components headless catalog) and package name. Keep the two in step deliberately; nothing ports between them automatically. Properties, attributes, events and hooks are as in the HTML package.

Everything else — columns, labels, `rowId`, `selectionMode`, `pageSize`, `storageKey`, `mode`,
the keyboard model, the cell types, editing, export and virtualization — is as in the Svelte
reference. Every user-facing string is a `labels.*` prop (a label's presence gates the control it
names); nothing is hardcoded.

## Install

```sh
npm install @lilydesignsystem/web-components-data-grid
```

Requires `@lilydesignsystem/web-components-headless`.
