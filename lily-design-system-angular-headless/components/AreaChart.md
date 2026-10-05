# AreaChart

an area chart visualization showing sized components in continuous data

This is the Angular headless implementation. See `components/area-chart/index.md`
in the canonical repo root for the cross-framework documentation.

## Selector

```html
<lily-area-chart></lily-area-chart>
```

## Files

- `AreaChart.ts` — standalone Angular 20 component (signal inputs, OnPush)
- `AreaChart.spec.ts` — vitest + TestBed render test

## Data table alternative (added 2026-10-05)

The graphic is wrapped in `<div class="area-chart-graphic" role="img" aria-label>`; `role="img"` is **not** on the `<figure>` any more. The optional an element projected with the `dataTable` attribute (for example `<table dataTable>`) renders the accessible table in `<div class="area-chart-data-table">`, a **sibling** of the graphic and never inside it: `role="img"` makes its descendants presentational, so a table inside would be invisible to assistive technology. The data-table wrapper is always rendered (Angular cannot detect projected content) and is empty when nothing is projected. `describedBy` sets `aria-describedby` on the image wrapper. Without a data table the wrapper is not rendered (except Angular, noted above). **Breaking** for consumers that styled or queried `role="img"` on the figure.
