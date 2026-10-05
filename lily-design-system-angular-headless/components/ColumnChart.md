# ColumnChart

a vertical column chart visualization for displaying data

This is the Angular headless implementation. See `components/column-chart/index.md`
in the canonical repo root for the cross-framework documentation.

## Selector

```html
<lily-column-chart></lily-column-chart>
```

## Files

- `ColumnChart.ts` — standalone Angular 20 component (signal inputs, OnPush)
- `ColumnChart.spec.ts` — vitest + TestBed render test

## Data table alternative (added 2026-10-05)

The graphic is wrapped in `<div class="column-chart-graphic" role="img" aria-label>`; `role="img"` is **not** on the `<figure>` any more. The optional an element projected with the `dataTable` attribute (for example `<table dataTable>`) renders the accessible table in `<div class="column-chart-data-table">`, a **sibling** of the graphic and never inside it: `role="img"` makes its descendants presentational, so a table inside would be invisible to assistive technology. The data-table wrapper is always rendered (Angular cannot detect projected content) and is empty when nothing is projected. `describedBy` sets `aria-describedby` on the image wrapper. Without a data table the wrapper is not rendered (except Angular, noted above). **Breaking** for consumers that styled or queried `role="img"` on the figure.
