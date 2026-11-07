# Magyarorszag Taj Szam Input

MagyarorszagTajSzamInput is a headless input for entering Hungary's Társadalombiztosítási Azonosító Jel (TAJ), Hungary's government-issued personal identifier. It renders as `<input type="text">` with `autocomplete="off"` to protect sensitive identifiers. It is the editable companion to MagyarorszagTajSzamView.

**Status:** beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow.

## Implementation Notes

- Renders as `<input type="text">`
- Format: Nine digits, displayed as SSS SSS SSK. The first eight digits are a simple issued-in-order serial number; the ninth is a check digit computed by multiplying the first eight digits by alternating weights 3 and 7, summing the products, and taking the result Modulus 10 — an algorithm unique to Hungary, distinct from Luhn.
- `autocomplete="off"` to protect sensitive identifiers
- Supports two-way binding on the `value` prop
- Companion to MagyarorszagTajSzamView

## Props

- `label`: string (required) — accessible label via `aria-label`
- `value`: string (default: "") — bindable input value
- `required`: boolean (default: false) — form validation
- `disabled`: boolean (default: false) — disabled state
- `...restProps`: any — additional HTML attributes spread onto the `<input>`

## Usage

```html
<Field
  label="Társadalombiztosítási Azonosító Jel (TAJ)"
  required
>
  <MagyarorszagTajSzamInput
    label="Társadalombiztosítási Azonosító Jel (TAJ)"
    value="{value}"
    required
  />
  <Hint
    >Nine digits, displayed as SSS SSS SSK. The first eight digits are a simple issued-in-order
    serial number; the ninth is a check digit computed by multiplying the first eight digits by
    alternating weights 3 and 7, summing the products, and taking the result Modulus 10 — an
    algorithm unique to Hungary, distinct from Luhn.</Hint
  >
  <ErrorMessage>Please enter a valid Társadalombiztosítási Azonosító Jel</ErrorMessage>
</Field>
```

## ARIA

- `aria-label={label}` — provides accessible name

## When to Use

- Use in forms collecting Hungary's Társadalombiztosítási Azonosító Jel (TAJ).
- Use in administrative or national-id workflows where the identifier is required.

## When Not to Use

- Do not use for displaying read-only identifiers — use `magyarorszag-taj-szam-view` instead.
- Do not use for general text input — use `text-input` instead.
- Do not use for other countries' identifiers — use the corresponding country-specific input.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.magyarorszag-taj-szam-input` class hook.

## Testing

- Verify renders an `<input>` with the correct class and `type="text"`
- Verify `aria-label` is set from the `label` prop
- Verify `autocomplete="off"`
- Verify value binding works

## Domain Knowledge

Nine digits, displayed as SSS SSS SSK. The first eight digits are a simple issued-in-order serial number; the ninth is a check digit computed by multiplying the first eight digits by alternating weights 3 and 7, summing the products, and taking the result Modulus 10 — an algorithm unique to Hungary, distinct from Luhn.

**Where to find it:** Printed on the TAJ card and required at every doctor visit, pharmacy, and hospital admission under Hungary's National Health Insurance Fund (NEAK).

## Security and privacy

A national identifier is personal data, and often a key to other records.

- The input renders `autocomplete="off"`, so the browser neither saves nor offers the value, and `spellcheck="false"`, so an enhanced spellchecker does not send it to a cloud service. `bin/check-identifier-inputs` keeps both in all nine catalogs.
- Do not log the value, put it in a URL or query string, or send it to analytics or an error tracker; mask it there if it must appear.
- The component stores nothing. Do not keep the value in `localStorage`, `sessionStorage` or a cookie; submit it in the body of a POST over HTTPS.
- A format or checksum check proves the number is well formed, not that it belongs to the person entering it.
- The page decides who may see it: the input does not mask what is typed. Use the matching `-view` to show it back, masked as the service requires.

## Related components

- `magyarorszag-taj-szam-view` — a read-only display of Hungary's Társadalombiztosítási Azonosító Jel (TAJ)
- `text-input` — a single-line text input field <input type="text">

## References

- Wikipedia: [Társadalombiztosítási azonosító jel](https://hu.wikipedia.org/wiki/T%C3%A1rsadalombiztos%C3%ADt%C3%A1si_azonos%C3%ADt%C3%B3_jel)

---

Lily™ and Lily Design System™ are trademarks.
