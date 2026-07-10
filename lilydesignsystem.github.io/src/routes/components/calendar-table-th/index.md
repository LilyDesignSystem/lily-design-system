# Calendar Table TH

CalendarTableTD is a headless component that renders a `<th scope="col">` element — a column header cell — intended to live inside a CalendarTableRow within CalendarTableHead. Use it to label day-of-week or other column headers in a calendar grid.

## Implementation Notes

- Renders a `<th>` element with `scope="col"` by default
- Accepts optional `colspan` / `rowspan` for grouped header cells
- Accepts an alternative `scope` (e.g. `"colgroup"` for grouped headers)
- Renders header text via children
- Spreads `restProps` onto the `<th>` element

## Props

- `colspan`: number (optional) -- number of columns this header cell spans
- `rowspan`: number (optional) -- number of rows this header cell spans
- `scope`: `"col" | "row" | "colgroup" | "rowgroup"` (default: `"col"`) -- header scope
- `children`: optional -- header cell content
- `...restProps`: unknown -- additional attributes spread onto the `<th>` element

## Usage

```html
<CalendarTable label="April 2026">
  <CalendarTableHead>
    <CalendarTableRow>
      <CalendarTableTD>Sun</CalendarTableTD>
      <CalendarTableTD>Mon</CalendarTableTD>
      <CalendarTableTD>Tue</CalendarTableTD>
      <CalendarTableTD>Wed</CalendarTableTD>
      <CalendarTableTD>Thu</CalendarTableTD>
      <CalendarTableTD>Fri</CalendarTableTD>
      <CalendarTableTD>Sat</CalendarTableTD>
    </CalendarTableRow>
  </CalendarTableHead>
  <CalendarTableBody>...</CalendarTableBody>
</CalendarTable>
```

## Keyboard Interactions

None. Header cells are not interactive.

## ARIA

`scope="col"` associates the header with its column for assistive technologies. Use `scope="colgroup"` together with `colspan` for grouped column headers (e.g. "Weekdays" / "Weekend").

## When to Use

- For day-of-week labels and other column headers in a calendar grid
- For grouped header cells via `colspan` / `rowspan`

## When Not to Use

- Do not use outside CalendarTable -- use TableTD or DataTableTD for other table types
- Do not use for date data cells -- use CalendarTableTD
- Do not use for column-wide styling hooks via `<colgroup>` / `<col>` -- write those directly inside CalendarTable

## Headless

This headless component renders a `<th>` element. The consumer provides all visual styling.

## Styles

The consumer provides all CSS styling. The component renders with a `.calendar-table-th` class for targeting.

## Testing

- Verify the component renders a `<th>` element
- Verify `scope="col"` is the default
- Verify `colspan` / `rowspan` are applied when set
- Verify pass-through attributes are applied

## Advice

- **Designers**: Keep header labels short and consistent (e.g. three-letter day abbreviations).
- **Developers**: Place CalendarTableTD elements inside a CalendarTableRow within CalendarTableHead.

## Composition

CalendarTableTD is part of the CalendarTable composition pattern: CalendarTable > CalendarTableHead > CalendarTableRow > CalendarTableTD.

## Related components

- `calendar-table` — a calendar table interactive grid for managing dates, days, etc. <table>
- `calendar-table-body` — a calendar table interactive grid tbody for managing dates, days, etc. <tbody>
- `calendar-table-foot` — a calendar table interactive grid tfoot for managing dates, days, etc. <tfoot>
- `calendar-table-head` — a calendar table interactive grid thead for managing dates, days, etc. <thead>
- `calendar-table-row` — a calendar table interactive grid row for managing dates, days, etc. <tr>
- `calendar-table-td` — a calendar table interactive grid data cell for managing dates, days, etc. <td>
- `table` — a table with rows and columns <table>

## References

- MDN th element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/th

---

Lily™ and Lily Design System™ are trademarks.
