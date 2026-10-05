# CalendarYearTable

A grid of the twelve months of one year (typically 3 x 4 or 4 x 3 month cells).

Structural wrapper like `CalendarTable`: `<table role="grid" aria-label data-view="year">`. Grid shape for this view: 12 month cells. The consumer reuses the existing `CalendarTable*` sub-elements (there are no `CalendarYearTable*` sub-elements), supplies the cell content, and owns locale formatting (`Intl`) and grid keyboard navigation.

## Props

- `className`: string (optional) -- CSS class appended to `calendar-year-table`
- `label`: string (required) -- accessible name via `aria-label`
- `caption`: string (optional) -- visible `<caption>`
- `children`: ReactNode (required) -- CalendarTableHead / Body / Foot elements
- `...restProps`: unknown -- additional attributes spread onto the `<table>`

## Usage

```tsx
<CalendarYearTable label="2025">
  <CalendarTableBody>...</CalendarTableBody>
</CalendarYearTable>
```

## Deviations from Svelte

None.
