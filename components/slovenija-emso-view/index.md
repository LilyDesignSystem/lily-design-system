# Slovenija Emso View

SlovenijaEmsoView is a headless read-only display of Slovenia's Enotna Matična Številka Občana (EMŠO), Slovenia's national-id identifier. It renders as a `<span>` with `role="text"` so assistive technology announces the identifier as a single unit. It is the read-only companion to SlovenijaEmsoInput.

**Status:** beta — implemented and unit-tested in all seven frameworks with an axe-clean demo page; not yet exercised in composed flows.

## Implementation Notes

- Renders as `<span>` with `role="text"`
- Format: 13 digits: the first 7 are the date of birth (DDMMYYY), digits 8-9 the register, 10-12 a sex-and-serial component (000-499 male, 500-999 female), 13 a check digit
- Provides accessible name via the `value` content
- Companion to SlovenijaEmsoInput

## Props

- `value`: string (required) — the identifier to display
- `label`: string (optional) — accessible label override via `aria-label`
- `...restProps`: any — additional HTML attributes spread onto the `<span>`

## Usage

```html
<SummaryList>
  <SummaryListItem term="Unique Master Citizen Number">
    <SlovenijaEmsoView value={value} />
  </SummaryListItem>
</SummaryList>
```

## ARIA

- `role="text"` ensures the identifier is announced as a single unit

## When to Use

- Use to display a stored Slovenia Enotna Matična Številka Občana (EMŠO) read-only.
- Use in summary lists, patient records, audit logs, or detail views.
- Use when the identifier should not be editable in the current context.

## When Not to Use

- Do not use for editing identifiers — use `slovenija-emso-input` instead.
- Do not use for general text display — use a `<span>` directly.
- Do not use for other countries' identifiers — use the corresponding country-specific view.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.slovenija-emso-view` class hook.

## Testing

- Verify renders a `<span>` with the correct class and `role="text"`
- Verify the `value` prop is rendered as text content
- Verify `aria-label` overrides the accessible name when supplied

## Domain Knowledge

Thirteen digits in the form DDMMYYY-RR-GGGC: seven-digit date of birth (last three digits of the year), a two-digit registry/republic code (50/59 for Slovenia after 18 February 1999, with 10–19 Bosnia and Herzegovina, 20–29 Montenegro, 30–39 Croatia, 40–49 Macedonia, 70–79 Serbia, 80–89 Autonomous Province of Vojvodina, 90–99 Kosovo for pre-1999 issuance), three digits combining sex and serial number (000–499 male, 500–999 female), and a weighted Modulus-11 check digit defined in Article 4 of the Regulation on the way of assigning the personal identification number.

**Where to find it:** Slovenian Personal Identity Card (Osebna izkaznica), passport, birth certificate, and tax records.

## Related components

- `slovenija-emso-input` — an input for entering Slovenia's Enotna Matična Številka Občana (EMŠO)
- `summary-list-item` — one key-value pair in a summary list

## References

- Wikipedia: https://en.wikipedia.org/wiki/Unique_Master_Citizen_Number

---

Lily™ and Lily Design System™ are trademarks.
