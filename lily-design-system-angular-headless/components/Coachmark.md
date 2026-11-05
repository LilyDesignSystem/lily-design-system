# Coachmark

an anchored popover that spotlights and explains a single feature

This is the Angular headless implementation. See `components/coachmark/index.md`
in the canonical repo root for the cross-framework documentation.

Angular inputs do not reach the inner element, so name the anchor in CSS on the class hook: `.coachmark { position-anchor: --feature; }`.

## Selector

```html
<lily-coachmark
  [open]="open()"
  title="New"
  dismissLabel="Close"
  (dismissed)="open.set(false)"
/>
```

## Files

- `Coachmark.ts` — standalone Angular 20 component (signal inputs, OnPush)
- `Coachmark.spec.ts` — vitest + TestBed render test
