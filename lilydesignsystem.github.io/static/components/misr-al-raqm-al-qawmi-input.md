# Misr Al Raqm Al Qawmi Input

MisrAlRaqmAlQawmiInput is a headless input for entering Egypt's الرقم القومي (Al-Raqm Al-Qawmi), Egypt's government-issued personal identifier. It renders as `<input type="text">` with `autocomplete="off"` to protect sensitive identifiers. It is the editable companion to MisrAlRaqmAlQawmiView.

**Status:** beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow.

## Implementation Notes

- Renders as `<input type="text">`
- Format: Fourteen digits. The first digit encodes century of birth (2 for 1900-1999, 3 for 2000-2099); the next six encode date of birth (YYMMDD); the next two encode governorate of birth/registration; the next four are a serial number whose own parity encodes sex (odd male, even female); the fourteenth digit is a check digit.
- `autocomplete="off"` to protect sensitive identifiers
- Supports two-way binding on the `value` prop
- Companion to MisrAlRaqmAlQawmiView

## Props

- `label`: string (required) — accessible label via `aria-label`
- `value`: string (default: "") — bindable input value
- `required`: boolean (default: false) — form validation
- `disabled`: boolean (default: false) — disabled state
- `...restProps`: any — additional HTML attributes spread onto the `<input>`

## Usage

```html
<Field label="الرقم القومي (Al-Raqm Al-Qawmi)" required>
  <MisrAlRaqmAlQawmiInput label="الرقم القومي (Al-Raqm Al-Qawmi)" value={value} required />
  <Hint>Fourteen digits. The first digit encodes century of birth (2 for 1900-1999, 3 for 2000-2099); the next six encode date of birth (YYMMDD); the next two encode governorate of birth/registration; the next four are a serial number whose own parity encodes sex (odd male, even female); the fourteenth digit is a check digit.</Hint>
  <ErrorMessage>Please enter a valid الرقم القومي</ErrorMessage>
</Field>
```

## ARIA

- `aria-label={label}` — provides accessible name

## When to Use

- Use in forms collecting Egypt's الرقم القومي (Al-Raqm Al-Qawmi).
- Use in administrative or national-id workflows where the identifier is required.

## When Not to Use

- Do not use for displaying read-only identifiers — use `misr-al-raqm-al-qawmi-view` instead.
- Do not use for general text input — use `text-input` instead.
- Do not use for other countries' identifiers — use the corresponding country-specific input.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.misr-al-raqm-al-qawmi-input` class hook.

## Testing

- Verify renders an `<input>` with the correct class and `type="text"`
- Verify `aria-label` is set from the `label` prop
- Verify `autocomplete="off"`
- Verify value binding works

## Domain Knowledge

Fourteen digits. The first digit encodes century of birth (2 for 1900-1999, 3 for 2000-2099); the next six encode date of birth (YYMMDD); the next two encode governorate of birth/registration; the next four are a serial number whose own parity encodes sex (odd male, even female); the fourteenth digit is a check digit.

**Where to find it:** Printed on the Egyptian National Identity Card (بطاقة الرقم القومي) issued by Egypt's Civil Status Organization, and required for both public and private health-insurance and healthcare-facility registration.

## Related components

- `misr-al-raqm-al-qawmi-view` — a read-only display of Egypt's الرقم القومي (Al-Raqm Al-Qawmi)
- `text-input` — a single-line text input field <input type="text">

## References

- Wikipedia: [Egyptian National Identity Card](https://en.wikipedia.org/wiki/Egyptian_National_Identity_Card)

---

Lily™ and Lily Design System™ are trademarks.
