# FloatButton

a floating action button anchored to a viewport corner

This is the Angular headless implementation. See `components/float-button/index.md`
in the canonical repo root for the cross-framework documentation.

A native click bubbles to the host, so listen with `(click)`.

## Selector

```html
<lily-float-button label="Help" position="bottom-right" (click)="openHelp()">?</lily-float-button>
```

## Files

- `FloatButton.ts` — standalone Angular 20 component (signal inputs, OnPush)
- `FloatButton.spec.ts` — vitest + TestBed render test
