# KanbanTableData

## Overview

A single cell within a KanbanTableRow, rendered as a <td> with role="gridcell".
Represents a task card or content area within a workflow column. Supports an
optional accessible label for screen reader identification.

## What it does

Kanban board table interactive grid data cell for organizing items by status <td>.

## When to use

- Use when you need kanban board table interactive grid data cell for organizing items by status <td>.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<KanbanTableData>Task content</KanbanTableData>
<KanbanTableData active label="Design task">...</KanbanTableData>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `active` | boolean, optional | Marks the cell as currently active/selected. |
| `label` | string, optional | Accessible name for the cell via aria-label. |
| `children` | Snippet, optional | Cell content such as task cards or text. |
| `...restProps` | additional HTML attributes spread onto the <td> |  |

## Examples

```svelte
<KanbanTableRow>
  <KanbanTableData label="Fix login bug">Fix login bug</KanbanTableData>
  <KanbanTableData />
  <KanbanTableData />
</KanbanTableRow>
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import KanbanTableData from "$lib/components/KanbanTableData/KanbanTableData.svelte";
</script>

<KanbanTableData>Task content</KanbanTableData>
<KanbanTableData active label="Design task">...</KanbanTableData>
```

## Keyboard

- None built-in — keyboard navigation handled at the KanbanTable grid level.

## Accessibility

- role="gridcell" identifies the cell as part of a grid
- aria-selected indicates the active/selected state when active is true
- tabindex enables roving tabindex (0 when active, -1 otherwise)
- aria-label optionally provides an accessible name for the cell

## Internationalization

- Cell content comes through children snippet; no hardcoded strings

## References

- WAI-ARIA Grid Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/grid/
