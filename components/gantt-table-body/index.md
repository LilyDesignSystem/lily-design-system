# Gantt Table Body

A Gantt table body is the main content section of a Gantt chart grid, wrapping the rows that represent individual tasks and their timeline data. Each row typically contains a task name and cells indicating the task's duration across time periods. It is designed to be used inside a GanttTable `<table>` structure.

The component renders a `<tbody>` element and passes through its children, which are expected to be GanttTableRow or `<tr>` elements containing task and timeline cells.

## Implementation Notes

- Renders as a `<tbody>` element for the body section of a Gantt chart grid
- Children should be task rows, each with a task-name cell and time-period cells
- Designed to be used inside a GanttTable `<table>` structure
- Spreads `restProps` onto the `<tbody>` element for consumer customization
- No internal state -- purely a structural wrapper

## Props

- `children`: slot (required) -- task rows representing items and their timeline data
- `...restProps`: Any additional HTML attributes passed to the `<tbody>` element

## Usage

```html
<GanttTable label="Q1 2025 schedule">
  <GanttTableHead>...</GanttTableHead>
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
</GanttTable>
```

## Keyboard Interactions

None -- this component is a passive container. Keyboard navigation is handled by the parent GanttTable grid.

## ARIA

- Implicit `rowgroup` role from the `<tbody>` element -- groups the body rows of the grid

## When to Use

- Use inside GanttTable to provide the `<tbody>` body section containing task rows.
- Use to group all task rows and their timeline data cells.
- Use when the Gantt chart has one or more tasks to display against a time axis.

## When Not to Use

- Do not use outside of a GanttTable structure -- use TableBody or DataTableBody for general tables.
- Do not use for header or footer rows -- use GanttTableHead or GanttTableFoot instead.

## Headless

This headless component provides a `<tbody>` element with implicit `rowgroup` role for grouping body rows within a Gantt chart grid. The consumer provides all visual styling including row spacing, alternating row colors, and bar rendering.


## Styles

The consumer provides all CSS styling. The component renders with a `.gantt-table-body` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<tbody>` element with class `gantt-table-body`
- Verify pass-through attributes are applied

## Advice

- **Designers**: Use alternating row backgrounds or subtle borders to help users track across long timelines. Highlight the current time period column.
- **Developers**: Place GanttTableRow elements as children. Each row should have a `<th>` for the task name followed by GanttTableData cells for time periods.

## References

- WAI-ARIA Grid Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/grid/
