# Bharat Aadhaar View

BharatAadhaarView is a headless read-only display of India's Aadhaar (आधार), India's government-issued personal identifier. It renders as a `<span>` with an accessible label. It is the read-only companion to BharatAadhaarInput.

**Status:** beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow.

## Implementation Notes

- Renders as `<span>`
- Format: Twelve digits, the first of which is never 0 or 1. The twelfth digit is a check digit computed with the Verhoeff algorithm, a checksum that detects every single-digit error and every adjacent-digit transposition. Issued by the Unique Identification Authority of India (UIDAI).
- Provides accessible name via the `label` prop
- Companion to BharatAadhaarInput

## Props

- `value`: string (default: "") — the identifier to display
- `label`: string (required) — accessible label via `aria-label`
- `...restProps`: any — additional HTML attributes spread onto the `<span>`

## Usage

```html
<SummaryList>
  <SummaryListItem term="Aadhaar (आधार)">
    <BharatAadhaarView label="Aadhaar (आधार)" value={value} />
  </SummaryListItem>
</SummaryList>
```

## ARIA

- `aria-label={label}` — provides the accessible name

## When to Use

- Use to display a stored India Aadhaar (आधार) read-only.
- Use in summary lists, patient records, audit logs, or detail views.
- Use when the identifier should not be editable in the current context.

## When Not to Use

- Do not use for editing identifiers — use `bharat-aadhaar-input` instead.
- Do not use for general text display — use a `<span>` directly.
- Do not use for other countries' identifiers — use the corresponding country-specific view.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.bharat-aadhaar-view` class hook.

## Testing

- Verify renders a `<span>` with the correct class
- Verify the `value` prop is rendered as text content
- Verify `aria-label` is set from the `label` prop

## Domain Knowledge

Twelve digits, the first of which is never 0 or 1. The twelfth digit is a check digit computed with the Verhoeff algorithm, a checksum that detects every single-digit error and every adjacent-digit transposition. Issued by the Unique Identification Authority of India (UIDAI).

**Where to find it:** Printed on the Aadhaar letter/card issued by UIDAI, and retrievable through the mAadhaar app and UIDAI's online portal.

## Related components

- `bharat-aadhaar-input` — an input for entering India's Aadhaar (आधार)
- `summary-list-item` — one key-value pair in a summary list

## References

- Wikipedia: [Aadhaar](https://en.wikipedia.org/wiki/Aadhaar)

---

Lily™ and Lily Design System™ are trademarks.
