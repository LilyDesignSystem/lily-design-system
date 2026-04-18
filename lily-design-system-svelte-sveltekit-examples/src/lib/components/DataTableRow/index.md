# DataTableRow

## Overview

A single row within a DataTable. Renders as a <tr> containing
DataTableData cells or header cells. Used inside DataTableHead,
DataTableBody, or DataTableFoot.

## What it does

A data table interactive grid row for displaying and sorting tabular data <tr>.

## When to use

- Use when you need a data table interactive grid row for displaying and sorting tabular data <tr>.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<DataTableRow>
  <DataTableData>Alice</DataTableData>
  <DataTableData>alice@example.com</DataTableData>
</DataTableRow>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `children` | Snippet, required | DataTableData cells or header cells for this row. |
| `...restProps` | additional HTML attributes spread onto the <tr> |  |

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import DataTableRow from "$lib/components/DataTableRow/DataTableRow.svelte";
</script>

<DataTableRow>
  <DataTableData>Alice</DataTableData>
  <DataTableData>alice@example.com</DataTableData>
</DataTableRow>
```

## Keyboard

- None built-in — keyboard navigation handled at the DataTable grid level.

## Accessibility

- <tr> has implicit role="row" (no explicit role needed)

## References

- HTML tr element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tr
