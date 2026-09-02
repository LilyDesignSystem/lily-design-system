# DataTableFoot

a data table interactive grid tfoot for displaying and sorting tabular data <tfoot>

This is the Angular headless implementation. See `components/data-table-foot/index.md`
in the canonical repo root for the cross-framework documentation.

## Selector

Attribute selector on the native `<tfoot>` — matches Angular Material's idiom
for list/table sub-elements, so there is no wrapper element between this
`<tfoot>` and its parent (a wrapper broke a required parent-child
content-model relationship for assistive technology).

```html
<tfoot lily-data-table-foot></tfoot>
```

## Files

- `DataTableFoot.ts` — standalone Angular 20 component (signal inputs, OnPush)
- `DataTableFoot.spec.ts` — vitest + TestBed render test
