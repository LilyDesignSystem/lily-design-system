# HeatmapChartWithYearOfDays

A headless wrapper for a grid chart where cell colour encodes the value at each row and column.

Renders `<figure>` holding a `<div class="heatmap-chart-with-year-of-days-graphic" role="img" aria-label>` around the consumer-supplied inline `<svg>`
(`ChildContent`). No drawing happens in the component. Pass `aria-describedby` as an unmatched
attribute to reference a description or a real `<table>` with the same data (the Svelte canonical
likewise has no separate table slot; the consumer places it alongside).

## Parameters

- `Label` (required) accessible name.
- `Year` (required) the calendar year shown (`data-year`).
- `WeekStart` (required) first weekday row, 0 = Sunday … 6 = Saturday (`data-week-start`); no default.
- `ChildContent` the inline svg.
- `CssClass` appended after `heatmap-chart-with-year-of-days`.
- Unmatched attributes are splatted onto the `<figure>`.

## Usage

```razor
<HeatmapChartWithYearOfDays Label="Activity per day in 2026" Year="2026" WeekStart="1">
    <svg viewBox="0 0 10 10">...</svg>
</HeatmapChartWithYearOfDays>
```

Canonical documentation: `components/heatmap-chart-with-year-of-days/index.md`. No deviations from the Svelte canonical.

---

Lily(TM) and Lily Design System(TM) are trademarks.

## Data table alternative (added 2026-10-05)

The graphic is wrapped in `<div class="heatmap-chart-with-year-of-days-graphic" role="img" aria-label>`; `role="img"` is **not** on the `<figure>` any more. The optional the `DataTable` render-fragment parameter renders the accessible table in `<div class="heatmap-chart-with-year-of-days-data-table">`, a **sibling** of the graphic and never inside it: `role="img"` makes its descendants presentational, so a table inside would be invisible to assistive technology. Unmatched attributes, including any `aria-describedby`, still spread onto the `<figure>`. Without a data table the wrapper is not rendered (except Angular, noted above).
