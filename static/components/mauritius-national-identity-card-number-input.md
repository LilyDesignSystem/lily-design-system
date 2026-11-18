# Mauritius National Identity Card Number Input

MauritiusNationalIdentityCardNumberInput is a headless input for entering Mauritius's National Identity Card number, Mauritius's government-issued personal identifier. It renders as `<input type="text">` with `autocomplete="off"` to protect sensitive identifiers. It is the editable companion to MauritiusNationalIdentityCardNumberView.

**Status:** beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow.

## Implementation Notes

- Renders as `<input type="text">`
- Format: Fourteen characters: the first letter of the surname at birth, the date of birth as DDMMYY, a six-digit serial and a check character. The check character comes from the alphabet 0-9A-Z: sum each of the first thirteen characters' positions in that alphabet times the weights 14 down to 2, and take the character at (17 - sum) modulo 17.
- `autocomplete="off"` to protect sensitive identifiers
- Supports two-way binding on the `value` prop
- Companion to MauritiusNationalIdentityCardNumberView

## Props

- `label`: string (required) — accessible label via `aria-label`
- `value`: string (default: "") — bindable input value
- `required`: boolean (default: false) — form validation
- `disabled`: boolean (default: false) — disabled state
- `...restProps`: any — additional HTML attributes spread onto the `<input>`

## Usage

```html
<Field
  label="National Identity Card number"
  required
>
  <MauritiusNationalIdentityCardNumberInput
    label="National Identity Card number"
    value="{value}"
    required
  />
  <Hint
    >Fourteen characters: the first letter of the surname at birth, the date of birth as DDMMYY, a
    six-digit serial and a check character. The check character comes from the alphabet 0-9A-Z: sum
    each of the first thirteen characters' positions in that alphabet times the weights 14 down to
    2, and take the character at (17 - sum) modulo 17.</Hint
  >
  <ErrorMessage>Please enter a valid National Identity Card number</ErrorMessage>
</Field>
```

## ARIA

- `aria-label={label}` — provides accessible name

## When to Use

- Use in forms collecting Mauritius's National Identity Card number.
- Use in administrative or national-id workflows where the identifier is required.

## When Not to Use

- Do not use for displaying read-only identifiers — use `mauritius-national-identity-card-number-view` instead.
- Do not use for general text input — use `text-input` instead.
- Do not use for other countries' identifiers — use the corresponding country-specific input.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.mauritius-national-identity-card-number-input` class hook.

## Testing

- Verify renders an `<input>` with the correct class and `type="text"`
- Verify `aria-label` is set from the `label` prop
- Verify `autocomplete="off"`
- Verify value binding works

## Domain Knowledge

Fourteen characters: the first letter of the surname at birth, the date of birth as DDMMYY, a six-digit serial and a check character. The check character comes from the alphabet 0-9A-Z: sum each of the first thirteen characters' positions in that alphabet times the weights 14 down to 2, and take the character at (17 - sum) modulo 17.

**Where to find it:** Printed on the National Identity Card, and given at birth registration.

## Security and privacy

A national identifier is personal data, and often a key to other records.

- The input renders `autocomplete="off"`, so the browser neither saves nor offers the value, and `spellcheck="false"`, so an enhanced spellchecker does not send it to a cloud service. `bin/check-identifier-inputs` keeps both in all nine catalogs.
- Do not log the value, put it in a URL or query string, or send it to analytics or an error tracker; mask it there if it must appear.
- The component stores nothing. Do not keep the value in `localStorage`, `sessionStorage` or a cookie; submit it in the body of a POST over HTTPS.
- A format or checksum check proves the number is well formed, not that it belongs to the person entering it.
- The page decides who may see it: the input does not mask what is typed. Use the matching `-view` to show it back, masked as the service requires.

## Related components

- `mauritius-national-identity-card-number-view` — a read-only display of Mauritius's National Identity Card number
- `text-input` — a single-line text input field <input type="text">

## References

- [python-stdnum: stdnum.mu.nid](https://arthurdejong.org/python-stdnum/doc/2.2/stdnum.mu.nid)
- [List of national identity card policies by country](https://en.wikipedia.org/wiki/List_of_national_identity_card_policies_by_country)

---

Lily™ and Lily Design System™ are trademarks.
