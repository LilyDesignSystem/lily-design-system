# Slovenija Emso View

SlovenijaEmsoView is a headless read-only display of Slovenia's Enotna Matična Številka Občana (EMŠO), Slovenia's national-id identifier. It renders as a `<span>`. It is the read-only companion to SlovenijaEmsoInput.

**Status:** beta — implemented and unit-tested in all seven frameworks with an axe-clean demo page; not yet exercised in composed flows.

## Implementation Notes

- Renders as `<span>`, with no role
- Format: 13 digits: the first 7 are the date of birth (DDMMYYY), digits 8-9 the register, 10-12 a sex-and-serial component (000-499 male, 500-999 female), 13 a check digit
- Provides accessible name via the `value` content
- Companion to SlovenijaEmsoInput

## Props

- `value`: string (required) — the identifier to display
- `label`: string (optional) — hidden text naming the value, in a `.screen-reader-span`. Leave it out when a visible caption names the value
- `...restProps`: any — additional HTML attributes spread onto the `<span>`

## Usage

```html
<SummaryList>
  <SummaryListItem term="Unique Master Citizen Number">
    <SlovenijaEmsoView value="{value}" />
  </SummaryListItem>
</SummaryList>
```

## ARIA

- No role, and no `aria-label`: a `<span>` cannot take a name, so `label` renders as hidden text in a `screen-reader-span`

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

- Verify renders a `<span>` with the correct class, no role and no `aria-label`
- Verify the `value` prop is rendered as text content
- Verify `label` renders as hidden text, and that the root has no `aria-label`

## Domain Knowledge

Thirteen digits in the form DDMMYYY-RR-GGGC: seven-digit date of birth (last three digits of the year), a two-digit registry/republic code (50/59 for Slovenia after 18 February 1999, with 10–19 Bosnia and Herzegovina, 20–29 Montenegro, 30–39 Croatia, 40–49 Macedonia, 70–79 Serbia, 80–89 Autonomous Province of Vojvodina, 90–99 Kosovo for pre-1999 issuance), three digits combining sex and serial number (000–499 male, 500–999 female), and a weighted Modulus-11 check digit defined in Article 4 of the Regulation on the way of assigning the personal identification number.

**Where to find it:** Slovenian Personal Identity Card (Osebna izkaznica), passport, birth certificate, and tax records.

## Security and privacy

A national identifier is personal data, and often a key to other records.

- The view shows exactly the text it is given; it does not mask. Pass the masked form (for example the last four characters) wherever the full number is not needed, and render the full number only to someone entitled to it.
- Do not log the value, put it in a URL or query string, or send it to analytics or an error tracker.
- Text on screen can be read over a shoulder and is kept by screenshots and screen recordings; treat a page that shows it as sensitive.

## Related components

- `slovenija-emso-input` — an input for entering Slovenia's Enotna Matična Številka Občana (EMŠO)
- `summary-list-item` — one key-value pair in a summary list

## References

- Wikipedia: https://en.wikipedia.org/wiki/Unique_Master_Citizen_Number

---

Lily™ and Lily Design System™ are trademarks.
