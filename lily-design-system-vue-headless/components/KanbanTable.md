# KanbanTable

A Kanban table organizes work items into columns representing different workflow stages such as "To Do", "In Progress", and "Done". Renders as a `<table>` with `role="grid"` and an accessible label. Supports an optional visible caption. Commonly used in project management tools, agile development platforms, and task tracking applications.

Compound component: use with KanbanTableHead, KanbanTableBody, KanbanTableFoot, KanbanTableRow, KanbanTableTD, and KanbanTableTD.

## Props

- `label`: string (required) -- accessible name for the kanban board via `aria-label`
- `caption`: string (optional) -- visible caption text displayed above the table
- `children`: Snippet (required) -- KanbanTableHead, KanbanTableBody, KanbanTableFoot elements
- `...restProps`: unknown -- additional attributes spread onto the `<table>`

## Usage

```svelte
<KanbanTable label="Sprint 5 board">
  <KanbanTableHead>
    <KanbanTableRow><th>To Do</th><th>In Progress</th><th>Done</th></KanbanTableRow>
  </KanbanTableHead>
  <KanbanTableBody>
    <KanbanTableRow>
      <KanbanTableTD>Task A</KanbanTableTD>
      <KanbanTableTD>Task B</KanbanTableTD>
      <KanbanTableTD>Task C</KanbanTableTD>
    </KanbanTableRow>
  </KanbanTableBody>
</KanbanTable>
```

## Accessibility

- `role="grid"` -- identifies the table as an interactive grid widget
- `aria-label={label}` -- provides an accessible name for the kanban board
- `<caption>` -- visible accessible name when the caption prop is set

## References

- WAI-ARIA Grid Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/grid/
