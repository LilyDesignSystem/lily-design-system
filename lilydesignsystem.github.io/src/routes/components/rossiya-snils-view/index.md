# Rossiya Snils View

RossiyaSnilsView is a headless read-only display of Russia's СНИЛС (Strakhovoy Nomer Individualnogo Litsevogo Scheta), Russia's government-issued personal identifier. It renders as a `<span>` with an accessible label. It is the read-only companion to RossiyaSnilsInput.

**Status:** beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow.

## Implementation Notes

- Renders as `<span>`
- Format: Eleven digits, displayed as NNN-NNN-NNN CC. The first nine digits are an account number; the last two form a Modulus-101 check value computed as a weighted sum of the first nine digits (each multiplied by its position from 9 down to 1), with sums of 100 or 101 both mapping to a check value of 00.
- Provides accessible name via the `label` prop
- Companion to RossiyaSnilsInput

## Props

- `value`: string (default: "") — the identifier to display
- `label`: string (required) — accessible label via `aria-label`
- `...restProps`: any — additional HTML attributes spread onto the `<span>`

## Usage

```html
<SummaryList>
  <SummaryListItem term="СНИЛС (Strakhovoy Nomer Individualnogo Litsevogo Scheta)">
    <RossiyaSnilsView label="СНИЛС (Strakhovoy Nomer Individualnogo Litsevogo Scheta)" value={value} />
  </SummaryListItem>
</SummaryList>
```

## ARIA

- `aria-label={label}` — provides the accessible name

## When to Use

- Use to display a stored Russia СНИЛС (Strakhovoy Nomer Individualnogo Litsevogo Scheta) read-only.
- Use in summary lists, patient records, audit logs, or detail views.
- Use when the identifier should not be editable in the current context.

## When Not to Use

- Do not use for editing identifiers — use `rossiya-snils-input` instead.
- Do not use for general text display — use a `<span>` directly.
- Do not use for other countries' identifiers — use the corresponding country-specific view.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.rossiya-snils-view` class hook.

## Testing

- Verify renders a `<span>` with the correct class
- Verify the `value` prop is rendered as text content
- Verify `aria-label` is set from the `label` prop

## Domain Knowledge

Eleven digits, displayed as NNN-NNN-NNN CC. The first nine digits are an account number; the last two form a Modulus-101 check value computed as a weighted sum of the first nine digits (each multiplied by its position from 9 down to 1), with sums of 100 or 101 both mapping to a check value of 00.

**Where to find it:** Printed on the SNILS card (green laminated card or, since 2019, a digital record) issued by the Pension Fund of Russia, and required for compulsory medical insurance (ОМС) enrolment, employment, and pension records.

## Related components

- `rossiya-snils-input` — an input for entering Russia's СНИЛС (Strakhovoy Nomer Individualnogo Litsevogo Scheta)
- `summary-list-item` — one key-value pair in a summary list

## References

- Wikipedia: [SNILS (Russia)](https://en.wikipedia.org/wiki/SNILS_(Russia))

---

Lily™ and Lily Design System™ are trademarks.
