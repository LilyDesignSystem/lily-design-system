# Option

an option element within a select dropdown

This is the Angular headless implementation. See `components/option/index.md`
in the canonical repo root for the cross-framework documentation.

## Selector

Attribute selector on the native `<option>` — matches Angular Material's idiom
for list/table sub-elements, so there is no wrapper element between this
`<option>` and its parent (a wrapper broke a required parent-child
content-model relationship for assistive technology).

```html
<option lily-option></option>
```

## Files

- `Option.ts` — standalone Angular 20 component (signal inputs, OnPush)
- `Option.spec.ts` — vitest + TestBed render test
