# ScrollerBase

a low-level scroll position tracking primitive for scrollytelling

This is the Angular headless implementation. See `components/scroller-base/index.md`
in the canonical repo root for the cross-framework documentation.

Each direct child is a step. `progressChange` is 0 to 1 through the page.

## Selector

```html
<lily-scroller-base (indexChange)="step.set($event)">
  <section>One</section>
</lily-scroller-base>
```

## Files

- `ScrollerBase.ts` — standalone Angular 20 component (signal inputs, OnPush)
- `ScrollerBase.spec.ts` — vitest + TestBed render test
