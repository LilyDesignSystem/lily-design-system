# Nederland Identiteitskaart Nummer Input

NederlandIdentiteitskaartNummerInput is a headless input for entering Netherlands's Identiteitskaart Nummer, Netherlands's national-id identifier. It renders as `<input type="text">` with pattern validation, numeric/letter keyboard hints, and `autocomplete="off"` to protect sensitive identifiers. It is the editable companion to NederlandIdentiteitskaartNummerView.

## Implementation Notes

- Renders as `<input type="text">` with pattern validation
- Format: 9 characters following the same format as the passport number; 'O' is disallowed but '0' is permitted
- `autocomplete="off"` to protect sensitive identifiers
- Supports two-way binding on the `value` prop
- Companion to NederlandIdentiteitskaartNummerView

## Props

- `label`: string (required) — accessible label via `aria-label`
- `value`: string (default: "") — bindable input value
- `required`: boolean (default: false) — form validation
- `disabled`: boolean (default: false) — disabled state
- `...restProps`: any — additional HTML attributes spread onto the `<input>`

## Usage

```html
<Field label="Dutch National Identity Card Number" required>
  <NederlandIdentiteitskaartNummerInput label="Dutch National Identity Card Number" value={value} required />
  <Hint>9 characters following the same format as the passport number</Hint>
  <ErrorMessage>Please enter a valid Dutch National Identity Card Number</ErrorMessage>
</Field>
```

## ARIA

- `aria-label={label}` — provides accessible name

## When to Use

- Use in forms collecting Netherlands's Identiteitskaart Nummer.
- Use with pattern validation matching the documented format.
- Use in administrative or national-id workflows where the identifier is required.

## When Not to Use

- Do not use for displaying read-only identifiers — use `nederland-identiteitskaart-nummer-view` instead.
- Do not use for general text input — use `text-input` instead.
- Do not use for other countries' identifiers — use the corresponding country-specific input.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.nederland-identiteitskaart-nummer-input` class hook.

## Testing

- Verify renders an `<input>` with the correct class and `type="text"`
- Verify `aria-label` is set from the `label` prop
- Verify pattern attribute matches the documented format
- Verify `autocomplete="off"`
- Verify value binding works

## Domain Knowledge

The Identiteitskaart Nummer is Netherlands's national-id identifier. Format: 9 characters following the same format as the passport number; 'O' is disallowed but '0' is permitted.

## Related components

- `nederland-identiteitskaart-nummer-view` — a read-only display of Netherlands's Identiteitskaart Nummer
- `text-input` — a single-line text input field <input type="text">

## References

- Wikipedia: https://en.wikipedia.org/wiki/Dutch_identity_card

---

Lily™ and Lily Design System™ are trademarks.
