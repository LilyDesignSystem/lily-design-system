# Gantt Table

A Gantt table (a.k.a. Gannt chart) is a component that displays project tasks and their timelines as horizontal bars along a time axis, providing a visual overview of project schedules, dependencies, and progress. Commonly used in project management tools, resource planning applications, and team collaboration platforms, the Gantt chart helps users understand task durations, overlaps, milestones, and sequencing at a glance.

This headless component renders a `<table>` element with `role="grid"` and an accessible label. The consumer provides the table structure with rows for tasks and columns for time periods, along with any visual bar representations.

## Implementation Notes

- Renders a `<table>` element with `role="grid"` for structured task/timeline grid semantics
- Consumer provides `<tr>` rows for tasks and `<td>`/`<th>` cells for time periods
- The grid structure allows screen readers to navigate tasks and time periods systematically
- Accepts `...restProps` for forwarding additional attributes to the table element
- No internal state -- purely a structural wrapper

## Props

- `label`: string (required) -- accessible name describing the Gantt chart content, applied via `aria-label`
- `children`: slot (required) -- table rows and cells representing tasks and timelines

## Usage

```html
<GanttTable caption="Project timeline" label="Q1 2025 schedule">
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

None built-in -- the consumer should implement grid keyboard navigation on cells as needed (arrow keys for cell-to-cell movement).

## ARIA

- `role="grid"` -- identifies the table as an interactive grid widget
- `aria-label={label}` -- provides an accessible name describing the Gantt chart

## When to Use

- Use for schedule and timeline visualisation in project management tools.
- Use when tasks need to be displayed against a time axis showing durations, overlaps, and dependencies.
- Use when users need to see milestones and sequencing at a glance.
- Use in resource planning applications to show allocation across time periods.
- Use in sprint or release planning to communicate delivery timelines.

## When Not to Use

- Do not use for general tabular data without a time axis -- use Table or DataTable instead.
- Do not use for status boards or workflow columns -- use KanbanTable instead.
- Do not use for simple task lists without time dimensions -- use TaskList instead.
- Do not use for calendar date picking -- use CalendarTable instead.

## Headless

This headless component provides a `<table>` with `role="grid"` and `aria-label` for structured task/timeline grid semantics. The consumer provides all visual styling including bar rendering, color coding, column widths, and timeline axis formatting.


## Styles

The consumer provides all CSS styling. The component renders with a `.gantt-table` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<table>` element with class `gantt-table`
- Verify role="grid"` -- identifies the table as an interactive grid widget
- Verify aria-label={label}` -- provides an accessible name describing the Gantt chart
- Verify pass-through attributes are applied

## Advice

- **Designers**: Use horizontal bars with distinct colors to represent task durations. Include clear column headers for time periods and a fixed task-name column for readability.
- **Developers**: Implement grid keyboard navigation (arrow keys for cell-to-cell movement) in your consumer code for full accessibility.

## Composition

GanttTable uses the Table composition pattern: GanttTable contains GanttTableHead, GanttTableBody, and optionally GanttTableFoot. Each section contains GanttTableRow elements, which contain `<th>` cells for task names and GanttTableData cells for time period indicators. Use GanttTableCol inside a `<colgroup>` for column-level styling.

## References

- WAI-ARIA Grid Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/grid/
