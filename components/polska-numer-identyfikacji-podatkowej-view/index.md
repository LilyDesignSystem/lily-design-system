# Polska Numer Identyfikacji Podatkowej View

PolskaNumerIdentyfikacjiPodatkowejView is a headless read-only display of Poland's Numer Identyfikacji Podatkowej (NIP), Poland's tax identifier. It renders as a `<span>` with `role="text"` so assistive technology announces the identifier as a single unit. It is the read-only companion to PolskaNumerIdentyfikacjiPodatkowejInput.

## Implementation Notes

- Renders as `<span>` with `role="text"`
- Format: 10 numeric digits used for tax identification
- Provides accessible name via the `value` content
- Companion to PolskaNumerIdentyfikacjiPodatkowejInput

## Props

- `value`: string (required) — the identifier to display
- `label`: string (optional) — accessible label override via `aria-label`
- `...restProps`: any — additional HTML attributes spread onto the `<span>`

## Usage

```html
<SummaryList>
  <SummaryListItem term="Tax Identification Number">
    <PolskaNumerIdentyfikacjiPodatkowejView value={value} />
  </SummaryListItem>
</SummaryList>
```

## ARIA

- `role="text"` ensures the identifier is announced as a single unit

## When to Use

- Use to display a stored Poland Numer Identyfikacji Podatkowej (NIP) read-only.
- Use in summary lists, patient records, audit logs, or detail views.
- Use when the identifier should not be editable in the current context.

## When Not to Use

- Do not use for editing identifiers — use `polska-numer-identyfikacji-podatkowej-input` instead.
- Do not use for general text display — use a `<span>` directly.
- Do not use for other countries' identifiers — use the corresponding country-specific view.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.polska-numer-identyfikacji-podatkowej-view` class hook.

## Testing

- Verify renders a `<span>` with the correct class and `role="text"`
- Verify the `value` prop is rendered as text content
- Verify `aria-label` overrides the accessible name when supplied

## Domain Knowledge

The Numer Identyfikacji Podatkowej (NIP) is Poland's tax identifier. Format: 10 numeric digits used for tax identification.

## Related components

- `polska-numer-identyfikacji-podatkowej-input` — an input for entering Poland's Numer Identyfikacji Podatkowej (NIP)
- `summary-list-item` — one key-value pair in a summary list

## References

- Wikipedia: https://en.wikipedia.org/wiki/National_identification_number#Poland
