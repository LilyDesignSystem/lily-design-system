# Prathet Thai Lek Prajam Tua Prachachon Input

PrathetThaiLekPrajamTuaPrachachonInput is a headless input for entering Thailand's เลขประจำตัวประชาชน (Lek Prajam Tua Prachachon), Thailand's government-issued personal identifier. It renders as `<input type="text">` with `autocomplete="off"` to protect sensitive identifiers. It is the editable companion to PrathetThaiLekPrajamTuaPrachachonView.

**Status:** beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow.

## Implementation Notes

- Renders as `<input type="text">`
- Format: Thirteen digits. Digit 1 denotes registration category; digits 2-5 denote the district/province office of registration; digits 6-10 form a serial number; digit 11 is a Modulus-11 check digit computed over the first ten digits; digits 12-13 are further disambiguating digits.
- `autocomplete="off"` to protect sensitive identifiers
- Supports two-way binding on the `value` prop
- Companion to PrathetThaiLekPrajamTuaPrachachonView

## Props

- `label`: string (required) — accessible label via `aria-label`
- `value`: string (default: "") — bindable input value
- `required`: boolean (default: false) — form validation
- `disabled`: boolean (default: false) — disabled state
- `...restProps`: any — additional HTML attributes spread onto the `<input>`

## Usage

```html
<Field
  label="เลขประจำตัวประชาชน (Lek Prajam Tua Prachachon)"
  required
>
  <PrathetThaiLekPrajamTuaPrachachonInput
    label="เลขประจำตัวประชาชน (Lek Prajam Tua Prachachon)"
    value="{value}"
    required
  />
  <Hint
    >Thirteen digits. Digit 1 denotes registration category; digits 2-5 denote the district/province
    office of registration; digits 6-10 form a serial number; digit 11 is a Modulus-11 check digit
    computed over the first ten digits; digits 12-13 are further disambiguating digits.</Hint
  >
  <ErrorMessage>Please enter a valid เลขประจำตัวประชาชน</ErrorMessage>
</Field>
```

## ARIA

- `aria-label={label}` — provides accessible name

## When to Use

- Use in forms collecting Thailand's เลขประจำตัวประชาชน (Lek Prajam Tua Prachachon).
- Use in administrative or national-id workflows where the identifier is required.

## When Not to Use

- Do not use for displaying read-only identifiers — use `prathet-thai-lek-prajam-tua-prachachon-view` instead.
- Do not use for general text input — use `text-input` instead.
- Do not use for other countries' identifiers — use the corresponding country-specific input.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.prathet-thai-lek-prajam-tua-prachachon-input` class hook.

## Testing

- Verify renders an `<input>` with the correct class and `type="text"`
- Verify `aria-label` is set from the `label` prop
- Verify `autocomplete="off"`
- Verify value binding works

## Domain Knowledge

Thirteen digits. Digit 1 denotes registration category; digits 2-5 denote the district/province office of registration; digits 6-10 form a serial number; digit 11 is a Modulus-11 check digit computed over the first ten digits; digits 12-13 are further disambiguating digits.

**Where to find it:** Printed on the Thai National ID Card (บัตรประจำตัวประชาชน) and required to register for the Universal Coverage Scheme (the "Gold Card"), Thailand's national health-insurance system.

## Security and privacy

A national identifier is personal data, and often a key to other records.

- The input renders `autocomplete="off"`, so the browser neither saves nor offers the value, and `spellcheck="false"`, so an enhanced spellchecker does not send it to a cloud service. `bin/check-identifier-inputs` keeps both in all nine catalogs.
- Do not log the value, put it in a URL or query string, or send it to analytics or an error tracker; mask it there if it must appear.
- The component stores nothing. Do not keep the value in `localStorage`, `sessionStorage` or a cookie; submit it in the body of a POST over HTTPS.
- A format or checksum check proves the number is well formed, not that it belongs to the person entering it.
- The page decides who may see it: the input does not mask what is typed. Use the matching `-view` to show it back, masked as the service requires.

## Related components

- `prathet-thai-lek-prajam-tua-prachachon-view` — a read-only display of Thailand's เลขประจำตัวประชาชน (Lek Prajam Tua Prachachon)
- `text-input` — a single-line text input field <input type="text">

## References

- Wikipedia: [Thai identity card](https://en.wikipedia.org/wiki/Thai_identity_card)

---

Lily™ and Lily Design System™ are trademarks.
