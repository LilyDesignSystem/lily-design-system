# South Africa Identity Number View

SouthAfricaIdentityNumberView is a headless read-only display of South Africa's South African Identity Number, South Africa's government-issued personal identifier. It renders as a `<span>` with an accessible label. It is the read-only companion to SouthAfricaIdentityNumberInput.

**Status:** beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow.

## Implementation Notes

- Renders as `<span>`
- Format: Thirteen digits in the form YYMMDDSSSSCAZ: the first six encode date of birth; the next four encode sex (0000-4999 female, 5000-9999 male); the eleventh digit encodes citizenship status (0 citizen, 1 permanent resident, 2 refugee); the twelfth is a legacy field fixed at 8 on modern cards; the thirteenth is a Luhn (Modulus-10) check digit over the preceding twelve.
- Provides accessible name via the `label` prop
- Companion to SouthAfricaIdentityNumberInput

## Props

- `value`: string (default: "") — the identifier to display
- `label`: string (required) — accessible label via `aria-label`
- `...restProps`: any — additional HTML attributes spread onto the `<span>`

## Usage

```html
<SummaryList>
  <SummaryListItem term="South African Identity Number">
    <SouthAfricaIdentityNumberView label="South African Identity Number" value={value} />
  </SummaryListItem>
</SummaryList>
```

## ARIA

- `aria-label={label}` — provides the accessible name

## When to Use

- Use to display a stored South Africa South African Identity Number read-only.
- Use in summary lists, patient records, audit logs, or detail views.
- Use when the identifier should not be editable in the current context.

## When Not to Use

- Do not use for editing identifiers — use `south-africa-identity-number-input` instead.
- Do not use for general text display — use a `<span>` directly.
- Do not use for other countries' identifiers — use the corresponding country-specific view.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.south-africa-identity-number-view` class hook.

## Testing

- Verify renders a `<span>` with the correct class
- Verify the `value` prop is rendered as text content
- Verify `aria-label` is set from the `label` prop

## Domain Knowledge

Thirteen digits in the form YYMMDDSSSSCAZ: the first six encode date of birth; the next four encode sex (0000-4999 female, 5000-9999 male); the eleventh digit encodes citizenship status (0 citizen, 1 permanent resident, 2 refugee); the twelfth is a legacy field fixed at 8 on modern cards; the thirteenth is a Luhn (Modulus-10) check digit over the preceding twelve.

**Where to find it:** Printed on the South African Smart ID Card / green bar-coded ID book, and required to register for both public (NHI-track) and private medical aid schemes.

## Related components

- `south-africa-identity-number-input` — an input for entering South Africa's South African Identity Number
- `summary-list-item` — one key-value pair in a summary list

## References

- Wikipedia: [South African identity card](https://en.wikipedia.org/wiki/South_African_identity_card)

---

Lily™ and Lily Design System™ are trademarks.
