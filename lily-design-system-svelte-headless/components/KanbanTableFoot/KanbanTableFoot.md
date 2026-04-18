# KanbanTableFoot

The footer section of a KanbanTable, rendered as a `<tfoot>` element. Contains KanbanTableRow elements with summary or aggregate data cells.

## Props

- `children`: Snippet (required) -- KanbanTableRow elements with footer cells
- `...restProps`: unknown -- additional attributes spread onto the `<tfoot>`

## Usage

```svelte
<KanbanTableFoot>
  <KanbanTableRow>
    <KanbanTableData>Total: 3</KanbanTableData>
    <KanbanTableData>Total: 5</KanbanTableData>
  </KanbanTableRow>
</KanbanTableFoot>
```

## References

- HTML tfoot element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tfoot
