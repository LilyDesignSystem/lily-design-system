# Malta Passport Number Input

MaltaPassportNumberInput is a headless input for entering Malta's Malta Passport Number, Malta's passport identifier. It renders as `<input type="text">` with pattern validation, numeric/letter keyboard hints, and `autocomplete="off"` to protect sensitive identifiers. It is the editable companion to MaltaPassportNumberView.

## Implementation Notes

- Renders as `<input type="text">` with pattern validation
- Format: 7 numerical digits issued by the Civil Registration Directorate
- `autocomplete="off"` to protect sensitive identifiers
- Supports two-way binding on the `value` prop
- Companion to MaltaPassportNumberView

## Props

- `label`: string (required) — accessible label via `aria-label`
- `value`: string (default: "") — bindable input value
- `required`: boolean (default: false) — form validation
- `disabled`: boolean (default: false) — disabled state
- `...restProps`: any — additional HTML attributes spread onto the `<input>`

## Usage

```html
<Field label="Malta Passport Number" required>
  <MaltaPassportNumberInput label="Malta Passport Number" value={value} required />
  <Hint>7 numerical digits issued by the Civil Registration Directorate</Hint>
  <ErrorMessage>Please enter a valid Malta Passport Number</ErrorMessage>
</Field>
```

## ARIA

- `aria-label={label}` — provides accessible name

## When to Use

- Use in forms collecting Malta's Malta Passport Number.
- Use with pattern validation matching the documented format.
- Use in administrative or passport workflows where the identifier is required.

## When Not to Use

- Do not use for displaying read-only identifiers — use `malta-passport-number-view` instead.
- Do not use for general text input — use `text-input` instead.
- Do not use for other countries' identifiers — use the corresponding country-specific input.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.malta-passport-number-input` class hook.

## Testing

- Verify renders an `<input>` with the correct class and `type="text"`
- Verify `aria-label` is set from the `label` prop
- Verify pattern attribute matches the documented format
- Verify `autocomplete="off"`
- Verify value binding works

## Domain Knowledge

The Malta Passport Number is Malta's passport identifier. Format: 7 numerical digits issued by the Civil Registration Directorate.

## Related components

- `malta-passport-number-view` — a read-only display of Malta's Malta Passport Number
- `text-input` — a single-line text input field <input type="text">

## References

- Wikipedia: https://en.wikipedia.org/wiki/Maltese_passport
