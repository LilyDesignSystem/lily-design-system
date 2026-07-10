# Liechtenstein Passport Number Input

LiechtensteinPassportNumberInput is a headless input for entering Liechtenstein's Liechtenstein Passport Number, Liechtenstein's passport identifier. It renders as `<input type="text">` with pattern validation, numeric/letter keyboard hints, and `autocomplete="off"` to protect sensitive identifiers. It is the editable companion to LiechtensteinPassportNumberView.

## Implementation Notes

- Renders as `<input type="text">` with pattern validation
- Format: 1 letter followed by 5 digits (e.g. R00536)
- `autocomplete="off"` to protect sensitive identifiers
- Supports two-way binding on the `value` prop
- Companion to LiechtensteinPassportNumberView

## Props

- `label`: string (required) — accessible label via `aria-label`
- `value`: string (default: "") — bindable input value
- `required`: boolean (default: false) — form validation
- `disabled`: boolean (default: false) — disabled state
- `...restProps`: any — additional HTML attributes spread onto the `<input>`

## Usage

```html
<Field label="Liechtenstein Passport Number" required>
  <LiechtensteinPassportNumberInput label="Liechtenstein Passport Number" value={value} required />
  <Hint>1 letter followed by 5 digits (e.g. R00536)</Hint>
  <ErrorMessage>Please enter a valid Liechtenstein Passport Number</ErrorMessage>
</Field>
```

## ARIA

- `aria-label={label}` — provides accessible name

## When to Use

- Use in forms collecting Liechtenstein's Liechtenstein Passport Number.
- Use with pattern validation matching the documented format.
- Use in administrative or passport workflows where the identifier is required.

## When Not to Use

- Do not use for displaying read-only identifiers — use `liechtenstein-passport-number-view` instead.
- Do not use for general text input — use `text-input` instead.
- Do not use for other countries' identifiers — use the corresponding country-specific input.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.liechtenstein-passport-number-input` class hook.

## Testing

- Verify renders an `<input>` with the correct class and `type="text"`
- Verify `aria-label` is set from the `label` prop
- Verify pattern attribute matches the documented format
- Verify `autocomplete="off"`
- Verify value binding works

## Domain Knowledge

The Liechtenstein Passport Number is Liechtenstein's passport identifier. Format: 1 letter followed by 5 digits (e.g. R00536).

## Related components

- `liechtenstein-passport-number-view` — a read-only display of Liechtenstein's Liechtenstein Passport Number
- `text-input` — a single-line text input field <input type="text">

## References

- Wikipedia: https://en.wikipedia.org/wiki/Liechtenstein_passport

---

Lily™ and Lily Design System™ are trademarks.
