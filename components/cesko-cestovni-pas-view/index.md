# Cesko Cestovni Pas View

CeskoCestovniPasView is a headless read-only display of Czech Republic's Cestovní pas, Czech Republic's passport identifier. It renders as a `<span>` with `role="text"` so assistive technology announces the identifier as a single unit. It is the read-only companion to CeskoCestovniPasInput.

## Implementation Notes

- Renders as `<span>` with `role="text"`
- Format: usually 8 digits, sometimes longer, issued by the Ministry of the Interior
- Provides accessible name via the `value` content
- Companion to CeskoCestovniPasInput

## Props

- `value`: string (required) — the identifier to display
- `label`: string (optional) — accessible label override via `aria-label`
- `...restProps`: any — additional HTML attributes spread onto the `<span>`

## Usage

```html
<SummaryList>
  <SummaryListItem term="Czech Passport">
    <CeskoCestovniPasView value={value} />
  </SummaryListItem>
</SummaryList>
```

## ARIA

- `role="text"` ensures the identifier is announced as a single unit

## When to Use

- Use to display a stored Czech Republic Cestovní pas read-only.
- Use in summary lists, patient records, audit logs, or detail views.
- Use when the identifier should not be editable in the current context.

## When Not to Use

- Do not use for editing identifiers — use `cesko-cestovni-pas-input` instead.
- Do not use for general text display — use a `<span>` directly.
- Do not use for other countries' identifiers — use the corresponding country-specific view.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.cesko-cestovni-pas-view` class hook.

## Testing

- Verify renders a `<span>` with the correct class and `role="text"`
- Verify the `value` prop is rendered as text content
- Verify `aria-label` overrides the accessible name when supplied

## Domain Knowledge

The Cestovní pas is Czech Republic's passport identifier. Format: usually 8 digits, sometimes longer, issued by the Ministry of the Interior.

## Related components

- `cesko-cestovni-pas-input` — an input for entering Czech Republic's Cestovní pas
- `summary-list-item` — one key-value pair in a summary list

## References

- Wikipedia: https://en.wikipedia.org/wiki/Czech_passport
