# Malta Passport Number View

MaltaPassportNumberView is a headless read-only display of Malta's Malta Passport Number, Malta's passport identifier. It renders as a `<span>` with `role="text"` so assistive technology announces the identifier as a single unit. It is the read-only companion to MaltaPassportNumberInput.

## Implementation Notes

- Renders as `<span>` with `role="text"`
- Format: 7 numerical digits issued by the Civil Registration Directorate
- Provides accessible name via the `value` content
- Companion to MaltaPassportNumberInput

## Props

- `value`: string (required) — the identifier to display
- `label`: string (optional) — accessible label override via `aria-label`
- `...restProps`: any — additional HTML attributes spread onto the `<span>`

## Usage

```html
<SummaryList>
  <SummaryListItem term="Malta Passport Number">
    <MaltaPassportNumberView value={value} />
  </SummaryListItem>
</SummaryList>
```

## ARIA

- `role="text"` ensures the identifier is announced as a single unit

## When to Use

- Use to display a stored Malta Malta Passport Number read-only.
- Use in summary lists, patient records, audit logs, or detail views.
- Use when the identifier should not be editable in the current context.

## When Not to Use

- Do not use for editing identifiers — use `malta-passport-number-input` instead.
- Do not use for general text display — use a `<span>` directly.
- Do not use for other countries' identifiers — use the corresponding country-specific view.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.malta-passport-number-view` class hook.

## Testing

- Verify renders a `<span>` with the correct class and `role="text"`
- Verify the `value` prop is rendered as text content
- Verify `aria-label` overrides the accessible name when supplied

## Domain Knowledge

The Malta Passport Number is Malta's passport identifier. Format: 7 numerical digits issued by the Civil Registration Directorate.

## Related components

- `malta-passport-number-input` — an input for entering Malta's Malta Passport Number
- `summary-list-item` — one key-value pair in a summary list

## References

- Wikipedia: https://en.wikipedia.org/wiki/Maltese_passport
