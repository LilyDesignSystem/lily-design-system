# DataTableHead

a data table interactive grid thead for displaying and sorting tabular data <thead>

This is the Angular headless implementation. See `components/data-table-head/index.md`
in the canonical repo root for the cross-framework documentation.

## Selector

Attribute selector on the native `<thead>` — matches Angular Material's idiom
for list/table sub-elements, so there is no wrapper element between this
`<thead>` and its parent (a wrapper broke a required parent-child
content-model relationship for assistive technology).

```html
<thead lily-data-table-head></thead>
```

## Files

- `DataTableHead.ts` — standalone Angular 20 component (signal inputs, OnPush)
- `DataTableHead.spec.ts` — vitest + TestBed render test
