# Cesko Rodne Cislo Input

CeskoRodneCisloInput is a headless input for entering Czech Republic's Rodné číslo (RČ), Czech Republic's national-id identifier. It renders as `<input type="text">` with pattern validation, numeric/letter keyboard hints, and `autocomplete="off"` to protect sensitive identifiers. It is the editable companion to CeskoRodneCisloView.

## Implementation Notes

- Renders as `<input type="text">` with pattern validation
- Format: nine or ten digits in the format YYXXDD/SSSC where XX=MM for males and MM+50 for females; the ten-digit form ends in a check digit and is usually divisible by 11
- `autocomplete="off"` to protect sensitive identifiers
- Supports two-way binding on the `value` prop
- Companion to CeskoRodneCisloView

## Props

- `label`: string (required) — accessible label via `aria-label`
- `value`: string (default: "") — bindable input value
- `required`: boolean (default: false) — form validation
- `disabled`: boolean (default: false) — disabled state
- `...restProps`: any — additional HTML attributes spread onto the `<input>`

## Usage

```html
<Field label="Czech Personal Number" required>
  <CeskoRodneCisloInput label="Czech Personal Number" value={value} required />
  <Hint>nine or ten digits in the format YYXXDD/SSSC where XX=MM for males and MM+50 for females</Hint>
  <ErrorMessage>Please enter a valid Czech Personal Number</ErrorMessage>
</Field>
```

## ARIA

- `aria-label={label}` — provides accessible name

## When to Use

- Use in forms collecting Czech Republic's Rodné číslo (RČ).
- Use with pattern validation matching the documented format.
- Use in administrative or national-id workflows where the identifier is required.

## When Not to Use

- Do not use for displaying read-only identifiers — use `cesko-rodne-cislo-view` instead.
- Do not use for general text input — use `text-input` instead.
- Do not use for other countries' identifiers — use the corresponding country-specific input.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.cesko-rodne-cislo-input` class hook.

## Testing

- Verify renders an `<input>` with the correct class and `type="text"`
- Verify `aria-label` is set from the `label` prop
- Verify pattern attribute matches the documented format
- Verify `autocomplete="off"`
- Verify value binding works

## Domain Knowledge

The Rodné číslo (RČ) is Czech Republic's national-id identifier. Format: nine or ten digits in the format YYXXDD/SSSC where XX=MM for males and MM+50 for females; the ten-digit form ends in a check digit and is usually divisible by 11.

## Related components

- `cesko-rodne-cislo-view` — a read-only display of Czech Republic's Rodné číslo (RČ)
- `text-input` — a single-line text input field <input type="text">

## References

- Wikipedia: https://en.wikipedia.org/wiki/National_identification_number#Czech_Republic
