# ValidationList

a live-feedback list of input validation rules with pending, passed, and failed states

This is the Angular headless implementation. See `components/validation-list/index.md`
in the canonical repo root for the cross-framework documentation.

## Selector

```html
<lily-validation-list></lily-validation-list>
```

## Files

- `ValidationList.ts` — standalone Angular 20 component (signal inputs, OnPush)
- `ValidationList.spec.ts` — vitest + TestBed render test
