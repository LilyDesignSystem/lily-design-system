# Ozbekiston Jismoniy Shaxsning Shaxsiy Identifikatsion Raqami Input

OzbekistonJismoniyShaxsningShaxsiyIdentifikatsionRaqamiInput is a headless input for entering Uzbekistan's Personal identification number (JShShIR / PINFL), Uzbekistan's government-issued personal identifier. It renders as `<input type="text">` with `autocomplete="off"` to protect sensitive identifiers. It is the editable companion to OzbekistonJismoniyShaxsningShaxsiyIdentifikatsionRaqamiView.

**Status:** beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow.

## Implementation Notes

- Renders as `<input type="text">`
- Format: Fourteen digits in five groups (Cabinet of Ministers Resolution No. 177 of 2022): a first digit from 1 to 6 for sex and century of birth, then groups for the date of birth and the issuing district, a three-digit sequence and a final check digit. The check-digit formula is not published, so check the length, the digits and the first digit's range.
- `autocomplete="off"` to protect sensitive identifiers
- Supports two-way binding on the `value` prop
- Companion to OzbekistonJismoniyShaxsningShaxsiyIdentifikatsionRaqamiView

## Props

- `label`: string (required) — accessible label via `aria-label`
- `value`: string (default: "") — bindable input value
- `required`: boolean (default: false) — form validation
- `disabled`: boolean (default: false) — disabled state
- `...restProps`: any — additional HTML attributes spread onto the `<input>`

## Usage

```html
<Field
  label="Personal identification number (JShShIR / PINFL)"
  required
>
  <OzbekistonJismoniyShaxsningShaxsiyIdentifikatsionRaqamiInput
    label="Personal identification number (JShShIR / PINFL)"
    value="{value}"
    required
  />
  <Hint
    >Fourteen digits in five groups (Cabinet of Ministers Resolution No. 177 of 2022): a first digit
    from 1 to 6 for sex and century of birth, then groups for the date of birth and the issuing
    district, a three-digit sequence and a final check digit. The check-digit formula is not
    published, so check the length, the digits and the first digit's range.</Hint
  >
  <ErrorMessage>Please enter a valid Personal identification number (JShShIR / PINFL)</ErrorMessage>
</Field>
```

## ARIA

- `aria-label={label}` — provides accessible name

## When to Use

- Use in forms collecting Uzbekistan's Personal identification number (JShShIR / PINFL).
- Use in administrative or national-id workflows where the identifier is required.

## When Not to Use

- Do not use for displaying read-only identifiers — use `ozbekiston-jismoniy-shaxsning-shaxsiy-identifikatsion-raqami-view` instead.
- Do not use for general text input — use `text-input` instead.
- Do not use for other countries' identifiers — use the corresponding country-specific input.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.ozbekiston-jismoniy-shaxsning-shaxsiy-identifikatsion-raqami-input` class hook.

## Testing

- Verify renders an `<input>` with the correct class and `type="text"`
- Verify `aria-label` is set from the `label` prop
- Verify `autocomplete="off"`
- Verify value binding works

## Domain Knowledge

Fourteen digits in five groups (Cabinet of Ministers Resolution No. 177 of 2022): a first digit from 1 to 6 for sex and century of birth, then groups for the date of birth and the issuing district, a three-digit sequence and a final check digit. The check-digit formula is not published, so check the length, the digits and the first digit's range.

**Where to find it:** Printed on the back of the ID card and in the machine-readable zone of the passport, and used as the personal tax number.

## Related components

- `ozbekiston-jismoniy-shaxsning-shaxsiy-identifikatsion-raqami-view` — a read-only display of Uzbekistan's Personal identification number (JShShIR / PINFL)
- `text-input` — a single-line text input field <input type="text">

## References

- [Kun.uz: Where to find your PINFL](https://kun.uz/en/news/2026/01/26/how-to-find-your-pinfl)
- [Uzbekistan passport](https://en.wikipedia.org/wiki/Uzbekistan_passport)

---

Lily™ and Lily Design System™ are trademarks.
