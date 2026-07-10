# Suomi Henkilotunnus Input

SuomiHenkilotunnusInput is a headless input for entering Finland's Henkilötunnus (HETU), Finland's national-id identifier. It renders as `<input type="text">` with pattern validation, numeric/letter keyboard hints, and `autocomplete="off"` to protect sensitive identifiers. It is the editable companion to SuomiHenkilotunnusView.

## Implementation Notes

- Renders as `<input type="text">` with pattern validation
- Format: 11 characters in the format DDMMYYCZZZQ: DDMMYY is the date of birth, C is the century sign (+, -, or A), ZZZ is an individual number (odd male, even female), Q is the checksum
- `autocomplete="off"` to protect sensitive identifiers
- Supports two-way binding on the `value` prop
- Companion to SuomiHenkilotunnusView

## Props

- `label`: string (required) — accessible label via `aria-label`
- `value`: string (default: "") — bindable input value
- `required`: boolean (default: false) — form validation
- `disabled`: boolean (default: false) — disabled state
- `...restProps`: any — additional HTML attributes spread onto the `<input>`

## Usage

```html
<Field label="Personal Identity Code" required>
  <SuomiHenkilotunnusInput label="Personal Identity Code" value={value} required />
  <Hint>11 characters in the format DDMMYYCZZZQ: DDMMYY is the date of birth, C is the century sign (+, -, or A), ZZZ is an individual number (odd male, even female), Q is the checksum</Hint>
  <ErrorMessage>Please enter a valid Personal Identity Code</ErrorMessage>
</Field>
```

## ARIA

- `aria-label={label}` — provides accessible name

## When to Use

- Use in forms collecting Finland's Henkilötunnus (HETU).
- Use with pattern validation matching the documented format.
- Use in administrative or national-id workflows where the identifier is required.

## When Not to Use

- Do not use for displaying read-only identifiers — use `suomi-henkilotunnus-view` instead.
- Do not use for general text input — use `text-input` instead.
- Do not use for other countries' identifiers — use the corresponding country-specific input.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.suomi-henkilotunnus-input` class hook.

## Testing

- Verify renders an `<input>` with the correct class and `type="text"`
- Verify `aria-label` is set from the `label` prop
- Verify pattern attribute matches the documented format
- Verify `autocomplete="off"`
- Verify value binding works

## Domain Knowledge

The Henkilötunnus (HETU) is Finland's national-id identifier. Format: 11 characters in the format DDMMYYCZZZQ: DDMMYY is the date of birth, C is the century sign (+, -, or A), ZZZ is an individual number (odd male, even female), Q is the checksum.

## Related components

- `suomi-henkilotunnus-view` — a read-only display of Finland's Henkilötunnus (HETU)
- `text-input` — a single-line text input field <input type="text">

## References

- Wikipedia: https://en.wikipedia.org/wiki/Personal_identity_code_(Finland)

---

Lily™ and Lily Design System™ are trademarks.
