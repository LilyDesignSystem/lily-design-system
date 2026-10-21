# Misr Al Raqm Al Qawmi View

MisrAlRaqmAlQawmiView is a headless read-only display of Egypt's الرقم القومي (Al-Raqm Al-Qawmi), Egypt's government-issued personal identifier. It renders as a `<span>` with an accessible label. It is the read-only companion to MisrAlRaqmAlQawmiInput.

**Status:** beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow.

## Implementation Notes

- Renders as `<span>`
- Format: Fourteen digits. The first digit encodes century of birth (2 for 1900-1999, 3 for 2000-2099); the next six encode date of birth (YYMMDD); the next two encode governorate of birth/registration; the next four are a serial number whose own parity encodes sex (odd male, even female); the fourteenth digit is a check digit.
- Provides accessible name via the `label` prop
- Companion to MisrAlRaqmAlQawmiInput

## Props

- `value`: string (default: "") — the identifier to display
- `label`: string (required) — accessible label via `aria-label`
- `...restProps`: any — additional HTML attributes spread onto the `<span>`

## Usage

```html
<SummaryList>
  <SummaryListItem term="الرقم القومي (Al-Raqm Al-Qawmi)">
    <MisrAlRaqmAlQawmiView label="الرقم القومي (Al-Raqm Al-Qawmi)" value={value} />
  </SummaryListItem>
</SummaryList>
```

## ARIA

- `aria-label={label}` — provides the accessible name

## When to Use

- Use to display a stored Egypt الرقم القومي (Al-Raqm Al-Qawmi) read-only.
- Use in summary lists, patient records, audit logs, or detail views.
- Use when the identifier should not be editable in the current context.

## When Not to Use

- Do not use for editing identifiers — use `misr-al-raqm-al-qawmi-input` instead.
- Do not use for general text display — use a `<span>` directly.
- Do not use for other countries' identifiers — use the corresponding country-specific view.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.misr-al-raqm-al-qawmi-view` class hook.

## Testing

- Verify renders a `<span>` with the correct class
- Verify the `value` prop is rendered as text content
- Verify `aria-label` is set from the `label` prop

## Domain Knowledge

Fourteen digits. The first digit encodes century of birth (2 for 1900-1999, 3 for 2000-2099); the next six encode date of birth (YYMMDD); the next two encode governorate of birth/registration; the next four are a serial number whose own parity encodes sex (odd male, even female); the fourteenth digit is a check digit.

**Where to find it:** Printed on the Egyptian National Identity Card (بطاقة الرقم القومي) issued by Egypt's Civil Status Organization, and required for both public and private health-insurance and healthcare-facility registration.

## Related components

- `misr-al-raqm-al-qawmi-input` — an input for entering Egypt's الرقم القومي (Al-Raqm Al-Qawmi)
- `summary-list-item` — one key-value pair in a summary list

## References

- Wikipedia: [Egyptian National Identity Card](https://en.wikipedia.org/wiki/Egyptian_National_Identity_Card)

---

Lily™ and Lily Design System™ are trademarks.
