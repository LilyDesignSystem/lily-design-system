# HeatmapChart

A grid chart where cell colour encodes the value at each row and column.

Headless wrapper: `<figure role="img" aria-label>` around the consumer-supplied inline `<svg>`. No drawing happens in the component. Point `aria-describedby` (passed through as a rest prop) at a text description or a real `<table>` carrying the same data.

## Props

- `className`: string (optional) -- CSS class appended to `heatmap-chart`
- `label`: string (required) -- accessible name via `aria-label`
- `children`: ReactNode (required) -- the inline `<svg>`
- `...restProps`: unknown -- additional attributes spread onto the `<figure>`

## Usage

```tsx
<HeatmapChart label="Quarterly figures" aria-describedby="data">
  <svg viewBox="0 0 10 10">...</svg>
</HeatmapChart>
<table id="data">...</table>
```

## Deviations from Svelte

None. (The Svelte version takes the svg as a snippet; React uses `children`. The optional data-table alternative is a sibling referenced via `aria-describedby`, as in Svelte.)
