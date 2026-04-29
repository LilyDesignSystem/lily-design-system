# KanbanTableRow

A Kanban table row is a single row within a KanbanTable grid. Renders as a `<tr>` containing KanbanTableTD cells for each workflow column.

## Props

- `children`: Snippet (required) -- KanbanTableTD cells and header cells
- `...restProps`: unknown -- additional attributes spread onto the `<tr>`

## Usage

```svelte
<KanbanTableRow>
  <KanbanTableTD>Task A</KanbanTableTD>
  <KanbanTableTD>Task B</KanbanTableTD>
</KanbanTableRow>
```

## ARIA

- `<tr>` has implicit `role="row"` (no explicit role needed)

## References

- WAI-ARIA Grid Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/grid/
