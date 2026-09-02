# StepListItem

one step in a step list with status of waiting, in progress, finished, or error

This is the Angular headless implementation. See `components/step-list-item/index.md`
in the canonical repo root for the cross-framework documentation.

## Selector

Attribute selector on the native `<li>` — matches Angular Material's idiom
for list/table sub-elements, so there is no wrapper element between this
`<li>` and its parent (a wrapper broke a required parent-child
content-model relationship for assistive technology).

```html
<li lily-step-list-item></li>
```

## Files

- `StepListItem.ts` — standalone Angular 20 component (signal inputs, OnPush)
- `StepListItem.spec.ts` — vitest + TestBed render test
