# Bangladesh National Identity Card Input

BangladeshNationalIdentityCardInput is a headless input for entering Bangladesh's National ID (NID) number, Bangladesh's government-issued personal identifier. It renders as `<input type="text">` with `autocomplete="off"` to protect sensitive identifiers. It is the editable companion to BangladeshNationalIdentityCardView.

**Status:** beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow.

## Implementation Notes

- Renders as `<input type="text">`
- Format: Three lengths are in use: 13 digits on the older laminated cards, 17 digits (the 13-digit number with the four-digit year of birth in front) and 10 digits on the smart card since 2016, nine of them random and the last a check digit whose algorithm is not published. Accept all three lengths.
- `autocomplete="off"` to protect sensitive identifiers
- Supports two-way binding on the `value` prop
- Companion to BangladeshNationalIdentityCardView

## Props

- `label`: string (required) — accessible label via `aria-label`
- `value`: string (default: "") — bindable input value
- `required`: boolean (default: false) — form validation
- `disabled`: boolean (default: false) — disabled state
- `...restProps`: any — additional HTML attributes spread onto the `<input>`

## Usage

```html
<Field
  label="National ID (NID) number"
  required
>
  <BangladeshNationalIdentityCardInput
    label="National ID (NID) number"
    value="{value}"
    required
  />
  <Hint
    >Three lengths are in use: 13 digits on the older laminated cards, 17 digits (the 13-digit
    number with the four-digit year of birth in front) and 10 digits on the smart card since 2016,
    nine of them random and the last a check digit whose algorithm is not published. Accept all
    three lengths.</Hint
  >
  <ErrorMessage>Please enter a valid National ID (NID) number</ErrorMessage>
</Field>
```

## ARIA

- `aria-label={label}` — provides accessible name

## When to Use

- Use in forms collecting Bangladesh's National ID (NID) number.
- Use in administrative or national-id workflows where the identifier is required.

## When Not to Use

- Do not use for displaying read-only identifiers — use `bangladesh-national-identity-card-view` instead.
- Do not use for general text input — use `text-input` instead.
- Do not use for other countries' identifiers — use the corresponding country-specific input.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.bangladesh-national-identity-card-input` class hook.

## Testing

- Verify renders an `<input>` with the correct class and `type="text"`
- Verify `aria-label` is set from the `label` prop
- Verify `autocomplete="off"`
- Verify value binding works

## Domain Knowledge

Three lengths are in use: 13 digits on the older laminated cards, 17 digits (the 13-digit number with the four-digit year of birth in front) and 10 digits on the smart card since 2016, nine of them random and the last a check digit whose algorithm is not published. Accept all three lengths.

**Where to find it:** Printed on the National ID card (smart card or laminated card), and asked for to register a SIM card, open a bank account or apply for a passport.

## Security and privacy

A national identifier is personal data, and often a key to other records.

- The input renders `autocomplete="off"`, so the browser neither saves nor offers the value, and `spellcheck="false"`, so an enhanced spellchecker does not send it to a cloud service. `bin/check-identifier-inputs` keeps both in all nine catalogs.
- Do not log the value, put it in a URL or query string, or send it to analytics or an error tracker; mask it there if it must appear.
- The component stores nothing. Do not keep the value in `localStorage`, `sessionStorage` or a cookie; submit it in the body of a POST over HTTPS.
- A format or checksum check proves the number is well formed, not that it belongs to the person entering it.
- The page decides who may see it: the input does not mask what is typed. Use the matching `-view` to show it back, masked as the service requires.

## Related components

- `bangladesh-national-identity-card-view` — a read-only display of Bangladesh's National ID (NID) number
- `text-input` — a single-line text input field <input type="text">

## References

- [National identity card (Bangladesh)](<https://en.wikipedia.org/wiki/National_identity_card_(Bangladesh)>)
- [bdnews24: EC decides on 10-digit smart NID cards](https://bdnews24.com/bangladesh/election-commission-decides-on-10-digit-smart-nid-cards-for-bangladesh-nationals)

---

Lily™ and Lily Design System™ are trademarks.
