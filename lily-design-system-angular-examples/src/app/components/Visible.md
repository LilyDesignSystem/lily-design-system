# Visible

an IntersectionObserver wrapper that exposes element visibility state

This is the Angular headless implementation. See `components/visible/index.md`
in the canonical repo root for the cross-framework documentation.

`data-visible` and `[(visible)]` say whether it is on screen.

## Selector

```html
<lily-visible
  [once]="true"
  [(visible)]="seen"
  >...</lily-visible
>
```

## Files

- `Visible.ts` — standalone Angular 20 component (signal inputs, OnPush)
- `Visible.spec.ts` — vitest + TestBed render test
