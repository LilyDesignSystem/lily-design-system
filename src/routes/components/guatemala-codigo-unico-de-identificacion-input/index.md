# Guatemala Codigo Unico De Identificacion Input

GuatemalaCodigoUnicoDeIdentificacionInput is a headless input for entering Guatemala's Código Único de Identificación (CUI), Guatemala's government-issued personal identifier. It renders as `<input type="text">` with `autocomplete="off"` to protect sensitive identifiers. It is the editable companion to GuatemalaCodigoUnicoDeIdentificacionView.

**Status:** beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow.

## Implementation Notes

- Renders as `<input type="text">`
- Format: Thirteen digits, written 4-5-4 on the DPI card: eight assigned in sequence, one check digit, then two for the department and two for the municipality of birth (RENAP). RENAP does not publish the check-digit formula; open-source validators use weights 2 to 9 over the first eight digits, modulo 11, but that is not confirmed by the registry.
- `autocomplete="off"` to protect sensitive identifiers
- Supports two-way binding on the `value` prop
- Companion to GuatemalaCodigoUnicoDeIdentificacionView

## Props

- `label`: string (required) — accessible label via `aria-label`
- `value`: string (default: "") — bindable input value
- `required`: boolean (default: false) — form validation
- `disabled`: boolean (default: false) — disabled state
- `...restProps`: any — additional HTML attributes spread onto the `<input>`

## Usage

```html
<Field
  label="Código Único de Identificación (CUI)"
  required
>
  <GuatemalaCodigoUnicoDeIdentificacionInput
    label="Código Único de Identificación (CUI)"
    value="{value}"
    required
  />
  <Hint
    >Thirteen digits, written 4-5-4 on the DPI card: eight assigned in sequence, one check digit,
    then two for the department and two for the municipality of birth (RENAP). RENAP does not
    publish the check-digit formula; open-source validators use weights 2 to 9 over the first eight
    digits, modulo 11, but that is not confirmed by the registry.</Hint
  >
  <ErrorMessage>Please enter a valid Código Único de Identificación (CUI)</ErrorMessage>
</Field>
```

## ARIA

- `aria-label={label}` — provides accessible name

## When to Use

- Use in forms collecting Guatemala's Código Único de Identificación (CUI).
- Use in administrative or national-id workflows where the identifier is required.

## When Not to Use

- Do not use for displaying read-only identifiers — use `guatemala-codigo-unico-de-identificacion-view` instead.
- Do not use for general text input — use `text-input` instead.
- Do not use for other countries' identifiers — use the corresponding country-specific input.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.guatemala-codigo-unico-de-identificacion-input` class hook.

## Testing

- Verify renders an `<input>` with the correct class and `type="text"`
- Verify `aria-label` is set from the `label` prop
- Verify `autocomplete="off"`
- Verify value binding works

## Domain Knowledge

Thirteen digits, written 4-5-4 on the DPI card: eight assigned in sequence, one check digit, then two for the department and two for the municipality of birth (RENAP). RENAP does not publish the check-digit formula; open-source validators use weights 2 to 9 over the first eight digits, modulo 11, but that is not confirmed by the registry.

**Where to find it:** Printed on the front of the Documento Personal de Identificación (DPI) issued by RENAP, and given at birth registration.

## Related components

- `guatemala-codigo-unico-de-identificacion-view` — a read-only display of Guatemala's Código Único de Identificación (CUI)
- `text-input` — a single-line text input field <input type="text">

## References

- [RENAP: ¿Qué es el CUI?](https://www.renap.gob.gt/sites/default/files/boletines-publicaciones/inforenap_163_-_08042021_-_que_es_el_cui.pdf)
- [Documento Personal de Identificación](https://es.wikipedia.org/wiki/Documento_Personal_de_Identificaci%C3%B3n)

---

Lily™ and Lily Design System™ are trademarks.
