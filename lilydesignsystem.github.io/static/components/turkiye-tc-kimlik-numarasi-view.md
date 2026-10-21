# Turkiye Tc Kimlik Numarasi View

TurkiyeTcKimlikNumarasiView is a headless read-only display of Turkey's T.C. Kimlik Numarası, Turkey's government-issued personal identifier. It renders as a `<span>` with an accessible label. It is the read-only companion to TurkiyeTcKimlikNumarasiInput.

**Status:** beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow.

## Implementation Notes

- Renders as `<span>`
- Format: Eleven digits, the first never zero. The tenth digit is the units digit of ((sum of digits 1,3,5,7,9) × 7) plus ((sum of digits 2,4,6,8) × 9); the eleventh digit is the units digit of the sum of the first ten digits. The eleventh digit is always even.
- Provides accessible name via the `label` prop
- Companion to TurkiyeTcKimlikNumarasiInput

## Props

- `value`: string (default: "") — the identifier to display
- `label`: string (required) — accessible label via `aria-label`
- `...restProps`: any — additional HTML attributes spread onto the `<span>`

## Usage

```html
<SummaryList>
  <SummaryListItem term="T.C. Kimlik Numarası">
    <TurkiyeTcKimlikNumarasiView label="T.C. Kimlik Numarası" value={value} />
  </SummaryListItem>
</SummaryList>
```

## ARIA

- `aria-label={label}` — provides the accessible name

## When to Use

- Use to display a stored Turkey T.C. Kimlik Numarası read-only.
- Use in summary lists, patient records, audit logs, or detail views.
- Use when the identifier should not be editable in the current context.

## When Not to Use

- Do not use for editing identifiers — use `turkiye-tc-kimlik-numarasi-input` instead.
- Do not use for general text display — use a `<span>` directly.
- Do not use for other countries' identifiers — use the corresponding country-specific view.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.turkiye-tc-kimlik-numarasi-view` class hook.

## Testing

- Verify renders a `<span>` with the correct class
- Verify the `value` prop is rendered as text content
- Verify `aria-label` is set from the `label` prop

## Domain Knowledge

Eleven digits, the first never zero. The tenth digit is the units digit of ((sum of digits 1,3,5,7,9) × 7) plus ((sum of digits 2,4,6,8) × 9); the eleventh digit is the units digit of the sum of the first ten digits. The eleventh digit is always even.

**Where to find it:** Printed on the Turkish national identity card (T.C. Kimlik Kartı) and required to register with SGK (Sosyal Güvenlik Kurumu), Turkey's Social Security Institution, for health coverage.

## Related components

- `turkiye-tc-kimlik-numarasi-input` — an input for entering Turkey's T.C. Kimlik Numarası
- `summary-list-item` — one key-value pair in a summary list

## References

- Wikipedia: [Turkish Identification Number](https://en.wikipedia.org/wiki/Turkish_Identification_Number)

---

Lily™ and Lily Design System™ are trademarks.
