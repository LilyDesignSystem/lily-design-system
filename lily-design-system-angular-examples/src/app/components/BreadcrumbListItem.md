# BreadcrumbListItem

one breadcrumb list item in the trail

This is the Angular headless implementation. See `components/breadcrumb-list-item/index.md`
in the canonical repo root for the cross-framework documentation.

## Selector

Attribute selector on the native `<li>` — matches Angular Material's idiom
for list/table sub-elements, so there is no wrapper element between this
`<li>` and its parent (a wrapper broke a required parent-child
content-model relationship for assistive technology).

```html
<li lily-breadcrumb-list-item></li>
```

## Files

- `BreadcrumbListItem.ts` — standalone Angular 20 component (signal inputs, OnPush)
- `BreadcrumbListItem.spec.ts` — vitest + TestBed render test
