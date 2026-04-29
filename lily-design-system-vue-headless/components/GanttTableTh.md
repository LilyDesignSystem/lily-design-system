# GanttTableTH

A column header cell within a GanttTable, rendered as a `<th scope="col">` element. Intended to live inside a GanttTableTR within GanttTableHead, where it labels a time-period column.

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
    <GanttTableTR>
      <GanttTableTH>Task</GanttTableTH>
      <GanttTableTH>W1</GanttTableTH>
      <GanttTableTH>W2</GanttTableTH>
    </GanttTableTR>
  </GanttTableHead>
  ...
</GanttTable>
```

## References

- HTML th element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/th
