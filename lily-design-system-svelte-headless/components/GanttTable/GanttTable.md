# GanttTable

An interactive Gantt table that displays project tasks and their timelines as a structured grid widget. Renders a `<table>` element with `role="grid"` and an accessible label. Supports an optional visible caption. Commonly used in project management tools and resource planning applications.

Compound component: use with GanttTableHead, GanttTableBody, GanttTableFoot, GanttTableRow, GanttTableData, and GanttTableCol.

## Props

- `label`: string (required) -- accessible name describing the Gantt table content, applied via `aria-label`
- `caption`: string (optional) -- visible caption text displayed above the table
- `children`: Snippet (required) -- GanttTableHead, GanttTableBody, GanttTableFoot elements
- `...restProps`: unknown -- additional attributes spread onto the `<table>`

## Usage

```svelte
<GanttTable label="Project Alpha timeline">
  <GanttTableHead>
    <GanttTableRow>
      <th>Task</th><th>Week 1</th><th>Week 2</th><th>Week 3</th>
    </GanttTableRow>
  </GanttTableHead>
  <GanttTableBody>
    <GanttTableRow>
      <th>Design</th>
      <GanttTableData active>---</GanttTableData>
      <GanttTableData />
      <GanttTableData />
    </GanttTableRow>
    <GanttTableRow>
      <th>Development</th>
      <GanttTableData />
      <GanttTableData active>---</GanttTableData>
      <GanttTableData active>---</GanttTableData>
    </GanttTableRow>
  </GanttTableBody>
</GanttTable>
```

## Accessibility

- `role="grid"` -- identifies the table as an interactive grid widget
- `aria-label={label}` -- provides an accessible name describing the Gantt table
- `<caption>` -- visible accessible name when the caption prop is set

## References

- WAI-ARIA Grid Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/grid/
