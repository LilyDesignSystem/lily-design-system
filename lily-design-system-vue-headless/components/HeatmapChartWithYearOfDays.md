# HeatmapChartWithYearOfDays

A headless wrapper for a year-of-days heatmap (one cell per day, week columns by weekday rows); specialises `HeatmapChart`. Renders `<figure>` holding a `<div class="heatmap-chart-with-year-of-days-graphic" role="img" aria-label>` around the consumer-supplied inline `<svg>`. No drawing happens in the component.

## Props

- `label`: string (required) -- accessible name for the chart, applied via `aria-label`
- `year`: number (required) -- the calendar year shown (`data-year`)
- `weekStart`: number (required) -- first weekday row, 0 = Sunday … 6 = Saturday (`data-week-start`); no default
- default slot -- the inline `<svg>`
- Rest attributes (including `class`, merged after the base class `heatmap-chart-with-year-of-days`, and `aria-describedby`) are spread onto the `<figure>`

## Usage

```vue
<HeatmapChartWithYearOfDays label="Activity per day in 2026" :year="2026" :week-start="1" aria-describedby="chart-data">
  <svg viewBox="0 0 10 10">...</svg>
</HeatmapChartWithYearOfDays>
```

## Keyboard

None; the chart is a single image to assistive technology. Point `aria-describedby` at a real data table as the accessible alternative.

## Deviations from Svelte

None. The `children` snippet is the default slot.

## Data table alternative (added 2026-10-05)

The graphic is wrapped in `<div class="heatmap-chart-with-year-of-days-graphic" role="img" aria-label>`; `role="img"` is **not** on the `<figure>` any more. The optional the `dataTable` named slot renders the accessible table in `<div class="heatmap-chart-with-year-of-days-data-table">`, a **sibling** of the graphic and never inside it: `role="img"` makes its descendants presentational, so a table inside would be invisible to assistive technology. Without a data table the wrapper is not rendered (except Angular, noted above).
