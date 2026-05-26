# Lietuva Pasas Input

LietuvaPasasInput is a headless input for entering Lithuania's Pasas, Lithuania's passport identifier. It renders as `<input type="text">` with pattern validation, numeric/letter keyboard hints, and `autocomplete="off"` to protect sensitive identifiers. It is the editable companion to LietuvaPasasView.

## Implementation Notes

- Renders as `<input type="text">` with pattern validation
- Format: 8-digit passport or identity card number
- `autocomplete="off"` to protect sensitive identifiers
- Supports two-way binding on the `value` prop
- Companion to LietuvaPasasView

## Props

- `label`: string (required) — accessible label via `aria-label`
- `value`: string (default: "") — bindable input value
- `required`: boolean (default: false) — form validation
- `disabled`: boolean (default: false) — disabled state
- `...restProps`: any — additional HTML attributes spread onto the `<input>`

## Usage

```html
<Field label="Lithuanian Passport" required>
  <LietuvaPasasInput label="Lithuanian Passport" value={value} required />
  <Hint>8-digit passport or identity card number</Hint>
  <ErrorMessage>Please enter a valid Lithuanian Passport</ErrorMessage>
</Field>
```

## ARIA

- `aria-label={label}` — provides accessible name

## When to Use

- Use in forms collecting Lithuania's Pasas.
- Use with pattern validation matching the documented format.
- Use in administrative or passport workflows where the identifier is required.

## When Not to Use

- Do not use for displaying read-only identifiers — use `lietuva-pasas-view` instead.
- Do not use for general text input — use `text-input` instead.
- Do not use for other countries' identifiers — use the corresponding country-specific input.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.lietuva-pasas-input` class hook.

## Testing

- Verify renders an `<input>` with the correct class and `type="text"`
- Verify `aria-label` is set from the `label` prop
- Verify pattern attribute matches the documented format
- Verify `autocomplete="off"`
- Verify value binding works

## Domain Knowledge

The Pasas is Lithuania's passport identifier. Format: 8-digit passport or identity card number.

## Related components

- `lietuva-pasas-view` — a read-only display of Lithuania's Pasas
- `text-input` — a single-line text input field <input type="text">

## References

- Wikipedia: https://en.wikipedia.org/wiki/Lithuanian_passport
