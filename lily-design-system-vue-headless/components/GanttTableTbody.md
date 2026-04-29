# GanttTableBody

The body section of a GanttTable, rendered as a `<tbody>` element. Contains GanttTableTR elements with task data cells.

## Props

- `children`: Snippet (required) -- GanttTableTR elements with data cells
- `...restProps`: unknown -- additional attributes spread onto the `<tbody>`

## Usage

```svelte
<GanttTableBody>
  <GanttTableTR>
    <GanttTableTD>Design</GanttTableTD>
    <GanttTableTD>Jan 1</GanttTableTD>
  </GanttTableTR>
</GanttTableBody>
```

## References

- HTML tbody element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tbody
