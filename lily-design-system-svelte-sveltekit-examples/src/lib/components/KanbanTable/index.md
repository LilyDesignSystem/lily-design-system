# KanbanTable

## Overview

A headless Kanban board that organizes work items into columns representing
different workflow stages such as "To Do", "In Progress", and "Done". Renders
as a <table> element with role="grid" and an accessible label. Commonly used
in project management tools, agile development platforms, and task tracking.

## What it does

A kanban board table interactive grid for organizing items by status <table>.

## When to use

- Use to display structured tabular data with headers and rows.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<KanbanTable label="Sprint 5 board">...</KanbanTable>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, required | Accessible name describing the board via aria-label. |
| `caption` | string, optional | Visible caption text displayed above the table. |
| `children` | Snippet, required | KanbanTableHead, KanbanTableBody, KanbanTableFoot elements. |
| `...restProps` | additional HTML attributes spread onto the <table> |  |

## Examples

```svelte
<KanbanTable label="Sprint 5 board">
  <KanbanTableHead>
    <KanbanTableRow>
      <th>To Do</th><th>In Progress</th><th>Done</th>
    </KanbanTableRow>
  </KanbanTableHead>
  <KanbanTableBody>
    <KanbanTableRow>
      <KanbanTableData>Task A</KanbanTableData>
      <KanbanTableData>Task B</KanbanTableData>
      <KanbanTableData>Task C</KanbanTableData>
    </KanbanTableRow>
  </KanbanTableBody>
</KanbanTable>
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import KanbanTable from "$lib/components/KanbanTable/KanbanTable.svelte";
</script>

<KanbanTable label="Sprint 5 board">...</KanbanTable>
```

## Keyboard

- None built-in — consumer should implement grid keyboard navigation
- (arrow keys for cell movement, Enter/Space for selection).

## Accessibility

- role="grid" identifies the table as an interactive grid widget
- aria-label provides an accessible name for the kanban board

## Internationalization

- The label prop accepts any translated string
- No hardcoded user-facing strings

## References

- WAI-ARIA Grid Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/grid/
