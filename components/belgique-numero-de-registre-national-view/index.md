# Belgique Numero De Registre National View

BelgiqueNumeroDeRegistreNationalView is a headless read-only display of Belgium's Numéro de Registre National / Rijksregisternummer (NRN), Belgium's national-id identifier. It renders as a `<span>` with `role="text"` so assistive technology announces the identifier as a single unit. It is the read-only companion to BelgiqueNumeroDeRegistreNationalInput.

## Implementation Notes

- Renders as `<span>` with `role="text"`
- Format: 11 digits where the first 6 are the date of birth (YYMMDD), the next 3 are an ordering number (uneven for men, even for women) and the last 2 a check digit
- Provides accessible name via the `value` content
- Companion to BelgiqueNumeroDeRegistreNationalInput

## Props

- `value`: string (required) — the identifier to display
- `label`: string (optional) — accessible label override via `aria-label`
- `...restProps`: any — additional HTML attributes spread onto the `<span>`

## Usage

```html
<SummaryList>
  <SummaryListItem term="National Register Number">
    <BelgiqueNumeroDeRegistreNationalView value={value} />
  </SummaryListItem>
</SummaryList>
```

## ARIA

- `role="text"` ensures the identifier is announced as a single unit

## When to Use

- Use to display a stored Belgium Numéro de Registre National / Rijksregisternummer (NRN) read-only.
- Use in summary lists, patient records, audit logs, or detail views.
- Use when the identifier should not be editable in the current context.

## When Not to Use

- Do not use for editing identifiers — use `belgique-numero-de-registre-national-input` instead.
- Do not use for general text display — use a `<span>` directly.
- Do not use for other countries' identifiers — use the corresponding country-specific view.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.belgique-numero-de-registre-national-view` class hook.

## Testing

- Verify renders a `<span>` with the correct class and `role="text"`
- Verify the `value` prop is rendered as text content
- Verify `aria-label` overrides the accessible name when supplied

## Domain Knowledge

The Numéro de Registre National / Rijksregisternummer (NRN) is Belgium's national-id identifier. Format: 11 digits where the first 6 are the date of birth (YYMMDD), the next 3 are an ordering number (uneven for men, even for women) and the last 2 a check digit.

## Related components

- `belgique-numero-de-registre-national-input` — an input for entering Belgium's Numéro de Registre National / Rijksregisternummer (NRN)
- `summary-list-item` — one key-value pair in a summary list

## References

- Wikipedia: https://en.wikipedia.org/wiki/National_identification_number#Belgium

---

Lily™ and Lily Design System™ are trademarks.
