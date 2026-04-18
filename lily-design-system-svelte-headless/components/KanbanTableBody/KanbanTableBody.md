# KanbanTableBody

The body section of a KanbanTable, rendered as a `<tbody>` element. Contains KanbanTableRow elements with task data cells.

## Props

- `children`: Snippet (required) -- KanbanTableRow elements with data cells
- `...restProps`: unknown -- additional attributes spread onto the `<tbody>`

## Usage

```svelte
<KanbanTableBody>
  <KanbanTableRow>
    <KanbanTableData>Task A</KanbanTableData>
    <KanbanTableData>Task B</KanbanTableData>
  </KanbanTableRow>
</KanbanTableBody>
```

## References

- HTML tbody element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tbody
