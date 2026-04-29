# GanttTableTh

A column header cell within a GanttTable, rendered as a `<th scope="col">` element. Intended to live inside a GanttTableTr within GanttTableThead, where it labels a time-period column.

## Props

- `colspan`: number (optional) -- number of columns this header cell spans
- `rowspan`: number (optional) -- number of rows this header cell spans
- `scope`: `"col" | "row" | "colgroup" | "rowgroup"` (default `"col"`)
- default slot -- header cell content
- `...restProps`: unknown -- additional attributes spread onto the `<th>`

## Usage

```vue
<GanttTable label="Project timeline">
  <GanttTableThead>
    <GanttTableTr>
      <GanttTableTh>Task</GanttTableTh>
      <GanttTableTh>W1</GanttTableTh>
      <GanttTableTh>W2</GanttTableTh>
    </GanttTableTr>
  </GanttTableThead>
  ...
</GanttTable>
```

## References

- HTML th element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/th
