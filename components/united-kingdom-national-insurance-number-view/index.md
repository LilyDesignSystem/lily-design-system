# United Kingdom National Insurance Number View

UnitedKingdomNationalInsuranceNumberView is a headless read-only display of United Kingdom's National Insurance Number (NINO), United Kingdom's tax/welfare identifier. It renders as a `<span>` with `role="text"` so assistive technology announces the identifier as a single unit. It is the read-only companion to UnitedKingdomNationalInsuranceNumberInput.

## Implementation Notes

- Renders as `<span>` with `role="text"`
- Format: two prefix letters, six digits, and a suffix letter (A, B, C, or D) — e.g. AB123456A; the letters D, F, I, Q, U, V and the prefix-2 letter O are excluded
- Provides accessible name via the `value` content
- Companion to UnitedKingdomNationalInsuranceNumberInput

## Props

- `value`: string (required) — the identifier to display
- `label`: string (optional) — accessible label override via `aria-label`
- `...restProps`: any — additional HTML attributes spread onto the `<span>`

## Usage

```html
<SummaryList>
  <SummaryListItem term="National Insurance Number">
    <UnitedKingdomNationalInsuranceNumberView value={value} />
  </SummaryListItem>
</SummaryList>
```

## ARIA

- `role="text"` ensures the identifier is announced as a single unit

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

- Verify renders a `<span>` with the correct class and `role="text"`
- Verify the `value` prop is rendered as text content
- Verify `aria-label` overrides the accessible name when supplied

## Domain Knowledge

The National Insurance Number (NINO) is United Kingdom's tax/welfare identifier. Format: two prefix letters, six digits, and a suffix letter (A, B, C, or D) — e.g. AB123456A; the letters D, F, I, Q, U, V and the prefix-2 letter O are excluded.

## Related components

- `united-kingdom-national-insurance-number-input` — an input for entering United Kingdom's National Insurance Number (NINO)
- `summary-list-item` — one key-value pair in a summary list

## References

- Wikipedia: https://en.wikipedia.org/wiki/National_Insurance_number
