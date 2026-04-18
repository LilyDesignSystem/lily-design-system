# GanttTableRow

A single row within a GanttTable grid. Renders as a `<tr>` containing GanttTableData cells for each time period and task header cells. Used inside GanttTableHead, GanttTableBody, or GanttTableFoot.

## Props

- `children`: Snippet (required) -- GanttTableData cells and header cells for this row
- `...restProps`: unknown -- additional attributes spread onto the `<tr>`

## Usage

```svelte
<!-- Task row with active time periods -->
<GanttTableRow>
  <th>Development</th>
  <GanttTableData />
  <GanttTableData active>---</GanttTableData>
  <GanttTableData active>---</GanttTableData>
</GanttTableRow>

<!-- Header row -->
<GanttTableRow>
  <th>Task</th><th>Week 1</th><th>Week 2</th><th>Week 3</th>
</GanttTableRow>
```

## Accessibility

- `<tr>` has implicit `role="row"` within the grid (no explicit role attribute needed)

## References

- WAI-ARIA Grid Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/grid/
