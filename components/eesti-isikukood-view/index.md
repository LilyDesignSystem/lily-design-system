# Eesti Isikukood View

EestiIsikukoodView is a headless read-only display of Estonia's Isikukood (IK), Estonia's national-id identifier. It renders as a `<span>` with `role="text"` so assistive technology announces the identifier as a single unit. It is the read-only companion to EestiIsikukoodInput.

## Implementation Notes

- Renders as `<span>` with `role="text"`
- Format: 11 digits in the form GYYMMDDSSSC: G is sex and century (odd male, even female; 1-2 19th c., 3-4 20th c., 5-6 21st c.), SSS distinguishes persons born the same day, C is a checksum
- Provides accessible name via the `value` content
- Companion to EestiIsikukoodInput

## Props

- `value`: string (required) — the identifier to display
- `label`: string (optional) — accessible label override via `aria-label`
- `...restProps`: any — additional HTML attributes spread onto the `<span>`

## Usage

```html
<SummaryList>
  <SummaryListItem term="Personal Identification Code">
    <EestiIsikukoodView value={value} />
  </SummaryListItem>
</SummaryList>
```

## ARIA

- `role="text"` ensures the identifier is announced as a single unit

## When to Use

- Use to display a stored Estonia Isikukood (IK) read-only.
- Use in summary lists, patient records, audit logs, or detail views.
- Use when the identifier should not be editable in the current context.

## When Not to Use

- Do not use for editing identifiers — use `eesti-isikukood-input` instead.
- Do not use for general text display — use a `<span>` directly.
- Do not use for other countries' identifiers — use the corresponding country-specific view.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.eesti-isikukood-view` class hook.

## Testing

- Verify renders a `<span>` with the correct class and `role="text"`
- Verify the `value` prop is rendered as text content
- Verify `aria-label` overrides the accessible name when supplied

## Domain Knowledge

The Isikukood (IK) is Estonia's national-id identifier. Format: 11 digits in the form GYYMMDDSSSC: G is sex and century (odd male, even female; 1-2 19th c., 3-4 20th c., 5-6 21st c.), SSS distinguishes persons born the same day, C is a checksum.

## Related components

- `eesti-isikukood-input` — an input for entering Estonia's Isikukood (IK)
- `summary-list-item` — one key-value pair in a summary list

## References

- Wikipedia: https://en.wikipedia.org/wiki/National_identification_number#Estonia

---

Lily™ and Lily Design System™ are trademarks.
