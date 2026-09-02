# CollectionListItem

one item in a collection list with optional image, heading, meta, and description

This is the Angular headless implementation. See `components/collection-list-item/index.md`
in the canonical repo root for the cross-framework documentation.

## Selector

Attribute selector on the native `<li>` — matches Angular Material's idiom
for list/table sub-elements, so there is no wrapper element between this
`<li>` and its parent (a wrapper broke a required parent-child
content-model relationship for assistive technology).

```html
<li lily-collection-list-item></li>
```

## Files

- `CollectionListItem.ts` — standalone Angular 20 component (signal inputs, OnPush)
- `CollectionListItem.spec.ts` — vitest + TestBed render test
