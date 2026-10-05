# ChoroplethChart

A map chart that shades regions by the value of a measure.

Headless wrapper: `<figure>` holding a `<div class="choropleth-chart-graphic" role="img" aria-label>` around the consumer-supplied inline `<svg>`. No drawing happens in the component. Point `aria-describedby` (passed through as a rest prop) at a text description or a real `<table>` carrying the same data.

## Props

- `className`: string (optional) -- CSS class appended to `choropleth-chart`
- `label`: string (required) -- accessible name via `aria-label`
- `children`: ReactNode (required) -- the inline `<svg>`
- `...restProps`: unknown -- additional attributes spread onto the `<figure>`

## Usage

```tsx
<ChoroplethChart label="Quarterly figures" aria-describedby="data">
  <svg viewBox="0 0 10 10">...</svg>
</ChoroplethChart>
<table id="data">...</table>
```

## Deviations from Svelte

None. (The Svelte version takes the svg as a snippet; React uses `children`. The optional data-table alternative is a sibling referenced via `aria-describedby`, as in Svelte.)

## Data table alternative (added 2026-10-05)

The graphic is wrapped in `<div class="choropleth-chart-graphic" role="img" aria-label>`; `role="img"` is **not** on the `<figure>` any more. The optional the `dataTable` prop (a `ReactNode`) renders the accessible table in `<div class="choropleth-chart-data-table">`, a **sibling** of the graphic and never inside it: `role="img"` makes its descendants presentational, so a table inside would be invisible to assistive technology. Without a data table the wrapper is not rendered (except Angular, noted above).
