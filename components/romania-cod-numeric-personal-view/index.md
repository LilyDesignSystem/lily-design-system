# Romania Cod Numeric Personal View

RomaniaCodNumericPersonalView is a headless read-only display of Romania's Cod Numeric Personal (CNP), Romania's national-id identifier. It renders as a `<span>` with `role="text"` so assistive technology announces the identifier as a single unit. It is the read-only companion to RomaniaCodNumericPersonalInput.

**Status:** beta — implemented and unit-tested in all seven frameworks with an axe-clean demo page; not yet exercised in composed flows.

## Implementation Notes

- Renders as `<span>` with `role="text"`
- Format: 13 digits: gender and century (1/3/5/7 male; 2/4/6/8 female; 9 foreigner), date of birth (YYMMDD), country zone (01-52, or 99 for Bucharest sectors), serial (3 digits), and a Modulus-11 checksum digit
- Provides accessible name via the `value` content
- Companion to RomaniaCodNumericPersonalInput

## Props

- `value`: string (required) — the identifier to display
- `label`: string (optional) — accessible label override via `aria-label`
- `...restProps`: any — additional HTML attributes spread onto the `<span>`

## Usage

```html
<SummaryList>
  <SummaryListItem term="Personal Numerical Code">
    <RomaniaCodNumericPersonalView value={value} />
  </SummaryListItem>
</SummaryList>
```

## ARIA

- `role="text"` ensures the identifier is announced as a single unit

## When to Use

- Use to display a stored Romania Cod Numeric Personal (CNP) read-only.
- Use in summary lists, patient records, audit logs, or detail views.
- Use when the identifier should not be editable in the current context.

## When Not to Use

- Do not use for editing identifiers — use `romania-cod-numeric-personal-input` instead.
- Do not use for general text display — use a `<span>` directly.
- Do not use for other countries' identifiers — use the corresponding country-specific view.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.romania-cod-numeric-personal-view` class hook.

## Testing

- Verify renders a `<span>` with the correct class and `role="text"`
- Verify the `value` prop is rendered as text content
- Verify `aria-label` overrides the accessible name when supplied

## Domain Knowledge

Thirteen digits: a leading sex/century digit (1 male 1900–1999, 2 female 1900–1999, 3 male 1800–1899, 4 female 1800–1899, 5 male 2000+, 6 female 2000+, 7 male resident, 8 female resident, 9 foreign citizen); date of birth (YYMMDD); two-digit county code (01–52, or 99 for non-Romanians, or 4 followed by a Bucharest sector number); a three-digit serial number; and a check digit computed by weighted multiplication with the constant 279146358279 modulo 11 (remainder 10 maps to 1).

**Where to find it:** Romanian Birth Certificate, Identity Card (Carte de Identitate), and Driving Licence.

## Related components

- `romania-cod-numeric-personal-input` — an input for entering Romania's Cod Numeric Personal (CNP)
- `summary-list-item` — one key-value pair in a summary list

## References

- Wikipedia: https://en.wikipedia.org/wiki/National_identification_number#Romania

---

Lily™ and Lily Design System™ are trademarks.
