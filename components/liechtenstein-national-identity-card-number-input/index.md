# Liechtenstein National Identity Card Number Input

LiechtensteinNationalIdentityCardNumberInput is a headless input for entering Liechtenstein's Liechtenstein National Identity Card Number, Liechtenstein's national-id identifier. It renders as `<input type="text">` with pattern validation, numeric/letter keyboard hints, and `autocomplete="off"` to protect sensitive identifiers. It is the editable companion to LiechtensteinNationalIdentityCardNumberView.

## Implementation Notes

- Renders as `<input type="text">` with pattern validation
- Format: 2 letters followed by 8 digits (e.g. ID022143586); changes with each renewed card
- `autocomplete="off"` to protect sensitive identifiers
- Supports two-way binding on the `value` prop
- Companion to LiechtensteinNationalIdentityCardNumberView

## Props

- `label`: string (required) — accessible label via `aria-label`
- `value`: string (default: "") — bindable input value
- `required`: boolean (default: false) — form validation
- `disabled`: boolean (default: false) — disabled state
- `...restProps`: any — additional HTML attributes spread onto the `<input>`

## Usage

```html
<Field label="Liechtenstein National Identity Card Number" required>
  <LiechtensteinNationalIdentityCardNumberInput label="Liechtenstein National Identity Card Number" value={value} required />
  <Hint>2 letters followed by 8 digits (e.g. ID022143586)</Hint>
  <ErrorMessage>Please enter a valid Liechtenstein National Identity Card Number</ErrorMessage>
</Field>
```

## ARIA

- `aria-label={label}` — provides accessible name

## When to Use

- Use in forms collecting Liechtenstein's Liechtenstein National Identity Card Number.
- Use with pattern validation matching the documented format.
- Use in administrative or national-id workflows where the identifier is required.

## When Not to Use

- Do not use for displaying read-only identifiers — use `liechtenstein-national-identity-card-number-view` instead.
- Do not use for general text input — use `text-input` instead.
- Do not use for other countries' identifiers — use the corresponding country-specific input.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.liechtenstein-national-identity-card-number-input` class hook.

## Testing

- Verify renders an `<input>` with the correct class and `type="text"`
- Verify `aria-label` is set from the `label` prop
- Verify pattern attribute matches the documented format
- Verify `autocomplete="off"`
- Verify value binding works

## Domain Knowledge

The Liechtenstein National Identity Card Number is Liechtenstein's national-id identifier. Format: 2 letters followed by 8 digits (e.g. ID022143586); changes with each renewed card.

## Related components

- `liechtenstein-national-identity-card-number-view` — a read-only display of Liechtenstein's Liechtenstein National Identity Card Number
- `text-input` — a single-line text input field <input type="text">

## References

- Wikipedia: https://en.wikipedia.org/wiki/National_identity_card

---

Lily™ and Lily Design System™ are trademarks.
