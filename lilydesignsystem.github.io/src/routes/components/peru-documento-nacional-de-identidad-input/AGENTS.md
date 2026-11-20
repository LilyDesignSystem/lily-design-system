# PeruDocumentoNacionalDeIdentidadInput

## Metadata

- Component: peru-documento-nacional-de-identidad-input
- PascalCase: PeruDocumentoNacionalDeIdentidadInput
- Description: an input for entering Peru's Documento Nacional de Identidad (DNI)
- Status: beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow
- HTML tag: <input>
- CSS class: .peru-documento-nacional-de-identidad-input
- Interactive: yes

## Key Behaviors

- Renders as `<input type="text">` with class `peru-documento-nacional-de-identidad-input`
- Format: Eight digits, the Código Único de Identificación (CUI), often followed by a hyphen and a check character (10117410-2). The check character is a digit or a letter: multiply the eight digits by the weights 3, 2, 7, 6, 5, 4, 3, 2, sum them and take the remainder modulo 11, r; the digit is "65432110987"[r] and the letter "KJIHGFEDCBA"[r], and either is accepted.
- `autocomplete="off"` to protect sensitive identifiers
- Supports two-way binding

## ARIA

- `aria-label` provides accessible name from label prop
- `required` and `disabled` states conveyed to assistive technology

## Keyboard

- Standard text input keyboard behavior

## Props

- `label`: string (required) — accessible label via aria-label
- `value`: string (default: "") — bindable input value
- `required`: boolean (default: false) — form validation
- `disabled`: boolean (default: false) — disabled state
- `...restProps`: any additional HTML attributes spread onto the root

## Acceptance Criteria

- [x] Renders <input> element with class="peru-documento-nacional-de-identidad-input"
- [x] Has aria-label attribute
- [x] autocomplete="off"
- [ ] WCAG 2.2 AAA compliant — Svelte only verified so far; other 6 catalogs pending
- [x] Zero CSS — fully headless

## Known limitations

None known.

## References

- Documentation: index.md
- CSS class: .peru-documento-nacional-de-identidad-input in css-style-sheet-template.css
- Companion: PeruDocumentoNacionalDeIdentidadView
- [Documento Nacional de Identidad (Perú)](<https://es.wikipedia.org/wiki/Documento_Nacional_de_Identidad_(Per%C3%BA)>)
- [python-stdnum: stdnum.pe.cui](https://arthurdejong.org/python-stdnum/doc/2.2/stdnum.pe.cui)
