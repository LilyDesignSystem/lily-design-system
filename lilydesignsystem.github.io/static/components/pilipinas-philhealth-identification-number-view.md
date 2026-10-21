# Pilipinas Philhealth Identification Number View

PilipinasPhilhealthIdentificationNumberView is a headless read-only display of the Philippines's PhilHealth Identification Number (PIN), the Philippines's government-issued personal identifier. It renders as a `<span>` with an accessible label. It is the read-only companion to PilipinasPhilhealthIdentificationNumberInput.

**Status:** beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow.

## Implementation Notes

- Renders as `<span>`
- Format: Twelve-digit number assigned by the Philippine Health Insurance Corporation (PhilHealth) to every enrolled member, commonly displayed grouped as NN-NNNNNNNNN-N. No published check-digit algorithm; correctness is confirmed against PhilHealth's own membership records.
- Provides accessible name via the `label` prop
- Companion to PilipinasPhilhealthIdentificationNumberInput

## Props

- `value`: string (default: "") — the identifier to display
- `label`: string (required) — accessible label via `aria-label`
- `...restProps`: any — additional HTML attributes spread onto the `<span>`

## Usage

```html
<SummaryList>
  <SummaryListItem term="PhilHealth Identification Number (PIN)">
    <PilipinasPhilhealthIdentificationNumberView label="PhilHealth Identification Number (PIN)" value={value} />
  </SummaryListItem>
</SummaryList>
```

## ARIA

- `aria-label={label}` — provides the accessible name

## When to Use

- Use to display a stored the Philippines PhilHealth Identification Number (PIN) read-only.
- Use in summary lists, patient records, audit logs, or detail views.
- Use when the identifier should not be editable in the current context.

## When Not to Use

- Do not use for editing identifiers — use `pilipinas-philhealth-identification-number-input` instead.
- Do not use for general text display — use a `<span>` directly.
- Do not use for other countries' identifiers — use the corresponding country-specific view.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.pilipinas-philhealth-identification-number-view` class hook.

## Testing

- Verify renders a `<span>` with the correct class
- Verify the `value` prop is rendered as text content
- Verify `aria-label` is set from the `label` prop

## Domain Knowledge

Twelve-digit number assigned by the Philippine Health Insurance Corporation (PhilHealth) to every enrolled member, commonly displayed grouped as NN-NNNNNNNNN-N. No published check-digit algorithm; correctness is confirmed against PhilHealth's own membership records.

**Where to find it:** Printed on the PhilHealth Member Data Record (MDR) and ID card, and shown in the PhilHealth mobile app and online member portal.

## Related components

- `pilipinas-philhealth-identification-number-input` — an input for entering the Philippines's PhilHealth Identification Number (PIN)
- `summary-list-item` — one key-value pair in a summary list

## References

- Wikipedia: [PhilHealth](https://en.wikipedia.org/wiki/PhilHealth)

---

Lily™ and Lily Design System™ are trademarks.
