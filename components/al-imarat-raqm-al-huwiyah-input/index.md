# Al Imarat Raqm Al Huwiyah Input

AlImaratRaqmAlHuwiyahInput is a headless input for entering the United Arab Emirates' Emirates ID number, the United Arab Emirates' government-issued personal identifier. It renders as `<input type="text">` with `autocomplete="off"` to protect sensitive identifiers. It is the editable companion to AlImaratRaqmAlHuwiyahView.

**Status:** beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow.

## Implementation Notes

- Renders as `<input type="text">`
- Format: Fifteen digits, written 784-YYYY-NNNNNNN-C: 784 (the country's ISO numeric code), four digits that are usually but not always the year of birth, a seven-digit serial and a check digit. Vendors document a Luhn check over the fifteen digits; the issuer does not publish it, so treat a failure as a warning.
- `autocomplete="off"` to protect sensitive identifiers
- Supports two-way binding on the `value` prop
- Companion to AlImaratRaqmAlHuwiyahView

## Props

- `label`: string (required) — accessible label via `aria-label`
- `value`: string (default: "") — bindable input value
- `required`: boolean (default: false) — form validation
- `disabled`: boolean (default: false) — disabled state
- `...restProps`: any — additional HTML attributes spread onto the `<input>`

## Usage

```html
<Field
  label="Emirates ID number"
  required
>
  <AlImaratRaqmAlHuwiyahInput
    label="Emirates ID number"
    value="{value}"
    required
  />
  <Hint
    >Fifteen digits, written 784-YYYY-NNNNNNN-C: 784 (the country's ISO numeric code), four digits
    that are usually but not always the year of birth, a seven-digit serial and a check digit.
    Vendors document a Luhn check over the fifteen digits; the issuer does not publish it, so treat
    a failure as a warning.</Hint
  >
  <ErrorMessage>Please enter a valid Emirates ID number</ErrorMessage>
</Field>
```

## ARIA

- `aria-label={label}` — provides accessible name

## When to Use

- Use in forms collecting the United Arab Emirates' Emirates ID number.
- Use in administrative or national-id workflows where the identifier is required.

## When Not to Use

- Do not use for displaying read-only identifiers — use `al-imarat-raqm-al-huwiyah-view` instead.
- Do not use for general text input — use `text-input` instead.
- Do not use for other countries' identifiers — use the corresponding country-specific input.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.al-imarat-raqm-al-huwiyah-input` class hook.

## Testing

- Verify renders an `<input>` with the correct class and `type="text"`
- Verify `aria-label` is set from the `label` prop
- Verify `autocomplete="off"`
- Verify value binding works

## Domain Knowledge

Fifteen digits, written 784-YYYY-NNNNNNN-C: 784 (the country's ISO numeric code), four digits that are usually but not always the year of birth, a seven-digit serial and a check digit. Vendors document a Luhn check over the fifteen digits; the issuer does not publish it, so treat a failure as a warning.

**Where to find it:** Printed on the Emirates ID card issued by the Federal Authority for Identity, Citizenship, Customs and Port Security (ICP), and used as the patient identifier in UAE health records.

## Security and privacy

A national identifier is personal data, and often a key to other records.

- The input renders `autocomplete="off"`, so the browser neither saves nor offers the value, and `spellcheck="false"`, so an enhanced spellchecker does not send it to a cloud service. `bin/check-identifier-inputs` keeps both in all nine catalogs.
- Do not log the value, put it in a URL or query string, or send it to analytics or an error tracker; mask it there if it must appear.
- The component stores nothing. Do not keep the value in `localStorage`, `sessionStorage` or a cookie; submit it in the body of a POST over HTTPS.
- A format or checksum check proves the number is well formed, not that it belongs to the person entering it.
- The page decides who may see it: the input does not mask what is typed. Use the matching `-view` to show it back, masked as the service requires.

## Related components

- `al-imarat-raqm-al-huwiyah-view` — a read-only display of the United Arab Emirates' Emirates ID number
- `text-input` — a single-line text input field <input type="text">

## References

- [Emirates ID](https://en.wikipedia.org/wiki/Emirates_ID)
- [Microsoft Purview: U.A.E. identity card number](https://learn.microsoft.com/en-us/purview/sit-defn-uae-identity-card-number)

---

Lily™ and Lily Design System™ are trademarks.
