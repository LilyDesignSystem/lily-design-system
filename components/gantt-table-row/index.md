# Gantt Table Row

A Gantt table row represents a single row within a Gantt chart grid, typically corresponding to one task or milestone. It wraps a task-name cell and time-period cells in a horizontal sequence. It is designed to be used inside a GanttTableHead, GanttTableBody, or GanttTableFoot section.

The component renders a `<tr>` element and passes through its children, which are expected to be `<td>`, `<th>`, or GanttTableData elements.

## Implementation Notes

- Renders as a `<tr>` element for one row in a Gantt chart grid
- Children should be a task-name header cell (`<th>`) followed by time-period data cells (`<td>` or GanttTableData)
- Designed to be used inside GanttTableHead, GanttTableBody, or GanttTableFoot
- Spreads `restProps` onto the `<tr>` element for consumer customization
- No internal state -- purely a structural wrapper

## Props

- `children`: slot (required) -- cells for this row, typically a task name and time-period indicators
- `...restProps`: Any additional HTML attributes passed to the `<tr>` element

## Usage

```html
<GanttTableBody>
  <GanttTableRow>
    <GanttTableCol scope="row">Design phase</GanttTableCol>
    <GanttTableData active>████</GanttTableData>
    <GanttTableData active>████</GanttTableData>
    <GanttTableData></GanttTableData>
  </GanttTableRow>
  <GanttTableRow>
    <GanttTableCol scope="row">Development</GanttTableCol>
    <GanttTableData></GanttTableData>
    <GanttTableData active>████</GanttTableData>
    <GanttTableData active>████</GanttTableData>
  </GanttTableRow>
</GanttTableBody>
```

## Keyboard Interactions

None -- this component is a passive container. Keyboard navigation is handled by the parent GanttTable grid.

## ARIA

- Implicit `row` role from the `<tr>` element -- identifies a row of cells within the grid

## When to Use

- Use inside GanttTable to provide the `<tr>` row element for a task, header, or summary row.
- Use inside GanttTableHead, GanttTableBody, or GanttTableFoot to represent a single row in the Gantt chart.
- Use to wrap a task-name cell followed by time-period data cells.

## When Not to Use

- Do not use outside of a GanttTable structure -- use TableRow or DataTableRow for general tables.
- Do not use for standalone row content outside a table context.

## Headless

This headless component provides a `<tr>` element with implicit `row` role for identifying a row within the Gantt chart grid. The consumer provides all visual styling including row height, hover states, and borders.


## Styles

The consumer provides all CSS styling. The component renders with a `.gantt-table-row` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<tr>` element with class `gantt-table-row`
- Verify pass-through attributes are applied

## Advice

- **Designers**: Ensure rows have enough height to display bar segments clearly. Add hover states to help users track across wide timelines.
- **Developers**: Start each body row with a `<th>` for the task name, followed by GanttTableData cells for the time period columns.

## References

- WAI-ARIA Grid Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/grid/
