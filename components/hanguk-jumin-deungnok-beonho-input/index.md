# Hanguk Jumin Deungnok Beonho Input

HangukJuminDeungnokBeonhoInput is a headless input for entering South Korea's Resident Registration Number (주민등록번호), South Korea's government-issued personal identifier. It renders as `<input type="text">` with `autocomplete="off"` to protect sensitive identifiers. It is the editable companion to HangukJuminDeungnokBeonhoView.

**Status:** beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow.

## Implementation Notes

- Renders as `<input type="text">`
- Format: Thirteen digits, displayed as NNNNNN-NNNNNNN. The first six digits encode date of birth (YYMMDD); the seventh digit encodes sex and birth century; digits eight through eleven encode place of registration; the twelfth is a sequence number; the thirteenth is a Modulus-11 check digit over the preceding twelve.
- `autocomplete="off"` to protect sensitive identifiers
- Supports two-way binding on the `value` prop
- Companion to HangukJuminDeungnokBeonhoView

## Props

- `label`: string (required) — accessible label via `aria-label`
- `value`: string (default: "") — bindable input value
- `required`: boolean (default: false) — form validation
- `disabled`: boolean (default: false) — disabled state
- `...restProps`: any — additional HTML attributes spread onto the `<input>`

## Usage

```html
<Field label="Resident Registration Number (주민등록번호)" required>
  <HangukJuminDeungnokBeonhoInput label="Resident Registration Number (주민등록번호)" value={value} required />
  <Hint>Thirteen digits, displayed as NNNNNN-NNNNNNN. The first six digits encode date of birth (YYMMDD); the seventh digit encodes sex and birth century; digits eight through eleven encode place of registration; the twelfth is a sequence number; the thirteenth is a Modulus-11 check digit over the preceding twelve.</Hint>
  <ErrorMessage>Please enter a valid Resident Registration Number</ErrorMessage>
</Field>
```

## ARIA

- `aria-label={label}` — provides accessible name

## When to Use

- Use in forms collecting South Korea's Resident Registration Number (주민등록번호).
- Use in administrative or national-id workflows where the identifier is required.

## When Not to Use

- Do not use for displaying read-only identifiers — use `hanguk-jumin-deungnok-beonho-view` instead.
- Do not use for general text input — use `text-input` instead.
- Do not use for other countries' identifiers — use the corresponding country-specific input.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.hanguk-jumin-deungnok-beonho-input` class hook.

## Testing

- Verify renders an `<input>` with the correct class and `type="text"`
- Verify `aria-label` is set from the `label` prop
- Verify `autocomplete="off"`
- Verify value binding works

## Domain Knowledge

Thirteen digits, displayed as NNNNNN-NNNNNNN. The first six digits encode date of birth (YYMMDD); the seventh digit encodes sex and birth century; digits eight through eleven encode place of registration; the twelfth is a sequence number; the thirteenth is a Modulus-11 check digit over the preceding twelve.

**Where to find it:** Printed on the Resident Registration Card (주민등록증) and required for enrolling in National Health Insurance, banking, and most administrative services.

## Related components

- `hanguk-jumin-deungnok-beonho-view` — a read-only display of South Korea's Resident Registration Number (주민등록번호)
- `text-input` — a single-line text input field <input type="text">

## References

- Wikipedia: [Resident registration number](https://en.wikipedia.org/wiki/Resident_registration_number)

---

Lily™ and Lily Design System™ are trademarks.
