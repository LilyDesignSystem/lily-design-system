# England National Health Service Number View

EnglandNationalHealthServiceNumberView is a headless read-only display of England's National Health Service Number (NHS), England's healthcare identifier. It renders as a `<span>` with `role="text"` so assistive technology announces the identifier as a single unit. It is the read-only companion to EnglandNationalHealthServiceNumberInput.

## Implementation Notes

- Renders as `<span>` with `role="text"`
- Format: 10 digits in 3-3-4 format with a Modulus-11 check digit, allocated through the Personal Demographics Service
- Provides accessible name via the `value` content
- Companion to EnglandNationalHealthServiceNumberInput

## Props

- `value`: string (required) — the identifier to display
- `label`: string (optional) — accessible label override via `aria-label`
- `...restProps`: any — additional HTML attributes spread onto the `<span>`

## Usage

```html
<SummaryList>
  <SummaryListItem term="National Health Service Number">
    <EnglandNationalHealthServiceNumberView value={value} />
  </SummaryListItem>
</SummaryList>
```

## ARIA

- `role="text"` ensures the identifier is announced as a single unit

## When to Use

- Use to display a stored England National Health Service Number (NHS) read-only.
- Use in summary lists, patient records, audit logs, or detail views.
- Use when the identifier should not be editable in the current context.

## When Not to Use

- Do not use for editing identifiers — use `england-national-health-service-number-input` instead.
- Do not use for general text display — use a `<span>` directly.
- Do not use for other countries' identifiers — use the corresponding country-specific view.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.england-national-health-service-number-view` class hook.

## Testing

- Verify renders a `<span>` with the correct class and `role="text"`
- Verify the `value` prop is rendered as text content
- Verify `aria-label` overrides the accessible name when supplied

## Domain Knowledge

The National Health Service Number (NHS) is England's healthcare identifier. Format: 10 digits in 3-3-4 format with a Modulus-11 check digit, allocated through the Personal Demographics Service.

## Related components

- `england-national-health-service-number-input` — an input for entering England's National Health Service Number (NHS)
- `summary-list-item` — one key-value pair in a summary list

## References

- Wikipedia: https://en.wikipedia.org/wiki/NHS_number

---

Lily™ and Lily Design System™ are trademarks.
