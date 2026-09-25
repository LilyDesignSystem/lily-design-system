# Canada Social Insurance Number Input

CanadaSocialInsuranceNumberInput is a headless input for entering Canada's Social Insurance Number (SIN), Canada's government-issued personal identifier. It renders as `<input type="text">` with `autocomplete="off"` to protect sensitive identifiers. It is the editable companion to CanadaSocialInsuranceNumberView.

**Status:** beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow.

## Implementation Notes

- Renders as `<input type="text">`
- Format: Nine digits, usually displayed in three groups of three (NNN NNN NNN). The leading digit denotes the region of registration (1 Atlantic, 2-3 Quebec, 4-5 Ontario, 6 Prairies, 7 Pacific, 9 temporary residents), the following seven digits are a serial number, and the final digit is a Luhn (Modulus-10) check digit over the first eight.
- `autocomplete="off"` to protect sensitive identifiers
- Supports two-way binding on the `value` prop
- Companion to CanadaSocialInsuranceNumberView

## Props

- `label`: string (required) — accessible label via `aria-label`
- `value`: string (default: "") — bindable input value
- `required`: boolean (default: false) — form validation
- `disabled`: boolean (default: false) — disabled state
- `...restProps`: any — additional HTML attributes spread onto the `<input>`

## Usage

```html
<Field label="Social Insurance Number (SIN)" required>
  <CanadaSocialInsuranceNumberInput label="Social Insurance Number (SIN)" value={value} required />
  <Hint>Nine digits, usually displayed in three groups of three (NNN NNN NNN). The leading digit denotes the region of registration (1 Atlantic, 2-3 Quebec, 4-5 Ontario, 6 Prairies, 7 Pacific, 9 temporary residents), the following seven digits are a serial number, and the final digit is a Luhn (Modulus-10) check digit over the first eight.</Hint>
  <ErrorMessage>Please enter a valid Social Insurance Number</ErrorMessage>
</Field>
```

## ARIA

- `aria-label={label}` — provides accessible name

## When to Use

- Use in forms collecting Canada's Social Insurance Number (SIN).
- Use in administrative or national-id workflows where the identifier is required.

## When Not to Use

- Do not use for displaying read-only identifiers — use `canada-social-insurance-number-view` instead.
- Do not use for general text input — use `text-input` instead.
- Do not use for other countries' identifiers — use the corresponding country-specific input.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.canada-social-insurance-number-input` class hook.

## Testing

- Verify renders an `<input>` with the correct class and `type="text"`
- Verify `aria-label` is set from the `label` prop
- Verify `autocomplete="off"`
- Verify value binding works

## Domain Knowledge

Nine digits, usually displayed in three groups of three (NNN NNN NNN). The leading digit denotes the region of registration (1 Atlantic, 2-3 Quebec, 4-5 Ontario, 6 Prairies, 7 Pacific, 9 temporary residents), the following seven digits are a serial number, and the final digit is a Luhn (Modulus-10) check digit over the first eight.

**Where to find it:** Printed on the paper SIN confirmation letter issued by Service Canada; required for federal benefits, tax filing, and employment records.

## Related components

- `canada-social-insurance-number-view` — a read-only display of Canada's Social Insurance Number (SIN)
- `text-input` — a single-line text input field <input type="text">

## References

- Wikipedia: [Social Insurance Number](https://en.wikipedia.org/wiki/Social_Insurance_Number)

---

Lily™ and Lily Design System™ are trademarks.
