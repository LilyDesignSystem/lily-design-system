# Peru Documento Nacional De Identidad Input

PeruDocumentoNacionalDeIdentidadInput is a headless input for entering Peru's Documento Nacional de Identidad (DNI), Peru's government-issued personal identifier. It renders as `<input type="text">` with `autocomplete="off"` to protect sensitive identifiers. It is the editable companion to PeruDocumentoNacionalDeIdentidadView.

**Status:** beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow.

## Implementation Notes

- Renders as `<input type="text">`
- Format: Eight digits, the Código Único de Identificación (CUI), often followed by a hyphen and a check character (10117410-2). The check character is a digit or a letter: multiply the eight digits by the weights 3, 2, 7, 6, 5, 4, 3, 2, sum them and take the remainder modulo 11, r; the digit is "65432110987"[r] and the letter "KJIHGFEDCBA"[r], and either is accepted.
- `autocomplete="off"` to protect sensitive identifiers
- Supports two-way binding on the `value` prop
- Companion to PeruDocumentoNacionalDeIdentidadView

## Props

- `label`: string (required) — accessible label via `aria-label`
- `value`: string (default: "") — bindable input value
- `required`: boolean (default: false) — form validation
- `disabled`: boolean (default: false) — disabled state
- `...restProps`: any — additional HTML attributes spread onto the `<input>`

## Usage

```html
<Field
  label="Documento Nacional de Identidad (DNI)"
  required
>
  <PeruDocumentoNacionalDeIdentidadInput
    label="Documento Nacional de Identidad (DNI)"
    value="{value}"
    required
  />
  <Hint
    >Eight digits, the Código Único de Identificación (CUI), often followed by a hyphen and a check
    character (10117410-2). The check character is a digit or a letter: multiply the eight digits by
    the weights 3, 2, 7, 6, 5, 4, 3, 2, sum them and take the remainder modulo 11, r; the digit is
    "65432110987"[r] and the letter "KJIHGFEDCBA"[r], and either is accepted.</Hint
  >
  <ErrorMessage>Please enter a valid Documento Nacional de Identidad (DNI)</ErrorMessage>
</Field>
```

## ARIA

- `aria-label={label}` — provides accessible name

## When to Use

- Use in forms collecting Peru's Documento Nacional de Identidad (DNI).
- Use in administrative or national-id workflows where the identifier is required.

## When Not to Use

- Do not use for displaying read-only identifiers — use `peru-documento-nacional-de-identidad-view` instead.
- Do not use for general text input — use `text-input` instead.
- Do not use for other countries' identifiers — use the corresponding country-specific input.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.peru-documento-nacional-de-identidad-input` class hook.

## Testing

- Verify renders an `<input>` with the correct class and `type="text"`
- Verify `aria-label` is set from the `label` prop
- Verify `autocomplete="off"`
- Verify value binding works

## Domain Knowledge

Eight digits, the Código Único de Identificación (CUI), often followed by a hyphen and a check character (10117410-2). The check character is a digit or a letter: multiply the eight digits by the weights 3, 2, 7, 6, 5, 4, 3, 2, sum them and take the remainder modulo 11, r; the digit is "65432110987"[r] and the letter "KJIHGFEDCBA"[r], and either is accepted.

**Where to find it:** Printed on the front of the DNI card issued by RENIEC, and asked for in almost every dealing with the state, a bank or a health service.

## Security and privacy

A national identifier is personal data, and often a key to other records.

- The input renders `autocomplete="off"`, so the browser neither saves nor offers the value, and `spellcheck="false"`, so an enhanced spellchecker does not send it to a cloud service. `bin/check-identifier-inputs` keeps both in all nine catalogs.
- Do not log the value, put it in a URL or query string, or send it to analytics or an error tracker; mask it there if it must appear.
- The component stores nothing. Do not keep the value in `localStorage`, `sessionStorage` or a cookie; submit it in the body of a POST over HTTPS.
- A format or checksum check proves the number is well formed, not that it belongs to the person entering it.
- The page decides who may see it: the input does not mask what is typed. Use the matching `-view` to show it back, masked as the service requires.

## Related components

- `peru-documento-nacional-de-identidad-view` — a read-only display of Peru's Documento Nacional de Identidad (DNI)
- `text-input` — a single-line text input field <input type="text">

## References

- [Documento Nacional de Identidad (Perú)](<https://es.wikipedia.org/wiki/Documento_Nacional_de_Identidad_(Per%C3%BA)>)
- [python-stdnum: stdnum.pe.cui](https://arthurdejong.org/python-stdnum/doc/2.2/stdnum.pe.cui)

---

Lily™ and Lily Design System™ are trademarks.
