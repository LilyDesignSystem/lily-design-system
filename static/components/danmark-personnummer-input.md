# Danmark Personnummer Input

DanmarkPersonnummerInput is a headless input for entering Denmark's Personnummer (CPR-nummer) (CPR), Denmark's national-id identifier. It renders as `<input type="text">` with pattern validation, numeric/letter keyboard hints, and `autocomplete="off"` to protect sensitive identifiers. It is the editable companion to DanmarkPersonnummerView.

**Status:** beta — implemented and unit-tested in all seven frameworks with an axe-clean demo page; not yet exercised in composed flows.

## Implementation Notes

- Renders as `<input type="text">` with pattern validation
- Format: 10 digits in the format DDMMYYXXXX where the first 6 are the date of birth (DDMMYY)
- `autocomplete="off"` to protect sensitive identifiers
- Supports two-way binding on the `value` prop
- Companion to DanmarkPersonnummerView

## Props

- `label`: string (required) — accessible label via `aria-label`
- `value`: string (default: "") — bindable input value
- `required`: boolean (default: false) — form validation
- `disabled`: boolean (default: false) — disabled state
- `...restProps`: any — additional HTML attributes spread onto the `<input>`

## Usage

```html
<Field
  label="Personal Identity Code"
  required
>
  <DanmarkPersonnummerInput
    label="Personal Identity Code"
    value="{value}"
    required
  />
  <Hint>10 digits in the format DDMMYYXXXX where the first 6 are the date of birth (DDMMYY)</Hint>
  <ErrorMessage>Please enter a valid Personal Identity Code</ErrorMessage>
</Field>
```

## ARIA

- `aria-label={label}` — provides accessible name

## When to Use

- Use in forms collecting Denmark's Personnummer (CPR-nummer) (CPR).
- Use with pattern validation matching the documented format.
- Use in administrative or national-id workflows where the identifier is required.

## When Not to Use

- Do not use for displaying read-only identifiers — use `danmark-personnummer-view` instead.
- Do not use for general text input — use `text-input` instead.
- Do not use for other countries' identifiers — use the corresponding country-specific input.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.danmark-personnummer-input` class hook.

## Testing

- Verify renders an `<input>` with the correct class and `type="text"`
- Verify `aria-label` is set from the `label` prop
- Verify pattern attribute matches the documented format
- Verify `autocomplete="off"`
- Verify value binding works

## Domain Knowledge

Ten-digit code in the form DDMMYY-SSSC: the first six digits encode the date of birth, the next three are a serial number whose final digit encodes sex (odd for men, even for women), and the last is a Modulus-11 check digit (no longer mandatory for validation of new CPR numbers).

**Where to find it:** Danish health insurance card (sundhedskort), national ID, driving licence, passport, and most official correspondence.

## Security and privacy

A national identifier is personal data, and often a key to other records.

- The input renders `autocomplete="off"`, so the browser neither saves nor offers the value, and `spellcheck="false"`, so an enhanced spellchecker does not send it to a cloud service. `bin/check-identifier-inputs` keeps both in all nine catalogs.
- Do not log the value, put it in a URL or query string, or send it to analytics or an error tracker; mask it there if it must appear.
- The component stores nothing. Do not keep the value in `localStorage`, `sessionStorage` or a cookie; submit it in the body of a POST over HTTPS.
- A format or checksum check proves the number is well formed, not that it belongs to the person entering it.
- The page decides who may see it: the input does not mask what is typed. Use the matching `-view` to show it back, masked as the service requires.

## Related components

- `danmark-personnummer-view` — a read-only display of Denmark's Personnummer (CPR-nummer) (CPR)
- `text-input` — a single-line text input field <input type="text">

## References

- Wikipedia: https://en.wikipedia.org/wiki/Personal_identification_number_(Denmark)

---

Lily™ and Lily Design System™ are trademarks.
