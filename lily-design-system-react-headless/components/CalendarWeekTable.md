# CalendarWeekTable

A grid of the seven days of one week as day columns.

Structural wrapper like `CalendarTable`: `<table role="grid" aria-label data-view="week">`. Grid shape for this view: 7 day columns. The consumer reuses the existing `CalendarTable*` sub-elements (there are no `CalendarWeekTable*` sub-elements), supplies the cell content, and owns locale formatting (`Intl`) and grid keyboard navigation.

## Props

- `className`: string (optional) -- CSS class appended to `calendar-week-table`
- `label`: string (required) -- accessible name via `aria-label`
- `caption`: string (optional) -- visible `<caption>`
- `children`: ReactNode (required) -- CalendarTableHead / Body / Foot elements
- `...restProps`: unknown -- additional attributes spread onto the `<table>`

## Usage

```tsx
<CalendarWeekTable label="Week of 6 January 2025">
  <CalendarTableBody>...</CalendarTableBody>
</CalendarWeekTable>
```

## Deviations from Svelte

None.
