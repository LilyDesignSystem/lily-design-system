# England National Health Service Number Input

EnglandNationalHealthServiceNumberInput is a headless input for entering England's National Health Service Number (NHS), England's healthcare identifier. It renders as `<input type="text">` with pattern validation, numeric/letter keyboard hints, and `autocomplete="off"` to protect sensitive identifiers. It is the editable companion to EnglandNationalHealthServiceNumberView.

## Implementation Notes

- Renders as `<input type="text">` with pattern validation
- Format: 10 digits in 3-3-4 format with a Modulus-11 check digit, allocated through the Personal Demographics Service
- `autocomplete="off"` to protect sensitive identifiers
- Supports two-way binding on the `value` prop
- Companion to EnglandNationalHealthServiceNumberView

## Props

- `label`: string (required) — accessible label via `aria-label`
- `value`: string (default: "") — bindable input value
- `required`: boolean (default: false) — form validation
- `disabled`: boolean (default: false) — disabled state
- `...restProps`: any — additional HTML attributes spread onto the `<input>`

## Usage

```html
<Field label="National Health Service Number" required>
  <EnglandNationalHealthServiceNumberInput label="National Health Service Number" value={value} required />
  <Hint>10 digits in 3-3-4 format with a Modulus-11 check digit, allocated through the Personal Demographics Service</Hint>
  <ErrorMessage>Please enter a valid National Health Service Number</ErrorMessage>
</Field>
```

## ARIA

- `aria-label={label}` — provides accessible name

## When to Use

- Use in forms collecting England's National Health Service Number (NHS).
- Use with pattern validation matching the documented format.
- Use in administrative or healthcare workflows where the identifier is required.

## When Not to Use

- Do not use for displaying read-only identifiers — use `england-national-health-service-number-view` instead.
- Do not use for general text input — use `text-input` instead.
- Do not use for other countries' identifiers — use the corresponding country-specific input.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.england-national-health-service-number-input` class hook.

## Testing

- Verify renders an `<input>` with the correct class and `type="text"`
- Verify `aria-label` is set from the `label` prop
- Verify pattern attribute matches the documented format
- Verify `autocomplete="off"`
- Verify value binding works

## Domain Knowledge

The National Health Service Number (NHS) is England's healthcare identifier. Format: 10 digits in 3-3-4 format with a Modulus-11 check digit, allocated through the Personal Demographics Service.

## Related components

- `england-national-health-service-number-view` — a read-only display of England's National Health Service Number (NHS)
- `text-input` — a single-line text input field <input type="text">

## References

- Wikipedia: https://en.wikipedia.org/wiki/NHS_number

---

Lily™ and Lily Design System™ are trademarks.
