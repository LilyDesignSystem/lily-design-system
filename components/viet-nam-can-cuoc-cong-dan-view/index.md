# Viet Nam Can Cuoc Cong Dan View

VietNamCanCuocCongDanView is a headless read-only display of Viet Nam's Citizen Identification Number (CCCD), Viet Nam's government-issued personal identifier. It renders as a `<span>` with an accessible label. It is the read-only companion to VietNamCanCuocCongDanInput.

**Status:** beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow.

## Implementation Notes

- Renders as `<span>`
- Format: Twelve digits: a three-digit code for the province or country of registration, one digit for gender and century of birth (0 male and 1 female for the 1900s, 2 male and 3 female for the 2000s, and so on in pairs), the last two digits of the year of birth, and six random digits. There is no published check digit.
- Provides accessible name via the `label` prop
- Companion to VietNamCanCuocCongDanInput

## Props

- `value`: string (default: "") — the identifier to display
- `label`: string (required) — accessible label via `aria-label`
- `...restProps`: any — additional HTML attributes spread onto the `<span>`

## Usage

```html
<SummaryList>
  <SummaryListItem term="Citizen Identification Number (CCCD)">
    <VietNamCanCuocCongDanView
      label="Citizen Identification Number (CCCD)"
      value="{value}"
    />
  </SummaryListItem>
</SummaryList>
```

## ARIA

- `aria-label={label}` — provides the accessible name

## When to Use

- Use to display a stored Viet Nam Citizen Identification Number (CCCD) read-only.
- Use in summary lists, patient records, audit logs, or detail views.
- Use when the identifier should not be editable in the current context.

## When Not to Use

- Do not use for editing identifiers — use `viet-nam-can-cuoc-cong-dan-input` instead.
- Do not use for general text display — use a `<span>` directly.
- Do not use for other countries' identifiers — use the corresponding country-specific view.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.viet-nam-can-cuoc-cong-dan-view` class hook.

## Testing

- Verify renders a `<span>` with the correct class
- Verify the `value` prop is rendered as text content
- Verify `aria-label` is set from the `label` prop

## Domain Knowledge

Twelve digits: a three-digit code for the province or country of registration, one digit for gender and century of birth (0 male and 1 female for the 1900s, 2 male and 3 female for the 2000s, and so on in pairs), the last two digits of the year of birth, and six random digits. There is no published check digit.

**Where to find it:** Printed on the Citizen Identity Card (Căn cước công dân), and used for health insurance, banking, tax and government services.

## Related components

- `viet-nam-can-cuoc-cong-dan-input` — an input for entering Viet Nam's Citizen Identification Number (CCCD)
- `summary-list-item` — one key-value pair in a summary list

## References

- Wikipedia: [Vietnamese identity card](https://en.wikipedia.org/wiki/Vietnamese_identity_card)

---

Lily™ and Lily Design System™ are trademarks.
