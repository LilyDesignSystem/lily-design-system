# RadarChart

A headless wrapper for a chart plotting several axes from a shared centre as a polygon. Renders `<figure role="img" aria-label>` around the consumer-supplied inline `<svg>`. No drawing happens in the component.

## Props

- `label`: string (required) -- accessible name for the chart, applied via `aria-label`
- default slot -- the inline `<svg>`
- Rest attributes (including `class`, merged after the base class `radar-chart`, and `aria-describedby`) are spread onto the `<figure>`

## Usage

```vue
<RadarChart label="Describe the chart" aria-describedby="chart-data">
  <svg viewBox="0 0 10 10">...</svg>
</RadarChart>
```

## Keyboard

None; the chart is a single image to assistive technology. Point `aria-describedby` at a real data table as the accessible alternative.

## Deviations from Svelte

None. The `children` snippet is the default slot.
