# Pilipinas Philhealth Identification Number Input

PilipinasPhilhealthIdentificationNumberInput is a headless input for entering the Philippines's PhilHealth Identification Number (PIN), the Philippines's government-issued personal identifier. It renders as `<input type="text">` with `autocomplete="off"` to protect sensitive identifiers. It is the editable companion to PilipinasPhilhealthIdentificationNumberView.

**Status:** beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow.

## Implementation Notes

- Renders as `<input type="text">`
- Format: Twelve-digit number assigned by the Philippine Health Insurance Corporation (PhilHealth) to every enrolled member, commonly displayed grouped as NN-NNNNNNNNN-N. No published check-digit algorithm; correctness is confirmed against PhilHealth's own membership records.
- `autocomplete="off"` to protect sensitive identifiers
- Supports two-way binding on the `value` prop
- Companion to PilipinasPhilhealthIdentificationNumberView

## Props

- `label`: string (required) — accessible label via `aria-label`
- `value`: string (default: "") — bindable input value
- `required`: boolean (default: false) — form validation
- `disabled`: boolean (default: false) — disabled state
- `...restProps`: any — additional HTML attributes spread onto the `<input>`

## Usage

```html
<Field label="PhilHealth Identification Number (PIN)" required>
  <PilipinasPhilhealthIdentificationNumberInput label="PhilHealth Identification Number (PIN)" value={value} required />
  <Hint>Twelve-digit number assigned by the Philippine Health Insurance Corporation (PhilHealth) to every enrolled member, commonly displayed grouped as NN-NNNNNNNNN-N. No published check-digit algorithm; correctness is confirmed against PhilHealth's own membership records.</Hint>
  <ErrorMessage>Please enter a valid PhilHealth Identification Number</ErrorMessage>
</Field>
```

## ARIA

- `aria-label={label}` — provides accessible name

## When to Use

- Use in forms collecting the Philippines's PhilHealth Identification Number (PIN).
- Use in administrative or national-id workflows where the identifier is required.

## When Not to Use

- Do not use for displaying read-only identifiers — use `pilipinas-philhealth-identification-number-view` instead.
- Do not use for general text input — use `text-input` instead.
- Do not use for other countries' identifiers — use the corresponding country-specific input.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.pilipinas-philhealth-identification-number-input` class hook.

## Testing

- Verify renders an `<input>` with the correct class and `type="text"`
- Verify `aria-label` is set from the `label` prop
- Verify `autocomplete="off"`
- Verify value binding works

## Domain Knowledge

Twelve-digit number assigned by the Philippine Health Insurance Corporation (PhilHealth) to every enrolled member, commonly displayed grouped as NN-NNNNNNNNN-N. No published check-digit algorithm; correctness is confirmed against PhilHealth's own membership records.

**Where to find it:** Printed on the PhilHealth Member Data Record (MDR) and ID card, and shown in the PhilHealth mobile app and online member portal.

## Related components

- `pilipinas-philhealth-identification-number-view` — a read-only display of the Philippines's PhilHealth Identification Number (PIN)
- `text-input` — a single-line text input field <input type="text">

## References

- Wikipedia: [PhilHealth](https://en.wikipedia.org/wiki/PhilHealth)

---

Lily™ and Lily Design System™ are trademarks.
