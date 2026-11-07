# Espana Codigo De Identificacion Fiscal View

EspanaCodigoDeIdentificacionFiscalView is a headless read-only display of Spain's Código de Identificación Fiscal (CIF), Spain's tax identifier. It renders as a `<span>`. It is the read-only companion to EspanaCodigoDeIdentificacionFiscalInput.

**Status:** beta — implemented and unit-tested in all seven frameworks with an axe-clean demo page; not yet exercised in composed flows.

## Implementation Notes

- Renders as `<span>`, with no role
- Format: 9 characters: 8 numbers and a control letter (the letters I, Ñ, O, and U are not used)
- Provides accessible name via the `value` content
- Companion to EspanaCodigoDeIdentificacionFiscalInput

## Props

- `value`: string (required) — the identifier to display
- `label`: string (optional) — hidden text naming the value, in a `.screen-reader-span`. Leave it out when a visible caption names the value
- `...restProps`: any — additional HTML attributes spread onto the `<span>`

## Usage

```html
<SummaryList>
  <SummaryListItem term="Tax Identification Code">
    <EspanaCodigoDeIdentificacionFiscalView value="{value}" />
  </SummaryListItem>
</SummaryList>
```

## ARIA

- No role, and no `aria-label`: a `<span>` cannot take a name, so `label` renders as hidden text in a `screen-reader-span`

## When to Use

- Use to display a stored Spain Código de Identificación Fiscal (CIF) read-only.
- Use in summary lists, patient records, audit logs, or detail views.
- Use when the identifier should not be editable in the current context.

## When Not to Use

- Do not use for editing identifiers — use `espana-codigo-de-identificacion-fiscal-input` instead.
- Do not use for general text display — use a `<span>` directly.
- Do not use for other countries' identifiers — use the corresponding country-specific view.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.espana-codigo-de-identificacion-fiscal-view` class hook.

## Testing

- Verify renders a `<span>` with the correct class, no role and no `aria-label`
- Verify the `value` prop is rendered as text content
- Verify `label` renders as hidden text, and that the root has no `aria-label`

## Domain Knowledge

Nine characters: eight digits plus a control letter (the letters I, Ñ, O, and U are not used). Example: 99111222M. For Spanish citizens the NIF equals the DNI; foreign residents use the NIE (leading letter X, Y, or Z). Since 2008 the CIF form is reserved for legal entities, while NIF designates natural persons. The control letter is computed with a Modulo 23 algorithm: the 8-digit number modulo 23 indexes into the fixed 23-character table "TRWAGMYFPDXBNJZSQVHLCKE" (e.g. 12345678 mod 23 = 14 → "Z"); for a NIE the leading letter is first mapped to a digit (X→0, Y→1, Z→2) before the same calculation.

**Where to find it:** Spanish national identity card (DNI), the residence card (NIE) for foreign residents, the driving licence, and the social security card.

## Security and privacy

A national identifier is personal data, and often a key to other records.

- The view shows exactly the text it is given; it does not mask. Pass the masked form (for example the last four characters) wherever the full number is not needed, and render the full number only to someone entitled to it.
- Do not log the value, put it in a URL or query string, or send it to analytics or an error tracker.
- Text on screen can be read over a shoulder and is kept by screenshots and screen recordings; treat a page that shows it as sensitive.

## Related components

- `espana-codigo-de-identificacion-fiscal-input` — an input for entering Spain's Código de Identificación Fiscal (CIF)
- `summary-list-item` — one key-value pair in a summary list

## References

- Wikipedia: https://en.wikipedia.org/wiki/VAT_identification_number#Spain

---

Lily™ and Lily Design System™ are trademarks.
