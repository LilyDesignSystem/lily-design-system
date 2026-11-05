# TourListItem

one step in a tour guide list

This is the Angular headless implementation. See `components/tour-list-item/index.md`
in the canonical repo root for the cross-framework documentation.

The step's name is the consumer's words.

## Selector

Attribute selector on the native `<li>` — matches Angular Material's idiom
for list/table sub-elements, so there is no wrapper element between this
`<li>` and its parent (a wrapper broke a required parent-child
content-model relationship for assistive technology).

```html
<li lily-tour-list-item label="Welcome" [current]="true" [stepNumber]="1" [totalSteps]="3" stepTemplate="{label}, step {step} of {total}">...</li>
```

## Files

- `TourListItem.ts` — standalone Angular 20 component (signal inputs, OnPush)
- `TourListItem.spec.ts` — vitest + TestBed render test
