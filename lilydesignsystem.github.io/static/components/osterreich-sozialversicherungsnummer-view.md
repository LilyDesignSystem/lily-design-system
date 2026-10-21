# Osterreich Sozialversicherungsnummer View

OsterreichSozialversicherungsnummerView is a headless read-only display of Austria's Sozialversicherungsnummer (SVNR), Austria's government-issued personal identifier. It renders as a `<span>` with an accessible label. It is the read-only companion to OsterreichSozialversicherungsnummerInput.

**Status:** beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow.

## Implementation Notes

- Renders as `<span>`
- Format: Ten digits, displayed as NNNN DDMMYY. The first three digits are a serial number (the first not zero) followed by a Modulus-11 check digit as the fourth digit; the remaining six digits encode date of birth (DDMMYY). If the Modulus-11 remainder is 10, the serial number is incremented by one and the check digit recalculated.
- Provides accessible name via the `label` prop
- Companion to OsterreichSozialversicherungsnummerInput

## Props

- `value`: string (default: "") — the identifier to display
- `label`: string (required) — accessible label via `aria-label`
- `...restProps`: any — additional HTML attributes spread onto the `<span>`

## Usage

```html
<SummaryList>
  <SummaryListItem term="Sozialversicherungsnummer (SVNR)">
    <OsterreichSozialversicherungsnummerView label="Sozialversicherungsnummer (SVNR)" value={value} />
  </SummaryListItem>
</SummaryList>
```

## ARIA

- `aria-label={label}` — provides the accessible name

## When to Use

- Use to display a stored Austria Sozialversicherungsnummer (SVNR) read-only.
- Use in summary lists, patient records, audit logs, or detail views.
- Use when the identifier should not be editable in the current context.

## When Not to Use

- Do not use for editing identifiers — use `osterreich-sozialversicherungsnummer-input` instead.
- Do not use for general text display — use a `<span>` directly.
- Do not use for other countries' identifiers — use the corresponding country-specific view.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.osterreich-sozialversicherungsnummer-view` class hook.

## Testing

- Verify renders a `<span>` with the correct class
- Verify the `value` prop is rendered as text content
- Verify `aria-label` is set from the `label` prop

## Domain Knowledge

Ten digits, displayed as NNNN DDMMYY. The first three digits are a serial number (the first not zero) followed by a Modulus-11 check digit as the fourth digit; the remaining six digits encode date of birth (DDMMYY). If the Modulus-11 remainder is 10, the serial number is incremented by one and the check digit recalculated.

**Where to find it:** Printed on the e-card (the Austrian health-insurance chip card) and required for every statutory health-insurance (Sozialversicherung), pension, and employment record.

## Related components

- `osterreich-sozialversicherungsnummer-input` — an input for entering Austria's Sozialversicherungsnummer (SVNR)
- `summary-list-item` — one key-value pair in a summary list

## References

- Wikipedia: [Sozialversicherungsnummer](https://de.wikipedia.org/wiki/Sozialversicherungsnummer)

---

Lily™ and Lily Design System™ are trademarks.
