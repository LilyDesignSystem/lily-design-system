# DataTableBody

## Overview

The body section of a DataTable, rendered as a <tbody> element.
Contains DataTableRow elements with data cells.

## What it does

A data table interactive grid tbody for displaying and sorting tabular data <tbody>.

## When to use

- Use when you need a data table interactive grid tbody for displaying and sorting tabular data <tbody>.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<DataTableBody>
  <DataTableRow>
    <DataTableData>Alice</DataTableData>
    <DataTableData>alice@example.com</DataTableData>
  </DataTableRow>
</DataTableBody>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `children` | Snippet, required | DataTableRow elements with data cells. |
| `...restProps` | additional HTML attributes spread onto the <tbody> |  |

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import DataTableBody from "$lib/components/DataTableBody/DataTableBody.svelte";
</script>

<DataTableBody>
  <DataTableRow>
    <DataTableData>Alice</DataTableData>
    <DataTableData>alice@example.com</DataTableData>
  </DataTableRow>
</DataTableBody>
```

## Keyboard

- None built-in — keyboard navigation handled at the DataTable grid level.

## Accessibility

- <tbody> provides structural body semantics for the table

## References

- HTML tbody element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tbody
