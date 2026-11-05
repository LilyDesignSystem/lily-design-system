# FloatingPanel

a panel that floats above page content

This is the Angular headless implementation. See `components/floating-panel/index.md`
in the canonical repo root for the cross-framework documentation.

## Selector

```html
<lily-floating-panel
  label="Filters"
  [open]="open"
  >Content</lily-floating-panel
>
```

## Inputs

- `label`: string (required) -- accessible name of the region.
- `open`: boolean -- whether it shows. The consumer owns it: there is no Escape or light dismiss, because the popover is manual.
- `className`: string -- appended to the root class list.

## Files

- `FloatingPanel.ts` — standalone Angular 20 component (signal inputs, OnPush)
- `FloatingPanel.spec.ts` — vitest + TestBed render test
