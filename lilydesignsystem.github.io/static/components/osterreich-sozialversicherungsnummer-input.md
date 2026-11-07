# Osterreich Sozialversicherungsnummer Input

OsterreichSozialversicherungsnummerInput is a headless input for entering Austria's Sozialversicherungsnummer (SVNR), Austria's government-issued personal identifier. It renders as `<input type="text">` with `autocomplete="off"` to protect sensitive identifiers. It is the editable companion to OsterreichSozialversicherungsnummerView.

**Status:** beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow.

## Implementation Notes

- Renders as `<input type="text">`
- Format: Ten digits, displayed as NNNN DDMMYY. The first three digits are a serial number (the first not zero) followed by a Modulus-11 check digit as the fourth digit; the remaining six digits encode date of birth (DDMMYY). If the Modulus-11 remainder is 10, the serial number is incremented by one and the check digit recalculated.
- `autocomplete="off"` to protect sensitive identifiers
- Supports two-way binding on the `value` prop
- Companion to OsterreichSozialversicherungsnummerView

## Props

- `label`: string (required) — accessible label via `aria-label`
- `value`: string (default: "") — bindable input value
- `required`: boolean (default: false) — form validation
- `disabled`: boolean (default: false) — disabled state
- `...restProps`: any — additional HTML attributes spread onto the `<input>`

## Usage

```html
<Field
  label="Sozialversicherungsnummer (SVNR)"
  required
>
  <OsterreichSozialversicherungsnummerInput
    label="Sozialversicherungsnummer (SVNR)"
    value="{value}"
    required
  />
  <Hint
    >Ten digits, displayed as NNNN DDMMYY. The first three digits are a serial number (the first not
    zero) followed by a Modulus-11 check digit as the fourth digit; the remaining six digits encode
    date of birth (DDMMYY). If the Modulus-11 remainder is 10, the serial number is incremented by
    one and the check digit recalculated.</Hint
  >
  <ErrorMessage>Please enter a valid Sozialversicherungsnummer</ErrorMessage>
</Field>
```

## ARIA

- `aria-label={label}` — provides accessible name

## When to Use

- Use in forms collecting Austria's Sozialversicherungsnummer (SVNR).
- Use in administrative or national-id workflows where the identifier is required.

## When Not to Use

- Do not use for displaying read-only identifiers — use `osterreich-sozialversicherungsnummer-view` instead.
- Do not use for general text input — use `text-input` instead.
- Do not use for other countries' identifiers — use the corresponding country-specific input.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.osterreich-sozialversicherungsnummer-input` class hook.

## Testing

- Verify renders an `<input>` with the correct class and `type="text"`
- Verify `aria-label` is set from the `label` prop
- Verify `autocomplete="off"`
- Verify value binding works

## Domain Knowledge

Ten digits, displayed as NNNN DDMMYY. The first three digits are a serial number (the first not zero) followed by a Modulus-11 check digit as the fourth digit; the remaining six digits encode date of birth (DDMMYY). If the Modulus-11 remainder is 10, the serial number is incremented by one and the check digit recalculated.

**Where to find it:** Printed on the e-card (the Austrian health-insurance chip card) and required for every statutory health-insurance (Sozialversicherung), pension, and employment record.

## Security and privacy

A national identifier is personal data, and often a key to other records.

- The input renders `autocomplete="off"`, so the browser neither saves nor offers the value, and `spellcheck="false"`, so an enhanced spellchecker does not send it to a cloud service. `bin/check-identifier-inputs` keeps both in all nine catalogs.
- Do not log the value, put it in a URL or query string, or send it to analytics or an error tracker; mask it there if it must appear.
- The component stores nothing. Do not keep the value in `localStorage`, `sessionStorage` or a cookie; submit it in the body of a POST over HTTPS.
- A format or checksum check proves the number is well formed, not that it belongs to the person entering it.
- The page decides who may see it: the input does not mask what is typed. Use the matching `-view` to show it back, masked as the service requires.

## Related components

- `osterreich-sozialversicherungsnummer-view` — a read-only display of Austria's Sozialversicherungsnummer (SVNR)
- `text-input` — a single-line text input field <input type="text">

## References

- Wikipedia: [Sozialversicherungsnummer](https://de.wikipedia.org/wiki/Sozialversicherungsnummer)

---

Lily™ and Lily Design System™ are trademarks.
