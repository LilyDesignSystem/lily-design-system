# Slovensko Pas Input

SlovenskoPasInput is a headless input for entering Slovakia's Pas, Slovakia's passport identifier. It renders as `<input type="text">` with pattern validation, numeric/letter keyboard hints, and `autocomplete="off"` to protect sensitive identifiers. It is the editable companion to SlovenskoPasView.

## Implementation Notes

- Renders as `<input type="text">` with pattern validation
- Format: 9 characters in the format XXNNNNNNN: 2 block letters and 7 digits; valid for 10 years
- `autocomplete="off"` to protect sensitive identifiers
- Supports two-way binding on the `value` prop
- Companion to SlovenskoPasView

## Props

- `label`: string (required) — accessible label via `aria-label`
- `value`: string (default: "") — bindable input value
- `required`: boolean (default: false) — form validation
- `disabled`: boolean (default: false) — disabled state
- `...restProps`: any — additional HTML attributes spread onto the `<input>`

## Usage

```html
<Field label="Slovak Passport" required>
  <SlovenskoPasInput label="Slovak Passport" value={value} required />
  <Hint>9 characters in the format XXNNNNNNN: 2 block letters and 7 digits</Hint>
  <ErrorMessage>Please enter a valid Slovak Passport</ErrorMessage>
</Field>
```

## ARIA

- `aria-label={label}` — provides accessible name

## When to Use

- Use in forms collecting Slovakia's Pas.
- Use with pattern validation matching the documented format.
- Use in administrative or passport workflows where the identifier is required.

## When Not to Use

- Do not use for displaying read-only identifiers — use `slovensko-pas-view` instead.
- Do not use for general text input — use `text-input` instead.
- Do not use for other countries' identifiers — use the corresponding country-specific input.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.slovensko-pas-input` class hook.

## Testing

- Verify renders an `<input>` with the correct class and `type="text"`
- Verify `aria-label` is set from the `label` prop
- Verify pattern attribute matches the documented format
- Verify `autocomplete="off"`
- Verify value binding works

## Domain Knowledge

The Pas is Slovakia's passport identifier. Format: 9 characters in the format XXNNNNNNN: 2 block letters and 7 digits; valid for 10 years.

## Related components

- `slovensko-pas-view` — a read-only display of Slovakia's Pas
- `text-input` — a single-line text input field <input type="text">

## References

- Wikipedia: https://en.wikipedia.org/wiki/Slovak_passport

---

Lily™ and Lily Design System™ are trademarks.
