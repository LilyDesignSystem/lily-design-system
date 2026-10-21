# Mexico Clave Unica De Registro De Poblacion Input

MexicoClaveUnicaDeRegistroDePoblacionInput is a headless input for entering Mexico's Clave Única de Registro de Población (CURP), Mexico's government-issued personal identifier. It renders as `<input type="text">` with `autocomplete="off"` to protect sensitive identifiers. It is the editable companion to MexicoClaveUnicaDeRegistroDePoblacionView.

**Status:** beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow.

## Implementation Notes

- Renders as `<input type="text">`
- Format: Eighteen-character alphanumeric code built from name, date of birth, sex, and state of birth: first letter of the first surname plus its first internal vowel; first letter of the second surname (or X if none); first letter of the given name; six-digit date of birth (YYMMDD); H or M for sex (X for non-binary); a two-letter state code (NE for those born abroad); a consonant from each surname and the given name; then two further disambiguating characters. No trailing check digit.
- `autocomplete="off"` to protect sensitive identifiers
- Supports two-way binding on the `value` prop
- Companion to MexicoClaveUnicaDeRegistroDePoblacionView

## Props

- `label`: string (required) — accessible label via `aria-label`
- `value`: string (default: "") — bindable input value
- `required`: boolean (default: false) — form validation
- `disabled`: boolean (default: false) — disabled state
- `...restProps`: any — additional HTML attributes spread onto the `<input>`

## Usage

```html
<Field label="Clave Única de Registro de Población (CURP)" required>
  <MexicoClaveUnicaDeRegistroDePoblacionInput label="Clave Única de Registro de Población (CURP)" value={value} required />
  <Hint>Eighteen-character alphanumeric code built from name, date of birth, sex, and state of birth: first letter of the first surname plus its first internal vowel; first letter of the second surname (or X if none); first letter of the given name; six-digit date of birth (YYMMDD); H or M for sex (X for non-binary); a two-letter state code (NE for those born abroad); a consonant from each surname and the given name; then two further disambiguating characters. No trailing check digit.</Hint>
  <ErrorMessage>Please enter a valid Clave Única de Registro de Población</ErrorMessage>
</Field>
```

## ARIA

- `aria-label={label}` — provides accessible name

## When to Use

- Use in forms collecting Mexico's Clave Única de Registro de Población (CURP).
- Use in administrative or national-id workflows where the identifier is required.

## When Not to Use

- Do not use for displaying read-only identifiers — use `mexico-clave-unica-de-registro-de-poblacion-view` instead.
- Do not use for general text input — use `text-input` instead.
- Do not use for other countries' identifiers — use the corresponding country-specific input.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.mexico-clave-unica-de-registro-de-poblacion-input` class hook.

## Testing

- Verify renders an `<input>` with the correct class and `type="text"`
- Verify `aria-label` is set from the `label` prop
- Verify `autocomplete="off"`
- Verify value binding works

## Domain Knowledge

Eighteen-character alphanumeric code built from name, date of birth, sex, and state of birth: first letter of the first surname plus its first internal vowel; first letter of the second surname (or X if none); first letter of the given name; six-digit date of birth (YYMMDD); H or M for sex (X for non-binary); a two-letter state code (NE for those born abroad); a consonant from each surname and the given name; then two further disambiguating characters. No trailing check digit.

**Where to find it:** Printed on the CURP certificate issued by RENAPO, and on Mexican identity documents including the INE voter card and (for minors) birth certificates.

## Related components

- `mexico-clave-unica-de-registro-de-poblacion-view` — a read-only display of Mexico's Clave Única de Registro de Población (CURP)
- `text-input` — a single-line text input field <input type="text">

## References

- Wikipedia: [Unique Population Registry Code](https://en.wikipedia.org/wiki/Unique_Population_Registry_Code)

---

Lily™ and Lily Design System™ are trademarks.
