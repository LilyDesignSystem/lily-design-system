# KanbanTableRow

A Kanban table row is a single row within a KanbanTable grid. Renders as a `<tr>` containing KanbanTableData cells for each workflow column.

## Props

- `children`: Snippet (required) -- KanbanTableData cells and header cells
- `...restProps`: unknown -- additional attributes spread onto the `<tr>`

## Usage

```svelte
<KanbanTableRow>
  <KanbanTableData>Task A</KanbanTableData>
  <KanbanTableData>Task B</KanbanTableData>
</KanbanTableRow>
```

## ARIA

- `<tr>` has implicit `role="row"` (no explicit role needed)

## References

- WAI-ARIA Grid Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/grid/
