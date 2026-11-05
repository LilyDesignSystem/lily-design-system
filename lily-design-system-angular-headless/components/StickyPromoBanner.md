# StickyPromoBanner

a fixed-position promotional banner with a dismiss button

This is the Angular headless implementation. See `components/sticky-promo-banner/index.md`
in the canonical repo root for the cross-framework documentation.

The dismiss button is always rendered: Angular cannot ask whether `dismissed` has a listener.

## Selector

```html
<lily-sticky-promo-banner
  label="Offer"
  dismissLabel="Dismiss"
  [open]="open()"
  (dismissed)="open.set(false)"
  >...</lily-sticky-promo-banner
>
```

## Files

- `StickyPromoBanner.ts` — standalone Angular 20 component (signal inputs, OnPush)
- `StickyPromoBanner.spec.ts` — vitest + TestBed render test
