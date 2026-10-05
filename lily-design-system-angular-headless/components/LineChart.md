# LineChart

a line chart visualization connecting data points to display data

This is the Angular headless implementation. See `components/line-chart/index.md`
in the canonical repo root for the cross-framework documentation.

## Selector

```html
<lily-line-chart></lily-line-chart>
```

## Files

- `LineChart.ts` — standalone Angular 20 component (signal inputs, OnPush)
- `LineChart.spec.ts` — vitest + TestBed render test

## Data table alternative (added 2026-10-05)

The graphic is wrapped in `<div class="line-chart-graphic" role="img" aria-label>`; `role="img"` is **not** on the `<figure>` any more. The optional an element projected with the `dataTable` attribute (for example `<table dataTable>`) renders the accessible table in `<div class="line-chart-data-table">`, a **sibling** of the graphic and never inside it: `role="img"` makes its descendants presentational, so a table inside would be invisible to assistive technology. The data-table wrapper is always rendered (Angular cannot detect projected content) and is empty when nothing is projected. `describedBy` sets `aria-describedby` on the image wrapper. Without a data table the wrapper is not rendered (except Angular, noted above). **Breaking** for consumers that styled or queried `role="img"` on the figure.
