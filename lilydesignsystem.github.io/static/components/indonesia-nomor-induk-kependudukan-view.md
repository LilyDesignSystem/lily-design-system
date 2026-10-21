# Indonesia Nomor Induk Kependudukan View

IndonesiaNomorIndukKependudukanView is a headless read-only display of Indonesia's Nomor Induk Kependudukan (NIK), Indonesia's government-issued personal identifier. It renders as a `<span>` with an accessible label. It is the read-only companion to IndonesiaNomorIndukKependudukanInput.

**Status:** beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow.

## Implementation Notes

- Renders as `<span>`
- Format: Sixteen digits in the form PPKKCC-DDMMYY-NNNN: the first six digits encode province, regency/city, and sub-district of first registration; the next six encode date of birth (with 40 added to the day-of-month digits for a female holder, e.g. day 10 becomes 50); the final four digits are a sequence number disambiguating same-day-same-subdistrict registrations. No published check digit.
- Provides accessible name via the `label` prop
- Companion to IndonesiaNomorIndukKependudukanInput

## Props

- `value`: string (default: "") — the identifier to display
- `label`: string (required) — accessible label via `aria-label`
- `...restProps`: any — additional HTML attributes spread onto the `<span>`

## Usage

```html
<SummaryList>
  <SummaryListItem term="Nomor Induk Kependudukan (NIK)">
    <IndonesiaNomorIndukKependudukanView label="Nomor Induk Kependudukan (NIK)" value={value} />
  </SummaryListItem>
</SummaryList>
```

## ARIA

- `aria-label={label}` — provides the accessible name

## When to Use

- Use to display a stored Indonesia Nomor Induk Kependudukan (NIK) read-only.
- Use in summary lists, patient records, audit logs, or detail views.
- Use when the identifier should not be editable in the current context.

## When Not to Use

- Do not use for editing identifiers — use `indonesia-nomor-induk-kependudukan-input` instead.
- Do not use for general text display — use a `<span>` directly.
- Do not use for other countries' identifiers — use the corresponding country-specific view.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.indonesia-nomor-induk-kependudukan-view` class hook.

## Testing

- Verify renders a `<span>` with the correct class
- Verify the `value` prop is rendered as text content
- Verify `aria-label` is set from the `label` prop

## Domain Knowledge

Sixteen digits in the form PPKKCC-DDMMYY-NNNN: the first six digits encode province, regency/city, and sub-district of first registration; the next six encode date of birth (with 40 added to the day-of-month digits for a female holder, e.g. day 10 becomes 50); the final four digits are a sequence number disambiguating same-day-same-subdistrict registrations. No published check digit.

**Where to find it:** Printed on the Kartu Tanda Penduduk (KTP) national ID card, and required to enrol in BPJS Kesehatan, Indonesia's national government health-insurance body.

## Related components

- `indonesia-nomor-induk-kependudukan-input` — an input for entering Indonesia's Nomor Induk Kependudukan (NIK)
- `summary-list-item` — one key-value pair in a summary list

## References

- Wikipedia: [National identification number § Indonesia](https://en.wikipedia.org/wiki/National_identification_number#Indonesia)

---

Lily™ and Lily Design System™ are trademarks.
