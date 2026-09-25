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
<Field label="เลขประจำตัวประชาชน (Lek Prajam Tua Prachachon)" required>
  <PrathetThaiLekPrajamTuaPrachachonInput label="เลขประจำตัวประชาชน (Lek Prajam Tua Prachachon)" value={value} required />
  <Hint>Thirteen digits. Digit 1 denotes registration category; digits 2-5 denote the district/province office of registration; digits 6-10 form a serial number; digit 11 is a Modulus-11 check digit computed over the first ten digits; digits 12-13 are further disambiguating digits.</Hint>
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

## Related components

- `prathet-thai-lek-prajam-tua-prachachon-view` — a read-only display of Thailand's เลขประจำตัวประชาชน (Lek Prajam Tua Prachachon)
- `text-input` — a single-line text input field <input type="text">

## References

- Wikipedia: [Thai identity card](https://en.wikipedia.org/wiki/Thai_identity_card)

---

Lily™ and Lily Design System™ are trademarks.
