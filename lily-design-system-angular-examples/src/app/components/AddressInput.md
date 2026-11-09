# AddressInput

an input for searching or manually entering an address

This is the Angular headless implementation. See `components/address-input/index.md`
in the canonical repo root for the cross-framework documentation.

## Selector

A `<div role="group">` named by `label`, holding the consumer's labelled address fields.

```html
<lily-address-input label="Delivery address">
  <label for="street">Street</label>
  <input
    id="street"
    autocomplete="address-line1"
  />
</lily-address-input>
```

## Files

- `AddressInput.ts` — standalone Angular 20 component (signal inputs, OnPush)
- `AddressInput.spec.ts` — vitest + TestBed render test
