# Romania Cod Numeric Personal Input

RomaniaCodNumericPersonalInput is a headless input for entering Romania's Cod Numeric Personal (CNP), Romania's national-id identifier. It renders as `<input type="text">` with pattern validation, numeric/letter keyboard hints, and `autocomplete="off"` to protect sensitive identifiers. It is the editable companion to RomaniaCodNumericPersonalView.

## Implementation Notes

- Renders as `<input type="text">` with pattern validation
- Format: 13 digits: gender and century (1/3/5/7 male; 2/4/6/8 female; 9 foreigner), date of birth (YYMMDD), country zone (01-52, or 99 for Bucharest sectors), serial (3 digits), and a Modulus-11 checksum digit
- `autocomplete="off"` to protect sensitive identifiers
- Supports two-way binding on the `value` prop
- Companion to RomaniaCodNumericPersonalView

## Props

- `label`: string (required) — accessible label via `aria-label`
- `value`: string (default: "") — bindable input value
- `required`: boolean (default: false) — form validation
- `disabled`: boolean (default: false) — disabled state
- `...restProps`: any — additional HTML attributes spread onto the `<input>`

## Usage

```html
<Field label="Personal Numerical Code" required>
  <RomaniaCodNumericPersonalInput label="Personal Numerical Code" value={value} required />
  <Hint>13 digits: gender and century (1/3/5/7 male</Hint>
  <ErrorMessage>Please enter a valid Personal Numerical Code</ErrorMessage>
</Field>
```

## ARIA

- `aria-label={label}` — provides accessible name

## When to Use

- Use in forms collecting Romania's Cod Numeric Personal (CNP).
- Use with pattern validation matching the documented format.
- Use in administrative or national-id workflows where the identifier is required.

## When Not to Use

- Do not use for displaying read-only identifiers — use `romania-cod-numeric-personal-view` instead.
- Do not use for general text input — use `text-input` instead.
- Do not use for other countries' identifiers — use the corresponding country-specific input.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.romania-cod-numeric-personal-input` class hook.

## Testing

- Verify renders an `<input>` with the correct class and `type="text"`
- Verify `aria-label` is set from the `label` prop
- Verify pattern attribute matches the documented format
- Verify `autocomplete="off"`
- Verify value binding works

## Domain Knowledge

The Cod Numeric Personal (CNP) is Romania's national-id identifier. Format: 13 digits: gender and century (1/3/5/7 male; 2/4/6/8 female; 9 foreigner), date of birth (YYMMDD), country zone (01-52, or 99 for Bucharest sectors), serial (3 digits), and a Modulus-11 checksum digit.

## Related components

- `romania-cod-numeric-personal-view` — a read-only display of Romania's Cod Numeric Personal (CNP)
- `text-input` — a single-line text input field <input type="text">

## References

- Wikipedia: https://en.wikipedia.org/wiki/National_identification_number#Romania

---

Lily™ and Lily Design System™ are trademarks.
