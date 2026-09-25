# Hanguk Jumin Deungnok Beonho View

HangukJuminDeungnokBeonhoView is a headless read-only display of South Korea's Resident Registration Number (주민등록번호), South Korea's government-issued personal identifier. It renders as a `<span>` with an accessible label. It is the read-only companion to HangukJuminDeungnokBeonhoInput.

**Status:** beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow.

## Implementation Notes

- Renders as `<span>`
- Format: Thirteen digits, displayed as NNNNNN-NNNNNNN. The first six digits encode date of birth (YYMMDD); the seventh digit encodes sex and birth century; digits eight through eleven encode place of registration; the twelfth is a sequence number; the thirteenth is a Modulus-11 check digit over the preceding twelve.
- Provides accessible name via the `label` prop
- Companion to HangukJuminDeungnokBeonhoInput

## Props

- `value`: string (default: "") — the identifier to display
- `label`: string (required) — accessible label via `aria-label`
- `...restProps`: any — additional HTML attributes spread onto the `<span>`

## Usage

```html
<SummaryList>
  <SummaryListItem term="Resident Registration Number (주민등록번호)">
    <HangukJuminDeungnokBeonhoView label="Resident Registration Number (주민등록번호)" value={value} />
  </SummaryListItem>
</SummaryList>
```

## ARIA

- `aria-label={label}` — provides the accessible name

## When to Use

- Use to display a stored South Korea Resident Registration Number (주민등록번호) read-only.
- Use in summary lists, patient records, audit logs, or detail views.
- Use when the identifier should not be editable in the current context.

## When Not to Use

- Do not use for editing identifiers — use `hanguk-jumin-deungnok-beonho-input` instead.
- Do not use for general text display — use a `<span>` directly.
- Do not use for other countries' identifiers — use the corresponding country-specific view.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.hanguk-jumin-deungnok-beonho-view` class hook.

## Testing

- Verify renders a `<span>` with the correct class
- Verify the `value` prop is rendered as text content
- Verify `aria-label` is set from the `label` prop

## Domain Knowledge

Thirteen digits, displayed as NNNNNN-NNNNNNN. The first six digits encode date of birth (YYMMDD); the seventh digit encodes sex and birth century; digits eight through eleven encode place of registration; the twelfth is a sequence number; the thirteenth is a Modulus-11 check digit over the preceding twelve.

**Where to find it:** Printed on the Resident Registration Card (주민등록증) and required for enrolling in National Health Insurance, banking, and most administrative services.

## Related components

- `hanguk-jumin-deungnok-beonho-input` — an input for entering South Korea's Resident Registration Number (주민등록번호)
- `summary-list-item` — one key-value pair in a summary list

## References

- Wikipedia: [Resident registration number](https://en.wikipedia.org/wiki/Resident_registration_number)

---

Lily™ and Lily Design System™ are trademarks.
