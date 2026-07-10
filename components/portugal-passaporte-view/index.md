# Portugal Passaporte View

PortugalPassaporteView is a headless read-only display of Portugal's Passaporte, Portugal's passport identifier. It renders as a `<span>` with `role="text"` so assistive technology announces the identifier as a single unit. It is the read-only companion to PortugalPassaporteInput.

## Implementation Notes

- Renders as `<span>` with `role="text"`
- Format: 1 letter [A-Z] and 6 digits [0-9]
- Provides accessible name via the `value` content
- Companion to PortugalPassaporteInput

## Props

- `value`: string (required) — the identifier to display
- `label`: string (optional) — accessible label override via `aria-label`
- `...restProps`: any — additional HTML attributes spread onto the `<span>`

## Usage

```html
<SummaryList>
  <SummaryListItem term="Portuguese Passport">
    <PortugalPassaporteView value={value} />
  </SummaryListItem>
</SummaryList>
```

## ARIA

- `role="text"` ensures the identifier is announced as a single unit

## When to Use

- Use to display a stored Portugal Passaporte read-only.
- Use in summary lists, patient records, audit logs, or detail views.
- Use when the identifier should not be editable in the current context.

## When Not to Use

- Do not use for editing identifiers — use `portugal-passaporte-input` instead.
- Do not use for general text display — use a `<span>` directly.
- Do not use for other countries' identifiers — use the corresponding country-specific view.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.portugal-passaporte-view` class hook.

## Testing

- Verify renders a `<span>` with the correct class and `role="text"`
- Verify the `value` prop is rendered as text content
- Verify `aria-label` overrides the accessible name when supplied

## Domain Knowledge

The Passaporte is Portugal's passport identifier. Format: 1 letter [A-Z] and 6 digits [0-9].

## Related components

- `portugal-passaporte-input` — an input for entering Portugal's Passaporte
- `summary-list-item` — one key-value pair in a summary list

## References

- Wikipedia: https://en.wikipedia.org/wiki/Portuguese_passport

---

Lily™ and Lily Design System™ are trademarks.
