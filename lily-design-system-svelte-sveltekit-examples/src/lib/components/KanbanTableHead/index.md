# KanbanTableHead

## Overview

The header section of a KanbanTable, rendered as a <thead> element.
Contains KanbanTableRow elements with column headers for workflow stages.

## What it does

A kanban board table interactive grid thead for organizing items by status <thead>.

## When to use

- Use when you need a kanban board table interactive grid thead for organizing items by status <thead>.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<KanbanTableHead>
  <KanbanTableRow><th>To Do</th><th>In Progress</th><th>Done</th></KanbanTableRow>
</KanbanTableHead>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `children` | Snippet, required | KanbanTableRow elements with header cells. |
| `...restProps` | additional HTML attributes spread onto the <thead> |  |

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import KanbanTableHead from "$lib/components/KanbanTableHead/KanbanTableHead.svelte";
</script>

<KanbanTableHead>
  <KanbanTableRow><th>To Do</th><th>In Progress</th><th>Done</th></KanbanTableRow>
</KanbanTableHead>
```

## Keyboard

- None built-in — keyboard navigation handled at the KanbanTable grid level.

## Accessibility

- <thead> provides structural header semantics for the table

## References

- HTML thead element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/thead
