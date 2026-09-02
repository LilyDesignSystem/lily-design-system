# DataTableTD

a data table interactive grid data cell for displaying and sorting tabular data <td>

This is the Angular headless implementation. See `components/data-table-td/index.md`
in the canonical repo root for the cross-framework documentation.

## Selector

Attribute selector on the native `<td>` — matches Angular Material's idiom
for list/table sub-elements, so there is no wrapper element between this
`<td>` and its parent (a wrapper broke a required parent-child
content-model relationship for assistive technology).

```html
<td lily-data-table-td></td>
```

## Files

- `DataTableTD.ts` — standalone Angular 20 component (signal inputs, OnPush)
- `DataTableTD.spec.ts` — vitest + TestBed render test
