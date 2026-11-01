# Hong Kong Identity Card View

HongKongIdentityCardView is a headless read-only display of Hong Kong's Identity Card Number, Hong Kong's government-issued personal identifier. It renders as a `<span>` with an accessible label. It is the read-only companion to HongKongIdentityCardInput.

**Status:** beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow.

## Implementation Notes

- Renders as `<span>`
- Format: One or two letters, six digits and a check digit in parentheses, such as A123456(3). The check digit is 0 to 9 or A. Each letter counts as A=10 to Z=35, and a single letter is preceded by a space counted as 36; the eight values are multiplied by 9,8,7,6,5,4,3,2 and summed, and the check digit is 11 minus the sum's Modulus-11 remainder (0 when the remainder is 0, and A when the result is 10).
- Provides accessible name via the `label` prop
- Companion to HongKongIdentityCardInput

## Props

- `value`: string (default: "") — the identifier to display
- `label`: string (required) — accessible label via `aria-label`
- `...restProps`: any — additional HTML attributes spread onto the `<span>`

## Usage

```html
<SummaryList>
  <SummaryListItem term="Hong Kong Identity Card Number">
    <HongKongIdentityCardView
      label="Hong Kong Identity Card Number"
      value="{value}"
    />
  </SummaryListItem>
</SummaryList>
```

## ARIA

- `aria-label={label}` — provides the accessible name

## When to Use

- Use to display a stored Hong Kong Identity Card Number read-only.
- Use in summary lists, patient records, audit logs, or detail views.
- Use when the identifier should not be editable in the current context.

## When Not to Use

- Do not use for editing identifiers — use `hong-kong-identity-card-input` instead.
- Do not use for general text display — use a `<span>` directly.
- Do not use for other countries' identifiers — use the corresponding country-specific view.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.hong-kong-identity-card-view` class hook.

## Testing

- Verify renders a `<span>` with the correct class
- Verify the `value` prop is rendered as text content
- Verify `aria-label` is set from the `label` prop

## Domain Knowledge

One or two letters, six digits and a check digit in parentheses, such as A123456(3). The check digit is 0 to 9 or A. Each letter counts as A=10 to Z=35, and a single letter is preceded by a space counted as 36; the eight values are multiplied by 9,8,7,6,5,4,3,2 and summed, and the check digit is 11 minus the sum's Modulus-11 remainder (0 when the remainder is 0, and A when the result is 10).

**Where to find it:** Printed on the Hong Kong Identity Card, and asked for by hospitals, clinics, banks, employers and government services.

## Related components

- `hong-kong-identity-card-input` — an input for entering Hong Kong's Identity Card Number
- `summary-list-item` — one key-value pair in a summary list

## References

- Wikipedia: [Hong Kong identity card](https://en.wikipedia.org/wiki/Hong_Kong_identity_card)

---

Lily™ and Lily Design System™ are trademarks.
