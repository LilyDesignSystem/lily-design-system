# Calendar Table Body

A calendar table body is the main content section of a calendar grid, wrapping the rows that contain the day cells. It groups the data rows of the calendar, where each row represents a week and each cell represents a day. It is designed to be used inside a CalendarTable `<table>` structure.

The component renders a `<tbody>` element and passes through its children, which are expected to be CalendarTableRow or `<tr>` elements containing day cells.

## Implementation Notes

- Renders as a `<tbody>` element for the body section of a calendar grid
- Children should be rows of day cells, typically one row per week
- Designed to be used inside a CalendarTable `<table>` structure
- Spreads `restProps` onto the `<tbody>` element for consumer customization
- No internal state -- purely a structural wrapper

## Props

- `children`: slot (required) -- rows of day cells representing weeks in the calendar
- `...restProps`: Any additional HTML attributes passed to the `<tbody>` element

## Usage

```html
<CalendarTable label="April 2026">
  <CalendarTableHead>...</CalendarTableHead>
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
      <CalendarTableData today>8</CalendarTableData>
      <CalendarTableData>9</CalendarTableData>
      <CalendarTableData>10</CalendarTableData>
      <CalendarTableData>11</CalendarTableData>
      <CalendarTableData>12</CalendarTableData>
      <CalendarTableData>13</CalendarTableData>
      <CalendarTableData>14</CalendarTableData>
    </CalendarTableRow>
  </CalendarTableBody>
</CalendarTable>
```

## Keyboard Interactions

None -- this component is a passive container. Keyboard navigation is handled by the parent CalendarTable grid.

## ARIA

- Implicit `rowgroup` role from the `<tbody>` element -- groups the body rows of the grid

## When to Use

- Use inside CalendarTable to provide the `<tbody>` for the calendar grid
- Use to group the week rows containing day cells in the main calendar area
- Use when each row represents one week and each cell represents one day

## When Not to Use

- Do not use outside CalendarTable -- use TableBody or DataTableBody for other table types
- Do not use for header rows -- use CalendarTableHead for day-of-week labels

## Headless

This component provides a semantic `<tbody>` element with implicit `rowgroup` role and zero visual styling. The consumer is responsible for all CSS including row spacing, cell layout, and any visual distinction between the body and header/footer sections.


## Styles

The consumer provides all CSS styling. The component renders with a `.calendar-table-body` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<tbody>` element with class `calendar-table-body`
- Verify pass-through attributes are applied

## Advice

- **Designers**: Ensure consistent row heights and cell sizes across all weeks in the body. Visually distinguish the body from the header row of day-of-week labels.
- **Developers**: Each child row should contain exactly 7 cells (one per day of the week). Use empty cells or disabled styling for days outside the current month.

## Composition

CalendarTableBody is part of the CalendarTable composition pattern:

- **CalendarTable** -- outer `<table>` with `role="grid"`.
- **CalendarTableHead** -- `<thead>` for day-of-week column headers.
- **CalendarTableBody** -- `<tbody>` grouping the week rows of day cells.
- **CalendarTableRow** -- `<tr>` representing one week.
- **CalendarTableCell** -- `<td>` representing one day.

```html
<CalendarTable label="January 2025">
  <CalendarTableHead>...</CalendarTableHead>
  <CalendarTableBody>
    <CalendarTableRow>
      <CalendarTableCell>1</CalendarTableCell>
      <CalendarTableCell>2</CalendarTableCell>
    </CalendarTableRow>
  </CalendarTableBody>
</CalendarTable>
```

## References

- WAI-ARIA Grid Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/grid/
