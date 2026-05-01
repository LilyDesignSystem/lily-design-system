# Gantt Table TH

A Gantt table col is a column header cell in a GanttTable. It renders a `<th scope="col">` element and is intended to live inside a GanttTableTR within GanttTableHead, where it labels a time-period column (day, week, month, milestone, etc.).

## Implementation Notes

- Renders as a `<th>` element with `scope="col"` by default
- Accepts optional `colspan` / `rowspan` for grouped header cells
- Accepts an alternative `scope` (e.g. `"colgroup"` for grouped headers)
- Renders header text via children
- Spreads `restProps` onto the `<th>` element

## Props

- `colspan`: number (optional) -- number of columns this header cell spans
- `rowspan`: number (optional) -- number of rows this header cell spans
- `scope`: `"col" | "row" | "colgroup" | "rowgroup"` (default: `"col"`) -- header scope
- `children`: optional -- header cell content
- `...restProps`: any -- additional HTML attributes spread onto the `<th>` element

## Usage

```html
<GanttTable label="Q1 2026 schedule">
  <GanttTableHead>
    <GanttTableTR>
      <GanttTableTH>Task</GanttTableTH>
      <GanttTableTH>Jan</GanttTableTH>
      <GanttTableTH>Feb</GanttTableTH>
      <GanttTableTH>Mar</GanttTableTH>
    </GanttTableTR>
  </GanttTableHead>
  <GanttTableBody>
    <GanttTableTR>
      <th scope="row">Design phase</th>
      <GanttTableTD active>████</GanttTableTD>
      <GanttTableTD></GanttTableTD>
      <GanttTableTD></GanttTableTD>
    </GanttTableTR>
  </GanttTableBody>
</GanttTable>
```

## Keyboard Interactions

None -- header cells are not interactive.

## ARIA

- `scope="col"` associates the header with its column for assistive technologies
- Use `scope="colgroup"` together with `colspan` for grouped column headers (e.g. quarter spanning three months)

## When to Use

- For time-period column headers (days, weeks, months, milestones)
- For grouped headers (e.g. a quarter row above month columns) via `colspan`

## When Not to Use

- Do not use outside GanttTable -- use TableTD or DataTableTD for other table types
- Do not use for task data cells -- use GanttTableTD
- Do not use for column-wide styling hooks via `<colgroup>` / `<col>` -- write those directly inside GanttTable

## Headless

This headless component provides a `<th>` element for time-period column headers in a Gantt chart grid. The consumer provides all visual styling.

## Styles

The consumer provides all CSS styling. The component renders with a `.gantt-table-th` class for targeting. No default styles are included — this is a fully headless component.

## Testing

- Verify the component renders a `<th>` element with class `gantt-table-th`
- Verify `scope="col"` is the default
- Verify `colspan` / `rowspan` are applied when set
- Verify pass-through attributes are applied

## Advice

- **Designers**: Use consistent column widths for time-period columns to create a uniform grid.
- **Developers**: Place GanttTableTH elements inside a GanttTableTR within GanttTableHead.

## Related components

- `gantt-table` — a Gantt chart table interactive grid for planning schedule visualization <table>
- `gantt-table-tbody` — a Gantt chart table interactive grid tbody for planning schedule visualization <tbody>
- `gantt-table-tfoot` — a Gantt chart table interactive grid tfoot for planning schedule visualization <tfoot>
- `gantt-table-thead` — a Gantt chart table interactive grid thead for planning schedule visualization <thead>
- `gantt-table-tr` — a Gantt chart table interactive grid row for planning schedule visualization <tr>
- `gantt-table-td` — a Gantt chart table interactive grid data cell for planning schedule visualization <td>
- `table` — a table with rows and columns <table>

## References

- WAI-ARIA Grid Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/grid/
- MDN th element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/th
