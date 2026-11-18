# Ghana Card Personal Identification Number Input

GhanaCardPersonalIdentificationNumberInput is a headless input for entering Ghana's Ghana Card PIN, Ghana's government-issued personal identifier. It renders as `<input type="text">` with `autocomplete="off"` to protect sensitive identifiers. It is the editable companion to GhanaCardPersonalIdentificationNumberView.

**Status:** beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow.

## Implementation Notes

- Renders as `<input type="text">`
- Format: A three-letter prefix (GHA for citizens), a hyphen, a run of digits and a hyphen before a final check character (GHA-123456789-1). Sources disagree on the length of the digit run (eight, nine or ten), and the National Identification Authority does not publish the check-character algorithm, so check the prefix and shape, not the checksum.
- `autocomplete="off"` to protect sensitive identifiers
- Supports two-way binding on the `value` prop
- Companion to GhanaCardPersonalIdentificationNumberView

## Props

- `label`: string (required) — accessible label via `aria-label`
- `value`: string (default: "") — bindable input value
- `required`: boolean (default: false) — form validation
- `disabled`: boolean (default: false) — disabled state
- `...restProps`: any — additional HTML attributes spread onto the `<input>`

## Usage

```html
<Field
  label="Ghana Card PIN"
  required
>
  <GhanaCardPersonalIdentificationNumberInput
    label="Ghana Card PIN"
    value="{value}"
    required
  />
  <Hint
    >A three-letter prefix (GHA for citizens), a hyphen, a run of digits and a hyphen before a final
    check character (GHA-123456789-1). Sources disagree on the length of the digit run (eight, nine
    or ten), and the National Identification Authority does not publish the check-character
    algorithm, so check the prefix and shape, not the checksum.</Hint
  >
  <ErrorMessage>Please enter a valid Ghana Card PIN</ErrorMessage>
</Field>
```

## ARIA

- `aria-label={label}` — provides accessible name

## When to Use

- Use in forms collecting Ghana's Ghana Card PIN.
- Use in administrative or national-id workflows where the identifier is required.

## When Not to Use

- Do not use for displaying read-only identifiers — use `ghana-card-personal-identification-number-view` instead.
- Do not use for general text input — use `text-input` instead.
- Do not use for other countries' identifiers — use the corresponding country-specific input.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.ghana-card-personal-identification-number-input` class hook.

## Testing

- Verify renders an `<input>` with the correct class and `type="text"`
- Verify `aria-label` is set from the `label` prop
- Verify `autocomplete="off"`
- Verify value binding works

## Domain Knowledge

A three-letter prefix (GHA for citizens), a hyphen, a run of digits and a hyphen before a final check character (GHA-123456789-1). Sources disagree on the length of the digit run (eight, nine or ten), and the National Identification Authority does not publish the check-character algorithm, so check the prefix and shape, not the checksum.

**Where to find it:** Printed on the Ghana Card issued by the National Identification Authority (NIA); it is also the personal tax number (TIN) used by the Ghana Revenue Authority.

## Related components

- `ghana-card-personal-identification-number-view` — a read-only display of Ghana's Ghana Card PIN
- `text-input` — a single-line text input field <input type="text">

## References

- [Ghana Card](https://en.wikipedia.org/wiki/Ghana_Card)
- [National Identification Authority: The GhanaCard](https://nia.gov.gh/the-ghanacard-introduction/)

---

Lily™ and Lily Design System™ are trademarks.
