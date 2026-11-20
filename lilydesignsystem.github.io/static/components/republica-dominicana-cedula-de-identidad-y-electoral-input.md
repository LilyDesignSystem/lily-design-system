# Republica Dominicana Cedula De Identidad Y Electoral Input

RepublicaDominicanaCedulaDeIdentidadYElectoralInput is a headless input for entering the Dominican Republic's Cédula de Identidad y Electoral, the Dominican Republic's government-issued personal identifier. It renders as `<input type="text">` with `autocomplete="off"` to protect sensitive identifiers. It is the editable companion to RepublicaDominicanaCedulaDeIdentidadYElectoralView.

**Status:** beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow.

## Implementation Notes

- Renders as `<input type="text">`
- Format: Eleven digits, usually written 3-7-1 (001-1391820-5): a three-digit issuing office, a seven-digit sequence and a check digit computed with the Luhn algorithm over all eleven digits. A few early numbers fail the check and are still valid, so treat a Luhn failure as a warning, not a rejection.
- `autocomplete="off"` to protect sensitive identifiers
- Supports two-way binding on the `value` prop
- Companion to RepublicaDominicanaCedulaDeIdentidadYElectoralView

## Props

- `label`: string (required) — accessible label via `aria-label`
- `value`: string (default: "") — bindable input value
- `required`: boolean (default: false) — form validation
- `disabled`: boolean (default: false) — disabled state
- `...restProps`: any — additional HTML attributes spread onto the `<input>`

## Usage

```html
<Field
  label="Cédula de Identidad y Electoral"
  required
>
  <RepublicaDominicanaCedulaDeIdentidadYElectoralInput
    label="Cédula de Identidad y Electoral"
    value="{value}"
    required
  />
  <Hint
    >Eleven digits, usually written 3-7-1 (001-1391820-5): a three-digit issuing office, a
    seven-digit sequence and a check digit computed with the Luhn algorithm over all eleven digits.
    A few early numbers fail the check and are still valid, so treat a Luhn failure as a warning,
    not a rejection.</Hint
  >
  <ErrorMessage>Please enter a valid Cédula de Identidad y Electoral</ErrorMessage>
</Field>
```

## ARIA

- `aria-label={label}` — provides accessible name

## When to Use

- Use in forms collecting the Dominican Republic's Cédula de Identidad y Electoral.
- Use in administrative or national-id workflows where the identifier is required.

## When Not to Use

- Do not use for displaying read-only identifiers — use `republica-dominicana-cedula-de-identidad-y-electoral-view` instead.
- Do not use for general text input — use `text-input` instead.
- Do not use for other countries' identifiers — use the corresponding country-specific input.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.republica-dominicana-cedula-de-identidad-y-electoral-input` class hook.

## Testing

- Verify renders an `<input>` with the correct class and `type="text"`
- Verify `aria-label` is set from the `label` prop
- Verify `autocomplete="off"`
- Verify value binding works

## Domain Knowledge

Eleven digits, usually written 3-7-1 (001-1391820-5): a three-digit issuing office, a seven-digit sequence and a check digit computed with the Luhn algorithm over all eleven digits. A few early numbers fail the check and are still valid, so treat a Luhn failure as a warning, not a rejection.

**Where to find it:** Printed on the cédula issued by the Junta Central Electoral, and used to vote, to open a bank account and as the personal tax number.

## Security and privacy

A national identifier is personal data, and often a key to other records.

- The input renders `autocomplete="off"`, so the browser neither saves nor offers the value, and `spellcheck="false"`, so an enhanced spellchecker does not send it to a cloud service. `bin/check-identifier-inputs` keeps both in all nine catalogs.
- Do not log the value, put it in a URL or query string, or send it to analytics or an error tracker; mask it there if it must appear.
- The component stores nothing. Do not keep the value in `localStorage`, `sessionStorage` or a cookie; submit it in the body of a POST over HTTPS.
- A format or checksum check proves the number is well formed, not that it belongs to the person entering it.
- The page decides who may see it: the input does not mask what is typed. Use the matching `-view` to show it back, masked as the service requires.

## Related components

- `republica-dominicana-cedula-de-identidad-y-electoral-view` — a read-only display of the Dominican Republic's Cédula de Identidad y Electoral
- `text-input` — a single-line text input field <input type="text">

## Known limitations

None known.

## References

- [Junta Central Electoral (República Dominicana)](<https://es.wikipedia.org/wiki/Junta_Central_Electoral_(Rep%C3%BAblica_Dominicana)>)
- [python-stdnum: stdnum.do.cedula](https://arthurdejong.org/python-stdnum/doc/2.2/stdnum.do.cedula)

---

Lily™ and Lily Design System™ are trademarks.
