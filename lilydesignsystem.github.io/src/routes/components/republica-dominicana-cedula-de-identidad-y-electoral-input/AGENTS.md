# RepublicaDominicanaCedulaDeIdentidadYElectoralInput

## Metadata

- Component: republica-dominicana-cedula-de-identidad-y-electoral-input
- PascalCase: RepublicaDominicanaCedulaDeIdentidadYElectoralInput
- Description: an input for entering the Dominican Republic's Cédula de Identidad y Electoral
- Status: beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow
- HTML tag: <input>
- CSS class: .republica-dominicana-cedula-de-identidad-y-electoral-input
- Interactive: yes

## Key Behaviors

- Renders as `<input type="text">` with class `republica-dominicana-cedula-de-identidad-y-electoral-input`
- Format: Eleven digits, usually written 3-7-1 (001-1391820-5): a three-digit issuing office, a seven-digit sequence and a check digit computed with the Luhn algorithm over all eleven digits. A few early numbers fail the check and are still valid, so treat a Luhn failure as a warning, not a rejection.
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

- [x] Renders <input> element with class="republica-dominicana-cedula-de-identidad-y-electoral-input"
- [x] Has aria-label attribute
- [x] autocomplete="off"
- [ ] WCAG 2.2 AAA compliant — Svelte only verified so far; other 6 catalogs pending
- [x] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .republica-dominicana-cedula-de-identidad-y-electoral-input in css-style-sheet-template.css
- Companion: RepublicaDominicanaCedulaDeIdentidadYElectoralView
- [Junta Central Electoral (República Dominicana)](<https://es.wikipedia.org/wiki/Junta_Central_Electoral_(Rep%C3%BAblica_Dominicana)>)
- [python-stdnum: stdnum.do.cedula](https://arthurdejong.org/python-stdnum/doc/2.2/stdnum.do.cedula)
