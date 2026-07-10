# Nederland Paspoort Nummer View

NederlandPaspoortNummerView is a headless read-only display of Netherlands's Paspoort Nummer, Netherlands's passport identifier. It renders as a `<span>` with `role="text"` so assistive technology announces the identifier as a single unit. It is the read-only companion to NederlandPaspoortNummerInput.

## Implementation Notes

- Renders as `<span>` with `role="text"`
- Format: 9 characters: positions 1-2 [A-Z] except 'O', positions 3-8 [A-Z 0-9] except 'O', position 9 [0-9]
- Provides accessible name via the `value` content
- Companion to NederlandPaspoortNummerInput

## Props

- `value`: string (required) — the identifier to display
- `label`: string (optional) — accessible label override via `aria-label`
- `...restProps`: any — additional HTML attributes spread onto the `<span>`

## Usage

```html
<SummaryList>
  <SummaryListItem term="Dutch Passport Number">
    <NederlandPaspoortNummerView value={value} />
  </SummaryListItem>
</SummaryList>
```

## ARIA

- `role="text"` ensures the identifier is announced as a single unit

## When to Use

- Use to display a stored Netherlands Paspoort Nummer read-only.
- Use in summary lists, patient records, audit logs, or detail views.
- Use when the identifier should not be editable in the current context.

## When Not to Use

- Do not use for editing identifiers — use `nederland-paspoort-nummer-input` instead.
- Do not use for general text display — use a `<span>` directly.
- Do not use for other countries' identifiers — use the corresponding country-specific view.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.nederland-paspoort-nummer-view` class hook.

## Testing

- Verify renders a `<span>` with the correct class and `role="text"`
- Verify the `value` prop is rendered as text content
- Verify `aria-label` overrides the accessible name when supplied

## Domain Knowledge

The Paspoort Nummer is Netherlands's passport identifier. Format: 9 characters: positions 1-2 [A-Z] except 'O', positions 3-8 [A-Z 0-9] except 'O', position 9 [0-9].

## Related components

- `nederland-paspoort-nummer-input` — an input for entering Netherlands's Paspoort Nummer
- `summary-list-item` — one key-value pair in a summary list

## References

- Wikipedia: https://en.wikipedia.org/wiki/Dutch_passport

---

Lily™ and Lily Design System™ are trademarks.
