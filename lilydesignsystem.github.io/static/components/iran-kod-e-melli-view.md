# Iran Kod E Melli View

IranKodEMelliView is a headless read-only display of Iran's National Code (Kod-e Melli), Iran's government-issued personal identifier. It renders as a `<span>` with an accessible label. It is the read-only companion to IranKodEMelliInput.

**Status:** beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow.

## Implementation Notes

- Renders as `<span>`
- Format: Ten digits whose last digit is a check digit. The first nine digits are multiplied by 10,9,8,7,6,5,4,3,2 and summed; with r the sum's Modulus-11 remainder, the check digit is r when r is less than 2, otherwise 11 minus r. A number whose ten digits are all the same is never valid.
- Provides accessible name via the `label` prop
- Companion to IranKodEMelliInput

## Props

- `value`: string (default: "") — the identifier to display
- `label`: string (required) — accessible label via `aria-label`
- `...restProps`: any — additional HTML attributes spread onto the `<span>`

## Usage

```html
<SummaryList>
  <SummaryListItem term="National Code (Kod-e Melli)">
    <IranKodEMelliView
      label="National Code (Kod-e Melli)"
      value="{value}"
    />
  </SummaryListItem>
</SummaryList>
```

## ARIA

- `aria-label={label}` — provides the accessible name

## When to Use

- Use to display a stored Iran National Code (Kod-e Melli) read-only.
- Use in summary lists, patient records, audit logs, or detail views.
- Use when the identifier should not be editable in the current context.

## When Not to Use

- Do not use for editing identifiers — use `iran-kod-e-melli-input` instead.
- Do not use for general text display — use a `<span>` directly.
- Do not use for other countries' identifiers — use the corresponding country-specific view.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.iran-kod-e-melli-view` class hook.

## Testing

- Verify renders a `<span>` with the correct class
- Verify the `value` prop is rendered as text content
- Verify `aria-label` is set from the `label` prop

## Domain Knowledge

Ten digits whose last digit is a check digit. The first nine digits are multiplied by 10,9,8,7,6,5,4,3,2 and summed; with r the sum's Modulus-11 remainder, the check digit is r when r is less than 2, otherwise 11 minus r. A number whose ten digits are all the same is never valid.

**Where to find it:** Printed on the National Card (کارت ملی) and on the birth certificate, and asked for by banks, insurers, hospitals and government services.

## Related components

- `iran-kod-e-melli-input` — an input for entering Iran's National Code (Kod-e Melli)
- `summary-list-item` — one key-value pair in a summary list

## References

- Wikipedia: [Iranian identity card](https://en.wikipedia.org/wiki/Iranian_identity_card)

---

Lily™ and Lily Design System™ are trademarks.
