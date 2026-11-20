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

## Security and privacy

A national identifier is personal data, and often a key to other records.

- The input renders `autocomplete="off"`, so the browser neither saves nor offers the value, and `spellcheck="false"`, so an enhanced spellchecker does not send it to a cloud service. `bin/check-identifier-inputs` keeps both in all nine catalogs.
- Do not log the value, put it in a URL or query string, or send it to analytics or an error tracker; mask it there if it must appear.
- The component stores nothing. Do not keep the value in `localStorage`, `sessionStorage` or a cookie; submit it in the body of a POST over HTTPS.
- A format or checksum check proves the number is well formed, not that it belongs to the person entering it.
- The page decides who may see it: the input does not mask what is typed. Use the matching `-view` to show it back, masked as the service requires.

## Related components

- `ozbekiston-jismoniy-shaxsning-shaxsiy-identifikatsion-raqami-view` — a read-only display of Uzbekistan's Personal identification number (JShShIR / PINFL)
- `text-input` — a single-line text input field <input type="text">

## Known limitations

None known.

## References

- [Kun.uz: Where to find your PINFL](https://kun.uz/en/news/2026/01/26/how-to-find-your-pinfl)
- [Uzbekistan passport](https://en.wikipedia.org/wiki/Uzbekistan_passport)

---

Lily™ and Lily Design System™ are trademarks.
