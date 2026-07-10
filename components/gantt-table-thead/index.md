# Gantt Table Head

A Gantt table head is the header section of a Gantt chart grid, wrapping one or more rows that label the columns of the chart. Typically contains a row with a task-name column header and time-period column headers (e.g., weeks, months, sprints). It is designed to be used inside a GanttTable `<table>` structure.

The component renders a `<thead>` element and passes through its children, which are expected to be GanttTableTR or `<tr>` elements containing `<th>` header cells.

## Implementation Notes

- Renders as a `<thead>` element for the header section of a Gantt chart grid
- Children should be one or more rows with `<th>` cells labeling the task column and time-period columns
- Designed to be used inside a GanttTable `<table>` structure
- Spreads `restProps` onto the `<thead>` element for consumer customization
- No internal state -- purely a structural wrapper

## Props

- `children`: slot (required) -- header rows containing column labels for tasks and time periods
- `...restProps`: Any additional HTML attributes passed to the `<thead>` element

## Usage

```html
<GanttTable label="Q1 2025 schedule">
  <GanttTableHead>
    <GanttTableTR>
      <GanttTableTH scope="col">Task</GanttTableTH>
      <GanttTableTH scope="col">Jan</GanttTableTH>
      <GanttTableTH scope="col">Feb</GanttTableTH>
      <GanttTableTH scope="col">Mar</GanttTableTH>
    </GanttTableTR>
  </GanttTableHead>
  <GanttTableBody>...</GanttTableBody>
</GanttTable>
```

## Keyboard Interactions

None -- this component is a passive container. Keyboard navigation is handled by the parent GanttTable grid.

## ARIA

- Implicit `rowgroup` role from the `<thead>` element -- groups the header rows of the grid

## When to Use

- Use inside GanttTable to provide the `<thead>` header section.
- Use to label the task-name column and time period columns (e.g., weeks, months, sprints).
- Use when the Gantt chart needs clearly labelled column headers for accessibility.

## When Not to Use

- Do not use outside of a GanttTable structure -- use TableHead or DataTableHead for general tables.
- Do not use for body or footer rows -- use GanttTableBody or GanttTableTfoot instead.

## Headless

This headless component provides a `<thead>` element with implicit `rowgroup` role for grouping header rows within a Gantt chart grid. The consumer provides all visual styling including header background, typography, and column alignment.


## Styles

The consumer provides all CSS styling. The component renders with a `.gantt-table-thead` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<thead>` element with class `gantt-table-thead`
- Verify pass-through attributes are applied

## Advice

- **Designers**: Make header labels concise and readable. For long timelines, consider multi-row headers (e.g., months on one row, weeks on another).
- **Developers**: Use `<th>` elements inside GanttTableTR children for proper header cell semantics. Add `scope="col"` to column headers for screen reader clarity.

## Related components

- `gantt-table` — a Gantt chart table interactive grid for planning schedule visualization <table>
- `gantt-table-tbody` — see components.tsv
- `gantt-table-tfoot` — see components.tsv
- `gantt-table-tr` — see components.tsv
- `gantt-table-th` — a Gantt chart table interactive grid header cell for planning schedule visualization <th>
- `gantt-table-td` — a Gantt chart table interactive grid data cell for planning schedule visualization <td>

## References

- WAI-ARIA Grid Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/grid/

---

Lily™ and Lily Design System™ are trademarks.
