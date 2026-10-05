# CalendarYearTable

A calendar grid showing a grid of the twelve months of one year (typically 3 x 4 or 4 x 3 month cells). Renders a `<table role="grid" data-view="year">`. A structural wrapper like `CalendarTable`.

Which grid: year = 12 month cells. The consumer owns locale formatting (`Intl`) and all cell content. Reuse the `CalendarTable*` sub-elements (head, body, foot, row, TH, TD); there are no `CalendarYearTable*` sub-elements.

## Props

- `label`: string (required) -- accessible name describing the period, applied via `aria-label`
- `caption`: string (optional) -- visible caption text displayed above the table
- default slot -- CalendarTableHead, CalendarTableBody, CalendarTableFoot elements
- Rest attributes (including `class`, merged after the base class `calendar-year-table`) are spread onto the `<table>`

## Usage

```vue
<CalendarYearTable label="2025">
  <CalendarTableHead>...</CalendarTableHead>
  <CalendarTableBody>...</CalendarTableBody>
</CalendarYearTable>
```

## Keyboard

None built-in; the consumer implements grid keyboard navigation.

## Deviations from Svelte

None. Vue merges the consumer `class` after the base class natively.
