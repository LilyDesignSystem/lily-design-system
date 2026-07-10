# Nederland Burgerservice Nummer Input

NederlandBurgerserviceNummerInput is a headless input for entering Netherlands's Burgerservicenummer (BSN), Netherlands's national-id identifier. It renders as `<input type="text">` with pattern validation, numeric/letter keyboard hints, and `autocomplete="off"` to protect sensitive identifiers. It is the editable companion to NederlandBurgerserviceNummerView.

## Implementation Notes

- Renders as `<input type="text">` with pattern validation
- Format: 9-digit number issued via the Personal Records Database (BRP); validated with a variant of the eleven-test (Luhn) algorithm
- `autocomplete="off"` to protect sensitive identifiers
- Supports two-way binding on the `value` prop
- Companion to NederlandBurgerserviceNummerView

## Props

- `label`: string (required) — accessible label via `aria-label`
- `value`: string (default: "") — bindable input value
- `required`: boolean (default: false) — form validation
- `disabled`: boolean (default: false) — disabled state
- `...restProps`: any — additional HTML attributes spread onto the `<input>`

## Usage

```html
<Field label="Citizen Service Number" required>
  <NederlandBurgerserviceNummerInput label="Citizen Service Number" value={value} required />
  <Hint>9-digit number issued via the Personal Records Database (BRP)</Hint>
  <ErrorMessage>Please enter a valid Citizen Service Number</ErrorMessage>
</Field>
```

## ARIA

- `aria-label={label}` — provides accessible name

## When to Use

- Use in forms collecting Netherlands's Burgerservicenummer (BSN).
- Use with pattern validation matching the documented format.
- Use in administrative or national-id workflows where the identifier is required.

## When Not to Use

- Do not use for displaying read-only identifiers — use `nederland-burgerservice-nummer-view` instead.
- Do not use for general text input — use `text-input` instead.
- Do not use for other countries' identifiers — use the corresponding country-specific input.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.nederland-burgerservice-nummer-input` class hook.

## Testing

- Verify renders an `<input>` with the correct class and `type="text"`
- Verify `aria-label` is set from the `label` prop
- Verify pattern attribute matches the documented format
- Verify `autocomplete="off"`
- Verify value binding works

## Domain Knowledge

The Burgerservicenummer (BSN) is Netherlands's national-id identifier. Format: 9-digit number issued via the Personal Records Database (BRP); validated with a variant of the eleven-test (Luhn) algorithm.

## Related components

- `nederland-burgerservice-nummer-view` — a read-only display of Netherlands's Burgerservicenummer (BSN)
- `text-input` — a single-line text input field <input type="text">

## References

- Wikipedia: https://en.wikipedia.org/wiki/Burgerservicenummer

---

Lily™ and Lily Design System™ are trademarks.
