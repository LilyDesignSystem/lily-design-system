# Calendar Table

A calendar board is a component that presents dates in a structured grid layout, typically organized by weeks and days, allowing users to view and interact with calendar data at a glance. Commonly used in scheduling applications, event planners, and dashboard interfaces, the calendar board renders dates as cells within a table grid, making it easy to scan across days, weeks, or months.

This headless component renders a `<table>` element with `role="grid"` and an accessible label. The consumer provides the table rows and cells as children, along with any header rows for day-of-week labels.

## Implementation Notes

- Renders a `<table>` element with `role="grid"` for structured calendar grid semantics
- Consumer provides `<tr>` rows with `<td>` or `<th>` cells as children
- The `label` prop should describe the calendar period (e.g., "January 2025")
- Accepts `...restProps` for forwarding additional attributes to the table element
- No internal state -- purely a structural wrapper

## Props

- `label`: string (required) -- accessible name describing the calendar period (e.g., month and year), applied via `aria-label`
- `children`: slot (required) -- table rows and cells representing the calendar grid

## Usage

```html
<CalendarTable label="April 2026">
  <CalendarTableHead>
    <CalendarTableRow>
      <th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th><th>Sun</th>
    </CalendarTableRow>
  </CalendarTableHead>
  <CalendarTableBody>
    <CalendarTableRow>
      <CalendarTableData>1</CalendarTableData>
      <CalendarTableData>2</CalendarTableData>
      <CalendarTableData>3</CalendarTableData>
      <CalendarTableData>4</CalendarTableData>
      <CalendarTableData>5</CalendarTableData>
      <CalendarTableData>6</CalendarTableData>
      <CalendarTableData>7</CalendarTableData>
    </CalendarTableRow>
    <CalendarTableRow>
      <CalendarTableData today selected>8</CalendarTableData>
      <CalendarTableData>9</CalendarTableData>
      <CalendarTableData>10</CalendarTableData>
      <CalendarTableData>11</CalendarTableData>
      <CalendarTableData>12</CalendarTableData>
      <CalendarTableData>13</CalendarTableData>
      <CalendarTableData>14</CalendarTableData>
    </CalendarTableRow>
  </CalendarTableBody>
  <CalendarTableFoot>
    <CalendarTableRow>
      <td colspan="7">3 events this week</td>
    </CalendarTableRow>
  </CalendarTableFoot>
</CalendarTable>
```

## Keyboard Interactions

None built-in -- the consumer should implement grid keyboard navigation on cells as needed (arrow keys for cell-to-cell movement, Enter/Space for selection).

## ARIA

- `role="grid"` -- identifies the table as an interactive grid widget
- `aria-label={label}` -- provides an accessible name describing the calendar period

## When to Use

- Use to display an interactive calendar grid for managing dates, scheduling, and date selection
- Use when users need to view and interact with dates in a monthly or weekly grid format
- Use in scheduling applications, event planners, and dashboard calendars where a visual date layout is needed
- Use as the container for CalendarTableHead, CalendarTableBody, CalendarTableFoot, CalendarTableRow, and CalendarTableData

## When Not to Use

- Do not use for displaying general tabular data -- use Table or DataTable instead
- Do not use for date range selection without a grid -- use CalendarRangePicker for start-and-end-date picking
- Do not use for simple date entry where users already know the date -- use DateInput for a compact input field

## Headless

This component provides a `<table>` element with `role="grid"` and `aria-label` for accessible calendar grid semantics, with zero visual styling. The consumer is responsible for all CSS including cell sizing, grid lines, day-of-week header styling, selected/today state highlights, and month navigation controls.


## Styles

The consumer provides all CSS styling. The component renders with a `.calendar-table` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<table>` element with class `calendar-table`
- Verify role="grid"` -- identifies the table as an interactive grid widget
- Verify aria-label={label}` -- provides an accessible name describing the calendar period
- Verify pass-through attributes are applied

## Advice

- **Designers**: Clearly distinguish today's date and selected dates from other days. Use consistent cell sizing and ensure enough contrast for day numbers.
- **Developers**: Implement arrow key navigation between cells, Enter/Space for selection, and ensure the `label` prop describes the calendar period (e.g., "January 2025") for screen readers.

## Composition

CalendarTable follows the Table composition pattern:

- **CalendarTable** -- outer `<table>` with `role="grid"` and `aria-label`.
- **CalendarTableHead** -- `<thead>` containing day-of-week column headers.
- **CalendarTableBody** -- `<tbody>` containing rows of day cells.
- **CalendarTableFoot** -- `<tfoot>` for optional summary or navigation content.
- **CalendarTableRow** -- `<tr>` representing one week.
- **CalendarTableCell** -- `<td>` representing one day with selection and today state.

```html
<CalendarTable label="January 2025">
  <CalendarTableHead>
    <CalendarTableRow><th>Sun</th><th>Mon</th><th>Tue</th></CalendarTableRow>
  </CalendarTableHead>
  <CalendarTableBody>
    <CalendarTableRow>
      <CalendarTableCell>1</CalendarTableCell>
      <CalendarTableCell today selected>2</CalendarTableCell>
      <CalendarTableCell>3</CalendarTableCell>
    </CalendarTableRow>
  </CalendarTableBody>
</CalendarTable>
```

## References

- WAI-ARIA Grid Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/grid/
