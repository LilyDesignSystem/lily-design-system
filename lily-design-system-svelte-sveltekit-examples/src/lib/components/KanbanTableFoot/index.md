# KanbanTableFoot

## Overview

The footer section of a KanbanTable, rendered as a <tfoot> element.
Contains KanbanTableRow elements with summary or aggregate data cells.

## What it does

A kanban board table interactive grid tfoot for organizing items by status <tfoot>.

## When to use

- Use when you need a kanban board table interactive grid tfoot for organizing items by status <tfoot>.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<KanbanTableFoot>
  <KanbanTableRow>
    <KanbanTableData>Total: 3</KanbanTableData>
    <KanbanTableData>Total: 5</KanbanTableData>
  </KanbanTableRow>
</KanbanTableFoot>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `children` | Snippet, required | KanbanTableRow elements with footer cells. |
| `...restProps` | additional HTML attributes spread onto the <tfoot> |  |

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import KanbanTableFoot from "$lib/components/KanbanTableFoot/KanbanTableFoot.svelte";
</script>

<KanbanTableFoot>
  <KanbanTableRow>
    <KanbanTableData>Total: 3</KanbanTableData>
    <KanbanTableData>Total: 5</KanbanTableData>
  </KanbanTableRow>
</KanbanTableFoot>
```

## Keyboard

- None built-in — keyboard navigation handled at the KanbanTable grid level.

## Accessibility

- <tfoot> provides structural footer semantics for the table

## References

- HTML tfoot element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tfoot
