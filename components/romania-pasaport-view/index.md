# Romania Pasaport View

RomaniaPasaportView is a headless read-only display of Romania's Paşaport, Romania's passport identifier. It renders as a `<span>` with `role="text"` so assistive technology announces the identifier as a single unit. It is the read-only companion to RomaniaPasaportInput.

## Implementation Notes

- Renders as `<span>` with `role="text"`
- Format: 8 characters: positions 1-2 [A-Z] and positions 3-8 [0-9]
- Provides accessible name via the `value` content
- Companion to RomaniaPasaportInput

## Props

- `value`: string (required) — the identifier to display
- `label`: string (optional) — accessible label override via `aria-label`
- `...restProps`: any — additional HTML attributes spread onto the `<span>`

## Usage

```html
<SummaryList>
  <SummaryListItem term="Romanian Passport">
    <RomaniaPasaportView value={value} />
  </SummaryListItem>
</SummaryList>
```

## ARIA

- `role="text"` ensures the identifier is announced as a single unit

## When to Use

- Use to display a stored Romania Paşaport read-only.
- Use in summary lists, patient records, audit logs, or detail views.
- Use when the identifier should not be editable in the current context.

## When Not to Use

- Do not use for editing identifiers — use `romania-pasaport-input` instead.
- Do not use for general text display — use a `<span>` directly.
- Do not use for other countries' identifiers — use the corresponding country-specific view.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.romania-pasaport-view` class hook.

## Testing

- Verify renders a `<span>` with the correct class and `role="text"`
- Verify the `value` prop is rendered as text content
- Verify `aria-label` overrides the accessible name when supplied

## Domain Knowledge

The Paşaport is Romania's passport identifier. Format: 8 characters: positions 1-2 [A-Z] and positions 3-8 [0-9].

## Related components

- `romania-pasaport-input` — an input for entering Romania's Paşaport
- `summary-list-item` — one key-value pair in a summary list

## References

- Wikipedia: https://en.wikipedia.org/wiki/Romanian_passport
