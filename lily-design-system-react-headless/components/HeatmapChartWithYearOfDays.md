# HeatmapChartWithYearOfDays

A year-of-days heatmap: one cell per day, week columns by weekday rows. Specialises `HeatmapChart`.

Headless wrapper: `<figure>` holding a `<div class="heatmap-chart-with-year-of-days-graphic" role="img" aria-label>` around the consumer-supplied inline `<svg>`. No drawing happens in the component. Point `aria-describedby` (passed through as a rest prop) at a text description or a real `<table>` carrying the same data.

## Props

- `className`: string (optional) -- CSS class appended to `heatmap-chart-with-year-of-days`
- `label`: string (required) -- accessible name via `aria-label`
- `year`: number (required) -- the calendar year shown (`data-year`)
- `weekStart`: number (required) -- first weekday row, 0 = Sunday … 6 = Saturday (`data-week-start`); no default
- `children`: ReactNode (required) -- the inline `<svg>`
- `...restProps`: unknown -- additional attributes spread onto the `<figure>`

## Usage

```tsx
<HeatmapChartWithYearOfDays label="Activity per day in 2026" year={2026} weekStart={1} aria-describedby="data">
  <svg viewBox="0 0 10 10">...</svg>
</HeatmapChartWithYearOfDays>
<table id="data">...</table>
```

## Deviations from Svelte

None. (The Svelte version takes the svg as a snippet; React uses `children`. The optional data-table alternative is a sibling referenced via `aria-describedby`, as in Svelte.)

## Data table alternative (added 2026-10-05)

The graphic is wrapped in `<div class="heatmap-chart-with-year-of-days-graphic" role="img" aria-label>`; `role="img"` is **not** on the `<figure>` any more. The optional the `dataTable` prop (a `ReactNode`) renders the accessible table in `<div class="heatmap-chart-with-year-of-days-data-table">`, a **sibling** of the graphic and never inside it: `role="img"` makes its descendants presentational, so a table inside would be invisible to assistive technology. Without a data table the wrapper is not rendered (except Angular, noted above).
