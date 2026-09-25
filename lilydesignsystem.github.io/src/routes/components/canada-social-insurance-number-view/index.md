# Canada Social Insurance Number View

CanadaSocialInsuranceNumberView is a headless read-only display of Canada's Social Insurance Number (SIN), Canada's government-issued personal identifier. It renders as a `<span>` with an accessible label. It is the read-only companion to CanadaSocialInsuranceNumberInput.

**Status:** beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow.

## Implementation Notes

- Renders as `<span>`
- Format: Nine digits, usually displayed in three groups of three (NNN NNN NNN). The leading digit denotes the region of registration (1 Atlantic, 2-3 Quebec, 4-5 Ontario, 6 Prairies, 7 Pacific, 9 temporary residents), the following seven digits are a serial number, and the final digit is a Luhn (Modulus-10) check digit over the first eight.
- Provides accessible name via the `label` prop
- Companion to CanadaSocialInsuranceNumberInput

## Props

- `value`: string (default: "") — the identifier to display
- `label`: string (required) — accessible label via `aria-label`
- `...restProps`: any — additional HTML attributes spread onto the `<span>`

## Usage

```html
<SummaryList>
  <SummaryListItem term="Social Insurance Number (SIN)">
    <CanadaSocialInsuranceNumberView label="Social Insurance Number (SIN)" value={value} />
  </SummaryListItem>
</SummaryList>
```

## ARIA

- `aria-label={label}` — provides the accessible name

## When to Use

- Use to display a stored Canada Social Insurance Number (SIN) read-only.
- Use in summary lists, patient records, audit logs, or detail views.
- Use when the identifier should not be editable in the current context.

## When Not to Use

- Do not use for editing identifiers — use `canada-social-insurance-number-input` instead.
- Do not use for general text display — use a `<span>` directly.
- Do not use for other countries' identifiers — use the corresponding country-specific view.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.canada-social-insurance-number-view` class hook.

## Testing

- Verify renders a `<span>` with the correct class
- Verify the `value` prop is rendered as text content
- Verify `aria-label` is set from the `label` prop

## Domain Knowledge

Nine digits, usually displayed in three groups of three (NNN NNN NNN). The leading digit denotes the region of registration (1 Atlantic, 2-3 Quebec, 4-5 Ontario, 6 Prairies, 7 Pacific, 9 temporary residents), the following seven digits are a serial number, and the final digit is a Luhn (Modulus-10) check digit over the first eight.

**Where to find it:** Printed on the paper SIN confirmation letter issued by Service Canada; required for federal benefits, tax filing, and employment records.

## Related components

- `canada-social-insurance-number-input` — an input for entering Canada's Social Insurance Number (SIN)
- `summary-list-item` — one key-value pair in a summary list

## References

- Wikipedia: [Social Insurance Number](https://en.wikipedia.org/wiki/Social_Insurance_Number)

---

Lily™ and Lily Design System™ are trademarks.
