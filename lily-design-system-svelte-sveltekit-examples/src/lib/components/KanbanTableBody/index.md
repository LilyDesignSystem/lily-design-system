# KanbanTableBody

## Overview

The body section of a KanbanTable, rendered as a <tbody> element.
Contains KanbanTableRow elements with task data cells.

## What it does

A kanban board table interactive grid tbody for organizing items by status <tbody>.

## When to use

- Use when you need a kanban board table interactive grid tbody for organizing items by status <tbody>.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<KanbanTableBody>
  <KanbanTableRow>
    <KanbanTableTD>Task A</KanbanTableTD>
    <KanbanTableTD>Task B</KanbanTableTD>
  </KanbanTableRow>
</KanbanTableBody>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `children` | Snippet, required | KanbanTableRow elements with data cells. |
| `...restProps` | additional HTML attributes spread onto the <tbody> |  |

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import KanbanTableBody from "$lib/components/KanbanTableBody/KanbanTableBody.svelte";
</script>

<KanbanTableBody>
  <KanbanTableRow>
    <KanbanTableTD>Task A</KanbanTableTD>
    <KanbanTableTD>Task B</KanbanTableTD>
  </KanbanTableRow>
</KanbanTableBody>
```

## Keyboard

- None built-in — keyboard navigation handled at the KanbanTable grid level.

## Accessibility

- <tbody> provides structural body semantics for the table

## References

- HTML tbody element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tbody
