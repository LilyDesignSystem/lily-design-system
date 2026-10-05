# RadarChart

A headless wrapper for a chart plotting several axes from a shared centre as a polygon.

Renders `<figure role="img" aria-label="@Label">` around the consumer-supplied inline `<svg>`
(`ChildContent`). No drawing happens in the component. Pass `aria-describedby` as an unmatched
attribute to reference a description or a real `<table>` with the same data (the Svelte canonical
likewise has no separate table slot; the consumer places it alongside).

## Parameters

- `Label` (required) accessible name.
- `ChildContent` the inline svg.
- `CssClass` appended after `radar-chart`.
- Unmatched attributes are splatted onto the `<figure>`.

## Usage

```razor
<RadarChart Label="Describe the chart">
    <svg viewBox="0 0 10 10">...</svg>
</RadarChart>
```

Canonical documentation: `components/radar-chart/index.md`. No deviations from the Svelte canonical.

---

Lily(TM) and Lily Design System(TM) are trademarks.
