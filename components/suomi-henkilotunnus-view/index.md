# Suomi Henkilotunnus View

SuomiHenkilotunnusView is a headless read-only display of Finland's Henkilötunnus (HETU), Finland's national-id identifier. It renders as a `<span>` with `role="text"` so assistive technology announces the identifier as a single unit. It is the read-only companion to SuomiHenkilotunnusInput.

## Implementation Notes

- Renders as `<span>` with `role="text"`
- Format: 11 characters in the format DDMMYYCZZZQ: DDMMYY is the date of birth, C is the century sign (+, -, or A), ZZZ is an individual number (odd male, even female), Q is the checksum
- Provides accessible name via the `value` content
- Companion to SuomiHenkilotunnusInput

## Props

- `value`: string (required) — the identifier to display
- `label`: string (optional) — accessible label override via `aria-label`
- `...restProps`: any — additional HTML attributes spread onto the `<span>`

## Usage

```html
<SummaryList>
  <SummaryListItem term="Personal Identity Code">
    <SuomiHenkilotunnusView value={value} />
  </SummaryListItem>
</SummaryList>
```

## ARIA

- `role="text"` ensures the identifier is announced as a single unit

## When to Use

- Use to display a stored Finland Henkilötunnus (HETU) read-only.
- Use in summary lists, patient records, audit logs, or detail views.
- Use when the identifier should not be editable in the current context.

## When Not to Use

- Do not use for editing identifiers — use `suomi-henkilotunnus-input` instead.
- Do not use for general text display — use a `<span>` directly.
- Do not use for other countries' identifiers — use the corresponding country-specific view.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.suomi-henkilotunnus-view` class hook.

## Testing

- Verify renders a `<span>` with the correct class and `role="text"`
- Verify the `value` prop is rendered as text content
- Verify `aria-label` overrides the accessible name when supplied

## Domain Knowledge

The Henkilötunnus (HETU) is Finland's national-id identifier. Format: 11 characters in the format DDMMYYCZZZQ: DDMMYY is the date of birth, C is the century sign (+, -, or A), ZZZ is an individual number (odd male, even female), Q is the checksum.

## Related components

- `suomi-henkilotunnus-input` — an input for entering Finland's Henkilötunnus (HETU)
- `summary-list-item` — one key-value pair in a summary list

## References

- Wikipedia: https://en.wikipedia.org/wiki/Personal_identity_code_(Finland)
