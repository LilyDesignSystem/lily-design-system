# Schweiz Ahv Nummer View

SchweizAhvNummerView is a headless read-only display of Switzerland's AHV-Nummer / Numéro AVS, Switzerland's government-issued personal identifier. It renders as a `<span>` with an accessible label. It is the read-only companion to SchweizAhvNummerInput.

**Status:** beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow.

## Implementation Notes

- Renders as `<span>`
- Format: Thirteen digits, displayed as 756.NNNN.NNNN.NN, always beginning with the country prefix 756. It is a valid EAN-13 barcode number: the final digit is an EAN-13 check digit computed over the twelve preceding digits (alternating-position weights of 1 and 3). Replaced the old 11-digit AHV card number on 1 July 2008.
- Provides accessible name via the `label` prop
- Companion to SchweizAhvNummerInput

## Props

- `value`: string (default: "") — the identifier to display
- `label`: string (required) — accessible label via `aria-label`
- `...restProps`: any — additional HTML attributes spread onto the `<span>`

## Usage

```html
<SummaryList>
  <SummaryListItem term="AHV-Nummer / Numéro AVS">
    <SchweizAhvNummerView label="AHV-Nummer / Numéro AVS" value={value} />
  </SummaryListItem>
</SummaryList>
```

## ARIA

- `aria-label={label}` — provides the accessible name

## When to Use

- Use to display a stored Switzerland AHV-Nummer / Numéro AVS read-only.
- Use in summary lists, patient records, audit logs, or detail views.
- Use when the identifier should not be editable in the current context.

## When Not to Use

- Do not use for editing identifiers — use `schweiz-ahv-nummer-input` instead.
- Do not use for general text display — use a `<span>` directly.
- Do not use for other countries' identifiers — use the corresponding country-specific view.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.schweiz-ahv-nummer-view` class hook.

## Testing

- Verify renders a `<span>` with the correct class
- Verify the `value` prop is rendered as text content
- Verify `aria-label` is set from the `label` prop

## Domain Knowledge

Thirteen digits, displayed as 756.NNNN.NNNN.NN, always beginning with the country prefix 756. It is a valid EAN-13 barcode number: the final digit is an EAN-13 check digit computed over the twelve preceding digits (alternating-position weights of 1 and 3). Replaced the old 11-digit AHV card number on 1 July 2008.

**Where to find it:** Printed on the Swiss health-insurance card (carte d'assuré / Versichertenkarte), the AHV/AVS card, and payslips.

## Related components

- `schweiz-ahv-nummer-input` — an input for entering Switzerland's AHV-Nummer / Numéro AVS
- `summary-list-item` — one key-value pair in a summary list

## References

- Wikipedia: [Data codes for Switzerland](https://en.wikipedia.org/wiki/Data_codes_for_Switzerland)

---

Lily™ and Lily Design System™ are trademarks.
