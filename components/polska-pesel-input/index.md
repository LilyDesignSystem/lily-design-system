# Polska Pesel Input

PolskaPeselInput is a headless input for entering Poland's PESEL, Poland's national-id identifier. It renders as `<input type="text">` with pattern validation, numeric/letter keyboard hints, and `autocomplete="off"` to protect sensitive identifiers. It is the editable companion to PolskaPeselView.

## Implementation Notes

- Renders as `<input type="text">` with pattern validation
- Format: 11 numeric digits; assigned shortly after birth and unchanged for life
- `autocomplete="off"` to protect sensitive identifiers
- Supports two-way binding on the `value` prop
- Companion to PolskaPeselView

## Props

- `label`: string (required) — accessible label via `aria-label`
- `value`: string (default: "") — bindable input value
- `required`: boolean (default: false) — form validation
- `disabled`: boolean (default: false) — disabled state
- `...restProps`: any — additional HTML attributes spread onto the `<input>`

## Usage

```html
<Field label="PESEL" required>
  <PolskaPeselInput label="PESEL" value={value} required />
  <Hint>11 numeric digits</Hint>
  <ErrorMessage>Please enter a valid PESEL</ErrorMessage>
</Field>
```

## ARIA

- `aria-label={label}` — provides accessible name

## When to Use

- Use in forms collecting Poland's PESEL.
- Use with pattern validation matching the documented format.
- Use in administrative or national-id workflows where the identifier is required.

## When Not to Use

- Do not use for displaying read-only identifiers — use `polska-pesel-view` instead.
- Do not use for general text input — use `text-input` instead.
- Do not use for other countries' identifiers — use the corresponding country-specific input.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.polska-pesel-input` class hook.

## Testing

- Verify renders an `<input>` with the correct class and `type="text"`
- Verify `aria-label` is set from the `label` prop
- Verify pattern attribute matches the documented format
- Verify `autocomplete="off"`
- Verify value binding works

## Domain Knowledge

The PESEL is Poland's national-id identifier. Format: 11 numeric digits; assigned shortly after birth and unchanged for life.

## Related components

- `polska-pesel-view` — a read-only display of Poland's PESEL
- `text-input` — a single-line text input field <input type="text">

## References

- Wikipedia: https://en.wikipedia.org/wiki/PESEL
