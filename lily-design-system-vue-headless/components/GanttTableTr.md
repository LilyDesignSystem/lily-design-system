# GanttTableTR

A single row within a GanttTable grid. Renders as a `<tr>` containing GanttTableTD cells for each time period and task header cells. Used inside GanttTableHead, GanttTableBody, or GanttTableTfoot.

## Props

- `children`: Snippet (required) -- GanttTableTD cells and header cells for this row
- `...restProps`: unknown -- additional attributes spread onto the `<tr>`

## Usage

```svelte
<!-- Task row with active time periods -->
<GanttTableTR>
  <th>Development</th>
  <GanttTableTD />
  <GanttTableTD active>---</GanttTableTD>
  <GanttTableTD active>---</GanttTableTD>
</GanttTableTR>

<!-- Header row -->
<GanttTableTR>
  <th>Task</th><th>Week 1</th><th>Week 2</th><th>Week 3</th>
</GanttTableTR>
```

## Accessibility

- `<tr>` has implicit `role="row"` within the grid (no explicit role attribute needed)

## References

- WAI-ARIA Grid Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/grid/
