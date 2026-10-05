# ChoroplethChart

A headless wrapper for a map chart that shades regions by the value of a measure.

Renders `<figure>` holding a `<div class="choropleth-chart-graphic" role="img" aria-label>` around the consumer-supplied inline `<svg>`
(`ChildContent`). No drawing happens in the component. Pass `aria-describedby` as an unmatched
attribute to reference a description or a real `<table>` with the same data (the Svelte canonical
likewise has no separate table slot; the consumer places it alongside).

## Parameters

- `Label` (required) accessible name.
- `ChildContent` the inline svg.
- `CssClass` appended after `choropleth-chart`.
- Unmatched attributes are splatted onto the `<figure>`.

## Usage

```razor
<ChoroplethChart Label="Describe the chart">
    <svg viewBox="0 0 10 10">...</svg>
</ChoroplethChart>
```

Canonical documentation: `components/choropleth-chart/index.md`. No deviations from the Svelte canonical.

---

Lily(TM) and Lily Design System(TM) are trademarks.

## Data table alternative (added 2026-10-05)

The graphic is wrapped in `<div class="choropleth-chart-graphic" role="img" aria-label>`; `role="img"` is **not** on the `<figure>` any more. The optional the `DataTable` render-fragment parameter renders the accessible table in `<div class="choropleth-chart-data-table">`, a **sibling** of the graphic and never inside it: `role="img"` makes its descendants presentational, so a table inside would be invisible to assistive technology. Unmatched attributes, including any `aria-describedby`, still spread onto the `<figure>`. Without a data table the wrapper is not rendered (except Angular, noted above).
