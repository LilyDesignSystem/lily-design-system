# Danmark Personnummer Input

DanmarkPersonnummerInput is a headless input for entering Denmark's Personnummer (CPR-nummer) (CPR), Denmark's national-id identifier. It renders as `<input type="text">` with pattern validation, numeric/letter keyboard hints, and `autocomplete="off"` to protect sensitive identifiers. It is the editable companion to DanmarkPersonnummerView.

## Implementation Notes

- Renders as `<input type="text">` with pattern validation
- Format: 10 digits in the format DDMMYYXXXX where the first 6 are the date of birth (DDMMYY)
- `autocomplete="off"` to protect sensitive identifiers
- Supports two-way binding on the `value` prop
- Companion to DanmarkPersonnummerView

## Props

- `label`: string (required) — accessible label via `aria-label`
- `value`: string (default: "") — bindable input value
- `required`: boolean (default: false) — form validation
- `disabled`: boolean (default: false) — disabled state
- `...restProps`: any — additional HTML attributes spread onto the `<input>`

## Usage

```html
<Field label="Personal Identity Code" required>
  <DanmarkPersonnummerInput label="Personal Identity Code" value={value} required />
  <Hint>10 digits in the format DDMMYYXXXX where the first 6 are the date of birth (DDMMYY)</Hint>
  <ErrorMessage>Please enter a valid Personal Identity Code</ErrorMessage>
</Field>
```

## ARIA

- `aria-label={label}` — provides accessible name

## When to Use

- Use in forms collecting Denmark's Personnummer (CPR-nummer) (CPR).
- Use with pattern validation matching the documented format.
- Use in administrative or national-id workflows where the identifier is required.

## When Not to Use

- Do not use for displaying read-only identifiers — use `danmark-personnummer-view` instead.
- Do not use for general text input — use `text-input` instead.
- Do not use for other countries' identifiers — use the corresponding country-specific input.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.danmark-personnummer-input` class hook.

## Testing

- Verify renders an `<input>` with the correct class and `type="text"`
- Verify `aria-label` is set from the `label` prop
- Verify pattern attribute matches the documented format
- Verify `autocomplete="off"`
- Verify value binding works

## Domain Knowledge

The Personnummer (CPR-nummer) (CPR) is Denmark's national-id identifier. Format: 10 digits in the format DDMMYYXXXX where the first 6 are the date of birth (DDMMYY).

## Related components

- `danmark-personnummer-view` — a read-only display of Denmark's Personnummer (CPR-nummer) (CPR)
- `text-input` — a single-line text input field <input type="text">

## References

- Wikipedia: https://en.wikipedia.org/wiki/Personal_identification_number_(Denmark)
