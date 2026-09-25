# Prathet Thai Lek Prajam Tua Prachachon View

PrathetThaiLekPrajamTuaPrachachonView is a headless read-only display of Thailand's เลขประจำตัวประชาชน (Lek Prajam Tua Prachachon), Thailand's government-issued personal identifier. It renders as a `<span>` with an accessible label. It is the read-only companion to PrathetThaiLekPrajamTuaPrachachonInput.

**Status:** beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow.

## Implementation Notes

- Renders as `<span>`
- Format: Thirteen digits. Digit 1 denotes registration category; digits 2-5 denote the district/province office of registration; digits 6-10 form a serial number; digit 11 is a Modulus-11 check digit computed over the first ten digits; digits 12-13 are further disambiguating digits.
- Provides accessible name via the `label` prop
- Companion to PrathetThaiLekPrajamTuaPrachachonInput

## Props

- `value`: string (default: "") — the identifier to display
- `label`: string (required) — accessible label via `aria-label`
- `...restProps`: any — additional HTML attributes spread onto the `<span>`

## Usage

```html
<SummaryList>
  <SummaryListItem term="เลขประจำตัวประชาชน (Lek Prajam Tua Prachachon)">
    <PrathetThaiLekPrajamTuaPrachachonView label="เลขประจำตัวประชาชน (Lek Prajam Tua Prachachon)" value={value} />
  </SummaryListItem>
</SummaryList>
```

## ARIA

- `aria-label={label}` — provides the accessible name

## When to Use

- Use to display a stored Thailand เลขประจำตัวประชาชน (Lek Prajam Tua Prachachon) read-only.
- Use in summary lists, patient records, audit logs, or detail views.
- Use when the identifier should not be editable in the current context.

## When Not to Use

- Do not use for editing identifiers — use `prathet-thai-lek-prajam-tua-prachachon-input` instead.
- Do not use for general text display — use a `<span>` directly.
- Do not use for other countries' identifiers — use the corresponding country-specific view.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.prathet-thai-lek-prajam-tua-prachachon-view` class hook.

## Testing

- Verify renders a `<span>` with the correct class
- Verify the `value` prop is rendered as text content
- Verify `aria-label` is set from the `label` prop

## Domain Knowledge

Thirteen digits. Digit 1 denotes registration category; digits 2-5 denote the district/province office of registration; digits 6-10 form a serial number; digit 11 is a Modulus-11 check digit computed over the first ten digits; digits 12-13 are further disambiguating digits.

**Where to find it:** Printed on the Thai National ID Card (บัตรประจำตัวประชาชน) and required to register for the Universal Coverage Scheme (the "Gold Card"), Thailand's national health-insurance system.

## Related components

- `prathet-thai-lek-prajam-tua-prachachon-input` — an input for entering Thailand's เลขประจำตัวประชาชน (Lek Prajam Tua Prachachon)
- `summary-list-item` — one key-value pair in a summary list

## References

- Wikipedia: [Thai identity card](https://en.wikipedia.org/wiki/Thai_identity_card)

---

Lily™ and Lily Design System™ are trademarks.
