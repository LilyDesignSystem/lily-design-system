# CostaRicaCedulaDeIdentidadInput

## Metadata

- Component: costa-rica-cedula-de-identidad-input
- PascalCase: CostaRicaCedulaDeIdentidadInput
- Description: an input for entering Costa Rica's Cédula de Identidad
- Purpose: Collects Costa Rica's Cédula de Identidad in one field, with autocomplete and spellcheck off so the number is neither saved by the browser nor sent to a spellchecker. Use it where staff or the person enter that number.
- Status: beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow
- HTML tag: <input>
- CSS class: .costa-rica-cedula-de-identidad-input
- Interactive: yes

## Key Behaviors

- Renders as `<input type="text">` with class `costa-rica-cedula-de-identidad-input`
- Format: A province digit, a volume (tomo) of up to four digits and an entry (asiento) of up to four digits, written P-TTTT-AAAA (1-0613-0584) and often stored as nine or ten digits with the leading zeroes padded. It has no check digit, so only the parts and their lengths can be checked.
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

- [x] Renders <input> element with class="costa-rica-cedula-de-identidad-input"
- [x] Has aria-label attribute
- [x] autocomplete="off"
- [ ] WCAG 2.2 AAA compliant — Svelte only verified so far; other 6 catalogs pending
- [x] Zero CSS — fully headless

## Known limitations

None known.

## References

- Documentation: index.md
- CSS class: .costa-rica-cedula-de-identidad-input in css-style-sheet-template.css
- Companion: CostaRicaCedulaDeIdentidadView
- [Cédula de identidad (Costa Rica)](<https://es.wikipedia.org/wiki/C%C3%A9dula_de_identidad_(Costa_Rica)>)
- [python-stdnum: stdnum.cr.cpf](https://arthurdejong.org/python-stdnum/doc/2.2/stdnum.cr.cpf)
