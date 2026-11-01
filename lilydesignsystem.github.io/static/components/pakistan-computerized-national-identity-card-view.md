# Pakistan Computerized National Identity Card View

PakistanComputerizedNationalIdentityCardView is a headless read-only display of Pakistan's Computerized National Identity Card Number (CNIC), Pakistan's government-issued personal identifier. It renders as a `<span>` with an accessible label. It is the read-only companion to PakistanComputerizedNationalIdentityCardInput.

**Status:** beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow.

## Implementation Notes

- Renders as `<span>`
- Format: Thirteen digits, written 12345-1234567-1: a five-digit locality code (province, division, district and tehsil), a seven-digit family number, and a final digit that is odd for a male and even for a female. There is no check digit.
- Provides accessible name via the `label` prop
- Companion to PakistanComputerizedNationalIdentityCardInput

## Props

- `value`: string (default: "") — the identifier to display
- `label`: string (required) — accessible label via `aria-label`
- `...restProps`: any — additional HTML attributes spread onto the `<span>`

## Usage

```html
<SummaryList>
  <SummaryListItem term="Computerized National Identity Card Number (CNIC)">
    <PakistanComputerizedNationalIdentityCardView
      label="Computerized National Identity Card Number (CNIC)"
      value="{value}"
    />
  </SummaryListItem>
</SummaryList>
```

## ARIA

- `aria-label={label}` — provides the accessible name

## When to Use

- Use to display a stored Pakistan Computerized National Identity Card Number (CNIC) read-only.
- Use in summary lists, patient records, audit logs, or detail views.
- Use when the identifier should not be editable in the current context.

## When Not to Use

- Do not use for editing identifiers — use `pakistan-computerized-national-identity-card-input` instead.
- Do not use for general text display — use a `<span>` directly.
- Do not use for other countries' identifiers — use the corresponding country-specific view.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.pakistan-computerized-national-identity-card-view` class hook.

## Testing

- Verify renders a `<span>` with the correct class
- Verify the `value` prop is rendered as text content
- Verify `aria-label` is set from the `label` prop

## Domain Knowledge

Thirteen digits, written 12345-1234567-1: a five-digit locality code (province, division, district and tehsil), a seven-digit family number, and a final digit that is odd for a male and even for a female. There is no check digit.

**Where to find it:** Printed on the Computerized National Identity Card (CNIC) issued by NADRA, and asked for by hospitals, banks, schools and government services.

## Related components

- `pakistan-computerized-national-identity-card-input` — an input for entering Pakistan's Computerized National Identity Card Number (CNIC)
- `summary-list-item` — one key-value pair in a summary list

## References

- Wikipedia: [Computerized National Identity Card](https://en.wikipedia.org/wiki/Computerized_National_Identity_Card)

---

Lily™ and Lily Design System™ are trademarks.
