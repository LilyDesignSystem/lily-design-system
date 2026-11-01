# Details

a disclosure widget that shows and hides content

This is the Angular headless implementation. See `components/details/index.md`
in the canonical repo root for the cross-framework documentation.

## Selector

```html
<lily-details summary="Opening times" [(open)]="open">
  <p>Monday to Friday, 9am to 5pm.</p>
</lily-details>
```

## Files

- `Details.ts` — standalone Angular 20 component (signal inputs, OnPush)
- `Details.spec.ts` — vitest + TestBed render test
