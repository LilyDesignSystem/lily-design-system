# Ecuador Cedula De Identidad Input

EcuadorCedulaDeIdentidadInput is a headless input for entering Ecuador's Cedula de Identidad Number, Ecuador's government-issued personal identifier. It renders as `<input type="text">` with `autocomplete="off"` to protect sensitive identifiers. It is the editable companion to EcuadorCedulaDeIdentidadView.

**Status:** beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow.

## Implementation Notes

- Renders as `<input type="text">`
- Format: Ten digits: a two-digit province code (01 to 24, or 30 for those born abroad), a third digit below 6 for a natural person, six more digits, and a check digit. The first nine digits are multiplied alternately by 2 and 1 (starting with 2), subtracting 9 from any product above 9, and the check digit brings the sum to the next multiple of 10.
- `autocomplete="off"` to protect sensitive identifiers
- Supports two-way binding on the `value` prop
- Companion to EcuadorCedulaDeIdentidadView

## Props

- `label`: string (required) — accessible label via `aria-label`
- `value`: string (default: "") — bindable input value
- `required`: boolean (default: false) — form validation
- `disabled`: boolean (default: false) — disabled state
- `...restProps`: any — additional HTML attributes spread onto the `<input>`

## Usage

```html
<Field
  label="Cedula de Identidad Number"
  required
>
  <EcuadorCedulaDeIdentidadInput
    label="Cedula de Identidad Number"
    value="{value}"
    required
  />
  <Hint
    >Ten digits: a two-digit province code (01 to 24, or 30 for those born abroad), a third digit
    below 6 for a natural person, six more digits, and a check digit. The first nine digits are
    multiplied alternately by 2 and 1 (starting with 2), subtracting 9 from any product above 9, and
    the check digit brings the sum to the next multiple of 10.</Hint
  >
  <ErrorMessage>Please enter a valid Cedula de Identidad Number</ErrorMessage>
</Field>
```

## ARIA

- `aria-label={label}` — provides accessible name

## When to Use

- Use in forms collecting Ecuador's Cedula de Identidad Number.
- Use in administrative or national-id workflows where the identifier is required.

## When Not to Use

- Do not use for displaying read-only identifiers — use `ecuador-cedula-de-identidad-view` instead.
- Do not use for general text input — use `text-input` instead.
- Do not use for other countries' identifiers — use the corresponding country-specific input.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.ecuador-cedula-de-identidad-input` class hook.

## Testing

- Verify renders an `<input>` with the correct class and `type="text"`
- Verify `aria-label` is set from the `label` prop
- Verify `autocomplete="off"`
- Verify value binding works

## Domain Knowledge

Ten digits: a two-digit province code (01 to 24, or 30 for those born abroad), a third digit below 6 for a natural person, six more digits, and a check digit. The first nine digits are multiplied alternately by 2 and 1 (starting with 2), subtracting 9 from any product above 9, and the check digit brings the sum to the next multiple of 10.

**Where to find it:** Printed on the Cédula de Identidad issued by the Registro Civil, and asked for by the IESS social-security institute, banks and government services.

## Related components

- `ecuador-cedula-de-identidad-view` — a read-only display of Ecuador's Cedula de Identidad Number
- `text-input` — a single-line text input field <input type="text">

## References

- Wikipedia: [Cédula de identidad](https://en.wikipedia.org/wiki/C%C3%A9dula_de_identidad)

---

Lily™ and Lily Design System™ are trademarks.
