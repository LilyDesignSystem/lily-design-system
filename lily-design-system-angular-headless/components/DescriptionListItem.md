# DescriptionListItem

one key-value pair in a description list using dt and dd elements

This is the Angular headless implementation. See `components/description-list-item/index.md`
in the canonical repo root for the cross-framework documentation.

## Selector

Attribute selector on the native `<div>` — matches Angular Material's idiom
for list/table sub-elements, so there is no wrapper element between this
`<div>` and its parent `<dl>` (a wrapper broke a required parent-child
content-model relationship for assistive technology).

```html
<div lily-description-list-item>
  <dt>Name</dt>
  <dd>Ada Lovelace</dd>
</div>
```

## Files

- `DescriptionListItem.ts` — standalone Angular 20 component (signal inputs, OnPush)
- `DescriptionListItem.spec.ts` — vitest + TestBed render test
