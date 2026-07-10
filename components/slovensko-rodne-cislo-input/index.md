# Slovensko Rodne Cislo Input

SlovenskoRodneCisloInput is a headless input for entering Slovakia's Rodné číslo (RČ), Slovakia's national-id identifier. It renders as `<input type="text">` with pattern validation, numeric/letter keyboard hints, and `autocomplete="off"` to protect sensitive identifiers. It is the editable companion to SlovenskoRodneCisloView.

## Implementation Notes

- Renders as `<input type="text">` with pattern validation
- Format: 10 digits in the form YYMMDDCCCX where MM is 01-12 for males and 51-62 for females; X is a check digit and the whole number is divisible by 11
- `autocomplete="off"` to protect sensitive identifiers
- Supports two-way binding on the `value` prop
- Companion to SlovenskoRodneCisloView

## Props

- `label`: string (required) — accessible label via `aria-label`
- `value`: string (default: "") — bindable input value
- `required`: boolean (default: false) — form validation
- `disabled`: boolean (default: false) — disabled state
- `...restProps`: any — additional HTML attributes spread onto the `<input>`

## Usage

```html
<Field label="Slovak Personal Number" required>
  <SlovenskoRodneCisloInput label="Slovak Personal Number" value={value} required />
  <Hint>10 digits in the form YYMMDDCCCX where MM is 01-12 for males and 51-62 for females</Hint>
  <ErrorMessage>Please enter a valid Slovak Personal Number</ErrorMessage>
</Field>
```

## ARIA

- `aria-label={label}` — provides accessible name

## When to Use

- Use in forms collecting Slovakia's Rodné číslo (RČ).
- Use with pattern validation matching the documented format.
- Use in administrative or national-id workflows where the identifier is required.

## When Not to Use

- Do not use for displaying read-only identifiers — use `slovensko-rodne-cislo-view` instead.
- Do not use for general text input — use `text-input` instead.
- Do not use for other countries' identifiers — use the corresponding country-specific input.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.slovensko-rodne-cislo-input` class hook.

## Testing

- Verify renders an `<input>` with the correct class and `type="text"`
- Verify `aria-label` is set from the `label` prop
- Verify pattern attribute matches the documented format
- Verify `autocomplete="off"`
- Verify value binding works

## Domain Knowledge

The Rodné číslo (RČ) is Slovakia's national-id identifier. Format: 10 digits in the form YYMMDDCCCX where MM is 01-12 for males and 51-62 for females; X is a check digit and the whole number is divisible by 11.

## Related components

- `slovensko-rodne-cislo-view` — a read-only display of Slovakia's Rodné číslo (RČ)
- `text-input` — a single-line text input field <input type="text">

## References

- Wikipedia: https://en.wikipedia.org/wiki/National_identification_number#Slovakia

---

Lily™ and Lily Design System™ are trademarks.
