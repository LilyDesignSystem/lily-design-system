# Sheet

a panel that slides in from a screen edge as an overlay

This is the Angular headless implementation. See `components/sheet/index.md`
in the canonical repo root for the cross-framework documentation.

## Selector

```html
<lily-sheet></lily-sheet>
```

## Files

- `Sheet.ts` — standalone Angular 20 component (signal inputs, OnPush)
- `Sheet.spec.ts` — vitest + TestBed render test

## Modality

While `open` is true the component renders a native `<dialog>` opened with
`showModal()` (falling back to the `open` attribute where `showModal` is
missing, as in jsdom): the page behind it is inert, Tab stays inside it,
Escape (keydown or the native `cancel` event) sets `open` to false, and focus
returns to the element that had it when the dialog opened.
