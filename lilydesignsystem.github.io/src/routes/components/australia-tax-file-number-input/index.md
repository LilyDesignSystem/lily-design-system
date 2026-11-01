# Australia Tax File Number Input

AustraliaTaxFileNumberInput is a headless input for entering Australia's Tax File Number (TFN), Australia's government-issued personal identifier. It renders as `<input type="text">` with `autocomplete="off"` to protect sensitive identifiers. It is the editable companion to AustraliaTaxFileNumberView.

**Status:** beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow.

## Implementation Notes

- Renders as `<input type="text">`
- Format: Nine digits, written 123 456 782 (older numbers have eight). The digits are multiplied by the weights 1,4,3,7,5,8,6,9,10 and summed, and the sum must be a multiple of 11.
- `autocomplete="off"` to protect sensitive identifiers
- Supports two-way binding on the `value` prop
- Companion to AustraliaTaxFileNumberView

## Props

- `label`: string (required) — accessible label via `aria-label`
- `value`: string (default: "") — bindable input value
- `required`: boolean (default: false) — form validation
- `disabled`: boolean (default: false) — disabled state
- `...restProps`: any — additional HTML attributes spread onto the `<input>`

## Usage

```html
<Field
  label="Tax File Number (TFN)"
  required
>
  <AustraliaTaxFileNumberInput
    label="Tax File Number (TFN)"
    value="{value}"
    required
  />
  <Hint
    >Nine digits, written 123 456 782 (older numbers have eight). The digits are multiplied by the
    weights 1,4,3,7,5,8,6,9,10 and summed, and the sum must be a multiple of 11.</Hint
  >
  <ErrorMessage>Please enter a valid Tax File Number (TFN)</ErrorMessage>
</Field>
```

## ARIA

- `aria-label={label}` — provides accessible name

## When to Use

- Use in forms collecting Australia's Tax File Number (TFN).
- Use in administrative or national-id workflows where the identifier is required.

## When Not to Use

- Do not use for displaying read-only identifiers — use `australia-tax-file-number-view` instead.
- Do not use for general text input — use `text-input` instead.
- Do not use for other countries' identifiers — use the corresponding country-specific input.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.australia-tax-file-number-input` class hook.

## Testing

- Verify renders an `<input>` with the correct class and `type="text"`
- Verify `aria-label` is set from the `label` prop
- Verify `autocomplete="off"`
- Verify value binding works

## Domain Knowledge

Nine digits, written 123 456 782 (older numbers have eight). The digits are multiplied by the weights 1,4,3,7,5,8,6,9,10 and summed, and the sum must be a multiple of 11.

**Where to find it:** Shown on the Australian Taxation Office notice of assessment, payment summaries and superannuation statements; not printed on a card.

## Related components

- `australia-tax-file-number-view` — a read-only display of Australia's Tax File Number (TFN)
- `text-input` — a single-line text input field <input type="text">

## References

- Wikipedia: [Tax file number](https://en.wikipedia.org/wiki/Tax_file_number)

---

Lily™ and Lily Design System™ are trademarks.
