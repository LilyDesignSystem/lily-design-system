# SankeyChart

A headless wrapper for a flow chart where link width encodes quantity. This is the Angular headless implementation. See `components/sankey-chart/index.md` for the full canonical documentation.

## Contract

- Root `<figure class="sankey-chart {className}" role="img" aria-label={label}>` inside the `lily-sankey-chart` host; the consumer-supplied inline `<svg>` is projected content. No drawing happens here.
- Inputs: `label` (required), `describedBy` (id for `aria-describedby`, e.g. a real data table), `className`.
- Keyboard: none.

## Deviation

Angular cannot spread rest props onto an inner element, so `aria-describedby` is the explicit `describedBy` input and other attributes land on the host.
