# HeatmapChart

A headless wrapper for a grid chart where cell colour encodes the value at each row and column.

Renders `<figure role="img" aria-label="@Label">` around the consumer-supplied inline `<svg>`
(`ChildContent`). No drawing happens in the component. Pass `aria-describedby` as an unmatched
attribute to reference a description or a real `<table>` with the same data (the Svelte canonical
likewise has no separate table slot; the consumer places it alongside).

## Parameters

- `Label` (required) accessible name.
- `ChildContent` the inline svg.
- `CssClass` appended after `heatmap-chart`.
- Unmatched attributes are splatted onto the `<figure>`.

## Usage

```razor
<HeatmapChart Label="Describe the chart">
    <svg viewBox="0 0 10 10">...</svg>
</HeatmapChart>
```

Canonical documentation: `components/heatmap-chart/index.md`. No deviations from the Svelte canonical.

---

Lily(TM) and Lily Design System(TM) are trademarks.
