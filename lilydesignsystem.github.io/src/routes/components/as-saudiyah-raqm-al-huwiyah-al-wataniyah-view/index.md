# As Saudiyah Raqm Al Huwiyah Al Wataniyah View

AsSaudiyahRaqmAlHuwiyahAlWataniyahView is a headless read-only display of Saudi Arabia's National Identification Number, Saudi Arabia's government-issued personal identifier. It renders as a `<span>` with an accessible label. It is the read-only companion to AsSaudiyahRaqmAlHuwiyahAlWataniyahInput.

**Status:** beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow.

## Implementation Notes

- Renders as `<span>`
- Format: Ten digits. The first digit is 1 for a Saudi citizen and 2 for a resident (the iqama number), and the last digit is a check digit under the Luhn algorithm: counting from the right, every second digit is doubled (subtracting 9 when the result exceeds 9), and the total must be a multiple of 10.
- Provides accessible name via the `label` prop
- Companion to AsSaudiyahRaqmAlHuwiyahAlWataniyahInput

## Props

- `value`: string (default: "") — the identifier to display
- `label`: string (required) — accessible label via `aria-label`
- `...restProps`: any — additional HTML attributes spread onto the `<span>`

## Usage

```html
<SummaryList>
  <SummaryListItem term="National Identification Number">
    <AsSaudiyahRaqmAlHuwiyahAlWataniyahView
      label="National Identification Number"
      value="{value}"
    />
  </SummaryListItem>
</SummaryList>
```

## ARIA

- `aria-label={label}` — provides the accessible name

## When to Use

- Use to display a stored Saudi Arabia National Identification Number read-only.
- Use in summary lists, patient records, audit logs, or detail views.
- Use when the identifier should not be editable in the current context.

## When Not to Use

- Do not use for editing identifiers — use `as-saudiyah-raqm-al-huwiyah-al-wataniyah-input` instead.
- Do not use for general text display — use a `<span>` directly.
- Do not use for other countries' identifiers — use the corresponding country-specific view.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.as-saudiyah-raqm-al-huwiyah-al-wataniyah-view` class hook.

## Testing

- Verify renders a `<span>` with the correct class
- Verify the `value` prop is rendered as text content
- Verify `aria-label` is set from the `label` prop

## Domain Knowledge

Ten digits. The first digit is 1 for a Saudi citizen and 2 for a resident (the iqama number), and the last digit is a check digit under the Luhn algorithm: counting from the right, every second digit is doubled (subtracting 9 when the result exceeds 9), and the total must be a multiple of 10.

**Where to find it:** Printed on the National ID Card for citizens and on the iqama residence permit for residents, and used for Absher, Tawakkalna and health-service sign-in.

## Related components

- `as-saudiyah-raqm-al-huwiyah-al-wataniyah-input` — an input for entering Saudi Arabia's National Identification Number
- `summary-list-item` — one key-value pair in a summary list

## References

- Wikipedia: [National identity card](https://en.wikipedia.org/wiki/National_identity_card)

---

Lily™ and Lily Design System™ are trademarks.
