# United Kingdom National Insurance Number View

UnitedKingdomNationalInsuranceNumberView is a headless read-only display of United Kingdom's National Insurance Number (NINO), United Kingdom's tax/welfare identifier. It renders as a `<span>`. It is the read-only companion to UnitedKingdomNationalInsuranceNumberInput.

**Status:** beta — implemented and unit-tested in all seven frameworks with an axe-clean demo page; not yet exercised in composed flows.

## Implementation Notes

- Renders as `<span>`, with no role
- Format: two prefix letters, six digits, and a suffix letter (A, B, C, or D) — e.g. AB123456A; the letters D, F, I, Q, U, V and the prefix-2 letter O are excluded
- Provides accessible name via the `value` content
- Companion to UnitedKingdomNationalInsuranceNumberInput

## Props

- `value`: string (required) — the identifier to display
- `label`: string (optional) — hidden text naming the value, in a `.screen-reader-span`. Leave it out when a visible caption names the value
- `...restProps`: any — additional HTML attributes spread onto the `<span>`

## Usage

```html
<SummaryList>
  <SummaryListItem term="National Insurance Number">
    <UnitedKingdomNationalInsuranceNumberView value="{value}" />
  </SummaryListItem>
</SummaryList>
```

## ARIA

- No role, and no `aria-label`: a `<span>` cannot take a name, so `label` renders as hidden text in a `screen-reader-span`

## When to Use

- Use to display a stored United Kingdom National Insurance Number (NINO) read-only.
- Use in summary lists, patient records, audit logs, or detail views.
- Use when the identifier should not be editable in the current context.

## When Not to Use

- Do not use for editing identifiers — use `united-kingdom-national-insurance-number-input` instead.
- Do not use for general text display — use a `<span>` directly.
- Do not use for other countries' identifiers — use the corresponding country-specific view.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.united-kingdom-national-insurance-number-view` class hook.

## Testing

- Verify renders a `<span>` with the correct class, no role and no `aria-label`
- Verify the `value` prop is rendered as text content
- Verify `label` renders as hidden text, and that the root has no `aria-label`

## Domain Knowledge

Two prefix letters, six digits, and one suffix letter (always A, B, C, or D). Example: AB123456A. The letters D, F, I, Q, U, and V are not used as either of the first two letters of the prefix; O is not used as the second letter. Administrative prefixes used internally by HMRC and DWP (OO, CR, FY, MW, NC, PP, PZ, TN) are not valid NINOs. No check-digit or checksum algorithm is published for this identifier; correctness is confirmed by the issuing authority's own records, not by the format alone.

**Where to find it:** Plastic National Insurance card (legacy), letters from HMRC or DWP, payslips, form P60, tax returns, and the HMRC personal tax account.

## Related components

- `united-kingdom-national-insurance-number-input` — an input for entering United Kingdom's National Insurance Number (NINO)
- `summary-list-item` — one key-value pair in a summary list

## References

- Wikipedia: https://en.wikipedia.org/wiki/National_Insurance_number

---

Lily™ and Lily Design System™ are trademarks.
