# Calendar Table Row

A calendar table row represents a single row within a calendar grid, typically corresponding to one week. It wraps day cells or header cells in a horizontal sequence. It is designed to be used inside a CalendarTableHead, CalendarTableBody, or CalendarTableFoot section.

The component renders a `<tr>` element and passes through its children, which are expected to be `<td>`, `<th>`, or CalendarTableCell elements.

## Implementation Notes

- Renders as a `<tr>` element for one row in a calendar grid
- Children should be day cells (`<td>` or CalendarTableCell) or header cells (`<th>`)
- Designed to be used inside CalendarTableHead, CalendarTableBody, or CalendarTableFoot
- Spreads `restProps` onto the `<tr>` element for consumer customization
- No internal state -- purely a structural wrapper

## Props

- `children`: slot (required) -- cells for this row, typically day numbers or day-of-week labels
- `...restProps`: Any additional HTML attributes passed to the `<tr>` element

## Usage

```html
<CalendarTableBody>
  <CalendarTableRow>
    <CalendarTableTD>1</CalendarTableTD>
    <CalendarTableTD>2</CalendarTableTD>
    <CalendarTableTD>3</CalendarTableTD>
    <CalendarTableTD>4</CalendarTableTD>
    <CalendarTableTD>5</CalendarTableTD>
    <CalendarTableTD>6</CalendarTableTD>
    <CalendarTableTD>7</CalendarTableTD>
  </CalendarTableRow>
  <CalendarTableRow>
    <CalendarTableTD today selected>8</CalendarTableTD>
    <CalendarTableTD>9</CalendarTableTD>
    <CalendarTableTD>10</CalendarTableTD>
    <CalendarTableTD>11</CalendarTableTD>
    <CalendarTableTD>12</CalendarTableTD>
    <CalendarTableTD>13</CalendarTableTD>
    <CalendarTableTD>14</CalendarTableTD>
  </CalendarTableRow>
</CalendarTableBody>
```

## Keyboard Interactions

None -- this component is a passive container. Keyboard navigation is handled by the parent CalendarTable grid.

## ARIA

- Implicit `row` role from the `<tr>` element -- identifies a row of cells within the grid

## When to Use

- Use inside CalendarTable to provide the `<tr>` for each row of the calendar grid
- Use within CalendarTableHead, CalendarTableBody, or CalendarTableFoot to represent one week or one header row
- Use when you need a row container for CalendarTableTD day cells or `<th>` header cells

## When Not to Use

- Do not use outside CalendarTable -- use TableRow or DataTableRow for other table types
- Do not use for non-table layouts -- use a `<div>` with flexbox or grid styles instead

## Headless

This component provides a semantic `<tr>` element with implicit `row` role and zero visual styling. The consumer is responsible for all CSS including row height, cell alignment, borders between rows, and any alternate-row shading.


## Styles

The consumer provides all CSS styling. The component renders with a `.calendar-table-row` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<tr>` element with class `calendar-table-row`
- Verify pass-through attributes are applied

## Advice

- **Designers**: Maintain consistent row heights across all weeks. Use subtle borders or spacing between rows to aid scanning.
- **Developers**: Each row in the body should contain exactly 7 cells for a standard weekly view. Use CalendarTableCell for day cells and `<th>` for header cells.

## Composition

CalendarTableRow is part of the CalendarTable composition pattern:

- **CalendarTable** -- outer `<table>` with `role="grid"`.
- **CalendarTableHead/Body/Foot** -- section groupings.
- **CalendarTableRow** -- `<tr>` representing one week or header row.
- **CalendarTableCell** -- `<td>` representing one day.

```html
<CalendarTableBody>
  <CalendarTableRow>
    <CalendarTableCell>1</CalendarTableCell>
    <CalendarTableCell>2</CalendarTableCell>
    <CalendarTableCell>3</CalendarTableCell>
  </CalendarTableRow>
</CalendarTableBody>
```

## Related components

- `calendar-table` — a calendar table interactive grid for managing dates, days, etc. <table>
- `calendar-table-body` — a calendar table interactive grid tbody for managing dates, days, etc. <tbody>
- `calendar-table-foot` — a calendar table interactive grid tfoot for managing dates, days, etc. <tfoot>
- `calendar-table-head` — a calendar table interactive grid thead for managing dates, days, etc. <thead>
- `calendar-table-td` — a calendar table interactive grid data cell for managing dates, days, etc. <td>
- `calendar-table-th` — a calendar table interactive grid header cell for managing dates, days, etc. <th>
- `table` — a table with rows and columns <table>

## References

- WAI-ARIA Grid Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/grid/
