# Tooltip

a small popup showing descriptive text on hover or focus

This is the Angular headless implementation. See `components/tooltip/index.md`
in the canonical repo root for the cross-framework documentation.

Angular inputs do not reach the inner element, so name the anchor in CSS on the class hook: `.tooltip { position-anchor: --feature; }`.

## Selector

```html
<lily-tooltip id="tip" label="Help" [visible]="visible()" />
```

## Files

- `Tooltip.ts` — standalone Angular 20 component (signal inputs, OnPush)
- `Tooltip.spec.ts` — vitest + TestBed render test
