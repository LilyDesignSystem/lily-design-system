# PostalCodeInput

A postal code input provides a text field specifically designed for entering postal or ZIP codes. It includes `autocomplete="postal-code"` to enable browsers to auto-fill the value from stored address data, streamlining address form completion.

This component is useful in address forms, checkout flows, shipping calculators, and any interface that requires postal code entry. It pairs with PostalCodeView for displaying the entered value in read-only contexts. The controlled value prop supports two-way data binding with the parent component.

## Implementation Notes

- Renders a native `<input type="text">` element (not `type="number"`, since postal codes may contain letters or dashes)
- Uses `autocomplete="postal-code"` to hint browser autofill for postal/ZIP code fields
- Uses `aria-label` for accessible naming (no visible label element included; consumers can add their own)
- The `value` prop supports controlled component usage, enabling `value + onChange` in the parent
- Uses `value` and `onChange` props for controlled component usage
- Supports standard HTML form attributes: `required`, `disabled`
- Spreads `restProps` for consumer customization (e.g., `placeholder`, `pattern`, `maxlength`)

## Props

- `label`: string (required) -- accessible name via `aria-label`
- `value`: string (default: `""`, controlled) -- current postal code value, supports two-way binding
- `required`: boolean (default: `false`) -- whether the field is required
- `disabled`: boolean (default: `false`) -- whether the field is disabled
- `...restProps`: any additional HTML attributes spread onto the input

## Usage

```tsx
<PostalCodeInput label="Postal code" value + onChange />
```

```tsx
<PostalCodeInput
  label="ZIP code"
  value={zipCode}
  onChange={setZipCode}
  required={true}
/>
```

```tsx
<PostalCodeInput
  label="Postcode"
  value={postcode}
  onChange={setPostcode}
  placeholder="SW1A 1AA"
/>
```

## Keyboard Interactions

None beyond native input behavior -- standard text editing keys (typing, backspace, selection, clipboard-copy-button shortcuts) are handled by the browser.

## ARIA

- `aria-label={label}` -- provides an accessible name for the input since no visible `<label>` element is included

## References

- HTML autocomplete attribute: https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete
- MDN input type="text": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/text
