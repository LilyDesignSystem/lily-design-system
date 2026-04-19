# KanbanTableRow

## Overview

A single row within a KanbanTable grid. Renders as a <tr> containing
KanbanTableData cells for each workflow column. Used inside
KanbanTableHead, KanbanTableBody, or KanbanTableFoot.

## What it does

A kanban board table interactive grid row for organizing items by status <tr>.

## When to use

- Use when you need a kanban board table interactive grid row for organizing items by status <tr>.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<KanbanTableRow><KanbanTableData>Task</KanbanTableData></KanbanTableRow>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `children` | Snippet, required | KanbanTableData cells and header cells. |
| `...restProps` | additional HTML attributes spread onto the <tr> |  |

## Examples

```svelte
<KanbanTableRow>
  <KanbanTableData>Task A</KanbanTableData>
  <KanbanTableData>Task B</KanbanTableData>
  <KanbanTableData>Task C</KanbanTableData>
</KanbanTableRow>
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import KanbanTableRow from "$lib/components/KanbanTableRow/KanbanTableRow.svelte";
</script>

<KanbanTableRow><KanbanTableData>Task</KanbanTableData></KanbanTableRow>
```

## Keyboard

- None built-in — keyboard navigation handled at the KanbanTable grid level.

## Accessibility

- <tr> has implicit role="row" (no explicit role needed)

## Internationalization

- All cell content comes through children snippet; no hardcoded strings

## References

- WAI-ARIA Grid Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/grid/
