# CalendarDayTable

A calendar grid showing a grid of the time slots of one day: one row per slot. Renders a `<table role="grid" data-view="day">`. A structural wrapper like `CalendarTable`.

Which grid: day = time-slot rows. The consumer owns locale formatting (`Intl`) and all cell content. Reuse the `CalendarTable*` sub-elements (head, body, foot, row, TH, TD); there are no `CalendarDayTable*` sub-elements.

## Props

- `label`: string (required) -- accessible name describing the period, applied via `aria-label`
- `caption`: string (optional) -- visible caption text displayed above the table
- default slot -- CalendarTableHead, CalendarTableBody, CalendarTableFoot elements
- Rest attributes (including `class`, merged after the base class `calendar-day-table`) are spread onto the `<table>`

## Usage

```vue
<CalendarDayTable label="Monday 6 January 2025">
  <CalendarTableHead>...</CalendarTableHead>
  <CalendarTableBody>...</CalendarTableBody>
</CalendarDayTable>
```

## Keyboard

None built-in; the consumer implements grid keyboard navigation.

## Deviations from Svelte

None. Vue merges the consumer `class` after the base class natively.
