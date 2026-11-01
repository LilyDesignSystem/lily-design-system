# Colombia Cedula De Ciudadania Input

ColombiaCedulaDeCiudadaniaInput is a headless input for entering Colombia's Cedula de Ciudadania Number, Colombia's government-issued personal identifier. It renders as `<input type="text">` with `autocomplete="off"` to protect sensitive identifiers. It is the editable companion to ColombiaCedulaDeCiudadaniaView.

**Status:** beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow.

## Implementation Notes

- Renders as `<input type="text">`
- Format: Six to ten digits, usually written with dots as thousands separators (1.020.304.050). Newer cards carry the ten-digit Número Único de Identificación Personal (NUIP). There is no check digit.
- `autocomplete="off"` to protect sensitive identifiers
- Supports two-way binding on the `value` prop
- Companion to ColombiaCedulaDeCiudadaniaView

## Props

- `label`: string (required) — accessible label via `aria-label`
- `value`: string (default: "") — bindable input value
- `required`: boolean (default: false) — form validation
- `disabled`: boolean (default: false) — disabled state
- `...restProps`: any — additional HTML attributes spread onto the `<input>`

## Usage

```html
<Field
  label="Cedula de Ciudadania Number"
  required
>
  <ColombiaCedulaDeCiudadaniaInput
    label="Cedula de Ciudadania Number"
    value="{value}"
    required
  />
  <Hint
    >Six to ten digits, usually written with dots as thousands separators (1.020.304.050). Newer
    cards carry the ten-digit Número Único de Identificación Personal (NUIP). There is no check
    digit.</Hint
  >
  <ErrorMessage>Please enter a valid Cedula de Ciudadania Number</ErrorMessage>
</Field>
```

## ARIA

- `aria-label={label}` — provides accessible name

## When to Use

- Use in forms collecting Colombia's Cedula de Ciudadania Number.
- Use in administrative or national-id workflows where the identifier is required.

## When Not to Use

- Do not use for displaying read-only identifiers — use `colombia-cedula-de-ciudadania-view` instead.
- Do not use for general text input — use `text-input` instead.
- Do not use for other countries' identifiers — use the corresponding country-specific input.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.colombia-cedula-de-ciudadania-input` class hook.

## Testing

- Verify renders an `<input>` with the correct class and `type="text"`
- Verify `aria-label` is set from the `label` prop
- Verify `autocomplete="off"`
- Verify value binding works

## Domain Knowledge

Six to ten digits, usually written with dots as thousands separators (1.020.304.050). Newer cards carry the ten-digit Número Único de Identificación Personal (NUIP). There is no check digit.

**Where to find it:** Printed on the Cédula de Ciudadanía issued by the Registraduría Nacional del Estado Civil, and asked for by EPS health-insurance providers, banks and government services.

## Related components

- `colombia-cedula-de-ciudadania-view` — a read-only display of Colombia's Cedula de Ciudadania Number
- `text-input` — a single-line text input field <input type="text">

## References

- Wikipedia: [Colombian identity card](https://en.wikipedia.org/wiki/Colombian_identity_card)

---

Lily™ and Lily Design System™ are trademarks.
