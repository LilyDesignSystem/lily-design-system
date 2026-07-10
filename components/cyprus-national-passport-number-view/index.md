# Cyprus National Passport Number View

CyprusNationalPassportNumberView is a headless read-only display of Cyprus's National Passport Number, Cyprus's passport identifier. It renders as a `<span>` with `role="text"` so assistive technology announces the identifier as a single unit. It is the read-only companion to CyprusNationalPassportNumberInput.

## Implementation Notes

- Renders as `<span>` with `role="text"`
- Format: passports before 13/12/2010 begin with 'E' followed by 6 digits (e.g. E123456); biometric passports issued after 13/12/2010 begin with 'K' followed by 8 digits (e.g. K12345678)
- Provides accessible name via the `value` content
- Companion to CyprusNationalPassportNumberInput

## Props

- `value`: string (required) — the identifier to display
- `label`: string (optional) — accessible label override via `aria-label`
- `...restProps`: any — additional HTML attributes spread onto the `<span>`

## Usage

```html
<SummaryList>
  <SummaryListItem term="National Passport Number">
    <CyprusNationalPassportNumberView value={value} />
  </SummaryListItem>
</SummaryList>
```

## ARIA

- `role="text"` ensures the identifier is announced as a single unit

## When to Use

- Use to display a stored Cyprus National Passport Number read-only.
- Use in summary lists, patient records, audit logs, or detail views.
- Use when the identifier should not be editable in the current context.

## When Not to Use

- Do not use for editing identifiers — use `cyprus-national-passport-number-input` instead.
- Do not use for general text display — use a `<span>` directly.
- Do not use for other countries' identifiers — use the corresponding country-specific view.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.cyprus-national-passport-number-view` class hook.

## Testing

- Verify renders a `<span>` with the correct class and `role="text"`
- Verify the `value` prop is rendered as text content
- Verify `aria-label` overrides the accessible name when supplied

## Domain Knowledge

The National Passport Number is Cyprus's passport identifier. Format: passports before 13/12/2010 begin with 'E' followed by 6 digits (e.g. E123456); biometric passports issued after 13/12/2010 begin with 'K' followed by 8 digits (e.g. K12345678).

## Related components

- `cyprus-national-passport-number-input` — an input for entering Cyprus's National Passport Number
- `summary-list-item` — one key-value pair in a summary list

## References

- Wikipedia: https://en.wikipedia.org/wiki/Cypriot_passport

---

Lily™ and Lily Design System™ are trademarks.
