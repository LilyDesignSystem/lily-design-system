# Calendar Table Head

A calendar table head is the header section of a calendar grid, wrapping one or more rows that label the columns of the calendar. Typically contains a single row with day-of-week abbreviations (e.g., Sun, Mon, Tue). It is designed to be used inside a CalendarTable `<table>` structure.

The component renders a `<thead>` element and passes through its children, which are expected to be CalendarTableRow or `<tr>` elements containing `<th>` header cells.

## Implementation Notes

- Renders as a `<thead>` element for the header section of a calendar grid
- Children should be one or more rows with `<th>` cells labeling calendar columns (e.g., days of the week)
- Designed to be used inside a CalendarTable `<table>` structure
- Spreads `restProps` onto the `<thead>` element for consumer customization
- No internal state -- purely a structural wrapper

## Props

- `children`: slot (required) -- header rows, typically containing day-of-week labels
- `...restProps`: Any additional HTML attributes passed to the `<thead>` element

## Usage

```html
<CalendarTable label="April 2026">
  <CalendarTableHead>
    <CalendarTableRow>
      <th><abbr title="Monday">Mon</abbr></th>
      <th><abbr title="Tuesday">Tue</abbr></th>
      <th><abbr title="Wednesday">Wed</abbr></th>
      <th><abbr title="Thursday">Thu</abbr></th>
      <th><abbr title="Friday">Fri</abbr></th>
      <th><abbr title="Saturday">Sat</abbr></th>
      <th><abbr title="Sunday">Sun</abbr></th>
    </CalendarTableRow>
  </CalendarTableHead>
  <CalendarTableBody>...</CalendarTableBody>
</CalendarTable>
```

## Keyboard Interactions

None -- this component is a passive container. Keyboard navigation is handled by the parent CalendarTable grid.

## ARIA

- Implicit `rowgroup` role from the `<thead>` element -- groups the header rows of the grid

## When to Use

- Use inside CalendarTable to provide the `<thead>` for the calendar grid
- Use to display day-of-week column labels such as Mon, Tue, Wed
- Use when you need semantic column headers so screen readers announce day names as users navigate cells

## When Not to Use

- Do not use outside CalendarTable -- use TableHead or DataTableHead for other table types
- Do not use for calendar body rows -- use CalendarTableBody for the main date grid

## Headless

This component provides a semantic `<thead>` element with implicit `rowgroup` role and zero visual styling. The consumer is responsible for all CSS including header cell typography, alignment, background color, bottom borders, and any abbreviation formatting for day names.


## Styles

The consumer provides all CSS styling. The component renders with a `.calendar-table-head` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<thead>` element with class `calendar-table-head`
- Verify pass-through attributes are applied

## Advice

- **Designers**: Keep day-of-week labels short (2-3 characters) to fit within cell widths. Use a visually distinct style (bold, different background) to separate the header from body rows.
- **Developers**: Use `<th>` elements inside the header row for proper column header semantics. Consider using `<abbr>` within `<th>` for abbreviated day names with full title attributes.

## Composition

CalendarTableHead is part of the CalendarTable composition pattern:

- **CalendarTable** -- outer `<table>` with `role="grid"`.
- **CalendarTableHead** -- `<thead>` for day-of-week column headers.
- **CalendarTableBody** -- `<tbody>` for day rows.
- **CalendarTableRow** -- `<tr>` within any section.

```html
<CalendarTable label="January 2025">
  <CalendarTableHead>
    <tr><th>Sun</th><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th></tr>
  </CalendarTableHead>
  <CalendarTableBody>...</CalendarTableBody>
</CalendarTable>
```

## References

- WAI-ARIA Grid Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/grid/
