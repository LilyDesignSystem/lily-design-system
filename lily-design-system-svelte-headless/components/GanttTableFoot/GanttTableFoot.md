# GanttTableFoot

The footer section of a GanttTable, rendered as a `<tfoot>` element. Contains GanttTableRow elements with summary or aggregate data cells.

## Props

- `children`: Snippet (required) -- GanttTableRow elements with footer cells
- `...restProps`: unknown -- additional attributes spread onto the `<tfoot>`

## Usage

```svelte
<GanttTableFoot>
  <GanttTableRow>
    <GanttTableData>Total: 12 tasks</GanttTableData>
  </GanttTableRow>
</GanttTableFoot>
```

## References

- HTML tfoot element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tfoot
