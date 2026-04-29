# CalendarTable

An interactive calendar table that presents dates in a structured grid layout, typically organized by weeks and days, allowing users to view and interact with calendar data at a glance. Renders a `<table>` element with `role="grid"` and an accessible label. Supports an optional visible caption.

Compound component: use with CalendarTableHead, CalendarTableBody, CalendarTableFoot, CalendarTableRow, CalendarTableTD, and CalendarTableTD.

## Props

- `label`: string (required) -- accessible name describing the calendar period, applied via `aria-label`
- `caption`: string (optional) -- visible caption text displayed above the table
- `children`: Snippet (required) -- CalendarTableHead, CalendarTableBody, CalendarTableFoot elements
- `...restProps`: unknown -- additional attributes spread onto the `<table>`

## Usage

```svelte
<CalendarTable label="January 2025">
  <CalendarTableHead>
    <CalendarTableRow><th>Sun</th><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th></CalendarTableRow>
  </CalendarTableHead>
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
  </CalendarTableBody>
</CalendarTable>
```

## Accessibility

- `role="grid"` -- identifies the table as an interactive grid widget
- `aria-label={label}` -- provides an accessible name describing the calendar period
- `<caption>` -- visible accessible name when the caption prop is set

## References

- WAI-ARIA Grid Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/grid/
