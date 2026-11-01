# Malaysia Kad Pengenalan Input

MalaysiaKadPengenalanInput is a headless input for entering Malaysia's MyKad Number (NRIC), Malaysia's government-issued personal identifier. It renders as `<input type="text">` with `autocomplete="off"` to protect sensitive identifiers. It is the editable companion to MalaysiaKadPengenalanView.

**Status:** beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow.

## Implementation Notes

- Renders as `<input type="text">`
- Format: Twelve digits, usually written YYMMDD-PB-NNNG: the date of birth (year, month, day), a two-digit code for the place of birth (a state or a country), and a four-digit serial whose last digit is odd for a male and even for a female. There is no check digit.
- `autocomplete="off"` to protect sensitive identifiers
- Supports two-way binding on the `value` prop
- Companion to MalaysiaKadPengenalanView

## Props

- `label`: string (required) — accessible label via `aria-label`
- `value`: string (default: "") — bindable input value
- `required`: boolean (default: false) — form validation
- `disabled`: boolean (default: false) — disabled state
- `...restProps`: any — additional HTML attributes spread onto the `<input>`

## Usage

```html
<Field
  label="MyKad Number (NRIC)"
  required
>
  <MalaysiaKadPengenalanInput
    label="MyKad Number (NRIC)"
    value="{value}"
    required
  />
  <Hint
    >Twelve digits, usually written YYMMDD-PB-NNNG: the date of birth (year, month, day), a
    two-digit code for the place of birth (a state or a country), and a four-digit serial whose last
    digit is odd for a male and even for a female. There is no check digit.</Hint
  >
  <ErrorMessage>Please enter a valid MyKad Number (NRIC)</ErrorMessage>
</Field>
```

## ARIA

- `aria-label={label}` — provides accessible name

## When to Use

- Use in forms collecting Malaysia's MyKad Number (NRIC).
- Use in administrative or national-id workflows where the identifier is required.

## When Not to Use

- Do not use for displaying read-only identifiers — use `malaysia-kad-pengenalan-view` instead.
- Do not use for general text input — use `text-input` instead.
- Do not use for other countries' identifiers — use the corresponding country-specific input.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.malaysia-kad-pengenalan-input` class hook.

## Testing

- Verify renders an `<input>` with the correct class and `type="text"`
- Verify `aria-label` is set from the `label` prop
- Verify `autocomplete="off"`
- Verify value binding works

## Domain Knowledge

Twelve digits, usually written YYMMDD-PB-NNNG: the date of birth (year, month, day), a two-digit code for the place of birth (a state or a country), and a four-digit serial whose last digit is odd for a male and even for a female. There is no check digit.

**Where to find it:** Printed on the MyKad identity card, and asked for by hospitals, banks, schools, employers and government services.

## Related components

- `malaysia-kad-pengenalan-view` — a read-only display of Malaysia's MyKad Number (NRIC)
- `text-input` — a single-line text input field <input type="text">

## References

- Wikipedia: [MyKad](https://en.wikipedia.org/wiki/MyKad)

---

Lily™ and Lily Design System™ are trademarks.
