# Aotearoa National Health Index Input

AotearoaNationalHealthIndexInput is a headless input for entering New Zealand's National Health Index (NHI) Number, New Zealand's government-issued personal identifier. It renders as `<input type="text">` with `autocomplete="off"` to protect sensitive identifiers. It is the editable companion to AotearoaNationalHealthIndexView.

**Status:** beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow.

## Implementation Notes

- Renders as `<input type="text">`
- Format: Seven-character identifier (three letters, four digits). The legacy AAANNNC format uses a Modulus-11 check digit over the six preceding characters; an expanded AAANNAX format (issued from July 2026) uses a Modulus-23 check digit instead, to extend the identifier space.
- `autocomplete="off"` to protect sensitive identifiers
- Supports two-way binding on the `value` prop
- Companion to AotearoaNationalHealthIndexView

## Props

- `label`: string (required) — accessible label via `aria-label`
- `value`: string (default: "") — bindable input value
- `required`: boolean (default: false) — form validation
- `disabled`: boolean (default: false) — disabled state
- `...restProps`: any — additional HTML attributes spread onto the `<input>`

## Usage

```html
<Field
  label="National Health Index (NHI) Number"
  required
>
  <AotearoaNationalHealthIndexInput
    label="National Health Index (NHI) Number"
    value="{value}"
    required
  />
  <Hint
    >Seven-character identifier (three letters, four digits). The legacy AAANNNC format uses a
    Modulus-11 check digit over the six preceding characters; an expanded AAANNAX format (issued
    from July 2026) uses a Modulus-23 check digit instead, to extend the identifier space.</Hint
  >
  <ErrorMessage>Please enter a valid National Health Index</ErrorMessage>
</Field>
```

## ARIA

- `aria-label={label}` — provides accessible name

## When to Use

- Use in forms collecting New Zealand's National Health Index (NHI) Number.
- Use in administrative or national-id workflows where the identifier is required.

## When Not to Use

- Do not use for displaying read-only identifiers — use `aotearoa-national-health-index-view` instead.
- Do not use for general text input — use `text-input` instead.
- Do not use for other countries' identifiers — use the corresponding country-specific input.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.aotearoa-national-health-index-input` class hook.

## Testing

- Verify renders an `<input>` with the correct class and `type="text"`
- Verify `aria-label` is set from the `label` prop
- Verify `autocomplete="off"`
- Verify value binding works

## Domain Knowledge

Seven-character identifier (three letters, four digits). The legacy AAANNNC format uses a Modulus-11 check digit over the six preceding characters; an expanded AAANNAX format (issued from July 2026) uses a Modulus-23 check digit instead, to extend the identifier space.

**Where to find it:** Printed on prescriptions, hospital and GP correspondence, and visible in patient portals such as Manage My Health.

## Security and privacy

A national identifier is personal data, and often a key to other records.

- The input renders `autocomplete="off"`, so the browser neither saves nor offers the value, and `spellcheck="false"`, so an enhanced spellchecker does not send it to a cloud service. `bin/check-identifier-inputs` keeps both in all nine catalogs.
- Do not log the value, put it in a URL or query string, or send it to analytics or an error tracker; mask it there if it must appear.
- The component stores nothing. Do not keep the value in `localStorage`, `sessionStorage` or a cookie; submit it in the body of a POST over HTTPS.
- A format or checksum check proves the number is well formed, not that it belongs to the person entering it.
- The page decides who may see it: the input does not mask what is typed. Use the matching `-view` to show it back, masked as the service requires.

## Related components

- `aotearoa-national-health-index-view` — a read-only display of New Zealand's National Health Index (NHI) Number
- `text-input` — a single-line text input field <input type="text">

## References

- Wikipedia: [NHI Number](https://en.wikipedia.org/wiki/NHI_Number)

---

Lily™ and Lily Design System™ are trademarks.
