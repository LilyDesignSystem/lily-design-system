# TableHead

a table interactive grid thead <thead>

This is the Angular headless implementation. See `components/table-head/index.md`
in the canonical repo root for the cross-framework documentation.

## Selector

Attribute selector on the native `<thead>` — matches Angular Material's idiom
for list/table sub-elements, so there is no wrapper element between this
`<thead>` and its parent (a wrapper broke a required parent-child
content-model relationship for assistive technology).

```html
<thead lily-table-head></thead>
```

## Files

- `TableHead.ts` — standalone Angular 20 component (signal inputs, OnPush)
- `TableHead.spec.ts` — vitest + TestBed render test
