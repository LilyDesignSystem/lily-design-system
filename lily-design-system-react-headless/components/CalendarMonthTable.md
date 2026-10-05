# CalendarMonthTable

A grid of the days of one month: week rows by seven day columns.

Structural wrapper like `CalendarTable`: `<table role="grid" aria-label data-view="month">`. Grid shape for this view: week rows x 7 day columns. The consumer reuses the existing `CalendarTable*` sub-elements (there are no `CalendarMonthTable*` sub-elements), supplies the cell content, and owns locale formatting (`Intl`) and grid keyboard navigation.

## Props

- `className`: string (optional) -- CSS class appended to `calendar-month-table`
- `label`: string (required) -- accessible name via `aria-label`
- `caption`: string (optional) -- visible `<caption>`
- `children`: ReactNode (required) -- CalendarTableHead / Body / Foot elements
- `...restProps`: unknown -- additional attributes spread onto the `<table>`

## Usage

```tsx
<CalendarMonthTable label="January 2025">
  <CalendarTableBody>...</CalendarTableBody>
</CalendarMonthTable>
```

## Deviations from Svelte

None.
