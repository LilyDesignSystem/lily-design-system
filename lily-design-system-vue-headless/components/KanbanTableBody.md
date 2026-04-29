# KanbanTableBody

The body section of a KanbanTable, rendered as a `<tbody>` element. Contains KanbanTableRow elements with task data cells.

## Props

- `children`: Snippet (required) -- KanbanTableRow elements with data cells
- `...restProps`: unknown -- additional attributes spread onto the `<tbody>`

## Usage

```svelte
<KanbanTableBody>
  <KanbanTableRow>
    <KanbanTableTD>Task A</KanbanTableTD>
    <KanbanTableTD>Task B</KanbanTableTD>
  </KanbanTableRow>
</KanbanTableBody>
```

## References

- HTML tbody element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tbody
