# KanbanTableFoot

The footer section of a KanbanTable, rendered as a `<tfoot>` element. Contains KanbanTableRow elements with summary or aggregate data cells.

## Props

- `children`: Snippet (required) -- KanbanTableRow elements with footer cells
- `...restProps`: unknown -- additional attributes spread onto the `<tfoot>`

## Usage

```svelte
<KanbanTableFoot>
  <KanbanTableRow>
    <KanbanTableTD>Total: 3</KanbanTableTD>
    <KanbanTableTD>Total: 5</KanbanTableTD>
  </KanbanTableRow>
</KanbanTableFoot>
```

## References

- HTML tfoot element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tfoot
