# Magyarorszag Taj Szam View

MagyarorszagTajSzamView is a headless read-only display of Hungary's Társadalombiztosítási Azonosító Jel (TAJ), Hungary's government-issued personal identifier. It renders as a `<span>` with an accessible label. It is the read-only companion to MagyarorszagTajSzamInput.

**Status:** beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow.

## Implementation Notes

- Renders as `<span>`
- Format: Nine digits, displayed as SSS SSS SSK. The first eight digits are a simple issued-in-order serial number; the ninth is a check digit computed by multiplying the first eight digits by alternating weights 3 and 7, summing the products, and taking the result Modulus 10 — an algorithm unique to Hungary, distinct from Luhn.
- Provides accessible name via the `label` prop
- Companion to MagyarorszagTajSzamInput

## Props

- `value`: string (default: "") — the identifier to display
- `label`: string (required) — accessible label via `aria-label`
- `...restProps`: any — additional HTML attributes spread onto the `<span>`

## Usage

```html
<SummaryList>
  <SummaryListItem term="Társadalombiztosítási Azonosító Jel (TAJ)">
    <MagyarorszagTajSzamView label="Társadalombiztosítási Azonosító Jel (TAJ)" value={value} />
  </SummaryListItem>
</SummaryList>
```

## ARIA

- `aria-label={label}` — provides the accessible name

## When to Use

- Use to display a stored Hungary Társadalombiztosítási Azonosító Jel (TAJ) read-only.
- Use in summary lists, patient records, audit logs, or detail views.
- Use when the identifier should not be editable in the current context.

## When Not to Use

- Do not use for editing identifiers — use `magyarorszag-taj-szam-input` instead.
- Do not use for general text display — use a `<span>` directly.
- Do not use for other countries' identifiers — use the corresponding country-specific view.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.magyarorszag-taj-szam-view` class hook.

## Testing

- Verify renders a `<span>` with the correct class
- Verify the `value` prop is rendered as text content
- Verify `aria-label` is set from the `label` prop

## Domain Knowledge

Nine digits, displayed as SSS SSS SSK. The first eight digits are a simple issued-in-order serial number; the ninth is a check digit computed by multiplying the first eight digits by alternating weights 3 and 7, summing the products, and taking the result Modulus 10 — an algorithm unique to Hungary, distinct from Luhn.

**Where to find it:** Printed on the TAJ card and required at every doctor visit, pharmacy, and hospital admission under Hungary's National Health Insurance Fund (NEAK).

## Related components

- `magyarorszag-taj-szam-input` — an input for entering Hungary's Társadalombiztosítási Azonosító Jel (TAJ)
- `summary-list-item` — one key-value pair in a summary list

## References

- Wikipedia: [Társadalombiztosítási azonosító jel](https://hu.wikipedia.org/wiki/T%C3%A1rsadalombiztos%C3%ADt%C3%A1si_azonos%C3%ADt%C3%B3_jel)

---

Lily™ and Lily Design System™ are trademarks.
