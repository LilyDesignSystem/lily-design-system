# Argentina Codigo Unico De Identificacion Laboral Input

ArgentinaCodigoUnicoDeIdentificacionLaboralInput is a headless input for entering Argentina's Código Único de Identificación Laboral (CUIL), Argentina's government-issued personal identifier. It renders as `<input type="text">` with `autocomplete="off"` to protect sensitive identifiers. It is the editable companion to ArgentinaCodigoUnicoDeIdentificacionLaboralView.

**Status:** beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow.

## Implementation Notes

- Renders as `<input type="text">`
- Format: Displayed as XX-NNNNNNNN-X: a two-digit prefix denoting registration type/sex (historically 20 male, 27 female, though this classification was discontinued in 2012), the eight-digit DNI (national identity document) number, and a Modulus-11 check digit computed over the ten preceding digits.
- `autocomplete="off"` to protect sensitive identifiers
- Supports two-way binding on the `value` prop
- Companion to ArgentinaCodigoUnicoDeIdentificacionLaboralView

## Props

- `label`: string (required) — accessible label via `aria-label`
- `value`: string (default: "") — bindable input value
- `required`: boolean (default: false) — form validation
- `disabled`: boolean (default: false) — disabled state
- `...restProps`: any — additional HTML attributes spread onto the `<input>`

## Usage

```html
<Field label="Código Único de Identificación Laboral (CUIL)" required>
  <ArgentinaCodigoUnicoDeIdentificacionLaboralInput label="Código Único de Identificación Laboral (CUIL)" value={value} required />
  <Hint>Displayed as XX-NNNNNNNN-X: a two-digit prefix denoting registration type/sex (historically 20 male, 27 female, though this classification was discontinued in 2012), the eight-digit DNI (national identity document) number, and a Modulus-11 check digit computed over the ten preceding digits.</Hint>
  <ErrorMessage>Please enter a valid Código Único de Identificación Laboral</ErrorMessage>
</Field>
```

## ARIA

- `aria-label={label}` — provides accessible name

## When to Use

- Use in forms collecting Argentina's Código Único de Identificación Laboral (CUIL).
- Use in administrative or national-id workflows where the identifier is required.

## When Not to Use

- Do not use for displaying read-only identifiers — use `argentina-codigo-unico-de-identificacion-laboral-view` instead.
- Do not use for general text input — use `text-input` instead.
- Do not use for other countries' identifiers — use the corresponding country-specific input.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.argentina-codigo-unico-de-identificacion-laboral-input` class hook.

## Testing

- Verify renders an `<input>` with the correct class and `type="text"`
- Verify `aria-label` is set from the `label` prop
- Verify `autocomplete="off"`
- Verify value binding works

## Domain Knowledge

Displayed as XX-NNNNNNNN-X: a two-digit prefix denoting registration type/sex (historically 20 male, 27 female, though this classification was discontinued in 2012), the eight-digit DNI (national identity document) number, and a Modulus-11 check digit computed over the ten preceding digits.

**Where to find it:** Printed on the CUIL confirmation letter issued by ANSES, and required to register with an obra social (health-insurance fund) and for all employment and pension records.

## Related components

- `argentina-codigo-unico-de-identificacion-laboral-view` — a read-only display of Argentina's Código Único de Identificación Laboral (CUIL)
- `text-input` — a single-line text input field <input type="text">

## References

- Wikipedia: [Código Único de Identificación Laboral](https://en.wikipedia.org/wiki/C%C3%B3digo_%C3%9Anico_de_Identificaci%C3%B3n_Laboral)

---

Lily™ and Lily Design System™ are trademarks.
