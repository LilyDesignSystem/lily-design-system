# AddressInput

An input for searching or manually entering an address.

See `components/address-input/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — the group's accessible name, set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `address-input`
- `ChildContent`: RenderFragment — the consumer's labelled address fields
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

A `<div role="group">`, not an `<input>`: an address is several fields.

```razor
<AddressInput Label="Delivery address">
    <label for="street">Street</label>
    <input id="street" autocomplete="address-line1" />
</AddressInput>
```
