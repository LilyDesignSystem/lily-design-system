# DataGrid (HTML helper)

A reusable HTML (vanilla custom element, light DOM, no framework) headless **interactive data grid**. It composes
`@lilydesignsystem/html-headless`'s `DataTable` family — the same `role="grid"` container the headless catalog
ships, with zero behaviour built in — and adds sort, client-side filter, row selection, column
resize / visibility / reorder / pinning, pagination, WAI-ARIA APG Grid keyboard navigation,
inline cell editing, row virtualization, export to CSV / TSV / Excel and twelve cell types
(text, number, link, date, time, time with time zone, select, radio, person, file, rollup,
formula). Ships no CSS: every visual detail is the consumer's, via kebab-case class hooks.
Ported from the canonical [`@lilydesignsystem/svelte-data-grid`](../lily-design-system-svelte-data-grid/),
whose [spec](../lily-design-system-svelte-data-grid/spec/index.md) is the contract.

## Usage

```html
<data-grid id="users" label="Users" selection-mode="multiple" page-size="25"></data-grid>
<script type="module">
  import "@lilydesignsystem/html-data-grid";
  const grid = document.getElementById("users");
  grid.columns = [
    { id: "name", header: "Name", sortable: true, resizable: true },
    { id: "email", header: "Email", hidable: true },
  ];
  grid.rows = [{ name: "Alice", email: "alice@example.com" }, { name: "Bob", email: "bob@example.com" }];
  grid.labels = { search: "Search users", selectAll: "Select all rows", selectRow: (name) => `Select ${name}` };
  grid.addEventListener("selectionchange", (e) => console.log(e.detail));
</script>
```

## What is HTML-specific

| Svelte | HTML custom element |
| --- | --- |
| bindable `selected`, `filter`, `sort`, `columnOrder`, `page` | properties, plus the events `selectionchange`, `filterchange`, `sortchange`, `columnorderchange`, `pagechange` (`detail` is the new value) |
| `onCellEdit`, `onFilesSelected`, `onFileRemove`, `onRowActivate`, `onExport` | the same `on…` properties, and the events `celledit`, `filesselected`, `fileremove`, `rowactivate`, `exportfile`; `onExport` returning `false` stops the save |
| snippets (`empty`, `footer`, `cell`, `headerCell`, `avatar`, `personEditor`) | functions returning a `Node` or a string |
| `scroll` | `scrollable` property / `no-scroll` attribute (`scroll` is an `HTMLElement` method) |
| scalar props | attributes: `label`, `caption`, `selection-mode`, `page-size`, `storage-key`, `mode`, `busy`, `no-scroll`, `locale`, `export-filename`, `export-scope`, `export-formulas`, `activate-rows` |

Everything else — columns, labels, `rowId`, `selectionMode`, `pageSize`, `storageKey`, `mode`,
the keyboard model, the cell types, editing, export and virtualization — is as in the Svelte
reference. Every user-facing string is a `labels.*` prop (a label's presence gates the control it
names); nothing is hardcoded.

## Install

```sh
npm install @lilydesignsystem/html-data-grid
```

Requires `@lilydesignsystem/html-headless`.
