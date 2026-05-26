# Hrvatska Osobni Identifikacijski Broj View

HrvatskaOsobniIdentifikacijskiBrojView is a headless read-only display of Croatia's Osobni identifikacijski broj (OIB), Croatia's national-id identifier. It renders as a `<span>` with `role="text"` so assistive technology announces the identifier as a single unit. It is the read-only companion to HrvatskaOsobniIdentifikacijskiBrojInput.

## Implementation Notes

- Renders as `<span>` with `role="text"`
- Format: 11 digits — 10 random digits plus a check digit; permanent, unique, and assigned to every Croatian citizen and legal person
- Provides accessible name via the `value` content
- Companion to HrvatskaOsobniIdentifikacijskiBrojInput

## Props

- `value`: string (required) — the identifier to display
- `label`: string (optional) — accessible label override via `aria-label`
- `...restProps`: any — additional HTML attributes spread onto the `<span>`

## Usage

```html
<SummaryList>
  <SummaryListItem term="Personal Identification Number">
    <HrvatskaOsobniIdentifikacijskiBrojView value={value} />
  </SummaryListItem>
</SummaryList>
```

## ARIA

- `role="text"` ensures the identifier is announced as a single unit

## When to Use

- Use to display a stored Croatia Osobni identifikacijski broj (OIB) read-only.
- Use in summary lists, patient records, audit logs, or detail views.
- Use when the identifier should not be editable in the current context.

## When Not to Use

- Do not use for editing identifiers — use `hrvatska-osobni-identifikacijski-broj-input` instead.
- Do not use for general text display — use a `<span>` directly.
- Do not use for other countries' identifiers — use the corresponding country-specific view.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.hrvatska-osobni-identifikacijski-broj-view` class hook.

## Testing

- Verify renders a `<span>` with the correct class and `role="text"`
- Verify the `value` prop is rendered as text content
- Verify `aria-label` overrides the accessible name when supplied

## Domain Knowledge

The Osobni identifikacijski broj (OIB) is Croatia's national-id identifier. Format: 11 digits — 10 random digits plus a check digit; permanent, unique, and assigned to every Croatian citizen and legal person.

## Related components

- `hrvatska-osobni-identifikacijski-broj-input` — an input for entering Croatia's Osobni identifikacijski broj (OIB)
- `summary-list-item` — one key-value pair in a summary list

## References

- Wikipedia: https://en.wikipedia.org/wiki/Personal_identification_number_(Croatia)
