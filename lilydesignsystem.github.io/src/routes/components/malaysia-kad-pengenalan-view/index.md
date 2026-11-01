# Malaysia Kad Pengenalan View

MalaysiaKadPengenalanView is a headless read-only display of Malaysia's MyKad Number (NRIC), Malaysia's government-issued personal identifier. It renders as a `<span>` with an accessible label. It is the read-only companion to MalaysiaKadPengenalanInput.

**Status:** beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow.

## Implementation Notes

- Renders as `<span>`
- Format: Twelve digits, usually written YYMMDD-PB-NNNG: the date of birth (year, month, day), a two-digit code for the place of birth (a state or a country), and a four-digit serial whose last digit is odd for a male and even for a female. There is no check digit.
- Provides accessible name via the `label` prop
- Companion to MalaysiaKadPengenalanInput

## Props

- `value`: string (default: "") — the identifier to display
- `label`: string (required) — accessible label via `aria-label`
- `...restProps`: any — additional HTML attributes spread onto the `<span>`

## Usage

```html
<SummaryList>
  <SummaryListItem term="MyKad Number (NRIC)">
    <MalaysiaKadPengenalanView
      label="MyKad Number (NRIC)"
      value="{value}"
    />
  </SummaryListItem>
</SummaryList>
```

## ARIA

- `aria-label={label}` — provides the accessible name

## When to Use

- Use to display a stored Malaysia MyKad Number (NRIC) read-only.
- Use in summary lists, patient records, audit logs, or detail views.
- Use when the identifier should not be editable in the current context.

## When Not to Use

- Do not use for editing identifiers — use `malaysia-kad-pengenalan-input` instead.
- Do not use for general text display — use a `<span>` directly.
- Do not use for other countries' identifiers — use the corresponding country-specific view.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.malaysia-kad-pengenalan-view` class hook.

## Testing

- Verify renders a `<span>` with the correct class
- Verify the `value` prop is rendered as text content
- Verify `aria-label` is set from the `label` prop

## Domain Knowledge

Twelve digits, usually written YYMMDD-PB-NNNG: the date of birth (year, month, day), a two-digit code for the place of birth (a state or a country), and a four-digit serial whose last digit is odd for a male and even for a female. There is no check digit.

**Where to find it:** Printed on the MyKad identity card, and asked for by hospitals, banks, schools, employers and government services.

## Related components

- `malaysia-kad-pengenalan-input` — an input for entering Malaysia's MyKad Number (NRIC)
- `summary-list-item` — one key-value pair in a summary list

## References

- Wikipedia: [MyKad](https://en.wikipedia.org/wiki/MyKad)

---

Lily™ and Lily Design System™ are trademarks.
