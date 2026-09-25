# Singapore National Registration Identity Card View

SingaporeNationalRegistrationIdentityCardView is a headless read-only display of Singapore's National Registration Identity Card Number / Foreign Identification Number (NRIC/FIN), Singapore's government-issued personal identifier. It renders as a `<span>` with an accessible label. It is the read-only companion to SingaporeNationalRegistrationIdentityCardInput.

**Status:** beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow.

## Implementation Notes

- Renders as `<span>`
- Format: One letter (S or T for citizens/permanent residents; F or G for long-term foreign residents; M for newer FIN series), seven digits, and a trailing check letter. The check letter is computed by multiplying the seven digits by fixed weights (2,7,6,5,4,3,2), summing the products (adding 4 for a G/T prefix or 3 for an M prefix), taking the sum Modulus 11, and mapping (10 - remainder) through a lookup table to a letter.
- Provides accessible name via the `label` prop
- Companion to SingaporeNationalRegistrationIdentityCardInput

## Props

- `value`: string (default: "") — the identifier to display
- `label`: string (required) — accessible label via `aria-label`
- `...restProps`: any — additional HTML attributes spread onto the `<span>`

## Usage

```html
<SummaryList>
  <SummaryListItem term="National Registration Identity Card Number / Foreign Identification Number (NRIC/FIN)">
    <SingaporeNationalRegistrationIdentityCardView label="National Registration Identity Card Number / Foreign Identification Number (NRIC/FIN)" value={value} />
  </SummaryListItem>
</SummaryList>
```

## ARIA

- `aria-label={label}` — provides the accessible name

## When to Use

- Use to display a stored Singapore National Registration Identity Card Number / Foreign Identification Number (NRIC/FIN) read-only.
- Use in summary lists, patient records, audit logs, or detail views.
- Use when the identifier should not be editable in the current context.

## When Not to Use

- Do not use for editing identifiers — use `singapore-national-registration-identity-card-input` instead.
- Do not use for general text display — use a `<span>` directly.
- Do not use for other countries' identifiers — use the corresponding country-specific view.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.singapore-national-registration-identity-card-view` class hook.

## Testing

- Verify renders a `<span>` with the correct class
- Verify the `value` prop is rendered as text content
- Verify `aria-label` is set from the `label` prop

## Domain Knowledge

One letter (S or T for citizens/permanent residents; F or G for long-term foreign residents; M for newer FIN series), seven digits, and a trailing check letter. The check letter is computed by multiplying the seven digits by fixed weights (2,7,6,5,4,3,2), summing the products (adding 4 for a G/T prefix or 3 for an M prefix), taking the sum Modulus 11, and mapping (10 - remainder) through a lookup table to a letter.

**Where to find it:** Printed on the pink (citizen), blue (permanent resident), or FIN-series NRIC/employment/work-pass card, and required to enrol in Singapore's MediSave/MediShield Life national health schemes.

## Related components

- `singapore-national-registration-identity-card-input` — an input for entering Singapore's National Registration Identity Card Number / Foreign Identification Number (NRIC/FIN)
- `summary-list-item` — one key-value pair in a summary list

## References

- Wikipedia: [National Registration Identity Card](https://en.wikipedia.org/wiki/National_Registration_Identity_Card)

---

Lily™ and Lily Design System™ are trademarks.
