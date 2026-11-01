# Iran Kod E Melli Input

IranKodEMelliInput is a headless input for entering Iran's National Code (Kod-e Melli), Iran's government-issued personal identifier. It renders as `<input type="text">` with `autocomplete="off"` to protect sensitive identifiers. It is the editable companion to IranKodEMelliView.

**Status:** beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow.

## Implementation Notes

- Renders as `<input type="text">`
- Format: Ten digits whose last digit is a check digit. The first nine digits are multiplied by 10,9,8,7,6,5,4,3,2 and summed; with r the sum's Modulus-11 remainder, the check digit is r when r is less than 2, otherwise 11 minus r. A number whose ten digits are all the same is never valid.
- `autocomplete="off"` to protect sensitive identifiers
- Supports two-way binding on the `value` prop
- Companion to IranKodEMelliView

## Props

- `label`: string (required) — accessible label via `aria-label`
- `value`: string (default: "") — bindable input value
- `required`: boolean (default: false) — form validation
- `disabled`: boolean (default: false) — disabled state
- `...restProps`: any — additional HTML attributes spread onto the `<input>`

## Usage

```html
<Field
  label="National Code (Kod-e Melli)"
  required
>
  <IranKodEMelliInput
    label="National Code (Kod-e Melli)"
    value="{value}"
    required
  />
  <Hint
    >Ten digits whose last digit is a check digit. The first nine digits are multiplied by
    10,9,8,7,6,5,4,3,2 and summed; with r the sum's Modulus-11 remainder, the check digit is r when
    r is less than 2, otherwise 11 minus r. A number whose ten digits are all the same is never
    valid.</Hint
  >
  <ErrorMessage>Please enter a valid National Code (Kod-e Melli)</ErrorMessage>
</Field>
```

## ARIA

- `aria-label={label}` — provides accessible name

## When to Use

- Use in forms collecting Iran's National Code (Kod-e Melli).
- Use in administrative or national-id workflows where the identifier is required.

## When Not to Use

- Do not use for displaying read-only identifiers — use `iran-kod-e-melli-view` instead.
- Do not use for general text input — use `text-input` instead.
- Do not use for other countries' identifiers — use the corresponding country-specific input.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.iran-kod-e-melli-input` class hook.

## Testing

- Verify renders an `<input>` with the correct class and `type="text"`
- Verify `aria-label` is set from the `label` prop
- Verify `autocomplete="off"`
- Verify value binding works

## Domain Knowledge

Ten digits whose last digit is a check digit. The first nine digits are multiplied by 10,9,8,7,6,5,4,3,2 and summed; with r the sum's Modulus-11 remainder, the check digit is r when r is less than 2, otherwise 11 minus r. A number whose ten digits are all the same is never valid.

**Where to find it:** Printed on the National Card (کارت ملی) and on the birth certificate, and asked for by banks, insurers, hospitals and government services.

## Related components

- `iran-kod-e-melli-view` — a read-only display of Iran's National Code (Kod-e Melli)
- `text-input` — a single-line text input field <input type="text">

## References

- Wikipedia: [Iranian identity card](https://en.wikipedia.org/wiki/Iranian_identity_card)

---

Lily™ and Lily Design System™ are trademarks.
