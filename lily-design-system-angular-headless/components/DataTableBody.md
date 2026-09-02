# DataTableBody

a data table interactive grid tbody for displaying and sorting tabular data <tbody>

This is the Angular headless implementation. See `components/data-table-body/index.md`
in the canonical repo root for the cross-framework documentation.

## Selector

Attribute selector on the native `<tbody>` — matches Angular Material's idiom
for list/table sub-elements, so there is no wrapper element between this
`<tbody>` and its parent (a wrapper broke a required parent-child
content-model relationship for assistive technology).

```html
<tbody lily-data-table-body></tbody>
```

## Files

- `DataTableBody.ts` — standalone Angular 20 component (signal inputs, OnPush)
- `DataTableBody.spec.ts` — vitest + TestBed render test
