# DataTableRow

a data table interactive grid row for displaying and sorting tabular data <tr>

This is the Angular headless implementation. See `components/data-table-row/index.md`
in the canonical repo root for the cross-framework documentation.

## Selector

Attribute selector on the native `<tr>` — matches Angular Material's idiom
for list/table sub-elements, so there is no wrapper element between this
`<tr>` and its parent (a wrapper broke a required parent-child
content-model relationship for assistive technology).

```html
<tr lily-data-table-row></tr>
```

## Files

- `DataTableRow.ts` — standalone Angular 20 component (signal inputs, OnPush)
- `DataTableRow.spec.ts` — vitest + TestBed render test
