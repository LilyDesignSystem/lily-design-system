# DataTableHead

## Overview

The header section of a DataTable, rendered as a <thead> element.
Contains DataTableRow elements with column header cells.

## What it does

A data table interactive grid thead for displaying and sorting tabular data <thead>.

## When to use

- Use when you need a data table interactive grid thead for displaying and sorting tabular data <thead>.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<DataTableHead>
  <DataTableRow><th scope="col">Name</th><th scope="col">Email</th></DataTableRow>
</DataTableHead>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `children` | Snippet, required | DataTableRow elements with header cells. |
| `...restProps` | additional HTML attributes spread onto the <thead> |  |

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import DataTableHead from "$lib/components/DataTableHead/DataTableHead.svelte";
</script>

<DataTableHead>
  <DataTableRow><th scope="col">Name</th><th scope="col">Email</th></DataTableRow>
</DataTableHead>
```

## Keyboard

- None built-in — keyboard navigation handled at the DataTable grid level.

## Accessibility

- <thead> provides structural header semantics for the table

## References

- HTML thead element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/thead
