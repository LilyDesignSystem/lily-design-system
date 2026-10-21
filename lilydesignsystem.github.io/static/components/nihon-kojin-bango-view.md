# Nihon Kojin Bango View

NihonKojinBangoView is a headless read-only display of Japan's Individual Number / My Number (マイナンバー), Japan's government-issued personal identifier. It renders as a `<span>` with an accessible label. It is the read-only companion to NihonKojinBangoInput.

**Status:** beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow.

## Implementation Notes

- Renders as `<span>`
- Format: Twelve digits, issued to every resident of Japan since 2016. The twelfth digit is a check digit: the first eleven digits are each multiplied by a position-dependent weight (6,5,4,3,2 for positions 1-5; 7,6,5,4,3,2 for positions 6-11), summed, taken Modulus-11, and the remainder subtracted from 11 (remainders of 0 or 1 both yield a check digit of 0).
- Provides accessible name via the `label` prop
- Companion to NihonKojinBangoInput

## Props

- `value`: string (default: "") — the identifier to display
- `label`: string (required) — accessible label via `aria-label`
- `...restProps`: any — additional HTML attributes spread onto the `<span>`

## Usage

```html
<SummaryList>
  <SummaryListItem term="Individual Number / My Number (マイナンバー)">
    <NihonKojinBangoView label="Individual Number / My Number (マイナンバー)" value={value} />
  </SummaryListItem>
</SummaryList>
```

## ARIA

- `aria-label={label}` — provides the accessible name

## When to Use

- Use to display a stored Japan Individual Number / My Number (マイナンバー) read-only.
- Use in summary lists, patient records, audit logs, or detail views.
- Use when the identifier should not be editable in the current context.

## When Not to Use

- Do not use for editing identifiers — use `nihon-kojin-bango-input` instead.
- Do not use for general text display — use a `<span>` directly.
- Do not use for other countries' identifiers — use the corresponding country-specific view.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.nihon-kojin-bango-view` class hook.

## Testing

- Verify renders a `<span>` with the correct class
- Verify the `value` prop is rendered as text content
- Verify `aria-label` is set from the `label` prop

## Domain Knowledge

Twelve digits, issued to every resident of Japan since 2016. The twelfth digit is a check digit: the first eleven digits are each multiplied by a position-dependent weight (6,5,4,3,2 for positions 1-5; 7,6,5,4,3,2 for positions 6-11), summed, taken Modulus-11, and the remainder subtracted from 11 (remainders of 0 or 1 both yield a check digit of 0).

**Where to find it:** Printed on the Individual Number Card (マイナンバーカード) and the paper Notification Card, and required when enrolling in Japan's National Health Insurance (国民健康保険).

## Related components

- `nihon-kojin-bango-input` — an input for entering Japan's Individual Number / My Number (マイナンバー)
- `summary-list-item` — one key-value pair in a summary list

## References

- Wikipedia: [Individual Number](https://en.wikipedia.org/wiki/Individual_Number)

---

Lily™ and Lily Design System™ are trademarks.
