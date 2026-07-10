# Belgique Numero De Registre National Input

BelgiqueNumeroDeRegistreNationalInput is a headless input for entering Belgium's Numéro de Registre National / Rijksregisternummer (NRN), Belgium's national-id identifier. It renders as `<input type="text">` with pattern validation, numeric/letter keyboard hints, and `autocomplete="off"` to protect sensitive identifiers. It is the editable companion to BelgiqueNumeroDeRegistreNationalView.

## Implementation Notes

- Renders as `<input type="text">` with pattern validation
- Format: 11 digits where the first 6 are the date of birth (YYMMDD), the next 3 are an ordering number (uneven for men, even for women) and the last 2 a check digit
- `autocomplete="off"` to protect sensitive identifiers
- Supports two-way binding on the `value` prop
- Companion to BelgiqueNumeroDeRegistreNationalView

## Props

- `label`: string (required) — accessible label via `aria-label`
- `value`: string (default: "") — bindable input value
- `required`: boolean (default: false) — form validation
- `disabled`: boolean (default: false) — disabled state
- `...restProps`: any — additional HTML attributes spread onto the `<input>`

## Usage

```html
<Field label="National Register Number" required>
  <BelgiqueNumeroDeRegistreNationalInput label="National Register Number" value={value} required />
  <Hint>11 digits where the first 6 are the date of birth (YYMMDD), the next 3 are an ordering number (uneven for men, even for women) and the last 2 a check digit</Hint>
  <ErrorMessage>Please enter a valid National Register Number</ErrorMessage>
</Field>
```

## ARIA

- `aria-label={label}` — provides accessible name

## When to Use

- Use in forms collecting Belgium's Numéro de Registre National / Rijksregisternummer (NRN).
- Use with pattern validation matching the documented format.
- Use in administrative or national-id workflows where the identifier is required.

## When Not to Use

- Do not use for displaying read-only identifiers — use `belgique-numero-de-registre-national-view` instead.
- Do not use for general text input — use `text-input` instead.
- Do not use for other countries' identifiers — use the corresponding country-specific input.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.belgique-numero-de-registre-national-input` class hook.

## Testing

- Verify renders an `<input>` with the correct class and `type="text"`
- Verify `aria-label` is set from the `label` prop
- Verify pattern attribute matches the documented format
- Verify `autocomplete="off"`
- Verify value binding works

## Domain Knowledge

The Numéro de Registre National / Rijksregisternummer (NRN) is Belgium's national-id identifier. Format: 11 digits where the first 6 are the date of birth (YYMMDD), the next 3 are an ordering number (uneven for men, even for women) and the last 2 a check digit.

## Related components

- `belgique-numero-de-registre-national-view` — a read-only display of Belgium's Numéro de Registre National / Rijksregisternummer (NRN)
- `text-input` — a single-line text input field <input type="text">

## References

- Wikipedia: https://en.wikipedia.org/wiki/National_identification_number#Belgium

---

Lily™ and Lily Design System™ are trademarks.
