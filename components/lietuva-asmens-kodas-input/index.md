# Lietuva Asmens Kodas Input

LietuvaAsmensKodasInput is a headless input for entering Lithuania's Asmens kodas, Lithuania's national-id identifier. It renders as `<input type="text">` with pattern validation, numeric/letter keyboard hints, and `autocomplete="off"` to protect sensitive identifiers. It is the editable companion to LietuvaAsmensKodasView.

## Implementation Notes

- Renders as `<input type="text">` with pattern validation
- Format: 11 digits in the format GYYMMDDNNNC: G encodes sex and century (4 or 6 women, 3 or 5 men), YYMMDD is the date of birth, NNN is a serial, C is the check digit
- `autocomplete="off"` to protect sensitive identifiers
- Supports two-way binding on the `value` prop
- Companion to LietuvaAsmensKodasView

## Props

- `label`: string (required) — accessible label via `aria-label`
- `value`: string (default: "") — bindable input value
- `required`: boolean (default: false) — form validation
- `disabled`: boolean (default: false) — disabled state
- `...restProps`: any — additional HTML attributes spread onto the `<input>`

## Usage

```html
<Field label="Personal Code" required>
  <LietuvaAsmensKodasInput label="Personal Code" value={value} required />
  <Hint>11 digits in the format GYYMMDDNNNC: G encodes sex and century (4 or 6 women, 3 or 5 men), YYMMDD is the date of birth, NNN is a serial, C is the check digit</Hint>
  <ErrorMessage>Please enter a valid Personal Code</ErrorMessage>
</Field>
```

## ARIA

- `aria-label={label}` — provides accessible name

## When to Use

- Use in forms collecting Lithuania's Asmens kodas.
- Use with pattern validation matching the documented format.
- Use in administrative or national-id workflows where the identifier is required.

## When Not to Use

- Do not use for displaying read-only identifiers — use `lietuva-asmens-kodas-view` instead.
- Do not use for general text input — use `text-input` instead.
- Do not use for other countries' identifiers — use the corresponding country-specific input.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.lietuva-asmens-kodas-input` class hook.

## Testing

- Verify renders an `<input>` with the correct class and `type="text"`
- Verify `aria-label` is set from the `label` prop
- Verify pattern attribute matches the documented format
- Verify `autocomplete="off"`
- Verify value binding works

## Domain Knowledge

The Asmens kodas is Lithuania's national-id identifier. Format: 11 digits in the format GYYMMDDNNNC: G encodes sex and century (4 or 6 women, 3 or 5 men), YYMMDD is the date of birth, NNN is a serial, C is the check digit.

## Related components

- `lietuva-asmens-kodas-view` — a read-only display of Lithuania's Asmens kodas
- `text-input` — a single-line text input field <input type="text">

## References

- Wikipedia: https://en.wikipedia.org/wiki/National_identification_number#Lithuania
