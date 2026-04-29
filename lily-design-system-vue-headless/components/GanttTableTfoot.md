# GanttTableTfoot

The footer section of a GanttTable, rendered as a `<tfoot>` element. Contains GanttTableTR elements with summary or aggregate data cells.

## Props

- `children`: Snippet (required) -- GanttTableTR elements with footer cells
- `...restProps`: unknown -- additional attributes spread onto the `<tfoot>`

## Usage

```svelte
<GanttTableTfoot>
  <GanttTableTR>
    <GanttTableTD>Total: 12 tasks</GanttTableTD>
  </GanttTableTR>
</GanttTableTfoot>
```

## References

- HTML tfoot element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tfoot
