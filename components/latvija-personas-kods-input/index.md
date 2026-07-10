# Latvija Personas Kods Input

LatvijaPersonasKodsInput is a headless input for entering Latvia's Personas kods, Latvia's national-id identifier. It renders as `<input type="text">` with pattern validation, numeric/letter keyboard hints, and `autocomplete="off"` to protect sensitive identifiers. It is the editable companion to LatvijaPersonasKodsView.

## Implementation Notes

- Renders as `<input type="text">` with pattern validation
- Format: 11 digits in the form DDMMYY-CZZZZ where the first 6 are the date of birth (DDMMYY) and C encodes the century (0 = 19th, 1 = 20th, 2 = 21st)
- `autocomplete="off"` to protect sensitive identifiers
- Supports two-way binding on the `value` prop
- Companion to LatvijaPersonasKodsView

## Props

- `label`: string (required) — accessible label via `aria-label`
- `value`: string (default: "") — bindable input value
- `required`: boolean (default: false) — form validation
- `disabled`: boolean (default: false) — disabled state
- `...restProps`: any — additional HTML attributes spread onto the `<input>`

## Usage

```html
<Field label="Personal Code" required>
  <LatvijaPersonasKodsInput label="Personal Code" value={value} required />
  <Hint>11 digits in the form DDMMYY-CZZZZ where the first 6 are the date of birth (DDMMYY) and C encodes the century (0 = 19th, 1 = 20th, 2 = 21st)</Hint>
  <ErrorMessage>Please enter a valid Personal Code</ErrorMessage>
</Field>
```

## ARIA

- `aria-label={label}` — provides accessible name

## When to Use

- Use in forms collecting Latvia's Personas kods.
- Use with pattern validation matching the documented format.
- Use in administrative or national-id workflows where the identifier is required.

## When Not to Use

- Do not use for displaying read-only identifiers — use `latvija-personas-kods-view` instead.
- Do not use for general text input — use `text-input` instead.
- Do not use for other countries' identifiers — use the corresponding country-specific input.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.latvija-personas-kods-input` class hook.

## Testing

- Verify renders an `<input>` with the correct class and `type="text"`
- Verify `aria-label` is set from the `label` prop
- Verify pattern attribute matches the documented format
- Verify `autocomplete="off"`
- Verify value binding works

## Domain Knowledge

The Personas kods is Latvia's national-id identifier. Format: 11 digits in the form DDMMYY-CZZZZ where the first 6 are the date of birth (DDMMYY) and C encodes the century (0 = 19th, 1 = 20th, 2 = 21st).

## Related components

- `latvija-personas-kods-view` — a read-only display of Latvia's Personas kods
- `text-input` — a single-line text input field <input type="text">

## References

- Wikipedia: https://en.wikipedia.org/wiki/National_identification_number#Latvia

---

Lily™ and Lily Design System™ are trademarks.
