# Field

a form field wrapper with label, input, and error message

This is the Angular headless implementation. See `components/field/index.md`
in the canonical repo root for the cross-framework documentation.

With no `label`, none is rendered and you project your own.

## Selector

```html
<lily-field
  label="Email"
  inputId="email"
  [error]="error()"
>
  <lily-email-input
    id="email"
    label="Email"
  />
</lily-field>
```

## Files

- `Field.ts` — standalone Angular 20 component (signal inputs, OnPush)
- `Field.spec.ts` — vitest + TestBed render test
