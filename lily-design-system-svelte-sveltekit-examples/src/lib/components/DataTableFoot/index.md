# DataTableFoot

## Overview

The footer section of a DataTable, rendered as a <tfoot> element.
Contains DataTableRow elements with summary or aggregate data cells.

## What it does

A data table interactive grid tfoot for displaying and sorting tabular data <tfoot>.

## When to use

- Use when you need a data table interactive grid tfoot for displaying and sorting tabular data <tfoot>.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<DataTableFoot>
  <DataTableRow>
    <DataTableData>Total</DataTableData>
    <DataTableData>$50,000</DataTableData>
  </DataTableRow>
</DataTableFoot>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `children` | Snippet, required | DataTableRow elements with footer cells. |
| `...restProps` | additional HTML attributes spread onto the <tfoot> |  |

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import DataTableFoot from "$lib/components/DataTableFoot/DataTableFoot.svelte";
</script>

<DataTableFoot>
  <DataTableRow>
    <DataTableData>Total</DataTableData>
    <DataTableData>$50,000</DataTableData>
  </DataTableRow>
</DataTableFoot>
```

## Keyboard

- None built-in — keyboard navigation handled at the DataTable grid level.

## Accessibility

- <tfoot> provides structural footer semantics for the table

## References

- HTML tfoot element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tfoot
