# Nigeria National Identification Number View

NigeriaNationalIdentificationNumberView is a headless read-only display of Nigeria's National Identification Number (NIN), Nigeria's government-issued personal identifier. It renders as a `<span>` with an accessible label. It is the read-only companion to NigeriaNationalIdentificationNumberInput.

**Status:** beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow.

## Implementation Notes

- Renders as `<span>`
- Format: Eleven digits issued by the National Identity Management Commission (NIMC). No check-digit algorithm is published, so only the length and digits can be checked.
- Provides accessible name via the `label` prop
- Companion to NigeriaNationalIdentificationNumberInput

## Props

- `value`: string (default: "") — the identifier to display
- `label`: string (required) — accessible label via `aria-label`
- `...restProps`: any — additional HTML attributes spread onto the `<span>`

## Usage

```html
<SummaryList>
  <SummaryListItem term="National Identification Number (NIN)">
    <NigeriaNationalIdentificationNumberView
      label="National Identification Number (NIN)"
      value="{value}"
    />
  </SummaryListItem>
</SummaryList>
```

## ARIA

- `aria-label={label}` — provides the accessible name

## When to Use

- Use to display a stored Nigeria National Identification Number (NIN) read-only.
- Use in summary lists, patient records, audit logs, or detail views.
- Use when the identifier should not be editable in the current context.

## When Not to Use

- Do not use for editing identifiers — use `nigeria-national-identification-number-input` instead.
- Do not use for general text display — use a `<span>` directly.
- Do not use for other countries' identifiers — use the corresponding country-specific view.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.nigeria-national-identification-number-view` class hook.

## Testing

- Verify renders a `<span>` with the correct class
- Verify the `value` prop is rendered as text content
- Verify `aria-label` is set from the `label` prop

## Domain Knowledge

Eleven digits issued by the National Identity Management Commission (NIMC). No check-digit algorithm is published, so only the length and digits can be checked.

**Where to find it:** Shown on the NIN slip and in the NIMC mobile app, and asked for when registering a SIM card, opening a bank account or applying for a passport.

## Related components

- `nigeria-national-identification-number-input` — an input for entering Nigeria's National Identification Number (NIN)
- `summary-list-item` — one key-value pair in a summary list

## References

- Wikipedia: [National Identity Management Commission](https://en.wikipedia.org/wiki/National_Identity_Management_Commission)

---

Lily™ and Lily Design System™ are trademarks.
