# TableBody

a table interactive grid tbody <tbody>

This is the Angular headless implementation. See `components/table-body/index.md`
in the canonical repo root for the cross-framework documentation.

## Selector

Attribute selector on the native `<tbody>` — matches Angular Material's idiom
for list/table sub-elements, so there is no wrapper element between this
`<tbody>` and its parent (a wrapper broke a required parent-child
content-model relationship for assistive technology).

```html
<tbody lily-table-body></tbody>
```

## Files

- `TableBody.ts` — standalone Angular 20 component (signal inputs, OnPush)
- `TableBody.spec.ts` — vitest + TestBed render test
