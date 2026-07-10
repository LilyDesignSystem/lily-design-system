# Latvija Personas Kods View

LatvijaPersonasKodsView is a headless read-only display of Latvia's Personas kods, Latvia's national-id identifier. It renders as a `<span>` with `role="text"` so assistive technology announces the identifier as a single unit. It is the read-only companion to LatvijaPersonasKodsInput.

## Implementation Notes

- Renders as `<span>` with `role="text"`
- Format: 11 digits in the form DDMMYY-CZZZZ where the first 6 are the date of birth (DDMMYY) and C encodes the century (0 = 19th, 1 = 20th, 2 = 21st)
- Provides accessible name via the `value` content
- Companion to LatvijaPersonasKodsInput

## Props

- `value`: string (required) — the identifier to display
- `label`: string (optional) — accessible label override via `aria-label`
- `...restProps`: any — additional HTML attributes spread onto the `<span>`

## Usage

```html
<SummaryList>
  <SummaryListItem term="Personal Code">
    <LatvijaPersonasKodsView value={value} />
  </SummaryListItem>
</SummaryList>
```

## ARIA

- `role="text"` ensures the identifier is announced as a single unit

## When to Use

- Use to display a stored Latvia Personas kods read-only.
- Use in summary lists, patient records, audit logs, or detail views.
- Use when the identifier should not be editable in the current context.

## When Not to Use

- Do not use for editing identifiers — use `latvija-personas-kods-input` instead.
- Do not use for general text display — use a `<span>` directly.
- Do not use for other countries' identifiers — use the corresponding country-specific view.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.latvija-personas-kods-view` class hook.

## Testing

- Verify renders a `<span>` with the correct class and `role="text"`
- Verify the `value` prop is rendered as text content
- Verify `aria-label` overrides the accessible name when supplied

## Domain Knowledge

The Personas kods is Latvia's national-id identifier. Format: 11 digits in the form DDMMYY-CZZZZ where the first 6 are the date of birth (DDMMYY) and C encodes the century (0 = 19th, 1 = 20th, 2 = 21st).

## Related components

- `latvija-personas-kods-input` — an input for entering Latvia's Personas kods
- `summary-list-item` — one key-value pair in a summary list

## References

- Wikipedia: https://en.wikipedia.org/wiki/National_identification_number#Latvia

---

Lily™ and Lily Design System™ are trademarks.
