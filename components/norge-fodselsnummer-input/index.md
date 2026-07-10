# Norge Fodselsnummer Input

NorgeFodselsnummerInput is a headless input for entering Norway's Fødselsnummer, Norway's national-id identifier. It renders as `<input type="text">` with pattern validation, numeric/letter keyboard hints, and `autocomplete="off"` to protect sensitive identifiers. It is the editable companion to NorgeFodselsnummerView.

## Implementation Notes

- Renders as `<input type="text">` with pattern validation
- Format: 11 digits where the first 6 represent the date of birth (DDMMYY)
- `autocomplete="off"` to protect sensitive identifiers
- Supports two-way binding on the `value` prop
- Companion to NorgeFodselsnummerView

## Props

- `label`: string (required) — accessible label via `aria-label`
- `value`: string (default: "") — bindable input value
- `required`: boolean (default: false) — form validation
- `disabled`: boolean (default: false) — disabled state
- `...restProps`: any — additional HTML attributes spread onto the `<input>`

## Usage

```html
<Field label="Norwegian Birth Number" required>
  <NorgeFodselsnummerInput label="Norwegian Birth Number" value={value} required />
  <Hint>11 digits where the first 6 represent the date of birth (DDMMYY)</Hint>
  <ErrorMessage>Please enter a valid Norwegian Birth Number</ErrorMessage>
</Field>
```

## ARIA

- `aria-label={label}` — provides accessible name

## When to Use

- Use in forms collecting Norway's Fødselsnummer.
- Use with pattern validation matching the documented format.
- Use in administrative or national-id workflows where the identifier is required.

## When Not to Use

- Do not use for displaying read-only identifiers — use `norge-fodselsnummer-view` instead.
- Do not use for general text input — use `text-input` instead.
- Do not use for other countries' identifiers — use the corresponding country-specific input.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.norge-fodselsnummer-input` class hook.

## Testing

- Verify renders an `<input>` with the correct class and `type="text"`
- Verify `aria-label` is set from the `label` prop
- Verify pattern attribute matches the documented format
- Verify `autocomplete="off"`
- Verify value binding works

## Domain Knowledge

The Fødselsnummer is Norway's national-id identifier. Format: 11 digits where the first 6 represent the date of birth (DDMMYY).

## Related components

- `norge-fodselsnummer-view` — a read-only display of Norway's Fødselsnummer
- `text-input` — a single-line text input field <input type="text">

## References

- Wikipedia: https://en.wikipedia.org/wiki/National_identification_number#Norway

---

Lily™ and Lily Design System™ are trademarks.
