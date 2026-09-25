# Chile Rol Unico Nacional Input

ChileRolUnicoNacionalInput is a headless input for entering Chile's Rol Único Nacional (RUN), Chile's government-issued personal identifier. It renders as `<input type="text">` with `autocomplete="off"` to protect sensitive identifiers. It is the editable companion to ChileRolUnicoNacionalView.

**Status:** beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow.

## Implementation Notes

- Renders as `<input type="text">`
- Format: Seven or eight digits plus a trailing check character. The check character is computed with a Modulus-11 algorithm: each body digit, read right to left, is multiplied by a repeating weight sequence 2,3,4,5,6,7; the products are summed; the check value is 11 minus the sum's Modulus-11 remainder, where a result of 11 maps to 0 and a result of 10 maps to the letter K.
- `autocomplete="off"` to protect sensitive identifiers
- Supports two-way binding on the `value` prop
- Companion to ChileRolUnicoNacionalView

## Props

- `label`: string (required) — accessible label via `aria-label`
- `value`: string (default: "") — bindable input value
- `required`: boolean (default: false) — form validation
- `disabled`: boolean (default: false) — disabled state
- `...restProps`: any — additional HTML attributes spread onto the `<input>`

## Usage

```html
<Field label="Rol Único Nacional (RUN)" required>
  <ChileRolUnicoNacionalInput label="Rol Único Nacional (RUN)" value={value} required />
  <Hint>Seven or eight digits plus a trailing check character. The check character is computed with a Modulus-11 algorithm: each body digit, read right to left, is multiplied by a repeating weight sequence 2,3,4,5,6,7; the products are summed; the check value is 11 minus the sum's Modulus-11 remainder, where a result of 11 maps to 0 and a result of 10 maps to the letter K.</Hint>
  <ErrorMessage>Please enter a valid Rol Único Nacional</ErrorMessage>
</Field>
```

## ARIA

- `aria-label={label}` — provides accessible name

## When to Use

- Use in forms collecting Chile's Rol Único Nacional (RUN).
- Use in administrative or national-id workflows where the identifier is required.

## When Not to Use

- Do not use for displaying read-only identifiers — use `chile-rol-unico-nacional-view` instead.
- Do not use for general text input — use `text-input` instead.
- Do not use for other countries' identifiers — use the corresponding country-specific input.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.chile-rol-unico-nacional-input` class hook.

## Testing

- Verify renders an `<input>` with the correct class and `type="text"`
- Verify `aria-label` is set from the `label` prop
- Verify `autocomplete="off"`
- Verify value binding works

## Domain Knowledge

Seven or eight digits plus a trailing check character. The check character is computed with a Modulus-11 algorithm: each body digit, read right to left, is multiplied by a repeating weight sequence 2,3,4,5,6,7; the products are summed; the check value is 11 minus the sum's Modulus-11 remainder, where a result of 11 maps to 0 and a result of 10 maps to the letter K.

**Where to find it:** Printed on the Cédula de Identidad national ID card and required to register with FONASA (Fondo Nacional de Salud), Chile's public health-insurance fund, or a private Isapre.

## Related components

- `chile-rol-unico-nacional-view` — a read-only display of Chile's Rol Único Nacional (RUN)
- `text-input` — a single-line text input field <input type="text">

## References

- Wikipedia: [RUT](https://en.wikipedia.org/wiki/RUT)

---

Lily™ and Lily Design System™ are trademarks.
