# Eesti Isikukood Input

EestiIsikukoodInput is a headless input for entering Estonia's Isikukood (IK), Estonia's national-id identifier. It renders as `<input type="text">` with pattern validation, numeric/letter keyboard hints, and `autocomplete="off"` to protect sensitive identifiers. It is the editable companion to EestiIsikukoodView.

**Status:** beta — implemented and unit-tested in all seven frameworks with an axe-clean demo page; not yet exercised in composed flows.

## Implementation Notes

- Renders as `<input type="text">` with pattern validation
- Format: 11 digits in the form GYYMMDDSSSC: G is sex and century (odd male, even female; 1-2 19th c., 3-4 20th c., 5-6 21st c.), SSS distinguishes persons born the same day, C is a checksum
- `autocomplete="off"` to protect sensitive identifiers
- Supports two-way binding on the `value` prop
- Companion to EestiIsikukoodView

## Props

- `label`: string (required) — accessible label via `aria-label`
- `value`: string (default: "") — bindable input value
- `required`: boolean (default: false) — form validation
- `disabled`: boolean (default: false) — disabled state
- `...restProps`: any — additional HTML attributes spread onto the `<input>`

## Usage

```html
<Field label="Personal Identification Code" required>
  <EestiIsikukoodInput label="Personal Identification Code" value={value} required />
  <Hint>11 digits in the form GYYMMDDSSSC: G is sex and century (odd male, even female</Hint>
  <ErrorMessage>Please enter a valid Personal Identification Code</ErrorMessage>
</Field>
```

## ARIA

- `aria-label={label}` — provides accessible name

## When to Use

- Use in forms collecting Estonia's Isikukood (IK).
- Use with pattern validation matching the documented format.
- Use in administrative or national-id workflows where the identifier is required.

## When Not to Use

- Do not use for displaying read-only identifiers — use `eesti-isikukood-view` instead.
- Do not use for general text input — use `text-input` instead.
- Do not use for other countries' identifiers — use the corresponding country-specific input.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.eesti-isikukood-input` class hook.

## Testing

- Verify renders an `<input>` with the correct class and `type="text"`
- Verify `aria-label` is set from the `label` prop
- Verify pattern attribute matches the documented format
- Verify `autocomplete="off"`
- Verify value binding works

## Domain Knowledge

Eleven digits in the form GYYMMDDSSSC: G encodes sex and century of birth (1–2 for the 19th century, 3–4 for the 20th, 5–6 for the 21st, with odd numbers male and even female); YYMMDD is the date of birth; SSS is a serial number; and C is a Modulus-11 check digit.

**Where to find it:** Estonian ID card (ID-kaart), passport, residence permit, driving licence, and digital signing services such as Smart-ID and Mobiil-ID.

## Related components

- `eesti-isikukood-view` — a read-only display of Estonia's Isikukood (IK)
- `text-input` — a single-line text input field <input type="text">

## References

- Wikipedia: https://en.wikipedia.org/wiki/National_identification_number#Estonia

---

Lily™ and Lily Design System™ are trademarks.
