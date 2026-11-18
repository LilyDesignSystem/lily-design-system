# Sri Lanka National Identity Card Input

SriLankaNationalIdentityCardInput is a headless input for entering Sri Lanka's National Identity Card (NIC) number, Sri Lanka's government-issued personal identifier. It renders as `<input type="text">` with `autocomplete="off"` to protect sensitive identifiers. It is the editable companion to SriLankaNationalIdentityCardView.

**Status:** beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow.

## Implementation Notes

- Renders as `<input type="text">`
- Format: Two forms. Before 2016: nine digits and a letter, V or X (742192757V): the two-digit year of birth, the day of the year (with 500 added for women), a serial and a check digit. Since 2016: twelve digits (197419202757): the four-digit year of birth, the same day of the year, a four-digit serial and the check digit. The check-digit algorithm is not published.
- `autocomplete="off"` to protect sensitive identifiers
- Supports two-way binding on the `value` prop
- Companion to SriLankaNationalIdentityCardView

## Props

- `label`: string (required) — accessible label via `aria-label`
- `value`: string (default: "") — bindable input value
- `required`: boolean (default: false) — form validation
- `disabled`: boolean (default: false) — disabled state
- `...restProps`: any — additional HTML attributes spread onto the `<input>`

## Usage

```html
<Field
  label="National Identity Card (NIC) number"
  required
>
  <SriLankaNationalIdentityCardInput
    label="National Identity Card (NIC) number"
    value="{value}"
    required
  />
  <Hint
    >Two forms. Before 2016: nine digits and a letter, V or X (742192757V): the two-digit year of
    birth, the day of the year (with 500 added for women), a serial and a check digit. Since 2016:
    twelve digits (197419202757): the four-digit year of birth, the same day of the year, a
    four-digit serial and the check digit. The check-digit algorithm is not published.</Hint
  >
  <ErrorMessage>Please enter a valid National Identity Card (NIC) number</ErrorMessage>
</Field>
```

## ARIA

- `aria-label={label}` — provides accessible name

## When to Use

- Use in forms collecting Sri Lanka's National Identity Card (NIC) number.
- Use in administrative or national-id workflows where the identifier is required.

## When Not to Use

- Do not use for displaying read-only identifiers — use `sri-lanka-national-identity-card-view` instead.
- Do not use for general text input — use `text-input` instead.
- Do not use for other countries' identifiers — use the corresponding country-specific input.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.sri-lanka-national-identity-card-input` class hook.

## Testing

- Verify renders an `<input>` with the correct class and `type="text"`
- Verify `aria-label` is set from the `label` prop
- Verify `autocomplete="off"`
- Verify value binding works

## Domain Knowledge

Two forms. Before 2016: nine digits and a letter, V or X (742192757V): the two-digit year of birth, the day of the year (with 500 added for women), a serial and a check digit. Since 2016: twelve digits (197419202757): the four-digit year of birth, the same day of the year, a four-digit serial and the check digit. The check-digit algorithm is not published.

**Where to find it:** Printed on the National Identity Card issued by the Department for Registration of Persons, and asked for by banks, employers and state services.

## Security and privacy

A national identifier is personal data, and often a key to other records.

- The input renders `autocomplete="off"`, so the browser neither saves nor offers the value, and `spellcheck="false"`, so an enhanced spellchecker does not send it to a cloud service. `bin/check-identifier-inputs` keeps both in all nine catalogs.
- Do not log the value, put it in a URL or query string, or send it to analytics or an error tracker; mask it there if it must appear.
- The component stores nothing. Do not keep the value in `localStorage`, `sessionStorage` or a cookie; submit it in the body of a POST over HTTPS.
- A format or checksum check proves the number is well formed, not that it belongs to the person entering it.
- The page decides who may see it: the input does not mask what is typed. Use the matching `-view` to show it back, masked as the service requires.

## Related components

- `sri-lanka-national-identity-card-view` — a read-only display of Sri Lanka's National Identity Card (NIC) number
- `text-input` — a single-line text input field <input type="text">

## References

- [National identity card (Sri Lanka)](<https://en.wikipedia.org/wiki/National_identity_card_(Sri_Lanka)>)

---

Lily™ and Lily Design System™ are trademarks.
