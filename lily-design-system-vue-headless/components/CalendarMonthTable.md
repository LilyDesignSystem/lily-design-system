# CalendarMonthTable

A calendar grid showing a grid of the days of one month: week rows by seven day columns. Renders a `<table role="grid" data-view="month">`. A structural wrapper like `CalendarTable`.

Which grid: month = week rows x 7 day columns. The consumer owns locale formatting (`Intl`) and all cell content. Reuse the `CalendarTable*` sub-elements (head, body, foot, row, TH, TD); there are no `CalendarMonthTable*` sub-elements.

## Props

- `label`: string (required) -- accessible name describing the period, applied via `aria-label`
- `caption`: string (optional) -- visible caption text displayed above the table
- default slot -- CalendarTableHead, CalendarTableBody, CalendarTableFoot elements
- Rest attributes (including `class`, merged after the base class `calendar-month-table`) are spread onto the `<table>`

## Usage

```vue
<CalendarMonthTable label="January 2025">
  <CalendarTableHead>...</CalendarTableHead>
  <CalendarTableBody>...</CalendarTableBody>
</CalendarMonthTable>
```

## Keyboard

None built-in; the consumer implements grid keyboard navigation.

## Deviations from Svelte

None. Vue merges the consumer `class` after the base class natively.
