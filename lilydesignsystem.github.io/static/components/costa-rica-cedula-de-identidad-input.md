# Costa Rica Cedula De Identidad Input

CostaRicaCedulaDeIdentidadInput is a headless input for entering Costa Rica's Cédula de Identidad, Costa Rica's government-issued personal identifier. It renders as `<input type="text">` with `autocomplete="off"` to protect sensitive identifiers. It is the editable companion to CostaRicaCedulaDeIdentidadView.

**Status:** beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow.

## Implementation Notes

- Renders as `<input type="text">`
- Format: A province digit, a volume (tomo) of up to four digits and an entry (asiento) of up to four digits, written P-TTTT-AAAA (1-0613-0584) and often stored as nine or ten digits with the leading zeroes padded. It has no check digit, so only the parts and their lengths can be checked.
- `autocomplete="off"` to protect sensitive identifiers
- Supports two-way binding on the `value` prop
- Companion to CostaRicaCedulaDeIdentidadView

## Props

- `label`: string (required) — accessible label via `aria-label`
- `value`: string (default: "") — bindable input value
- `required`: boolean (default: false) — form validation
- `disabled`: boolean (default: false) — disabled state
- `...restProps`: any — additional HTML attributes spread onto the `<input>`

## Usage

```html
<Field
  label="Cédula de Identidad"
  required
>
  <CostaRicaCedulaDeIdentidadInput
    label="Cédula de Identidad"
    value="{value}"
    required
  />
  <Hint
    >A province digit, a volume (tomo) of up to four digits and an entry (asiento) of up to four
    digits, written P-TTTT-AAAA (1-0613-0584) and often stored as nine or ten digits with the
    leading zeroes padded. It has no check digit, so only the parts and their lengths can be
    checked.</Hint
  >
  <ErrorMessage>Please enter a valid Cédula de Identidad</ErrorMessage>
</Field>
```

## ARIA

- `aria-label={label}` — provides accessible name

## When to Use

- Use in forms collecting Costa Rica's Cédula de Identidad.
- Use in administrative or national-id workflows where the identifier is required.

## When Not to Use

- Do not use for displaying read-only identifiers — use `costa-rica-cedula-de-identidad-view` instead.
- Do not use for general text input — use `text-input` instead.
- Do not use for other countries' identifiers — use the corresponding country-specific input.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.costa-rica-cedula-de-identidad-input` class hook.

## Testing

- Verify renders an `<input>` with the correct class and `type="text"`
- Verify `aria-label` is set from the `label` prop
- Verify `autocomplete="off"`
- Verify value binding works

## Domain Knowledge

A province digit, a volume (tomo) of up to four digits and an entry (asiento) of up to four digits, written P-TTTT-AAAA (1-0613-0584) and often stored as nine or ten digits with the leading zeroes padded. It has no check digit, so only the parts and their lengths can be checked.

**Where to find it:** Printed on the cédula issued by the Tribunal Supremo de Elecciones, and used for tax, banking and health services.

## Security and privacy

A national identifier is personal data, and often a key to other records.

- The input renders `autocomplete="off"`, so the browser neither saves nor offers the value, and `spellcheck="false"`, so an enhanced spellchecker does not send it to a cloud service. `bin/check-identifier-inputs` keeps both in all nine catalogs.
- Do not log the value, put it in a URL or query string, or send it to analytics or an error tracker; mask it there if it must appear.
- The component stores nothing. Do not keep the value in `localStorage`, `sessionStorage` or a cookie; submit it in the body of a POST over HTTPS.
- A format or checksum check proves the number is well formed, not that it belongs to the person entering it.
- The page decides who may see it: the input does not mask what is typed. Use the matching `-view` to show it back, masked as the service requires.

## Related components

- `costa-rica-cedula-de-identidad-view` — a read-only display of Costa Rica's Cédula de Identidad
- `text-input` — a single-line text input field <input type="text">

## References

- [Cédula de identidad (Costa Rica)](<https://es.wikipedia.org/wiki/C%C3%A9dula_de_identidad_(Costa_Rica)>)
- [python-stdnum: stdnum.cr.cpf](https://arthurdejong.org/python-stdnum/doc/2.2/stdnum.cr.cpf)

---

Lily™ and Lily Design System™ are trademarks.
