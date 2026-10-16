# DataGrid (Nunjucks helper)

A reusable Nunjucks (a macro that server-renders a readable table skeleton, plus a client runtime that makes it interactive) headless **interactive data grid**. It composes
`@lilydesignsystem/nunjucks-headless`'s `DataTable` family — the same `role="grid"` container the headless catalog
ships, with zero behaviour built in — and adds sort, client-side filter, row selection, column
resize / visibility / reorder / pinning, pagination, WAI-ARIA APG Grid keyboard navigation,
inline cell editing, row virtualization, export to CSV / TSV / Excel and twelve cell types
(text, number, link, date, time, time with time zone, select, radio, person, file, rollup,
formula). Ships no CSS: every visual detail is the consumer's, via kebab-case class hooks.
Ported from the canonical [`@lilydesignsystem/svelte-data-grid`](../lily-design-system-svelte-data-grid/),
whose [spec](../lily-design-system-svelte-data-grid/spec/index.md) is the contract.

## Usage

```njk
{% from "@lilydesignsystem/nunjucks-data-grid/template" import dataGrid %}
{{ dataGrid(
  "Users",
  [{ id: "name", header: "Name", sortable: true }, { id: "email", header: "Email" }],
  users,
  { search: "Search users", selectRow: "Select {rowLabel}", selectAll: "Select all rows" },
  selectionMode="multiple",
  pageSize=25
) }}
<script type="module">import "@lilydesignsystem/nunjucks-data-grid";</script>
```

## What is Nunjucks-specific

| Svelte | Nunjucks |
| --- | --- |
| label functions (`selectRow: (name) => …`) | template strings with `{placeholders}` named after the function's parameters, e.g. `"Select {rowLabel}"` |
| `accessor`, `cell`, `headerCell`, `footer`, `empty`, `rowClass`, `validate`, `parse`, callbacks | not available in a macro; columns are declarative (`type`, `options`, `format` options, …). Behaviour hooks are on the `<data-grid>` element `initDataGrid` returns, and its CustomEvents |
| the table | a plain `<table>` of raw cell values is rendered on the server and replaced by the interactive grid when the client runs |

Everything else — columns, labels, `rowId`, `selectionMode`, `pageSize`, `storageKey`, `mode`,
the keyboard model, the cell types, editing, export and virtualization — is as in the Svelte
reference. Every user-facing string is a `labels.*` prop (a label's presence gates the control it
names); nothing is hardcoded.

## Install

```sh
npm install @lilydesignsystem/nunjucks-data-grid
```

Requires `@lilydesignsystem/nunjucks-headless`.
