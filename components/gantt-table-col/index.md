# Gantt Table Col

A Gantt table column defines column-level properties for a Gantt chart table, such as width and styling for individual time period columns. It renders as a `<col>` element inside a `<colgroup>`, allowing consumers to apply uniform styling to all cells within a given column without repeating attributes on each cell. This is particularly useful in Gantt charts where time period columns (e.g., days, weeks, sprints) often share consistent widths.

This component is designed to be used as a child of a GanttTable component, inside a `<colgroup>` element. Each GanttTableCol instance corresponds to one column in the Gantt chart grid.

## Implementation Notes

- Renders as a `<col>` element for use inside a `<colgroup>` within a GanttTable
- Used to define column-level properties such as width, span, and CSS class for time period columns
- The `span` attribute allows a single `<col>` to apply properties across multiple consecutive columns
- Spreads `...restProps` onto the `<col>` element for consumer customization
- No children -- `<col>` is a void element

## Props

- `span`: number (default: 1) -- number of consecutive columns this element spans
- `...restProps`: any -- additional HTML attributes spread onto the `<col>` element

## Usage

```html
<GanttTable label="Q1 2025 schedule">
  <colgroup>
    <GanttTableCol style="width: 200px" />
    <GanttTableCol span="3" style="width: 100px" />
  </colgroup>
  <GanttTableHead>
    <GanttTableRow>
      <GanttTableCol scope="col">Task</GanttTableCol>
      <GanttTableCol scope="col">Jan</GanttTableCol>
      <GanttTableCol scope="col">Feb</GanttTableCol>
      <GanttTableCol scope="col">Mar</GanttTableCol>
    </GanttTableRow>
  </GanttTableHead>
  <GanttTableBody>
    <GanttTableRow>
      <GanttTableCol scope="row">Design phase</GanttTableCol>
      <GanttTableData active>████</GanttTableData>
      <GanttTableData></GanttTableData>
      <GanttTableData></GanttTableData>
    </GanttTableRow>
  </GanttTableBody>
</GanttTable>
```

## Keyboard Interactions

None -- passive structural element with no interactive behavior.

## ARIA

- No explicit ARIA roles or attributes -- the `<col>` element is a structural table component that does not appear in the accessibility tree

## When to Use

- Use inside GanttTable to provide column-level `<th>` header cells for task names and time periods.
- Use inside a `<colgroup>` within a GanttTable to define uniform column widths for time period columns.
- Use when multiple columns should share the same width or styling without repeating attributes on each cell.

## When Not to Use

- Do not use outside of a GanttTable structure -- use TableCol or DataTableCol for general tables.
- Do not use when columns need individual per-cell styling; apply styles directly to GanttTableData cells instead.

## Headless

This headless component provides a `<col>` element for column-level property definitions within a Gantt chart grid. The consumer provides all visual styling including column widths, background colors, and borders.


## Styles

The consumer provides all CSS styling. The component renders with a `.gantt-table-col` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<th>` element with class `gantt-table-col`
- Verify pass-through attributes are applied

## Advice

- **Designers**: Use consistent column widths for time period columns to create a uniform grid. The task-name column is typically wider than time period columns.
- **Developers**: Use the `span` attribute to apply a single `<col>` across multiple consecutive columns that share the same width.

## References

- WAI-ARIA Grid Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/grid/
- HTML `<col>` element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/col
