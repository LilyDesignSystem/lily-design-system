# KanbanTableTD

## Overview

A column definition within a KanbanTable, rendered as a <col> element.
Used inside a <colgroup> to define column properties such as width or
span for each workflow stage column. Does not render visible content.

## What it does

A kanban board table interactive grid column for organizing items by status <th>.

## When to use

- Use when you need a kanban board table interactive grid column for organizing items by status <th>.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<colgroup><KanbanTableTD /><KanbanTableTD /><KanbanTableTD /></colgroup>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `span` | number, optional | Number of columns this col element spans. |
| `...restProps` | additional HTML attributes spread onto the <col> |  |

## Examples

```svelte
<KanbanTable label="Board">
  <colgroup>
    <KanbanTableTD span={1} />
    <KanbanTableTD span={1} />
    <KanbanTableTD span={1} />
  </colgroup>
  ...
</KanbanTable>
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import KanbanTableTD from "$lib/components/KanbanTableTD/KanbanTableTD.svelte";
</script>

<colgroup><KanbanTableTD /><KanbanTableTD /><KanbanTableTD /></colgroup>
```

## Keyboard

- None — <col> is not interactive.

## Accessibility

- <col> provides structural column information for the table

## References

- HTML col element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/col
