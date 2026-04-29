# DataTableTD

## Overview

A column definition within a DataTable, rendered as a <col> element.
Used inside a <colgroup> to define column properties such as span.
Useful for styling entire columns of the data table.

## What it does

A data table interactive grid column for displaying and sorting tabular data <th>.

## When to use

- Use when you need a data table interactive grid column for displaying and sorting tabular data <th>.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<colgroup>
  <DataTableTD />
  <DataTableTD span={3} />
</colgroup>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `span` | number, optional | Number of columns this <col> spans. |
| `...restProps` | additional HTML attributes spread onto the <col> |  |

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import DataTableTD from "$lib/components/DataTableTD/DataTableTD.svelte";
</script>

<colgroup>
  <DataTableTD />
  <DataTableTD span={3} />
</colgroup>
```

## Keyboard

- None — <col> is not interactive.

## Accessibility

- <col> provides structural column semantics for the table

## References

- HTML col element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/col
