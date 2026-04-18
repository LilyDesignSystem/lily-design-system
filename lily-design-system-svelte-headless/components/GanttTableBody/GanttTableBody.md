# GanttTableBody

The body section of a GanttTable, rendered as a `<tbody>` element. Contains GanttTableRow elements with task data cells.

## Props

- `children`: Snippet (required) -- GanttTableRow elements with data cells
- `...restProps`: unknown -- additional attributes spread onto the `<tbody>`

## Usage

```svelte
<GanttTableBody>
  <GanttTableRow>
    <GanttTableData>Design</GanttTableData>
    <GanttTableData>Jan 1</GanttTableData>
  </GanttTableRow>
</GanttTableBody>
```

## References

- HTML tbody element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tbody
