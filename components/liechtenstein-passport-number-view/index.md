# Liechtenstein Passport Number View

LiechtensteinPassportNumberView is a headless read-only display of Liechtenstein's Liechtenstein Passport Number, Liechtenstein's passport identifier. It renders as a `<span>` with `role="text"` so assistive technology announces the identifier as a single unit. It is the read-only companion to LiechtensteinPassportNumberInput.

## Implementation Notes

- Renders as `<span>` with `role="text"`
- Format: 1 letter followed by 5 digits (e.g. R00536)
- Provides accessible name via the `value` content
- Companion to LiechtensteinPassportNumberInput

## Props

- `value`: string (required) — the identifier to display
- `label`: string (optional) — accessible label override via `aria-label`
- `...restProps`: any — additional HTML attributes spread onto the `<span>`

## Usage

```html
<SummaryList>
  <SummaryListItem term="Liechtenstein Passport Number">
    <LiechtensteinPassportNumberView value={value} />
  </SummaryListItem>
</SummaryList>
```

## ARIA

- `role="text"` ensures the identifier is announced as a single unit

## When to Use

- Use to display a stored Liechtenstein Liechtenstein Passport Number read-only.
- Use in summary lists, patient records, audit logs, or detail views.
- Use when the identifier should not be editable in the current context.

## When Not to Use

- Do not use for editing identifiers — use `liechtenstein-passport-number-input` instead.
- Do not use for general text display — use a `<span>` directly.
- Do not use for other countries' identifiers — use the corresponding country-specific view.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.liechtenstein-passport-number-view` class hook.

## Testing

- Verify renders a `<span>` with the correct class and `role="text"`
- Verify the `value` prop is rendered as text content
- Verify `aria-label` overrides the accessible name when supplied

## Domain Knowledge

The Liechtenstein Passport Number is Liechtenstein's passport identifier. Format: 1 letter followed by 5 digits (e.g. R00536).

## Related components

- `liechtenstein-passport-number-input` — an input for entering Liechtenstein's Liechtenstein Passport Number
- `summary-list-item` — one key-value pair in a summary list

## References

- Wikipedia: https://en.wikipedia.org/wiki/Liechtenstein_passport

---

Lily™ and Lily Design System™ are trademarks.
