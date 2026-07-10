# Polska Numer Identyfikacji Podatkowej Input

PolskaNumerIdentyfikacjiPodatkowejInput is a headless input for entering Poland's Numer Identyfikacji Podatkowej (NIP), Poland's tax identifier. It renders as `<input type="text">` with pattern validation, numeric/letter keyboard hints, and `autocomplete="off"` to protect sensitive identifiers. It is the editable companion to PolskaNumerIdentyfikacjiPodatkowejView.

## Implementation Notes

- Renders as `<input type="text">` with pattern validation
- Format: 10 numeric digits used for tax identification
- `autocomplete="off"` to protect sensitive identifiers
- Supports two-way binding on the `value` prop
- Companion to PolskaNumerIdentyfikacjiPodatkowejView

## Props

- `label`: string (required) — accessible label via `aria-label`
- `value`: string (default: "") — bindable input value
- `required`: boolean (default: false) — form validation
- `disabled`: boolean (default: false) — disabled state
- `...restProps`: any — additional HTML attributes spread onto the `<input>`

## Usage

```html
<Field label="Tax Identification Number" required>
  <PolskaNumerIdentyfikacjiPodatkowejInput label="Tax Identification Number" value={value} required />
  <Hint>10 numeric digits used for tax identification</Hint>
  <ErrorMessage>Please enter a valid Tax Identification Number</ErrorMessage>
</Field>
```

## ARIA

- `aria-label={label}` — provides accessible name

## When to Use

- Use in forms collecting Poland's Numer Identyfikacji Podatkowej (NIP).
- Use with pattern validation matching the documented format.
- Use in administrative or tax workflows where the identifier is required.

## When Not to Use

- Do not use for displaying read-only identifiers — use `polska-numer-identyfikacji-podatkowej-view` instead.
- Do not use for general text input — use `text-input` instead.
- Do not use for other countries' identifiers — use the corresponding country-specific input.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.polska-numer-identyfikacji-podatkowej-input` class hook.

## Testing

- Verify renders an `<input>` with the correct class and `type="text"`
- Verify `aria-label` is set from the `label` prop
- Verify pattern attribute matches the documented format
- Verify `autocomplete="off"`
- Verify value binding works

## Domain Knowledge

The Numer Identyfikacji Podatkowej (NIP) is Poland's tax identifier. Format: 10 numeric digits used for tax identification.

## Related components

- `polska-numer-identyfikacji-podatkowej-view` — a read-only display of Poland's Numer Identyfikacji Podatkowej (NIP)
- `text-input` — a single-line text input field <input type="text">

## References

- Wikipedia: https://en.wikipedia.org/wiki/National_identification_number#Poland

---

Lily™ and Lily Design System™ are trademarks.
