# Romania Pasaport Input

RomaniaPasaportInput is a headless input for entering Romania's Paşaport, Romania's passport identifier. It renders as `<input type="text">` with pattern validation, numeric/letter keyboard hints, and `autocomplete="off"` to protect sensitive identifiers. It is the editable companion to RomaniaPasaportView.

## Implementation Notes

- Renders as `<input type="text">` with pattern validation
- Format: 8 characters: positions 1-2 [A-Z] and positions 3-8 [0-9]
- `autocomplete="off"` to protect sensitive identifiers
- Supports two-way binding on the `value` prop
- Companion to RomaniaPasaportView

## Props

- `label`: string (required) — accessible label via `aria-label`
- `value`: string (default: "") — bindable input value
- `required`: boolean (default: false) — form validation
- `disabled`: boolean (default: false) — disabled state
- `...restProps`: any — additional HTML attributes spread onto the `<input>`

## Usage

```html
<Field label="Romanian Passport" required>
  <RomaniaPasaportInput label="Romanian Passport" value={value} required />
  <Hint>8 characters: positions 1-2 [A-Z] and positions 3-8 [0-9]</Hint>
  <ErrorMessage>Please enter a valid Romanian Passport</ErrorMessage>
</Field>
```

## ARIA

- `aria-label={label}` — provides accessible name

## When to Use

- Use in forms collecting Romania's Paşaport.
- Use with pattern validation matching the documented format.
- Use in administrative or passport workflows where the identifier is required.

## When Not to Use

- Do not use for displaying read-only identifiers — use `romania-pasaport-view` instead.
- Do not use for general text input — use `text-input` instead.
- Do not use for other countries' identifiers — use the corresponding country-specific input.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.romania-pasaport-input` class hook.

## Testing

- Verify renders an `<input>` with the correct class and `type="text"`
- Verify `aria-label` is set from the `label` prop
- Verify pattern attribute matches the documented format
- Verify `autocomplete="off"`
- Verify value binding works

## Domain Knowledge

The Paşaport is Romania's passport identifier. Format: 8 characters: positions 1-2 [A-Z] and positions 3-8 [0-9].

## Related components

- `romania-pasaport-view` — a read-only display of Romania's Paşaport
- `text-input` — a single-line text input field <input type="text">

## References

- Wikipedia: https://en.wikipedia.org/wiki/Romanian_passport
