# SelectWithExtras

a select dropdown with additional features like search or groups

This is the Angular headless implementation. See `components/select-with-extras/index.md`
in the canonical repo root for the cross-framework documentation.

Mark the extras with the `before` or `after` attribute; the rest is the options.

## Selector

```html
<lily-select-with-extras label="Colour" [(value)]="colour">
  <span before>Before</span>
  <option value="red">Red</option>
</lily-select-with-extras>
```

## Files

- `SelectWithExtras.ts` — standalone Angular 20 component (signal inputs, OnPush)
- `SelectWithExtras.spec.ts` — vitest + TestBed render test
