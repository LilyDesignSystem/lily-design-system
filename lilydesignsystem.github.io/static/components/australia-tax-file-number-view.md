# Australia Tax File Number View

AustraliaTaxFileNumberView is a headless read-only display of Australia's Tax File Number (TFN), Australia's government-issued personal identifier. It renders as a `<span>` with an accessible label. It is the read-only companion to AustraliaTaxFileNumberInput.

**Status:** beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow.

## Implementation Notes

- Renders as `<span>`
- Format: Nine digits, written 123 456 782 (older numbers have eight). The digits are multiplied by the weights 1,4,3,7,5,8,6,9,10 and summed, and the sum must be a multiple of 11.
- Provides accessible name via the `label` prop
- Companion to AustraliaTaxFileNumberInput

## Props

- `value`: string (default: "") — the identifier to display
- `label`: string (required) — accessible label via `aria-label`
- `...restProps`: any — additional HTML attributes spread onto the `<span>`

## Usage

```html
<SummaryList>
  <SummaryListItem term="Tax File Number (TFN)">
    <AustraliaTaxFileNumberView
      label="Tax File Number (TFN)"
      value="{value}"
    />
  </SummaryListItem>
</SummaryList>
```

## ARIA

- `aria-label={label}` — provides the accessible name

## When to Use

- Use to display a stored Australia Tax File Number (TFN) read-only.
- Use in summary lists, patient records, audit logs, or detail views.
- Use when the identifier should not be editable in the current context.

## When Not to Use

- Do not use for editing identifiers — use `australia-tax-file-number-input` instead.
- Do not use for general text display — use a `<span>` directly.
- Do not use for other countries' identifiers — use the corresponding country-specific view.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.australia-tax-file-number-view` class hook.

## Testing

- Verify renders a `<span>` with the correct class
- Verify the `value` prop is rendered as text content
- Verify `aria-label` is set from the `label` prop

## Domain Knowledge

Nine digits, written 123 456 782 (older numbers have eight). The digits are multiplied by the weights 1,4,3,7,5,8,6,9,10 and summed, and the sum must be a multiple of 11.

**Where to find it:** Shown on the Australian Taxation Office notice of assessment, payment summaries and superannuation statements; not printed on a card.

## Related components

- `australia-tax-file-number-input` — an input for entering Australia's Tax File Number (TFN)
- `summary-list-item` — one key-value pair in a summary list

## References

- Wikipedia: [Tax file number](https://en.wikipedia.org/wiki/Tax_file_number)

---

Lily™ and Lily Design System™ are trademarks.
