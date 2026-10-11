# ChoroplethChart

A headless wrapper for a map chart that shades regions by the value of a measure. This is the Angular headless implementation. See `components/choropleth-chart/index.md` for the full canonical documentation.

## Contract

- Root `<figure class="choropleth-chart {className}>` inside the `lily-choropleth-chart` host; the consumer-supplied inline `<svg>` is projected content. No drawing happens here.
- Inputs: `label` (required), `describedBy` (id for `aria-describedby`, e.g. a real data table), `className`.
- Keyboard: none.

## Deviation

Angular cannot spread rest props onto an inner element, so `aria-describedby` is the explicit `describedBy` input and other attributes land on the host.

## Data table alternative (added 2026-10-05)

The graphic is wrapped in `<div class="choropleth-chart-graphic" role="img" aria-label>`; `role="img"` is **not** on the `<figure>` any more. The optional an element projected with the `dataTable` attribute (for example `<table dataTable>`) renders the accessible table in `<div class="choropleth-chart-data-table">`, a **sibling** of the graphic and never inside it: `role="img"` makes its descendants presentational, so a table inside would be invisible to assistive technology. The data-table wrapper is always rendered (Angular cannot detect projected content) and is empty when nothing is projected. `describedBy` now sets `aria-describedby` on the image wrapper. Without a data table the wrapper is not rendered (except Angular, noted above).
