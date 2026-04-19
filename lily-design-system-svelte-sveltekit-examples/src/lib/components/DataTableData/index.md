# DataTableData

## Overview

A single data cell within a DataTableRow. Renders as a <td> with
role="gridcell". Supports an active state for indicating the currently
focused or selected cell, communicated via aria-selected for screen
readers. Uses a roving tabindex pattern.

## What it does

A data table interactive grid data cell for displaying and sorting tabular data <td>.

## When to use

- Use when you need a data table interactive grid data cell for displaying and sorting tabular data <td>.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<DataTableData>Alice</DataTableData>
<DataTableData active>Bob</DataTableData>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `active` | boolean, default false | Whether this cell is active/selected. |
| `children` | Snippet, required | Cell content. |
| `...restProps` | additional HTML attributes spread onto the <td> |  |

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import DataTableData from "$lib/components/DataTableData/DataTableData.svelte";
</script>

<DataTableData>Alice</DataTableData>
<DataTableData active>Bob</DataTableData>
```

## Keyboard

- None built-in — keyboard navigation handled at the DataTable grid level.

## Accessibility

- role="gridcell" identifies the cell as part of an interactive grid
- aria-selected set to true when active; omitted otherwise
- Roving tabindex: tabindex="0" when active, "-1" otherwise

## References

- WAI-ARIA Grid Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/grid/
