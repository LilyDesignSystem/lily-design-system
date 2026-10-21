# DataGrid (Alpine.js helper)

A headless interactive **data grid** for [Alpine.js](https://alpinejs.dev/): a plugin (`Alpine.data("lilyDataGrid", …)`) plus
`snippet.html`, the `role="grid"` table markup that uses it. It composes the same `DataTable` class hooks the headless catalog
ships and adds multi-column sort, a text filter, single or multiple row selection, pagination, column visibility, WAI-ARIA APG
grid keyboard navigation and export (CSV / TSV download, copy to clipboard). Ships no CSS and no text: every string is a
`labels.*` value, and a label's presence shows the control it names.

It is a subset of the canonical [`@lilydesignsystem/svelte-data-grid`](../lily-design-system-svelte-data-grid/), whose
[spec](../lily-design-system-svelte-data-grid/spec/index.md) is the contract. The subset and the gaps are in
[spec/index.md](spec/index.md).

## Usage

```html
<script type="module">
  import Alpine from "alpinejs";
  import lilyDataGrid from "@lilydesignsystem/alpine-data-grid";
  Alpine.plugin(lilyDataGrid);
  window.gridOptions = {
    columns: [
      { id: "name", header: "Name", sortable: true },
      { id: "email", header: "Email", hidable: true },
    ],
    rows: [{ id: "1", name: "Alice", email: "alice@example.com" }],
    rowId: "id",
    selectionMode: "multiple",
    pageSize: 25,
    labels: { grid: "Users", search: "Search users", selectAll: "Select all rows", selectRow: (name) => `Select ${name}` },
  };
  Alpine.start();
</script>
<!-- then paste snippet.html (importable as @lilydesignsystem/alpine-data-grid/snippet.html) -->
```

`createDataGrid(options)` returns the same state object without Alpine, for tests or server-side use.

## Events

Bubbling `CustomEvent`s on the grid: `lily:sort` (`{ sort }`), `lily:page` (`{ page }`), `lily:select` (`{ selected }`),
`lily:activate` (`{ id, row }`, Enter on a data cell).

## Keyboard

Only the active cell is in the tab order. Arrows move; Home / End go to the row's ends (Ctrl or Cmd: the grid's corners);
PageUp / PageDown move ten rows; right-to-left swaps the horizontal arrows. Enter or Space on a header sorts (Shift adds a sort
key); on the selection cell it toggles the row (the header's selects the page).

## Install

```sh
npm install @lilydesignsystem/alpine-data-grid alpinejs
```

Lily™ and Lily Design System™ are trademarks.
