# Indonesia Nomor Induk Kependudukan Input

IndonesiaNomorIndukKependudukanInput is a headless input for entering Indonesia's Nomor Induk Kependudukan (NIK), Indonesia's government-issued personal identifier. It renders as `<input type="text">` with `autocomplete="off"` to protect sensitive identifiers. It is the editable companion to IndonesiaNomorIndukKependudukanView.

**Status:** beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow.

## Implementation Notes

- Renders as `<input type="text">`
- Format: Sixteen digits in the form PPKKCC-DDMMYY-NNNN: the first six digits encode province, regency/city, and sub-district of first registration; the next six encode date of birth (with 40 added to the day-of-month digits for a female holder, e.g. day 10 becomes 50); the final four digits are a sequence number disambiguating same-day-same-subdistrict registrations. No published check digit.
- `autocomplete="off"` to protect sensitive identifiers
- Supports two-way binding on the `value` prop
- Companion to IndonesiaNomorIndukKependudukanView

## Props

- `label`: string (required) — accessible label via `aria-label`
- `value`: string (default: "") — bindable input value
- `required`: boolean (default: false) — form validation
- `disabled`: boolean (default: false) — disabled state
- `...restProps`: any — additional HTML attributes spread onto the `<input>`

## Usage

```html
<Field label="Nomor Induk Kependudukan (NIK)" required>
  <IndonesiaNomorIndukKependudukanInput label="Nomor Induk Kependudukan (NIK)" value={value} required />
  <Hint>Sixteen digits in the form PPKKCC-DDMMYY-NNNN: the first six digits encode province, regency/city, and sub-district of first registration; the next six encode date of birth (with 40 added to the day-of-month digits for a female holder, e.g. day 10 becomes 50); the final four digits are a sequence number disambiguating same-day-same-subdistrict registrations. No published check digit.</Hint>
  <ErrorMessage>Please enter a valid Nomor Induk Kependudukan</ErrorMessage>
</Field>
```

## ARIA

- `aria-label={label}` — provides accessible name

## When to Use

- Use in forms collecting Indonesia's Nomor Induk Kependudukan (NIK).
- Use in administrative or national-id workflows where the identifier is required.

## When Not to Use

- Do not use for displaying read-only identifiers — use `indonesia-nomor-induk-kependudukan-view` instead.
- Do not use for general text input — use `text-input` instead.
- Do not use for other countries' identifiers — use the corresponding country-specific input.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.indonesia-nomor-induk-kependudukan-input` class hook.

## Testing

- Verify renders an `<input>` with the correct class and `type="text"`
- Verify `aria-label` is set from the `label` prop
- Verify `autocomplete="off"`
- Verify value binding works

## Domain Knowledge

Sixteen digits in the form PPKKCC-DDMMYY-NNNN: the first six digits encode province, regency/city, and sub-district of first registration; the next six encode date of birth (with 40 added to the day-of-month digits for a female holder, e.g. day 10 becomes 50); the final four digits are a sequence number disambiguating same-day-same-subdistrict registrations. No published check digit.

**Where to find it:** Printed on the Kartu Tanda Penduduk (KTP) national ID card, and required to enrol in BPJS Kesehatan, Indonesia's national government health-insurance body.

## Related components

- `indonesia-nomor-induk-kependudukan-view` — a read-only display of Indonesia's Nomor Induk Kependudukan (NIK)
- `text-input` — a single-line text input field <input type="text">

## References

- Wikipedia: [National identification number § Indonesia](https://en.wikipedia.org/wiki/National_identification_number#Indonesia)

---

Lily™ and Lily Design System™ are trademarks.
