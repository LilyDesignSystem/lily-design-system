# GanttTableTfoot

The footer section of a GanttTable, rendered as a `<tfoot>` element. Contains GanttTableTr elements with summary or aggregate data cells.

## Props

- `children`: Snippet (required) -- GanttTableTr elements with footer cells
- `...restProps`: unknown -- additional attributes spread onto the `<tfoot>`

## Usage

```svelte
<GanttTableTfoot>
  <GanttTableTr>
    <GanttTableTd>Total: 12 tasks</GanttTableTd>
  </GanttTableTr>
</GanttTableTfoot>
```

## References

- HTML tfoot element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tfoot
