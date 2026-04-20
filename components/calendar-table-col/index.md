# Calendar Table Col

CalendarTableCol is a headless component that renders a `<th scope="col">` element — a column header cell — intended to live inside a CalendarTableRow within CalendarTableHead. Use it to label day-of-week or other column headers in a calendar grid.

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
      <CalendarTableCol>Sun</CalendarTableCol>
      <CalendarTableCol>Mon</CalendarTableCol>
      <CalendarTableCol>Tue</CalendarTableCol>
      <CalendarTableCol>Wed</CalendarTableCol>
      <CalendarTableCol>Thu</CalendarTableCol>
      <CalendarTableCol>Fri</CalendarTableCol>
      <CalendarTableCol>Sat</CalendarTableCol>
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

- Do not use outside CalendarTable -- use TableCol or DataTableCol for other table types
- Do not use for date data cells -- use CalendarTableData
- Do not use for column-wide styling hooks via `<colgroup>` / `<col>` -- write those directly inside CalendarTable

## Headless

This headless component renders a `<th>` element. The consumer provides all visual styling.

## Styles

The consumer provides all CSS styling. The component renders with a `.calendar-table-col` class for targeting.

## Testing

- Verify the component renders a `<th>` element
- Verify `scope="col"` is the default
- Verify `colspan` / `rowspan` are applied when set
- Verify pass-through attributes are applied

## Advice

- **Designers**: Keep header labels short and consistent (e.g. three-letter day abbreviations).
- **Developers**: Place CalendarTableCol elements inside a CalendarTableRow within CalendarTableHead.

## Composition

CalendarTableCol is part of the CalendarTable composition pattern: CalendarTable > CalendarTableHead > CalendarTableRow > CalendarTableCol.

## References

- MDN th element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/th
