# Uruguay Cedula De Identidad Input

UruguayCedulaDeIdentidadInput is a headless input for entering Uruguay's Cedula de Identidad Number, Uruguay's government-issued personal identifier. It renders as `<input type="text">` with `autocomplete="off"` to protect sensitive identifiers. It is the editable companion to UruguayCedulaDeIdentidadView.

**Status:** beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow.

## Implementation Notes

- Renders as `<input type="text">`
- Format: Six or seven digits plus a trailing check digit, written 1.234.567-2. The body is left-padded with zeros to seven digits, multiplied by the weights 2,9,8,7,6,3,4 and summed, and the check digit is the amount that brings the sum to the next multiple of 10 (0 when it already is one).
- `autocomplete="off"` to protect sensitive identifiers
- Supports two-way binding on the `value` prop
- Companion to UruguayCedulaDeIdentidadView

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
  <UruguayCedulaDeIdentidadInput
    label="Cedula de Identidad Number"
    value="{value}"
    required
  />
  <Hint
    >Six or seven digits plus a trailing check digit, written 1.234.567-2. The body is left-padded
    with zeros to seven digits, multiplied by the weights 2,9,8,7,6,3,4 and summed, and the check
    digit is the amount that brings the sum to the next multiple of 10 (0 when it already is
    one).</Hint
  >
  <ErrorMessage>Please enter a valid Cedula de Identidad Number</ErrorMessage>
</Field>
```

## ARIA

- `aria-label={label}` — provides accessible name

## When to Use

- Use in forms collecting Uruguay's Cedula de Identidad Number.
- Use in administrative or national-id workflows where the identifier is required.

## When Not to Use

- Do not use for displaying read-only identifiers — use `uruguay-cedula-de-identidad-view` instead.
- Do not use for general text input — use `text-input` instead.
- Do not use for other countries' identifiers — use the corresponding country-specific input.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.uruguay-cedula-de-identidad-input` class hook.

## Testing

- Verify renders an `<input>` with the correct class and `type="text"`
- Verify `aria-label` is set from the `label` prop
- Verify `autocomplete="off"`
- Verify value binding works

## Domain Knowledge

Six or seven digits plus a trailing check digit, written 1.234.567-2. The body is left-padded with zeros to seven digits, multiplied by the weights 2,9,8,7,6,3,4 and summed, and the check digit is the amount that brings the sum to the next multiple of 10 (0 when it already is one).

**Where to find it:** Printed on the Cédula de Identidad issued by the Dirección Nacional de Identificación Civil, and asked for by health providers (ASSE and mutualistas), banks and government services.

## Related components

- `uruguay-cedula-de-identidad-view` — a read-only display of Uruguay's Cedula de Identidad Number
- `text-input` — a single-line text input field <input type="text">

## References

- Wikipedia: [Cédula de identidad](https://en.wikipedia.org/wiki/C%C3%A9dula_de_identidad)

---

Lily™ and Lily Design System™ are trademarks.
