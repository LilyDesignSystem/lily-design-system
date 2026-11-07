# Nigeria National Identification Number Input

NigeriaNationalIdentificationNumberInput is a headless input for entering Nigeria's National Identification Number (NIN), Nigeria's government-issued personal identifier. It renders as `<input type="text">` with `autocomplete="off"` to protect sensitive identifiers. It is the editable companion to NigeriaNationalIdentificationNumberView.

**Status:** beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow.

## Implementation Notes

- Renders as `<input type="text">`
- Format: Eleven digits issued by the National Identity Management Commission (NIMC). No check-digit algorithm is published, so only the length and digits can be checked.
- `autocomplete="off"` to protect sensitive identifiers
- Supports two-way binding on the `value` prop
- Companion to NigeriaNationalIdentificationNumberView

## Props

- `label`: string (required) — accessible label via `aria-label`
- `value`: string (default: "") — bindable input value
- `required`: boolean (default: false) — form validation
- `disabled`: boolean (default: false) — disabled state
- `...restProps`: any — additional HTML attributes spread onto the `<input>`

## Usage

```html
<Field
  label="National Identification Number (NIN)"
  required
>
  <NigeriaNationalIdentificationNumberInput
    label="National Identification Number (NIN)"
    value="{value}"
    required
  />
  <Hint
    >Eleven digits issued by the National Identity Management Commission (NIMC). No check-digit
    algorithm is published, so only the length and digits can be checked.</Hint
  >
  <ErrorMessage>Please enter a valid National Identification Number (NIN)</ErrorMessage>
</Field>
```

## ARIA

- `aria-label={label}` — provides accessible name

## When to Use

- Use in forms collecting Nigeria's National Identification Number (NIN).
- Use in administrative or national-id workflows where the identifier is required.

## When Not to Use

- Do not use for displaying read-only identifiers — use `nigeria-national-identification-number-view` instead.
- Do not use for general text input — use `text-input` instead.
- Do not use for other countries' identifiers — use the corresponding country-specific input.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.nigeria-national-identification-number-input` class hook.

## Testing

- Verify renders an `<input>` with the correct class and `type="text"`
- Verify `aria-label` is set from the `label` prop
- Verify `autocomplete="off"`
- Verify value binding works

## Domain Knowledge

Eleven digits issued by the National Identity Management Commission (NIMC). No check-digit algorithm is published, so only the length and digits can be checked.

**Where to find it:** Shown on the NIN slip and in the NIMC mobile app, and asked for when registering a SIM card, opening a bank account or applying for a passport.

## Security and privacy

A national identifier is personal data, and often a key to other records.

- The input renders `autocomplete="off"`, so the browser neither saves nor offers the value, and `spellcheck="false"`, so an enhanced spellchecker does not send it to a cloud service. `bin/check-identifier-inputs` keeps both in all nine catalogs.
- Do not log the value, put it in a URL or query string, or send it to analytics or an error tracker; mask it there if it must appear.
- The component stores nothing. Do not keep the value in `localStorage`, `sessionStorage` or a cookie; submit it in the body of a POST over HTTPS.
- A format or checksum check proves the number is well formed, not that it belongs to the person entering it.
- The page decides who may see it: the input does not mask what is typed. Use the matching `-view` to show it back, masked as the service requires.

## Related components

- `nigeria-national-identification-number-view` — a read-only display of Nigeria's National Identification Number (NIN)
- `text-input` — a single-line text input field <input type="text">

## References

- Wikipedia: [National Identity Management Commission](https://en.wikipedia.org/wiki/National_Identity_Management_Commission)

---

Lily™ and Lily Design System™ are trademarks.
