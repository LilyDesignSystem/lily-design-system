# Belgique Numero De Registre National View

BelgiqueNumeroDeRegistreNationalView is a headless read-only display of Belgium's Numéro de Registre National / Rijksregisternummer (NRN), Belgium's national-id identifier. It renders as a `<span>`. It is the read-only companion to BelgiqueNumeroDeRegistreNationalInput.

**Status:** beta — implemented and unit-tested in all seven frameworks with an axe-clean demo page; not yet exercised in composed flows.

## Implementation Notes

- Renders as `<span>`, with no role
- Format: 11 digits where the first 6 are the date of birth (YYMMDD), the next 3 are an ordering number (uneven for men, even for women) and the last 2 a check digit
- Provides accessible name via the `value` content
- Companion to BelgiqueNumeroDeRegistreNationalInput

## Props

- `value`: string (required) — the identifier to display
- `label`: string (optional) — hidden text naming the value, in a `.screen-reader-span`. Leave it out when a visible caption names the value
- `...restProps`: any — additional HTML attributes spread onto the `<span>`

## Usage

```html
<SummaryList>
  <SummaryListItem term="National Register Number">
    <BelgiqueNumeroDeRegistreNationalView value="{value}" />
  </SummaryListItem>
</SummaryList>
```

## ARIA

- No role, and no `aria-label`: a `<span>` cannot take a name, so `label` renders as hidden text in a `screen-reader-span`

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

- Verify renders a `<span>` with the correct class, no role and no `aria-label`
- Verify the `value` prop is rendered as text content
- Verify `label` renders as hidden text, and that the root has no `aria-label`

## Domain Knowledge

Eleven digits where the first six are the date of birth (YYMMDD), the next three are a serial ordering number (odd for men, even for women), and the last two are a Modulus-97 check digit.

**Where to find it:** Belgian electronic identity card (eID), SIS social-security card, passport, residence permit, and tax/health correspondence.

## Related components

- `belgique-numero-de-registre-national-input` — an input for entering Belgium's Numéro de Registre National / Rijksregisternummer (NRN)
- `summary-list-item` — one key-value pair in a summary list

## References

- Wikipedia: https://en.wikipedia.org/wiki/National_identification_number#Belgium

---

Lily™ and Lily Design System™ are trademarks.
