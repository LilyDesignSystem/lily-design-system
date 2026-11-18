# GuatemalaCodigoUnicoDeIdentificacionInput

## Metadata

- Component: guatemala-codigo-unico-de-identificacion-input
- PascalCase: GuatemalaCodigoUnicoDeIdentificacionInput
- Description: an input for entering Guatemala's Código Único de Identificación (CUI)
- Status: beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow
- HTML tag: <input>
- CSS class: .guatemala-codigo-unico-de-identificacion-input
- Interactive: yes

## Key Behaviors

- Renders as `<input type="text">` with class `guatemala-codigo-unico-de-identificacion-input`
- Format: Thirteen digits, written 4-5-4 on the DPI card: eight assigned in sequence, one check digit, then two for the department and two for the municipality of birth (RENAP). RENAP does not publish the check-digit formula; open-source validators use weights 2 to 9 over the first eight digits, modulo 11, but that is not confirmed by the registry.
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

- [x] Renders <input> element with class="guatemala-codigo-unico-de-identificacion-input"
- [x] Has aria-label attribute
- [x] autocomplete="off"
- [ ] WCAG 2.2 AAA compliant — Svelte only verified so far; other 6 catalogs pending
- [x] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .guatemala-codigo-unico-de-identificacion-input in css-style-sheet-template.css
- Companion: GuatemalaCodigoUnicoDeIdentificacionView
- [RENAP: ¿Qué es el CUI?](https://www.renap.gob.gt/sites/default/files/boletines-publicaciones/inforenap_163_-_08042021_-_que_es_el_cui.pdf)
- [Documento Personal de Identificación](https://es.wikipedia.org/wiki/Documento_Personal_de_Identificaci%C3%B3n)
