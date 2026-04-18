# KanbanTableHead

The header section of a KanbanTable, rendered as a `<thead>` element. Contains KanbanTableRow elements with column headers for workflow stages.

## Props

- `children`: Snippet (required) -- KanbanTableRow elements with header cells
- `...restProps`: unknown -- additional attributes spread onto the `<thead>`

## Usage

```svelte
<KanbanTableHead>
  <KanbanTableRow><th>To Do</th><th>In Progress</th><th>Done</th></KanbanTableRow>
</KanbanTableHead>
```

## References

- HTML thead element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/thead
