# GanttTableCol

A column header cell within a GanttTable, rendered as a `<th scope="col">` element. Intended to live inside a GanttTableRow within GanttTableHead, where it labels a time-period column.

## Props

- `colspan`: number (optional) -- number of columns this header cell spans
- `rowspan`: number (optional) -- number of rows this header cell spans
- `scope`: `"col" | "row" | "colgroup" | "rowgroup"` (default `"col"`)
- default slot -- header cell content
- `...restProps`: unknown -- additional attributes spread onto the `<th>`

## Usage

```vue
<GanttTable label="Project timeline">
  <GanttTableHead>
    <GanttTableRow>
      <GanttTableCol>Task</GanttTableCol>
      <GanttTableCol>W1</GanttTableCol>
      <GanttTableCol>W2</GanttTableCol>
    </GanttTableRow>
  </GanttTableHead>
  ...
</GanttTable>
```

## References

- HTML th element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/th
