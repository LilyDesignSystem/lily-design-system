# GanttTableBody

The body section of a GanttTable, rendered as a `<tbody>` element. Contains GanttTableTr elements with task data cells.

## Props

- `children`: Snippet (required) -- GanttTableTr elements with data cells
- `...restProps`: unknown -- additional attributes spread onto the `<tbody>`

## Usage

```svelte
<GanttTableBody>
  <GanttTableTr>
    <GanttTableTD>Design</GanttTableTD>
    <GanttTableTD>Jan 1</GanttTableTD>
  </GanttTableTr>
</GanttTableBody>
```

## References

- HTML tbody element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tbody
