# DataTable

## Overview

An interactive data table that displays structured information in rows and
columns as a grid widget. Renders a <table> element with role="grid" and an
accessible label. Supports an optional visible caption. Commonly used for
sortable tables, editable spreadsheets, and interactive data grids.

## What it does

A data table interactive grid for displaying and sorting tabular data <table>.

## When to use

- Use when you need a data table interactive grid for displaying and sorting tabular data <table>.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<DataTable label="User accounts">
  <DataTableHead><DataTableRow><th scope="col">Name</th></DataTableRow></DataTableHead>
  <DataTableBody><DataTableRow><DataTableData>Alice</DataTableData></DataTableRow></DataTableBody>
</DataTable>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, required | Accessible name describing the table content. |
| `caption` | string, optional | Visible caption text displayed above the table. |
| `children` | Snippet, required | DataTableHead, DataTableBody, DataTableFoot elements. |
| `...restProps` | additional HTML attributes spread onto the <table> |  |

## Examples

```svelte
<!-- Table with visible caption -->
<DataTable label="Sales data" caption="Quarterly sales">
  <DataTableHead>
    <DataTableRow><th scope="col">Month</th><th scope="col">Revenue</th></DataTableRow>
  </DataTableHead>
  <DataTableBody>
    <DataTableRow><DataTableData>January</DataTableData><DataTableData>$10,000</DataTableData></DataTableRow>
  </DataTableBody>
</DataTable>
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import DataTable from "$lib/components/DataTable/DataTable.svelte";
</script>

<DataTable label="User accounts">
  <DataTableHead><DataTableRow><th scope="col">Name</th></DataTableRow></DataTableHead>
  <DataTableBody><DataTableRow><DataTableData>Alice</DataTableData></DataTableRow></DataTableBody>
</DataTable>
```

## Keyboard

- None built-in — consumer should implement grid keyboard navigation
- (arrow keys for cell movement, Enter/Space for selection).

## Accessibility

- role="grid" identifies the table as an interactive grid widget
- aria-label provides an accessible name describing the table content
- <caption> provides a visible accessible name when the caption prop is set

## Internationalization

- The label and caption props provide all text; no hardcoded strings
- All cell content is provided by consumers through children

## References

- WAI-ARIA Grid Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/grid/
