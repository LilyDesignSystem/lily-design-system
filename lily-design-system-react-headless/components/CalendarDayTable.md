# CalendarDayTable

A grid of the time slots of one day: one row per slot.

Structural wrapper like `CalendarTable`: `<table role="grid" aria-label data-view="day">`. Grid shape for this view: time-slot rows. The consumer reuses the existing `CalendarTable*` sub-elements (there are no `CalendarDayTable*` sub-elements), supplies the cell content, and owns locale formatting (`Intl`) and grid keyboard navigation.

## Props

- `className`: string (optional) -- CSS class appended to `calendar-day-table`
- `label`: string (required) -- accessible name via `aria-label`
- `caption`: string (optional) -- visible `<caption>`
- `children`: ReactNode (required) -- CalendarTableHead / Body / Foot elements
- `...restProps`: unknown -- additional attributes spread onto the `<table>`

## Usage

```tsx
<CalendarDayTable label="Monday 6 January 2025">
  <CalendarTableBody>...</CalendarTableBody>
</CalendarDayTable>
```

## Deviations from Svelte

None.
